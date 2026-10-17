import { useState } from 'react';
import { NavButton } from './NavButton';
import '../styles/nav-button-lab.scss';

export function NavButtonLab() {
  const [selected, setSelected] = useState('Primeiros passos');
  const [disabledClicks, setDisabledClicks] = useState(0);
  return <section className="nav-button-lab" aria-labelledby="nav-button-lab-title" id="componentes-sidebar">
    <h2 id="nav-button-lab-title">Componente · nav-button</h2>
    <p>Padrão, hover, foco por Tab, selecionado e desabilitado. Transições de 300 ms, ease-in-out.</p>
    <div className="nav-button-specimens">
      <div><h3>Padrão / hover / foco</h3><NavButton>Label</NavButton><p>Passe o mouse ou navegue com Tab. O clique do mouse não exibe o contorno de foco.</p></div>
      <div><h3>Selecionado</h3><NavButton selected>Label</NavButton></div>
      <div><h3>Desabilitado · em breve</h3><NavButton disabled onClick={() => setDisabledClicks(count => count + 1)}>Label</NavButton><p>Cadeado de 16 px, gap de 12 px e fundo transparente. Não recebe Tab ou cliques. Eventos recebidos: {disabledClicks}.</p></div>
    </div>
    <h3>Validar seleção</h3>
    <div className="nav-button-selection" aria-label="Exemplo de seleção da sidebar">{['Primeiros passos', 'Cores', 'Tipografia'].map(label => <NavButton key={label} selected={selected === label} onClick={() => setSelected(label)}>{label}</NavButton>)}</div>
    <p role="status">Selecionado no exemplo: {selected}</p>
    <p>Use Tab e Shift+Tab para mover o foco; Enter ou Espaço ativam o botão. A preferência de movimento reduzido desativa as transições.</p>
  </section>;
}
