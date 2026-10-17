import { useState } from 'react';
import { TextLink } from './TextLink';
import { pageUrl } from '../paths';

export function TextLinkLab() {
  const [clicks, setClicks] = useState(0);
  const [disabledClicks, setDisabledClicks] = useState(0);
  return <section className="nav-button-lab text-link-lab" id="componentes-text-link" aria-labelledby="text-link-lab-title">
    <h2 id="text-link-lab-title">Componente · Text Link</h2>
    <p>Padrão, hover com sublinhado, foco por Tab e desabilitado. Mudança instantânea, conforme o Figma.</p>
    <div className="nav-button-specimens">
      <div><h3>Com ícone</h3><TextLink onClick={() => setClicks(count => count + 1)}>Label</TextLink></div>
      <div><h3>Sem ícone</h3><TextLink showIcon={false} onClick={() => setClicks(count => count + 1)}>Label</TextLink></div>
      <div><h3>Desabilitado</h3><TextLink disabled onClick={() => setDisabledClicks(count => count + 1)}>Label</TextLink><p>Eventos recebidos: {disabledClicks}.</p></div>
    </div>
    <p role="status">Ativações no exemplo: {clicks}</p>
    <p>Use Tab e Shift+Tab para mover o foco; Enter ou Espaço ativam as ações. Clique com mouse não exibe o contorno de foco.</p>
    <p><TextLink href={pageUrl('/configuracao') + '#componentes-text-link'}>Exemplo como link de navegação</TextLink></p>
    <p><TextLink href={pageUrl('/configuracao') + '#componentes-text-link'} disabled>Link desabilitado</TextLink></p>
  </section>;
}
