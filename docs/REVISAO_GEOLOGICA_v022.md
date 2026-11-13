# Revisão de integridade mineralógica — Mineralchemy v0.22

## Estado do catálogo

| Métrica | Valor |
| --- | ---: |
| Minerais catalogados | 178 |
| Combinações executáveis | 723 |
| Minerais com transformação por agente | 170/178 |
| Espécies acessíveis no grafo | 178/178 |
| Testes automatizados aprovados | 122 |
| Rotas herdadas ainda pendentes de avaliação científica individual | 695 |

A simulação separa uma **combinação intuitiva** da **equação ou relação mineralógica de referência**. Balanceamento químico, acessibilidade no jogo e estabilidade termodinâmica são critérios diferentes. O catálogo não deve insinuar que cada par ocorre por simples mistura no campo, nem que reações metamórficas tenham produtos independentes da composição global, pressão, temperatura, atividade dos fluidos e cinética.

## Correções nesta versão

- **Baixa atividade de SiO₂:** a transformação rumo a nefelina ou leucita é relacionada a subsaturação em sílica; não é disparada por mero aquecimento ou adição de O²⁻. Analcima pode gerar nefelina, quartzo e água em decomposição térmica apropriada.
- **Polimorfos de sílica:** coesita e stishovita deixam de voltar a quartzo por simples resfriamento e passam a admitir descompressão, sem presumir ausência de metaestabilidade.
- **Micas:** removidas evoluções térmicas que produziam micas potássicas sem fonte de K.
- **Piroxênios e anfibólios:** diopsídio não forma tremolita por aquecimento seco. Grunerita e ferroactinolita passam a mostrar desidroxilação com produtos explicitados.
- **Carbonatos e polimorfos:** aragonita pode reequilibrar-se em calcita, enquanto a decomposição da dolomita inclui calcita, periclásio e CO₂.
- **Tectossilicatos e sulfetos:** sodalita tem rota de decomposição para nefelina e halita. Oxidação de ilmenita indica rutilo e hematita, além de intermediários possíveis.
- **Metamorfismo:** paragonita + quartzo fornece uma rota com albita, Al₂SiO₅ e H₂O, condicionada por P–T.
- **Históricos antigos:** reações abandonadas permanecem reconhecíveis ao carregar partidas antigas; deixam de ser combináveis na bancada.

## Limitações e próximas prioridades

1. **695 rotas** ainda não possuem revisão científica individual de gênese, estabilidade e produtos. Um teste de grafo não substitui curadoria petrológica.
2. O caminho descontínuo de Bowen descreve tendências de cristalização em sistema magmático, não uma reação universal entre minerais sólidos; o mesmo vale para a série cálcico–sódica de plagioclásios.
3. Séries de solução sólida (por exemplo Fe–Mg) representam mudanças de composição, não necessariamente uma troca direta com um cátion livre.
4. Cada associação importante precisa ser confrontada com fontes petrográficas, experimentais ou de equilíbrio termodinâmico.

## Referências de apoio

- [OpenGeology — cristalização do magma](https://opentextbc.ca/physicalgeology2ed/chapter/3-3-crystallization-of-magma/)
- [USGS — mineralogia e alteração de minérios](https://pubs.usgs.gov/sir/2010/5070/c/Chapter11SIR10-5070-C-3.pdf)
- [Sodalita: transformações térmicas e produtos](https://pmc.ncbi.nlm.nih.gov/articles/PMC11432373/)
- [Sílica sob alta pressão — USGS](https://pubs.usgs.gov/pp/0440l/report.pdf)
- [Análise experimental da decomposição da analcima](https://doi.org/10.1016/0024-4937(71)90122-8)
