# Mineralchemy

Jogo de descoberta mineralógica. Combine íons, minerais e condições geológicas
para descobrir espécies e transformações, incluindo reações metamórficas em etapas.

**[Jogar](https://marquesbarros.github.io/mineralchemy/)** · **[Atlas dos 178 ícones](https://marquesbarros.github.io/mineralchemy/iconografia.html)**

## Como jogar

A bancada combina sempre duas peças. Quando uma reação envolve três reagentes,
os dois primeiros formam uma associação mineral temporária; o terceiro completa
a transformação. A reação pode revelar vários produtos ao mesmo tempo.
O progresso e o histórico ficam salvos localmente no navegador.

## Iconografia v0.16

**178 minerais, 178 ilustrações SVG próprias.** A biblioteca preserva os 19
desenhos originais e os 30 primeiros refinamentos da versão 0.15. Os outros
129 minerais receberam representações individuais baseadas em hábito, textura,
clivagem, geminação ou agregação. Em espécies de uma mesma série composicional,
a proximidade visual é mantida quando mineralogicamente justificável.

Elementos nativos minerais, como ouro, prata, cobre, ferro, enxofre, grafita e
diamante, também possuem ilustrações. Íons e moléculas não minerais usam fórmulas
químicas; agentes geológicos usam símbolos como P↑, T↑ e fO₂↑.

A ilustração é didática: um hábito representativo não implica forma ou cor
exclusivas da espécie. Veja [a documentação da iconografia](docs/ICONOGRAFIA.md).

## Catálogo de reações · v0.17

O histórico de experimentos agrupa as **rotas realizadas** em cinco seções: formação de minerais, transformações mineralógicas, alterações por agentes, associações em etapas e reações de componentes. As seções mostram contadores de rotas registradas e disponíveis, mas **não revelam equações nem produtos de reações ainda não realizadas**.

Os filtros temáticos são transversais: metamorfismo, H₂O/fluidos, oxirredução, formações, transformações, agentes e etapas. Uma rota pode corresponder a mais de um filtro, mas aparece apenas uma vez na listagem principal. Pesquisa por reagentes, produtos e equações já realizados.

A classificação das reações é independente do motor de descoberta; o histórico antigo e os dados locais continuam válidos. Consulte [as categorias das reações](docs/REACTIONS_CATALOG.md).

## Combinações intuitivas e química de referência

As peças combinadas representam uma associação de descoberta baseada na composição ou em processos mineralógicos. Elas não precisam coincidir termo a termo com os reagentes de uma reação completa. No histórico, os ícones mostram as peças efetivamente combinadas; a seção de referência apresenta uma equação estequiometricamente balanceada quando há um exemplo químico representativo. Para polimorfos, registra-se a equivalência composicional; para soluções sólidas e associações sem balanço único, mostra-se a fórmula do produto, sem criar equações artificiais. Uma equação balanceada conserva elementos e carga, mas não comprova, isoladamente, uma via de formação viável ou um campo de estabilidade.


## Rotas de descoberta e transformações · v0.19

As combinações funcionam como **associações intuitivas**, sem exigir que duas peças formem uma reação química estequiometricamente fechada. Nas séries de solução sólida, adicionar Fe²⁺ ou Mg²⁺ pode deslocar a composição em sentidos opostos; na plagioclase, Ca²⁺ e Na⁺ percorrem a sequência albita–anortita em etapas.

As alterações por agentes ambientais representam processos em sistemas abertos com disponibilidade de fluidos, gases e componentes geológicos, e não a transformação automática de um mineral por um único reagente isolado.

As novas rotas e a cobertura de transformações por agentes estão documentadas em [Rotas intuitivas e transformações](docs/ROTAS_INTUITIVAS.md). Algumas espécies resistentes não recebem transformação adicional quando isso exigiria inventar um produto sem suporte mineralógico. As descobertas existentes e os históricos salvos continuam compatíveis.

## Tecnologia e publicação

O jogo é distribuído em `index.html`, sem service worker ou dependências de
servidor. O atlas `iconografia.html` é autônomo e pode ser publicado na mesma
raiz. O GitHub Pages utiliza a branch `main`, diretório `/(root)`.

Na árvore-fonte, o código TypeScript, os dados e os testes permitem reconstruir
o pacote estático por `npm test` e `npm run build`.