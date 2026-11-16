# Mineralchemy

Jogo educativo de combinações para **revisar e fixar conhecimentos sobre minerais, sua origem e suas propriedades**. O conteúdo relaciona composição química, formação e transformação mineral por meio de descobertas progressivas.

**[Jogar](https://marquesbarros.github.io/mineralchemy/)** · **[Atlas de ilustrações](https://marquesbarros.github.io/mineralchemy/iconografia.html)** · **[Arquitetura](docs/ARQUITETURA.md)** · **[Referências](docs/REFERENCIAS.md)**

## O que foi desenvolvido

- **178 minerais**, com representações SVG individuais.
- **279 reações ativas** e **269 pares executáveis** na versão científica documentada v0.25.
- **Motor de combinações** entre componentes químicos, minerais e agentes geológicos.
- **Descobertas progressivas**, com catálogo de espécies, registro das reações executadas e trilhas temáticas.
- **Busca por nome ou fórmula**, filtros por categoria, navegação por teclado e interação por arrastar e soltar.
- **Catálogo separado para auditoria de reações**, com registro de avaliações e exportação em JSON ou CSV.
- **Compatibilidade com registros anteriores**, mantendo o histórico de rotas descontinuadas.

| Recurso | Função |
| --- | --- |
| Bancada | Combinar materiais e descobrir produtos |
| Descobertas | Consultar os minerais encontrados |
| Reações | Revisar combinações por produto ou processo |
| Trilhas | Explorar sequências de formação e transformação |
| Auditoria | Examinar rotas ativas e arquivadas fora do jogo |

## Implementação

| Área | Solução |
| --- | --- |
| Aplicação | HTML, CSS e JavaScript |
| Interface, dados e motor | `index.html`, com catálogo `EMBEDDED` |
| Ilustrações | SVG |
| Persistência | `localStorage` |
| Revisão de dados | `catalogo-auditoria.html` |
| Hospedagem | GitHub Pages |
| Testes | Node.js, módulo nativo `node:test` |
| Servidor | Sem backend e sem autenticação |

O jogo é executado no navegador e armazena o progresso localmente. A distribuição não exige compilação nem instalação de dependências npm.

## Verificação

Os testes cobrem o motor de combinações, a busca, a navegação, a persistência e a integridade do catálogo. Entre as verificações de dados estão a possibilidade de alcançar os 178 minerais e a preservação dos registros de reações descontinuadas.

Na raiz do repositório:

```sh
node --test tests/*.test.mjs
```

Os testes estão disponíveis no repositório, mas ainda não há workflow de integração contínua publicado. Detalhes em [Arquitetura](docs/ARQUITETURA.md).

## Conteúdo e referências

As combinações servem ao estudo de composição, propriedades e processos mineralógicos. **Não são uma simulação de equilíbrio termodinâmico.** Uma rota didática não estabelece, por si só, a ocorrência de uma reação na natureza.

A curadoria inclui [bibliografia mineralógica](docs/REFERENCIAS.md), [critérios científicos das reações](docs/MAPA_REACOES_CIENTIFICO.md) e [revisões documentadas](docs/HISTORICO.md). A página de [auditoria](catalogo-auditoria.html) permite consultar as rotas do catálogo, inclusive as ainda não descobertas em partida.

## Origem

A ideia surgiu após um sonho com um jogo semelhante a [Little Alchemy](https://littlealchemy.com/). A mecânica de combinar elementos inspirou sua aplicação ao estudo de minerais. Mineralchemy é um projeto independente.

## Estado do projeto

O [histórico](docs/HISTORICO.md) documenta a linhagem de **v0.15 a v0.25**, seguida de alterações de interface. A revisão exata do código é identificada por [commit](https://github.com/marquesbarros/mineralchemy/commits/main).

O código atual concentra dados, interface e motor em um HTML. Algumas rotas ainda requerem avaliação mineralógica individual. O repositório não contém um arquivo `LICENSE` para o software.

O desenvolvimento teve apoio do **Codex (OpenAI)**; as versões dos modelos das sessões anteriores não estão registradas. A documentação foi revisada com **ChatGPT GPT-6** em 16/11/2026.

[Origem e desenvolvimento assistido](docs/ORIGEM_E_DESENVOLVIMENTO.md) · [Arquitetura](docs/ARQUITETURA.md) · [Histórico](docs/HISTORICO.md)
