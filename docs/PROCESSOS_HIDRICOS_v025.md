# Processos hídricos e alterações mineralógicas

## Mineralchemy v0.25 · 14 de novembro de 2026

### Princípio de classificação

**Água (`water`)** é uma espécie química que participa de dissoluções, hidratações e hidrólises simples. Sua presença não representa automaticamente uma circulação de fluidos em uma rocha ou um campo de equilíbrio metamórfico.

**Fluido hidrotermal (`hydrothermal`)** é um agente ambiental de interação rocha–fluido e transporte de massa. Não é sinônimo de H₂O pura e não fornece automaticamente íons específicos, sílica dissolvida ou um campo P–T adequado. Cada rota requer um mecanismo e restrições próprias.

**Intemperismo (`rain`)** representa alteração supergênica, com água meteórica, oxigênio, pH, Eh, lixiviação e reprecipitação conforme a transformação.

**Alta pressão (`pressure`)** representa uma condição metamórfica. A água exigida pelo balanço de uma reação hidratante pode estar disponível no sistema, mas pressão não substitui H₂O como reagente.

Uma equação balanceada conserva massa e carga. Sozinha, **não valida o caminho, a estabilidade da fase nem sua cinética**.

## Resultados da revisão

| Indicador | v0.24 | v0.25 |
|---|---:|---:|
| Minerais alcançáveis | 178 | **178** |
| Reações ativas no motor | 284 | **279** |
| Pares disponíveis na bancada | 270 | **269** |
| Rotas históricas arquivadas | 475 | **489** |
| Registros totais no catálogo | 759 | **768** |

Foram descontinuadas **15 rotas** nas quais a água era tratada como meio geológico indiferenciado ou um fluido era usado como atalho estrutural inadequado. Foram cadastradas **9 rotas condicionais** por agentes apropriados, e foi reativada **1 rota de metassomatismo com reação balanceada**. Todos os registros históricos continuam reconhecíveis pelo motor.

As 48 decisões anteriores marcadas como aprovadas pelo avaliador continuam preservadas. A atualização de condições de `a-forsterite-serp` não modifica a decisão dada a seu identificador. As novas rotas não receberam aprovação prévia.

## Rotas que continuam usando Água

| Par executável | Transformação | Critério |
|---|---|---|
| Cal + água | Portlandita | Hidratação química de CaO |
| Periclásio + água | Brucita | Hidratação química de MgO |
| Anidrita + água | Gipsita | Incorporação de água de cristalização |
| Halita + água | Na⁺ + Cl⁻ | Dissolução iônica |
| Ti⁴⁺ + água | Anatásio | Hidrólise de Ti(IV) e precipitação condicional de TiO₂, dependente de pH, complexantes e nucleação |

As duas representações de algumas reações de hidratação (síntese ou alteração por agente) permanecem nos registros para compatibilidade, mas a bancada executa apenas um resultado por par.

Em particular, **não** há mais produção de serpentina, talco ou tremolita ao juntar diretamente água com forsterita, olivina intermediária, enstatita ou diopsídio.

## Serpentinização

A equação ideal para forsterita é:

```text
2 Mg₂SiO₄ + 3 H₂O → Mg₃Si₂O₅(OH)₄ + Mg(OH)₂
```

A equação representa a conservação de massa do membro magnesiano, mas **não basta para especificar em que condições uma peridotita serpentiniza**. O processo é governado por interação com solução aquosa, dissolução–precipitação, composição do fluido, temperatura, atividade da sílica e escala temporal. Olivinas com Fe podem ainda formar magnetita e H₂ por reações redox acopladas.

- `a-forsterite-serp`: **Forsterita + Fluido hidrotermal → Lizardita + Brucita**, preservada.
- `a-olivine-hydrothermal`: **Olivina (Mg–Fe) + Fluido hidrotermal → Lizardita**, como um produto representativo; a descrição registra brucita/magnetita/H₂ como fases variáveis, não produtos universais.
- Rotas `s-serpentine-water`, `a-forsterite-water`, `s-olivine-water` e `a-olivine-water`: arquivadas.

Referências:
- <https://doi.org/10.1029/2011JB008842>
- <https://www.nature.com/articles/ncomms16107>
- <https://academic.oup.com/petrology/article/48/7/1351/1531832>

## Alteração de silicatos, zeólitas e fases hidratadas

| Percurso atual | Interpretação e ressalva |
|---|---|
| Diopsídio + fluido hidrotermal → Tremolita | Metassomatismo com entrada de Mg e sílica; uma equação explícita contabiliza a transferência de massa |
| Nefelina + fluido hidrotermal → Analcima | Alteração com **adição de sílica** e dissolução/recristalização; não é simples hidratação |
| Anortita + fluido hidrotermal → Prehnita | Sistema aberto com aporte de Ca²⁺ e sílica dissolvida |
| Prehnita + fluido hidrotermal → Laumontita | Modelo condicional de reequilíbrio com aporte de sílica e saída de Ca; estabilidade P–T–X a avaliar |
| Albita + fluido hidrotermal → Clinoptilolita | **Provisória**. A ocorrência da clinoptilolita está mais bem documentada na alteração de vidro vulcânico; o precursor e o balanço de cátions ainda precisam ser refinados |
| Anortita + alta pressão → Lawsonita | A condição é P elevada e T relativamente baixa; a reação exige H₂O disponível, que aparece na equação de referência |
| Albita + intemperismo → Haloisita hidratada | Alteração com lixiviação de Na e sílica e controle de pH/drenagem; não é hidratação direta de caulinita |
| Fe²⁺ + intemperismo → Lepidocrocita | Precipitação oxidante condicional, distinta de mudar goethita para lepidocrocita apenas por fluido |

A substituição do agente não transforma essas rotas em previsões universais de formação mineral. A composição do fluido, o sistema químico e as condições geológicas continuam essenciais.

Referências específicas:
- [Alteração de anortita e formação de prehnita](https://link.springer.com/article/10.1186/s00015-024-00476-1)
- [Dissolução e alteração hidrotermal de nefelina](https://www.mdpi.com/2075-163X/13/9/1138)
- [Estabilidade de laumontita e lawsonita no sistema Ca–Al–Si–H₂O](https://doi.org/10.1093/petrology/12.2.379)
- [Formação de clinoptilolita em depósitos vulcânicos alterados](https://doi.org/10.1346/CCMN.1996.0440303)
- [Haloisita e minerais do grupo da caulinita, USGS](https://pubs.usgs.gov/of/2001/of01-041/htmldocs/clays/kaogr.htm)
- [Precipitação de lepidocrocita/goethita em presença de Fe²⁺](https://doi.org/10.1021/es4043275)

## Rota recuperada: serpentina–sílica–talco

A antiga associação `v08-alt-lizardite-quartz` foi corrigida e reativada:

```text
Mg₃Si₂O₅(OH)₄ + 2 SiO₂ ⇌ Mg₃Si₄O₁₀(OH)₂ + H₂O
Lizardita + quartzo ⇌ talco + água
```

O balanço representa uma reação apropriada para **metassomatismo por sílica**, condicionada a P–T e à atividade da sílica. Não representa hidratação direta da enstatita. A rota mantém a descoberta de talco e, indiretamente, a progressão até pirofilita.

Referência experimental: [Reações em contatos entre rochas ultramáficas e sedimentos](https://link.springer.com/article/10.1007/s00410-025-02283-9).

## Transformações hidrotermais que ainda exigem curadoria individual

As rotas abaixo permanecem **condicionais**, não homologadas:

- `v08-anthophyllite-1`: enstatita → antofilita; exige sílica e água em campo P–T específico.
- `v08-grunerite-2`: ferrosilita → grunerita; exige sílica, água e restrições redox/Fe–Mg.
- `v08-riebeckite-2`: egirina → riebeckita; exige transferência de Na, Fe²⁺/Fe³⁺, Si e condições redox.
- `v08-chrysotile-1`: lizardita → crisotila; fluido não seleciona por si só o polimorfo.
- `v08-clinozoisite-1`: zoisita → clinozoisita; depende da recristalização e estabilidade das fases.
- `v08-brookite-1`: anatásio → brookita; seleção do polimorfo depende da química da solução.
- `v08-marcasite-1`: pirita → marcassita; envolve recristalização sob pH, Eh e especiação do enxofre específicos.
- `v08-alt-biotite-water`: biotita → chamosita; cloritização com transferência de K, Fe, Mg e Al.

Não devem ser interpretadas como transformações desencadeadas somente pela presença de um fluido quente. Os respectivos metadados no catálogo foram esclarecidos.

## Critérios de regressão

- Os 178 minerais devem permanecer alcançáveis por peças iniciais e agentes disponíveis.
- Nenhuma das 15 rotas descontinuadas pode voltar a ser executável, mas todas devem permanecer reconhecidas no histórico.
- Nenhuma transformação de forsterita/olivina, enstatita ou diopsídio por água pura pode produzir serpentina/tremolita.
- Hidratação de cal, periclásio e anidrita, além de dissolução de halita, continua disponível.
- Não se introduz par ambíguo nem alteração de IDs aprovados pelo avaliador.
- O gabarito de reações deve reproduzir o motor publicado, com status pendente nas novas rotas.

**Limitação:** a verificação estrutural e os exemplos de balanço não substituem modelagem de equilíbrio termodinâmico, avaliação experimental ou curadoria mineralógica por rota. O catálogo continua aberto à revisão do avaliador.
