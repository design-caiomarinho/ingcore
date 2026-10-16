# Home desktop

> Registro histórico da primeira entrega. A versão atual já inclui tablet,
> mobile e nova composição da Home. Consulte o README da raiz para execução e publicação.

Rota `/home`, separada do ambiente de configuração em `/`.
Referência: frame `1:2` do arquivo Figma confirmado; validação em 1440 × 1079.
Esta entrega implementa apenas desktop. O layout mantém largura mínima de 1200 px;
tablet e mobile serão implementados quando solicitados.

## Uso de tokens

| Área | Tokens |
| --- | --- |
| Fundo | sys-color/canvas/default |
| Superfícies | sys-color/surface/default |
| Bordas e eixo da timeline | sys-color/border/primary |
| Títulos | sys-color/content/primary |
| Texto de apoio | sys-color/content/secondary |
| Grupos do menu e datas | sys-color/content/tertiary |
| Links e selo | sys-color/content/brand |
| Menu ativo e hover | sys-color/action/ghost/hover |
| Menu padrão | sys-color/action/ghost/default |
| Título principal | sys-type/heading/lg |
| Títulos de seção | sys-type/heading/md |
| Títulos de cards e atualizações | sys-type/heading/sm |
| Grupos do menu | sys-type/heading/overline |
| Introdução | sys-type/body/lg/regular |
| Descrições | sys-type/body/md/regular |
| Menu e links | sys-type/label/md |
| Selo e tags | sys-type/label/sm |
| Datas | sys-type/body/sm/medium |
| Tags | sys-color/extented/{amber,blue,red}/{100,700} |

Os nomes CSS seguem `--ref-*`, `--sys-color-*` e `--sys-type-*`.
A composição tipográfica em `_typography.scss` lê as cinco propriedades do conjunto,
sem duplicar os seus valores.

No frame atual, a descrição dos cards usa altura de linha AUTO, enquanto
sys-type/body/md/regular/height contém 150%. Por isso, somente nos cards, a altura
de linha usa `--ref-font-line-auto`, preservando o desenho. Essa variante pode ser
substituída por um token semântico específico quando ele for definido.

Medidas de layout (padding, gap, largura, raios e espessura de borda) ainda não
existem nas coleções de tokens e permanecem concentradas em `home.scss`.
Não foram inventados tokens para preenchê-las.

## Assets

Vetores exportados diretamente do Figma pelo conector, sem redesenho:

- Logo: nó 37:1338, `public/assets/imgVector.svg`, raiz SVG 117 × 24.
- Seta: instância I31:567;31:522, `imgArrowRight.svg`, 16 × 16.
- Marcador ativo: 16:4027, `imgMarcador.svg`, 12 × 12.
- Marcador vazio: 16:4042, `imgMarcador1.svg`, 12 × 12, usado duas vezes.

As sete setas, o logo e os três marcadores foram conferidos no navegador.
Nenhuma URL temporária do Figma é usada em execução.

## Conteúdo e evolução

Textos, datas e status reproduzem o frame. A nota sobre Dark Mode é conteúdo
editorial de exemplo do Figma, sem implementação de tema escuro nesta fase.
Biblioteca, atualizações, links e menu têm componentes separados.
Os destinos ainda não implementados aparecem como controles desabilitados.
Cores e Tipografia abrem o ambiente de configuração; os links de Figma abrem a referência.

Alterar a fonte `figma.tokens.json` durante `npm run dev` regenera CSS e catálogo.
O build também gera os tokens antes da validação. Valores atualizados propagam-se
pelos aliases; remoções ou renomeações usadas na Home são apontadas pelo validador.
Inclusões, alterações e renomeações no Figma exigem uma nova leitura do arquivo;
não há sincronização automática remota.

O catálogo continua sendo o ambiente de definição e validação, com espaço para
configuração de componentes em etapas futuras. Storybook não é necessário para esta entrega.
