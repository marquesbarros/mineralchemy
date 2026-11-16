# Mineralchemy

Jogo educativo de combinações para **revisar e fixar conhecimentos sobre minerais, sua origem e suas propriedades**. O conteúdo relaciona composição química, formação e transformação mineral por meio de descobertas progressivas.

**[Jogar](https://marquesbarros.github.io/mineralchemy/)** · **[Atlas de ilustrações](https://marquesbarros.github.io/mineralchemy/iconografia.html)** · **[Arquitetura](docs/ARQUITETURA.md)** · **[Referências](docs/REFERENCIAS.md)**

## O que foi desenvolvido

- **178 cartas minerais**, com representações SVG individuais.
- **279 rotas ativas**, **269 pares executáveis** e **490 rotas arquivadas**.
- **Motor de combinações** entre componentes químicos, minerais e agentes geológicos.
- **Descobertas progressivas**, com coleção de cartas, registro das reações executadas e trilhas temáticas.
- **Busca por nome ou fórmula**, filtros por categoria, navegação por teclado e interação por arrastar e soltar.
- **Catálogo de auditoria** com filtros por família, processo e pendência, pareceres vinculados à versão da rota e exportação em JSON ou CSV.
- **Progresso local** com exportação e restauração pela tela Ajuda e leitura de partidas anteriores.

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
| Interface, dados e motor | Fontes em `src/` e `data/`, incorporados ao HTML durante a geração |
| Ilustrações | SVG |
| Persistência | `localStorage` |
| Revisão de dados | `catalogo-auditoria.html` |
| Hospedagem | GitHub Pages |
| Testes | `node:test` e Playwright em Chromium |
| Servidor | Sem backend e sem autenticação |

As três páginas geradas são autônomas. O jogo armazena o progresso no navegador.

## Verificação

Use Node.js 24 ou superior para manter o projeto. Execute os comandos na raiz do repositório.

Na raiz do repositório:

```sh
npm ci
npm run build
npm run check:generated
npm test
npx playwright install --only-shell chromium
npm run test:browser
```

O fluxo do GitHub Actions verifica a geração, a integridade dos dados e os fluxos do jogo em navegador. Veja os comandos de edição e publicação na [Arquitetura](docs/ARQUITETURA.md).

## Conteúdo e referências

As combinações servem ao estudo de composição, propriedades e processos mineralógicos. **Não são uma simulação de equilíbrio termodinâmico.** Uma rota didática não estabelece, por si só, a ocorrência de uma reação na natureza.

A página de auditoria permite consultar combinações ainda ocultas no jogo e acompanhar as pendências por rota. O guia inclui atividades comentadas, folha do estudante e roteiro para um piloto em turma. [Auditoria local](catalogo-auditoria.html) · [Inventário científico](docs/REVISAO_PENDENCIAS.md) · [Guia docente](docs/GUIA_DOCENTE.md) · [Referências](docs/REFERENCIAS.md)

## Origem

A ideia surgiu após um sonho com um jogo semelhante a [Little Alchemy](https://littlealchemy.com/). A mecânica de combinar elementos inspirou sua aplicação ao estudo de minerais. Mineralchemy é um projeto independente.

## Estado do projeto

O [histórico](docs/HISTORICO.md) documenta a linhagem de **v0.15 a v0.25**, seguida de alterações de interface. A revisão exata do código é identificada por [commit](https://github.com/marquesbarros/mineralchemy/commits/main).

A revisão científica individual de parte das rotas está pendente. A escolha de licença para código, dados e ilustrações cabe ao mantenedor.

O desenvolvimento teve apoio do **Codex (OpenAI)**; as versões dos modelos das sessões anteriores não estão registradas. A documentação foi revisada com **ChatGPT GPT-6** em 16/11/2026.

[Origem e desenvolvimento assistido](docs/ORIGEM_E_DESENVOLVIMENTO.md) · [Arquitetura](docs/ARQUITETURA.md) · [Histórico](docs/HISTORICO.md)
