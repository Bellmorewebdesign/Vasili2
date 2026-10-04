/* Collection template. One template, two openings:
   "landscape" (City): wide banner, then title and introduction side by side.
   "portrait"  (NIC):  portrait photograph beside the title and introduction.
   Both continue into the same piece grid, completed by an editorial photograph.
   Membership is provisional data from data/site-data.js. */
(function () {
  "use strict";
  var V = window.VASILI;
  var host = document.getElementById("coll");
  var c = V.collection(V.param("id")) || V.collections[0];

  document.title = c.title + " | Vasili";

  var crumbs = '<ol class="crumbs"><li><a href="index.html">Home</a></li><li><a href="pieces.html">Shop</a></li><li>' + V.esc(c.title) + "</li></ol>";
  var titleBlock = '<span class="eyebrow">Collection</span><h1 class="display">' + V.esc(c.title) + "</h1>";
  var intro = '<p class="lead ph ph-2">[Short introduction]</p>';
  var html;

  if (c.layout === "portrait") {
    html = '<div class="wrap" style="padding-top:40px">' + crumbs +
      '<div class="coll-split">' +
        '<div class="coll-split__media">' + V.media(c.heroImage, { ratio: "r-45", sizes: "(max-width: 900px) 100vw, 50vw", eager: true }) + "</div>" +
        '<div class="coll-split__text">' + titleBlock + intro +
          '<a class="btn" href="#pieces">View the pieces</a></div>' +
      "</div></div>";
  } else {
    html = '<div class="wrap" style="padding-top:40px">' + crumbs + "</div>" +
      '<div class="wrap"><div class="ratio coll-banner">' + V.img(c.heroImage, { sizes: "100vw", eager: true }) + "</div>" +
      '<div class="coll-intro"><div class="coll-intro__title">' + titleBlock + "</div>" +
      '<div class="coll-intro__text">' + intro + '<a class="link" href="#pieces" style="margin-top:24px">View the pieces <span class="arr" aria-hidden="true">&darr;</span></a></div></div></div>';
  }

  var cards = c.pieces.map(function (id) {
    var p = V.product(id);
    return p ? V.card(p, { sizes: "(max-width: 760px) 50vw, 33vw" }) : "";
  }).join("");
  var editorial = '<li class="etile">' + V.media(c.editorialImage, { ratio: "r-45", sizes: "(max-width: 760px) 50vw, 33vw" }) +
    '<p class="ph ph-1">[Caption here]</p></li>';

  html += '<section class="sec sec--soft" id="pieces" aria-labelledby="pieces-title"><div class="wrap">' +
    '<div class="sec-head"><div class="sec-head__text"><span class="eyebrow">' + V.esc(c.title) + '</span><h2 class="h2" id="pieces-title">Pieces</h2></div>' +
    '<a class="link" href="pieces.html">Shop all <span class="arr" aria-hidden="true">&rarr;</span></a></div>' +
    '<ul class="pgrid pgrid--3">' + cards + editorial + "</ul></div></section>";

  var others = V.collections.filter(function (o) { return o.id !== c.id; }).map(function (o) {
    return '<li class="ctile"><a href="collection.html?id=' + o.id + '">' +
      V.media(o.tileImage, { ratio: "r-45", zoom: true, sizes: "(max-width: 900px) 100vw, 33vw" }) +
      '<div class="ctile__body"><span class="eyebrow">Collection</span><h3 class="h3">' + V.esc(o.title) + "</h3>" +
      '<p class="ph ph-1">[Short description]</p><span class="link">View collection <span class="arr" aria-hidden="true">&rarr;</span></span></div></a></li>';
  }).join("");
  html += '<section class="sec" aria-labelledby="more-title"><div class="wrap">' +
    '<div class="sec-head"><div class="sec-head__text"><span class="eyebrow">Collections</span><h2 class="h2" id="more-title">More collections</h2></div></div>' +
    '<ul class="ctiles" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">' + others + "</ul></div></section>";

  host.innerHTML = html;
})();
