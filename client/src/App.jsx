import Toolbar from './components/Toolbar.jsx';
import Canvas from './components/Canvas.jsx';
import { useSectionBuilder } from './hooks/useSectionBuilder.js';

export default function App() {
  const { section, status, busy, dirty, generate, changeText, save } = useSectionBuilder();

  return (
    <div className="app">
      <Toolbar onGenerate={generate} onSave={save} busy={busy} canSave={Boolean(section) && dirty} />

      {status && (
        <p className={`status status--${status.type}`} role="status">
          {status.message}
        </p>
      )}

      <Canvas
        section={section}
        isGenerating={busy === 'generating'}
        onTextChange={changeText}
        onPickExample={generate}
      />
    </div>
  );
}
