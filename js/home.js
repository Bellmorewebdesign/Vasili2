/* Homepage: object stage with four curated slides, then a compact collection composition. */
(function () {
  "use strict";
  var V = window.VASILI;
  var stage = document.getElementById("stage");
  var count = document.getElementById("stage-count");
  var view = document.getElementById("stage-view");
  var slides = V.slides;
  var current = 0;

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  stage.innerHTML = slides.map(function (s, i) {
    var p = V.product(s.product);
    return '<div class="slide' + (i === 0 ? " is-active" : "") + '" role="group" aria-roledescription="slide" aria-label="' + (i + 1) + " of " + slides.length + '"' + (i === 0 ? "" : ' aria-hidden="true"') + ">" +
      '<div class="slide__main">' + V.img(s.image, { variant: "stage", sizes: "(max-width: 820px) 86vw, 40vw", eager: i === 0 }) + "</div>" +
      '<figure class="slide__inset">' + V.img(s.inset, { sizes: "(max-width: 820px) 30vw, 15vw" }) + "</figure>" +
      '<span class="visually-hidden">Item ' + p.number + "</span>" +
      "</div>";
  }).join("");

  var els = stage.querySelectorAll(".slide");

  function show(i) {
    current = (i + slides.length) % slides.length;
    els.forEach(function (el, k) {
      var on = k === current;
      el.classList.toggle("is-active", on);
      if (on) el.removeAttribute("aria-hidden"); else el.setAttribute("aria-hidden", "true");
    });
    count.textContent = pad(current + 1) + " / " + pad(slides.length);
    view.href = "product.html?id=" + encodeURIComponent(slides[current].product);
  }

  document.getElementById("stage-prev").addEventListener("click", function () { show(current - 1); });
  document.getElementById("stage-next").addEventListener("click", function () { show(current + 1); });
  stage.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { e.preventDefault(); show(current - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); show(current + 1); }
  });

  /* Swipe on touch and pen. Vertical scrolling stays native (touch-action: pan-y). */
  var startX = null, startY = null;
  stage.addEventListener("pointerdown", function (e) {
    if (e.pointerType === "mouse") return;
    startX = e.clientX; startY = e.clientY;
  });
  stage.addEventListener("pointerup", function (e) {
    if (startX === null) return;
    var dx = e.clientX - startX, dy = e.clientY - startY;
    startX = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) show(current + (dx < 0 ? 1 : -1));
  });
  stage.addEventListener("pointercancel", function () { startX = null; });

  show(0);

  /* Collection composition: tall City, smaller offset NIC, quiet video frame. */
  var tall = V.collection(V.homeCollections.tall);
  var small = V.collection(V.homeCollections.small);
  function tile(c, cls, sizes) {
    return '<div class="' + cls + '"><a class="coll-tile" href="collection.html?id=' + c.id + '">' +
      '<div class="cover">' + V.img(c.tileImage, { sizes: sizes }) + "</div>" +
      '<span class="coll-tile__name"><span>' + V.esc(c.title) + "</span></span></a></div>";
  }
  document.getElementById("home-coll").innerHTML =
    tile(tall, "home-coll__city", "(max-width: 820px) 82vw, 40vw") +
    tile(small, "home-coll__nic", "(max-width: 820px) 58vw, 24vw") +
    '<div class="home-coll__video"><div class="placeholder-box placeholder-box--video">[Video]</div></div>';
})();
