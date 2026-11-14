# Mapa científico de reações mineralógicas

**Mineralchemy | revisão científica iniciada em 14/11/2026**

Este documento define os critérios de construção e validação do catálogo de reações. A composição mineral, uma transformação geoquímica e uma associação didática são conceitos distintos. Uma rota executável no jogo não constitui, por si só, uma reação natural demonstrada.

## 1. Estado verificável do catálogo

| Verificação | Resultado |
|---|---:|
| Minerais no conjunto publicado | 178 |
| Cartas totais (minerais, íons e reagentes) | 236 |
| Agentes ambientais | 13 |
| Reações explícitas no `EMBEDDED.reactions` | 422 |
| Equações explicitamente não simbólicas com conservação de elementos e carga | 75 |
| Rotas explícitas classificadas como simbólicas | 347 |
| Rotas explícitas que apontam para duas referências gerais, sem validação específica | 243 |

As 75 equações foram verificadas quanto à conservação dos elementos e da carga formal. Esse teste **não** avalia espontaneidade, estabilidade das fases, cinética, fluido, textura, paragênese ou representatividade do ambiente natural.

O motor combina essas entradas com rotas adicionais de `generateFamilyReactions` e `generateIntuitiveRoutes`; portanto, o inventário das 422 rotas explícitas não cobre ainda todo o grafo executável. As estatísticas de 723 combinações executáveis e 695 rotas não revisadas constam da auditoria anterior `REVISAO_GEOLOGICA_v022.md`; não são interpretadas aqui como número de transformações geológicas válidas.

O registro das rotas explícitas e das pendências está em [REGISTRO_REVISAO_REACOES.json](REGISTRO_REVISAO_REACOES.json). **Nenhuma das 422 rotas explícitas recebeu aprovação científica individual nesta fase.** A verificação de balanço e a triagem de riscos não podem ser confundidas com essa aprovação.

## 2. Tipologia científica obrigatória

| Categoria | Interpretação admissível | Exigência principal |
|---|---|---|
| Reação estequiométrica de referência | Equação global com reagentes e produtos explicitados | Conservação de massa e carga, estado de fase e condições P–T–X |
| Equilíbrio polimórfico | Fases de mesma composição e estabilidade distinta | Campo P–T e efeitos cinéticos |
| Substituição em solução sólida | Variação de composição em uma estrutura mineral | Trocas acopladas e reservatório de componentes |
| Cristalização magmática | Sequência condicionada pela evolução do líquido | Composição do fundido, temperatura, pressão e cristalização fracionada |
| Reação metamórfica | Equilíbrio entre assembléias | Composição global, sistema químico, P, T, atividade do fluido |
| Alteração hidrotermal/metassomática | Sistema aberto, com transferência de massa | Composição e fluxo de fluidos, balanço de entrada e saída |
| Intemperismo e dissolução | Alteração superficial e espécies dissolvidas | pH, Eh, aH₂O, pCO₂, transporte, fases secundárias |
| Associação didática | Pista de composição, mineralogia ou afinidade | **Nunca** apresentada como reação geológica completa |

Os tipos podem se combinar. Por exemplo, uma troca Fe–Mg pode ser um equilíbrio de solução sólida e também depender de metasomatismo; não se deve descrevê-la como simples adição de um cátion livre ao mineral.

## 3. Metadados mínimos por rota

Cada rota científica aprovada deverá distinguir:

```json
{
  "id": "identificador-estavel",
  "tipo": "reacao_estequiometrica | equilibrio | substituicao | cristalizacao | alteracao | associacao",
  "entrada_no_jogo": ["identificadores"],
  "reagentes_de_referencia": ["especies_e_coeficientes"],
  "produtos_de_referencia": ["especies_e_coeficientes"],
  "sistema": "fechado | aberto | magmatico",
  "condicoes": {
    "pressao": "campo ou não determinado",
    "temperatura": "campo ou não determinado",
    "fluido": "composicao/atividade quando pertinente",
    "potencial_redox": "fO2/Eh quando pertinente",
    "atividade_silica": "quando pertinente",
    "composicao_global": "restricao quando pertinente"
  },
  "equacao_balanceada": "equacao ou null",
  "fonte_especifica": ["DOI ou URL de estudo pertinente"],
  "nivel_evidencia": "experimental | termodinamico | observacional | didatico",
  "status": "aprovada | condicional | simbolica | revisar | descontinuada"
}
```

`entrada_no_jogo` não é sinônimo de `reagentes_de_referencia`. Agentes como calor, pressão e resfriamento são **condições de processo**, não espécies químicas.

## 4. Núcleos de processos a representar

### 4.1 Cristalização magmática

**Ramo descontínuo de Bowen:** olivina → piroxênios → anfibólios → biotita, **quando houver interação com líquido residual e composição apropriada**. O encadeamento é uma sequência petrológica, não quatro conversões universais de sólido isolado.

**Ramo contínuo:** plagioclásio cálcico → plagioclásio progressivamente sódico, por mudanças na composição das fases cristalizadas em equilíbrio com o líquido. Troca acoplada: Ca²⁺ + Al³⁺ ↔ Na⁺ + Si⁴⁺. As subdivisões composicionais não equivalem a seis minerais fixos de uma reação sucessiva.

**Equação ilustrativa:** Mg₂SiO₄ + SiO₂ → 2 MgSiO₃. É um balanço apropriado para forsterita, sílica e enstatita; sua aplicação natural exige o campo de equilíbrio adequado.

Fonte introdutória: https://opentextbc.ca/physicalgeology2ed/chapter/3-3-crystallization-of-magma/

### 4.2 Aluminosilicatos, feldspatos e micas

Cianita, andaluzita e sillimanita possuem composição Al₂SiO₅, mas **campos de estabilidade P–T diferentes**. A associação `Al³⁺ + SiO₂` não seleciona uma fase estável. As reações envolvendo polimorfos precisam explicitar a condição apropriada.

**Reação muscovita-out idealizada:** KAl₃Si₃O₁₀(OH)₂ + SiO₂ → KAlSi₃O₈ + Al₂SiO₅ + H₂O. Em outras condições, a desidratação pode envolver líquido silicático; não há conversão universal `muscovita + calor → ortoclásio`.

**Equilíbrio albita–jadeíta–quartzo:** NaAlSi₃O₈ ↔ NaAlSi₂O₆ + SiO₂, conforme P e T.

**Reação GASP:** Ca₃Al₂Si₃O₁₂ + 2 Al₂SiO₅ + SiO₂ ↔ 3 CaAl₂Si₂O₈ (grossulária, Al₂SiO₅, quartzo e anortita). A associação incompleta no jogo não é a equação completa.

Referências:
- https://www.science.smith.edu/~jbrady/petrology/metrocks-diagrams/Al2SiO5.php
- https://doi.org/10.1111/jmg.12511
- https://utc.pressbooks.pub/mineralogy/chapter/metamorphic-reactions/

### 4.3 Ultramáficas, serpentinização e carbonatação

**Serpentinização ideal:** 2 Mg₂SiO₄ + 3 H₂O → Mg₃Si₂O₅(OH)₄ + Mg(OH)₂. Identifica-se um membro ideal da serpentina e a participação da brucita, sem presumir que toda serpentinização tenha essas fases.

**Carbonatação de forsterita:** Mg₂SiO₄ + 2 CO₂ → 2 MgCO₃ + SiO₂. A mineralogia final depende do fluido, temperatura e atividade da sílica.

### 4.4 Rochas carbonáticas e calcissilicáticas

**Descarbonatação:** CaCO₃ + SiO₂ → CaSiO₃ + CO₂. O equilíbrio é condicionado à temperatura, pressão e atividade de CO₂. Reações com dolomita, talco, tremolita e diopsídio exigem a mesma disciplina.

### 4.5 Oxidação de sulfetos, minerais secundários e solos

A oxidação de pirita deve distinguir sulfato dissolvido, fases férricas secundárias e acidez. Oxidação de calcopirita ou esfalerita não forma automaticamente malaquita ou smithsonita sem os componentes adicionais, o transporte de massa e os equilíbrios necessários.

As rotas de caulinização e outras argilizações precisam registrar saída de cátions e sílica. Exemplo balanceado de hidrólise ácida: CaAl₂Si₂O₈ + 2 H⁺ + H₂O → Al₂Si₂O₅(OH)₄ + Ca²⁺. Isso não significa que a caulinita seja sempre o único produto de alteração da anortita.

Referência de reações de intemperismo sulfetado: Geological Survey of Finland, *Active sulphide mine tailings impoundments as sources...* (equações globais de oxidação, precipitação e hidrólise).

## 5. Ocorrências identificadas que exigem decisão

| Identificador | Problema | Diretriz |
|---|---|---|
| `v08-alt-muscovite-heat` | Ortoclásio como produto isolado da muscovita aquecida | Descontinuar o atalho como transformação; usar `meta-muscovite-out` com condições |
| `v08-alt-malachite-heat` | Apenas tenorita na decomposição | Explicitar CO₂ e H₂O |
| `v08-alt-anorthite-rain` | Caulinita como produto único de hidrólise | Introduzir Ca²⁺ e balanço de fluido |
| `v08-alt-actinolite-heat` | Diopsídio isolado sem tratamento de Fe, Si e água | Substituir por referência mineralogicamente completa ou reclassificar como associação |
| `v08-alt-sulfate-reduction` | Enxofre nativo tratado como destino geral do sulfato | Modelar etapas de redução e sistema redox |
| `v08-alt-iron3-reduction` | Ferro nativo por redução ambiental genérica | Restringir a condições especiais ou retirar como transformação natural |
| `v08-alt-diamond-heat` | Grafitização reduzida a aquecimento isolado | Exigir contexto P–T, cinética e estado metastável |
| `v08-alt-chalcopyrite-air` | Malaquita sem destino explícito de Fe e S | Explicitar oxidação, carbonatação e componentes em solução |
| `v08-alt-sphalerite-air` | Smithsonita sem processo de carbonatação explícito | Exigir carbono inorgânico dissolvido e água |
| `v08-alt-pyrite-reduction` | Troilita sem destino de S excedente | Complementar balanço de espécies sulfuradas |
| `v08-jadeite-1` | Pressão participa como peça, mas não é reagente químico | Preservar equação; separar agente e reagentes |
| `meta-muscovite-out` | Reação adequada em modelo simplificado; pode haver fusão | Preservar e indicar condições de aplicação |

As diretrizes acima são **triagem de correções**, não prova de que as demais rotas estejam aprovadas.

## 6. Critérios de aprovação do mapa

1. Todas as rotas explícitas e geradas devem estar inventariadas por ID e vinculadas a uma tipologia.
2. Rotas tratadas como equações químicas devem conservar elementos e carga; associações simbólicas não podem exibir equações aparentando balanceamento.
3. Cada produto mineral deve ter os componentes necessários no sistema, inclusive quando o sistema é aberto, com os reservatórios explicitados.
4. Equilíbrios, polimorfismo e séries composicionais devem conter condicionantes P–T–X e limitações pertinentes.
5. Referências genéricas servem para conceitos gerais, **não** para aprovar reações específicas.
6. Não deve haver rotas contraditórias, produtos implausíveis nem atalhos que ignorem etapas conceitualmente indispensáveis.
7. Toda remoção ou substituição preserva o reconhecimento de IDs históricos, sem permitir a execução de reações descontinuadas.
8. Cada mudança de rota executável deve ter teste de regressão, auditoria de alcance das 178 espécies e teste de não ambiguidade de pares.
9. **Status científico aprovado** só pode ser atribuído após revisão de referências e condições específicas da rota. Testes automatizados não substituem essa avaliação.

## 7. Ordem da revisão integral

1. Completar inventário das rotas geradas e resolver a divergência entre contagens de documentação e runtime.
2. Eliminar atalhos cientificamente enganosos, começando pelos casos P0/P1 no registro.
3. Auditar reações de referência balanceadas quanto ao campo de estabilidade e mecanismo.
4. Auditar rotas simbólicas por famílias e processos: silicatos, metamorfismo, sistemas magmáticos, óxidos, sulfetos, carbonatos, sulfatos, argilas, solos, hidrotermalismo e acessórios.
5. Relacionar fontes específicas a cada rota aprovada e registrar casos irredutivelmente didáticos.
6. Gerar um único catálogo científico versionado; apenas depois sincronizar o motor de jogo com esse catálogo.

**Condição de conclusão:** nenhuma rota com status `revisar` ou sem proveniência pode ser declarada cientificamente validada, mesmo que continue disponível como associação didática devidamente rotulada.
