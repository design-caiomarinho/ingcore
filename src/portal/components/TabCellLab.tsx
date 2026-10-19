import { useRef, useState } from 'react';
import { TabCell } from './TabCell';
import '../styles/tab-cell-lab.scss';

const states = ['Default', 'Hover', 'Focus', 'Disabled'];
export function TabCellLab() {
  const [selected, setSelected] = useState(0);
  const cells = useRef<(HTMLButtonElement | null)[]>([]);
  return <section className="nav-button-lab tab-cell-lab" id="componentes-tabs" aria-labelledby="tab-cell-lab-title">
    <h2 id="tab-cell-lab-title">Componente · Tab Cell</h2>
    <p>Default, Hover, Focus e Disabled nas versões selecionada e não selecionada. Enabled no Figma indica seleção. Texto label/md, espaço inferior de 16 px e linha de 1 px.</p>
    <p>Transições de cor de 300 ms, ease-in-out. O foco por teclado segue o contorno do Figma, com radius de 4 px. Os exemplos Hover e Focus abaixo são prévias visuais.</p>
    <div className="tab-cell-specimens">
      {states.map(state => <div className="tab-cell-preview" data-preview={state.toLowerCase()} key={state}>
        <h3>{state}</h3>
        <div className="tab-cell-row" role="tablist" aria-label={`Prévia ${state}`}>
          <TabCell disabled={state === 'Disabled'} aria-label={`${state} não selecionada`}>LABEL</TabCell>
          <TabCell selected disabled={state === 'Disabled'} aria-label={`${state} selecionada`}>LABEL</TabCell>
        </div>
      </div>)}
    </div>
    <h3>Validar interação</h3>
    <div className="tab-cell-demo" role="tablist" aria-label="Exemplo de tabs">
      {['Semânticos', 'Primitivos', 'Em breve'].map((label, index) => <TabCell key={label} id={`tab-cell-demo-${index}`}
        ref={element => { cells.current[index] = element; }} selected={selected === index} disabled={index === 2}
        tabIndex={selected === index ? 0 : -1} aria-controls="tab-cell-demo-panel" onClick={() => setSelected(index)}
        onKeyDown={event => {
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault();
          const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - index;
          setSelected(next);
          cells.current[next]?.focus();
        }}>{label}</TabCell>)}
    </div>
    <div className="tab-cell-demo-panel" id="tab-cell-demo-panel" role="tabpanel" aria-labelledby={`tab-cell-demo-${selected}`}>
      <p>Conteúdo da aba {selected === 0 ? 'Semânticos' : 'Primitivos'}.</p>
    </div>
    <p>Tab entra no grupo; setas, Home e End alternam as abas disponíveis. A célula desabilitada não recebe foco nem cliques e usa cursor bloqueado.</p>
  </section>;
}
