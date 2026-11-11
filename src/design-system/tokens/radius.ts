// Valores capturados do arquivo IngCore — Design System (coleções ref e sys-radius).
export type RadiusToken = { name: string; reference: string; value: number };
export const radiusPrimitives: RadiusToken[] = [0, 4, 8, 12, 16, 20, 24, 28, 32].map((value, index) => ({name: `radius-${index}`, reference: 'ref', value})).concat([{name: 'radius-max', reference: 'ref', value: 999}]);
export const radiusSemantic: RadiusToken[] = [
  {name: 'none', reference: 'radius-0', value: 0},
  {name: 'xs', reference: 'radius-1', value: 4},
  {name: 'sm', reference: 'radius-2', value: 8},
  {name: 'md', reference: 'radius-3', value: 12},
  {name: 'lg', reference: 'radius-4', value: 16},
  {name: 'full', reference: 'radius-max', value: 999},
];
