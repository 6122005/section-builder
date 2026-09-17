/**
 * Replaces the text of one node and returns a new tree. Nothing is mutated,
 * and untouched branches keep the same object so React skips re-rendering them.
 */
export function updateNodeText(node, nodeId, text) {
  if (node.id === nodeId) return { ...node, props: { ...node.props, text } };

  const children = node.children || [];
  if (children.length === 0) return node;

  let changed = false;
  const next = children.map((child) => {
    const updated = updateNodeText(child, nodeId, text);
    if (updated !== child) changed = true;
    return updated;
  });

  return changed ? { ...node, children: next } : node;
}
