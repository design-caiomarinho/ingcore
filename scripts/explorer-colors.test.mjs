import assert from 'node:assert/strict';
import test from 'node:test';
import { colorRows, findColors, primitiveGroups, semanticGroups } from '../src/design-system/tokens/explorer-colors.ts';

test('todas as cores oficiais pertencem a um grupo consultável', () => {
  assert.equal(colorRows.filter(row => row.layer === 'semantic').length, 171);
  assert.equal(colorRows.filter(row => row.layer === 'primitive').length, 143);
  for (const row of colorRows) {
    const groups = row.layer === 'semantic' ? semanticGroups : primitiveGroups;
    assert.ok(groups.some(group => group.id === row.group), row.path);
    assert.match(row.light.hex, /^#[\dA-F]{6}([\dA-F]{2})?$/);
    assert.match(row.dark.hex, /^#[\dA-F]{6}([\dA-F]{2})?$/);
  }
});

test('aliases light/dark usam referências do DS, inclusive dependência fora da listagem inicial', () => {
  const primary = colorRows.find(row => row.path === 'content/primary');
  assert.equal(primary.light.hex, '#171D26');
  assert.equal(primary.dark.hex, '#FFFFFF');
  const tertiary = colorRows.find(row => row.path === 'content/tertiary');
  assert.equal(tertiary.dark.alias, 'var(--palette-gray-350)');
  assert.equal(tertiary.dark.hex, '#B8BFCA');
});

test('transparências mantêm alpha na amostra e no hexadecimal', () => {
  const row = colorRows.find(row => row.path === 'palette/alpha/gray/400');
  assert.equal(row.light.hex, '#151B2466');
  assert.match(row.light.cssValue, / \/ 0\.4/);
});

test('busca cruza grupos por nome, referência e hexadecimal na camada selecionada', () => {
  assert.ok(findColors('semantic', 'surface', 'content-primary').some(row => row.path === 'content/primary'));
  assert.ok(findColors('semantic', 'canvas', 'palette/blue/500').some(row => row.path === 'action/primary/default'));
  assert.ok(findColors('primitive', 'gray', '#395abf').some(row => row.path === 'palette/blue/500'));
  assert.deepEqual(findColors('semantic', 'content', 'cor-inexistente'), []);
  assert.ok(findColors('primitive', 'gray', '').every(row => row.group === 'gray'));
});
