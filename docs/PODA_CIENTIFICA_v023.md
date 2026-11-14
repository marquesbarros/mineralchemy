# Triagem mineralógica do catálogo — v0.23

## Estado da bancada

| Indicador | Antes da triagem (v0.22) | v0.23 |
|---|---:|---:|
| Espécies minerais | 178 | 178 |
| Pares distintos executáveis | 723 | **270** |
| Reações ativas no motor, incluindo preparação de assembléias e trios | 738 | **284** |
| Identificadores históricos/arquivados | 18 | **475** |
| Rotas intuitivas geradas e executáveis | 296 | **10** |
| Rotas explícitas executáveis | 422 | **251**, mais 1 nova referência de anortita |
| Rotas explícitas anteriores arquivadas | 0 | **171** |
| Rotas intuitivas adicionais arquivadas | 0 | **286** |
| Acesso às 178 espécies no grafo | 178 | **178** |

O catálogo versionado registra 759 identificadores: 756 preexistentes mais três de uma nova reação ternária de composição de anortita (reação geral, associação e etapa de conclusão). Os 475 identificadores arquivados permanecem reconhecidos pelo motor para preservar o histórico de partidas antigas; não podem ser executados. Os números referem-se ao código v0.23, não a reações cientificamente demonstradas.

## Critério de curadoria

As decisões são divididas em quatro níveis:

1. **Aprovação do avaliador:** 48 identificadores do arquivo de avaliações foram preservados no grafo ativo. Esse status não representa validação termodinâmica independente.
2. **Correção solicitada:** dois identificadores foram corrigidos. Mantêm-se pendentes de validação do avaliador após a alteração.
3. **Retenção provisória:** 115 associações simbólicas de versões anteriores foram mantidas por serem, no grafo atual, pontes necessárias à descoberta mineralógica. Não foram homologadas como reações naturais. Exigem substituição por rotas químicas ou petrológicas específicas quando possível.
4. **Arquivamento:** 171 rotas explícitas e 286 rotas intuitivas adicionais foram descontinuadas por redundância, imprecisão científica ou insuficiência de fundamento para executar a transformação como uma receita independente.

O método de triagem priorizou reagentes compatíveis com a composição dos produtos, menor dependência de transformações arbitrárias entre minerais sólidos, referências específicas quando presentes e a conservação das descobertas no grafo. A pontuação utilizada nessa triagem é uma **heurística operacional**, não uma prova de viabilidade termodinâmica ou autorização científica das rotas restantes.

A revisão foi aplicada aos IDs das reações. As receitas de etapas metamórficas aprovadas foram mantidas, bem como suas peças intermediárias.

## Distinção de processos envolvendo água

**Água como componente químico:** hidratação, hidroxilação, solubilização e formação de hidratos. Exemplo: anidrita + 2 H₂O → gipsita, ou hidratação ideal de forsterita formando serpentina e brucita. A presença de água não implica intemperismo.

**Intemperismo:** alteração supergênica, tipicamente em sistema aberto, com água meteórica e, conforme o caso, CO₂ dissolvido, oxigênio, variação de pH/Eh, lixiviação e precipitação secundária. Não é sinônimo de hidratação.

**Fluido hidrotermal:** transporte reativo em contexto hidrotermal; requer composição de fluido, reequilíbrio P–T e transferência de componentes. Não deve ser usado como sinônimo de água pura.

A antiga entrada `s-goethite` passou de **hematita + água** para **hematita + intemperismo**, preservando o balanço químico de referência Fe₂O₃ + H₂O → 2 FeOOH como expressão global idealizada, e explicitando que a transformação pode depender de dissolução, reprecipitação, atividades e condições redox. A duplicata `a-hematite-water` e o conflito `v08-lepidocrocite-2` foram arquivados.

A reação de referência não deve ser lida como hidratação espontânea de um grão de hematita por contato direto com água; a mineralogia ferruginosa e as fases de reprecipitação dependem das condições do meio.

Referência: [USGS, ferric oxyhydroxides](https://pubs.usgs.gov/pp/0650b/report.pdf).

## Estados de oxidação e espécies iônicas

Íons, componentes estruturais e elementos nativos **não são espécies equivalentes**. Trocar Fe²⁺ por Fe metálico altera o balanço de elétrons e o significado da reação. O mesmo vale para Ca²⁺, Mg²⁺, Na⁺ e K⁺, que não podem ser substituídos indiscriminadamente por metais nativos em processos geológicos.

Na primeira redução de redundâncias:

- `Au³⁺` e o falso acesso obrigatório via sua redução foram retirados da coleção inicial; ouro nativo tornou-se peça inicial.
- `Si⁴⁺` como cátion livre foi retirado da coleção inicial, assim como suas duas rotas sintéticas de conversão; silício elementar torna-se componente inicial do jogo, não espécie considerada comum em rochas naturais.
- As cartas de íons arquivadas permanecem identificáveis em históricos, mas deixam de aparecer na coleção e na bancada restaurada.

Os demais íons foram mantidos até a revisão das reações que efetivamente dependem de suas valências, precipitação ou substituições composicionais. A redução do número de cartas iônicas não é usada como critério para falsificar a química das reações.

A entrada `v08-alt-iron3-reduction` agora representa a semirreação **Fe³⁺ + e⁻ → Fe²⁺**, e não formação direta de ferro metálico. Reduções posteriores até Fe⁰ requerem outras condições e não devem ser confundidas com a redução comum de Fe³⁺ em meios naturais.

Referência: [USGS, Chemical Characteristics of Natural Water](https://pubs.usgs.gov/wsp/1473/report.pdf).

## Restituição de uma origem geologicamente explícita para anortita

Foi incluída a reação ternária de composição de anortita a partir de óxidos:

**CaO + Al₂O₃ + 2 SiO₂ → CaAl₂Si₂O₈**

A associação inicial cal + coríndon é completada com quartzo. O produto é representado como cristalização a partir de componentes em composição de líquido apropriada, não formação espontânea por justapor minerais sólidos à temperatura ambiente.

A série composicional de plagioclásios continua disponível na sequência anortita–bytownita–labradorita–andesina–oligoclásio–albita. Nesse contexto, o resfriamento representa evolução do líquido residual e a composição de cristais em equilíbrio com ele. Não é transformação unidirecional de um cristal isolado.

Referências:
- [Crystallization of anorthite from CaO–Al₂O₃–SiO₂ glasses](https://www.cambridge.org/core/journals/mineralogical-magazine/article/abs/crystallization-of-anorthite-from-caoal2o3sio2-glasses/4402F49A240C85DACF09415C96D7A4A6)
- [Bowen's Reaction Series, Physical Geology](https://opentextbc.ca/physicalgeologyh5p/chapter/crystallization-of-magma/)

## Limitações preservadas para a próxima revisão

- O motor ainda inclui 115 atalhos composicionais `v08` não individualmente homologados, retidos por necessidade de progressão. Algumas dessas receitas podem precisar ser substituídas, mesmo que um mineral deixe de ser alcançável temporariamente, se não existir reação defensável.
- As duas reações ternárias geradas por regra de família para diopsídio e hedenbergita não têm, nesta versão, uma etapa de associação acessível no quadro; não foram contadas nos 270 pares executáveis.
- A conservação de massa/carga verificada nas equações de referência não constitui validação experimental, de equilíbrio de fases nem de caminho reacional.
- O julgamento de cada reação deve considerar sistema químico, espécies portadoras dos componentes, condições P–T–X, balanço, estabilidade de fases e fontes mineralógicas específicas.
- A passagem de uma rota para o arquivo preserva seu ID e a consulta no [catálogo completo de auditoria](../catalogo-auditoria.html), permitindo revisões posteriores sem recriar a rota artificialmente.

## Comandos de verificação

A árvore fonte possui testes em `tests/poda-cientifica.test.mjs` para regressão da cobertura das espécies, integridade do motor, persistência de histórico, conservação das avaliações já aprovadas, hidratação e intemperismo e a semirreação do ferro. Esses testes representam garantias de software e não substituem curadoria científica individual.
