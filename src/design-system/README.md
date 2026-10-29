# Referências do Design System

Fonte: [IngCore — Design System no Figma](https://www.figma.com/design/rDna8D13lVQpYDLx4Yjbzf/IngCore---Design-System).

Esta pasta contém definições de design usadas no conteúdo documentado. Não representa uma biblioteca de componentes já implementada ou adotada pelos sistemas da empresa.

## Cores

`tokens/colors.figma.json` registra a leitura de 16/10/2026 das 53 cores primitivas das escalas blue, gray, amber, red e green da coleção `ref`. Preserva os IDs, nomes CSS e valores originais do Figma. Este recorte não inclui os demais tokens de cor, aliases semânticos, tipografia ou componentes.

`tokens/colors.ts` prepara os valores para as amostras e deriva o hexadecimal exibido do mesmo valor usado no preenchimento. As variáveis são aplicadas somente ao container `.palette-families`, preservando os nomes oficiais do DS sem alterar o portal.

## Cores semânticas

`tokens/semantic-colors.figma.json` registra um recorte de 16 dos 171 tokens da coleção `sys-color`, com seus aliases em light e dark e as referências primitivas necessárias. `tokens/semantic-colors.ts` resolve os aliases por tema, preserva o alpha e deriva a amostra e o hexadecimal do mesmo valor oficial. Os valores do DS são usados somente nas amostras, sem substituir os tokens de apresentação da tabela.

Na leitura de 16/10/2026, duas legendas do layout da tabela no arquivo do portal divergem do DS: `surface/default` em light aponta para `palette/gray/5` (#FFFFFF), e `content/brand` em light aponta para `palette/blue/500` (#395ABF). A implementação segue as variáveis do arquivo do Design System; os arquivos do Figma não foram alterados.

## Explorador de cores

A página reúne a consulta em “Explore os tokens de cores”. `tokens/explorer-colors.figma.json` contém a leitura oficial de 19/10/2026: 171 cores de `sys-color`, seus modos light/dark, e 143 cores primitivas de `ref`. A leitura de `ref` listou 142 cores; a dependência `palette/gray/350`, usada por `content/tertiary` em dark, foi consultada diretamente por ID e incluída no inventário, preservando o alias oficial.

`tokens/explorer-colors.ts` resolve aliases por coleção/modo, detecta referências ausentes e ciclos, preserva alpha e prepara o hexadecimal e o preenchimento da mesma cor. Somente as amostras recebem valores do DS; aparência e controles continuam usando os tokens da interface. Os snapshots anteriores são históricos e não alimentam este explorador.

A composição `src/portal/pages/ColorExplorer.tsx` e seus estilos `color-explorer.scss` pertencem somente à página Cores. As abas, grupos, busca por nome/referência/hexadecimal, paginação estão ativos. Sem busca, consulta-se o grupo selecionado. A busca consulta toda a camada ativa. Trocar aba/grupo reinicia a paginação; cada página exibe até dez itens; a tabela preserva a posição vertical da página e reinicia a rolagem horizontal. Os primitivos têm um único valor oficial, por isso são apresentados em duas colunas (token/valor), sem inventar um segundo tema.

A tabela tem cabeçalhos nativos e região focável para scroll horizontal. No tablet e mobile, as três colunas semânticas mantêm pelo menos 960px (640px para duas colunas primitivas), alcançando as bordas internas da seção com 24px à esquerda no início e à direita no fim. A descrição do grupo aparece em todas as larguras. Canvas é o grupo inicial. Os nomes dos grupos preservam o idioma inglês dos tokens oficiais. Os testes de integridade e busca podem ser executados com `node --test scripts/explorer-colors.test.mjs` em Node 24.

A tabela não foi registrada no catálogo. Caso seja utilizada em outra página, sua estrutura será formalizada como componente compartilhado.
## Separação das fontes

- `src/portal/tokens`: aparência da interface, navegação, catálogo de configuração do portal e estrutura das páginas.
- `src/design-system/tokens`: valores apresentados nas demonstrações do Design System.

Para atualizar a paleta, consultar novamente a coleção `ref` no arquivo do DS, atualizar o snapshot e a data da leitura, revisar as diferenças e executar o build. Não copiar valores do inventário do portal, mesmo que sejam iguais. Não definir variáveis de demonstração em `:root` ou `.portal-theme`.

O catálogo atual continua sendo o ambiente de configuração dos componentes e tokens do portal. Futuras demonstrações de tipografia e componentes do DS deverão consultar esta fonte separada, sem substituir os componentes usados na interface.

## Padrão para as próximas páginas

A estrutura dos cards, os títulos e a navegação pertencem ao portal. O conteúdo demonstrado consulta diretamente o inventário do DS, inclusive para gerar a lista de amostras. Os valores do arquivo de layout do portal não são fonte de tokens do DS.

Componentes demonstrados devem ser implementados em `src/design-system/components`, com seus próprios estados e estilos locais em CSS Modules. Os componentes da navegação continuam em `src/portal/components`. Aplicar os tokens do DS apenas no container da demonstração, sem seletores globais de elementos ou classes que atinjam a interface do portal.
## Tipografia documentada

A tela `/tipografia` usa `tokens/typography.figma.json`, extraído em 19/10/2026 do arquivo IngCore — Design System (`rDna8D13lVQpYDLx4Yjbzf`). O recorte inclui os 75 tokens da coleção `sys-type`, os 28 primitivos tipográficos locais e a família importada usada por Label Medium. O modo existente é `=< 1366`; ele não estabelece os layouts tablet/mobile do portal, que seguem os frames de documentação.

`tokens/typography.ts` resolve os aliases e monta 15 conjuntos de Display, Heading, Body, Label e Caption. As propriedades documentadas usam os valores das variáveis; Caption tem entrelinha de 100% na variável, embora o estilo de texto do Figma informe 120%. As amostras não usam as receitas tipográficas do portal. A família importada e suas referências são preservadas sem inventar nomes CSS públicos para variáveis que ainda não têm codeSyntax.

A aba Primitivos lista as referências de font/family, font/size, font/weight, font/height e font/letter-spacing, preservando os valores do DS e mostrando a propriedade CSS equivalente. A tabela e a paginação são compartilhadas com Cores e registradas no catálogo do portal. Cada amostra semântica abre e fecha sua declaração CSS e as cinco referências primitivas. Os detalhes são derivados da mesma receita usada na amostra; abertura e fechamento têm transição de 300ms ease-in-out e respeitam movimento reduzido.

A tela adapta a composição nos breakpoints do portal: tablet abaixo de 1200px e mobile abaixo de 768px. Os tamanhos documentados dos tokens são preservados; cards e hierarquia se empilham no celular, os exemplos CSS quebram linha e a tabela de primitivos mantém scroll horizontal. A seta dos detalhes gira com a mesma transição de 300ms ease-in-out e respeita movimento reduzido.

## Espaçamento

A página `/espacamento` consulta `tokens/spacing.figma.json`, extraído do IngCore Design System em 29/10/2026. O recorte preserva os 22 primitivos da coleção `ref` (0–80 px, em passos de 4 px, e `auto`) e os nove aliases de `sys-spacing`. O módulo `spacing.ts` resolve esses aliases para alimentar a tabela, as barras de comparação e a simulação de padding/gap a partir da mesma fonte. `auto` permanece um valor textual e não é oferecido como medida de padding/gap. Os tokens documentados não são adicionados aos tokens da interface do portal.

A composição segue os frames desktop `208:834`, tablet `208:1797` e mobile `208:2153` do arquivo de documentação. Abas, botões e navegação reutilizam os componentes existentes; novas composições permanecem locais à página.