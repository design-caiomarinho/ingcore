import { assetUrl } from '../paths';
import { useState } from 'react';
import { Button } from './Button';

const record = (disabled = false) => <img src={assetUrl(`imgRecord${disabled ? 'Disabled' : ''}.svg`)} alt="" />;

export function ButtonLab() {
  const [clicks, setClicks] = useState(0);
  return <section className="nav-button-lab" id="componentes-button" aria-labelledby="button-lab-title">
    <h2 id="button-lab-title">Componente · Button Ghost e Outlined</h2>
    <p>Medium: 40 px. Small: 32 px. Ícones de 16 px, intervalo de 12 px e radius de 8 px. Use o mouse para hover e Tab para o foco, afastado 4 px.</p>
    <p>Transição de fundo de 300 ms com ease-in-out na entrada e saída do hover, nos dois tamanhos e nas versões apenas com ícone.</p>
    <p>Desabilitado: sem preenchimento, conteúdo on-disabled e cursor bloqueado. Outlined mantém a borda brand, inclusive desabilitado, conforme o Figma. Enabled indica seleção persistente.</p>
    {(['ghost', 'outlined'] as const).flatMap(variant => (['medium', 'small'] as const).map(size => <div key={`${variant}-${size}`} data-variant={variant} data-size={size}>
      <h3>{variant === 'ghost' ? 'Ghost' : 'Outlined'} · {size}</h3>
      <div className="nav-button-specimens">
        <div><h4>Padrão · hover · foco</h4><Button variant={variant} size={size} leftIcon={record()} rightIcon={record()} onClick={() => setClicks(n => n + 1)}>Label</Button></div>
        <div><h4>Sem ícones</h4><Button variant={variant} size={size} onClick={() => setClicks(n => n + 1)}>Label</Button></div>
        <div><h4>Apenas ícone</h4><Button variant={variant} size={size} iconOnly icon={record()} aria-label={`Exemplo apenas ícone ${variant} ${size}`} onClick={() => setClicks(n => n + 1)} /></div>
        <div><h4>Enabled · selecionado</h4><Button variant={variant} size={size} selected leftIcon={record()} rightIcon={record()}>Label</Button></div>
        <div><h4>Ícone selecionado</h4><Button variant={variant} size={size} selected iconOnly icon={record()} aria-label={`Exemplo selecionado ${variant} ${size}`} /></div>
        <div><h4>Desabilitado</h4><Button variant={variant} size={size} disabled leftIcon={record(true)} rightIcon={record(true)} onClick={() => setClicks(n => n + 1)}>Label</Button></div>
        <div><h4>Ícone desabilitado</h4><Button variant={variant} size={size} disabled iconOnly icon={record(true)} aria-label={`Exemplo desabilitado ${variant} ${size}`} /></div>
      </div>
    </div>))}
    <p role="status">Ativações no exemplo Button: {clicks}</p>
    <p>Enter e Espaço ativam o botão. Os exemplos desabilitados não recebem foco nem acionam ações.</p>
  </section>;
}
