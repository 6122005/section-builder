import { useState } from 'react';

export default function Toolbar({ onGenerate, onSave, busy, canSave }) {
  const [prompt, setPrompt] = useState('');

  const submit = () => {
    const value = prompt.trim();
    if (value && !busy) onGenerate(value);
  };

  return (
    <header className="toolbar">
      <span className="brand">Section Builder</span>

      <div className="toolbar__prompt">
        <input
          value={prompt}
          aria-label="Section prompt"
          placeholder='Enter your prompt, e.g. "a pricing section with 3 tiers"'
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />
        <button className="btn btn--primary" onClick={submit} disabled={busy === 'generating' || !prompt.trim()}>
          {busy === 'generating' ? 'Generating…' : 'Generate'}
        </button>
      </div>

      <button className="btn btn--save" onClick={onSave} disabled={!canSave || busy === 'saving'}>
        {busy === 'saving' ? 'Saving…' : 'Save changes'}
      </button>
    </header>
  );
}
