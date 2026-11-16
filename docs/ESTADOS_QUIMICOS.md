# Espécies químicas, elementos nativos e reações redox

O [registro de especiação](../data/speciation.json) documenta a disponibilidade das peças e as decisões sobre rotas. Uma carta pode representar uma espécie em solução, um componente formal de um sólido ou uma fase mineral. O estado de oxidação indica como os elétrons são contabilizados em cada caso. A fórmula da carta identifica o material usado no jogo.

| Elemento ou família | Decisão no catálogo | Consequência na bancada |
| --- | --- | --- |
| Na, K, Ca e Mg | Os cátions Na⁺, K⁺, Ca²⁺ e Mg²⁺ continuam disponíveis. As cartas dos metais ficam no histórico. | A halita usa Na⁺ e Cl⁻, a fluorita usa Ca²⁺ e F⁻, e as demais rotas usam reservatórios como carbonatos, óxidos e silicatos. |
| Al | Al(III) entra nos balanços de hidróxidos e aluminossilicatos. A hidrólise e a complexação dependem da solução. | Al³⁺ fica disponível para a associação com o componente formal O²⁻ no coríndon. O alumínio metálico fica no histórico. |
| Fe | Ferro nativo, Fe(II) e Fe(III) são materiais distintos. O ferro metálico começa disponível para representar ocorrências raras e atuar como redutor em exemplos de balanço. | Fe²⁺ e Fe³⁺ continuam com rotas próprias. A peça **Redução** em Fe³⁺ mostra a semirreação até Fe²⁺. O contexto da ficha indica a necessidade de um doador de elétrons. |
| Cu e Ag | Cobre e prata metálicos têm função própria como fases e em reações de transferência de elétrons. | A cementação de Cu²⁺ sobre Fe⁰ libera Fe²⁺. A cementação de Ag⁺ sobre Cu⁰ libera Cu²⁺. Cu⁰ também participa de uma síntese de referência da calcosita, Cu₂S. |
| Au e Si | Ouro nativo e silício elementar ficam disponíveis. As antigas cartas Au³⁺ e Si⁴⁺ ficam no histórico. | Si + O₂ representa um balanço de composição do quartzo. A forma cristalina de SiO₂ depende das condições de cristalização. |
| C, H e O | Grafita representa o carbono elementar sólido, com estrutura distinta da do diamante. H₂ e O₂ são cartas iniciais. | H₂ + O₂ representa a formação de água. Grafita + O₂ representa oxidação completa a CO₂. Os antigos atalhos para obter carbono de CO₂ e grafita de carbono ficam no histórico. |
| Cl e F | Cl⁻ e F⁻ ficam disponíveis para combinações iônicas. As cartas de Cl₂ e F₂ ficam no histórico. | As semirreações que geravam os halogênios sem contraparte deixaram a bancada. |

Na bancada, O²⁻ é um **componente formal** usado para representar óxidos sólidos. No caso da halita, Na⁺ e Cl⁻ também são espécies que ocorrem na salmoura. A cristalização depende da saturação, da atividade da água e do conjunto de sais presentes. As trocas didáticas nas séries de olivina e piroxênio usam Fe²⁺ ou Mg²⁺ como peças para representar componentes estruturais. Em rochas, as trocas dependem dos reservatórios, dos potenciais químicos e das condições de equilíbrio. [Periclásio](../catalogo-auditoria.html?r=ion-periclase) · [Halita](../catalogo-auditoria.html?r=ion-halite)

## Exemplos e alcance da evidência

| Rota | Interpretação |
| --- | --- |
| [Cobre por cementação](../catalogo-auditoria.html?r=ion-copper-native) | Fe⁰ fornece dois elétrons à redução de Cu²⁺. O estudo documenta o processo metalúrgico em águas de mina e o balanço da seção 4.2, eq. 10. [Sánchez-España et al., 2022](https://doi.org/10.3390/min12030322) |
| [Prata por cementação](../catalogo-auditoria.html?r=ion-silver-native) | Cu⁰ fornece elétrons para a deposição de Ag⁰ em solução. O exemplo faz referência à cementação experimental em soluções de nitrato. [Kahvecioglu et al., 2005](https://research.itu.edu.tr/en/publications/silver-cementation-from-nitrate-solutions-onto-copper-in-classica/) |
| [Calcosita](../catalogo-auditoria.html?r=v08-chalcocite-2) | Cu e S elementares representam os reagentes de uma síntese controlada. O relatório confirma a estrutura ortorrômbica do produto sintético. Os sulfetos de cobre naturais têm percursos de formação variados. [Relatório experimental do Bureau of Mines, p. 2](https://stacks.cdc.gov/view/cdc/233985/cdc_233985_DS1.pdf) |
| [Oxidação de Fe(II)](../catalogo-auditoria.html?r=ion-iron-oxidation) | A equação explicita O₂ e H⁺ no balanço de referência em meio ácido. O pH, a disponibilidade de oxigênio e a especiação condicionam a reação e os produtos. [Estudo de águas de drenagem ácida, USGS](https://pubs.usgs.gov/wsp/2270/report.pdf) |
| [Ferro nativo](../catalogo-auditoria.html?r=ion-iron-native) | A antiga semirreação permanece como registro descontinuado. O ferro metálico da carta representa o estado Fe⁰. Ligas Fe–C em basaltos de Disko ilustram um contexto geológico fortemente redutor. [Estudo de Disko](https://doi.org/10.1086/628967) |
| [Oxidação da grafita](../catalogo-auditoria.html?r=assemble-co2) | O balanço da rota mostra oxidação completa. Experimentos distinguem a produção de CO e CO₂ em processos concorrentes. [Estudo cinético da grafita](https://www.sciencedirect.com/science/article/pii/0008622364900430) |

As cinco semirreações de deposição de Na⁰, K⁰, Ca⁰, Mg⁰ e Al⁰ permanecem consultáveis. Suas equações isoladas não informam o sistema eletroquímico nem a origem dos elétrons. Os ensaios de Al e Mg em sais fundidos exemplificam um contexto de deposição desses metais fora da bancada aquosa representada pelo jogo. [Estudo experimental de ligas Al–Mg](https://www.nature.com/articles/s41598-025-04094-1)

## Histórico e verificação

- As rotas retiradas mantêm ID e motivo no catálogo de auditoria. Os IDs das cartas ocultas continuam reconhecidos na leitura de partidas.
- Pareceres anteriores ficam vinculados ao conteúdo da época. As versões atuais de formação de CO₂, Cu⁰, Ag⁰ e calcosita preservam os registros de partida com as peças e a equação da rota usada. Para eventos antigos sem ficha salva, um registro legado identifica a configuração anterior.
- As formas neutras e as iônicas mantêm IDs separados, inclusive quando representam o mesmo elemento químico. As partidas antigas continuam distinguindo Fe⁰, Fe²⁺, Fe³⁺ e Cu⁰ de Cu²⁺.
- As 178 cartas minerais devem continuar alcançáveis pelos pares executáveis. O gerador verifica esse requisito quando o catálogo é atualizado.
