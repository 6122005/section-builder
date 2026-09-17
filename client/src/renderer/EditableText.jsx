import { useEffect, useRef } from 'react';

/**
 * One editable piece of text inside the rendered section.
 *
 * contentEditable is left uncontrolled on purpose: if React wrote the text back
 * on every keystroke the caret would jump to the start. The DOM is synced only
 * when this element is not focused, and the new value goes into the JSON tree
 * on blur. Enter commits, Escape reverts.
 */
export default function EditableText({ nodeId, text, as: Tag = 'span', className = '', onTextChange }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (el && document.activeElement !== el && el.textContent !== text) el.textContent = text;
  }, [text]);

  const commit = () => {
    const value = ref.current.textContent.replace(/\s+/g, ' ').trim();
    if (value !== text) onTextChange(nodeId, value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      ref.current.blur();
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      ref.current.textContent = text;
      ref.current.blur();
    }
  };

  return (
    <Tag
      ref={ref}
      className={`editable ${className}`.trim()}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      tabIndex={0}
      data-placeholder="Empty text"
      onBlur={commit}
      onKeyDown={handleKeyDown}
    />
  );
}
