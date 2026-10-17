import type { CSSProperties } from 'react';
import snapshot from './colors.figma.json';

/** Valores do DS, independentes dos tokens usados pela interface do portal. */
export const referenceColors = snapshot.tokens.map(token => {
  const value = token.valuesByMode[snapshot.collection.defaultModeId as keyof typeof token.valuesByMode];
  const cssVar = /^var\((--[a-z0-9-]+)\)$/.exec(token.codeSyntax.WEB)?.[1];
  if (!cssVar || !value || ![value.r, value.g, value.b, value.a].every(v => Number.isFinite(v) && v >= 0 && v <= 1)) {
    throw new Error(`Cor inválida no Design System: ${token.name}`);
  }
  const hex = '#' + [value.r, value.g, value.b].map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
  return { name: token.name, cssVar, hex, cssValue: `color(srgb ${value.r} ${value.g} ${value.b} / ${value.a})` };
});

// Aplicar somente no container de demonstração. Não publicar em :root ou .portal-theme.
export const referenceColorVariables = Object.fromEntries(
  referenceColors.map(token => [token.cssVar, token.cssValue]),
) as CSSProperties;
