/* Collection template. One template, two compositions:
   "landscape" (City): broad landscape opening image, sparse two-column pieces.
   "portrait"  (NIC):  offset portrait opening image, staggered pieces.
   Membership is provisional data from data/site-data.js. */
(function () {
  "use strict";
  var V = window.VASILI;
  var host = document.getElementById("coll");
  var c = V.collection(V.param("id")) || V.collections[0];

  document.title = c.title + " | Vasili";

  function pieceCard(id, sizes) {
    var p = V.product(id);
    if (!p) return "";
    return '<li><a class="card" href="product.html?id=' + p.id + '">' +
      '<div class="card__img frame frame--pad">' + V.img(p.stageImage, { variant: "stage", sizes: sizes }) + "</div>" +
      '<span class="card__meta"><span class="mono">' + p.number + "</span><span>[Product name]</span></span></a></li>";
  }

  var intro = '<div class="coll-intro"><h2>[Heading]</h2><p>[Text]</p></div>';
  var label = '<h1 class="coll-label"><span>' + V.esc(c.title) + "</span></h1>";
  var html;

  if (c.layout === "portrait") {
    host.className = "page coll--portrait";
    html = label +
      '<div class="coll-top">' +
        '<div class="coll-hero cover">' + V.img(c.heroImage, { sizes: "(max-width: 820px) 82vw, 40vw", eager: true }) + "</div>" +
        intro +
      "</div>" +
      '<ul class="coll-pieces">' + c.pieces.map(function (id) { return pieceCard(id, "(max-width: 820px) 80vw, 30vw"); }).join("") + "</ul>";
  } else {
    host.className = "page coll--landscape";
    html = label +
      '<div class="coll-hero cover">' + V.img(c.heroImage, { sizes: "(max-width: 820px) 100vw, 90vw", eager: true }) + "</div>" +
      intro +
      '<ul class="coll-pieces">' + c.pieces.map(function (id) { return pieceCard(id, "(max-width: 820px) 100vw, 36vw"); }).join("") + "</ul>";
  }

  var others = V.collections.filter(function (o) { return o.id !== c.id; }).map(function (o) {
    return '<a class="tbtn" href="collection.html?id=' + o.id + '">' + V.esc(o.title) + "</a>";
  }).join("");
  html += '<nav class="coll-other" aria-label="Other collections">' + others + "</nav>";

  host.innerHTML = html;
})();
