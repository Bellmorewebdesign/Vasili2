/* Homepage: hero photograph, featured pieces, collection tiles and the image-and-text section. */
(function () {
  "use strict";
  var V = window.VASILI;
  var H = V.home;

  document.getElementById("hero-media").innerHTML =
    V.img(H.heroImage, { sizes: "(max-width: 900px) 100vw, 55vw", eager: true });

  document.getElementById("featured").innerHTML = H.featured.map(function (id) {
    return V.card(V.product(id), { sizes: "(max-width: 760px) 50vw, (max-width: 1100px) 33vw, 25vw" });
  }).join("");

  document.getElementById("ctiles").innerHTML = H.collections.map(function (id) {
    var c = V.collection(id);
    return '<li class="ctile"><a href="collection.html?id=' + c.id + '">' +
      V.media(c.tileImage, { ratio: "r-45", zoom: true, sizes: "(max-width: 900px) 100vw, 33vw" }) +
      '<div class="ctile__body"><span class="eyebrow">Collection</span><h3 class="h3">' + V.esc(c.title) + "</h3>" +
      '<p class="ph ph-1">[Short description]</p>' +
      '<span class="link">View collection <span class="arr" aria-hidden="true">&rarr;</span></span></div>' +
      "</a></li>";
  }).join("");

  document.getElementById("about-media").innerHTML =
    V.media(H.aboutImage, { ratio: "r-45", sizes: "(max-width: 900px) 100vw, 50vw" });
})();
