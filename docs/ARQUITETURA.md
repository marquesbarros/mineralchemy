# Arquitetura e manutenção

## Distribuição atual

Mineralchemy é um aplicativo estático, publicado diretamente pela raiz da branch `main` no GitHub Pages. Não há servidor, serviço de autenticação, service worker ou dependências de compilação no repositório publicado.

| Caminho | Responsabilidade |
|---|---|
| `index.html` | Jogo, estilos, interface, motor de combinações e dados incorporados |
| `iconografia.html` | Galeria independente de ilustrações SVG |
| `catalogo-auditoria.html` | Interface de curadoria, incluindo rotas ativas e arquivadas |
| `tests/*.test.mjs` | Testes em Node.js do comportamento e da consistência dos dados |
| `docs/` | Histórico, critérios científicos e documentação temática |
| `.nojekyll` | Publicação direta de arquivos no GitHub Pages |

Os arquivos de páginas são autossuficientes. Não há `package.json`, fontes TypeScript versionadas ou comando de build reproduzível na árvore atual. Não documente `npm test` ou `npm run build` como caminhos de execução sem primeiro adicionar essa infraestrutura.

## Organização interna de `index.html`

O HTML possui estilos, um conjunto de dados incorporados em JavaScript e um script que:

1. Inicializa as espécies, agentes, receitas e regras, validando diagnósticos do motor;
2. Restaura o progresso local e a disposição das peças;
3. Renderiza bancada, coleção lateral, detalhes e janelas de Descobertas, Reações e Trilhas;
4. Resolve pares executáveis, registra descobertas e persiste as alterações;
5. Implementa busca, filtros, atalhos e navegação entre janelas.

A distinção entre **par executável** e **rota conceitual com preparação** é importante: uma reação de três componentes pode exigir associação intermediária. Modificar a interface não deve alterar IDs de espécies ou reações nem invalidar registros antigos.

Os dados do jogo estão incorporados no objeto `EMBEDDED`; mudanças científicas devem ser tratadas como curadoria, não como simples edição de texto.

## Registros locais

O jogo utiliza o `localStorage` para guardar progresso, peças e materiais usados recentemente. O catálogo científico de auditoria mantém suas próprias avaliações locais, independentes do progresso da partida.

A remoção de dados do navegador pode apagar esses registros. A interface de auditoria permite exportar as avaliações para preservação ou transferência.

## Padrão editorial da interface

- **Coleção lateral:** itens disponíveis para uso na bancada.
- **Descobertas:** atlas dos minerais encontrados, com os demais ocultos.
- **Reações:** registro do que o jogador já executou, com filtros por processo e produto.
- **Trilhas:** exemplos de relações mineralógicas, sem progressão obrigatória.
- **Catálogo científico:** ferramenta separada de auditoria que revela rotas ainda não descobertas.

Use rótulos curtos, explícitos e constantes. Não misture linguagem de sistema interno (IDs, revisão de versões, nomes de métodos) com instruções ao jogador. Uma combinação do jogo é **didática**; uma equação de referência não certifica que o processo ocorre em condições geológicas arbitrárias.

Acessibilidade: atualizações de conteúdo devem preservar `aria-label`, navegação por teclado, foco nos diálogos e posição do cursor nos campos de busca. Evite reconstruir o campo ativo sem restaurar a seleção.

## Verificação

Requer uma instalação recente do Node.js, com `node:test`. Na raiz do repositório:

```bash
node --test tests/*.test.mjs
```

A suíte cobre busca, catálogo, navegação por teclado, motor e revisão de processos. Verifique também manualmente no navegador:

1. Digitação e filtro `Tudo` na coleção lateral;
2. Abertura com `Tab`, ciclo com `Shift+Tab` e filtros com `←` / `→`;
3. Digitação contínua nos campos de busca de Descobertas e Reações;
4. Reações de duas peças, associações em etapas e retomada do progresso;
5. Ausência de receitas não descobertas no histórico do jogador;
6. Leitura das páginas de iconografia e auditoria em tela estreita.

**Testes de software não substituem validação mineralógica, termodinâmica ou experimental.** Consulte [Mapa científico de reações](MAPA_REACOES_CIENTIFICO.md) e [Processos hídricos](PROCESSOS_HIDRICOS_v025.md).

## Limitações e evolução

A concentração de lógica, dados, interface e CSS em um único HTML facilita a distribuição, mas dificulta manutenção, revisão de mudanças e testes de interface no navegador. Uma separação futura em arquivos-fonte e um processo de geração do pacote estático deve preservar a possibilidade de publicar uma versão autocontida e manter a compatibilidade de saves.

O repositório público não contém um arquivo `LICENSE`; eventual concessão de direitos de reutilização deve ser definida antes de tratar o código como licenciado para redistribuição.
