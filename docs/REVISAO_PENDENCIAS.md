# Inventário e pendências da revisão científica

O [catálogo de auditoria](../catalogo-auditoria.html) é o inventário navegável por ID. Para cada rota, confira a versão da ficha, as peças aceitas, o tipo de representação, a fonte indicada e a justificativa registrada. O [mapa científico](MAPA_REACOES_CIENTIFICO.md) contém os critérios de avaliação.

## Inventário de referência

O catálogo no commit de partida, 8df492b, tem **768 registros**, dos quais **279 ativos** e **489 arquivados**. A bancada oferece **269 pares executáveis**. A diferença inclui rotas que o motor desdobra em etapas e registros ativos que compartilham um par de peças. A contagem de rotas ativas mede a disponibilidade no modelo do jogo. A revisão da evidência é registrada por rota.

| Procedência no catálogo de partida | Ativas | Arquivadas | Total |
| --- | ---: | ---: | ---: |
| Cadastradas explicitamente | 247 | 185 | 432 |
| Geradas por analogia ou associação intuitiva | 10 | 304 | 314 |
| Geradas por regra de família | 12 | 0 | 12 |
| Geradas para execução em etapas | 10 | 0 | 10 |
| **Total** | **279** | **489** | **768** |

A tabela agrupa os 768 registros pelo agente indicado na ficha ou, quando a ficha não declara um agente, pela primeira peça marcada como agente. Etapas geradas formam uma categoria própria. A coluna “sem agente explícito” inclui tanto combinações de componentes quanto reações geológicas com condições descritas em texto. Os grupos são uma triagem para a leitura e seguem a codificação do catálogo no commit de partida. Consulte a ficha atual para a tipologia por processo.

| Contexto codificado | Ativas a verificar | Ativas com referência genérica | Arquivadas a verificar | Arquivadas com referência genérica |
| --- | ---: | ---: | ---: | ---: |
| Água | 4 | 0 | 6 | 0 |
| Alta pressão | 4 | 3 | 1 | 8 |
| Aquecimento | 11 | 3 | 42 | 7 |
| Baixa atividade de sílica | 1 | 0 | 1 | 0 |
| CO₂ | 5 | 0 | 3 | 0 |
| Descompressão | 2 | 0 | 0 | 0 |
| Etapas | 10 | 0 | 0 | 0 |
| Hidrotermalismo | 14 | 1 | 71 | 6 |
| Impacto | 1 | 0 | 1 | 0 |
| Intemperismo | 7 | 0 | 107 | 1 |
| Meio redutor | 1 | 9 | 6 | 2 |
| Oxidação | 1 | 3 | 33 | 1 |
| Resfriamento | 6 | 1 | 5 | 0 |
| Sem agente explícito | 82 | 109 | 102 | 86 |
| Vulcanismo | 0 | 1 | 0 | 0 |
| **Total** | **149** | **130** | **378** | **111** |

Os rótulos da tabela vêm dos metadados originais. “A verificar” inclui referências primárias pertinentes e fontes cujo escopo ainda precisa ser apurado. “Referência genérica” indica apoio de contexto, como um texto que descreve a classe mineral e deixa em aberto o mecanismo de formação. Para recontar a versão de partida, leia os registros do elemento payload em catalogo-auditoria.html desse commit e agrupe pelos campos active, origin, agent, inputs e sourceSpecificity. Use o [catálogo atual](../catalogo-auditoria.html) para acompanhar os pareceres posteriores.

## Processos no catálogo gerado

| Processo exibido | Ativas | Arquivadas | Executáveis na bancada |
| --- | ---: | ---: | ---: |
| Alteração aquosa | 8 | 17 | 5 |
| Alteração hidrotermal | 14 | 77 | 14 |
| Alteração por agente | 5 | 4 | 5 |
| Associação didática | 119 | 177 | 119 |
| Cristalização magmática | 1 | 0 | 1 |
| Equilíbrio de fases | 8 | 9 | 8 |
| Intemperismo | 7 | 108 | 7 |
| Oxirredução | 14 | 42 | 14 |
| Reação em etapas | 5 | 0 | 5 |
| Reação entre componentes | 9 | 0 | 9 |
| Reação metamórfica | 9 | 0 | 5 |
| Resfriamento | 7 | 5 | 7 |
| Síntese didática | 25 | 1 | 25 |
| Transformação mineral | 32 | 0 | 29 |
| Transformação térmica | 14 | 49 | 14 |
| Troca composicional | 2 | 0 | 2 |
| **Total** | **279** | **489** | **269** |

| Especificidade bibliográfica atual | Ativas | Arquivadas | Total |
| --- | ---: | ---: | ---: |
| A verificar | 139 | 378 | 517 |
| Referência genérica | 130 | 111 | 241 |
| Escopo documentado | 10 | 0 | 10 |
| **Total** | **279** | **489** | **768** |

“Escopo documentado” indica que a ficha explica o que a fonte sustenta. Para recontar ou cruzar as tabelas em uma planilha, exporte o catálogo em CSV. Em uma tabela dinâmica, use `processo` nas linhas, `especificidade_das_fontes` nas colunas, contagem de `id` nos valores e `disponibilidade` como filtro.

### Nomenclatura das cartas

Comparei os IDs das 178 cartas minerais da versão de partida com os verbetes da lista oficial da IMA-CNMNC de novembro de 2026. A comparação ignora hífens e acentos e inclui correspondências entre IDs e nomes como Sulphur, Böhmite, Baryte e Stilbite-Ca. Há 169 correspondências com verbetes de espécie. A conferência verifica nomes e deixa a revisão de fórmulas e composições por carta como etapa de curadoria. [Lista oficial da IMA-CNMNC](https://cnmnc.units.it/files/editor/IMA_Master_List_(2026-11).pdf)

| Cartas restantes | Uso do nome no jogo |
| --- | --- |
| Olivina intermediária e os quatro intervalos entre albita e anortita | Faixas composicionais. [Hazen et al., 2023](https://www.degruyterbrill.com/document/doi/10.2138/am-2022-8539/html) |
| Biotita e lepidolita | Nomes de séries de micas. [Rieder et al., tabela 4](https://www.minsocam.org/msa/ima/ima98%2810%29.pdf) |
| Clinoptilolita | Nome coletivo sem o sufixo da espécie. [Coombs et al.](https://mineralogy-ima.org/docs/IMA-Nomenclature-e-Booklet-2019.pdf) |
| Wolframita | Nome de série para a carta de composição variável (Fe,Mn)WO₄, entre ferberita e hübnerita. [Estudo estrutural da série](https://www.mdpi.com/2075-163X/12/1/42) |

## Casos com fontes primárias conferidas

| Rota ou família de rotas | O que a fonte sustenta | Decisão e limite de uso |
| --- | --- | --- |
| [Albita + hidrotermalismo](../catalogo-auditoria.html?r=a-albite-hydrothermal-clinoptilolite) | O estudo documenta clinoptilolita em tufos riolíticos alterados e descreve precipitação ligada à dissolução de material vítreo. [De Pablo-Galán e Chávez-García, 1996](https://www.cambridge.org/core/journals/clays-and-clay-minerals/article/abs/diagenesis-of-oligocene-vitric-tuffs-to-zeolites-mexican-volcanic-belt/A020EE342F7BEE414F7B533835DCBCD1) | O artigo apoia o contexto da zeolitização. A participação da albita como precursor e o balanço de cátions continuam pendentes. É a única rota ativa do catálogo de partida para essa carta, por isso a decisão de reescrever o precursor requer teste de progressão. Na ausência de composição, clinoptilolita funciona como nome coletivo. A nomenclatura distingue as espécies com Ca, K e Na dominantes. [Coombs et al., relatório de nomenclatura da IMA](https://mineralogy-ima.org/docs/IMA-Nomenclature-e-Booklet-2019.pdf) |
| [Anortita + alta pressão](../catalogo-auditoria.html?r=a-anorthite-pressure-lawsonite) | Experimentos e análise de fases no sistema CaAl₂Si₂O₈–SiO₂–H₂O delimitam relações de estabilidade, incluindo lawsonita. [Estudo de estabilidade, 1971](https://doi.org/10.1093/petrology/12.2.379) | Exiba o balanço ideal CaAl₂Si₂O₈ + 2 H₂O ⇌ CaAl₂Si₂O₇(OH)₂·H₂O. Trate água como reagente e alta pressão como condição. A aplicação a uma rocha exige avaliar temperatura e disponibilidade de água. |
| [Albita + alta pressão](../catalogo-auditoria.html?r=v08-jadeite-1) | Experimentos localizam a curva de equilíbrio do sistema albita–jadeíta–quartzo. [Newton e Smith, 1967](https://doi.org/10.1086/627255) | A expressão NaAlSi₃O₈ ⇌ NaAlSi₂O₆ + SiO₂ é uma equação de equilíbrio. A direção favorecida depende da posição em relação à curva de pressão e temperatura. |
| [Anortita + hidrotermalismo](../catalogo-auditoria.html?r=a-anorthite-hydrothermal-prehnite) | Alteração de plagioclásio cálcico com fluido salino e prehnita como produto em um caso de baixo grau. O artigo apresenta um modelo que conserva Al e consome Ca e sílica do fluido, além de outro que conserva Ca. [Bucher et al., 2025, equações 1 e 2](https://link.springer.com/article/10.1186/s00015-024-00476-1) | Qualifique o aporte de Ca e sílica como condição do balanço que conserva Al. A equação do jogo usa H₄SiO₄ para representar sílica dissolvida. Sua escrita decorre do balanço estequiométrico, e o artigo fundamenta o modelo de transferência de massa. |
| [Nefelina + hidrotermalismo](../catalogo-auditoria.html?r=a-nepheline-hydrothermal-analcime) | Experimentos mostram dissolução parcial da nefelina e precipitação de analcima após a solução atingir supersaturação, com fases associadas que variam com o fluido. [Mikhailova et al., 2023, discussão e figura 7](https://www.mdpi.com/2075-163X/13/9/1138) | A reação ideal explicita o componente SiO₂ adicional e a água. A origem do Si dissolvido e o conjunto de produtos dependem do sistema. |
| [Forsterita ideal](../catalogo-auditoria.html?r=a-forsterite-serp) e [olivina natural](../catalogo-auditoria.html?r=a-olivine-hydrothermal) | Experimentos com olivina natural de San Carlos obtiveram lizardita ou crisotila conforme o tamanho dos grãos, com fases e produtos adicionais associados ao Fe. [Malvoisin et al., 2012, resumo e seções 3–4](https://www.normalesup.org/~malvoisin/pdf/Malvoisin_et_al_2012b_jgr.pdf) | A equação de forsterita usa o membro magnesiano ideal e ilustra conservação de massa. A rota de olivina com Fe deve mostrar lizardita como produto representativo e registrar a variação experimental de produtos. |
| [Talco + aquecimento](../catalogo-auditoria.html?r=a-talc-heat) e [tremolita + aquecimento](../catalogo-auditoria.html?r=a-tremolite-heat) | Constantes de equilíbrio foram determinadas para as duas desidratações em sistema calcissilicático simplificado. Outro estudo térmico de talco observou enstatita e sílica amorfa. [Skippen, 1971](https://doi.org/10.1086/627652) · [Estudo de decomposição térmica](https://doi.org/10.1346/CCMN.2014.0620206) | Use os produtos da equação de referência no contexto de equilíbrio descrito. A forma em que SiO₂ aparece depende das condições e da trajetória de reação. A anotação antiga de conflito “talco + aquecimento” descreve a colisão com [uma rota arquivada](../catalogo-auditoria.html?r=v08-anthophyllite-2). |
| [Lizardita + quartzo](../catalogo-auditoria.html?r=v08-alt-lizardite-quartz) | Experimentos com serpentinitos e rochas sedimentares documentam formação de talco alimentada por transferência de Si, com diferenças entre protólitos e mineralogias iniciais. [Experimentos de contato, 2025](https://link.springer.com/article/10.1007/s00410-025-02283-9) | A equação da lizardita é um balanço ideal de silicificação. A fonte apoia o mecanismo em serpentinitos. A estabilidade da assembleia específica com lizardita e o balanço de rochas naturais dependem do sistema. |
| [Calcita + quartzo](../catalogo-auditoria.html?r=meta-wollastonite-decarbonation) | Experimentos e estudo de metamorfismo de contato documentam a descarbonatação e a influência da composição do fluido. [Greenwood, 1967](https://msaweb.org/AmMin/AM52/AM52_1669.pdf) · [Estudo de campo de Mt. Morrison](https://academic.oup.com/petrology/article-abstract/42/9/1705/1408944) | Exiba CO₂ como produto e associe a direção da reação a pressão, temperatura e atividade do CO₂. É um caso adequado para a questão de transferência do [guia docente](GUIA_DOCENTE.md#piloto-e-avaliação). |
| [Série contínua dos plagioclásios](../catalogo-auditoria.html?r=i-agent-anorthite-cooling) | A série ilustra relações composicionais entre cristais e líquido magmático. Oligoclásio, andesina, labradorita e bytownita nomeiam faixas petrográficas. [Bowen, 1913](https://ajsonline.org/article/134787-the-melting-phenomena-of-the-plagioclase-feldspars) · [Hazen et al., 2023, seção sobre feldspatos](https://www.degruyterbrill.com/document/doi/10.2138/am-2022-8539/html) | As setas da trilha mostram a tendência composicional. A troca Ca–Al por Na–Si precisa de um reservatório e de condições de cristalização compatíveis. |

## Afirmações que ainda exigem revisão

- **Hidrotermalismo.** Para antofilita, grunerita, riebeckita, crisotila, clinozoisita, brookita, marcassita e chamosita, conferir precursor, fases coexistentes, componentes adicionados ou removidos e trajetória P–T. Os IDs e restrições preliminares estão na [lista de rotas hidrotermais condicionais](PROCESSOS_HIDRICOS_v025.md#transformações-hidrotermais-que-ainda-exigem-curadoria-individual).
- **Laumontita.** Verificar se o artigo de estabilidade sustenta a transformação específica de prehnita em sistema aberto com aporte de sílica e saída de Ca. O estudo trata das relações entre fases no sistema simplificado. A equação da ficha pode servir como balanço ideal enquanto a transformação específica é investigada. [Estudo de estabilidade, 1971](https://doi.org/10.1093/petrology/12.2.379)
- **Intemperismo e processos redox.** Para haloisita, conferir o precursor, a forma hidratada, a lixiviação e os controles de pH e drenagem. Para lepidocrocita, conferir o intervalo de estabilidade ou o percurso cinético diante de outras fases férricas. Na [redução de Fe(III)](../catalogo-auditoria.html?r=v08-alt-iron3-reduction), a expressão atual Fe³⁺ + e⁻ → Fe²⁺ é uma semirreação. A anotação legada sobre ferro nativo descreve o problema que motivou a alteração. A reação completa depende do doador de elétrons e das espécies presentes. [Revisão de processos hídricos](PROCESSOS_HIDRICOS_v025.md)
- **Reações de pelitos.** Na [desestabilização da muscovita](../catalogo-auditoria.html?r=meta-muscovite-out), verificar o polimorfo de Al₂SiO₅ permitido pela assembleia e o papel da fusão acima do solidus. Na trilha correspondente, a muscovita e o quartzo representam o conjunto de partida da desidratação em condições apropriadas.
- **Fórmulas e sinônimos.** Conferir se cada fórmula do jogo representa o material nomeado, uma composição ideal ou um componente de balanço. A lista oficial registra nefelina como Na₃K(Al₄Si₄O₁₆), e as rotas com NaAlSiO₄ usam o componente sódico ideal. Para a haloisita, a fórmula da espécie indica água variável, enquanto 2 H₂O caracteriza a forma ideal hidratada representada no jogo. [Lista oficial de novembro de 2026, IMA-CNMNC](https://cnmnc.units.it/files/editor/IMA_Master_List_(2026-11).pdf)
- **Rotas históricas.** Conferir o motivo e a revisão de descontinuação, começando pelas pendências P0 e P1. Um registro arquivado pode preservar uma afirmação rejeitada para explicar a mudança de versão. Mantenha essa interpretação visível ao recuperar a descoberta de uma partida antiga. [Triagem de ocorrências](MAPA_REACOES_CIENTIFICO.md#5-ocorrências-identificadas-que-exigem-decisão)

## Registro de um parecer

Registre o ID e a versão da rota, a afirmação examinada, a fonte com trecho ou figura, o tipo de evidência, o sistema estudado, a condição de aplicação e a decisão. Apresente a conservação de massa e carga à parte da evidência sobre estabilidade, mecanismo e cinética. Se uma alteração retirar ou mudar uma rota jogável, confira a disponibilidade do par, os caminhos de descoberta dos produtos, o histórico de partidas e as trilhas afetadas.

Os estudos conferidos acima permitem delimitar algumas afirmações e melhorar a descrição científica dessas rotas. A decisão sobre as demais depende de leitura por rota, inclusive quando a ficha já contém uma referência ou uma equação balanceada. A validação didática depende da aplicação do [piloto em aula](GUIA_DOCENTE.md#piloto-e-avaliação).
