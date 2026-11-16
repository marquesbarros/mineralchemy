# Origem, autoria, linhagem e desenvolvimento assistido do Mineralchemy

## Origem da ideia

O Mineralchemy surgiu de uma experiência pessoal de **Lucas Marques Barros**. O autor conta que **um dia sonhou que estava jogando um jogo parecido com *Little Alchemy*** e, nesse sonho, teve uma **epifania**: desenvolver uma experiência de combinações e descobertas voltada à mineralogia e aos processos geológicos.

O jogo **Little Alchemy**, criado por **Jakub Koziol**, é reconhecido como uma inspiração na mecânica lúdica de combinar elementos e revelar novas possibilidades. A intenção do Mineralchemy é explorar esse princípio em um universo de minerais, componentes químicos e processos geológicos, com catálogo, trilhas e critérios científicos próprios.

**Créditos e independência:** *Little Alchemy* é obra de seus respectivos criadores; o Mineralchemy é um projeto independente de Lucas Marques Barros, sem afiliação oficial ao jogo ou a seus titulares. Inspiração na mecânica não significa autorização para copiar recursos, código, imagens ou marcas. [Site oficial de Little Alchemy](https://littlealchemy.com/).

## Linhagem documental das versões

| Marco | Contribuição registrada | Fonte |
| --- | --- | --- |
| **v0.15** | Refinamento de ilustrações mineralógicas | [ICONOGRAFIA.md](ICONOGRAFIA.md) |
| **v0.16** | Cobertura de 178 ilustrações SVG de minerais | [HISTORICO.md](HISTORICO.md) |
| **v0.17** | Organização temática do catálogo de reações | [REACTIONS_CATALOG.md](REACTIONS_CATALOG.md) |
| **v0.19–v0.20** | Rotas metamórficas e associações composicionais | [HISTORICO.md](HISTORICO.md) |
| **v0.22** | Auditoria inicial de integridade mineralógica | [REVISAO_GEOLOGICA_v022.md](REVISAO_GEOLOGICA_v022.md) |
| **v0.23** | Poda de rotas pouco justificáveis | [PODA_CIENTIFICA_v023.md](PODA_CIENTIFICA_v023.md) |
| **v0.24** | Busca, atalhos e jogabilidade | [HISTORICO.md](HISTORICO.md) |
| **v0.25** | Revisão de água, fluidos e intemperismo; 178 minerais, 279 reações ativas e 269 pares executáveis | [PROCESSOS_HIDRICOS_v025.md](PROCESSOS_HIDRICOS_v025.md) |
| **Posterior à v0.25** | Aprimoramentos de interface, filtros e navegação | [HISTORICO.md](HISTORICO.md), histórico Git |

A numeração acima foi extraída da **documentação presente no projeto** e não prova a existência de tags ou releases com esses números. O software em `main` pode incorporar melhorias posteriores à última versão científica documentada. Identifique instalações reproduzíveis por **SHA do commit**; veja [commits](https://github.com/marquesbarros/mineralchemy/commits/main).

## Desenvolvimento com assistência de IA

A ideia, a direção do produto e a responsabilidade pelos critérios científicos pertencem ao autor. O desenvolvimento recebeu apoio de ferramentas de programação assistida, incluindo **OpenAI Codex**, conforme informado pelo mantenedor. Não se presume que todo o código foi gerado por IA nem que um único modelo participou de todas as etapas.

| Assistente ou linhagem | Versão conhecida | Limite de rastreabilidade |
| --- | --- | --- |
| **Codex (OpenAI)**, assistente de código | **Versão/modelo histórico não verificável** na documentação pública | Não atribuir números de modelo nem build sem registro da sessão |
| **ChatGPT (OpenAI), família GPT-6** | **GPT-6**, empregado na revisão documental de 16/11/2026 | Registro desta atualização da documentação, não da criação original |
| **Git / GitHub** | SHA de cada commit | Registra mudanças de arquivos, não o modelo usado para escrevê-las |

**Sobre versões da linhagem de modelos:** o nome *Codex* identifica um produto/assistente, mas não fornece sozinho um identificador confiável para a versão da família GPT ou do modelo de programação. Para registrar versões futuras, documentar: data, assistente, nome **exato** do modelo exibido, versão do cliente se disponível, escopo da mudança, commit e testes. Histórico não comprovado deve permanecer explicitamente **não identificado**.

## Curadoria e responsabilidade

- A consistência de cada rota deve ser julgada com base em geologia e química mineral, e não pela plausibilidade superficial de uma combinação.
- A documentação distingue **reação conceitual jogável**, **equação química**, **estabilidade termodinâmica** e **contexto geológico**.
- Testes computacionais de integridade do grafo e do motor não equivalem a validação petrológica.
- Direitos de materiais externos e o estado de licenciamento do código devem ser tratados separadamente; o repositório examinado não possuía `LICENSE` em 16/11/2026.

Documentos associados: [REFERENCIAS.md](REFERENCIAS.md), [ARQUITETURA.md](ARQUITETURA.md), [HISTORICO.md](HISTORICO.md) e [MAPA_REACOES_CIENTIFICO.md](MAPA_REACOES_CIENTIFICO.md).
