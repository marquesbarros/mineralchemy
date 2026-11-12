# Mineralchemy

Jogo de descoberta mineralógica. Combine íons, minerais e processos geológicos para descobrir novas espécies e transformações.

**Jogar:** https://marquesbarros.github.io/mineralchemy/

## Reações metamórficas

A bancada usa sempre duas peças. Quando uma reação envolve três reagentes, os dois primeiros formam uma **associação mineral intermediária**; ao adicionar o terceiro, são revelados os produtos da reação. A associação não é contabilizada como nova espécie mineral.

Nesta versão, há exemplos de descarbonatação, desidratação, crescimento de granada e de estaurolita, e reações de alta pressão. O registro mostra a equação completa e indica quando uma transformação é apenas esquemática. Os coeficientes estequiométricos não correspondem à quantidade de peças arrastadas.

## Como jogar

Selecione materiais na coleção, arraste-os até a bancada e encoste duas peças. As descobertas ficam salvas localmente no navegador.

## Desenvolvimento

O jogo é publicado como um `index.html` autônomo, sem dependência de servidor ou service worker. Para atualizar o site, a branch `main` deve estar configurada no GitHub Pages: **Settings → Pages → Deploy from a branch → main → /(root)**.

O código-fonte TypeScript, os testes e o catálogo mineralógico estão disponíveis no pacote de desenvolvimento da versão 0.12.
