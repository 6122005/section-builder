import { nodeComponents } from './nodes.jsx';

/**
 * Walks the JSON tree and draws it. Children are rendered here and handed down
 * as `children`, so the recursion stays in one place and no node component
 * imports this file back.
 */
export default function NodeRenderer({ node, onTextChange }) {
  const Component = nodeComponents[node.type];

  // An unknown type should not blank the page.
  if (!Component) return <div className="s-unknown">Unsupported node type: {String(node.type)}</div>;

  const children = (node.children || []).map((child) => (
    <NodeRenderer key={child.id} node={child} onTextChange={onTextChange} />
  ));

  return (
    <Component node={node} onTextChange={onTextChange}>
      {children}
    </Component>
  );
}
