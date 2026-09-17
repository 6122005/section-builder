import { useCallback, useRef, useState } from 'react';
import { api } from '../api.js';
import { updateNodeText } from '../lib/tree.js';

// Holds the section tree, the unsaved flag and the toolbar status,
// so the components stay presentational.
export function useSectionBuilder() {
  const [section, setSection] = useState(null);
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(null); // 'generating' | 'saving' | null
  const [dirty, setDirty] = useState(false);

  // Keeps the latest tree for save, even if a keystroke lands mid request.
  const treeRef = useRef(null);

  const generate = useCallback(async (prompt) => {
    setBusy('generating');
    try {
      const result = await api.generate(prompt);
      treeRef.current = result.tree;
      setSection({ id: result.id, tree: result.tree });
      setDirty(false);
      setStatus({ type: 'info', message: describe(result.meta) });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setBusy(null);
    }
  }, []);

  const changeText = useCallback((nodeId, text) => {
    setSection((current) => {
      if (!current) return current;

      const tree = updateNodeText(current.tree, nodeId, text);
      if (tree === current.tree) return current;

      treeRef.current = tree;
      return { ...current, tree };
    });
    setDirty(true);
    setStatus({ type: 'info', message: 'Unsaved changes' });
  }, []);

  const save = useCallback(async () => {
    if (!section) return;

    setBusy('saving');
    try {
      const result = await api.save(section.id, treeRef.current);
      setDirty(false);
      setStatus({ type: 'success', message: `Saved as version ${result.version}` });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setBusy(null);
    }
  }, [section]);

  return { section, status, busy, dirty, generate, changeText, save };
}

function describe(meta) {
  const parts = [`${meta.layout} layout`, `${meta.count} items`];
  if (!meta.layoutMatched) parts.push('no keyword matched, used the default layout');
  if (meta.clamped) parts.push(`asked for ${meta.askedCount}, capped at ${meta.count}`);
  return parts.join(' · ');
}
