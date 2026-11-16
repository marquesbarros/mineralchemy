# Mineralchemy

Jogo educativo para **revisar e fixar conhecimentos sobre minerais, sua origem e suas propriedades**. A descoberta ocorre pela combinação de componentes químicos, minerais e agentes geológicos, relacionando composição, formação e transformação mineral.

**[Jogar Mineralchemy](https://marquesbarros.github.io/mineralchemy/)** · [Atlas de ilustrações](https://marquesbarros.github.io/mineralchemy/iconografia.html)

## Origem

A ideia surgiu após um sonho com um jogo semelhante a [Little Alchemy](https://littlealchemy.com/). A experiência inspirou a criação de um jogo de combinações dedicado à mineralogia. Mineralchemy é um projeto independente.

## Como jogar

1. Escolha materiais na coleção lateral e adicione-os à bancada.
2. Combine duas peças arrastando uma sobre a outra ou usando **Reagir**.
3. Descubra novos minerais e utilize-os em outras combinações.
4. Consulte **Descobertas**, **Reações** e **Trilhas** para revisar o conteúdo.

Algumas combinações exigem uma etapa intermediária. Nem todos os pares geram um resultado.

## Conteúdo

A versão documentada mais recente do catálogo reúne:

- **178 minerais**;
- **279 reações ativas**;
- **269 pares executáveis**.

As seções do jogo têm funções diferentes:

| Seção | Conteúdo |
| --- | --- |
| **Coleção lateral** | Materiais disponíveis, busca por nome ou fórmula e filtros |
| **Descobertas** | Minerais encontrados e suas informações |
| **Reações** | Combinações realizadas, agrupadas por processo ou produto |
| **Trilhas** | Sequências didáticas de formação e transformação mineral |

As combinações representam **associações didáticas**. Não constituem simulações termodinâmicas: a ocorrência real de uma reação depende, entre outros fatores, de pressão, temperatura, composição e fluidos.

## Navegação

| Tecla | Ação |
| --- | --- |
| `Enter` na busca | Adiciona o primeiro resultado |
| `Ctrl+K` | Foca a busca lateral |
| `Ctrl+Enter` | Combina as peças da bancada |
| `Delete` | Limpa a bancada |
| `Tab` | Abre ou fecha Descobertas |
| `Shift+Tab` | Alterna entre Descobertas, Reações e Trilhas |
| `←` / `→` | Navega entre categorias ou filtros |
| `Esc` | Fecha a janela ou limpa a busca |

O progresso é salvo no navegador. Não há conta nem sincronização entre dispositivos.

## Infraestrutura

| Componente | Implementação |
| --- | --- |
| Aplicação | HTML, CSS e JavaScript; execução no navegador |
| Interface, dados e motor | `index.html` |
| Iconografia | SVG; `iconografia.html` |
| Revisão de reações | `catalogo-auditoria.html` |
| Hospedagem | GitHub Pages, branch `main` |
| Armazenamento | `localStorage` |
| Testes | Node.js (`node:test`) |
| Servidor | Não há backend no repositório publicado |

Para executar localmente, abra `index.html`. Para rodar os testes:

```sh
node --test tests/*.test.mjs
```

O repositório não contém `package.json` nem exige compilação. Detalhes em [Arquitetura](docs/ARQUITETURA.md).

## Referências e revisão científica

As fontes de mineralogia, petrologia, identificação mineral e transformações geológicas estão reunidas em [Referências bibliográficas](docs/REFERENCIAS.md).

O [Catálogo científico](catalogo-auditoria.html) permite examinar e registrar avaliações das rotas. Ele inclui reações ainda não descobertas no jogo. Consulte também o [Mapa de reações](docs/MAPA_REACOES_CIENTIFICO.md) e a [Revisão de processos hídricos](docs/PROCESSOS_HIDRICOS_v025.md).

## Versões e desenvolvimento

A linhagem documentada inclui as versões **v0.15 a v0.25**, com melhorias posteriores na interface. Os marcos e alterações estão em [Histórico](docs/HISTORICO.md).

O desenvolvimento contou com apoio do **Codex (OpenAI)**. As versões dos modelos utilizados nas sessões anteriores não estão registradas. A revisão documental de 16/11/2026 utilizou **ChatGPT (GPT-6)**.

**Documentação:** [Arquitetura](docs/ARQUITETURA.md) · [Bibliografia](docs/REFERENCIAS.md) · [Origem e desenvolvimento](docs/ORIGEM_E_DESENVOLVIMENTO.md) · [Histórico](docs/HISTORICO.md).
