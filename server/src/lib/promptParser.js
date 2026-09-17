import { COUNT } from '../config.js';

const WORD_NUMBERS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8 };

const LAYOUT_KEYWORDS = {
  pricing: ['pricing', 'price', 'plan', 'plans', 'tier', 'tiers', 'subscription'],
  hero: ['hero', 'landing', 'banner', 'headline'],
};

function detectLayout(text) {
  for (const [layout, keywords] of Object.entries(LAYOUT_KEYWORDS)) {
    if (keywords.some((word) => text.includes(word))) return layout;
  }
  return null;
}

// "3 tiers", "with 5 plans", "seven cards" -> the number
function detectCount(text) {
  const digits = text.match(/(\d+)/);
  if (digits) return Number(digits[1]);

  const words = text.match(new RegExp(`\\b(${Object.keys(WORD_NUMBERS).join('|')})\\b`));
  return words ? WORD_NUMBERS[words[1]] : null;
}

export function parsePrompt(rawPrompt) {
  const text = String(rawPrompt).toLowerCase();
  const layout = detectLayout(text);
  const asked = detectCount(text);
  const count = asked === null ? COUNT.default : Math.min(Math.max(asked, COUNT.min), COUNT.max);

  return {
    layout: layout || 'pricing', // nothing matched, fall back to pricing
    layoutMatched: layout !== null,
    count,
    askedCount: asked,
    clamped: asked !== null && asked !== count,
  };
}
