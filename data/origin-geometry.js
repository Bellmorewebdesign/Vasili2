/*
  Origin drawing geometry, transcribed from references/02-origin-map-overview.jpeg
  (composition authority) with details read from 03 to 06.

  This file holds FORM AND STRUCTURE ONLY. It says nothing about products.
  Provisional product connections live in data/origin-links.js.

  Coordinates are canvas units (roughly 3x the pixel positions on the cropped overview sheet).
  To correct the drawing, edit numbers here; the interface rebuilds from this data.

  chain.rings      centers of the seven thorned ring links, top to bottom
  nodes[].parent   "chain" for forms attached to the central chain, else another node id
  nodes[].attach   for chain children: index of the ring the connector leaves from (null = no line)
  nodes[].via      optional elbow points for the faint connector, from parent toward the node
  nodes[].shape    drawing primitive in js/origin-shapes.js
  nodes[].s        scale (1 = about 100 canvas units across)
  nodes[].frame    radius of the thin circle drawn around some forms on the sheet (0 = none)
  nodes[].ref      short code shown in the interface (not a name)
*/
window.VASILI = window.VASILI || {};

window.VASILI.originGeometry = {
  bounds: { x: 520, y: 140, w: 2420, h: 2260 },

  chain: {
    ref: "00",
    tipStart: [1491, 230],
    rings: [[1560, 429], [1629, 669], [1500, 909], [1389, 1149], [1521, 1380], [1551, 1659], [1650, 1920]],
    tipEnd: [1641, 2205],
    ringRadius: 58
  },

  /* Faint bracket lines drawn with a family once it is revealed (pure drawing, no meaning). */
  brackets: [
    { family: "r2", d: "M2498 360 Q2560 515 2508 676" }
  ],

  nodes: [
    /* L1: ear forms, upper left, framed hub beside ring 1 */
    { id: "l1",   parent: "chain", attach: 0, x: 1251, y: 387, shape: "studHoop",  s: 1.05, frame: 80, ref: "A" },
    { id: "l1-1", parent: "l1", x: 909,  y: 309, via: [[909, 387]],  shape: "studPin",   s: 0.6, ref: "A1" },
    { id: "l1-2", parent: "l1", x: 1005, y: 309, via: [[1005, 387]], shape: "studRing",  s: 0.55, ref: "A2" },
    { id: "l1-3", parent: "l1", x: 1095, y: 309, via: [[1095, 387]], shape: "studDrop",  s: 0.6, ref: "A3" },
    { id: "l1-4", parent: "l1", x: 900,  y: 456, via: [[900, 387]],  shape: "studThorn", s: 0.6, ref: "A4" },
    { id: "l1-5", parent: "l1", x: 999,  y: 456, via: [[999, 387]],  shape: "studRing",  s: 0.6, ref: "A5" },
    { id: "l1-6", parent: "l1", x: 1116, y: 456, via: [[1116, 387]], shape: "studRing",  s: 0.62, ref: "A6" },

    /* L2: hoops and cuffs, framed hub between rings 2 and 3 */
    { id: "l2",   parent: "chain", attach: 2, x: 1215, y: 819, shape: "hoop",     s: 1.25, frame: 88, ref: "B" },
    { id: "l2-1", parent: "l2", x: 1209, y: 669, shape: "leafHoop", s: 0.5, ref: "B1" },
    { id: "l2-2", parent: "l2", x: 1224, y: 981, shape: "leafHoop", s: 0.5, rot: 70, ref: "B2" },
    { id: "l2-3", parent: "l2", x: 861,  y: 690, via: [[861, 819]],  shape: "cuff", s: 0.95, rot: -150, ref: "B3" },
    { id: "l2-4", parent: "l2", x: 1041, y: 690, via: [[1041, 819]], shape: "cuff", s: 0.95, rot: -90, ref: "B4" },
    { id: "l2-5", parent: "l2", x: 861,  y: 951, via: [[861, 819]],  shape: "hoopFlat", s: 0.95, ref: "B5" },
    { id: "l2-6", parent: "l2", x: 1041, y: 951, via: [[1041, 819]], shape: "cuff", s: 0.95, rot: 90, ref: "B6" },
    { id: "l2-7", parent: "l2", x: 660,  y: 828, via: [[760, 819]],  shape: "curbArc", s: 1.7, ref: "B7" },

    /* L3: rings, framed hub level with ring 5 */
    { id: "l3",    parent: "chain", attach: 4, x: 1209, y: 1380, shape: "ringOpenSpike", s: 1.05, frame: 82, ref: "C" },
    { id: "l3-1",  parent: "l3", x: 660, y: 1260, via: [[660, 1380]], shape: "ringPlain",  s: 0.7, ref: "C1" },
    { id: "l3-2",  parent: "l3", x: 810, y: 1260, via: [[810, 1380]], shape: "ringKnobs3", s: 0.7, ref: "C2" },
    { id: "l3-3",  parent: "l3", x: 969, y: 1260, via: [[969, 1380]], shape: "ringKnobs6", s: 0.72, ref: "C3" },
    { id: "l3-1a", parent: "l3-1", x: 669, y: 1485, shape: "ringOpen", s: 0.5,  ref: "C1.1" },
    { id: "l3-2a", parent: "l3-2", x: 810, y: 1476, shape: "ringOpen", s: 0.38, ref: "C2.1" },
    { id: "l3-3a", parent: "l3-3", x: 975, y: 1461, shape: "ringPlain", s: 0.26, ref: "C3.1" },

    /* L4: bracelets and long chains, framed hub beside ring 7 */
    { id: "l4",    parent: "chain", attach: 6, x: 1401, y: 1971, shape: "chainSeg", s: 1.3, rot: 75, frame: 92, ref: "D" },
    { id: "l4-1",  parent: "l4", x: 1119, y: 1629, via: [[1260, 1971], [1260, 1629]], shape: "chainSeg", s: 0.95, rot: -25, frame: 82, ref: "D1" },
    { id: "l4-2",  parent: "l4", x: 1095, y: 1971, via: [[1260, 1971]], shape: "chainSeg", s: 0.95, rot: 80, frame: 82, ref: "D2" },
    { id: "l4-3",  parent: "l4", x: 1119, y: 2250, via: [[1260, 1971], [1260, 2250]], shape: "chainOpen", s: 0.85, ref: "D3" },
    { id: "demo-a", parent: "l4-1", x: 879, y: 1656, shape: "braceletThorn", s: 0.62, ref: "D1.1" },
    { id: "l4-2a", parent: "l4-2", x: 870, y: 1971, shape: "braceletBead",  s: 0.62, ref: "D2.1" },
    { id: "l4-3a", parent: "l4-3", x: 873, y: 2280, shape: "braceletBead",  s: 0.58, ref: "D3.1" },
    { id: "l4-1b", parent: "demo-a", x: 660, y: 1680, shape: "necklaceOval", s: 1.05, ref: "D1.2" },
    { id: "l4-2b", parent: "l4-2a",  x: 651, y: 1980, shape: "necklaceLong", s: 1.25, ref: "D2.2" },
    { id: "l4-3b", parent: "l4-3a",  x: 651, y: 2290, shape: "necklaceLong", s: 1.2,  ref: "D3.2" },

    /* R1: charms on a bracket from ring 2, each with a hanging form */
    { id: "r1-1", parent: "chain", attach: 1, x: 1875, y: 240, via: [[1785, 669], [1785, 240]], shape: "star6",     s: 0.5, ref: "E1" },
    { id: "r1-2", parent: "chain", attach: 1, x: 1887, y: 411, via: [[1785, 669], [1785, 411]], shape: "flower5",   s: 0.5, ref: "E2" },
    { id: "r1-3", parent: "chain", attach: 1, x: 1896, y: 570, via: [[1785, 669], [1785, 570]], shape: "knot",      s: 0.5, ref: "E3" },
    { id: "r1-4", parent: "chain", attach: 1, x: 1905, y: 696, via: [[1785, 669], [1785, 696]], shape: "heart",     s: 0.5, ref: "E4" },
    { id: "r1-5", parent: "chain", attach: 1, x: 1917, y: 810, via: [[1785, 669], [1785, 810]], shape: "heartCurl", s: 0.5, ref: "E5" },
    { id: "r1-1a", parent: "r1-1", x: 2187, y: 225, shape: "pendant", charm: "star6",     s: 1.0,  ref: "E1.1" },
    { id: "r1-2a", parent: "r1-2", x: 2085, y: 390, shape: "pendant", charm: "flower5",   s: 0.95, ref: "E2.1" },
    { id: "r1-3a", parent: "r1-3", x: 2196, y: 570, shape: "swag",    charm: "knot",      s: 1.0,  ref: "E3.1" },
    { id: "r1-4a", parent: "r1-4", x: 2052, y: 690, shape: "pendant", charm: "heart",     s: 0.75, ref: "E4.1" },
    { id: "r1-5a", parent: "r1-5", x: 2196, y: 801, shape: "pendant", charm: "heartCurl", s: 1.0,  ref: "E5.1" },

    /* R2: framed figure-eight link with an arc of variants (no visible line to the chain on the sheet) */
    { id: "r2",   parent: "chain", attach: null, x: 2409, y: 516, shape: "fig8", s: 1.0, frame: 85, ref: "F" },
    { id: "r2-1", parent: "r2", x: 2535, y: 339, shape: "fig8Twist", s: 0.5, noLine: true, ref: "F1" },
    { id: "r2-2", parent: "r2", x: 2625, y: 441, shape: "bow",       s: 0.5, noLine: true, ref: "F2" },
    { id: "r2-3", parent: "r2", x: 2616, y: 561, shape: "fig8",      s: 0.45, noLine: true, ref: "F3" },
    { id: "r2-4", parent: "r2", x: 2586, y: 669, shape: "fig8Knot",  s: 0.48, noLine: true, ref: "F4" },

    /* R3: crosses on a bracket from ring 5, each with a hanging form */
    { id: "r3-1", parent: "chain", attach: 4, x: 1746, y: 1119, via: [[1641, 1380], [1641, 1119]], shape: "crossA", s: 0.5, ref: "G1" },
    { id: "r3-2", parent: "chain", attach: 4, x: 1767, y: 1299, via: [[1641, 1380], [1641, 1299]], shape: "crossB", s: 0.5, ref: "G2" },
    { id: "r3-3", parent: "chain", attach: 4, x: 1776, y: 1470, via: [[1641, 1380], [1641, 1470]], shape: "crossC", s: 0.5, ref: "G3" },
    { id: "r3-1a", parent: "r3-1", x: 1947, y: 1110, shape: "pendant", charm: "crossA", s: 0.95, ref: "G1.1" },
    { id: "r3-2a", parent: "r3-2", x: 1965, y: 1290, shape: "pendant", charm: "crossB", s: 0.95, ref: "G2.1" },
    { id: "r3-3a", parent: "r3-3", x: 1965, y: 1479, shape: "pendant", charm: "crossC", s: 0.95, ref: "G3.1" },

    /* R4: large framed thorned ring beside ring 7, with five branches */
    { id: "r4",   parent: "chain", attach: 6, x: 1905, y: 1890, shape: "thornRing", s: 1.3, frame: 92, ref: "H" },
    { id: "r4-1", parent: "r4", x: 2235, y: 1080, via: [[2085, 1890], [2085, 1080]], shape: "chainSeg", s: 0.55, rot: -20, frame: 48, ref: "H1" },
    { id: "r4-2", parent: "r4", x: 2247, y: 1296, via: [[2085, 1890], [2085, 1296]], shape: "chainSeg", s: 0.55, rot: 10,  frame: 48, ref: "H2" },
    { id: "r4-3", parent: "r4", x: 2265, y: 1560, via: [[2085, 1890], [2085, 1560]], shape: "chainSeg", s: 0.55, rot: 60,  frame: 48, ref: "H3" },
    { id: "r4-4", parent: "r4", x: 2277, y: 1869, via: [[2085, 1890], [2085, 1869]], shape: "chainSeg", s: 0.55, rot: -35, frame: 48, ref: "H4" },
    { id: "r4-5", parent: "r4", x: 2307, y: 2181, via: [[2085, 1890], [2085, 2181]], shape: "chainSeg", s: 0.55, rot: 5,   frame: 48, ref: "H5" },
    { id: "r4-1a", parent: "r4-1", x: 2457, y: 1071, shape: "braceletTwist", s: 0.55, ref: "H1.1" },
    { id: "demo-b", parent: "r4-2", x: 2472, y: 1224, via: [[2380, 1296], [2380, 1224]], shape: "braceletChain", s: 0.5, ref: "H2.1" },
    { id: "r4-2b", parent: "r4-2", x: 2475, y: 1377, via: [[2380, 1296], [2380, 1377]], shape: "braceletChain", s: 0.52, ref: "H2.2" },
    { id: "r4-3a", parent: "r4-3", x: 2493, y: 1551, shape: "gCurl", s: 0.55, ref: "H3.1" },
    { id: "demo-c", parent: "r4-4", x: 2517, y: 1761, via: [[2400, 1869], [2400, 1761]], shape: "braceletRough", s: 0.5, ref: "H4.1" },
    { id: "r4-4b", parent: "r4-4", x: 2517, y: 1929, via: [[2400, 1869], [2400, 1929]], shape: "braceletBead",  s: 0.55, ref: "H4.2" },
    { id: "demo-d", parent: "r4-5", x: 2535, y: 2100, via: [[2420, 2181], [2420, 2100]], shape: "braceletBead",  s: 0.5, ref: "H5.1" },
    { id: "r4-5b", parent: "r4-5", x: 2565, y: 2220, via: [[2420, 2181], [2420, 2220]], shape: "ringPlain",     s: 0.22, ref: "H5.2" },
    { id: "r4-1b", parent: "r4-1a",  x: 2667, y: 1029, shape: "necklaceLong",  s: 0.95, ref: "H1.2" },
    { id: "r4-2c", parent: "demo-b", x: 2700, y: 1224, shape: "necklaceOval",  s: 0.9,  ref: "H2.3" },
    { id: "r4-2d", parent: "r4-2b",  x: 2697, y: 1383, shape: "necklaceLong",  s: 0.8,  ref: "H2.4" },
    { id: "r4-3b", parent: "r4-3a",  x: 2727, y: 1539, shape: "necklaceLong",  s: 0.95, ref: "H3.2" },
    { id: "r4-4c", parent: "demo-c", x: 2760, y: 1737, shape: "necklaceRough", s: 0.95, ref: "H4.3" },
    { id: "r4-4d", parent: "r4-4b",  x: 2772, y: 1920, shape: "necklaceOval",  s: 1.0,  ref: "H4.4" },
    { id: "r4-5c", parent: "demo-d", x: 2796, y: 2169, shape: "necklaceOval",  s: 1.0,  ref: "H5.3" }
  ],

  /* Supporting chain studies (references 01, 07, 08), shown in the chain Study view. */
  studies: [
    { link: "thornEye",  count: 26 },
    { link: "thornRing", count: 22 },
    { link: "thornEye",  count: 26, wave: true },
    { link: "thornRing", count: 22, wave: true }
  ]
};
