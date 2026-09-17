import { NODE_TYPES, LIMITS } from '../config.js';

const allowed = new Set(NODE_TYPES);
const isObject = (v) => typeof v === 'object' && v !== null && !Array.isArray(v);

// The client can send anything back on save, so check the tree before storing it.
// Collects every problem instead of stopping at the first one.
export function validateTree(root) {
  const errors = [];
  const ids = new Set();
  let count = 0;

  function walk(current, path, depth) {
    if (!isObject(current)) return errors.push(`${path}: node must be an object`);
    if ((count += 1) > LIMITS.maxNodes) return errors.push(`tree has more than ${LIMITS.maxNodes} nodes`);
    if (depth > LIMITS.maxDepth) return errors.push(`${path}: nested deeper than ${LIMITS.maxDepth} levels`);

    if (typeof current.id !== 'string' || !current.id) errors.push(`${path}: missing id`);
    else if (ids.has(current.id)) errors.push(`${path}: duplicate id "${current.id}"`);
    else ids.add(current.id);

    if (!allowed.has(current.type)) errors.push(`${path}: unknown type "${current.type}"`);

    const text = current.props?.text;
    if (text !== undefined && typeof text !== 'string') errors.push(`${path}: text must be a string`);
    else if (typeof text === 'string' && text.length > LIMITS.maxText) errors.push(`${path}: text too long`);

    const children = current.children ?? [];
    if (!Array.isArray(children)) return errors.push(`${path}: children must be an array`);
    children.forEach((child, i) => walk(child, `${path}.children[${i}]`, depth + 1));
  }

  walk(root, 'root', 1);
  return { valid: errors.length === 0, errors };
}
