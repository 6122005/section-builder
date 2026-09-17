import test from 'node:test';
import assert from 'node:assert/strict';
import { parsePrompt } from '../src/lib/promptParser.js';
import { pricingSection } from '../src/generators/pricing.js';
import { generateSection, getSection, saveSection } from '../src/sectionService.js';
import { store } from '../src/store/sections.js';

const countType = (node, type) =>
  (node.type === type ? 1 : 0) + (node.children || []).reduce((sum, c) => sum + countType(c, type), 0);

test('reads the layout and the tier count from the prompt', () => {
  const parsed = parsePrompt('a pricing section with 3 tiers');
  assert.equal(parsed.layout, 'pricing');
  assert.equal(parsed.count, 3);

  assert.equal(parsePrompt('pricing with five plans').count, 5);
  assert.equal(parsePrompt('build a pricing section').count, 3);
  assert.equal(parsePrompt('a hero section').layout, 'hero');
});

test('clamps a count that is out of range', () => {
  const parsed = parsePrompt('pricing with 40 tiers');
  assert.equal(parsed.count, 8);
  assert.equal(parsed.clamped, true);
});

test('builds as many tiers as asked, with one highlighted', () => {
  for (const count of [1, 2, 3, 5, 7]) {
    const tree = pricingSection(count);
    assert.equal(countType(tree, 'card'), count);
  }

  const cards = pricingSection(5).children[2].children;
  assert.equal(cards.filter((card) => card.props.highlighted).length, 1);
});

test('generate, edit and save keeps the edited text', () => {
  store.reset();
  const created = generateSection('a pricing section with 3 tiers');

  const edited = structuredClone(created.tree);
  edited.children[0].props.text = 'Our plans';
  const saved = saveSection(created.id, edited);

  assert.equal(saved.version, 2);
  assert.equal(getSection(created.id).tree.children[0].props.text, 'Our plans');
});

test('rejects an empty prompt and an invalid tree', () => {
  store.reset();
  assert.throws(() => generateSection('   '), /Prompt is required/);

  const created = generateSection('hero section');
  const broken = structuredClone(created.tree);
  broken.children[0].type = 'script';
  assert.throws(() => saveSection(created.id, broken), /not valid/);
});
