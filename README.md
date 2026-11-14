# Mineralchemy

Jogo de descoberta mineralógica. Combine íons, minerais e condições geológicas
para descobrir espécies e transformações, incluindo reações metamórficas em etapas.

**[Jogar](https://marquesbarros.github.io/mineralchemy/)** · **[Atlas dos 178 ícones](https://marquesbarros.github.io/mineralchemy/iconografia.html)**

## Busca por relevância

A pesquisa da bancada aceita **nomes com ou sem acentos**, ignora diferenças entre maiúsculas e minúsculas e reconhece fórmulas sem subscritos (por exemplo, `Fe2O3` para `Fe₂O₃`). Os resultados são organizados por relevância: nome exato, fórmula exata, início do nome, palavras no nome, correspondências secundárias e família. Se não houver correspondência direta, pequenos erros de digitação podem gerar sugestões aproximadas.

A primeira correspondência fica em destaque e **Enter** adiciona essa peça. Foram incluídos sinônimos de agentes; por exemplo, pesquisar `fluido hidrotermal` encontra **Hidrotermalismo**, preservando o ID `hydrothermal` e a compatibilidade das receitas existentes.

## Revisão de processos hídricos · v0.25

O jogo distingue agora **Água**, **Intemperismo** e **Hidrotermalismo** pelo processo que representam. Água continua sendo um reagente de hidratação, hidrólise ou dissolução; não é um agente universal de alteração metamórfica e hidrotermal. A serpentinização de olivina/forsterita passa a depender de fluido hidrotermal e de condições específicas de reação.

Foram descontinuados 15 caminhos inadequados, criadas 9 rotas condicionais e reativada uma reação mineralógica balanceada de lizardita + quartzo → talco + água. O motor possui **279 reações ativas**, **269 pares executáveis** e mantém **178 minerais alcançáveis**. Os 489 registros arquivados continuam disponíveis no histórico e no gabarito de auditoria.

As rotas hidrotermais remanescentes não constituem aprovação termodinâmica: exigem revisão de P–T–X, balanço de massa, atividade dos fluidos e mecanismos. Veja a [revisão de água, intemperismo e hidrotermalismo](docs/PROCESSOS_HIDRICOS_v025.md) ou [avalie o catálogo atualizado](catalogo-auditoria.html).

## Interação e busca · v0.24

A busca da coleção é insensível a acentos, aceita formas Unicode equivalentes e pode ser iniciada digitando uma letra ou outro caractere imprimível. **Enter** adiciona o primeiro resultado visível, limpa a busca e retira o foco do campo, para permitir **Delete** limpar a bancada. **Ctrl+K** foca a pesquisa e **Ctrl+Enter** executa uma reação com as peças da bancada.

**Tab** abre e fecha o catálogo de descobertas (atlas mineralógico) fora dos campos e controles interativos. **Shift+Tab** alterna em ciclo entre Descobertas, Reações e Trilhas, sem interferir na digitação. Dentro de Descobertas e Reações, **←** e **→** navegam pelos filtros e categorias existentes; quando o foco está no seletor Processo/Produto, as mesmas setas alternam o agrupamento. Trilhas não possui submenus. Os atalhos não recolhem a coleção lateral da bancada. Ao iniciar uma pesquisa nessa coleção, o filtro volta automaticamente para **Tudo**, incluindo íons, minerais, agentes e compostos. Letras como **R** e **C** não são mais atalhos isolados, pois devem poder iniciar a digitação. Na bancada, arrastar uma peça e soltá-la fora da área remove essa instância, sem apagar as descobertas. Se houver excesso de peças, o botão **Reagir** avisa sobre a quantidade; reações de três componentes continuam usando associações intermediárias.

Sem pesquisa, a coleção usa ordem alfabética, com a faixa de **Usados recentemente** exclusivamente na aba **Tudo**. Durante uma pesquisa, os resultados são ordenados por relevância. As categorias exibidas são **Tudo, Íons, Minerais, Agentes e Compostos**. O agente identificado internamente como `reduction` agora é chamado **Redução**, mantendo compatibilidade com partidas existentes.

## Como jogar

A bancada combina sempre duas peças. Quando uma reação envolve três reagentes,
os dois primeiros formam uma associação mineral temporária; o terceiro completa
a transformação. A reação pode revelar vários produtos ao mesmo tempo.
O progresso e o histórico ficam salvos localmente no navegador.

## Curadoria científica do catálogo · v0.23

A triagem reduziu a bancada de **723 para 270 pares executáveis**, preservando as **178 espécies minerais** e os IDs históricos de reações descontinuadas. O motor possui 284 reações ativas e 475 registros arquivados. As 48 rotas aprovadas pelo avaliador foram preservadas; duas foram corrigidas conforme comentários recebidos.

A distinção entre intemperismo, hidratação e fluido hidrotermal é explícita. A redução Fe³⁺ + e⁻ → Fe²⁺ substitui a conversão direta a ferro nativo; a formação de goethita a partir de hematita agora utiliza o agente de intemperismo. Ouro nativo e silício elementar substituem dois íons iniciais redundantes, sem equiparar quimicamente os demais íons a metais.

Os cortes incidiram principalmente sobre associações intuitivas redundantes ou sem fundamentação suficiente. **Ainda existem 115 atalhos simbólicos provisórios** necessários à progressão atual. Eles não são tratados como reações naturais aprovadas. O histórico antigo continua reconhecível, sem reativar rotas arquivadas.

Consulte o [catálogo de reações gabaritado para avaliação](catalogo-auditoria.html), o [registro completo](docs/REGISTRO_REVISAO_REACOES.json) e a [curadoria e limites científicos da v0.23](docs/PODA_CIENTIFICA_v023.md).

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

O histórico de experimentos agrupa as **rotas realizadas** em cinco seções: formação de minerais, transformações mineralógicas, alterações por agentes, associações em etapas e reações de componentes. As seções mostram contadores de rotas registradas e disponíveis, mas **não revelam equações nem produtos de reações ainda não realizadas**.

As reações realizadas podem ser organizadas **por processo** ou **por produto**. No segundo modo, cada produto reúne as rotas que o geraram e uma reação com múltiplos produtos aparece em cada grupo correspondente, sem revelar receitas ainda não realizadas.

Os filtros temáticos são transversais: metamorfismo, H₂O/fluidos, oxirredução, formações, transformações, agentes e etapas. Uma rota pode corresponder a mais de um filtro, mas aparece apenas uma vez na listagem principal. Pesquisa por reagentes, produtos e equações já realizados.

A classificação das reações é independente do motor de descoberta; o histórico antigo e os dados locais continuam válidos. Consulte [as categorias das reações](docs/REACTIONS_CATALOG.md).

## Combinações intuitivas e química de referência

As peças combinadas representam uma associação de descoberta baseada na composição ou em processos mineralógicos. Elas não precisam coincidir termo a termo com os reagentes de uma reação completa. No histórico, os ícones mostram as peças efetivamente combinadas; a seção de referência apresenta uma equação estequiometricamente balanceada quando há um exemplo químico representativo. Para polimorfos, registra-se a equivalência composicional; para soluções sólidas e associações sem balanço único, mostra-se a fórmula do produto, sem criar equações artificiais. Uma equação balanceada conserva elementos e carga, mas não comprova, isoladamente, uma via de formação viável ou um campo de estabilidade.


## Rotas de descoberta e transformações · v0.19

As combinações funcionam como **associações intuitivas**, sem exigir que duas peças formem uma reação química estequiometricamente fechada. Nas séries de solução sólida, adicionar Fe²⁺ ou Mg²⁺ pode deslocar a composição em sentidos opostos; na plagioclase, Ca²⁺ e Na⁺ percorrem a sequência albita–anortita em etapas.

As alterações por agentes ambientais representam processos em sistemas abertos com disponibilidade de fluidos, gases e componentes geológicos, e não a transformação automática de um mineral por um único reagente isolado.

As novas rotas e a cobertura de transformações por agentes estão documentadas em [Rotas intuitivas e transformações](docs/ROTAS_INTUITIVAS.md). Algumas espécies resistentes não recebem transformação adicional quando isso exigiria inventar um produto sem suporte mineralógico. As descobertas existentes e os históricos salvos continuam compatíveis.

## Tecnologia e publicação

O jogo é distribuído em `index.html`, sem service worker ou dependências de
servidor. O atlas `iconografia.html` é autônomo e pode ser publicado na mesma
raiz. O GitHub Pages utiliza a branch `main`, diretório `/(root)`.

Na árvore-fonte, o código TypeScript, os dados e os testes permitem reconstruir
o pacote estático por `npm test` e `npm run build`.
## Aluminosilicatos e rotas metamórficas · v0.20

Alumínio e quartzo permitem alcançar Al₂SiO₅. Os polimorfos andaluzita, cianita e sillimanita, combinados com Na⁺, K⁺ ou Ca²⁺, conduzem a feldspatos em rotas intuitivas de sistema aberto. Feldspato potássico + Al₂SiO₅ pode produzir muscovita e quartzo, enquanto anfibólios com potássio ou fluidos hidrotermais apropriados podem conduzir a biotita ou flogopita. A caulinita permanece sobretudo um produto de alteração; seu aquecimento isolado não reconstitui feldspatos.

As equações químicas de referência incluem componentes adicionais e não pretendem igualar o balanço das duas peças. Consulte [o catálogo de rotas](docs/ROTAS_INTUITIVAS.md).


## Rotas metamórficas intuitivas · v0.20

As descobertas partem de relações petrológicas, não de uma exigência de que o par escolhido seja, isoladamente, uma equação balanceada. A combinação Al³⁺ + quartzo ou coríndon + quartzo aproxima o jogador dos polimorfos Al₂SiO₅. Cianita, andaluzita e sillimanita podem ser associadas a Na, K ou Ca para encontrar feldspatos, com a sílica e as condições geológicas tratadas como componentes ambientais do modelo.

As rotas alternativas incluem cianita + ortoclásio → muscovita; cianita + albita → paragonita; hornblenda + K ou fluido hidrotermal → biotita; tremolita + K → flogopita; e retornos envolvendo feldspatos e argilominerais em sistemas abertos. A equação de referência, quando apresentada, é independente da associação intuitiva e deve representar um processo balanceado. Uma associação no jogo não implica transformação automática em qualquer condição geológica.

## Revisão de integridade mineralógica · v0.22 (histórico)

O catálogo possui **178 minerais**, **723 combinações executáveis** e **170/178 minerais com pelo menos uma transformação por agente**. As 122 verificações automatizadas passam, incluindo acessibilidade das espécies, ausência de pares conflitantes e preservação de partidas antigas.

A mecânica de misturar duas peças é uma **associação de descoberta**, não uma equação balanceada por definição. O histórico separa a combinação do jogador de uma referência química quando ela é defensável. **695 rotas herdadas continuam pendentes de revisão mineralógica individual**; os testes de software não certificam estabilidade ou mecanismo geológico.

Nesta revisão, nefelina e leucita exigem baixa atividade de sílica ou rotas de decomposição apropriadas; coesita e stishovita retornam a quartzo por descompressão, em vez de resfriamento isolado. Foram descontinuados 18 atalhos indevidos (como micas potássicas sem K e hidratação de piroxênio por aquecimento seco), preservando os eventos antigos no histórico. Foram corrigidas as transformações térmicas de aragonita, dolomita, grunerita, ferroactinolita e sodalita, além de paragonita + quartzo e oxidação de ilmenita.

Veja [a auditoria e limitações científicas](docs/REVISAO_GEOLOGICA_v022.md).
