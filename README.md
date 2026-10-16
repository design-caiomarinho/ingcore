# IngCore

Portal de documentação do IngCore Design System, com fundamentos, componentes e diretrizes para criar interfaces consistentes.

React, TypeScript, Vite, SCSS e CSS Variables. A interface do portal usa tokens próprios, separados do Design System documentado. Projeto em evolução.

## Desenvolvimento local

Requer Node.js 24.

```text
npm ci
npm run dev
```

- Home: http://127.0.0.1:5173/home
- Cores: http://127.0.0.1:5173/cores
- Configuração de componentes e tokens: http://127.0.0.1:5173/configuracao
- O endereço local / também abre o catálogo de configuração.

## Validação

```text
npm run build
npm run check:tokens
```

O build valida tipos, aliases e referências de tokens, gera o site em dist/ e prepara entradas estáticas para permitir atualizar e abrir diretamente as páginas.

## Publicação no GitHub Pages

Repositório: https://github.com/design-caiomarinho/ingcore

Em Settings → Pages → Build and deployment, selecionar GitHub Actions como Source. O workflow .github/workflows/pages.yml publica os commits enviados à branch main.

A compilação de publicação usa BASE_PATH=/ingcore/. A configuração local permanece na raiz.

Endereços previstos após a primeira publicação bem-sucedida:

- Home: https://design-caiomarinho.github.io/ingcore/
- Cores: https://design-caiomarinho.github.io/ingcore/cores/
- Configuração: https://design-caiomarinho.github.io/ingcore/configuracao/

## Tokens e componentes

A fonte editável está em src/portal/tokens/figma.tokens.json. Execute npm run tokens após alterações. Não editar manualmente os arquivos em styles/generated/.

Primitivos seguem --ref-*, cores semânticas --sys-color-* e tipografia --sys-type-*. As coleções continuam em construção. A Roboto Mono está definida nos tokens, mas seu arquivo ainda não está empacotado; existe fallback monospace.

Classes usam nomes simples em kebab-case: .sidebar, .navbar, .overview-section, .explore-section, .cards-container e .explore-card. Botões usam .button, .button--ghost, .button--outlined, .button--medium e .button--small. Estados usam atributos e pseudoclasses.

Não alterar a Home sem solicitação explícita. Preservar os comportamentos aprovados e não criar interações para elementos novos sem definição.

## Storybook

A configuração está preparada para evolução futura. O site publicado pelo workflow é o portal Vite, incluindo o catálogo local de configuração.

Referência visual: https://www.figma.com/design/r58dqyV6DaTkieXp1IbKUU/IngCore---Storybook