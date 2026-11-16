# Arquitetura e manutenção

O Mineralchemy é uma aplicação web estática. O gerador incorpora estilos, código e dados nas três páginas HTML da raiz. Abra `index.html` para jogar, `iconografia.html` para consultar as ilustrações e `catalogo-auditoria.html` para revisar as rotas.

| Fonte | Responsabilidade |
| --- | --- |
| [data/catalog.json](../data/catalog.json) | Cartas, agentes, rotas explícitas e regras de família |
| [src/catalog-overrides.js](../src/catalog-overrides.js) | Preservação de IDs e aplicação das revisões históricas e hídricas |
| [data/review-notes.json](../data/review-notes.json) | Fontes de contexto geral e pendências editoriais identificadas por rota |
| [data/literature.json](../data/literature.json) | Obras bibliográficas e evidência paginada por ID de rota |
| [src/game-engine.js](../src/game-engine.js) | Montagem do catálogo e resolução de pares executáveis |
| [src/catalog-science.js](../src/catalog-science.js) | Tipos de material e processo, leitura de equações e conferência de massa e carga |
| [src/reaction-reference.js](../src/reaction-reference.js) | Agrupamento no jogo e balanços complementares vinculados ao ID da rota |
| [src/progress.js](../src/progress.js) e [src/game-storage.js](../src/game-storage.js) | Migração, histórico de descobertas, armazenamento e backup de partidas |
| [src/game.js](../src/game.js), [src/game.css](../src/game.css) e [src/game.template.html](../src/game.template.html) | Interface, teclado, toque e bancada |
| [src/mineral-icons.js](../src/mineral-icons.js), [data/atlas-layout.json](../data/atlas-layout.json) e [src/atlas.template.html](../src/atlas.template.html) | SVGs compartilhados pelo jogo e pelo atlas, agrupamento e etapas do atlas |
| [src/audit.js](../src/audit.js) e [src/audit.template.html](../src/audit.template.html) | Auditoria, pareceres e exportações |
| [scripts/build.mjs](../scripts/build.mjs) | Geração determinística das páginas e verificação de consistência |

## Editar uma carta ou rota

1. Procure o ID nas fontes da tabela. O catálogo inclui rotas geradas por regras, rotas intuitivas do motor e associações em etapas. Preserve o ID quando atualizar uma rota existente. Quando descontinuar uma combinação, conserve o registro e documente a justificativa.
2. Para uma carta, informe nome de exibição, fórmula, família e descrição. Use `materialType` quando a carta representa faixa composicional ou nome coletivo. Inclua a nova carta mineral no agrupamento do atlas.
3. Para uma rota, atualize a expressão, o resumo e as condições. Registre em `sources` a URL e o que cada referência sustenta. Para uma obra do acervo, adicione a edição em `literature.works` no arquivo `data/literature.json` e associe a rota com a obra, o localizador e a afirmação sustentada. O gerador leva a referência da reação de origem às etapas executáveis. Use `environmentalInputs` para materiais do meio com ID no catálogo.
4. Use `→` ou `⇌` com espaços ao redor do símbolo para equações de referência. O analisador verifica massa e carga em fórmulas suportadas, incluindo hidratos e íons em notação sobrescrita. Use `⇢` para uma associação expressa em texto. O balanço químico e a avaliação do processo geológico são campos distintos da ficha.
5. Gere as páginas e confira o jogo e a auditoria. A revisão da rota na auditoria é identificada por uma impressão digital do conteúdo. Pareceres feitos sobre outra versão são sinalizados.

## Gerar e testar

Use Node.js 24 ou superior. Rode os comandos a partir da raiz do repositório.

```sh
npm ci
npm run build
npm run check:generated
npm test
npx playwright install --only-shell chromium
npm run test:browser
```

`npm run check:generated` compara as três páginas com a saída que as fontes atuais produziriam. O gerador valida IDs, pares, cobertura do atlas e alcance das cartas pela bancada. A suíte do Node cobre também o balanço das equações suportadas, migração de partidas, fichas científicas e importação de pareceres. Playwright testa o Chromium em computador e emulação móvel. [Fluxo do GitHub Actions](../.github/workflows/verify.yml)

## Publicar e citar

O GitHub Pages está configurado para servir a raiz de `main`. Inclua as fontes e os três HTML gerados na mesma alteração revisada. Após integrar a alteração, confira a versão publicada do jogo, do atlas e da auditoria. Cite Mineralchemy com o SHA completo do commit e a data de acesso. O hash mostrado na auditoria identifica o conteúdo do catálogo e complementa a citação do commit. [Referências](REFERENCIAS.md#citação-do-software)

O jogo guarda a sessão em `localStorage` e lê as chaves legadas de progresso, bancada e recentes. O histórico reúne as rotas descobertas com seus totais e usa um registro separado para os últimos 100 eventos. A tela Ajuda exporta e restaura arquivos de progresso. Os pareceres também ficam no navegador, sob outra chave, com arquivos próprios de exportação.
