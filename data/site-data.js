/*
  Vasili2 prototype data layer.
  Edit this file to change products, collections, the homepage, and journal entries.
  Every page reads from here, so product records are never duplicated across pages.

  Text rules: visible editorial text stays as placeholders ([Product name], [Heading], ...).
  `sourceHandle` is developer reference only (from data/photo-groups.json). It is never displayed.
  `shopify` fields are reserved for a future Shopify connection and are intentionally empty.
*/
window.VASILI = window.VASILI || {};

/* Image registry. `file` is the original basename in assets/photos/.
   Web derivatives live in assets/web/<file>-800.jpg and -1600.jpg.
   `stage: true` means a tighter 4:5 crop exists at assets/web/<file>-stage-*.jpg. */
window.VASILI.images = {
  "mirror-studio":   { file: "One-Thirty_New_York0539", w: 4243, h: 5304, stage: true, light: true,
                       alt: "Silver link bracelet with spiked connectors, photographed on white" },
  "mirror-bike":     { file: "DCE7A7F3-43BB-4DA7-8AE6-09BA81EF0ECF", w: 1365, h: 2048,
                       alt: "Silver link bracelet worn on a wrist resting on a blue bicycle frame" },
  "mirror-seated":   { file: "291BC55A-D7C1-4363-A04B-985E4F7EF67F", w: 1365, h: 2048,
                       alt: "Person in black adjusting a silver link bracelet, chain at the neck" },
  "mirror-pocket":   { file: "490966CD-BF22-4243-962F-24AF497CCB61", w: 1365, h: 2048,
                       alt: "Silver link bracelet worn with a hand at a black jacket pocket" },
  "mirror-wrist":    { file: "C8B550E0-0F4B-4EF6-B19E-87D13B946520", w: 1365, h: 2048,
                       alt: "Close view of a silver link bracelet on a wrist against black" },

  "extendo-studio":  { file: "Capture_One_Catalog0009", w: 3341, h: 3341, stage: true, light: true,
                       alt: "Heavy silver link bracelet with spiked links and engraved clasp, on white" },
  "extendo-detail":  { file: "DSC09915", w: 4348, h: 3161, light: true,
                       alt: "Detail of heavy silver links with spikes and an engraved triangular clasp" },
  "extendo-clasp":   { file: "DSC09924", w: 2941, h: 1881, light: true,
                       alt: "Close view of engraved silver clasp and link ends" },
  "extendo-end":     { file: "DSC09983", w: 2865, h: 2040, light: true,
                       alt: "Silver links ending in an engraved triangular clasp, on white" },
  "extendo-hand":    { file: "20210107-_F6A3947-Edit", w: 2568, h: 3387,
                       alt: "Hand wearing a heavy silver link bracelet and several silver rings" },
  "extendo-neck":    { file: "cropextedobb", w: 2506, h: 2694,
                       alt: "Heavy silver links worn at the neck over a black turtleneck" },

  "spur-studio":     { file: "Capture_One_Catalog0006_07f31f3d-f59c-4f2c-b5cc-4638f0a9559e", w: 1193, h: 1621, stage: true, light: true,
                       alt: "Gold chain-link ring with spurred links, on white" },
  "spur-worn":       { file: "VASILI121", w: 3650, h: 5475,
                       alt: "Hands with silver nails wearing thin gold rings and bracelets over black" },

  "lull-studio":     { file: "Capture_One_Catalog0004", w: 1434, h: 1948, stage: true, light: true,
                       alt: "Gold chain-link ring set with small stones, on white" },
  "lull-worn":       { file: "VASILI129", w: 3650, h: 5475,
                       alt: "Hand wearing gold chain-link rings against a black jacket" },

  "flame":           { file: "DSC07321", w: 2880, h: 4320,
                       alt: "Hands covered in silver rings and bracelets held over an open flame" }
};

/* Product categories used by Pieces filters. Only categories supported by the sample products. */
window.VASILI.categories = [
  { id: "bracelets", label: "Bracelets" },
  { id: "rings", label: "Rings" }
];

/* Products. One record per confirmed photo group in data/photo-groups.json.
   `images` are the gallery in order. `stageImage` is the studio shot used on dark stages.
   `featureImage` is a worn photo from the SAME photo group. */
window.VASILI.products = [
  {
    id: "piece-a",
    number: "001",
    category: "bracelets",
    sourceHandle: "mirror-link-bracelet-mids",
    shopify: { productId: null, handle: null, variantIds: [] },
    stageImage: "mirror-studio",
    featureImage: "mirror-wrist",
    images: ["mirror-studio", "mirror-wrist", "mirror-pocket", "mirror-seated", "mirror-bike"],
    hasOptions: false,
    origin: { node: "demo-a" }
  },
  {
    id: "piece-b",
    number: "002",
    category: "bracelets",
    sourceHandle: "big-chunky-extendo-bracelet",
    shopify: { productId: null, handle: null, variantIds: [] },
    stageImage: "extendo-studio",
    featureImage: "extendo-neck",
    images: ["extendo-studio", "extendo-detail", "extendo-clasp", "extendo-end", "extendo-hand", "extendo-neck"],
    hasOptions: false,
    origin: { node: "demo-b" }
  },
  {
    id: "piece-c",
    number: "003",
    category: "rings",
    sourceHandle: "gold-spur-ring",
    shopify: { productId: null, handle: null, variantIds: [] },
    stageImage: "spur-studio",
    featureImage: "spur-worn",
    images: ["spur-studio", "spur-worn"],
    hasOptions: true,
    origin: { node: "demo-c" }
  },
  {
    id: "piece-d",
    number: "004",
    category: "rings",
    sourceHandle: "lull-ring",
    shopify: { productId: null, handle: null, variantIds: [] },
    stageImage: "lull-studio",
    featureImage: "lull-worn",
    images: ["lull-studio", "lull-worn"],
    hasOptions: true,
    origin: { node: "demo-d" }
  }
];

/* Collections. City and NIC are inherited draft labels. Membership is PROVISIONAL.
   `layout` selects one of the two compositions in collection.html:
   "landscape" opens with a wide banner, "portrait" with a split portrait image.
   `tileImage` is used on the homepage and in menus; `editorialImage` completes the piece grid. */
window.VASILI.collections = [
  {
    id: "city",
    title: "City",
    layout: "landscape",
    heroImage: "extendo-clasp",
    tileImage: "extendo-neck",
    editorialImage: "mirror-seated",
    pieces: ["piece-a", "piece-b"],
    provisional: true
  },
  {
    id: "nic",
    title: "NIC",
    layout: "portrait",
    heroImage: "spur-worn",
    tileImage: "lull-worn",
    editorialImage: "lull-worn",
    pieces: ["piece-c", "piece-d"],
    provisional: true
  },
  {
    id: "sample",
    title: "[Collection]",
    layout: "landscape",
    heroImage: "extendo-detail",
    tileImage: "mirror-pocket",
    editorialImage: "mirror-bike",
    pieces: ["piece-a", "piece-d"],
    provisional: true
  }
];

/* Homepage. The hero photograph, featured pieces, collection tiles and the image-and-text section. */
window.VASILI.home = {
  heroImage: "flame",
  featured: ["piece-a", "piece-b", "piece-c", "piece-d"],
  collections: ["city", "nic", "sample"],
  aboutImage: "extendo-hand"
};

/* Journal: News and journal entries combined. Titles and text are placeholders. */
window.VASILI.journal = [
  { id: "j01", number: "01", kind: "Journal", image: "flame",          size: "tall" },
  { id: "j02", number: "02", kind: "News",    image: "extendo-detail", size: "wide" },
  { id: "j03", number: "03", kind: "Journal", image: "mirror-seated",  size: "small" },
  { ad: true },
  { id: "j04", number: "04", kind: "News",    image: "lull-worn",      size: "small" },
  { id: "j05", number: "05", kind: "Journal", image: "mirror-bike",    size: "tall" },
  { id: "j06", number: "06", kind: "News",    image: "extendo-hand",   size: "small" }
];

/* Studio sections (formerly About, Preface, Collaborations). */
window.VASILI.studio = [
  { id: "about",          label: "About",          image: "mirror-wrist", second: "extendo-hand" },
  { id: "preface",        label: "Preface",        image: "spur-worn",    second: "extendo-end" },
  { id: "collaborations", label: "Collaborations", image: "mirror-seated", second: "mirror-pocket" }
];
