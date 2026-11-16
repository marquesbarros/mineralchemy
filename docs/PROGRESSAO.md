# Continuação das descobertas

Em **Trilhas → Continuar descobertas**, escolha um material que já esteja na coleção. O jogo consulta os pares executáveis da bancada e mostra quais caminhos estão disponíveis e quais precisam de outra peça. As pistas, a receita e o produto são revelados em etapas. Ao preparar uma combinação, as peças compatíveis permanecem na bancada. A substituição das demais pede confirmação.

Depois de reagir, a bancada oferece atalhos para explorar os produtos e para voltar ao material escolhido. O foco também acompanha a partida salva e exportada. Quando uma tentativa falha, o jogo indica que o par está ausente do catálogo e permite consultar cada uma das peças. Quando uma carta termina um ramo, os precursores descobertos da combinação anterior permitem retomar o percurso.

## Percursos para testar

| Entrada | Continuação na bancada |
| --- | --- |
| Silício | Silício + O₂ → quartzo. Explore quartzo + alta pressão para coesita ou quartzo + Mg²⁺ para enstatita. |
| Ferro e enxofre | Fe²⁺ + sulfeto → troilita. Obtenha enxofre nativo por oxidação do sulfeto e use-o com a troilita para chegar à pirita. A oxidação aquosa da pirita libera sulfato, que entra nas rotas de cálcio, bário, estrôncio e chumbo. |
| Cálcio | Da calcita, siga para aragonita sob pressão, dolomita com magnésio, wollastonita com quartzo ou gipsita com sulfato em meio aquoso ácido. O quartzo pode ser obtido sem perder o foco no cálcio. |
| Magnésio | Mg²⁺ + carbonato → magnesita. Em meio aquoso ácido subsaturado, a dissolução pode liberar Mg²⁺ e bicarbonato. O ramo magmático usa periclásio e quartzo para chegar a enstatita, forsterita, lizardita e talco. |
| Chumbo | Pb²⁺ + sulfeto → galena. Em meio aquoso oxidante adequado, pode seguir para anglesita. O bicarbonato permite explorar a formação de cerussita e a liberação de sulfato. |
| Lítio, berílio e zircônio | As pistas montam o caminho para um precursor disponível no catálogo. Lítio tem caminhos que passam por muscovita, jadeíta ou dravita. Berílio usa muscovita. Zircônio usa a peça formal ortossilicato. |

Os percursos descrevem as peças do jogo. As fichas indicam se a combinação representa montagem didática, balanço de referência, equilíbrio ou processo condicional. [Transformações e condições](TRANSFORMACOES.md) · [Decisões sobre estados químicos](ESTADOS_QUIMICOS.md)

## Comparação do grafo

A referência é o commit `17d1f94`. Para cada carta inicial, a análise começa com essa carta como foco e aceita os demais materiais iniciais como parceiros. Cada rodada permite usar os produtos já descobertos naquele percurso. Um produto que já estava disponível no início pode ser usado como parceiro, mas fica fora da contagem de novas cartas. Agentes entram como peças disponíveis e ficam fora da contagem de materiais iniciais. Um mineral está sem saída quando nenhum par executável o usa para produzir algo distinto das peças de entrada.

| Medida | Antes | Depois |
| --- | ---: | ---: |
| Materiais iniciais | 39 | 43 |
| Pares com produtos novos que já podem ser executados no início | 55 | 50 |
| Materiais iniciais sem descoberta imediata no próprio percurso | 9 | 8 |
| Materiais iniciais que rendem descobertas somente na primeira rodada | 18 | 16 |
| Minerais sem saída na bancada | 99 | 81 |
| Cartas minerais alcançáveis | 178 | 178 |
| Pares executáveis | 269 | 262 |

| Foco inicial | Novas cartas minerais antes | Depois |
| --- | ---: | ---: |
| Silício elementar | 0 | 40 |
| Sulfeto | 31 | 37 |
| Cálcio | 14 | 23 |
| Magnésio | 4 | 7 |
| Ferro ferroso | 15 | 23 |
| Cobre cúprico | 5 | 11 |
| Chumbo | 2 | 3 |
| Óxido | 113 | 20 |

O₂ disponível de partida abre o silício e retira a antiga montagem do gás do caminho atribuído ao óxido. A remoção de atalhos de redução e de pares que repetiam um produto também reduz o número bruto de pares. Sete das oito entradas sem descoberta imediata têm pré-requisitos alcançáveis e pistas que permitem percorrê-los e retomar o foco. São borato, zircônio, lítio, cromo, níquel, berílio e cobalto. Ouro nativo entra como espécime inicial, sem combinação ativa.

Para reproduzir a comparação, execute `npm run build` e `node scripts/compare-progression.mjs`. O comando fornece os resultados de cada carta inicial e a lista de minerais sem saída. Os números medem os caminhos do motor. A facilidade de descobrir o próximo passo pode ser observada em aplicação com jogadores usando o [roteiro de piloto](GUIA_DOCENTE.md#piloto-e-avaliação).
