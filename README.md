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

## Tecnologia e publicação

O jogo é distribuído em `index.html`, sem service worker ou dependências de
servidor. O atlas `iconografia.html` é autônomo e pode ser publicado na mesma
raiz. O GitHub Pages utiliza a branch `main`, diretório `/(root)`.

Na árvore-fonte, o código TypeScript, os dados e os testes permitem reconstruir
o pacote estático por `npm test` e `npm run build`.
