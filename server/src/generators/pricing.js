import { createIdFactory, node, textNode } from '../lib/nodes.js';

// Plan names come off a ladder and the top tier is always the last one,
// so 2 tiers and 7 tiers both end up with a sensible line-up.
const TIERS = ['Starter', 'Pro', 'Growth', 'Business', 'Scale', 'Team', 'Premium'];
const TOP_TIER = 'Enterprise';
const PRICES = [9, 29, 59, 99, 149, 199, 299, 399];

const FEATURES = [
  'Up to 3 projects',
  'Community support',
  'Basic analytics',
  'Unlimited projects',
  'Custom domain',
  'Priority support',
  'Team roles and permissions',
  'Audit log and SSO',
  'Dedicated success manager',
  'Custom contract and SLA',
];

function planNames(count) {
  if (count <= 2) return TIERS.slice(0, count);
  return [...TIERS.slice(0, count - 1), TOP_TIER];
}

// Each tier keeps the previous tier's promise and adds one more line.
function featuresFor(index, names) {
  const list = FEATURES.slice(0, Math.min(3 + index, FEATURES.length));
  return index === 0 ? list : [`Everything in ${names[index - 1]}`, ...list.slice(1)];
}

function buildTier(id, index, names, highlightIndex) {
  const name = names[index];
  const highlighted = index === highlightIndex;

  const children = [
    textNode(id('name'), 'heading', name, { level: 3 }),
    node(id('price'), 'price', { text: `$${PRICES[index] ?? PRICES.at(-1)}`, period: '/mo' }),
    node(id('features'), 'list', {}, featuresFor(index, names).map((f) => textNode(id('feature'), 'listItem', f))),
    textNode(id('cta'), 'button', name === TOP_TIER ? 'Contact sales' : 'Choose plan', {
      variant: highlighted ? 'primary' : 'secondary',
    }),
  ];

  if (highlighted) children.unshift(textNode(id('badge'), 'badge', 'Most popular'));

  return node(id('tier'), 'card', { highlighted }, children);
}

// count comes from the prompt, so 1 tier and 8 tiers use the same code path.
export function pricingSection(count) {
  const id = createIdFactory('pricing');
  const names = planNames(count);
  const highlightIndex = Math.floor((count - 1) / 2);

  return node(id('section'), 'section', { name: 'Pricing' }, [
    textNode(id('title'), 'heading', 'Pricing that grows with you', { level: 2 }),
    textNode(id('subtitle'), 'text', 'Start small and move up when the team does.', { tone: 'muted' }),
    node(
      id('grid'),
      'container',
      { layout: 'grid', columns: Math.min(count, 4) },
      names.map((_, i) => buildTier(id, i, names, highlightIndex)),
    ),
  ]);
}
