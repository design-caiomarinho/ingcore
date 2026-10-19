import snapshot from './surface-colors.figma.json';

const references = new Map(snapshot.references.map(token => [token.id, token]));
function themeValue(token: (typeof snapshot.tokens)[number], theme: string) {
  const mode = snapshot.collection.modes.find(mode => mode.name === theme);
  const alias = mode && token.valuesByMode[mode.modeId as keyof typeof token.valuesByMode];
  const reference = alias && references.get(alias.id);
  if (!reference) throw new Error(`Referência ausente no DS: ${token.name}/${theme}`);
  const value = Object.values(reference.valuesByMode)[0];
  if (![value.r, value.g, value.b, value.a].every(v => Number.isFinite(v) && v >= 0 && v <= 1)) throw new Error(`Cor inválida no DS: ${reference.name}`);
  return {
    alias: reference.codeSyntax.WEB,
    hex: '#' + [value.r, value.g, value.b, ...(value.a < 1 ? [value.a] : [])].map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('').toUpperCase(),
    cssValue: `color(srgb ${value.r} ${value.g} ${value.b} / ${value.a})`,
  };
}

export const surfaceColorCount = snapshot.groupCount;
export const surfaceColorRows = snapshot.tokens.map(token => ({
  id: token.id, name: token.codeSyntax.WEB, light: themeValue(token, 'light'), dark: themeValue(token, 'dark'),
}));
