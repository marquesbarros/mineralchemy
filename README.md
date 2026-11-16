# Mineralchemy

Jogo educativo de combinações para **revisar e fixar conhecimentos sobre minerais, sua origem e suas propriedades**. O conteúdo relaciona composição química, formação e transformação mineral por meio de descobertas progressivas.

**[Jogar no GitHub Pages](https://marquesbarros.github.io/mineralchemy/)** · **[Atlas de ilustrações](https://marquesbarros.github.io/mineralchemy/iconografia.html)** · **[Guia docente](docs/GUIA_DOCENTE.md)** · **[Referências](docs/REFERENCIAS.md)**

## Começar a jogar

Para testar esta cópia do repositório, abra `index.html` no navegador. O jogo funciona a partir do arquivo local. O link no topo abre a versão publicada no GitHub Pages.

1. Na **Coleção**, busque por **cálcio** e **carbonato**. Clique ou toque em cada peça para levá-la à bancada.
2. Use **Reagir** ou solte uma peça sobre a outra. Na primeira descoberta da calcita, a ficha abre com uma celebração breve. Pressione uma tecla ou use **Voltar à bancada** para continuar.
3. Abra **Trilhas → Continuar descobertas** e escolha a calcita para ver possíveis combinações. As pistas revelam em etapas o parceiro, a receita e o produto. Quando falta uma peça, o jogo mostra como obtê-la e permite retomar o material escolhido.

O **Atlas** dentro do jogo reúne as fichas minerais. **Reações** guarda as combinações realizadas. O progresso é salvo no navegador. Abra **Ajuda** para exportar ou restaurar uma partida. Com a preferência de movimento reduzido, a ficha de descoberta usa um destaque estático.

## Testar uma partida

Em uma partida nova, confira a primeira descoberta e repita a receita da calcita. A repetição registra a reação sem abrir outra celebração. Experimente **silício elementar + cálcio** para conferir a mensagem de par sem combinação cadastrada e os atalhos para explorar cada peça. Em **Ajuda**, exporte o progresso e restaure o arquivo em outro perfil do navegador para conferir a bancada, o histórico e o material escolhido em Trilhas.

Se encontrar um problema, registre o commit, o navegador e o dispositivo, as peças ou os passos usados, o resultado que esperava e o que aconteceu. Para aplicar em turma, use o [roteiro de piloto do guia docente](docs/GUIA_DOCENTE.md#piloto-e-avaliação).

## Manutenção e verificação

Os três HTML publicados são gerados a partir das fontes em `src/` e `data/`. Use Node.js 24 ou superior e execute os comandos na raiz do repositório.

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

O catálogo reúne **178 cartas minerais**, **272 rotas ativas**, **262 pares executáveis** e **507 rotas arquivadas**. As fichas distinguem as peças da bancada, as substâncias da equação de referência e os componentes do meio. As associações didáticas representam relações de composição e de processo. Para interpretar sua ocorrência na natureza, consulte as condições e o alcance das fontes.

A página de auditoria permite consultar combinações ainda ocultas no jogo, revisar as fontes e exportar pareceres por rota. [Auditoria local](catalogo-auditoria.html) · [Progressão](docs/PROGRESSAO.md) · [Transformações](docs/TRANSFORMACOES.md) · [Estados químicos](docs/ESTADOS_QUIMICOS.md)

## Origem

A ideia surgiu após um sonho com um jogo semelhante a [Little Alchemy](https://littlealchemy.com/). A mecânica de combinar elementos inspirou sua aplicação ao estudo de minerais. Mineralchemy é um projeto independente.

## Estado do projeto

O [histórico](docs/HISTORICO.md) documenta a linhagem de **v0.15 a v0.25**, seguida de alterações de interface. A revisão exata do código é identificada por [commit](https://github.com/marquesbarros/mineralchemy/commits/main).

A revisão científica individual de parte das rotas está pendente. A escolha de licença para código, dados e ilustrações cabe ao mantenedor.

O desenvolvimento teve apoio do **Codex (OpenAI)**; as versões dos modelos das sessões anteriores não estão registradas. A documentação foi revisada com **ChatGPT GPT-6** em 16/11/2026.

[Origem e desenvolvimento assistido](docs/ORIGEM_E_DESENVOLVIMENTO.md) · [Arquitetura](docs/ARQUITETURA.md) · [Histórico](docs/HISTORICO.md)
