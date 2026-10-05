// Reads CSV text into rows of cells. Handles quoted cells ("Dela Cruz, Juan"),
// doubled quotes inside them, and Windows or Unix line endings.
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  const input = text.replace(/^\uFEFF/, ""); // Excel adds a byte-order mark

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (quoted) {
      if (ch === '"' && input[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') {
        quoted = false;
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && input[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += ch;
    }
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim()));
}

// Turns a CSV of people into allowlist entries. Columns can be named (any
// header containing "id", "name" and "role") or, without a header row, be
// in the order ID, full name, role. Role defaults to student.
export function csvToEntries(text) {
  const rows = parseCsv(text);
  if (rows.length === 0) return [];

  const header = rows[0].map((c) => c.trim().toLowerCase());
  const find = (pattern) => header.findIndex((h) => pattern.test(h));
  const hasHeader = find(/name/) !== -1 && find(/\bid\b|id$|number|no\.?$/) !== -1;

  const col = hasHeader
    ? { id: find(/\bid\b|id$|number|no\.?$/), name: find(/name/), role: find(/role|type|position/) }
    : { id: 0, name: 1, role: 2 };

  return rows.slice(hasHeader ? 1 : 0).map((r) => ({
    schoolId: (r[col.id] || "").trim(),
    fullName: (r[col.name] || "").trim(),
    role: (col.role >= 0 && r[col.role] ? r[col.role] : "student").trim().toLowerCase(),
  }));
}
