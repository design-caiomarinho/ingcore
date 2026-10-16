import { useState } from 'react';
import { SidebarButton } from './SidebarButton';
import '../styles/sidebar-button-lab.scss';

export function SidebarButtonLab() {
  const [selected, setSelected] = useState('Primeiros passos');
  const [disabledClicks, setDisabledClicks] = useState(0);
  return <section className="sidebar-button-lab" aria-labelledby="sidebar-button-lab-title" id="componentes-sidebar">
    <h2 id="sidebar-button-lab-title">Componente · Botão da sidebar</h2>
    <p>Padrão, hover, foco por Tab, selecionado e desabilitado. Transições de 300 ms, ease-in-out.</p>
    <div className="sidebar-button-specimens">
      <div><h3>Padrão / hover / foco</h3><SidebarButton>Label</SidebarButton><p>Passe o mouse ou navegue com Tab. O clique do mouse não exibe o contorno de foco.</p></div>
      <div><h3>Selecionado</h3><SidebarButton selected>Label</SidebarButton></div>
      <div><h3>Desabilitado · em breve</h3><SidebarButton disabled onClick={() => setDisabledClicks(count => count + 1)}>Label</SidebarButton><p>Cadeado de 16 px, gap de 12 px e fundo transparente. Não recebe Tab ou cliques. Eventos recebidos: {disabledClicks}.</p></div>
    </div>
    <h3>Validar seleção</h3>
    <div className="sidebar-button-selection" aria-label="Exemplo de seleção da sidebar">{['Primeiros passos', 'Cores', 'Tipografia'].map(label => <SidebarButton key={label} selected={selected === label} onClick={() => setSelected(label)}>{label}</SidebarButton>)}</div>
    <p role="status">Selecionado no exemplo: {selected}</p>
    <p>Use Tab e Shift+Tab para mover o foco; Enter ou Espaço ativam o botão. A preferência de movimento reduzido desativa as transições.</p>
  </section>;
}
