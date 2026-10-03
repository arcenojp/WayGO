import { CAMPUSES } from "./campuses";

function buildIndex() {
  const index = [];

  Object.entries(CAMPUSES).forEach(([campusId, campus]) => {
    index.push({
      kind: "campus",
      label: campus.name,
      sublabel: campus.tagline,
      path: `/campus/${campusId}`,
    });

    if (campus.type === "single") {
      campus.floors.forEach((floor) => {
        floor.rooms.forEach((room) => {
          index.push({
            kind: "room",
            label: room.name,
            sublabel: `${campus.name} \u00B7 ${floor.label}`,
            path: `/campus/${campusId}`,
            state: { floorId: floor.id, roomName: room.name },
          });
        });
      });
    } else {
      Object.entries(campus.buildings).forEach(([buildingId, building]) => {
        index.push({
          kind: "building",
          label: building.name,
          sublabel: campus.name,
          path: `/campus/${campusId}/building/${buildingId}`,
        });
        (building.floors || []).forEach((floor) => {
          floor.rooms.forEach((room) => {
            index.push({
              kind: "room",
              label: room.name,
              sublabel: `${building.name} \u00B7 ${floor.label} \u00B7 ${campus.name}`,
              path: `/campus/${campusId}/building/${buildingId}`,
              state: { floorId: floor.id, roomName: room.name },
            });
          });
        });
      });
    }
  });

  return index;
}

// Built once; the campus data is static.
export const SEARCH_INDEX = buildIndex();

/*
  Search compares normalized text (lowercase, no spaces or punctuation),
  so "cb 12", "cb12" and "CB-12" all match CB-12. Results are ranked:

    100  exact match
     90  starts with the query
     70  contains the query
     60  every query word starts a word in the name ("it lab")
     50  within one typo (queries of 3+ characters)
     30  query letters appear in order ("mchshop")

  Name matches rank above building/campus-name matches, and on ties rooms
  come before buildings, then campuses.
*/
const normalize = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
const words = (s) => (s || "").toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);

const KIND_RANK = { room: 0, building: 1, campus: 2 };

// Precomputed once, alongside the index.
const PREPARED = SEARCH_INDEX.map((entry) => ({
  entry,
  label: normalize(entry.label),
  labelWords: words(entry.label),
  sub: normalize(entry.sublabel),
  subWords: words(entry.sublabel),
}));

// Is `a` within one edit (insert, delete or substitute) of `b`?
function withinOneEdit(a, b) {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (a.length < b.length) j++;
    else {
      i++;
      j++;
    }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

// Does any stretch of `text` about as long as `q` sit within one typo of it?
function fuzzyContains(text, q) {
  for (const len of [q.length, q.length - 1, q.length + 1]) {
    if (len < 1) continue;
    for (let start = 0; start + len <= text.length; start++) {
      if (withinOneEdit(q, text.slice(start, start + len))) return true;
    }
  }
  return false;
}

// Are all of q's letters present in `text`, in order (gaps allowed)?
function isSubsequence(q, text) {
  let i = 0;
  for (let j = 0; j < text.length && i < q.length; j++) {
    if (text[j] === q[i]) i++;
  }
  return i === q.length;
}

function scoreText(text, textWords, q, qWords) {
  if (!text) return 0;
  if (text === q) return 100;
  if (text.startsWith(q)) return 90;
  if (text.includes(q)) return 70;
  // Word-start matching keeps "cb 12" from matching "RM-312 CBA ...".
  if (qWords.length > 1 && qWords.every((w) => textWords.some((t) => t.startsWith(w)))) return 60;
  if (q.length >= 3 && fuzzyContains(text, q)) return 50;
  if (q.length >= 3 && isSubsequence(q, text)) return 30;
  return 0;
}

export function search(query, limit = 8) {
  const q = normalize(query);
  if (!q) return [];
  const qWords = words(query);

  return PREPARED.map(({ entry, label, labelWords, sub, subWords }) => {
    const labelScore = scoreText(label, labelWords, q, qWords);
    // Sublabel (building/campus) matches only count when strong, and rank
    // below name matches.
    const subScore = scoreText(sub, subWords, q, qWords);
    const score = Math.max(labelScore, subScore >= 60 ? subScore - 40 : 0);
    return { entry, score, label };
  })
    .filter((r) => r.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        KIND_RANK[a.entry.kind] - KIND_RANK[b.entry.kind] ||
        a.label.length - b.label.length
    )
    .slice(0, limit)
    .map((r) => r.entry);
}
