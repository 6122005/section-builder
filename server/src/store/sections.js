// Mock database. Only this file knows how a section is stored, so swapping it
// for a real DB later does not touch anything else.
const sections = new Map();
let seq = 0;

export const store = {
  create(tree, meta) {
    const record = { id: `section_${(seq += 1)}`, tree, meta, version: 1, updatedAt: new Date().toISOString() };
    sections.set(record.id, record);
    return record;
  },

  get(id) {
    return sections.get(id) || null;
  },

  update(id, tree) {
    const existing = sections.get(id);
    if (!existing) return null;

    const record = { ...existing, tree, version: existing.version + 1, updatedAt: new Date().toISOString() };
    sections.set(record.id, record);
    return record;
  },

  reset() {
    sections.clear();
    seq = 0;
  },
};
