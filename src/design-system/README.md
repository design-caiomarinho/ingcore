# Referências do Design System

Fonte: [IngCore — Design System no Figma](https://www.figma.com/design/rDna8D13lVQpYDLx4Yjbzf/IngCore---Design-System).

Esta pasta contém definições de design usadas no conteúdo documentado. Não representa uma biblioteca de componentes já implementada ou adotada pelos sistemas da empresa.

## Cores

`tokens/colors.figma.json` registra a leitura de 16/10/2026 das 53 cores primitivas das escalas blue, gray, amber, red e green da coleção `ref`. Preserva os IDs, nomes CSS e valores originais do Figma. Este recorte não inclui os demais tokens de cor, aliases semânticos, tipografia ou componentes.

`tokens/colors.ts` prepara os valores para as amostras e deriva o hexadecimal exibido do mesmo valor usado no preenchimento. As variáveis são aplicadas somente ao container `.palette-families`, preservando os nomes oficiais do DS sem alterar o portal.

## Cores semânticas

`tokens/semantic-colors.figma.json` registra um recorte de 16 dos 171 tokens da coleção `sys-color`, com seus aliases em light e dark e as referências primitivas necessárias. `tokens/semantic-colors.ts` resolve os aliases por tema, preserva o alpha e deriva a amostra e o hexadecimal do mesmo valor oficial. Os valores do DS são usados somente nas amostras, sem substituir os tokens de apresentação da tabela.

Na leitura de 16/10/2026, duas legendas do layout da tabela no arquivo do portal divergem do DS: `surface/default` em light aponta para `palette/gray/5` (#FFFFFF), e `content/brand` em light aponta para `palette/blue/500` (#395ABF). A implementação segue as variáveis do arquivo do Design System; os arquivos do Figma não foram alterados.

## Tabela de documentação

A página de Cores usa `src/portal/components/Table.tsx`, com estilos locais em `Table.module.scss`, e uma composição de conteúdo em `src/portal/pages/SemanticColorsTable.tsx`. A estrutura usa HTML de tabela, cabeçalhos de coluna e linha e uma região focável para rolagem horizontal por teclado. A largura mínima é configurável por `--table-min-width`; a página aplica 960px no tablet e mobile, com três colunas de pelo menos 320px. A área rolável alcança as bordas internas da seção, enquanto `--table-edge-space: 24px` preserva o respiro à esquerda no início e à direita no final. O padding pertence ao conteúdo rolável, permitindo que as colunas atravessem essa área durante o scroll. Só a tabela rola horizontalmente.

Essa estrutura está preparada para uma futura formalização no catálogo. Nenhuma entrada de catálogo, filtro ou ordenação foi adicionada nesta etapa.

## Separação das fontes

- `src/portal/tokens`: aparência da interface, navegação, catálogo de configuração do portal e estrutura das páginas.
- `src/design-system/tokens`: valores apresentados nas demonstrações do Design System.

Para atualizar a paleta, consultar novamente a coleção `ref` no arquivo do DS, atualizar o snapshot e a data da leitura, revisar as diferenças e executar o build. Não copiar valores do inventário do portal, mesmo que sejam iguais. Não definir variáveis de demonstração em `:root` ou `.portal-theme`.

O catálogo atual continua sendo o ambiente de configuração dos componentes e tokens do portal. Futuras demonstrações de tipografia e componentes do DS deverão consultar esta fonte separada, sem substituir os componentes usados na interface.

## Padrão para as próximas páginas

A estrutura dos cards, os títulos e a navegação pertencem ao portal. O conteúdo demonstrado consulta diretamente o inventário do DS, inclusive para gerar a lista de amostras. Os valores do arquivo de layout do portal não são fonte de tokens do DS.

Componentes demonstrados devem ser implementados em `src/design-system/components`, com seus próprios estados e estilos locais em CSS Modules. Os componentes da navegação continuam em `src/portal/components`. Aplicar os tokens do DS apenas no container da demonstração, sem seletores globais de elementos ou classes que atinjam a interface do portal.
