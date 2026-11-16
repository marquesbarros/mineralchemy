# Arquitetura do Mineralchemy

Aplicação web estática, executada no navegador e publicada no GitHub Pages.

## Infraestrutura

| Componente | Implementação |
| --- | --- |
| Interface e motor | HTML, CSS e JavaScript em `index.html` |
| Dados | Catálogo `EMBEDDED` incorporado ao jogo |
| Ilustrações | SVG; página `iconografia.html` |
| Auditoria de rotas | `catalogo-auditoria.html` |
| Armazenamento | `localStorage` |
| Hospedagem | GitHub Pages, branch `main`, diretório `/(root)` |
| Testes | Node.js com `node:test`, arquivos `tests/*.test.mjs` |

Não há backend, autenticação, `package.json` ou etapa obrigatória de compilação na distribuição atual.

## Funcionamento

1. A aplicação carrega minerais, componentes, agentes e combinações do catálogo incorporado.
2. A bancada recebe duas peças e verifica se existe um par executável.
3. Descobertas e histórico de reações são atualizados e salvos localmente.
4. Os catálogos permitem consultar espécies descobertas, combinações realizadas e trilhas de formação ou transformação.

Algumas rotas usam uma etapa intermediária para representar associações de três componentes. Uma combinação jogável não equivale necessariamente a uma equação química balanceada.

## Organização

| Caminho | Conteúdo |
| --- | --- |
| `index.html` | Interface, estilos, motor e dados |
| `iconografia.html` | Atlas de ilustrações |
| `catalogo-auditoria.html` | Revisão de rotas ativas e arquivadas |
| `docs/` | Histórico, bibliografia e revisões científicas |
| `tests/` | Verificações automatizadas |
| `.nojekyll` | Publicação direta no GitHub Pages |

Os dados de progresso e as avaliações da auditoria são armazenados separadamente no navegador. A auditoria pode exportar avaliações em JSON ou CSV.

## Execução e testes

Abra `index.html` para executar o jogo localmente.

Para rodar os testes na raiz do repositório:

```sh
node --test tests/*.test.mjs
```

A suíte cobre busca, catálogo, navegação, motor de combinações e integridade dos dados. Após alterar a interface, verifique também navegação por teclado, persistência das descobertas e uso em telas pequenas.

O repositório não contém um arquivo `LICENSE`. Testes de software não substituem a revisão científica das reações.

**Documentação:** [Referências](REFERENCIAS.md) · [Origem e desenvolvimento](ORIGEM_E_DESENVOLVIMENTO.md) · [Mapa científico](MAPA_REACOES_CIENTIFICO.md).
