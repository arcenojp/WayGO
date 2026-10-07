import { Router } from "express";
import { HttpError, badRequest, normalizeSchoolId } from "../http.js";
import { endAllSessions } from "../sessions.js";

const ROLES = ["student", "faculty", "staff"];
const STATUSES = ["pending", "approved", "blocked"];
const IMPORT_MAX = 5000;

function toEntry(row) {
  return {
    id: row.id,
    schoolId: row.school_id,
    fullName: row.full_name,
    role: row.role,
    status: row.status,
    registered: row.user_id != null,
    email: row.email ?? null,
    createdAt: row.created_at,
  };
}

const ENTRY_SELECT = `
  SELECT a.*, u.id AS user_id, u.email
    FROM allowlist a
    LEFT JOIN users u ON u.allowlist_id = a.id`;

// Validates one allowlist row from a request; returns a message on error.
function readEntry(input, { partial = false } = {}) {
  const out = {};
  const str = (v) => (typeof v === "string" ? v.trim() : "");
  if (!partial || input.schoolId !== undefined) {
    out.schoolId = normalizeSchoolId(str(input.schoolId));
    if (!out.schoolId) return { error: "Student or employee ID is required." };
    if (out.schoolId.length > 50) return { error: "Student or employee ID is too long." };
  }
  if (!partial || input.fullName !== undefined) {
    out.fullName = str(input.fullName).replace(/\s+/g, " ");
    if (!out.fullName) return { error: "Full name is required." };
    if (out.fullName.length > 200) return { error: "Full name is too long." };
  }
  if (!partial || input.role !== undefined) {
    out.role = str(input.role || "student").toLowerCase();
    if (!ROLES.includes(out.role)) return { error: `Role must be ${ROLES.join(", ")}.` };
  }
  if (input.status !== undefined || !partial) {
    out.status = str(input.status || "approved").toLowerCase();
    if (!STATUSES.includes(out.status)) return { error: `Status must be ${STATUSES.join(", ")}.` };
  }
  return { value: out };
}

export function requireAdmin(req, res, next) {
  if (!req.user) throw new HttpError(401, "Log in first.");
  if (req.user.role !== "admin") throw new HttpError(403, "Only admins can do this.");
  next();
}

export function adminRouter({ db }) {
  const router = Router();
  router.use(requireAdmin);

  const entryId = (req) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) throw new HttpError(404, "Not found");
    return id;
  };

  // List and search the allowlist: ?q=name or ID, ?status=, ?limit=, ?offset=
  router.get("/allowlist", async (req, res) => {
    const where = [];
    const params = [];
    if (req.query.q) {
      params.push(`%${String(req.query.q).trim()}%`);
      where.push(`(a.school_id ILIKE $${params.length} OR a.full_name ILIKE $${params.length})`);
    }
    if (req.query.status) {
      if (!STATUSES.includes(req.query.status)) throw badRequest(`Status must be ${STATUSES.join(", ")}.`);
      params.push(req.query.status);
      where.push(`a.status = $${params.length}`);
    }
    const filter = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 500);
    const offset = Math.max(Number(req.query.offset) || 0, 0);

    const total = await db.query(`SELECT count(*)::int AS n FROM allowlist a ${filter}`, params);
    const { rows } = await db.query(
      `${ENTRY_SELECT} ${filter} ORDER BY a.full_name LIMIT ${limit} OFFSET ${offset}`,
      params
    );
    res.json({ entries: rows.map(toEntry), total: total.rows[0].n });
  });

  // Counts for the dashboard.
  router.get("/stats", async (req, res) => {
    const { rows } = await db.query(`
      SELECT count(*)::int AS total,
             count(u.id)::int AS registered,
             count(*) FILTER (WHERE a.status = 'pending')::int AS pending,
             count(*) FILTER (WHERE a.status = 'blocked')::int AS blocked
        FROM allowlist a LEFT JOIN users u ON u.allowlist_id = a.id`);
    res.json(rows[0]);
  });

  router.post("/allowlist", async (req, res) => {
    const { value, error } = readEntry(req.body || {});
    if (error) throw badRequest(error);
    try {
      const { rows } = await db.query(
        `INSERT INTO allowlist (school_id, full_name, role, status) VALUES ($1, $2, $3, $4) RETURNING *`,
        [value.schoolId, value.fullName, value.role, value.status]
      );
      res.status(201).json({ entry: toEntry(rows[0]) });
    } catch (err) {
      if (err.code === "23505") throw new HttpError(409, "That ID is already on the allowlist.");
      throw err;
    }
  });

  // Bulk add, e.g. from the registrar's CSV (parsed by the admin page):
  // { entries: [{ schoolId, fullName, role }], status? }. IDs already on the
  // list are skipped, not changed.
  router.post("/allowlist/import", async (req, res) => {
    const list = req.body?.entries;
    if (!Array.isArray(list) || list.length === 0) throw badRequest("Send at least one entry.");
    if (list.length > IMPORT_MAX) throw badRequest(`Import at most ${IMPORT_MAX} entries at a time.`);

    let added = 0;
    let skipped = 0;
    const errors = [];
    for (const [i, item] of list.entries()) {
      const { value, error } = readEntry({ ...item, status: item?.status ?? req.body.status });
      if (error) {
        errors.push({ row: i + 1, message: error });
        continue;
      }
      const result = await db.query(
        `INSERT INTO allowlist (school_id, full_name, role, status) VALUES ($1, $2, $3, $4)
         ON CONFLICT (school_id) DO NOTHING`,
        [value.schoolId, value.fullName, value.role, value.status]
      );
      if (result.rowCount === 1) added++;
      else skipped++;
    }
    res.json({ added, skipped, errors });
  });

  // Change name, role or status. Blocking signs the person out immediately.
  router.patch("/allowlist/:id", async (req, res) => {
    const id = entryId(req);
    const { value, error } = readEntry(req.body || {}, { partial: true });
    if (error) throw badRequest(error);
    delete value.schoolId; // IDs don't change; remove and re-add instead
    const fields = Object.keys(value);
    if (fields.length === 0) throw badRequest("Nothing to change.");

    const columns = { fullName: "full_name", role: "role", status: "status" };
    const sets = fields.map((f, i) => `${columns[f]} = $${i + 2}`);
    const { rowCount } = await db.query(
      `UPDATE allowlist SET ${sets.join(", ")}, updated_at = now() WHERE id = $1`,
      [id, ...fields.map((f) => value[f])]
    );
    if (rowCount === 0) throw new HttpError(404, "Not found");

    const { rows } = await db.query(`${ENTRY_SELECT} WHERE a.id = $1`, [id]);
    const entry = rows[0];
    if (entry.status !== "approved" && entry.user_id) await endAllSessions(db, entry.user_id);
    res.json({ entry: toEntry(entry) });
  });

  // Deletes the person's account (not their allowlist entry) so they can
  // register again, e.g. after losing access to their email.
  router.post("/allowlist/:id/reset-registration", async (req, res) => {
    const id = entryId(req);
    const exists = await db.query("SELECT 1 FROM allowlist WHERE id = $1", [id]);
    if (exists.rowCount === 0) throw new HttpError(404, "Not found");
    await db.query("DELETE FROM users WHERE allowlist_id = $1", [id]);
    res.status(204).end();
  });

  // Removes the person from the allowlist along with their account.
  router.delete("/allowlist/:id", async (req, res) => {
    const id = entryId(req);
    const { rowCount } = await db.query("DELETE FROM allowlist WHERE id = $1", [id]);
    if (rowCount === 0) throw new HttpError(404, "Not found");
    res.status(204).end();
  });

  return router;
}
