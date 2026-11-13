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

O histórico agrupa as **rotas realizadas** em cinco seções: formação de minerais, transformações mineralógicas, alterações por agentes, associações em etapas e reações de componentes. As seções mostram contadores de rotas registradas e disponíveis, mas **não revelam equações nem produtos de reações ainda não realizadas**.

Os filtros são transversais: metamorfismo, H₂O e fluidos, oxirredução, formações, transformações, agentes e etapas. Uma rota pode integrar mais de uma categoria temática, mas aparece apenas uma vez na listagem principal. A busca funciona por componentes, produtos e equações já realizados.

As categorias não alteram o motor de descoberta, as receitas nem os dados locais. Leia [a documentação do catálogo de reações](docs/REACTIONS_CATALOG.md).

## Reações e referências químicas

As combinações seguem associações intuitivas entre elementos, minerais e processos. As peças escolhidas pelo jogador não precisam corresponder termo a termo à equação de uma reação natural.

No histórico, os ícones identificam as peças e os produtos. A ficha apresenta **equações químicas balanceadas** quando há uma reação representativa defensável; para soluções sólidas e outros casos sem balanço único, apresenta a composição dos produtos ou a equivalência entre polimorfos. Balanço estequiométrico não implica formação espontânea: a mineralogênese real também depende de pressão, temperatura, fluidos e potencial redox.

## Tecnologia e publicação

O jogo é distribuído em `index.html`, sem service worker ou dependências de
servidor. O atlas `iconografia.html` é autônomo e pode ser publicado na mesma
raiz. O GitHub Pages utiliza a branch `main`, diretório `/(root)`.

Na árvore-fonte, o código TypeScript, os dados e os testes permitem reconstruir
o pacote estático por `npm test` e `npm run build`.
