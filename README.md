# Mineralchemy

**Mineralchemy** é um jogo de descoberta mineralógica para navegador. Combine componentes químicos, minerais e agentes geológicos, descubra novas espécies e explore relações entre composição e transformações minerais.

**[Jogar Mineralchemy](https://marquesbarros.github.io/mineralchemy/)** · [Atlas de ilustrações](https://marquesbarros.github.io/mineralchemy/iconografia.html)

## Como jogar

1. **Escolha materiais** na coleção lateral. Clique ou toque para adicioná-los à bancada; também é possível arrastá-los.
2. **Combine duas peças.** Arraste uma sobre a outra ou selecione duas peças e use **Reagir**. Nem todos os pares produzem uma combinação.
3. **Aproveite as descobertas.** Os materiais encontrados passam a integrar sua coleção e podem participar de novas combinações.
4. **Explore os catálogos.** Em **Descobertas**, acompanhe os minerais encontrados. Em **Reações**, consulte as combinações realizadas e organize-as por processo ou produto. Em **Trilhas**, veja exemplos de relações mineralógicas.

Algumas rotas exigem três componentes. Nesses casos, a progressão ocorre em duas etapas, com uma associação intermediária. Limpar a bancada não apaga as descobertas.

## Navegação e atalhos

| Tecla | Ação |
|---|---|
| Digitar na bancada | Inicia a busca na coleção lateral |
| `Enter` na busca lateral | Adiciona o primeiro resultado |
| `Ctrl+K` | Foca a busca lateral |
| `Ctrl+Enter` | Reage as duas peças da bancada |
| `Delete` | Limpa a bancada |
| `Tab` | Abre ou fecha **Descobertas** |
| `Shift+Tab` | Alterna **Descobertas → Reações → Trilhas** |
| `←` / `→` | Muda a categoria ou o filtro do catálogo aberto |
| `Esc` | Fecha uma janela ou limpa a busca lateral |

Os atalhos de navegação não substituem a movimentação do cursor nos campos de texto. Ao começar a buscar na coleção lateral, o filtro retorna a **Tudo** para procurar entre todas as categorias.

## Catálogos

**Coleção lateral:** reúne os materiais disponíveis para uso na bancada. Permite filtrar íons, minerais, agentes e outros compostos e buscar por nome ou fórmula.

**Descobertas:** apresenta o progresso mineralógico por categorias. Minerais ainda não encontrados aparecem ocultos; uma espécie pode pertencer a mais de um grupo de estudo.

**Reações:** registra apenas combinações já executadas. É possível agrupar as rotas por processo ou produto e aplicar filtros temáticos. As equações químicas exibidas, quando disponíveis, são referências e podem envolver outros reagentes ou condições.

**Trilhas:** apresenta relações mineralógicas ilustrativas, como sequências de cristalização e transformações. Não são caminhos obrigatórios nem universais.

## Alcance científico

O jogo utiliza **associações didáticas de descoberta**, não um simulador termodinâmico. Combinar duas peças não significa que esses materiais isolados constituam uma reação balanceada, que o processo ocorra espontaneamente ou que os produtos sejam estáveis em qualquer condição de pressão, temperatura ou composição de fluidos.

O catálogo distingue a combinação jogável de uma **equação química de referência**, quando há uma representação adequada. Mesmo uma equação balanceada não comprova a viabilidade de uma reação em determinado ambiente geológico.

O conjunto publicado contém **178 minerais**, **279 reações ativas** e **269 pares executáveis**. Esses números descrevem o conteúdo do jogo, não uma validação científica integral das rotas.

## Progresso e dados

Descobertas, histórico e disposição das peças são armazenados **localmente no navegador**. Não há conta ou sincronização entre dispositivos. Limpar os dados do site pode apagar a partida. A opção **Reiniciar descobertas** apaga o progresso local após confirmação.

## Código e desenvolvimento

O jogo é distribuído como aplicação estática, sem serviço de backend ou etapa de compilação obrigatória. O arquivo `index.html` contém a interface, o motor e os dados incorporados; `iconografia.html` e `catalogo-auditoria.html` são páginas independentes.

Para executar localmente, abra `index.html` no navegador. Para executar os testes, use uma versão recente do Node.js:

```bash
node --test tests/*.test.mjs
```

**Não existe `package.json` no repositório publicado**, portanto os comandos `npm test` e `npm run build` não se aplicam à árvore atual. O GitHub Pages serve os arquivos da raiz da branch `main`.

Leia [a arquitetura e as verificações](docs/ARQUITETURA.md) para detalhes de manutenção e [o histórico das revisões](docs/HISTORICO.md) para mudanças anteriores.

## Revisão das reações

A página [Catálogo científico de reações](catalogo-auditoria.html) permite examinar e avaliar rotas ativas ou arquivadas, registrar decisões e exportá-las em JSON ou CSV. **Atenção: ela revela receitas que podem ainda não ter sido descobertas durante o jogo.** As avaliações não modificam a partida.

Os critérios e os limites da curadoria são documentados em [Mapa científico de reações](docs/MAPA_REACOES_CIENTIFICO.md), [Processos hídricos](docs/PROCESSOS_HIDRICOS_v025.md) e [Catálogo de reações](docs/REACTIONS_CATALOG.md).
