import { createIdFactory, node, textNode } from '../lib/nodes.js';

const HIGHLIGHTS = [
  'Describe a section in one line',
  'Edit any word straight on the page',
  'Save and pick it up later',
  'Works with your own components',
  'No template lock-in',
  'Ships as clean JSON',
  'Version every change',
  'Invite the whole team',
];

// count controls how many highlight lines are shown, same as pricing tiers.
export function heroSection(count) {
  const id = createIdFactory('hero');

  return node(id('section'), 'section', { name: 'Hero' }, [
    textNode(id('badge'), 'badge', 'New in the builder'),
    textNode(id('title'), 'heading', 'Type a prompt. Get a section you can edit.', { level: 1 }),
    textNode(id('subtitle'), 'text', 'Write what the page needs and the builder lays it out for you.', {
      tone: 'muted',
    }),
    node(
      id('highlights'),
      'list',
      {},
      HIGHLIGHTS.slice(0, count).map((line) => textNode(id('highlight'), 'listItem', line)),
    ),
    node(id('actions'), 'container', { layout: 'row' }, [
      textNode(id('primary'), 'button', 'Start building', { variant: 'primary' }),
      textNode(id('secondary'), 'button', 'See an example', { variant: 'secondary' }),
    ]),
  ]);
}
