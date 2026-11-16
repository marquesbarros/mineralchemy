# Referências científicas, técnicas e inspiração do Mineralchemy

O Mineralchemy é um **jogo didático de descoberta**, não um simulador termodinâmico. Esta lista diferencia a **inspiração lúdica**, as **referências gerais de mineralogia** e as **fontes citadas em revisões específicas de reações**. Uma referência temática não é validação científica de todas as receitas do catálogo.

## 1. Inspiração em design de jogos

**KOZIOL, Jakub; equipe de *Little Alchemy*.** *Little Alchemy*. [Site oficial](https://littlealchemy.com/) · [Página do criador](https://jakubkoziol.com/projects/).

**Relação com o Mineralchemy:** a descoberta progressiva por combinação de elementos inspirou a proposta lúdica. A história pessoal dessa inspiração está em [ORIGEM_E_DESENVOLVIMENTO.md](ORIGEM_E_DESENVOLVIMENTO.md). *Little Alchemy* e *Mineralchemy* são projetos distintos. Esta atribuição não representa endosso, afiliação, compartilhamento de direitos ou reutilização automática de código e arte.

## 2. Mineralogia, composição e propriedades

**PERKINS, Dexter (org.).** *Mineralogy*. Geosciences LibreTexts, material didático online. [Livro](https://geo.libretexts.org/Bookshelves/Geology/Mineralogy_%28Perkins_et_al.%29) · [Variação composicional em minerais](https://geo.libretexts.org/Bookshelves/Geology/Mineralogy_%28Perkins_et_al.%29/02%3A_Mineral_Chemistry/2.05%3A_Compositional_Variation_in_Minerals).

**Escopo:** organização de famílias minerais, componentes químicos, substituições e soluções sólidas. Não autoriza representar uma troca de íons na bancada como reação química direta sem balanço e condições.

**MINERALOGICAL SOCIETY OF AMERICA.** *Mineral Identification Key*. [Consulta](https://msaweb.org/mineral-id-key/).

**Escopo:** critérios descritivos de hábito e propriedades mineralógicas empregados como apoio à iconografia. Ver [ICONOGRAFIA.md](ICONOGRAFIA.md).

**SERVIÇO GEOLÓGICO DO BRASIL (SGB).** *Como identificar os minerais?* [Consulta](https://www.sgb.gov.br/como-identificar-os-minerais).

**Escopo:** recurso didático de identificação e propriedades. Não valida a identidade de uma espécie por uma ilustração SVG estilizada.

## 3. Petrologia e processos geológicos

**EARLE, Steven (2019).** *Physical Geology*, 2nd edition. BCcampus Open Education. [Livro](https://opentextbc.ca/physicalgeology2ed/) · [Cristalização do magma](https://opentextbc.ca/physicalgeology2ed/chapter/3-3-crystallization-of-magma/).

**Escopo:** discussão introdutória de cristalização e processos geológicos. Sequências de formação no jogo são tendências contextuais, não reações universais entre dois sólidos.

**MALVOISIN, B.; BRUNET, F.; CARLUT, J.; ROUMÉJON, S.; CANNAT, M. (2012).** Serpentinization of oceanic peridotites: 2. Kinetics and processes of San Carlos olivine hydrothermal alteration. *Journal of Geophysical Research*, **117**, B04102. DOI: [10.1029/2011JB008842](https://doi.org/10.1029/2011JB008842).

**Escopo:** exemplo de referência científica específica citada na revisão de processos hídricos. Experimentos e taxas de alteração não podem ser generalizados para todo par de cartas do jogo.

### Bibliografia das auditorias e das rotas

Os documentos abaixo trazem **fontes adicionais associadas às transformações discutidas** e explicitam ressalvas sobre balanço, cinética e condições de estabilidade:

- [Mapa científico de reações](MAPA_REACOES_CIENTIFICO.md): tipologia científica, limites das transformações e fontes temáticas.
- [Revisão geológica v0.22](REVISAO_GEOLOGICA_v022.md): correções e links para literatura de fases e alterações.
- [Poda científica v0.23](PODA_CIENTIFICA_v023.md): retirada de associações redundantes ou frágeis.
- [Processos hídricos v0.25](PROCESSOS_HIDRICOS_v025.md): separação entre água, fluidos hidrotermais e intemperismo, com fontes de reações selecionadas.
- [Rotas intuitivas](ROTAS_INTUITIVAS.md): associação entre materiais, soluções sólidas e limites interpretativos.
- [Registro de revisão de reações (JSON)](REGISTRO_REVISAO_REACOES.json): decisões registradas e estados das rotas.

**Nota metodológica:** algumas rotas do catálogo ainda carecem de revisão individual. Equações balanceadas não demonstram espontaneidade ou estabilidade sem condições de pressão, temperatura, atividade dos componentes, estado de oxidação e cinética.

## 4. Documentação técnica

- [GitHub Pages](https://docs.github.com/en/pages): hospedagem de páginas estáticas.
- [Node.js `node:test`](https://nodejs.org/api/test.html): execução dos testes locais.
- [Web Storage API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API): persistência local do jogador.
- [SVG (MDN)](https://developer.mozilla.org/en-US/docs/Web/SVG): formato vetorial dos ícones ilustrativos.

## 5. Como citar

Para citar **o jogo**, informe *Mineralchemy*, **Lucas Marques Barros**, a URL [github.com/marquesbarros/mineralchemy](https://github.com/marquesbarros/mineralchemy), a data de acesso e o SHA da revisão do Git consultado. Os marcos v0.16–v0.25 representam uma **linhagem documental** e não devem ser confundidos automaticamente com releases Git etiquetadas.

Para citar **uma transformação mineralógica** ou uma imagem, consulte e cite também a fonte científica específica e os direitos do respectivo material. A existência de uma referência nesta lista não valida todas as rotas de descoberta.
