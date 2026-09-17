import { parsePrompt } from './lib/promptParser.js';
import { validateTree } from './lib/validateTree.js';
import { badRequest, notFound } from './lib/HttpError.js';
import { pricingSection } from './generators/pricing.js';
import { heroSection } from './generators/hero.js';
import { store } from './store/sections.js';

// Adding a layout is one generator file plus one line here.
const generators = {
  pricing: pricingSection,
  hero: heroSection,
};

// The mock AI: read the prompt, pick a layout, build a JSON tree.
export function generateSection(prompt) {
  if (typeof prompt !== 'string' || !prompt.trim()) throw badRequest('Prompt is required.');

  const parsed = parsePrompt(prompt);
  const tree = generators[parsed.layout](parsed.count);

  return store.create(tree, {
    prompt: prompt.trim(),
    layout: parsed.layout,
    layoutMatched: parsed.layoutMatched,
    count: parsed.count,
    askedCount: parsed.askedCount,
    clamped: parsed.clamped,
  });
}

export function getSection(id) {
  const record = store.get(id);
  if (!record) throw notFound(`Section "${id}" was not found.`);
  return record;
}

export function saveSection(id, tree) {
  const { valid, errors } = validateTree(tree);
  if (!valid) throw badRequest('The section tree is not valid.', errors);

  const record = store.update(id, tree);
  if (!record) throw notFound(`Section "${id}" was not found.`);
  return record;
}
