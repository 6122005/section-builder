export const PORT = Number(process.env.PORT) || 4000;
export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// The prompt can ask for any number of tiers, but we need a window so that
// "a pricing section with 400 tiers" does not kill the renderer.
export const COUNT = { min: 1, max: 8, default: 3 };

// Node types the frontend knows how to draw. Used by the save validator too.
export const NODE_TYPES = [
  'section',
  'container',
  'card',
  'heading',
  'text',
  'price',
  'badge',
  'list',
  'listItem',
  'button',
];

export const LIMITS = { maxNodes: 300, maxDepth: 12, maxText: 500 };
