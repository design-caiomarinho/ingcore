import type { ReactNode } from 'react';
import '../styles/code.scss';

export function CodeTag({ children }: { children: ReactNode }) {
  return <code className="code-tag">{children}</code>;
}

/** Marca referências de código em conteúdo editorial sem alterar sua redação. */
export function InlineCode({ children }: { children: string }) {
  const parts = children.split(/(var\(--[\w-]+\)|--[\w-]+|#[\da-fA-F]{6}\b|\bref\b|\bsys-color\b)/g);
  return <>{parts.map((part, index) => index % 2
    ? <CodeTag key={index}>{part}</CodeTag>
    : part)}</>;
}
