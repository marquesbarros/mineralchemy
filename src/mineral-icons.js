const HANDCRAFTED_SHAPES = {
    quartz: `<path d="M29 39 L41 21 L58 21 L70 39 L70 71 L57 81 L41 81 L29 71 Z" fill="#D7E8E8" stroke="#676F6F" stroke-width="1.6"></path><path d="M29 39 L41 21 L48 40 L41 81 L29 71 Z" fill="#E5F0F0" opacity=".78"></path><path d="M48 40 L58 21 L70 39 L70 71 L57 81 L48 75 Z" fill="#9AA7A7" opacity=".8"></path><path d="M29 39 L48 40 L70 39 M48 40 L48 75" fill="none" opacity=".6" stroke="#676F6F" stroke-width="1"></path>`,
    orthoclase: `<path d="M23 37 L42 25 L72 31 L72 70 L53 82 L23 75 Z" fill="#DFA9A0" stroke="#6B514C" stroke-width="1.6"></path><path d="M23 37 L42 25 L72 31 L53 43 Z" fill="#EAC7C1"></path><path d="M53 43 L72 31 L72 70 L53 82 Z" fill="#A07973"></path><path d="M53 43 L53 82 M32 42 L32 74 M38 40 L38 77" fill="none" opacity=".65" stroke="#6B514C" stroke-width="1.1"></path><path d="M28 45 L49 54" opacity=".6" stroke="#955C59" stroke-width="1.3"></path>`,
    albite: `<path d="M23 37 L42 25 L72 31 L72 70 L53 82 L23 75 Z" fill="#EBE7DD" stroke="#706E6A" stroke-width="1.6"></path><path d="M23 37 L42 25 L72 31 L53 43 Z" fill="#F2EFE8"></path><path d="M53 43 L72 31 L72 70 L53 82 Z" fill="#A9A69F"></path><path d="M53 43 L53 82 M32 42 L32 74 M38 40 L38 77" fill="none" opacity=".65" stroke="#706E6A" stroke-width="1.1"></path><path d="M30 44 L30 72 M36 42 L36 75 M42 44 L42 77" opacity=".8" stroke="#7B8A92" stroke-width="1.1"></path>`,
    calcite: `<path d="M23 33 L56 22 L77 41 L67 71 L35 82 L17 62 Z" fill="#DCE3DD" stroke="#696C6A" stroke-width="1.7"></path><path d="M23 33 L56 22 L77 41 L42 52 Z" fill="#E8ECE8"></path><path d="M42 52 L77 41 L67 71 L35 82 Z" fill="#9EA39F"></path><path d="M42 52 L35 82 L17 62 L23 33 Z" fill="#DCE3DD" opacity=".75"></path><path d="M23 33 L42 52 L77 41 M42 52 L35 82" fill="none" stroke="#696C6A" stroke-width="1"></path><path d="M29 37 L37 51 L33 65" opacity=".45" stroke="#718B84" stroke-width="1.1"></path>`,
    pyrite: `<path d="M22 33 L50 19 L77 32 L77 67 L50 83 L22 68 Z" fill="#BFA04C" stroke="#5B4C24" stroke-width="1.7"></path><path d="M22 33 L50 19 L77 32 L50 47Z" fill="#D5C18A"></path><path d="M50 47 L77 32 L77 67 L50 83Z" fill="#897336"></path><path d="M50 47 L50 83" fill="none" stroke="#5B4C24" stroke-width="1.1"></path><path d="M26 43 l20 -11 M26 51 l21 -11 M30 60 l14 -8" opacity=".65" stroke="#755920" stroke-width="1.4"></path>`,
    galena: `<path d="M22 33 L50 19 L77 32 L77 67 L50 83 L22 68 Z" fill="#737D89" stroke="#373C41" stroke-width="1.7"></path><path d="M22 33 L50 19 L77 32 L50 47Z" fill="#A4AAB2"></path><path d="M50 47 L77 32 L77 67 L50 83Z" fill="#525A62"></path><path d="M50 47 L50 83" fill="none" stroke="#373C41" stroke-width="1.1"></path><path d="M56 53 H70 M56 60 H69" opacity=".75" stroke="#43454F" stroke-width="1.6"></path>`,
    magnetite: `<path d="M48 15 L79 45 L48 83 L18 46 Z" fill="#434A52" stroke="#202327" stroke-width="1.6"></path><path d="M48 15 L79 45 L47 48Z" fill="#84898E"></path><path d="M18 46 L48 15 L47 48 Z" fill="#434A52"></path><path d="M18 46 L47 48 L48 83 Z" fill="#30353B" opacity=".85"></path><path d="M47 48 L79 45 L48 83Z" fill="#30353B"></path><path d="M18 46 L47 48 L79 45 M47 48 L48 83" fill="none" stroke="#202327" stroke-width="1.2"></path><path d="M49 15 L49 79" opacity=".45" stroke="#141E22" stroke-width="1"></path>`,
    olivine: `<path d="M20 42 L33 26 L60 21 L75 39 L68 69 L48 82 L25 70 Z" fill="#88A255" stroke="#414D28" stroke-width="1.6"></path><path d="M20 42 L33 26 L47 44 L25 70 Z" fill="#B1C290"></path><path d="M47 44 L60 21 L75 39 L68 69 L48 82 Z" fill="#61743D"></path><path d="M47 44 L48 82 L25 70 M47 44 L75 39" fill="none" opacity=".65" stroke="#414D28" stroke-width="1"></path>`,
    kyanite: `<path d="M32 15 L47 21 L62 76 L49 83 Z" fill="#608FCD" stroke="#2E4462" stroke-width="1.5"></path><path d="M48 21 L60 13 L77 68 L63 76Z" fill="#97B6DE" stroke="#2E4462" stroke-width="1.4"></path><path d="M63 76 L77 68 L67 83 L49 83 Z" fill="#456693"></path><path d="M39 28 L54 75 M57 25 L71 68" opacity=".75" stroke="#345487" stroke-width="1.1"></path>`,
    almandine: `<path d="M30 20 L52 15 L74 29 L80 49 L67 75 L43 83 L19 65 L17 39 Z" fill="#743B46" stroke="#371C21" stroke-width="1.7"></path><path d="M30 20 L52 15 L56 39 L34 45 L17 39 Z" fill="#A47F86"></path><path d="M56 39 L74 29 L80 49 L67 75 L53 61 Z" fill="#532A32"></path><path d="M34 45 L56 39 L53 61 L43 83 L19 65 Z" fill="#743B46" opacity=".73"></path><path d="M56 39 L53 61 L34 45 L17 39 M53 61 L67 75" fill="none" stroke="#371C21" stroke-width="1.1"></path>`,
    muscovite: `<path d="M23 62 Q42 43 76 51 L72 66 Q49 58 27 75Z" fill="#978B76" stroke="#655D4E" stroke-width="1.3"></path><path d="M20 52 Q45 32 77 39 L76 55 Q48 46 22 67Z" fill="#D3C2A4" stroke="#655D4E" stroke-width="1.3"></path><path d="M21 43 Q43 26 76 32 L78 45 Q50 40 21 57Z" fill="#E2D7C3" stroke="#655D4E" stroke-width="1.3"></path><path d="M23 47 L71 41" opacity=".45" stroke="#9D8C6B" stroke-width="1.0"></path>`,
    biotite: `<path d="M23 62 Q42 43 76 51 L72 66 Q49 58 27 75Z" fill="#4F3A2C" stroke="#34261D" stroke-width="1.3"></path><path d="M20 52 Q45 32 77 39 L76 55 Q48 46 22 67Z" fill="#6E513E" stroke="#34261D" stroke-width="1.3"></path><path d="M21 43 Q43 26 76 32 L78 45 Q50 40 21 57Z" fill="#A08D81" stroke="#34261D" stroke-width="1.3"></path><path d="M23 47 L71 41" opacity=".45" stroke="#241E1A" stroke-width="1.0"></path>`,
    fe: `<path d="M18 42 L30 29 L51 24 L71 34 L80 53 L66 75 L42 81 L20 68Z" fill="#65717A" stroke="#2F363C" stroke-width="1.9"/><path d="M18 42L30 29L51 24L43 48L24 57Z" fill="#A3ACB3"/><path d="M43 48L51 24L71 34L80 53L57 57Z" fill="#7F8B96"/><path d="M24 57L43 48L57 57L66 75L42 81L20 68Z" fill="#40474D"/><path d="M43 48L57 57L80 53M57 57L66 75M24 57L20 68" stroke="#2F363C" stroke-width="1.5" fill="none"/><path d="M32 38L44 35M32 64L43 69" stroke="#DDE4EA" stroke-width="2" opacity=".58"/>`,
    s: `<path d="M47 12L65 29L73 54L54 83L33 78L21 51L29 28Z" fill="#E0B62E" stroke="#836317" stroke-width="1.8"/><path d="M47 12L65 29L49 41L29 28Z" fill="#FFF19A"/><path d="M29 28L49 41L39 65L21 51Z" fill="#F5D352"/><path d="M49 41L65 29L73 54L54 83L39 65Z" fill="#B8891E"/><path d="M21 51L39 65L54 83L33 78Z" fill="#D4A225"/><path d="M49 41L39 65L54 83M49 41L73 54" stroke="#836317" stroke-width="1.2" fill="none"/>`,
    cu: `<g stroke="#854A36" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M46 83L46 53L29 40L20 24M46 53L67 35L73 20M46 67L70 61L80 46M29 40L39 27L39 14" stroke-width="10"/><path d="M46 83L46 53L29 40L20 24M46 53L67 35L73 20M46 67L70 61L80 46M29 40L39 27L39 14" stroke="#CA7852" stroke-width="7"/><path d="M44 80L44 52L28 39L19 24M44 52L66 34L72 20M44 66L69 60L79 45M28 39L38 26L38 14" stroke="#F1B48A" stroke-width="2"/></g><circle cx="46" cy="52" r="5" fill="#C7734D" stroke="#854A36"/><path d="M19 24l-5 -6M73 20l4 -6" stroke="#854A36" stroke-width="5" stroke-linecap="round"/>`,
    gold_native: `<path d="M17 53L30 36L44 32L57 23L74 30L83 44L74 62L60 72L38 80L20 71Z" fill="#D2A52F" stroke="#76521A" stroke-width="1.8" stroke-linejoin="round"/><path d="M17 53L30 36L44 32L39 54L20 71Z" fill="#F8DD72"/><path d="M44 32L57 23L74 30L61 48L39 54Z" fill="#FFE184"/><path d="M39 54L61 48L74 62L60 72L38 80L20 71Z" fill="#BA8422"/><path d="M61 48L74 30L83 44L74 62Z" fill="#9C711D"/><path d="M25 55L33 46M47 41L54 35M49 68L57 62" stroke="#FFF3AF" stroke-width="3" stroke-linecap="round" opacity=".7"/>`,
    silver_native: `<g fill="none" stroke-linejoin="round" stroke-linecap="round"><path d="M28 75C28 60 48 62 45 49S30 30 43 19S70 26 61 40S56 56 70 64L78 71M44 48L23 45L16 36M46 60L34 79M61 40L75 25" stroke="#646B72" stroke-width="10"/><path d="M28 75C28 60 48 62 45 49S30 30 43 19S70 26 61 40S56 56 70 64L78 71M44 48L23 45L16 36M46 60L34 79M61 40L75 25" stroke="#CDD2D5" stroke-width="7"/><path d="M27 73C27 60 47 61 44 48S29 30 42 19S68 26 60 39S55 55 69 63L77 70M44 47L22 44L16 36M45 60L33 78M60 39L74 24" stroke="#FFFFFF" stroke-width="1.8" opacity=".8"/></g>`,
    graphite: `<path d="M18 57L41 45L78 50L60 67L38 76L19 65Z" fill="#44464E" stroke="#2E3137" stroke-width="1.6"/><path d="M19 49L44 37L77 42L59 58L38 67L19 56Z" fill="#6C717B" stroke="#32373E" stroke-width="1.6"/><path d="M17 41L44 27L77 35L60 50L37 59L17 48Z" fill="#969AA4" stroke="#32373E" stroke-width="1.6"/><path d="M17 41L44 27L77 35L60 50L37 59L17 48Z" fill="none" stroke="#E0E3E9" stroke-width=".8" opacity=".7"/><path d="M26 40L44 32L66 37M27 50L38 55L58 48M28 59L39 64L62 57" stroke="#262A30" stroke-width="1.4" opacity=".65" fill="none"/>`,
    diamond: `<path d="M48 12L77 44L48 84L19 44Z" fill="#E6F1F5" stroke="#6D8996" stroke-width="1.7"/><path d="M48 12L77 44L48 49Z" fill="#C1E1EB"/><path d="M48 12L19 44L48 49Z" fill="#FFFFFF"/><path d="M19 44L48 49L48 84Z" fill="#B9D6E1"/><path d="M77 44L48 49L48 84Z" fill="#77A8BC"/><path d="M48 12L48 84M19 44L77 44" fill="none" stroke="#6D8996" stroke-width="1.1" opacity=".55"/><path d="M39 26L44 21" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/><path d="M62 52L53 68" stroke="#E9FAFF" stroke-width="2" opacity=".8"/>`,
};
const INITIAL_ICON_IDS = Object.freeze(Object.keys(HANDCRAFTED_SHAPES));
const iconEsc = (v) => v.replace(/[&<>"]/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[s] ?? s));
const iconClamp = (n, min, max) => Math.max(min, Math.min(max, n));
const iconHash = (str) => { let h = 2166136261 >>> 0; for (const ch of str) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
} return h >>> 0; };
const hsl = (h, s, l) => `hsl(${((h % 360) + 360) % 360} ${iconClamp(s, 10, 95)}% ${iconClamp(l, 12, 94)}%)`;
function paletteFor(meta) {
    const id = (meta.id + ' ' + meta.name + ' ' + meta.family).toLowerCase();
    let hue = iconHash(meta.id) % 360, sat = 38, light = 62;
    const set = (H, S, L) => { hue = H; sat = S; light = L; };
    if (/gold|ouro/.test(id))
        set(45, 68, 55);
    else if (/silver|prata/.test(id))
        set(210, 10, 72);
    else if (/cobre nativo|^cu$/.test(meta.id))
        set(22, 55, 54);
    else if (/sulfur|enxofre|^s$/.test(meta.id))
        set(50, 80, 54);
    else if (/diamond|diamante/.test(id))
        set(197, 32, 88);
    else if (/graphite|grafita/.test(id))
        set(220, 8, 43);
    else if (/hematit|cuprite|realgar|cinnabar|rutile|ferberite|hubnerite/.test(id))
        set(10, 52, 48);
    else if (/goeth|limon|jarosite|pyrite|chalcopyrite|orpiment|alunite/.test(id))
        set(43, 55, 55);
    else if (/halite|anhydrite|gypsum|gipsita|anglesite|barite|calcite|cerussite|witherite|strontianite/.test(id))
        set(185, 8, 88);
    else if (/fluorite|amethyst|lepidolite/.test(id))
        set(278, 40, 74);
    else if (/corundum|spinel|hercynite|magnetite|magnesioferrite|galena|molybdenite|chromite|uraninite|stibnite|acanthite/.test(id))
        set(220, 10, 34);
    else if (/forsterite|olivine|olivina|monticellite|nepheline|epidote|prehnite|pumpellyite|uvarovite/.test(id))
        set(102, 35, 56);
    else if (/fayalite|ferro|hedenberg|siderite|ankerite|ilmenite|nontronite|chamosite|annite/.test(id))
        set(30, 25, 42);
    else if (/diopside|augite|actinolite|tremolite|malachite|vivianite|fluorapatite|hydroxylapatite/.test(id))
        set(145, 42, 52);
    else if (/kyanite|glaucophane|riebeckite|sodalite|azurite|labradorite|celestine|lawsonite|beryl/.test(id))
        set(210, 46, 56);
    else if (/muscov|albite|coesite|quartz|stishovite|cristobalite|tridymite|topaz|zircon/.test(id))
        set(195, 15, 80);
    else if (/orthoclase|microcline|sanidine|oligoclase|andesine|bytownite|plagioclase|feldspato|sylvite/.test(id))
        set(25, 35, 72);
    else if (/phlogopite|staurolite|dravite|titanite|scheelite|wolframite|cassiterite/.test(id))
        set(35, 35, 49);
    else if (/paragonite|pyrophyllite|kaolinite|halloysite|clinozoisite|zoisite/.test(id))
        set(85, 14, 79);
    else if (/spessart|rhodochrosite/.test(id))
        set(20, 70, 55);
    else if (/grossular/.test(id))
        set(70, 42, 58);
    else if (/almand/.test(id))
        set(348, 38, 40);
    else if (/pyrope/.test(id))
        set(350, 55, 46);
    else if (/andradite/.test(id))
        set(95, 28, 45);
    else if (/tourmaline|elbaite/.test(id))
        set(165, 48, 52);
    else if (/schorl/.test(id))
        set(224, 10, 26);
    else if (/monazite|xenotime|apatite/.test(id))
        set(28, 43, 63);
    else if (/sphalerite|bornite|pentlandite|pyrrhotite|arsenopyrite|cobaltite/.test(id))
        set(30, 26, 45);
    else if (/chlorargyrite/.test(id))
        set(260, 12, 78);
    else if (/smithsonite/.test(id))
        set(175, 30, 76);
    else if (/dolomite|magnesite|brucite|portlandite|boehmite|diaspore|gibbsite/.test(id))
        set(120, 10, 82);
    // Variações perceptíveis entre espécies de mesma família, sem abandonar
    // a cor mineralógica de referência; evita ícones idênticos só por metadados.
    const individual = iconHash(meta.id);
    hue = (hue + ((individual >>> 5) % 23) - 11 + 360) % 360;
    sat = iconClamp(sat + ((individual >>> 15) % 17) - 8, 10, 90);
    light = iconClamp(light + ((individual >>> 24) % 13) - 6, 18, 90);
    // Valores curados para espécies cujo tom aleatório não é didático.
    // Uma ocorrência característica, não uma cor diagnóstica universal.
    const curatedColors = {
        fluorite: [277, 33, 72], sylvite: [24, 18, 86], dolomite: [118, 11, 76], siderite: [32, 23, 37],
        rhodochrosite: [344, 54, 63], malachite: [145, 60, 41], azurite: [215, 65, 43],
        gypsum: [190, 9, 88], microcline: [12, 35, 68], anorthite: [25, 21, 77], labradorite: [207, 40, 58],
        rutile: [12, 62, 45], anatase: [202, 27, 49], lizardite: [130, 22, 69], antigorite: [115, 26, 62],
        chrysotile: [115, 25, 70], zircon: [36, 43, 56], fluorapatite: [143, 30, 59],
        sillimanite: [49, 16, 78], andalusite: [15, 31, 64], stilbite: [22, 31, 79],
        cordierite: [229, 31, 54], chloritoid: [125, 24, 44], marcasite: [43, 37, 56],
        pyrrhotite: [34, 32, 43], sphalerite: [28, 35, 39], pentlandite: [34, 24, 41],
        spodumene: [276, 32, 72], dravite: [32, 37, 41], schorl: [235, 8, 25],
    };
    // Cores ilustrativas de ocorrências características, nunca diagnósticas isoladas.
    // Evitam que minerais menos comuns recebam matizes arbitrários por hash.
    const specimenColors = {
        halite: [190, 9, 89], hematite: [8, 35, 39], periclase: [185, 10, 83], lime: [70, 8, 88],
        corundum: [350, 52, 57], cuprite: [4, 46, 51], portlandite: [115, 9, 83], goethite: [31, 46, 45],
        brucite: [116, 15, 79], gibbsite: [90, 12, 84], wustite: [218, 8, 36],
        spinel: [352, 45, 51], hercynite: [224, 11, 30], magnesioferrite: [23, 14, 36],
        tenorite: [218, 10, 27], anhydrite: [201, 13, 83],
        enstatite: [97, 18, 58], forsterite: [103, 35, 62], wollastonite: [190, 10, 84],
        ferrosilite: [31, 19, 36], diopside: [151, 39, 48], hedenbergite: [143, 20, 36], fayalite: [46, 31, 43],
        augite: [134, 26, 34], tremolite: [106, 15, 74], tephroite: [27, 28, 43],
        monticellite: [94, 23, 59], kirschsteinite: [42, 29, 44], clinoenstatite: [96, 19, 54],
        jadeite: [145, 33, 70], omphacite: [151, 36, 46], aegirine: [145, 24, 31], pigeonite: [42, 20, 42],
        actinolite: [135, 35, 48], ferroactinolite: [146, 18, 33], anthophyllite: [33, 24, 62],
        grunerite: [34, 19, 36], glaucophane: [214, 47, 57], riebeckite: [218, 40, 34],
        pargasite: [137, 31, 36], magnesiohornblende: [145, 24, 33], ferrohornblende: [112, 16, 28],
        sanidine: [28, 25, 80], oligoclase: [37, 18, 79], andesine: [29, 17, 71], bytownite: [32, 21, 64],
        nepheline: [76, 10, 79], leucite: [43, 9, 83], sodalite: [215, 56, 49], analcime: [190, 9, 84],
        laumontite: [25, 21, 83], clinoptilolite: [36, 19, 79],
        kaolinite: [48, 9, 86], talc: [130, 14, 80], paragonite: [74, 13, 82], phlogopite: [35, 38, 60],
        annite: [24, 16, 27], lepidolite: [289, 31, 72], pyrophyllite: [45, 18, 80], clinochlore: [134, 25, 59],
        chamosite: [99, 22, 38], montmorillonite: [48, 18, 72], nontronite: [69, 31, 56], halloysite: [42, 11, 83],
        pyrope: [355, 54, 46], spessartine: [24, 70, 57], grossular: [78, 38, 61], andradite: [83, 32, 46],
        uvarovite: [139, 55, 44], staurolite: [27, 40, 42], zoisite: [110, 21, 59], clinozoisite: [96, 16, 70],
        epidote: [89, 40, 49], lawsonite: [205, 20, 75], prehnite: [125, 32, 70], pumpellyite_mg: [145, 32, 52],
        titanite: [41, 42, 51], hydroxylapatite: [106, 20, 67], monazite_ce: [43, 39, 61],
        xenotime_y: [37, 32, 56], elbaite: [166, 44, 59], beryl: [154, 31, 69], topaz: [194, 17, 83],
        tridymite: [200, 11, 86], cristobalite: [200, 9, 85], coesite: [190, 13, 82], stishovite: [201, 15, 73],
        aragonite: [46, 14, 82], ankerite: [30, 26, 53], smithsonite: [167, 33, 74], cerussite: [200, 10, 85],
        strontianite: [193, 11, 86], witherite: [195, 9, 84], barite: [46, 13, 82], celestine: [203, 39, 74],
        anglesite: [192, 11, 80], jarosite: [42, 54, 55], alunite: [37, 13, 77], chalcanthite: [211, 62, 58],
        chlorargyrite: [47, 11, 72], brookite: [31, 40, 43], ilmenite: [221, 8, 31], chromite: [224, 7, 27],
        cassiterite: [31, 27, 39], pyrolusite: [216, 10, 28], manganite: [225, 8, 25],
        lepidocrocite: [14, 58, 50], boehmite: [45, 9, 83], diaspore: [70, 13, 78], uraninite: [221, 8, 27],
        chalcopyrite: [45, 55, 53], troilite: [36, 30, 37], covellite: [214, 50, 43], bornite: [27, 33, 41],
        chalcocite: [214, 12, 39], molybdenite: [215, 10, 48], cinnabar: [5, 70, 50], arsenopyrite: [213, 9, 58],
        realgar: [14, 73, 58], orpiment: [45, 66, 58], stibnite: [216, 8, 42], acanthite: [219, 7, 32],
        cobaltite: [212, 12, 49], scheelite: [36, 50, 59], ferberite: [26, 13, 26], hubnerite: [16, 32, 39],
        wolframite: [25, 21, 31], vivianite: [169, 38, 49],
    };
    Object.assign(curatedColors, specimenColors);
    const curated = curatedColors[meta.id];
    if (curated)
        [hue, sat, light] = curated;
    const accent = (hue + 25 + (iconHash(meta.name) % 55)) % 360;
    return {
        main: hsl(hue, sat, light),
        light: hsl(hue, sat - 5, Math.min(light + 16, 92)),
        dark: hsl(hue, sat + 6, Math.max(light - 18, 18)),
        accent: hsl(accent, Math.min(sat + 18, 78), Math.max(light - 6, 24)),
        stroke: hsl(hue, sat * 0.35, Math.max(light - 35, 20)),
        sheen: hsl(hue, sat * 0.3, Math.min(light + 24, 96)),
    };
}
function archetype(meta) {
    const t = (meta.id + ' ' + meta.name + ' ' + meta.family).toLowerCase();
    if (/muscov|biotite|phlogopite|annite|paragonite|lepidolite|graphite|pyrophyllite|kaolinite|halloysite|montmorillonite|nontronite|clinochlore|chamosite|lizardite|antigorite|chrysotile|talc/.test(t))
        return 'sheet';
    if (/kyanite|andalusite|sillimanite|spodumene|beryl|topaz|stibnite/.test(t))
        return 'blade';
    if (/actinolite|tremolite|glaucophane|riebeckite|pargasite|hornblende|anthophyllite|grunerite|wollastonite/.test(t))
        return 'fan';
    if (/tourmaline|dravite|schorl|elbaite|enstatite|ferrosilite|diopside|hedenbergite|augite|jadeite|omphacite|aegirine|clinoenstatite|pigeonite/.test(t))
        return 'prism';
    if (/staurolite/.test(t))
        return 'cross';
    if (/calcite|dolomite|ankerite|magnesite|siderite|rhodochrosite|smithsonite|aragonite|cerussite|strontianite|witherite/.test(t))
        return 'rhombo';
    if (/fluorite|halite|sylvite|pyrite|galena/.test(t))
        return 'cube';
    if (/garnet|almandine|pyrope|grossular|spessartine|andradite|uvarovite/.test(t))
        return 'dodeca';
    if (/magnetite|spinel|hercynite|magnesioferrite|diamond/.test(t))
        return 'octa';
    if (/quartz|zircon|apatite|nepheline|sodalite|analcime|leucite|fluorapatite|hydroxylapatite/.test(t))
        return 'bipyramid';
    if (/barite|celestine|anglesite|laumontite|stilbite|clinoptilolite|gypsum|jarosite|alunite/.test(t))
        return 'tabular';
    if (/brookite|titanite/.test(t))
        return 'wedge';
    if (/goethite|manganite|boehmite|diaspore/.test(t))
        return 'needle';
    if (/cu$|silver_native|gold_native|fe$/.test(meta.id))
        return 'native';
    if (/s$/.test(meta.id))
        return 'aggregate';
    if (/malachite|azurite|prehnite|pumpellyite|chloritoid|cordierite/.test(t))
        return 'aggregate';
    if (/coesite|stishovite|cristobalite|tridymite/.test(t))
        return 'silica';
    if (/orthoclase|albite|microcline|sanidine|oligoclase|andesine|labradorite|bytownite|anorthite|corundum/.test(t))
        return 'block';
    return 'aggregate';
}
function detailLines(seed, c) {
    const v = (seed % 5) + 2;
    const segs = [];
    for (let i = 0; i < v; i++) {
        const x1 = 22 + ((seed >> (i + 1)) % 46), y1 = 24 + ((seed >> (i + 4)) % 46), x2 = x1 + 8 + ((seed >> (i + 8)) % 18), y2 = y1 + ((i % 2) * 8 - 4);
        segs.push(`<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${c}" stroke-width="1.1" opacity=".45" stroke-linecap="round"/>`);
    }
    return segs.join('');
}
function tplCube(p, seed) {
    const s = seed % 3;
    return `<path d="M22 33L49 19L76 33L76 66L49 81L22 67Z" fill="${p.main}" stroke="${p.stroke}" stroke-width="1.7"/><path d="M22 33L49 19L76 33L49 47Z" fill="${p.light}"/><path d="M49 47L76 33L76 66L49 81Z" fill="${p.dark}"/><path d="M49 47V81" fill="none" stroke="${p.stroke}" stroke-width="1.1"/><path d="M${26 + s * 2} 43l18 -10M${28 + s * 2} 52l18 -10M${30 + s * 2} 61l12 -7" stroke="${p.accent}" stroke-width="1.3" opacity=".6"/>`;
}
function tplBlock(p, seed) {
    const dx = seed % 4;
    return `<path d="M22 37L42 25L73 30L72 69L53 82L22 75Z" fill="${p.main}" stroke="${p.stroke}" stroke-width="1.6"/><path d="M22 37L42 25L73 30L53 43Z" fill="${p.light}"/><path d="M53 43L73 30L72 69L53 82Z" fill="${p.dark}"/><path d="M53 43V82M31 42V74M${37 + dx} 40V77" fill="none" stroke="${p.stroke}" stroke-width="1.05" opacity=".7"/><path d="M29 45L49 54" stroke="${p.accent}" stroke-width="1.25" opacity=".55"/>`;
}
function tplRhombo(p, seed) {
    const dy = seed % 4;
    return `<path d="M23 33L56 22L77 41L67 71L35 82L17 62Z" fill="${p.main}" stroke="${p.stroke}" stroke-width="1.7"/><path d="M23 33L56 22L77 41L42 52Z" fill="${p.light}"/><path d="M42 52L77 41L67 71L35 82Z" fill="${p.dark}"/><path d="M42 52L35 82L17 62L23 33Z" fill="${p.main}" opacity=".7"/><path d="M23 33L42 52L77 41M42 52L35 82" fill="none" stroke="${p.stroke}" stroke-width="1"/>${detailLines(seed, p.accent)}<path d="M${30 + dy} 38L${38 + dy} 52L${34 + dy} 66" stroke="${p.sheen}" stroke-width="1.1" opacity=".55"/>`;
}
function tplOcta(p, seed) {
    return `<path d="M48 14L79 45L48 83L18 46Z" fill="${p.main}" stroke="${p.stroke}" stroke-width="1.6"/><path d="M48 14L79 45L47 48Z" fill="${p.light}"/><path d="M18 46L48 14L47 48Z" fill="${p.main}"/><path d="M18 46L47 48L48 83Z" fill="${p.dark}" opacity=".86"/><path d="M47 48L79 45L48 83Z" fill="${p.dark}"/><path d="M18 46L47 48L79 45M47 48L48 83" fill="none" stroke="${p.stroke}" stroke-width="1.15"/><path d="M49 16L49 80" opacity=".38" stroke="${p.accent}" stroke-width="1"/>`;
}
function tplDodeca(p, seed) {
    return `<path d="M30 20L52 15L74 29L80 49L67 75L43 83L19 65L17 39Z" fill="${p.main}" stroke="${p.stroke}" stroke-width="1.7"/><path d="M30 20L52 15L56 39L34 45L17 39Z" fill="${p.light}"/><path d="M56 39L74 29L80 49L67 75L53 61Z" fill="${p.dark}"/><path d="M34 45L56 39L53 61L43 83L19 65Z" fill="${p.main}" opacity=".73"/><path d="M56 39L53 61L34 45L17 39M53 61L67 75" fill="none" stroke="${p.stroke}" stroke-width="1.1"/>${detailLines(seed, p.sheen)}`;
}
function tplPrism(p, seed) {
    const shift = seed % 6;
    return `<path d="M31 ${23 + shift}L49 18L65 ${26 + shift}L72 68L54 77L38 72Z" fill="${p.main}" stroke="${p.stroke}" stroke-width="1.45"/><path d="M31 ${23 + shift}L49 18L54 46L38 72Z" fill="${p.light}"/><path d="M54 46L65 ${26 + shift}L72 68L54 77Z" fill="${p.dark}"/><path d="M54 46L38 72M46 25L59 ${67 - shift}" fill="none" stroke="${p.stroke}" stroke-width="1.05" opacity=".75"/><path d="M42 30L55 66M47 27L60 62" stroke="${p.accent}" stroke-width="1.1" opacity=".5"/>`;
}
function tplBlade(p, seed) {
    const tilt = seed % 3;
    return `<path d="M34 16L49 20L63 77L49 84Z" fill="${p.main}" stroke="${p.stroke}" stroke-width="1.45"/><path d="M48 20L60 ${12 + tilt}L78 69L63 77Z" fill="${p.light}" stroke="${p.stroke}" stroke-width="1.35"/><path d="M63 77L78 69L68 84L49 84Z" fill="${p.dark}"/><path d="M40 28L54 76M57 24L71 69" stroke="${p.accent}" stroke-width="1.1" opacity=".62"/>`;
}
function tplSheet(p, seed) {
    const a = (seed % 5) - 2;
    return `<path d="M23 62Q42 43 76 51L72 66Q49 58 27 75Z" fill="${p.dark}" stroke="${p.stroke}" stroke-width="1.25"/><path d="M20 52Q45 ${32 + a} 77 39L76 55Q48 46 22 67Z" fill="${p.main}" stroke="${p.stroke}" stroke-width="1.25"/><path d="M21 43Q43 ${26 - a} 76 32L78 45Q50 40 21 57Z" fill="${p.light}" stroke="${p.stroke}" stroke-width="1.25"/><path d="M23 47L71 41" opacity=".42" stroke="${p.accent}" stroke-width="1.0"/><path d="M25 57L71 52" opacity=".34" stroke="${p.sheen}" stroke-width=".9"/>`;
}
function tplFan(p, seed) {
    const spread = seed % 4;
    return `<path d="M24 76L42 20L53 22L41 77Z" fill="${p.main}" stroke="${p.stroke}" stroke-width="1.35"/><path d="M40 77L56 18L67 22L57 79Z" fill="${p.light}" stroke="${p.stroke}" stroke-width="1.35"/><path d="M54 78L72 ${26 + spread}L78 ${38 + spread}L70 80Z" fill="${p.dark}" stroke="${p.stroke}" stroke-width="1.35"/><path d="M29 65L46 27M45 67L59 25M61 72L72 ${39 + spread}" stroke="${p.accent}" stroke-width="1" opacity=".6"/>`;
}
function tplTabular(p, seed) {
    return `<path d="M18 51L35 28L69 24L80 43L64 68L31 72Z" fill="${p.main}" stroke="${p.stroke}" stroke-width="1.5"/><path d="M18 51L35 28L69 24L50 49Z" fill="${p.light}"/><path d="M50 49L69 24L80 43L64 68Z" fill="${p.dark}"/><path d="M50 49L31 72L18 51M50 49L64 68" fill="none" stroke="${p.stroke}" stroke-width="1"/><path d="M24 55L58 51M30 63L63 59" stroke="${p.accent}" stroke-width="1.15" opacity=".58"/>`;
}
function tplWedge(p, seed) {
    return `<path d="M20 52L37 21L69 29L77 50L53 78L29 72Z" fill="${p.main}" stroke="${p.stroke}" stroke-width="1.55"/><path d="M20 52L37 21L53 49L29 72Z" fill="${p.light}"/><path d="M53 49L69 29L77 50L53 78Z" fill="${p.dark}"/><path d="M29 72L53 49L20 52M53 49L77 50" fill="none" stroke="${p.stroke}" stroke-width="1.02"/><path d="M38 29L50 50M45 26L58 45" stroke="${p.accent}" stroke-width="1.1" opacity=".5"/>`;
}
function tplNeedle(p, seed) {
    const s = seed % 6;
    return `<path d="M30 82L45 ${18 + s}L49 ${19 + s}L38 82Z" fill="${p.main}" stroke="${p.stroke}" stroke-width="1.25"/><path d="M45 ${18 + s}L58 ${12 + s}L66 77L50 82Z" fill="${p.light}" stroke="${p.stroke}" stroke-width="1.18"/><path d="M54 81L67 ${26 + s}L73 ${33 + s}L66 83Z" fill="${p.dark}" stroke="${p.stroke}" stroke-width="1.18"/><path d="M35 72L46 ${29 + s}M49 76L61 ${26 + s}M59 76L69 ${40 + s}" stroke="${p.accent}" stroke-width="1" opacity=".58"/>`;
}
function tplAggregate(p, seed) {
    const a = seed % 4;
    return `<path d="M18 49L31 31L51 23L71 31L80 52L69 72L44 81L24 72Z" fill="${p.main}" stroke="${p.stroke}" stroke-width="1.6"/><path d="M18 49L31 31L44 47L24 72Z" fill="${p.light}"/><path d="M44 47L51 23L71 31L80 52L58 56Z" fill="${p.dark}"/><path d="M24 72L44 47L58 56L69 72L44 81Z" fill="${p.main}" opacity=".78"/><circle cx="${28 + a * 2}" cy="60" r="4" fill="${p.sheen}" opacity=".6"/><circle cx="${59 - a}" cy="41" r="3.4" fill="${p.sheen}" opacity=".56"/><path d="M43 47L58 56L80 52" stroke="${p.stroke}" stroke-width="1" fill="none"/>`;
}
function tplCross(p, seed) {
    return `<path d="M34 18L47 18L58 42L76 52L72 64L53 60L45 80L33 79L37 58L20 47L23 34L40 40Z" fill="${p.main}" stroke="${p.stroke}" stroke-width="1.6"/><path d="M34 18L47 18L48 48L37 58L20 47L23 34L40 40Z" fill="${p.light}"/><path d="M48 48L58 42L76 52L72 64L53 60L45 80L33 79L37 58Z" fill="${p.dark}"/><path d="M48 48L40 40L58 42M48 48L45 80" fill="none" stroke="${p.stroke}" stroke-width="1.05"/>`;
}
function tplSilica(p, seed) {
    return `<path d="M23 39L37 24L59 21L73 35L67 57L49 73L29 66Z" fill="${p.main}" stroke="${p.stroke}" stroke-width="1.55"/><path d="M23 39L37 24L47 42L29 66Z" fill="${p.light}"/><path d="M47 42L59 21L73 35L67 57L49 73Z" fill="${p.dark}"/><path d="M47 42L49 73M47 42L73 35" fill="none" stroke="${p.stroke}" stroke-width="1" opacity=".68"/><path d="M28 57L64 40M33 65L66 49" stroke="${p.accent}" stroke-width="1.0" opacity=".45"/>`;
}
function tplBipyramid(p, seed) {
    return `<path d="M48 14L67 30L75 50L48 82L21 50L29 30Z" fill="${p.main}" stroke="${p.stroke}" stroke-width="1.55"/><path d="M48 14L67 30L48 49L29 30Z" fill="${p.light}"/><path d="M29 30L48 49L21 50Z" fill="${p.main}" opacity=".8"/><path d="M67 30L75 50L48 49Z" fill="${p.dark}"/><path d="M21 50L48 49L48 82Z" fill="${p.main}" opacity=".68"/><path d="M75 50L48 49L48 82Z" fill="${p.dark}" opacity=".85"/><path d="M48 14V82M21 50H75" fill="none" stroke="${p.stroke}" stroke-width="1.05" opacity=".55"/>`;
}
function tplNative(p, seed, meta) {
    const id = meta.id;
    if (id === 'gold_native')
        return HANDCRAFTED_SHAPES.gold_native;
    if (id === 'silver_native')
        return HANDCRAFTED_SHAPES.silver_native;
    if (id === 'cu')
        return HANDCRAFTED_SHAPES.cu;
    if (id === 'fe')
        return HANDCRAFTED_SHAPES.fe;
    return `<path d="M19 50L31 31L51 26L72 35L78 53L66 73L42 80L24 69Z" fill="${p.main}" stroke="${p.stroke}" stroke-width="1.7"/><path d="M19 50L31 31L44 48L24 69Z" fill="${p.light}"/><path d="M44 48L51 26L72 35L78 53L57 57Z" fill="${p.dark}"/><path d="M24 69L44 48L57 57L66 73L42 80Z" fill="${p.main}" opacity=".74"/>${detailLines(seed, p.sheen)}`;
}
/**
 * Refinamentos espécie a espécie. Uma identidade própria é consequência do hábito,
 * da textura ou da geminação ilustrada; variação de cor sozinha não basta.
 * Não usar os desenhos como chave de identificação mineralógica absoluta.
 */
function curatedSpeciesShape(meta, p, seed) {
    const edge = `stroke="${p.stroke}" stroke-width="1.4" stroke-linejoin="round"`;
    switch (meta.id) {
        case 'fluorite': // grupo cúbico em que triângulos sugerem clivagem octaédrica
            return `<path d="M20 39L43 22L69 31L76 58L55 78L27 69Z" fill="${p.main}" ${edge}/><path d="M20 39L43 22L50 47L27 69Z" fill="${p.light}"/><path d="M50 47L69 31L76 58L55 78Z" fill="${p.dark}"/><path d="M27 69L50 47L55 78Z" fill="${p.accent}" opacity=".65"/><path d="M35 35L50 47L70 44M50 47L55 78" stroke="${p.stroke}" stroke-width="1.2" fill="none"/><path d="M38 27L52 38" stroke="${p.sheen}" stroke-width="2" opacity=".7"/>`;
        case 'sylvite': // cubo com crescimento em degraus
            return `${tplCube(p, seed)}<path d="M32 45L49 36L63 42L48 51L34 51Z" fill="${p.light}" opacity=".65"/><path d="M35 58L49 50L65 56M37 65L50 57L65 63" fill="none" stroke="${p.sheen}" stroke-width="2.2" opacity=".85"/>`;
        case 'dolomite': // romboedro com faces encurvadas, forma de sela estilizada
            return `<path d="M17 43Q38 25 63 30L80 49Q64 69 39 79L19 62Z" fill="${p.main}" ${edge}/><path d="M17 43Q38 25 63 30L46 48Z" fill="${p.light}"/><path d="M46 48L63 30L80 49L39 79Z" fill="${p.dark}"/><path d="M17 43Q37 55 46 48Q61 54 80 49M46 48L39 79" stroke="${p.stroke}" stroke-width="1.1" fill="none"/><path d="M25 57Q47 65 68 51" stroke="${p.sheen}" stroke-width="1.6" opacity=".65" fill="none"/>`;
        case 'siderite': // romboedro marrom com zoneamento ferrífero
            return `${tplRhombo(p, seed)}<path d="M31 44L48 55L44 73M38 37L56 48L55 68" stroke="${p.accent}" opacity=".9" stroke-width="2.2" fill="none"/>`;
        case 'rhodochrosite': // agregado mamelonar róseo sobre romboedros
            return `<path d="M22 69L27 48L44 32L68 38L77 56L63 76L39 80Z" fill="${p.dark}" ${edge}/><circle cx="35" cy="48" r="15" fill="${p.main}" ${edge}/><circle cx="57" cy="52" r="17" fill="${p.light}" ${edge}/><circle cx="40" cy="68" r="15" fill="${p.main}" ${edge}/><circle cx="57" cy="62" r="11" fill="${p.accent}" stroke="${p.stroke}" stroke-width="1" opacity=".65"/><path d="M44 44Q54 39 64 47M34 65Q39 60 45 63" fill="none" stroke="${p.sheen}" stroke-width="2"/>`;
        case 'malachite': // massas botrioidais e bandas concêntricas
            return `<path d="M17 57Q20 39 36 39Q38 23 54 25Q69 25 70 43Q83 50 76 67Q65 79 44 77Q25 83 17 57Z" fill="${p.dark}" ${edge}/><circle cx="39" cy="56" r="19" fill="${p.main}" stroke="${p.stroke}" stroke-width="1.1"/><circle cx="39" cy="56" r="13" fill="none" stroke="${p.light}" stroke-width="3.8"/><circle cx="39" cy="56" r="7" fill="${p.dark}"/><circle cx="62" cy="54" r="14" fill="${p.main}" stroke="${p.stroke}" stroke-width="1"/><circle cx="62" cy="54" r="9" fill="none" stroke="${p.light}" stroke-width="3"/><path d="M25 45Q38 31 51 43M55 48Q64 44 70 51" fill="none" stroke="${p.sheen}" stroke-width="1.8" opacity=".8"/>`;
        case 'azurite': // prismas tabulares azuis em leque
            return `<path d="M25 76L22 36L39 24L49 63Z" fill="${p.main}" ${edge}/><path d="M35 77L42 17L58 25L57 72Z" fill="${p.light}" ${edge}/><path d="M49 72L66 24L78 38L65 78Z" fill="${p.dark}" ${edge}/><path d="M22 36L36 45L39 24M42 17L54 43L58 25M66 24L65 57L78 38" fill="none" stroke="${p.stroke}" stroke-width="1.2"/><path d="M31 45L37 69M48 34L50 65M70 38L60 70" stroke="${p.sheen}" opacity=".6" stroke-width="1.5"/>`;
        case 'gypsum': // cristais de selenita geminados em cauda de andorinha
            return `<path d="M25 77L25 35L40 18L52 49L66 19L78 37L68 78L47 63Z" fill="${p.main}" ${edge}/><path d="M25 35L40 18L52 49L47 63L25 77Z" fill="${p.light}"/><path d="M52 49L66 19L78 37L68 78L47 63Z" fill="${p.dark}"/><path d="M25 35L47 63L68 78M78 37L47 63M40 18L52 49L66 19" stroke="${p.stroke}" stroke-width="1.2" fill="none"/><path d="M31 39L40 29M67 30L72 39" stroke="${p.sheen}" stroke-width="2"/>`;
        case 'microcline': // geminação em grade cruzada (efeito xadrez)
            return `${tplBlock(p, seed)}<path d="M29 46L47 55M30 54L47 63M30 62L46 72M35 42L35 72M43 44L43 77" stroke="${p.accent}" stroke-width="1.55" opacity=".75"/>`;
        case 'anorthite': // lâminas tabulares com maclas mais esparsas
            return `<path d="M19 40L42 21L70 28L77 65L53 82L24 72Z" fill="${p.main}" ${edge}/><path d="M19 40L42 21L70 28L47 47Z" fill="${p.light}"/><path d="M47 47L70 28L77 65L53 82Z" fill="${p.dark}"/><path d="M47 47L53 82M28 43L33 72M36 40L41 76" stroke="${p.stroke}" stroke-width="1.1" fill="none"/><path d="M29 50L44 56M33 61L48 67" stroke="${p.sheen}" stroke-width="2.1" opacity=".8"/>`;
        case 'labradorite': // feldspato tabular com planos de reflexo iridescente ilustrativos
            return `${tplBlock(p, seed)}<path d="M29 48L49 53L54 64L31 60Z" fill="#78B7C9" opacity=".75"/><path d="M33 62L51 65L54 72L35 70Z" fill="#4A7BA8" opacity=".85"/><path d="M35 44L50 47" stroke="#C9F3EF" stroke-width="2.2" opacity=".8"/>`;
        case 'rutile': // agulhas tetragonais vermelhas em feixe
            return `<path d="M24 78L33 25L43 15L43 73Z" fill="${p.dark}" ${edge}/><path d="M38 80L50 19L62 15L55 77Z" fill="${p.main}" ${edge}/><path d="M56 78L65 29L75 23L70 77Z" fill="${p.light}" ${edge}/><path d="M28 68L38 30M45 69L56 27M61 69L69 36" stroke="${p.sheen}" stroke-width="1.5" opacity=".64"/>`;
        case 'anatase': // cristal bipiramidal tetragonal com terminação aguda
            return `<path d="M48 12L71 34L80 51L48 85L16 51L25 34Z" fill="${p.main}" ${edge}/><path d="M48 12L25 34L48 50Z" fill="${p.light}"/><path d="M48 12L71 34L48 50Z" fill="${p.dark}"/><path d="M16 51L48 50L48 85Z" fill="${p.main}"/><path d="M80 51L48 50L48 85Z" fill="${p.dark}"/><path d="M25 34L16 51L48 50L80 51L71 34" fill="none" stroke="${p.stroke}" stroke-width="1.1"/>`;
        case 'lizardite': // serpentinitos lamelares em placas muito finas
            return `<path d="M19 64L32 45L71 41L79 54L67 73L30 78Z" fill="${p.dark}" ${edge}/><path d="M20 51L35 34L71 31L77 45L64 61L27 66Z" fill="${p.main}" ${edge}/><path d="M23 42L37 24L70 22L75 34L64 50L28 57Z" fill="${p.light}" ${edge}/><path d="M30 45L63 41M28 59L64 54M32 71L63 65" stroke="${p.accent}" stroke-width="1.2" opacity=".6"/>`;
        case 'antigorite': // ondulações de bandas serpentiníticas
            return `<path d="M18 67Q29 32 44 46Q60 61 77 23L80 44Q65 81 48 65Q34 52 21 81Z" fill="${p.main}" ${edge}/><path d="M20 55Q33 23 49 39Q64 54 75 17" fill="none" stroke="${p.light}" stroke-width="7" stroke-linecap="round" opacity=".9"/><path d="M25 68Q37 42 48 54Q62 68 76 35" fill="none" stroke="${p.dark}" stroke-width="3.5" stroke-linecap="round"/>`;
        case 'chrysotile': // feixe de fibras sedosas finas
            return `<path d="M23 77Q30 38 42 20M31 81Q37 42 47 18M39 82Q45 45 54 16M49 81Q56 47 64 22M59 79Q66 48 73 30" fill="none" stroke="${p.stroke}" stroke-width="7" stroke-linecap="round"/><path d="M23 77Q30 38 42 20M31 81Q37 42 47 18M39 82Q45 45 54 16M49 81Q56 47 64 22M59 79Q66 48 73 30" fill="none" stroke="${p.main}" stroke-width="5.2" stroke-linecap="round"/><path d="M25 75Q32 42 42 24M42 77Q49 42 54 21M62 74Q67 49 73 32" stroke="${p.sheen}" stroke-width="1.7" fill="none" opacity=".8"/>`;
        case 'zircon': // prisma tetragonal com duas terminações piramidais
            return `<path d="M49 10L68 26L70 64L49 86L28 64L30 26Z" fill="${p.main}" ${edge}/><path d="M49 10L68 26L49 38L30 26Z" fill="${p.light}"/><path d="M49 38L68 26L70 64L49 86Z" fill="${p.dark}"/><path d="M30 26L49 38L49 86L28 64Z" fill="${p.main}"/><path d="M30 26L49 38L68 26M49 38V86M28 64L49 72L70 64" stroke="${p.stroke}" stroke-width="1.1" fill="none"/>`;
        case 'fluorapatite': // prismas hexagonais com terminação plana
            return `<path d="M27 27L42 19L59 20L73 30L70 70L55 80L37 77L25 66Z" fill="${p.main}" ${edge}/><path d="M27 27L42 19L44 40L37 77L25 66Z" fill="${p.light}"/><path d="M44 40L59 20L73 30L70 70L55 80L44 75Z" fill="${p.dark}"/><path d="M27 27L44 40L73 30M44 40L44 75M42 19L59 20" fill="none" stroke="${p.stroke}" stroke-width="1"/>`;
        case 'sillimanite': // fibrolita em feixe acicular
            return `<path d="M21 77L30 32L37 17L37 71Z" fill="${p.main}" ${edge}/><path d="M31 81L44 23L53 14L50 78Z" fill="${p.light}" ${edge}/><path d="M48 79L60 19L69 26L64 79Z" fill="${p.main}" ${edge}/><path d="M62 76L72 34L79 45L74 79Z" fill="${p.dark}" ${edge}/><path d="M26 69L34 30M37 72L48 30M53 70L64 31" stroke="${p.sheen}" opacity=".6" stroke-width="1.3"/>`;
        case 'andalusite': // prisma quadrado com núcleo em cruz estilizado
            return `<path d="M25 28L40 19L67 26L73 71L53 81L27 70Z" fill="${p.main}" ${edge}/><path d="M25 28L40 19L67 26L50 40Z" fill="${p.light}"/><path d="M50 40L67 26L73 71L53 81Z" fill="${p.dark}"/><path d="M50 40V76M28 51L49 59M34 43L42 65M43 47L31 61" stroke="${p.stroke}" stroke-width="2" fill="none" opacity=".75"/>`;
        case 'stilbite': // agregados radiantes em feixe / laço
            return `<path d="M48 54L18 31L31 19L49 49L67 18L79 31Z" fill="${p.main}" ${edge}/><path d="M48 54L19 71L31 82L50 60L66 82L79 69Z" fill="${p.light}" ${edge}/><path d="M48 54L25 31M48 54L34 22M48 54L71 30M48 54L69 71M48 54L32 74" stroke="${p.stroke}" stroke-width="1.4"/><circle cx="49" cy="55" r="4" fill="${p.dark}"/>`;
        case 'cordierite': // prisma pseudohexagonal curto
            return `<path d="M24 33L38 23L57 22L72 33L73 70L58 80L37 79L24 69Z" fill="${p.main}" ${edge}/><path d="M24 33L38 23L45 42L37 79L24 69Z" fill="${p.light}"/><path d="M45 42L57 22L72 33L73 70L58 80L45 75Z" fill="${p.dark}"/><path d="M24 33L45 42L72 33M45 42V75" stroke="${p.stroke}" stroke-width="1.2" fill="none"/>`;
        case 'chloritoid': // placas foliáceas com faces losangulares
            return `<path d="M21 46L41 29L69 31L77 54L56 72L26 69Z" fill="${p.dark}" ${edge}/><path d="M18 35L39 18L67 22L74 43L53 62L24 59Z" fill="${p.main}" ${edge}/><path d="M18 35L39 18L52 40L24 59Z" fill="${p.light}"/><path d="M52 40L67 22L74 43L53 62Z" fill="${p.dark}"/><path d="M24 59L52 40L74 43" stroke="${p.stroke}" stroke-width="1" fill="none"/>`;
        case 'marcasite': // agregado em crista de galo (piritas não possuem esta silhueta)
            return `<path d="M19 73L16 45L29 37L32 63L38 29L49 23L49 61L58 25L71 31L66 64L80 43L80 65L68 78L36 81Z" fill="${p.main}" ${edge}/><path d="M16 45L29 37L32 63L38 29L49 23L49 61Z" fill="${p.light}"/><path d="M49 61L58 25L71 31L66 64L80 43L80 65L68 78Z" fill="${p.dark}"/><path d="M25 48L29 68M42 37L44 65M62 36L60 69" stroke="${p.sheen}" opacity=".64" stroke-width="1.6"/>`;
        case 'pyrrhotite': // placas hexagonais superpostas
            return `<path d="M16 49L38 31L61 31L80 47L66 66L40 69Z" fill="${p.dark}" ${edge}/><path d="M20 38L40 20L63 22L77 38L62 56L39 59Z" fill="${p.main}" ${edge}/><path d="M20 38L40 20L63 22L48 38Z" fill="${p.light}"/><path d="M48 38L63 22L77 38L62 56L39 59Z" fill="${p.dark}"/><path d="M26 48L56 51M32 61L67 59" stroke="${p.accent}" stroke-width="1.1" opacity=".7"/>`;
        case 'sphalerite': // agregado tetraédrico com faces brilhantes
            return `<path d="M25 68L47 18L73 71Z" fill="${p.main}" ${edge}/><path d="M25 68L47 18L49 59Z" fill="${p.light}"/><path d="M47 18L73 71L49 59Z" fill="${p.dark}"/><path d="M33 76L54 43L78 76Z" fill="${p.main}" ${edge}/><path d="M33 76L54 43L56 67Z" fill="${p.light}"/><path d="M54 43L78 76L56 67Z" fill="${p.dark}"/>`;
        case 'pentlandite': // massa metálica granular com faces cúbicas em inclusão
            return `<path d="M18 57L28 34L48 23L69 30L80 53L66 74L41 81L21 71Z" fill="${p.dark}" ${edge}/><path d="M22 51L34 34L50 37L53 59L34 67Z" fill="${p.main}" ${edge}/><path d="M44 42L61 31L73 43L67 63L51 67Z" fill="${p.light}" ${edge}/><path d="M32 43L44 40L48 55L35 58ZM54 52L67 49L65 59L56 60Z" fill="${p.accent}" opacity=".5"/>`;
        case 'spodumene': // cristais longos e achatados
            return `<path d="M26 83L38 21L54 14L50 75L38 85Z" fill="${p.main}" ${edge}/><path d="M46 80L59 16L75 26L66 78Z" fill="${p.light}" ${edge}/><path d="M54 14L59 16L46 80L50 75Z" fill="${p.dark}"/><path d="M32 70L45 27M53 69L66 28" stroke="${p.sheen}" stroke-width="1.6" opacity=".74"/>`;
        case 'dravite': // prisma de turmalina com seção triangular e estrias
            return `<path d="M30 27L48 17L69 28L67 71L47 81L29 71Z" fill="${p.main}" ${edge}/><path d="M30 27L48 17L48 81L29 71Z" fill="${p.light}"/><path d="M48 17L69 28L67 71L48 81Z" fill="${p.dark}"/><path d="M36 31L36 70M42 28L42 75M55 28L54 76M61 31L60 72" stroke="${p.accent}" stroke-width="1.25" opacity=".55"/>`;
        case 'schorl': // cristais de turmalina prismáticos mais esguios e quase negros
            return `<path d="M25 72L30 25L44 15L57 22L66 70L48 82Z" fill="${p.main}" ${edge}/><path d="M30 25L44 15L47 42L25 72Z" fill="${p.light}"/><path d="M47 42L57 22L66 70L48 82Z" fill="${p.dark}"/><path d="M39 24L38 72M51 29L53 76M57 35L61 68" stroke="${p.sheen}" stroke-width="1.2" opacity=".45"/>`;
        default: return null;
    }
}
/** Hábito principal, detalhe visual e observação mineralógica por espécie.
 * Nenhuma entrada deste mapa depende apenas de recoloração do desenho-base.
 * Hábito e textura são ilustrações de ocorrências características, não universais.
 */
const SPECIES_ART_DIRECTION = {
    // Haletos, óxidos e hidróxidos
    halite: ['hopper', 'terraces', 'cubos com crescimento em degraus'],
    hematite: ['rosette', 'metal', 'hematita especular em roseta de placas'],
    periclase: ['cubePair', 'cleavage', 'cristais cúbicos e clivagem'],
    lime: ['granular', 'pores', 'agregados granulares de CaO'],
    corundum: ['barrel', 'sixRidges', 'prisma hexagonal barrilado'],
    cuprite: ['octaPair', 'brightFacet', 'octaedros vermelho-cobre'],
    portlandite: ['hexPlate', 'layering', 'lamelas pseudohexagonais'],
    goethite: ['botryoidal', 'radialLines', 'massas reniformes e fibras radiais'],
    brucite: ['flaky', 'pearly', 'agregados de placas hexagonais'],
    gibbsite: ['hexPlate', 'stepped', 'placas pseudohexagonais sobrepostas'],
    wustite: ['cube', 'fracture', 'octaedros não privilegiados; massa com clivagem cúbica'],
    spinel: ['octa', 'facet', 'cristal octaédrico'],
    hercynite: ['octaPair', 'darkSeams', 'octaedros escuros agrupados'],
    magnesioferrite: ['octa', 'streaks', 'octaedro com faces reflexivas'],
    tenorite: ['bladed', 'striated', 'agulhas e lâminas escuras de CuO'],
    anhydrite: ['tabularPair', 'cleavage', 'placas de anidrita ortorrômbica'],
    // Inossilicatos, nesossilicatos, anfibólios
    enstatite: ['prismPair', 'straightCleavage', 'cristais prismáticos ortopiroxênicos'],
    forsterite: ['granular', 'facet', 'grãos facetados verdes de olivina magnesiana'],
    wollastonite: ['needleFan', 'silky', 'feixes aciculares de wollastonita'],
    ferrosilite: ['prism', 'shadowCore', 'prisma marrom-ferrífero'],
    diopside: ['prismPair', 'cleavage', 'prismas verdes e clivagens distintas'],
    hedenbergite: ['prism', 'darkSeams', 'prisma clinopiroxênico escuro'],
    fayalite: ['granular', 'darkSeams', 'grãos de olivina ferrífera'],
    augite: ['stubbyPrism', 'cleavage', 'prismas curtos e robustos de augita'],
    tremolite: ['needleFan', 'paleCore', 'feixes aciculares claros'],
    tephroite: ['granular', 'crossgrain', 'cristais maciços ricos em Mn'],
    monticellite: ['shortPrism', 'paleCore', 'cristais prismáticos curtos'],
    kirschsteinite: ['granular', 'veins', 'grãos Ca-Fe-olivínicos'],
    clinoenstatite: ['twinPrism', 'obliqueCleavage', 'clinoenstatita com prisma geminado'],
    jadeite: ['shards', 'translucent', 'massa verde clara de cristais fibrosos compactos'],
    omphacite: ['prismPair', 'zoning', 'prismas verdes heterogêneos'],
    aegirine: ['needleFan', 'darkSeams', 'agulhas alongadas verde-escuras'],
    pigeonite: ['shortPrism', 'smallFacets', 'prismas compactos'],
    actinolite: ['fan', 'parallel', 'cristais alongados e fibrosos verdes'],
    ferroactinolite: ['prismPair', 'darkSeams', 'cristais escuros com clivagens anfibólicas'],
    anthophyllite: ['fibres', 'silky', 'feixes paralelos ortorrômbicos'],
    grunerite: ['fibres', 'darkSeams', 'fibras de anfibólio Fe'],
    glaucophane: ['needleFan', 'blueRidges', 'agulhas de anfibólio azul'],
    riebeckite: ['prism', 'parallel', 'anfibólio azul-escuro prismático'],
    pargasite: ['stubbyPrism', 'cleavage', 'anfibólio compacto verde escuro'],
    magnesiohornblende: ['prismPair', 'crossgrain', 'prismas escuros com clivagens'],
    ferrohornblende: ['stubbyPrism', 'darkSeams', 'prismas ferríferos robustos'],
    // Feldspatos, feldspatoides e zeólitas
    sanidine: ['block', 'cleanFaces', 'cristal tabular simples de alta temperatura'],
    oligoclase: ['tabularPair', 'fineTwins', 'plagioclásio com maclas finas'],
    andesine: ['block', 'lamellarTwins', 'plagioclásio com lamelas abundantes'],
    bytownite: ['tabularPair', 'strongTwins', 'plagioclásio cálcico maclado'],
    nepheline: ['barrel', 'edgeZone', 'prisma pseudohexagonal curto'],
    leucite: ['garnet', 'trapezoid', 'formas trapezoédricas de leucita'],
    sodalite: ['granular', 'blueVeins', 'massa azul e fraturas claras de sodalita'],
    analcime: ['garnet', 'glassy', 'analcima com cristais trapezoédricos'],
    laumontite: ['twinPrism', 'cleavage', 'prismas alongados de laumontita'],
    clinoptilolite: ['flaky', 'feathery', 'placas finas de zeólita'],
    // Filossilicatos, argilas e micas
    kaolinite: ['hexPlate', 'fineStack', 'pilhas de plaquetas pseudohexagonais'],
    talc: ['flaky', 'silky', 'lâminas escamosas de talco'],
    paragonite: ['flaky', 'straightCleavage', 'muscovita sódica em folhas finas'],
    phlogopite: ['hexPlate', 'metal', 'lâminas micáceas bronzeadas'],
    annite: ['flaky', 'darkSeams', 'mica ferro-escura estriada'],
    lepidolite: ['rosette', 'flakeLines', 'roseta de lâminas lilases'],
    pyrophyllite: ['rosette', 'feathery', 'roseta foliácea de pirofilita'],
    clinochlore: ['flaky', 'greenRidges', 'clorita verde em folhas superpostas'],
    chamosite: ['flaky', 'darkSeams', 'clorita verde-escura ferrífera'],
    montmorillonite: ['earthy', 'layering', 'agregado argiloso estratificado'],
    nontronite: ['earthy', 'pores', 'agregado terroso de esmectita ferrífera'],
    halloysite: ['tubes', 'hollow', 'agregado de tubos e filamentos de haloisita'],
    // Granadas e metamórficos
    pyrope: ['garnet', 'brightFacet', 'granada magnesiana vermelho-profundo'],
    spessartine: ['garnet', 'striated', 'granada manganesífera alaranjada'],
    grossular: ['garnetPair', 'facet', 'granadas claras/verde-mel agrupadas'],
    andradite: ['garnet', 'triangularFacet', 'granada férrica multifacetada'],
    uvarovite: ['druzy', 'greenRidges', 'granada cromífera em drusa verde'],
    staurolite: ['cross', 'twinMark', 'geminação cruzada em estaurolita'],
    zoisite: ['prismPair', 'longitudinal', 'epidoto ortorrômbico prismático'],
    clinozoisite: ['bladed', 'fineTwins', 'epidoto-clinozoisita em lâminas'],
    epidote: ['prismPair', 'pistachio', 'prismas verdes estriados de epidoto'],
    lawsonite: ['tabularPair', 'edgeZone', 'cristais tabulares azulados de lawsonita'],
    prehnite: ['botryoidal', 'radialLines', 'agregado mamelonar de prehnita'],
    pumpellyite_mg: ['needleFan', 'feathery', 'cristais radiantes de pumpellyita'],
    // Acessórios, fosfatos, turmalinas, polimorfos SiO2
    titanite: ['wedge', 'smallFacets', 'cristais em cunha de titanita'],
    hydroxylapatite: ['hexBarrel', 'straightCleavage', 'prisma hexagonal curto de apatita'],
    monazite_ce: ['wedge', 'brightFacet', 'cristais tabulares amarelo-âmbar'],
    xenotime_y: ['tetraBipyramid', 'facets', 'bipirâmide tetragonal de xenotima'],
    elbaite: ['hexPrism', 'zoning', 'turmalina estriada e zonada'],
    beryl: ['hexPrism', 'fineTwins', 'cristal hexagonal de berilo'],
    topaz: ['twinPrism', 'cleavage', 'cristal ortorrômbico facetado de topázio'],
    tridymite: ['hexPlate', 'thinPlates', 'lamelas delgadas de sílica'],
    cristobalite: ['octa', 'fineFacet', 'cristal pseudooctaédrico de cristobalita'],
    coesite: ['granular', 'microfractures', 'agregados finos de sílica de alta pressão'],
    stishovite: ['needleFan', 'paleCore', 'cristais aciculares de SiO₂ de alta pressão'],
    // Carbonatos, sulfatos e haletos
    magnesite: ['rhomboPair', 'paleCore', 'romboedros claros de magnesita'],
    aragonite: ['pseudoHex', 'twinning', 'maclas pseudohexagonais de aragonita'],
    ankerite: ['rhombo', 'edgeZone', 'romboedro carbonático ferrífero'],
    smithsonite: ['botryoidal', 'banded', 'agregado botrioidal de smithsonita'],
    cerussite: ['twinPrism', 'twinMark', 'geminação característica em cerussita'],
    strontianite: ['needleFan', 'paleCore', 'feixes radiais de estroncianita'],
    witherite: ['pseudoHex', 'crossgrain', 'cristal pseudohexagonal de witherita'],
    barite: ['rosette', 'bladeBands', 'roseta de cristais tabulares de barita'],
    celestine: ['tabularPair', 'blueRidges', 'cristais tabulares azul-claros'],
    anglesite: ['tetraBipyramid', 'paleCore', 'bipirâmides ortorrômbicas'],
    jarosite: ['rhomboPair', 'microfacets', 'cristais romboédricos amarelos finos'],
    alunite: ['earthy', 'smallFacets', 'agregado alunítico claro'],
    chalcanthite: ['bladed', 'translucent', 'cristais azuis triclinicos'],
    chlorargyrite: ['roundedCube', 'waxy', 'cubo arredondado de clorargirita'],
    // Óxidos, hidróxidos e sulfetos metálicos
    brookite: ['tabularPair', 'darkSeams', 'placas de brookita castanha'],
    ilmenite: ['hexPlate', 'metal', 'placas escuras pseudohexagonais'],
    chromite: ['granular', 'darkSeams', 'agregado granular preto de cromita'],
    cassiterite: ['twinPrism', 'brightFacet', 'geminação em joelho de cassiterita'],
    pyrolusite: ['dendritic', 'radiating', 'agulhas/dendritos negros de MnO₂'],
    manganite: ['needleFan', 'darkSeams', 'cristais negros aciculares'],
    lepidocrocite: ['rosette', 'warmEdges', 'lâminas vermelhas alaranjadas'],
    boehmite: ['flaky', 'paleCore', 'flocos finos de boehmita'],
    diaspore: ['bladed', 'striated', 'lâminas alongadas de diásporo'],
    uraninite: ['cubePair', 'fracture', 'cubos negros de uraninita'],
    chalcopyrite: ['tetraBipyramid', 'metal', 'faces metálicas de calcopirita'],
    troilite: ['granular', 'bronze', 'agregado sulfetado hexagonal escuro'],
    covellite: ['flaky', 'blueRidges', 'lâminas metálicas azuis de covelita'],
    bornite: ['granular', 'tarnish', 'agregado com iridescência superficial'],
    chalcocite: ['tabularPair', 'darkSeams', 'placas pseudohexagonais escuras'],
    molybdenite: ['flaky', 'metal', 'folhas metálicas de molibdenita'],
    cinnabar: ['rhomboPair', 'brightFacet', 'romboedros de cinábrio vermelho'],
    arsenopyrite: ['prismPair', 'metal', 'prismas estriados de arsenopirita'],
    realgar: ['bladed', 'brightFacet', 'cristais vermelhos alaranjados de realgar'],
    orpiment: ['flaky', 'yellowBands', 'lâminas amarelas de ouropigmento'],
    stibnite: ['needleFan', 'metal', 'agulhas radiantes metálicas de estibnita'],
    acanthite: ['roundedCube', 'metal', 'massa pseudo-cúbica de acantita'],
    cobaltite: ['cube', 'brightFacet', 'faces metálicas cúbicas de cobaltita'],
    // Tungstatos, fosfatos
    scheelite: ['tetraBipyramid', 'honeyFacet', 'bipirâmide tetragonal de scheelita'],
    ferberite: ['tabularPair', 'longitudinal', 'lâminas escuras alongadas de wolframita Fe'],
    hubnerite: ['bladed', 'warmEdges', 'lâminas vermelho-acastanhadas de wolframita Mn'],
    wolframite: ['tabularPair', 'darkSeams', 'placas ferrimanganesíferas estriadas'],
    vivianite: ['fan', 'blueRidges', 'feixe de cristais verdes-azulados de vivianita'],
};
const REMAINING_ICON_IDS = Object.freeze(Object.keys(SPECIES_ART_DIRECTION));
/** Ícones individualizados manualmente na versão anterior. */
const CURATED_ICON_IDS = Object.freeze([
    'fluorite', 'sylvite', 'dolomite', 'siderite', 'rhodochrosite', 'malachite',
    'azurite', 'gypsum', 'microcline', 'anorthite', 'labradorite', 'rutile',
    'anatase', 'lizardite', 'antigorite', 'chrysotile', 'zircon', 'fluorapatite',
    'sillimanite', 'andalusite', 'stilbite', 'cordierite', 'chloritoid',
    'marcasite', 'pyrrhotite', 'sphalerite', 'pentlandite', 'spodumene', 'dravite', 'schorl',
]);
/** Geometria e texturas para os 129 desenhos individualizados nesta revisão.
 * Os repertórios são compartilhados, mas a composição e detalhe estão escolhidos
 * individualmente em SPECIES_ART_DIRECTION, em vez de serem derivados de cor/ID.
 */
function speciesBaseShape(habit, p, seed) {
    const edge = `stroke="${p.stroke}" stroke-width="1.45" stroke-linejoin="round"`;
    const g = (inner, transform) => `<g transform="${transform}">${inner}</g>`;
    const j = seed % 5;
    switch (habit) {
        case 'cube': return tplCube(p, seed);
        case 'hopper': return `${tplCube(p, seed)}<path d="M28 42L49 31L68 40L49 51Z M34 43L49 35L61 41L49 47Z M52 55L71 45L71 62L52 73Z" fill="none" stroke="${p.sheen}" stroke-width="2.2" opacity=".84"/>`;
        case 'cubePair': return g(tplCube(p, seed), 'translate(-15 12) scale(.86)') + g(tplCube(p, seed + 2), 'translate(22 -5) scale(.76)');
        case 'roundedCube': return `<path d="M24 36Q24 31 29 29L47 20Q52 18 56 21L73 32Q77 35 77 40L76 65Q76 70 71 73L54 81Q50 83 46 81L24 69Q20 67 20 61Z" fill="${p.main}" ${edge}/><path d="M24 36L49 47L73 32L54 21L29 29Z" fill="${p.light}"/><path d="M49 47L76 39L76 65L54 81L49 77Z" fill="${p.dark}"/><path d="M49 47V77M24 36L49 47L73 32" fill="none" stroke="${p.stroke}" stroke-width="1.1"/>`;
        case 'octa': return tplOcta(p, seed);
        case 'octaPair': return g(tplOcta(p, seed), 'translate(-18 14) scale(.8)') + g(tplOcta(p, seed + 3), 'translate(20 -3) scale(.79)');
        case 'garnet': return tplDodeca(p, seed);
        case 'garnetPair': return g(tplDodeca(p, seed), 'translate(-18 14) scale(.8)') + g(tplDodeca(p, seed + 5), 'translate(19 -4) scale(.79)');
        case 'rhombo': return tplRhombo(p, seed);
        case 'rhomboPair': return g(tplRhombo(p, seed), 'translate(-16 14) scale(.80)') + g(tplRhombo(p, seed + 4), 'translate(18 -4) scale(.82)');
        case 'prism': return `${tplPrism(p, seed)}<path d="M36 34L42 69M59 31L63 68" stroke="${p.accent}" stroke-width="1.4" opacity=".55"/>`;
        case 'prismPair': return g(tplPrism(p, seed), 'translate(-18 13) scale(.82)') + g(tplPrism(p, seed + 3), 'translate(19 -6) scale(.83)');
        case 'shortPrism': return g(tplPrism(p, seed), 'translate(-5 11) scale(1.12 .81)');
        case 'stubbyPrism': return g(tplPrism(p, seed), 'translate(-10 13) scale(1.23 .80)') + `<path d="M32 69L51 72L64 65" stroke="${p.sheen}" stroke-width="1.65" fill="none" opacity=".56"/>`;
        case 'twinPrism': return `${g(tplPrism(p, seed), 'translate(-12 7) scale(.81 .96) rotate(-12 48 48)')}${g(tplPrism(p, seed + 2), 'translate(17 -5) scale(.83) rotate(14 48 48)')}`;
        case 'block': return tplBlock(p, seed);
        case 'barrel':
        case 'hexBarrel':
        case 'hexPrism': {
            const top = habit === 'hexBarrel' ? 29 : habit === 'barrel' ? 32 : 20;
            const bottom = habit === 'hexBarrel' ? 71 : habit === 'barrel' ? 68 : 81;
            return `<path d="M27 ${top + 8}L41 ${top}L59 ${top}L72 ${top + 8}L69 ${bottom - 5}L56 ${bottom}L38 ${bottom - 1}L25 ${bottom - 10}Z" fill="${p.main}" ${edge}/><path d="M27 ${top + 8}L41 ${top}L46 ${top + 20}L38 ${bottom - 1}L25 ${bottom - 10}Z" fill="${p.light}"/><path d="M46 ${top + 20}L59 ${top}L72 ${top + 8}L69 ${bottom - 5}L56 ${bottom}L46 ${bottom - 4}Z" fill="${p.dark}"/><path d="M27 ${top + 8}L46 ${top + 20}L72 ${top + 8}M46 ${top + 20}L46 ${bottom - 4}M41 ${top}L59 ${top}" fill="none" stroke="${p.stroke}" stroke-width="1.05"/>`;
        }
        case 'hexPlate': {
            const piece = `<path d="M20 48L35 36L59 36L76 48L61 61L35 62Z" fill="${p.main}" ${edge}/><path d="M20 48L35 36L59 36L47 47Z" fill="${p.light}"/><path d="M47 47L59 36L76 48L61 61Z" fill="${p.dark}"/>`;
            return `${g(piece, 'translate(-2 17) scale(1 .82)')}${g(piece, 'translate(3 -7) scale(.98 .95)')}`;
        }
        case 'tabularPair': return `${g(tplTabular(p, seed), 'translate(-12 15) scale(.88) rotate(-10 48 48)')}${g(tplTabular(p, seed + 3), 'translate(15 -5) scale(.86) rotate(8 48 48)')}`;
        case 'bladed': return `${tplBlade(p, seed)}${g(tplBlade(p, seed + 1), 'translate(-18 14) scale(.63) rotate(-17 48 48)')}`;
        case 'wedge': return `${tplWedge(p, seed)}<path d="M34 27L54 48L66 36" fill="none" stroke="${p.sheen}" stroke-width="1.8" opacity=".55"/>`;
        case 'tetraBipyramid': return `${tplBipyramid(p, seed)}<path d="M29 33L47 49L68 32M47 49L48 80" fill="none" stroke="${p.accent}" stroke-width="1.15" opacity=".55"/>`;
        case 'pseudoHex': return `<path d="M47 13L67 28L77 49L68 73L47 83L27 73L18 48L27 27Z" fill="${p.main}" ${edge}/><path d="M47 13L67 28L48 48L27 27Z" fill="${p.light}"/><path d="M67 28L77 49L68 73L48 48Z" fill="${p.dark}"/><path d="M27 27L48 48L27 73L18 48Z" fill="${p.main}"/><path d="M48 48L68 73L47 83L27 73Z" fill="${p.dark}"/><path d="M47 13L48 48L47 83M18 48L77 49" stroke="${p.stroke}" stroke-width="1.1" fill="none"/>`;
        case 'cross': return tplCross(p, seed);
        case 'flaky': return `${tplSheet(p, seed)}<path d="M22 ${56 + j}Q46 ${40 + j} 69 48" stroke="${p.sheen}" stroke-width="1.4" opacity=".7" fill="none"/>`;
        case 'fibres': {
            const lines = Array.from({ length: 8 }, (_, i) => { const x = 18 + i * 8, by = 78 - ((seed + i) % 3) * 3, tx = 31 + i * 6 - ((seed + i) % 5); return `<path d="M${x} ${by}Q${x + 1} 43 ${tx} ${19 + ((seed + i) % 12)}" stroke="${i % 3 === 0 ? p.dark : i % 3 === 1 ? p.main : p.light}" stroke-width="${4 + (i % 3)}" stroke-linecap="round" fill="none"/>`; });
            return `${lines.join('')}<path d="M21 80Q47 72 76 79" stroke="${p.stroke}" stroke-width="1.4" fill="none"/>`;
        }
        case 'tubes': {
            const tubes = Array.from({ length: 5 }, (_, i) => { const x = 24 + i * 10, dy = (i * 3 + seed) % 8; return `<path d="M${x} ${77 - dy}Q${x - 4} 45 ${x + 8} ${29 + dy}" stroke="${p.stroke}" stroke-width="9" stroke-linecap="round" fill="none"/><path d="M${x} ${77 - dy}Q${x - 4} 45 ${x + 8} ${29 + dy}" stroke="${p.main}" stroke-width="7" stroke-linecap="round" fill="none"/><circle cx="${x + 8}" cy="${29 + dy}" r="2.8" fill="${p.dark}"/>`; }).join('');
            return tubes;
        }
        case 'shards': return `<path d="M22 75L30 32L47 17L43 70Z" fill="${p.light}" ${edge}/><path d="M37 79L48 28L60 18L65 72Z" fill="${p.main}" ${edge}/><path d="M56 76L73 35L79 53L71 78Z" fill="${p.dark}" ${edge}/>`;
        case 'fan':
        case 'needleFan': {
            const narrow = habit === 'needleFan';
            const count = narrow ? 7 : 5;
            return Array.from({ length: count }, (_, i) => {
                const x = 48 + (i - (count - 1) / 2) * (narrow ? 8 : 12), top = 14 + (i * 9 + seed) % 19, bottom = 78 + (i % 2) * 2, w = narrow ? 3.5 : 7;
                return `<path d="M${45 + (i % 3)} 80L${x - w} ${top + 11}L${x} ${top}L${x + w} ${top + 11}L${51 + (i % 2)} ${bottom}Z" fill="${i % 3 === 0 ? p.dark : i % 3 === 1 ? p.main : p.light}" ${edge}/><path d="M${x} ${top + 4}L${47 + (i % 3)} 75" stroke="${p.sheen}" stroke-width=".8" opacity=".65"/>`;
            }).join('');
        }
        case 'rosette': {
            return `<circle cx="48" cy="55" r="18" fill="${p.dark}" opacity=".4"/>${Array.from({ length: 7 }, (_, i) => `<g transform="rotate(${i * 360 / 7 + (seed % 8)} 48 53)"><path d="M41 54L34 31L44 15L53 30L55 53Z" fill="${i % 2 ? p.main : p.light}" ${edge}/><path d="M44 24L48 49" stroke="${p.accent}" opacity=".55" stroke-width="1.3"/></g>`).join('')}<circle cx="48" cy="53" r="6" fill="${p.dark}" stroke="${p.stroke}" stroke-width="1.4"/>`;
        }
        case 'botryoidal': {
            const coords = [[26, 59, 16], [41, 42, 18], [60, 44, 18], [72, 61, 14], [48, 65, 20]];
            return `<path d="M19 70Q11 50 29 37Q45 17 63 32Q84 33 81 58Q77 77 49 82Z" fill="${p.dark}" ${edge}/>` + coords.map(([x, y, r], i) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${i % 2 ? p.main : p.light}" stroke="${p.stroke}" stroke-width="1.2"/><ellipse cx="${x - 4}" cy="${y - 5}" rx="${Math.round(r / 3)}" ry="${Math.round(r / 5)}" fill="${p.sheen}" opacity=".7"/>`).join('');
        }
        case 'granular': {
            const coords = [[29, 43, 13], [49, 31, 15], [69, 46, 14], [33, 67, 14], [55, 65, 17]];
            return coords.map(([x, y, r], i) => { const d = (seed + i * 3) % 6; return `<path d="M${x - r} ${y - 2}L${x - r / 2} ${y - r + d}L${x + r / 2} ${y - r / 2}L${x + r} ${y + 3}L${x + r / 4} ${y + r}L${x - r / 2} ${y + r / 2}Z" fill="${i % 3 === 0 ? p.dark : i % 3 === 1 ? p.main : p.light}" ${edge}/><path d="M${x - r / 2} ${y - r + d}L${x} ${y + 1}L${x + r / 4} ${y + r}" stroke="${p.sheen}" opacity=".52" stroke-width="1.1" fill="none"/>`; }).join('');
        }
        case 'earthy': {
            const points = `M18 64L24 44L37 36L45 22L63 30L76 43L82 62L67 77L43 81L24 73Z`;
            return `<path d="${points}" fill="${p.main}" ${edge}/><path d="M24 44L45 22L52 44L37 62L24 73Z" fill="${p.light}"/><path d="M52 44L63 30L76 43L82 62L67 77L43 81Z" fill="${p.dark}" opacity=".66"/>` + Array.from({ length: 13 }, (_, i) => { const x = 25 + ((i * 11 + seed) % 47), y = 41 + ((i * 7 + (seed >> 4)) % 31); return `<circle cx="${x}" cy="${y}" r="${1 + (i % 2)}" fill="${i % 3 === 0 ? p.stroke : p.sheen}" opacity=".65"/>`; }).join('');
        }
        case 'druzy': {
            const mass = `<path d="M17 64L27 49L39 57L52 48L67 53L80 64L74 79L24 80Z" fill="${p.dark}" ${edge}/>`;
            return mass + Array.from({ length: 9 }, (_, i) => { const x = 21 + i * 7, y = 44 + ((seed >> i) % 10), h = 14 + ((seed + i * 13) % 17); return `<path d="M${x - 5} ${y + 15}L${x} ${y - h}L${x + 6} ${y + 15}Z" fill="${i % 3 === 0 ? p.dark : i % 3 === 1 ? p.main : p.light}" ${edge}/>`; }).join('');
        }
        case 'dendritic': {
            const branches = ['M48 82L48 18', 'M48 54L26 33L20 19', 'M48 60L72 39L79 21', 'M48 69L24 63L17 49', 'M48 42L62 24L62 15', 'M36 43L38 21', 'M62 49L76 51'];
            return `<g fill="none" stroke-linecap="round" stroke-linejoin="round">${branches.map((d, i) => `<path d="${d}" stroke="${p.stroke}" stroke-width="${i === 0 ? 10 : 7}"/><path d="${d}" stroke="${i % 2 ? p.light : p.main}" stroke-width="${i === 0 ? 7 : 4.5}"/>`).join('')}</g>`;
        }
        default: throw new Error(`Unknown mineral habit: ${habit}`);
    }
}
/** Detalhes específicos de hábito, geminação, agregação, textura ou acabamento.
 * Cada chave tem geometria própria; algumas foram escolhidas para séries que
 * não se distinguem macroscopicamente, preservando apenas uma diferença sutil.
 */
function speciesDetail(feature, p, seed) {
    const z = seed % 7, u = (seed >> 4) % 5;
    const S = p.stroke, L = p.sheen, A = p.accent, D = p.dark;
    switch (feature) {
        case 'terraces': return `<path d="M32 43L49 34L64 42L48 50Z M37 44L49 38L58 43L49 47Z" fill="none" stroke="${L}" opacity=".72" stroke-width="1.7"/>`;
        case 'cleavage': return `<path d="M29 40L43 57L38 74M49 34L63 51L56 74" stroke="${S}" stroke-width="1.4" opacity=".48" fill="none"/>`;
        case 'straightCleavage': return `<path d="M${29 + z} 33L${35 + z} 72M${41 + u} 28L${45 + u} 73M${54 + z} 31L${59 + z} 69" stroke="${A}" stroke-width="1.1" opacity=".67"/>`;
        case 'obliqueCleavage': return `<path d="M31 45L61 56M33 54L64 65M29 62L60 72" stroke="${S}" stroke-width="1.1" opacity=".52"/>`;
        case 'darkSeams': return `<path d="M${30 + z} 37L${44 + z} 53L${36 + u} 73M53 30L${61 + z} 46L58 69" fill="none" stroke="${S}" stroke-width="2.2" opacity=".63"/>`;
        case 'shadowCore': return `<path d="M44 36L56 42L56 68L45 73Z" fill="${D}" opacity=".34"/><path d="M47 38L50 66" stroke="${S}" stroke-width="1.2" opacity=".4"/>`;
        case 'facet': return `<path d="M32 43L48 33L61 42L55 57L41 62Z" fill="${L}" opacity=".35"/><path d="M33 43L49 53L57 69" fill="none" stroke="${S}" stroke-width="1.2"/>`;
        case 'facets': return `<path d="M28 45L45 35L62 47L53 62L36 67Z" fill="${A}" opacity=".3"/><path d="M28 45L53 62L62 47M45 35L53 62" stroke="${L}" stroke-width="1.2" opacity=".52" fill="none"/>`;
        case 'brightFacet': return `<path d="M35 33L54 30L61 42L47 49Z" fill="${L}" opacity=".62"/><path d="M40 38L51 33" stroke="${L}" stroke-width="2.8" stroke-linecap="round"/>`;
        case 'sixRidges': return `<path d="M29 37L43 45L43 70M43 45L61 36M54 42L55 71" fill="none" stroke="${S}" stroke-width="1.2" opacity=".65"/>`;
        case 'layering': return `<path d="M22 58Q48 51 72 58M27 66Q50 61 67 66M29 73L63 73" fill="none" stroke="${A}" stroke-width="1.3" opacity=".53"/>`;
        case 'thinPlates': return `<path d="M24 50L70 46M26 55L71 53M29 60L68 58M31 65L65 63M34 69L62 68" fill="none" stroke="${L}" stroke-width="1.25" opacity=".72"/>`;
        case 'fineStack': return `<path d="M25 51L71 49M26 55L68 53M29 60L66 57M31 64L65 61M33 69L63 66" stroke="${S}" stroke-width=".85" opacity=".62"/>`;
        case 'stepped': return `<path d="M28 48L49 44L66 49M29 54L50 50L67 56M32 61L53 57L63 61" stroke="${L}" stroke-width="1.2" fill="none" opacity=".7"/>`;
        case 'pearly': return `<path d="M29 42Q46 35 69 44M27 51Q50 44 72 54" stroke="${L}" stroke-width="2" opacity=".65" fill="none"/>`;
        case 'paleCore': return `<path d="M40 40L53 29L60 45L49 62L39 57Z" fill="${L}" opacity=".35"/>`;
        case 'metal': return `<path d="M27 38L48 32L56 38M30 58L43 53L54 56M52 70L67 63" stroke="${L}" stroke-width="2.1" stroke-linecap="round" opacity=".72"/>`;
        case 'bronze': return `<path d="M31 42L46 36L57 45M36 61L48 56L65 63" stroke="${A}" stroke-width="2.1" stroke-linecap="round" fill="none" opacity=".72"/>`;
        case 'tarnish': return `<path d="M25 50Q39 31 54 46Q62 51 73 39" stroke="hsl(221 55% 54%)" stroke-width="5" opacity=".75" fill="none"/><path d="M26 62Q48 44 70 66" stroke="hsl(281 41% 55%)" stroke-width="4" opacity=".72" fill="none"/>`;
        case 'pores': return Array.from({ length: 8 }, (_, i) => `<circle cx="${28 + (i * 11 + z) % 41}" cy="${35 + (i * 7 + u) % 36}" r="${1.5 + i % 2}" fill="${i % 2 ? S : D}" opacity=".55"/>`).join('');
        case 'microfractures': return `<path d="M27 47L39 54L34 64M57 37L52 51L65 61M47 66L51 75" stroke="${S}" stroke-width="1.1" fill="none" opacity=".47"/>`;
        case 'fracture': return `<path d="M28 39L36 51L34 61L48 69M54 32L50 44L67 56L63 73" fill="none" stroke="${S}" stroke-width="1.9" opacity=".6"/>`;
        case 'smallFacets': return `<path d="M36 38L47 30L55 37L46 49L34 46Z" fill="${A}" opacity=".25"/><path d="M35 55L46 48L60 54L53 65Z" fill="${L}" opacity=".3"/>`;
        case 'microfacets': return `<path d="M32 43L39 38L46 43L40 51ZM51 52L60 46L66 54L57 60Z" fill="${L}" opacity=".4"/>`;
        case 'fineFacet': return `<path d="M38 27L54 33L48 47Z M31 55L49 48L43 66Z" fill="${L}" opacity=".44"/>`;
        case 'triangularFacet': return `<path d="M35 37L55 27L56 48Z M44 55L65 50L59 70Z" fill="${A}" opacity=".42"/>`;
        case 'honeyFacet': return `<path d="M30 43L47 31L62 45L45 61Z" fill="${L}" opacity=".5"/><path d="M34 46L47 38L57 47" stroke="${S}" stroke-width="1.1" fill="none"/>`;
        case 'trapezoid': return `<path d="M29 34L50 26L67 38L57 51L35 48Z" fill="${L}" opacity=".39"/><path d="M30 64L44 51L67 58L57 73Z" fill="${A}" opacity=".22"/>`;
        case 'glassy': return `<path d="M30 39L38 31M52 30L59 34M47 63L57 55" stroke="${L}" stroke-width="3" stroke-linecap="round" opacity=".72"/>`;
        case 'translucent': return `<path d="M31 34L51 25L63 41L52 69L38 65Z" fill="${L}" opacity=".24"/><path d="M37 36L47 31" stroke="${L}" stroke-width="2.1" opacity=".8"/>`;
        case 'silky': return `<path d="M29 58Q33 39 40 24M37 64Q45 44 51 24M51 68Q59 49 62 31M62 65Q68 50 70 41" stroke="${L}" stroke-width="1.15" opacity=".7" fill="none"/>`;
        case 'feathery': return `<path d="M45 75L49 23M41 47L33 40M54 44L66 38M40 58L28 52M54 58L70 51M44 36L36 30M53 36L61 27" stroke="${L}" stroke-width="1.3" opacity=".67"/>`;
        case 'radiating': return `<path d="M49 74L30 35M49 74L47 25M49 74L65 35M49 74L76 50" stroke="${L}" stroke-width="1.4" opacity=".56"/>`;
        case 'radialLines': return `<path d="M48 66L30 38M48 66L43 28M48 66L62 33M48 66L70 49M48 66L23 60" stroke="${A}" stroke-width="1.3" opacity=".54"/>`;
        case 'twinning': return `<path d="M25 43L48 60L72 41M25 52L48 69L72 52" stroke="${S}" stroke-width="1.6" fill="none" opacity=".68"/>`;
        case 'twinMark': return `<path d="M27 40L54 61M33 29L63 56M30 61L62 40" stroke="${A}" stroke-width="1.35" opacity=".67"/>`;
        case 'fineTwins': return `<path d="M30 41L43 47M32 45L45 51M34 49L47 55M36 53L49 59M38 57L51 63" stroke="${S}" stroke-width=".75" opacity=".57"/>`;
        case 'lamellarTwins': return `<path d="M29 42L49 53M29 49L49 60M30 56L50 67M31 63L52 74" stroke="${S}" stroke-width="1.35" opacity=".55"/>`;
        case 'strongTwins': return `<path d="M26 40L51 54M28 49L54 63M30 58L55 72" stroke="${S}" stroke-width="2.1" opacity=".65"/>`;
        case 'twinPrism': return `<path d="M32 37L46 48L60 35M32 47L46 58L60 46" stroke="${S}" stroke-width="1.7" fill="none" opacity=".5"/>`;
        case 'striated': return Array.from({ length: 4 }, (_, i) => `<path d="M${30 + i * 7} ${35 + i}L${33 + i * 7} ${66 + i}" stroke="${A}" stroke-width="${i % 2 ? 1.05 : 1.35}" opacity=".52"/>`).join('');
        case 'streaks': return `<path d="M26 43L48 34M28 50L52 42M31 57L53 49M51 63L69 54" stroke="${L}" stroke-width="1.15" opacity=".64"/>`;
        case 'parallel': return `<path d="M31 37L40 74M39 29L48 73M48 28L57 72M58 33L65 68" stroke="${L}" stroke-width="1.25" opacity=".64"/>`;
        case 'longitudinal': return `<path d="M35 31L38 74M44 28L46 74M54 30L57 72M63 35L65 64" stroke="${S}" stroke-width="1.1" opacity=".6"/>`;
        case 'crossgrain': return `<path d="M29 48L53 61M34 38L61 51M36 62L62 74" stroke="${L}" stroke-width="1.4" opacity=".7"/>`;
        case 'greenRidges': return `<path d="M24 43L46 38L67 46M25 52L48 48L70 57M29 62L51 57L68 64" stroke="${A}" stroke-width="1.5" opacity=".56" fill="none"/>`;
        case 'blueRidges': return `<path d="M32 36L51 50M37 28L57 46M42 60L61 73" stroke="hsl(207 56% 75%)" stroke-width="2.0" opacity=".75"/>`;
        case 'pistachio': return `<path d="M28 53L42 43L58 49M34 66L50 57L64 61" stroke="hsl(75 42% 72%)" stroke-width="2.1" opacity=".8" fill="none"/>`;
        case 'zoning': return `<path d="M35 37L53 33L65 45L56 61L40 64L30 50Z" fill="none" stroke="${A}" stroke-width="2.1" opacity=".51"/>`;
        case 'edgeZone': return `<path d="M28 40L42 29L65 37L69 59L53 70L30 63Z" fill="none" stroke="${L}" stroke-width="2" opacity=".58"/>`;
        case 'blueVeins': return `<path d="M30 37L41 52L33 64M56 28L53 46L67 57L63 72" stroke="hsl(198 55% 83%)" stroke-width="2.2" opacity=".76" fill="none"/>`;
        case 'banded': return `<path d="M23 63Q40 44 62 50M27 71Q47 53 69 58M30 79Q51 63 74 68" stroke="${L}" stroke-width="2" opacity=".66" fill="none"/>`;
        case 'bladeBands': return `<path d="M35 35L52 57M42 25L59 49M26 46L47 65" stroke="${A}" stroke-width="1.4" opacity=".72"/>`;
        case 'yellowBands': return `<path d="M24 47Q48 42 72 50M25 57Q50 51 72 60" stroke="hsl(54 80% 78%)" stroke-width="3" opacity=".75" fill="none"/>`;
        case 'warmEdges': return `<path d="M27 41L43 28M57 35L68 42M32 67L54 75" stroke="hsl(24 68% 76%)" stroke-width="2.0" opacity=".72" fill="none"/>`;
        case 'flakeLines': return `<path d="M28 46L61 38M29 53L68 45M33 60L65 54" stroke="${S}" stroke-width="1.2" opacity=".53"/>`;
        case 'smallStripes': return `<path d="M30 37L37 68M40 34L47 70M51 33L59 68" stroke="${A}" stroke-width="1.15" opacity=".56"/>`;
        case 'hollow': return Array.from({ length: 5 }, (_, i) => `<circle cx="${26 + i * 10}" cy="${30 + (i * 3 + z) % 8}" r="${2 + i % 2}" fill="${D}" opacity=".5"/>`).join('');
        case 'waxy': return `<path d="M29 40Q47 27 65 39M28 58Q50 43 70 57" fill="none" stroke="${L}" stroke-width="2.8" opacity=".6" stroke-linecap="round"/>`;
        case 'cleanFaces': return `<path d="M33 39L45 32M51 45L64 37" stroke="${L}" opacity=".55" stroke-width="1.8" stroke-linecap="round"/>`;
        case 'veins': return `<path d="M28 46Q38 41 48 55Q57 65 67 60" stroke="${A}" stroke-width="2.1" opacity=".55" fill="none"/>`;
        default: throw new Error(`Unknown mineral detail: ${feature}`);
    }
}
function artDirectedSpeciesShape(meta, p, seed) {
    const spec = SPECIES_ART_DIRECTION[meta.id];
    if (!spec)
        return null;
    const [habit, detail] = spec;
    // Offset and proportions are small, deliberate specimen-to-specimen variations;
    // the primary silhouette and diagnostic detail come from the map above.
    const shift = (seed % 5) - 2;
    const twist = ((seed >>> 3) % 7) - 3;
    const art = speciesBaseShape(habit, p, seed);
    const surface = speciesDetail(detail, p, seed);
    return `<g transform="translate(${shift * .7} 0) rotate(${twist * .55} 48 48)">${art}${surface}</g>`;
}
function buildGeneratedShape(meta) {
    const p = paletteFor(meta);
    const seed = iconHash(meta.id + meta.name + meta.family);
    const kind = archetype(meta);
    switch (kind) {
        case 'cube': return tplCube(p, seed);
        case 'block': return tplBlock(p, seed);
        case 'rhombo': return tplRhombo(p, seed);
        case 'octa': return tplOcta(p, seed);
        case 'dodeca': return tplDodeca(p, seed);
        case 'prism': return tplPrism(p, seed);
        case 'blade': return tplBlade(p, seed);
        case 'sheet': return tplSheet(p, seed);
        case 'fan': return tplFan(p, seed);
        case 'tabular': return tplTabular(p, seed);
        case 'wedge': return tplWedge(p, seed);
        case 'needle': return tplNeedle(p, seed);
        case 'cross': return tplCross(p, seed);
        case 'silica': return tplSilica(p, seed);
        case 'bipyramid': return tplBipyramid(p, seed);
        case 'native': return tplNative(p, seed, meta);
        default: return tplAggregate(p, seed);
    }
}
function normalizeMeta(input) {
    if (typeof input === 'string')
        return HANDCRAFTED_SHAPES[input] ? { id: input, name: input, family: '', formula: '' } : null;
    if (!input || !input.id)
        return null;
    const family = (input.family ?? '').toLowerCase();
    if (/íon|ion|molécula|molecula|agente|reagente|aquoso/.test(family))
        return null;
    return { id: input.id, name: input.name ?? input.id, family: input.family ?? '', formula: input.formula ?? '' };
}
/** `null` significa que a entrada não é um mineral reconhecido pela biblioteca. */
function mineralIconMarkup(input) {
    const meta = normalizeMeta(input);
    if (!meta)
        return null;
    const shape = HANDCRAFTED_SHAPES[meta.id] ?? curatedSpeciesShape(meta, paletteFor(meta), iconHash(meta.id + meta.name + meta.family)) ?? artDirectedSpeciesShape(meta, paletteFor(meta), iconHash(meta.id + meta.name + meta.family)) ?? buildGeneratedShape(meta);
    const label = iconEsc(meta.name || meta.id);
    return `<svg class="mineral-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" aria-hidden="true" focusable="false" data-mineral="${iconEsc(meta.id)}" aria-label="${label}">${shape}</svg>`;
}
