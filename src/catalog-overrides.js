/** Auditoria 14/11/2026. Reações retiradas permanecem reconhecíveis em históricos.
 * Uma rota mantida para alcançar espécie não equivale a reação cientificamente aprovada.
 * Íons são componentes com valência, não sinônimos dos elementos nativos.
 */
const CATALOG_RETAINED_INTUITIVE = new Set([
    "i-pair-leucite-quartz",
    "i-pair-quartz-forsterite",
    "i-agent-anorthite-cooling",
    "i-agent-bytownite-cooling",
    "i-agent-labradorite-cooling",
    "i-agent-andesine-cooling",
    "i-agent-oligoclase-cooling",
    "i-agent-coesite-decompression",
    "i-agent-stishovite-decompression",
    "i-agent-sodalite-heat"
]);
const CATALOG_RETAINED_V08_SYMBOLIC = new Set([
    "v08-molybdenite-1",
    "v08-acanthite-1",
    "v08-anglesite-1",
    "v08-barite-1",
    "v08-celestine-1",
    "v08-cerussite-1",
    "v08-chalcanthite-1",
    "v08-cinnabar-1",
    "v08-ferberite-1",
    "v08-galena-1",
    "v08-hubnerite-1",
    "v08-realgar-1",
    "v08-rhodochrosite-1",
    "v08-scheelite-1",
    "v08-smithsonite-1",
    "v08-stibnite-1",
    "v08-strontianite-1",
    "v08-uraninite-1",
    "v08-witherite-1",
    "v08-azurite-2",
    "v08-cassiterite-1",
    "v08-rutile-1",
    "v08-manganite-2",
    "v08-chlorargyrite-1",
    "v08-hydroxylapatite-1",
    "v08-monazite_ce-1",
    "v08-sylvite-1",
    "v08-vivianite-1",
    "v08-xenotime_y-1",
    "v08-zircon-1",
    "v08-zoisite-1",
    "v08-boehmite-2",
    "v08-chalcocite-2",
    "v08-paragonite-2",
    "v08-beryl-1",
    "v08-cobaltite-1",
    "v08-halloysite-1",
    "v08-lawsonite-1",
    "v08-prehnite-1",
    "v08-anatase-2",
    "v08-aragonite-2",
    "v08-clinoptilolite-2",
    "v08-laumontite-2",
    "v08-antigorite-1",
    "v08-chrysotile-1",
    "v08-clinozoisite-1",
    "v08-lepidocrocite-1",
    "v08-marcasite-1",
    "v08-microcline-1",
    "v08-nepheline-1",
    "v08-pyrolusite-1",
    "v08-actinolite-1",
    "v08-aegirine-1",
    "v08-analcime-1",
    "v08-arsenopyrite-1",
    "v08-bornite-1",
    "v08-chromite-1",
    "v08-clinochlore-1",
    "v08-almandine-1",
    "v08-alt-biotite-water",
    "v08-annite-1",
    "v08-cordierite-1",
    "v08-cristobalite-2",
    "v08-dolomite-1",
    "v08-ankerite-1",
    "v08-epidote-1",
    "v08-ferroactinolite-1",
    "v08-fluorapatite-1",
    "v08-grossular-1",
    "v08-andradite-1",
    "v08-grunerite-2",
    "v08-ilmenite-1",
    "v08-kirschsteinite-1",
    "v08-lepidolite-1",
    "v08-monticellite-1",
    "v08-pigeonite-1",
    "v08-pumpellyite_mg-1",
    "v08-riebeckite-2",
    "v08-sodalite-1",
    "v08-spessartine-1",
    "v08-spodumene-1",
    "v08-stilbite-1",
    "v08-tephroite-1",
    "v08-tridymite-2",
    "v08-uvarovite-1",
    "v08-wolframite-1",
    "v08-chloritoid-2",
    "v08-ferrohornblende-2",
    "v08-jarosite-2",
    "v08-alunite-1",
    "v08-leucite-2",
    "v08-montmorillonite-1",
    "v08-nontronite-1",
    "v08-orpiment-2",
    "v08-pargasite-1",
    "v08-dravite-1",
    "v08-glaucophane-1",
    "v08-elbaite-1",
    "v08-schorl-2",
    "v08-magnesiohornblende-2",
    "v08-pentlandite-2",
    "v08-pyrophyllite-2",
    "v08-titanite-2",
    "v08-topaz-2",
    "v08-alt-jadeite-pressure",
    "v08-andalusite-1",
    "v08-anthophyllite-1",
    "v08-brookite-1",
    "v08-clinoenstatite-1",
    "v08-coesite-1",
    "v08-stishovite-2",
    "v08-diaspore-1",
    "v08-pyrrhotite-1",
    "v08-sanidine-1",
    "v08-alt-iron3-reduction"
]);
const CATALOG_RETIRED_EXPLICIT = new Set([
    "a-hematite-water",
    "ion-quartz",
    "ion-gold-native",
    "ion-silicon-neutral",
    "v08-albite-1",
    "v08-albite-2",
    "v08-anorthite-1",
    "v08-anorthite-2",
    "v08-microcline-2",
    "v08-sanidine-2",
    "v08-oligoclase-1",
    "v08-oligoclase-2",
    "v08-andesine-1",
    "v08-andesine-2",
    "v08-labradorite-1",
    "v08-labradorite-2",
    "v08-bytownite-1",
    "v08-bytownite-2",
    "v08-nepheline-2",
    "v08-leucite-1",
    "v08-sodalite-2",
    "v08-analcime-2",
    "v08-tephroite-2",
    "v08-monticellite-2",
    "v08-kirschsteinite-2",
    "v08-clinoenstatite-2",
    "v08-omphacite-1",
    "v08-omphacite-2",
    "v08-aegirine-2",
    "v08-spodumene-2",
    "v08-pigeonite-2",
    "v08-actinolite-2",
    "v08-ferroactinolite-2",
    "v08-anthophyllite-2",
    "v08-glaucophane-2",
    "v08-riebeckite-1",
    "v08-pargasite-2",
    "v08-magnesiohornblende-1",
    "v08-ferrohornblende-1",
    "v08-muscovite-1",
    "v08-muscovite-2",
    "v08-paragonite-1",
    "v08-phlogopite-1",
    "v08-phlogopite-2",
    "v08-annite-2",
    "v08-biotite-1",
    "v08-biotite-2",
    "v08-lepidolite-2",
    "v08-pyrophyllite-1",
    "v08-clinochlore-2",
    "v08-chamosite-1",
    "v08-chamosite-2",
    "v08-montmorillonite-2",
    "v08-nontronite-2",
    "v08-halloysite-2",
    "v08-antigorite-2",
    "v08-chrysotile-2",
    "v08-pyrope-1",
    "v08-pyrope-2",
    "v08-almandine-2",
    "v08-spessartine-2",
    "v08-grossular-2",
    "v08-andradite-2",
    "v08-uvarovite-2",
    "v08-andalusite-2",
    "v08-kyanite-1",
    "v08-kyanite-2",
    "v08-sillimanite-1",
    "v08-sillimanite-2",
    "v08-cordierite-2",
    "v08-staurolite-1",
    "v08-staurolite-2",
    "v08-chloritoid-1",
    "v08-zoisite-2",
    "v08-clinozoisite-2",
    "v08-epidote-2",
    "v08-lawsonite-2",
    "v08-prehnite-2",
    "v08-pumpellyite_mg-2",
    "v08-zircon-2",
    "v08-titanite-1",
    "v08-fluorapatite-2",
    "v08-hydroxylapatite-2",
    "v08-monazite_ce-2",
    "v08-xenotime_y-2",
    "v08-dravite-2",
    "v08-schorl-1",
    "v08-elbaite-2",
    "v08-beryl-2",
    "v08-topaz-1",
    "v08-tridymite-1",
    "v08-cristobalite-1",
    "v08-coesite-2",
    "v08-stishovite-1",
    "v08-laumontite-1",
    "v08-stilbite-2",
    "v08-clinoptilolite-1",
    "v08-dolomite-2",
    "v08-aragonite-2",
    "v08-ankerite-2",
    "v08-rhodochrosite-2",
    "v08-smithsonite-2",
    "v08-azurite-1",
    "v08-cerussite-2",
    "v08-strontianite-2",
    "v08-witherite-2",
    "v08-barite-2",
    "v08-celestine-2",
    "v08-anglesite-2",
    "v08-jarosite-1",
    "v08-alunite-2",
    "v08-chalcanthite-2",
    "v08-sylvite-2",
    "v08-chlorargyrite-2",
    "v08-rutile-2",
    "v08-anatase-1",
    "v08-brookite-2",
    "v08-ilmenite-2",
    "v08-chromite-2",
    "v08-cassiterite-2",
    "v08-pyrolusite-2",
    "v08-manganite-1",
    "v08-lepidocrocite-2",
    "v08-boehmite-1",
    "v08-diaspore-2",
    "v08-uraninite-2",
    "v08-galena-2",
    "v08-pyrrhotite-2",
    "v08-marcasite-2",
    "v08-bornite-2",
    "v08-chalcocite-1",
    "v08-molybdenite-2",
    "v08-pentlandite-1",
    "v08-cinnabar-2",
    "v08-arsenopyrite-2",
    "v08-realgar-2",
    "v08-orpiment-1",
    "v08-stibnite-2",
    "v08-acanthite-2",
    "v08-cobaltite-2",
    "v08-scheelite-2",
    "v08-ferberite-2",
    "v08-hubnerite-2",
    "v08-wolframite-2",
    "v08-vivianite-2",
    "v08-alt-sulfate-reduction",
    "v08-alt-cuprite-reduction",
    "v08-alt-tenorite-reduction",
    "v08-alt-anhydrite-hydrothermal",
    "v08-alt-corundum-magnesium_ion",
    "v08-alt-spinel-iron2",
    "v08-alt-hematite-iron2",
    "v08-alt-magnetite-magnesium_ion",
    "v08-alt-lizardite-quartz",
    "v08-alt-talc-wollastonite",
    "v08-alt-pyrite-reduction",
    "v08-alt-smithsonite-sulfide",
    "v08-alt-iron2-bicarbonate",
    "v08-alt-gold3-hydrothermal",
    "v08-alt-acanthite-reduction",
    "v08-alt-diamond-heat",
    "v08-alt-c-pressure",
    "v08-alt-malachite-heat",
    "v08-alt-marcasite-air",
    "v08-alt-sphalerite-air",
    "v08-alt-bornite-air",
    "v08-alt-chalcocite-air",
    "v08-alt-chalcopyrite-air",
    "v08-alt-anorthite-rain",
    "v08-alt-muscovite-heat",
    "v08-alt-actinolite-heat"
]);
const ANORTHITE_REFERENCE = {
    "id": "s-anorthite-oxides",
    "kind": "synthesis",
    "inputs": [
        "lime",
        "corundum",
        "quartz"
    ],
    "outputs": [
        "anorthite"
    ],
    "agent": null,
    "staging": [
        "lime",
        "corundum"
    ],
    "symbolic": false,
    "equation": "CaO + Al₂O₃ + 2 SiO₂ → CaAl₂Si₂O₈",
    "summary": "Composição de anortita representada por componentes óxidos, que podem cristalizar a partir de uma composição fundida adequada.",
    "conditions": "Cristalização em sistema CaO–Al₂O₃–SiO₂ com proporção 1:1:2. Não significa reação espontânea entre cristais sólidos à temperatura ambiente.",
    "source": "https://www.cambridge.org/core/journals/mineralogical-magazine/article/abs/crystallization-of-anorthite-from-caoal2o3sio2-glasses/4402F49A240C85DACF09415C96D7A4A6"
};
/** Classificação dos processos hídricos, preservando IDs históricos. */
const HYDRIC_RETIRED = new Set([
    "s-serpentine-water",
    "s-olivine-water",
    "s-enstatite-water",
    "s-diopside-water",
    "a-forsterite-water",
    "a-olivine-water",
    "a-enstatite-water",
    "a-diopside-water",
    "v08-analcime-1",
    "v08-lawsonite-1",
    "v08-prehnite-1",
    "v08-laumontite-2",
    "v08-clinoptilolite-2",
    "v08-halloysite-1",
    "v08-lepidocrocite-1"
]);
const HYDRIC_OVERRIDES = {
    "v08-alt-lizardite-quartz": {
        "retired": false,
        "mechanic": null,
        "symbolic": false,
        "outputs": [
            "talc",
            "water"
        ],
        "equation": "Mg₃Si₂O₅(OH)₄ + 2 SiO₂ ⇌ Mg₃Si₄O₁₀(OH)₂ + H₂O",
        "summary": "Formação de talco por silicificação de serpentina em metassomatismo.",
        "conditions": "Reação ideal controlada pela atividade da sílica, P–T e fluxo de fluido, não por hidratação simples.",
        "source": "https://link.springer.com/article/10.1007/s00410-025-02283-9"
    },
    "a-forsterite-serp": {
        "conditions": "Serpentinização de forsterita por fluido reativo, exigindo P–T, disponibilidade de H₂O, cinética e composição adequada. Não é reação instantânea por água adicionada.",
        "source": "https://doi.org/10.1029/2011JB008842",
        "environmentalInputs": [
            "water"
        ],
        "sources": [
            {
                "url": "https://doi.org/10.1029/2011JB008842",
                "claim": "Os experimentos com olivina natural documentam influência da granulometria na seleção de lizardita ou crisotila e produtos adicionais em presença de ferro. A equação usa o membro puro magnesiano como idealização."
            }
        ]
    },
    "v08-anatase-2": {
        "equation": "Ti⁴⁺ + 2 H₂O → TiO₂ + 4 H⁺",
        "conditions": "Hidrólise aquosa de Ti(IV), dependente de pH, complexantes e nucleação. Anatásio é possível, não obrigatório; não pressupõe hidrotermalismo.",
        "summary": "Precipitação por hidrólise aquosa idealizada do titânio; a fase TiO₂ é condicionada.",
        "source": "https://doi.org/10.1088/0957-4484/19/14/145605"
    },
    "v08-anthophyllite-1": {
        "equation": "7 MgSiO₃ + SiO₂ + H₂O ⇌ Mg₇Si₈O₂₂(OH)₂",
        "conditions": "Metamorfismo com água e sílica disponíveis, controlado por P–T; enstatita + fluido não determina o produto isoladamente.",
        "source": "https://msaweb.org/AmMin/AM64/AM64_294.pdf"
    },
    "v08-grunerite-2": {
        "equation": "7 FeSiO₃ + SiO₂ + H₂O ⇌ Fe₇Si₈O₂₂(OH)₂",
        "conditions": "Equilíbrio idealizado para anfibólio ferroso; requer sílica, fluido e P–T–fO₂ adequados. Rota condicional."
    },
    "v08-riebeckite-2": {
        "conditions": "Rota simbólica provisória: fonte de Na, Fe²⁺/Fe³⁺ e Si, fO₂ e P–T são essenciais. Fluido hidrotermal sozinho não forma riebeckita."
    },
    "v08-chrysotile-1": {
        "conditions": "Polimorfos de serpentina: recristalização pode ocorrer em ambiente fluido, mas lizardita não vira necessariamente crisotila. Exige P–T e condições de nucleação."
    },
    "v08-clinozoisite-1": {
        "conditions": "Zoisita e clinozoisita diferem estruturalmente; circulação de fluido pode promover recristalização, mas a fase depende de P–T, nucleação e composição."
    },
    "v08-brookite-1": {
        "conditions": "Seleção do polimorfo de TiO₂ depende da química do fluido, pH, temperatura e cinética. Não é simples hidratação nem transformação universal de anatásio.",
        "source": "https://doi.org/10.1088/0957-4484/19/14/145605"
    },
    "v08-marcasite-1": {
        "conditions": "Reprecipitação de FeS₂ como marcassita requer pH, Eh, T, especiação de S e solução apropriada. Pirita + fluido não implica conversão obrigatória."
    },
    "v08-alt-biotite-water": {
        "conditions": "Cloritização de biotita em sistema aberto, com remoção de K e reequilíbrio de Fe–Mg–Al–Si em condições P–T e fluido adequadas."
    }
};
const HYDRIC_REPLACEMENTS = [
    {
        "id": "a-olivine-hydrothermal",
        "kind": "alteration",
        "inputs": [
            "olivine"
        ],
        "agent": "hydrothermal",
        "outputs": [
            "lizardite"
        ],
        "equation": "Olivina (Mg,Fe)₂SiO₄ + fluido ⇢ serpentina ± brucita ± magnetita ± H₂ (global)",
        "conditions": "Interação rocha–fluido sob P–T e cinética apropriadas; fases dependem do Fe/Mg e da sílica; lizardita é produto representativo.",
        "source": "https://doi.org/10.1029/2011JB008842",
        "summary": "Serpentinização de olivina com fluido aquoso reativo.",
        "symbolic": true,
        "environmentalInputs": [
            "water"
        ],
        "sources": [
            {
                "url": "https://doi.org/10.1029/2011JB008842",
                "claim": "Os experimentos com olivina natural documentam influência da granulometria na seleção de lizardita ou crisotila e produtos adicionais em presença de ferro."
            }
        ]
    },
    {
        "id": "a-diopside-hydrothermal",
        "kind": "alteration",
        "inputs": [
            "diopside"
        ],
        "agent": "hydrothermal",
        "outputs": [
            "tremolite"
        ],
        "equation": "2 CaMgSi₂O₆ + 3 Mg²⁺ + 4 H₄SiO₄ ⇌ Ca₂Mg₅Si₈O₂₂(OH)₂ + 6 H⁺ + 4 H₂O",
        "conditions": "Fluido deve fornecer Mg e sílica; sistema aberto, P–T–X adequado; não é diopsídio mais água pura.",
        "source": "https://doi.org/10.1093/petrology/egm021",
        "summary": "Tremolita por reação metasomática de clinopiroxênio com fluido.",
        "symbolic": true
    },
    {
        "id": "a-nepheline-hydrothermal-analcime",
        "kind": "alteration",
        "inputs": [
            "nepheline"
        ],
        "agent": "hydrothermal",
        "outputs": [
            "analcime"
        ],
        "equation": "NaAlSiO₄ + SiO₂ + H₂O ⇌ NaAlSi₂O₆·H₂O",
        "conditions": "O balanço usa o componente sódico ideal da nefelina. Dados experimentais mostram dissolução e precipitação após supersaturação. A procedência da sílica aquosa depende do sistema.",
        "source": "https://www.mdpi.com/2075-163X/13/9/1138",
        "summary": "Analcima formada por dissolução e recristalização de nefelina.",
        "symbolic": true,
        "sources": [
            {
                "url": "https://www.mdpi.com/2075-163X/13/9/1138",
                "claim": "Dissolução de nefelina seguida de cristalização de analcima sob condições hidrotermais estudadas."
            }
        ],
        "environmentalInputs": [
            "water"
        ]
    },
    {
        "id": "a-anorthite-hydrothermal-prehnite",
        "kind": "alteration",
        "inputs": [
            "anorthite"
        ],
        "agent": "hydrothermal",
        "outputs": [
            "prehnite"
        ],
        "equation": "CaAl₂Si₂O₈ + Ca²⁺ + H₄SiO₄ → Ca₂Al₂Si₃O₁₀(OH)₂ + 2 H⁺",
        "conditions": "Neste balanço ideal, que conserva Al, o fluido fornece Ca²⁺ e sílica dissolvida. O estudo também descreve um modelo que conserva Ca. Verificar as condições P–T–X de cada ocorrência.",
        "source": "https://link.springer.com/article/10.1186/s00015-024-00476-1",
        "summary": "Prehnita por alteração hidrotermal de plagioclásio cálcico.",
        "symbolic": true,
        "sources": [
            {
                "url": "https://link.springer.com/article/10.1186/s00015-024-00476-1",
                "claim": "As equações 1 e 2 apresentam modelos alternativos de formação de prehnita que conservam Al ou Ca, respectivamente."
            }
        ]
    },
    {
        "id": "a-prehnite-hydrothermal-laumontite",
        "kind": "alteration",
        "inputs": [
            "prehnite"
        ],
        "agent": "hydrothermal",
        "outputs": [
            "laumontite"
        ],
        "equation": "Ca₂Al₂Si₃O₁₀(OH)₂ + H₄SiO₄ + 2 H⁺ ⇌ CaAl₂Si₄O₁₂·4H₂O + Ca²⁺",
        "conditions": "Associação condicional de reequilíbrio em baixo grau com fluxo de fluido silicoso e Ca removido; P–T–X determinam a estabilidade.",
        "source": "https://doi.org/10.1093/petrology/12.2.379",
        "summary": "Laumontita em reequilíbrio de aluminosilicatos cálcicos com fluido.",
        "symbolic": true
    },
    {
        "id": "a-albite-hydrothermal-clinoptilolite",
        "kind": "alteration",
        "inputs": [
            "albite"
        ],
        "agent": "hydrothermal",
        "outputs": [
            "clinoptilolite"
        ],
        "equation": "Aluminosilicato + fluido reativo ⇢ clinoptilolita (sistema aberto)",
        "conditions": "Associação provisória: zeolitização depende de composição do precursor (frequentemente vidro vulcânico), aporte de Si–Al–K–Ca, pH e temperatura; albita sozinha não basta.",
        "source": "https://doi.org/10.1346/CCMN.1996.0440303",
        "summary": "Zeolitização condicional por fluidos que redistribuem componentes.",
        "symbolic": true,
        "process": "associacao-didatica",
        "reviewStatus": "provisoria",
        "sources": [
            {
                "url": "https://doi.org/10.1346/CCMN.1996.0440303",
                "claim": "O estudo documenta clinoptilolita na alteração de vidro riolítico. A ocorrência com albita como precursor segue a verificar."
            }
        ]
    },
    {
        "id": "a-anorthite-pressure-lawsonite",
        "kind": "alteration",
        "inputs": [
            "anorthite"
        ],
        "agent": "pressure",
        "outputs": [
            "lawsonite"
        ],
        "equation": "CaAl₂Si₂O₈ + 2 H₂O ⇌ CaAl₂Si₂O₇(OH)₂·H₂O",
        "conditions": "Pressão e baixa temperatura são condições, não reagentes. Água deve estar disponível no sistema; campo metamórfico apropriado.",
        "source": "https://doi.org/10.1093/petrology/12.2.379",
        "summary": "Lawsonita em metamorfismo de alta pressão, com água disponível.",
        "symbolic": true,
        "process": "reacao-metamorfica",
        "reviewStatus": "condicional",
        "sources": [
            {
                "url": "https://doi.org/10.1093/petrology/12.2.379",
                "claim": "Relações de estabilidade no sistema Ca–Al–Si–H₂O; a hidratação idealizada requer água."
            }
        ],
        "environmentalInputs": [
            "water"
        ]
    },
    {
        "id": "a-albite-weathering-halloysite",
        "kind": "alteration",
        "inputs": [
            "albite"
        ],
        "agent": "rain",
        "outputs": [
            "halloysite"
        ],
        "equation": "2 NaAlSi₃O₈ + 2 H⁺ + 11 H₂O → Al₂Si₂O₅(OH)₄·2H₂O + 2 Na⁺ + 4 H₄SiO₄",
        "conditions": "Intemperismo ácido, lixiviação, umidade e sílica controlam se haloisita se forma; não é hidratação de caulinita isolada.",
        "source": "https://pubs.usgs.gov/of/2001/of01-041/htmldocs/clays/kaogr.htm",
        "summary": "Haloisita hidratada em intemperismo de feldspato sódico.",
        "symbolic": true,
        "environmentalInputs": [
            "water",
            "proton"
        ]
    },
    {
        "id": "s-lepidocrocite-weathering",
        "kind": "synthesis",
        "inputs": [
            "iron2",
            "rain"
        ],
        "agent": null,
        "outputs": [
            "lepidocrocite"
        ],
        "equation": "4 Fe²⁺ + O₂ + 6 H₂O → 4 γ-FeOOH + 8 H⁺",
        "conditions": "pH, Eh, O₂ e cinética controlam seleção de lepidocrocita, goethita e outras fases; precipitação possível, não garantida.",
        "source": "https://doi.org/10.1021/es4043275",
        "summary": "Lepidocrocita por oxidação e precipitação de Fe(II) em ambiente supergênico.",
        "symbolic": true
    }
];
