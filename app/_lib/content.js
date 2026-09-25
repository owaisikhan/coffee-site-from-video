// Every word on the page lives here, so copy edits never touch components.
// Menu items, prices and origins are PLACEHOLDERS until the owner sends the real list.

export const NAV = [
  { label: "01. Menu", href: "#menu" },
  { label: "02. Build", href: "#build" },
  { label: "03. House", href: "#house" },
  { label: "04. Brew", href: "#brew" },
  { label: "05. Craft", href: "#craft" },
  { label: "06. Origins", href: "#origins" },
  { label: "07. Story", href: "#story" },
];

/*
 * Hero timeline. p is scroll progress through the pinned hero (0 to 1).
 * Beats follow the footage: drop, crema, bean, tamp, pour, cup.
 */
export const HERO_BEATS = [
  { until: 0.14, label: "01 · THE DROP" },
  { until: 0.3, label: "02 · THE CREMA" },
  { until: 0.42, label: "03 · THE BEAN" },
  { until: 0.62, label: "04 · THE TAMP" },
  { until: 0.84, label: "05 · THE POUR" },
  { until: 1.01, label: "06 · THE CUP" },
];

export const SHOT_SPECS = [
  ["DOSE", "18 G"],
  ["YIELD", "36 G"],
  ["SHOT TIME", "28 SEC"],
  ["BREW TEMP", "93 °C"],
  ["PRESSURE", "9 BAR"],
  ["GRIND", "FINE"],
  ["ROAST", "MEDIUM"],
];

export const MENU = [
  {
    id: "house-latte",
    name: "HOUSE LATTE",
    tag: "01 / SIGNATURE",
    price: 5,
    img: "/stills/cup.webp",
    desc: "Double ristretto under silky steamed milk, finished with a rosetta. The cup most people come back for.",
    badges: ["DOUBLE SHOT", "STEAMED MILK", "LATTE ART"],
  },
  {
    id: "espresso",
    name: "THE ESPRESSO",
    tag: "02 / PURE",
    price: 3,
    img: "/stills/crema.webp",
    desc: "Eighteen grams in, thirty-six out, twenty-eight seconds. Thick crema, dark chocolate, a clean finish.",
    badges: ["18 G DOSE", "THICK CREMA", "NO MILK"],
  },
  {
    id: "flat-white",
    name: "FLAT WHITE",
    tag: "03 / BALANCED",
    price: 5,
    img: "/stills/latte.webp",
    desc: "Less milk, more coffee. A thin layer of microfoam poured straight into the shot so the espresso still leads.",
    badges: ["RISTRETTO", "MICROFOAM", "SMALL CUP"],
  },
];

export const BASE_PRICE = 4;

export const SIZES = [
  { id: "s", label: "S", name: "SMALL CUP", desc: "8 oz · 1 shot", extra: 0, img: "/stills/pair.webp" },
  { id: "m", label: "M", name: "MEDIUM CUP", desc: "12 oz · 2 shots", extra: 1, img: "/stills/cup.webp" },
  { id: "l", label: "L", name: "LARGE CUP", desc: "16 oz · 3 shots", extra: 2, img: "/stills/latte.webp" },
];

export const ADD_ONS = [
  { id: "shot", label: "EXTRA SHOT", price: 1, img: "/stills/pour.webp" },
  { id: "oat", label: "OAT MILK", price: 1, img: "/stills/latte.webp" },
  { id: "vanilla", label: "VANILLA SYRUP", price: 1, img: "/stills/drop.webp" },
  { id: "caramel", label: "CARAMEL", price: 1, img: "/stills/crema.webp" },
  { id: "cinnamon", label: "CINNAMON DUST", price: 0, img: "/stills/grounds.webp" },
  { id: "foam", label: "COLD FOAM", price: 2, img: "/stills/vortex.webp" },
];

export const HOUSE_FACTS = [
  { label: "DOSE", value: "18 G" },
  { label: "SHOT TIME", value: "28 SEC" },
  { label: "BREW TEMP", value: "93 °C" },
  { label: "PRESSURE", value: "9 BAR" },
  { label: "ROASTED", value: "WEEKLY" },
  { label: "MILK", value: "TO ORDER" },
];

export const STATS = [
  { end: 18, suffix: "G", label: "GRAMS\nIN THE BASKET", sub: "Weighed on a scale for every shot. Two grams off and the cup tastes different." },
  { end: 28, suffix: "S", label: "SECONDS\nOF EXTRACTION", sub: "Short enough to stay sweet, long enough to pull the body out of the grounds." },
  { end: 93, suffix: "°", label: "CELSIUS\nAT THE GROUP HEAD", sub: "Hot enough for full flavour, cool enough that nothing tastes burnt." },
  { end: 9, suffix: "", label: "BAR\nOF PRESSURE", sub: "The pressure that turns hot water and fine coffee into espresso with crema." },
];

export const BREW_STAGES = [
  {
    title: "THE BEANS\nREST",
    body: "Roasted in small batches, rested for a week so the gas settles and the flavour opens up.",
    tempLabel: "ROOM TEMPERATURE",
  },
  {
    title: "BLOOM\nBEGINS",
    body: "Water meets the puck. The grounds swell, release their gas and get ready to give up their oils.",
    tempLabel: "PRE-INFUSION",
  },
  {
    title: "PEAK\nEXTRACTION",
    body: "93°C at nine bar. Syrup-thick espresso runs in a single stream and the crema turns tiger-striped.",
    tempLabel: "SHOT PULLED",
  },
];

export const CRAFT_TILES = [
  { id: 1, img: "/stills/pour.webp", label: "THE SHOT", sub: "Nine bar · Single stream", span: 2 },
  { id: 2, img: "/stills/bean.webp", label: "THE BEAN", sub: "Roasted weekly · Rested 7 days", span: 1 },
  { id: 3, img: "/stills/grounds.webp", label: "THE GRIND", sub: "Ground to order · Fine", span: 1 },
  { id: 4, img: "/stills/tamp.webp", label: "THE TAMP", sub: "Level · Even pressure", span: 1 },
  { id: 5, img: "/stills/crema.webp", label: "THE CREMA", sub: "Thick · Golden", span: 1 },
  { id: 6, img: "/stills/vortex.webp", label: "THE SWIRL", sub: "Stirred · Settled", span: 1 },
  { id: 7, img: "/stills/latte.webp", label: "THE POUR", sub: "Microfoam · Steady hand", span: 1 },
  { id: 8, img: "/stills/drop.webp", label: "THE DROP", sub: "Last of the shot", span: 1 },
  { id: 9, img: "/stills/cafe.webp", label: "THE ROOM", sub: "Warm light · Long tables", span: 1 },
  { id: 10, img: "/stills/pair.webp", label: "THE CUP", sub: "Served on the bar · Drunk slowly", span: 2 },
];

export const ORIGINS = [
  {
    n: "01",
    name: "ETHIOPIA",
    region: "YIRGACHEFFE",
    spec: "Washed, light roast. Jasmine, bergamot and a tea-like body. Our pick for filter.",
    tag: "FLORAL",
    img: "/stills/bean.webp",
  },
  {
    n: "02",
    name: "COLOMBIA",
    region: "HUILA",
    spec: "Washed, medium roast. Red apple, brown sugar, round and sweet. The backbone of the house blend.",
    tag: "SWEET",
    img: "/stills/grounds.webp",
  },
  {
    n: "03",
    name: "BRAZIL",
    region: "CERRADO",
    spec: "Natural, medium-dark roast. Cocoa and roasted nuts, low acidity. Built for milk.",
    tag: "CHOCOLATE",
    img: "/stills/crema.webp",
  },
  {
    n: "04",
    name: "GUATEMALA",
    region: "ANTIGUA",
    spec: "Washed, medium roast. Orange peel and caramel with a gentle spice on the finish.",
    tag: "BALANCED",
    img: "/stills/pour.webp",
  },
  {
    n: "05",
    name: "KENYA",
    region: "NYERI",
    spec: "Washed, light roast. Blackcurrant and grapefruit, bright and juicy. For people who like it lively.",
    tag: "BRIGHT",
    img: "/stills/drop.webp",
  },
  {
    n: "06",
    name: "SUMATRA",
    region: "ACEH",
    spec: "Wet-hulled, dark roast. Cedar, dark chocolate, heavy body. A slow cup for the evening.",
    tag: "EARTHY",
    img: "/stills/vortex.webp",
  },
];

export const STORY = [
  {
    img: "/stills/bean.webp",
    era: "9TH CENTURY · ETHIOPIA",
    title: "A red cherry on a hillside",
    desc: "Coffee grows wild in the Ethiopian highlands. People chewed the fruit and brewed the leaves long before anyone thought to roast the seed.",
  },
  {
    img: "/stills/grounds.webp",
    era: "15TH CENTURY · YEMEN",
    title: "Roasted, ground and brewed",
    desc: "Across the Red Sea, the beans were roasted and brewed into a drink that kept people awake through night prayers. The port of Mocha shipped it to the world.",
  },
  {
    img: "/stills/cafe.webp",
    era: "1554 · ISTANBUL",
    title: "The first coffee houses",
    desc: "Rooms opened just for drinking coffee, talking, playing games and reading the news aloud. The coffee house became a place, not just a drink.",
  },
  {
    img: "/stills/pair.webp",
    era: "TODAY · KODEXA HOUSE",
    title: "Still pulled by hand",
    desc: "Fresh beans, a weighed dose and a barista watching every shot. We keep the old habit alive: sit down, slow down, finish the cup.",
  },
];

export const TIMES = ["08:00", "08:30", "09:00", "09:30", "15:00", "15:30", "16:00", "16:30", "18:00", "18:30", "19:00", "19:30"];

export const SELECT_DRINK_EVENT = "kodexa:selectDrink";
