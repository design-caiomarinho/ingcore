type Update = {
  id: string;
  date: string; // Data editorial em YYYY-MM-DD.
  title: string;
  status: 'Novo' | 'Atualizado' | 'Removido';
  description: string;
  href?: string; // Caminho de uma página existente; não incluir o prefixo /ingcore/.
};

/** Histórico editorial das páginas e conteúdos do Design System. Componentes e ajustes internos do portal não entram neste histórico. */
export const updates: Update[] = [
  {
    id: 'cores-explorador-e-navegacao',
    date: '2026-10-19',
    title: 'Cores',
    status: 'Atualizado',
    description: 'Tokens primitivos e semânticos com busca, filtros e comparação entre light e dark.',
    href: '/cores',
  },
  {
    id: 'cores-paleta-de-referencia',
    date: '2026-10-16',
    title: 'Cores',
    status: 'Novo',
    description: 'Paleta de referência do Design System disponível para consulta.',
    href: '/cores',
  },
];

// Limite editorial e de exibição para manter as novidades breves.
export const UPDATE_DESCRIPTION_LIMIT = 100;
export function formatUpdateDescription(description: string) {
  const characters = Array.from(description);
  if (characters.length <= UPDATE_DESCRIPTION_LIMIT) return description;
  const excerpt = characters.slice(0, UPDATE_DESCRIPTION_LIMIT - 1).join('');
  return excerpt.replace(/\s+\S*$/u, '').trimEnd() + '…';
}
export const updateTones = { Novo: 'new', Atualizado: 'updated', Removido: 'removed' } as const;

const formatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC',
});
export function formatUpdateDate(date: string) {
  return formatter.formatToParts(new Date(`${date}T00:00:00Z`))
    .filter(part => part.type !== 'literal').map(part => part.value.replace('.', '')).join(' ');
}

export const recentUpdates = [...updates].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
