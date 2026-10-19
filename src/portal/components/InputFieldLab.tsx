import { InputField } from './InputField';
import { assetUrl } from '../paths';
import '../styles/input-lab.scss';

const states = [
  { id: 'default', label: 'Default' }, { id: 'hover', label: 'Hover' },
  { id: 'focus', label: 'Focus · teclado' }, { id: 'critical', label: 'Critical' },
  { id: 'disabled', label: 'Disabled' },
];

export function InputFieldLab() {
  return <section className="nav-button-lab input-lab" id="componentes-input" aria-labelledby="input-lab-title">
    <h2 id="input-lab-title">Componente · Input Standard</h2>
    <p>Altura de 40 px, radius de 8 px e intervalo de 4 px entre label, campo e hint. O texto digitado usa body/md/medium; placeholder e disabled usam body/md/regular.</p>
    <p>Borda e fundo: 300 ms, ease-in-out. O foco por Tab tem afastamento de 4 px e radius de 12 px. Clique para editar sem exibir o anel de teclado. Os estados Hover e Focus abaixo são prévias visuais; os campos também respondem ao mouse e ao teclado.</p>
    <div className="input-specimens">
      {states.flatMap(state => [false, true].map(filled => <div key={state.id + filled} className="input-preview" data-preview={state.id}>
        <h3>{state.label} · {filled ? 'preenchido' : 'vazio'}</h3>
        <InputField label="Label text" placeholder="Value" defaultValue={filled ? 'Value' : undefined} disabled={state.id === 'disabled'} invalid={state.id === 'critical'} />
      </div>))}
    </div>
    <h3>Pressed · edição, ícones e hint</h3>
    <div className="input-specimens">
      <InputField label="Campo com ícones" placeholder="Value" hint="Hint Text"
        leftIcon={<img src={assetUrl('input-component.svg')} alt="" />}
        rightIcon={<span className="input-icon-pair"><img src={assetUrl('input-component.svg')} alt="" /><img className="input-icon-active" src={assetUrl('input-component-active.svg')} alt="" /></span>} />
      <InputField label="Campo crítico com hint" defaultValue="Value" invalid hint="Confira o valor informado." />
      <InputField label="Campo sem ícones" placeholder="Digite para testar a edição" hint="Use Tab para conferir o foco." />
    </div>
  </section>;
}
