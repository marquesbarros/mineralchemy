# Histórico de desenvolvimento

Este documento reúne marcos das revisões do Mineralchemy. **As quantidades abaixo são registros históricos**, não métricas atuais. Para o estado publicado, consulte o [README](../README.md).

## v0.16 · Iconografia

O atlas passou a representar 178 minerais por ilustrações SVG. Foram preservadas 19 ilustrações iniciais e 30 refinamentos da v0.15; outras 129 espécies receberam representações específicas de hábitos, agregados e texturas. As ilustrações são didáticas, não diagnósticas.

Referência: [Iconografia](ICONOGRAFIA.md).

## v0.17 · Organização das reações

As combinações registradas passaram a ser agrupadas por formação de minerais, transformações mineralógicas, alterações por agentes, associações em etapas e reações de componentes. Filtros transversais passaram a destacar metamorfismo, fluidos e processos de oxirredução.

A navegação por produto foi incorporada posteriormente, sem revelar receitas não executadas.

Referência: [Catálogo de reações](REACTIONS_CATALOG.md).

## v0.19–v0.20 · Associações e rotas metamórficas

A progressão passou a enfatizar associações composicionais e transformações em sistemas abertos. Foram incluídos trajetos envolvendo polimorfos de Al₂SiO₅, feldspatos, micas, anfibólios e séries de solução sólida. Uma associação intuitiva não foi tratada, por si só, como equação química fechada.

Referência: [Rotas intuitivas](ROTAS_INTUITIVAS.md).

## v0.22 · Primeira auditoria de integridade mineralógica

O registro da época continha **178 minerais, 723 combinações executáveis e 170 de 178 minerais com pelo menos uma transformação por agente**. Foram documentadas 695 rotas herdadas ainda pendentes de revisão individual. Esses valores foram alterados nas revisões seguintes.

A auditoria corrigiu transformações envolvendo sílica sob alta pressão, feldspatoides, micas e outras espécies, distinguindo balanço químico de viabilidade geológica.

Referência: [Revisão geológica](REVISAO_GEOLOGICA_v022.md).

## v0.23 · Poda científica

Foram retirados caminhos redundantes ou geologicamente pouco justificáveis, com preservação do histórico de partidas. O instantâneo da v0.23 registrou **284 reações ativas e 270 pares executáveis**. Permaneceram atalhos simbólicos provisórios, explicitamente separados das reações cientificamente avaliadas.

Referências: [Poda científica](PODA_CIENTIFICA_v023.md) e [Registro das revisões](REGISTRO_REVISAO_REACOES.json).

## v0.24 · Busca e jogabilidade

A busca ganhou normalização de acentos, reconhecimento de fórmulas, ordenação por relevância e suporte a erros pequenos de digitação. Foram adicionados atalhos e melhorias na seleção, nas interações da bancada e no acesso à coleção.

## v0.25 · Revisão de processos hídricos

O catálogo passou a diferenciar água como reagente, intemperismo e hidrotermalismo como contextos/processos. A atualização descontinuou 15 rotas inadequadas, acrescentou 9 rotas condicionais e retomou uma reação de lizardita com quartzo.

O estado resultante registra **279 reações ativas, 269 pares executáveis e 178 minerais**. Também há **489 registros históricos arquivados** no catálogo de auditoria. A revisão não constitui certificação termodinâmica das rotas remanescentes.

Referência: [Processos hídricos](PROCESSOS_HIDRICOS_v025.md).

## Atualizações posteriores

A interface de Descobertas, o histórico de Reações e a navegação por teclado passaram por melhorias de categorização, foco e busca. As explicações e avisos públicos foram reorganizados, mantendo o conjunto mineralógico e o motor de reações.

Veja o [guia atual](../README.md) e a [arquitetura](ARQUITETURA.md).

## Revisão local de 16/11/2026

O jogo, a auditoria e o atlas passaram a ser gerados a partir de fontes compartilhadas. A revisão conservou os 768 IDs de rota, os produtos, as 178 cartas e os 269 pares da bancada. As fichas passaram a distinguir peças, equações de referência, condições e componentes do meio. A auditoria usa uma impressão digital por rota para sinalizar pareceres antigos. O jogo também ganhou backup de progresso, registro durável de descobertas e navegação por foco nos diálogos.

A revisão científica individual continua no [inventário de pendências](REVISAO_PENDENCIAS.md). O [guia docente](GUIA_DOCENTE.md) inclui a proposta de aplicação do piloto.

## Revisão com livros e atlas

A rodada seguinte incorporou referências paginadas das sete obras consultadas, ajustou as trilhas de Bowen e dos pelitos e reviu rotas de equilíbrio e alteração. O catálogo manteve os pares da bancada em 269 e passou a registrar 490 rotas arquivadas. O detalhamento das fontes e das decisões fica na [revisão bibliográfica](REVISAO_BIBLIOGRAFICA.md).

## Revisão da progressão e das transformações

O jogo passou a mostrar pistas de continuação para um material escolhido e a indicar como obter parceiros que faltam. O₂ e H₂ entraram entre as peças iniciais. A revisão arquivou atalhos de redução e duplicações da bancada, manteve os papéis de Fe(II), Fe(III) e ferro metálico e incluiu 22 transformações novas ou reativadas. O catálogo preservou o alcance das 178 cartas e passou a oferecer 262 pares executáveis. [Comparação do grafo](PROGRESSAO.md) · [Estados químicos](ESTADOS_QUIMICOS.md) · [Transformações](TRANSFORMACOES.md)
