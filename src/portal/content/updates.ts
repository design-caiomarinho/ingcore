type Update = {
  id: string;
  date: string; // Data editorial em YYYY-MM-DD.
  title: string;
  status: 'Novo' | 'Atualizado' | 'Removido';
  description: string;
  href?: string; // Caminho de uma página existente; não incluir o prefixo /ingcore/.
};

/** Histórico editorial: adicionar uma entrada quando uma novidade estiver disponível. */
export const updates: Update[] = [
  {
    id: 'cores-paleta-de-referencia',
    date: '2026-10-16',
    title: 'Cores',
    status: 'Novo',
    description: 'Paleta de referência do Design System disponível para consulta.',
    href: '/cores',
  },
];

export const updateTones = { Novo: 'new', Atualizado: 'updated', Removido: 'removed' } as const;

const formatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC',
});
export function formatUpdateDate(date: string) {
  return formatter.formatToParts(new Date(`${date}T00:00:00Z`))
    .filter(part => part.type !== 'literal').map(part => part.value.replace('.', '')).join(' ');
}

export const recentUpdates = [...updates].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
