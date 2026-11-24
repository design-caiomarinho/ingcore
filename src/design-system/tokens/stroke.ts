// IngCore — Design System: coleções ref e sys-stroke, verificadas no Figma.
export type StrokeToken = { name: string; reference: string; value: number };
export const strokeSemantic: StrokeToken[] = [
  { name: 'none', reference: 'border-width-0', value: 0 },
  { name: 'subtle', reference: 'border-width-1', value: 1 },
  { name: 'medium', reference: 'border-width-2', value: 2 },
  { name: 'strong', reference: 'border-width-4', value: 4 },
];

// Escala primitiva completa da coleção ref, incluindo a medida de 8 px.
export const strokePrimitives: StrokeToken[] = [0, 1, 2, 4, 8].map(value => ({
  name: 'border-width-' + value, reference: 'ref', value,
}));
