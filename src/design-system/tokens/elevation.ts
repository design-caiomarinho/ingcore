// IngCore — Design System: ref, sys-elevation e sys-color, consultados no Figma.
// sys-elevation: subtle → shadow/1, medium → shadow/2, strong → shadow/3.
// shadow/default: palette/alpha/gray/100 (light) e gray/400 (dark).
export const elevationColor = 'rgba(21, 27, 36, 0.1)';
export const elevationSemantic = [
  { name: 'subtle', reference: 'shadow-1', x: 0, y: 2, blur: 4, spread: 0 },
  { name: 'medium', reference: 'shadow-2', x: 0, y: 4, blur: 8, spread: 0 },
  { name: 'strong', reference: 'shadow-3', x: 0, y: 8, blur: 16, spread: 0 },
];
export type ElevationToken = typeof elevationSemantic[number];
export const elevationShadow = (token: ElevationToken) => `${token.x}px ${token.y}px ${token.blur}px ${token.spread}px ${elevationColor}`;
// A quarta referência existe em ref, mas não tem alias em sys-elevation.
export const elevationPrimitives = [2, 4, 8, 16].flatMap((y, index) => [
  { name: `shadow-${index + 1}-x`, value: 0, property: 'offset-x' },
  { name: `shadow-${index + 1}-y`, value: y, property: 'offset-y' },
  { name: `shadow-${index + 1}-blur`, value: y * 2, property: 'blur-radius' },
  { name: `shadow-${index + 1}-spread`, value: 0, property: 'spread-radius' },
]);
