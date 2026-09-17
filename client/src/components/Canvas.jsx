import NodeRenderer from '../renderer/NodeRenderer.jsx';

const EXAMPLES = [
  'A pricing section with 3 tiers',
  'A pricing section with 5 tiers',
  'A hero section with 4 highlights',
];

// Shown while the backend is building the section tree.
function LoadingSkeleton() {
  return (
    <main className="canvas">
      <div className="sheet sheet--loading">
        <div className="skeleton skeleton--title" />
        <div className="skeleton skeleton--subtitle" />
        <div className="skeleton-grid">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton skeleton--card" />
          ))}
        </div>
      </div>
    </main>
  );
}

export default function Canvas({ section, isGenerating, onTextChange, onPickExample }) {
  if (isGenerating) {
    return <LoadingSkeleton />;
  }

  if (!section) {
    return (
      <main className="canvas">
        <div className="empty">
          <h2>Describe the section you need</h2>
          <p>The prompt decides the layout and how many items it holds. Try one of these:</p>
          {EXAMPLES.map((example) => (
            <button key={example} className="empty__example" onClick={() => onPickExample(example)}>
              {example}
            </button>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="canvas">
      <div className="sheet">
        <NodeRenderer node={section.tree} onTextChange={onTextChange} />
      </div>
    </main>
  );
}
