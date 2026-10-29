import test from 'node:test';
import assert from 'node:assert/strict';
import { spacingSemantic, spacingPrimitives, spacingValueLabel } from '../src/design-system/tokens/spacing.ts';

test('resolve os nove aliases oficiais para os primitivos do DS', () => {
  assert.deepEqual(spacingSemantic.map(item => [item.name, item.reference, item.value]), [
    ['none', 'spacing-0', 0], ['xs', 'spacing-1', 4], ['sm', 'spacing-2', 8],
    ['md', 'spacing-3', 12], ['lg', 'spacing-4', 16], ['xl', 'spacing-6', 24],
    ['2xl', 'spacing-8', 32], ['3xl', 'spacing-10', 40], ['4xl', 'spacing-12', 48],
  ]);
});
test('preserva a escala de zero a 80 e trata auto sem convertê-lo em pixels', () => {
  assert.deepEqual(spacingPrimitives.filter(item => typeof item.value === 'number').map(item => item.value), Array.from({length: 21}, (_, index) => index * 4));
  assert.equal(spacingPrimitives.find(item => item.name === 'spacing-auto').value, 'auto');
  assert.equal(spacingValueLabel('auto'), 'auto');
  assert.equal(spacingValueLabel(0), '0 px');
});
