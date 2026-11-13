# Iconografia mineralógica · v0.14

## Política visual

Cada uma das **178 entradas minerais** recebe um SVG exclusivo no jogo, incluindo os sete elementos nativos (Au, Ag, Cu, Fe, S, grafita e diamante). Íons, moléculas e outras substâncias não minerais permanecem representados por fórmula; agentes geológicos usam notação de processo.

A semelhança estrutural entre minerais da mesma família pode ser aproveitada, mas os ícones diferem em cor, facetas, estriações, proporção ou detalhes. O desenho representa um hábito ou aspecto característico, **não uma identificação mineralógica definitiva**.

## Cobertura

- **19 ilustrações autorais originais preservadas**: quartzo, ortoclásio, albita, calcita, pirita, galena, magnetita, olivina, cianita, almandina, muscovita, biotita, ferro nativo, enxofre, cobre nativo, ouro, prata, grafita e diamante.
- **159 SVGs adicionais exclusivos**, produzidos a partir de arquétipos vetoriais (prismático, tabular, lamelar, granular, octaédrico, dodecaédrico, cúbico, romboédrico, acicular etc.) com paleta e detalhes diferenciados conforme a entrada.
- **178/178 minerais cobertos** pela interface. Os 159 SVGs adicionais são representações iniciais geradas por regras, sujeitas a refinamento individual quanto a hábitos e cores em revisões futuras.

## Aplicação

A mesma ilustração aparece na biblioteca, na bancada, na coleção e na ficha de detalhes. Os SVGs são incorporados ao `index.html` autônomo, que não depende de serviço externo nem de service worker.

As associações metamórficas intermediárias não contam como espécies minerais e possuem representação simbólica própria.

## Validação

A versão foi compilada e executou **73 testes automatizados**, incluindo a presença de SVG para cada uma das 178 entradas minerais e a unicidade do conteúdo de seus ícones. Os testes não substituem uma revisão mineralógica individual dos 159 novos desenhos.

Referência de hábitos: [Mineral Identification Key, Mineralogical Society of America](https://msaweb.org/mineral-id-key/).
