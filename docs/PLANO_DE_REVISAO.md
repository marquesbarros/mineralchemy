# Revisão do Mineralchemy

O trabalho parte do commit `8df492b`. Os arquivos HTML da raiz continuam sendo as páginas distribuídas. Os dados, o código compartilhado e os modelos de página passam a ter fontes editáveis.

- [x] Gerar as três páginas com Node e configurar a checagem no GitHub Actions. Conferir IDs, contagens, pares executáveis e paridade entre os catálogos.
- [x] Estruturar tipos de material, processos, referências, condições e situação da revisão. Verificar associações, equilíbrios e casos condicionais nas fichas.
- [x] Versionar os pareceres da auditoria e testar migração, conflitos, exportações e sinalização de alterações posteriores.
- [x] Restaurar a navegação por teclado e preservar descobertas após o limite do registro de eventos. Testar arquivos de progresso, partidas antigas e falhas de armazenamento.
- [x] Executar testes no Chromium para computador e emulação de tela móvel de 360 px, incluindo toque.
- [x] Entregar documentação de manutenção, inventário de pendências científicas, atividades comentadas e roteiro do piloto em aula.

## Verificação local

O catálogo gerado contém 768 registros, com os mesmos IDs, produtos e estados de disponibilidade do levantamento inicial. As 178 cartas permanecem alcançáveis pelos 269 pares da bancada. A verificação de massa e carga cobriu as 134 equações estruturadas de rotas ativas. Passaram 64 testes no Node e 10 no Chromium.

## Pendências externas

- Revisão científica individual e conferência de fórmulas com fontes adicionais. Os casos e as lacunas estão no [inventário científico](REVISAO_PENDENCIAS.md).
- Aplicação do piloto com estudantes e análise das respostas. O roteiro está no [guia docente](GUIA_DOCENTE.md).
- Escolha de licença para código, dados e ilustrações pelo mantenedor.
- Execução hospedada do fluxo de CI, vinculada ao envio das alterações para o GitHub. A configuração e os comandos foram verificados localmente.

O cenário móvel foi testado por emulação do Chromium. Uma avaliação com aparelhos físicos e leitores de tela ampliaria a cobertura da acessibilidade.
