import { assetUrl } from '../paths';
import type { ReactNode } from 'react';
import { DocumentationPage } from '../components/DocumentationPage';
import { type PageSection } from '../components/MobileSections';
import { ColorExplorer } from './ColorExplorer';
import { CodeTag, InlineCode } from '../components/CodeTag';
import content from './colors.content.json';
import '../styles/home.scss';
import '../styles/colors.scss';
import '../styles/color-explorer.scss';

const text = (id: keyof typeof content.texts) => content.texts[id];
function Paragraphs({ id }: { id: keyof typeof content.texts }) {
  return <div className="paragraphs">{text(id).split('\n').map((p, index) => <p key={index}><InlineCode>{p}</InlineCode></p>)}</div>;
}
function ColorSection({ title, id, children }: { title: string; id: string; children: ReactNode }) {
  return <section className="section-panel" id={id} aria-labelledby={`${id}-title`}>
    <header className="section-header"><h2 id={`${id}-title`}>{title}</h2></header>
    <div className="section-content">{children}</div>
  </section>;
}
function CodeExample({ id }: { id: keyof typeof content.texts }) {
  return <pre className="code-example code-block"><code>{text(id)}</code></pre>;
}
const sections: PageSection[] = [
  { label: 'Organização dos tokens', target: 'organizacao' },
  { label: 'Explore as cores', target: 'explorar' },
  { label: 'Aplicação e temas', target: 'temas' },
];

/** Conteúdo do recorte atual do Figma, com navegação por seções. */
export function Colors() {
  return <DocumentationPage currentItem="Cores" className="colors-page" title={text('76:1592')} description={text('76:1593')} sections={sections}>
      <ColorSection title={text('76:1621')} id="organizacao">
        <div className="content-group">
          <p><InlineCode>{text('78:2321')}</InlineCode></p>
          <div className="token-cards">{[
            ['78:2324', '78:2325', '83:2352'],
            ['78:2335', '78:2336', '83:2348'],
          ].map(([heading, body, caption]) => <div className="token-column" key={heading}>
            <article className="token-card"><h3>{text(heading as keyof typeof content.texts)}</h3><Paragraphs id={body as keyof typeof content.texts} /></article>
            <p className="token-caption"><strong>Função:</strong> <InlineCode>{text(caption as keyof typeof content.texts).replace(/^Função:\s*/, '')}</InlineCode></p>
          </div>)}</div>
        </div>
        <div className="content-group">
          <div className="text-group"><h3>{text('83:2354')}</h3><p><InlineCode>{text('83:2356')}</InlineCode></p></div>
          <div className="token-connection">
            <div className="token-flow">{[
              ['92:254', '92:256'], ['92:259', '92:261'], ['92:264', '92:266'],
            ].map(([label, value], index) => <div className="flow-step" key={label}>
              {index > 0 && <picture className="flow-arrow"><source media="(max-width: 767px)" srcSet={assetUrl('colors-flow-down.svg')} /><img src={assetUrl('colors-flow-right.svg')} alt="" /></picture>}
              <div><p className="flow-label">{text(label as keyof typeof content.texts)}</p><CodeTag>{text(value as keyof typeof content.texts)}</CodeTag></div>
            </div>)}</div>
            <CodeExample id="85:2452" />
          </div>
        </div>
        <div className="text-group"><h3>{text('92:309')}</h3><Paragraphs id="92:310" /></div>
      </ColorSection>
      <ColorSection title="Explore os tokens de cores" id="explorar"><ColorExplorer /></ColorSection>
      <ColorSection title={text('97:689')} id="temas">
        <div className="content-group">
          <div className="text-group"><h3>{text('97:691')}</h3><p><InlineCode>{text('97:692')}</InlineCode></p></div>
          <div className="theme-examples">{[
            { title: '97:695', body: '97:696', code: '97:697', dark: false },
            { title: '97:701', body: '97:702', code: '97:703', dark: true },
          ].map(theme => <article className={`theme-card${theme.dark ? ' theme-card--dark' : ''}`} key={theme.title}>
            <div className="text-group"><h3>{text(theme.title as keyof typeof content.texts)}</h3><p><InlineCode>{text(theme.body as keyof typeof content.texts)}</InlineCode></p></div>
            <div className="text-group"><pre className="code-block"><code>{text(theme.code as keyof typeof content.texts)}</code></pre>
            </div>
          </article>)}</div>
          <p><InlineCode>{text('97:706')}</InlineCode></p>
          <CodeExample id="97:708" />
        </div>
        <div className="content-group">
          <div className="text-group"><h3>{text('97:709')}</h3><p><InlineCode>{text('97:710')}</InlineCode></p></div>
          <CodeExample id="97:712" />
        </div>
      </ColorSection>
  </DocumentationPage>;
}
