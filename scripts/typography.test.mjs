import test from 'node:test';
import assert from 'node:assert/strict';
import { typographyRecipes, typographySampleStyle, typographyGroups, typographyPrimitives, typographyDetails } from '../src/design-system/tokens/typography.ts';

test('resolve os 75 tokens semânticos oficiais, inclusive a família importada', () => {
  assert.equal(typographyRecipes.length, 15);
  assert.equal(typographyRecipes.flatMap(recipe => recipe.properties).length, 75);
  assert.deepEqual([...new Set(typographyRecipes.map(recipe => recipe.group))], [...typographyGroups]);
  for (const recipe of typographyRecipes) {
    assert.equal(recipe.family, 'Inter');
    assert.ok(recipe.size > 0);
    assert.ok([400, 500, 600].includes(recipe.weight));
    assert.equal(recipe.properties.length, 5);
    assert.ok(recipe.properties.every(property => property.reference?.startsWith('font/')));
  }
});

test('converte percentuais do Figma para CSS sem confundir entrelinha e espaçamento', () => {
  const display = typographyRecipes.find(recipe => recipe.id === 'display/lg');
  assert.deepEqual(typographySampleStyle(display), {
    fontFamily: '"Inter", sans-serif', fontSize: '48px', fontWeight: 600, lineHeight: '1.2', letterSpacing: '-0.01em',
  });
  const heading = typographyRecipes.find(recipe => recipe.id === 'heading/md');
  assert.equal(heading.size, 14);
  const caption = typographyRecipes.find(recipe => recipe.id === 'caption');
  assert.equal(caption.height, '100%');
  assert.equal(typographySampleStyle(caption).lineHeight, '1');
});

test('lista todos os 28 primitivos locais sem duplicar a família importada', () => {
  assert.equal(typographyPrimitives.length, 28);
  assert.equal(new Set(typographyPrimitives.map(item => item.reference)).size, 28);
  assert.equal(typographyPrimitives.filter(item => item.reference.startsWith('font/family/')).length, 2);
  for (const item of typographyPrimitives) assert.ok(item.css.endsWith(';'));
});

test('preserva o valor do DS e converte unidades conforme a propriedade CSS', () => {
  const byName = name => typographyPrimitives.find(item => item.reference === name);
  assert.equal(byName('font/family/display').css, 'font-family: "Inter";');
  assert.equal(byName('font/size/7').value, 14);
  assert.equal(byName('font/size/7').css, 'font-size: 14px;');
  assert.equal(byName('font/weight/medium').css, 'font-weight: 500;');
  assert.equal(byName('font/height/tight').value, '120%');
  assert.equal(byName('font/height/tight').css, 'line-height: 1.2;');
  assert.equal(byName('font/letter-spacing/tight').value, '-1%');
  assert.equal(byName('font/letter-spacing/tight').css, 'letter-spacing: -0.01em;');
});

test('detalhes de cada amostra exibem a declaração aplicada e suas cinco referências', () => {
  for (const recipe of typographyRecipes) {
    const details = typographyDetails(recipe);
    assert.equal(details.css.split('\n').length, 5);
    assert.equal(details.references.length, 5);
    assert.ok(details.references.every(property => property.reference?.startsWith('font/')));
    assert.ok(details.css.includes(`font-size: ${recipe.size}px;`));
    assert.ok(details.css.includes(`font-weight: ${recipe.weight};`));
  }
  const large = typographyDetails(typographyRecipes.find(recipe => recipe.id === 'display/lg'));
  assert.equal(large.references.find(property => property.name === 'font-size').reference, 'font/size/24');
  assert.ok(large.css.includes('font-size: 48px;'));
});
