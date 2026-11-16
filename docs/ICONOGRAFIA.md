# Iconografia mineralógica

## Política

- **Todos os minerais**, inclusive elementos nativos (ouro, prata, cobre, ferro, enxofre, grafita e diamante), recebem ilustrações SVG individualizadas.
- Íons (`Fe²⁺`, `SO₄²⁻`) e substâncias que não são cartas minerais (`H₂O`, `CO₂`, `O₂`, `Si` como reagente) recebem fórmula química escrita.
- Agentes geológicos recebem notações de processo (`P↑`, `T↑`, `fO₂↑`, `fO₂↓`, `H₂O↑`). A legenda textual não muda.
- Associações minerais temporárias têm ícone próprio de associação, sem serem computadas como espécies minerais.
- O nome e a fórmula permanecem visíveis nos detalhes; não se deve inferir espécies distintas apenas da cor.

## Biblioteca implantada (178/178)

| Mineral | ID | Hábito/representação adotada |
|---|---|---|
| Quartzo | `quartz` | prisma de aparência hexagonal e terminação piramidal; sistema trigonal |
| Ortoclásio | `orthoclase` | bloco feldspático tabular |
| Albita | `albite` | bloco claro com estriações evocando geminação |
| Calcita | `calcite` | romboedro e planos de clivagem |
| Pirita | `pyrite` | cubo dourado estriado |
| Galena | `galena` | cubo metálico cinza-chumbo |
| Magnetita | `magnetite` | octaedro cinza-escuro |
| Olivina | `olivine` | grão verde multifacetado, composição intermediária |
| Cianita | `kyanite` | cristais laminares azuis |
| Almandina | `almandine` | granada polifacetada vinho |
| Muscovita | `muscovite` | lâminas claras sobrepostas |
| Biotita | `biotite` | lâminas escuras sobrepostas |
| Ferro nativo | `fe` | massa irregular metálica, não íon Fe²⁺ |
| Enxofre nativo | `s` | cristal ortorrômbico amarelo |
| Cobre nativo | `cu` | ramo metálico dendrítico, não Cu²⁺ |
| Ouro nativo | `gold_native` | pepita irregular dourada, não Au³⁺ |
| Prata nativa | `silver_native` | filamentos metálicos prateados, não Ag⁺ |
| Grafita | `graphite` | lâminas cinza-escuras empilhadas |
| Diamante | `diamond` | octaedro claro facetado |

Os desenhos são estilizações próprias de **ocorrências características**, não imagens diagnósticas universais. O hábito e a cor são variáveis na natureza. Grafita e diamante têm fórmula `C`, mas ícones distintos.

## Implementação

- [src/mineral-icons.js](../src/mineral-icons.js) reúne a biblioteca e a função `mineralIconMarkup` usada nas duas páginas.
- [src/game.js](../src/game.js) escolhe entre SVG, fórmula escrita e símbolo de agente. [src/game.css](../src/game.css) define a apresentação na bancada e na coleção.
- [data/atlas-layout.json](../data/atlas-layout.json) registra os grupos e as etapas de criação de cada ilustração.
- [scripts/build.mjs](../scripts/build.mjs) incorpora os SVGs ao jogo e ao atlas e verifica se cada carta mineral tem uma entrada no atlas.

Cada uma das 178 cartas minerais tem um SVG. As 19 cartas iniciais preservam os desenhos autorais originais. As demais usam modelos vetoriais com variações de cor, proporção e detalhe.

Referência para hábitos: [Mineral Identification Key, Mineralogical Society of America](https://msaweb.org/mineral-id-key/).


## Refinamento v0.15

Esta revisão individualizou a geometria e/ou a textura de 30 minerais adicionais,
priorizando entradas que anteriormente compartilhavam a mesma silhueta.
Foram revistos carbonatos (malaquita, azurita, dolomita, siderita e rodocrosita),
haletos (fluorita e silvita), feldspatos (microclínio, anortita e labradorita),
óxidos (rutilo e anatásio), serpentinas (lizardita, antigorita e crisotila),
silicatos acessórios e metamórficos (zircão, fluorapatita, silimanita, andaluzita,
cordierita, cloritoide, espodumênio, dravita e schorlita), sulfatos e zeólitas
(gipsita e estilbita) e sulfetos (marcassita, pirrotita, esfalerita e pentlandita).

As escolhas de formas e texturas partem de hábitos característicos e são estilizações.
Os polimorfos ou membros de uma mesma série que não apresentam diferenciação
macroscópica convincente podem permanecer semelhantes, com variação de cor e
microdetalhes, sem símbolos fictícios.

A revisão v0.15 comparou geometrias SVG sem usar cores para pares selecionados. Os 19 desenhos autorais da versão anterior foram preservados.

## Revisão integral v0.16

A produção da iconografia incluiu 129 cartas adicionais com direção artística
própria. Cada entrada do arquivo `src/mineral-icons.js` usa uma composição específica de
hábito e detalhe: prismático, tabular, acicular, fibroso, botrioidal, drusiforme,
lamelar, dendrítico, romboédrico, octaédrico, granular, entre outros.

A seleção de estilo encontra-se em `SPECIES_ART_DIRECTION`, com 129 pares
(hábito, detalhe) e notas concisas sobre a ocorrência ilustrada. Os modelos
vetoriais reutilizáveis combinam silhuetas distintas e acabamentos de clivagem,
geminação, bandamento, estrias, zonamento, brilho e agregação. Paletas foram
ajustadas individualmente para os minerais menos comuns, evitando tons aleatórios.

**Situação da biblioteca:**
- 19 ilustrações originais preservadas.
- 30 ilustrações individualizadas na v0.15 preservadas.
- 129 cartas remanescentes refinadas na v0.16.
- 178/178 cartas minerais possuem SVG original, sem pictogramas de família na interface.
- 177 geometrias diferentes; apenas muscovita/biotita compartilham o mesmo traçado-base,
  mantendo cores e acabamentos diferentes, coerentes com o hábito micáceo.

As figuras continuam sendo representações didáticas estilizadas: hábito, cor,
textura e sistema cristalino não são equivalentes, e variedades de uma espécie
podem ser muito distintas. As diferenças introduzidas entre membros de séries
composicionais são sugestões visuais, nunca atributos exclusivos de identificação.

A página autônoma `iconografia.html` reúne os 178 desenhos, com pesquisa,
organização por família e filtros por etapa de criação. As figuras são SVGs
inline sem dependências de rede. A aplicação principal permanece um único
`index.html` pronto para GitHub Pages.

O gerador verifica a cobertura do atlas e a suíte de navegador exercita sua busca. A auditoria de unicidade geométrica e a validação XML dos 178 SVGs fazem parte do registro da v0.16.

Referências gerais para hábito, clivagem e descrição mineralógica:
- [Mineral Identification Key, MSA](https://msaweb.org/mineral-id-key/)
- [Como identificar os minerais?, Serviço Geológico do Brasil](https://www.sgb.gov.br/como-identificar-os-minerais)
