import EditableText from './EditableText.jsx';

// One component per node type. Layout nodes get their already rendered subtree
// as children, so none of them needs to know about the renderer.

const Section = ({ children }) => <section className="s-section">{children}</section>;

const Container = ({ node, children }) => {
  const { layout = 'grid', columns = 3 } = node.props;
  return (
    <div
      className={`s-container s-container--${layout}`}
      style={layout === 'grid' ? { '--columns': columns } : undefined}
    >
      {children}
    </div>
  );
};

const Card = ({ node, children }) => (
  <article className={`s-card${node.props.highlighted ? ' s-card--highlighted' : ''}`}>{children}</article>
);

const List = ({ children }) => <ul className="s-list">{children}</ul>;

const Heading = ({ node, onTextChange }) => {
  const level = Math.min(Math.max(node.props.level || 2, 1), 6);
  return (
    <EditableText
      nodeId={node.id}
      text={node.props.text}
      onTextChange={onTextChange}
      as={`h${level}`}
      className={`s-heading s-heading--${level}`}
    />
  );
};

const Text = ({ node, onTextChange }) => (
  <EditableText
    nodeId={node.id}
    text={node.props.text}
    onTextChange={onTextChange}
    as="p"
    className={`s-text${node.props.tone ? ` s-text--${node.props.tone}` : ''}`}
  />
);

const Price = ({ node, onTextChange }) => (
  <p className="s-price">
    <EditableText nodeId={node.id} text={node.props.text} onTextChange={onTextChange} className="s-price__amount" />
    <span className="s-price__period">{node.props.period}</span>
  </p>
);

const Badge = ({ node, onTextChange }) => (
  <EditableText nodeId={node.id} text={node.props.text} onTextChange={onTextChange} className="s-badge" />
);

const ListItem = ({ node, onTextChange }) => (
  <li className="s-list__item">
    <EditableText nodeId={node.id} text={node.props.text} onTextChange={onTextChange} />
  </li>
);

const Button = ({ node, onTextChange }) => (
  <EditableText
    nodeId={node.id}
    text={node.props.text}
    onTextChange={onTextChange}
    className={`s-button s-button--${node.props.variant === 'primary' ? 'primary' : 'secondary'}`}
  />
);

// The single map from a JSON node type to a component. A new type is one
// component plus one line here, nothing else changes.
export const nodeComponents = {
  section: Section,
  container: Container,
  card: Card,
  list: List,
  heading: Heading,
  text: Text,
  price: Price,
  badge: Badge,
  listItem: ListItem,
  button: Button,
};
