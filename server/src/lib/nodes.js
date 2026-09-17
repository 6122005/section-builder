// Ids are generated per tree so the same prompt always gives the same ids.
export function createIdFactory(prefix) {
  let seq = 0;
  return (name) => `${prefix}-${name}-${(seq += 1)}`;
}

export function node(id, type, props = {}, children = []) {
  return { id, type, props, children };
}

export function textNode(id, type, text, props = {}) {
  return node(id, type, { ...props, text }, []);
}
