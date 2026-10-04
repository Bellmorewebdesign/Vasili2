/* Product page: gallery with close-up lightbox beside a description column.
   The quiet See origin link sits inside the product description, the only path from here into the drawing.
   No cart or checkout: the main action opens Custom Inquiries. */
(function () {
  "use strict";
  var V = window.VASILI;
  var host = document.getElementById("pd");
  var lb = document.getElementById("lb");
  var p = V.product(V.param("id")) || V.products[0];
  var idx = 0;
  var cat = V.categoryLabel(p.category);

  document.title = "Item " + p.number + " | Vasili";

  document.getElementById("crumbs").innerHTML =
    '<li><a href="index.html">Home</a></li><li><a href="pieces.html">Shop</a></li>' +
    '<li><a href="pieces.html?cat=' + p.category + '">' + cat + "</a></li><li>[Product name]</li>";

  function imgFor(key, size) {
    var im = V.images[key];
    var variant = im.stage ? "stage" : null;
    var cls = im.light ? "contain" : "cover";
    return V.img(key, { variant: variant, sizes: size || "(max-width: 900px) 100vw, 55vw", eager: true }).replace("<img ", '<img class="' + cls + '" ');
  }

  var thumbs = p.images.map(function (key, i) {
    var im = V.images[key];
    return '<li><button type="button" data-thumb="' + i + '" aria-label="Show image ' + (i + 1) + " of " + p.images.length + '"' + (i === 0 ? ' aria-current="true"' : "") + ">" +
      '<img src="' + V.src(key, 800, im.stage ? "stage" : null) + '" alt="" loading="lazy" width="80" height="100"></button></li>';
  }).join("");

  var originHref = p.origin && p.origin.node
    ? "origin.html?node=" + encodeURIComponent(p.origin.node) + "&piece=" + encodeURIComponent(p.id)
    : null;

  host.innerHTML =
    '<div class="pd-gallery">' +
      '<button type="button" class="pd-main" id="pd-main" aria-haspopup="dialog" aria-label="Open close-up view">' +
        '<span id="pd-main-img"></span><span class="pd-main__hint" aria-hidden="true">Zoom</span>' +
      "</button>" +
      '<ul class="pd-thumbs" id="pd-thumbs" aria-label="Images">' + thumbs + "</ul>" +
    "</div>" +

    '<div class="pd-info">' +
      '<span class="mono">Item ' + p.number + "</span>" +
      '<h1 class="h2">[Product name]</h1>' +
      '<div class="pd-info__cat">' + cat + "</div>" +

      '<div class="pd-desc">' +
        '<p class="ph ph-3">[Description here]</p>' +
        (originHref ? '<p class="pd-origin"><a href="' + originHref + '">See origin</a></p>' : "") +
      "</div>" +

      (p.hasOptions ? '<div class="pd-options"><span class="label" id="opt-l">Size</span><div class="box" aria-labelledby="opt-l">[Size options pending]</div></div>' : "") +

      '<div class="pd-buy"><a class="btn" href="info.html#custom">Inquire about this piece</a><span class="pending">[Price and purchase pending]</span></div>' +

      '<div class="acc">' +
        acc("details", "Details", "<p>[Product details]</p><p>[Materials and dimensions here]</p>") +
        acc("care", "Care", "<p>[Care instructions here]</p>") +
        acc("ship", "Shipping and returns", '<p>[Short summary]</p><p><a href="info.html#shipping">Shipping</a> &nbsp;/&nbsp; <a href="info.html#returns">Returns</a></p>') +
      "</div>" +
    "</div>";

  function acc(id, label, body) {
    return '<div class="acc__item"><h2 style="margin:0"><button type="button" class="acc__btn" aria-expanded="false" aria-controls="acc-' + id + '" id="accb-' + id + '">' + label + "</button></h2>" +
      '<div class="acc__panel" id="acc-' + id + '" role="region" aria-labelledby="accb-' + id + '" hidden>' + body + "</div></div>";
  }
  host.addEventListener("click", function (e) {
    var b = e.target.closest(".acc__btn");
    if (!b) return;
    var open = b.getAttribute("aria-expanded") !== "true";
    b.setAttribute("aria-expanded", String(open));
    document.getElementById(b.getAttribute("aria-controls")).hidden = !open;
  });

  /* Below: video placement and more pieces. */
  var more = V.products.filter(function (o) { return o.id !== p.id; }).slice(0, 3).map(function (o) {
    return V.card(o, { sizes: "(max-width: 760px) 50vw, 33vw" });
  }).join("");
  document.getElementById("pd-more").innerHTML =
    '<section class="sec band--navy" aria-labelledby="pv-title"><div class="wrap video-band">' +
      '<div class="video-band__text"><span class="eyebrow">Video</span><h2 class="h2" id="pv-title">[Heading here]</h2><p class="lead muted ph ph-1">[Short introduction]</p></div>' +
      '<div class="video-band__frame"><div class="placement r-169" role="img" aria-label="Reserved space for a future video of this piece">' +
        '<span class="placement__label">[Video]</span><span class="placement__note">Piece video, 16:9</span></div></div>' +
    "</div></section>" +
    '<section class="sec sec--soft" aria-labelledby="more-title"><div class="wrap">' +
      '<div class="sec-head"><div class="sec-head__text"><span class="eyebrow">Shop</span><h2 class="h2" id="more-title">More pieces</h2></div>' +
      '<a class="link" href="pieces.html">Shop all <span class="arr" aria-hidden="true">&rarr;</span></a></div>' +
      '<ul class="pgrid pgrid--3 pgrid--trim">' + more + "</ul></div></section>";

  var mainImg = document.getElementById("pd-main-img");
  var thumbsEl = document.getElementById("pd-thumbs");

  function setImage(i) {
    idx = (i + p.images.length) % p.images.length;
    mainImg.innerHTML = imgFor(p.images[idx]);
    thumbsEl.querySelectorAll("button").forEach(function (b, k) {
      if (k === idx) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current");
    });
  }
  thumbsEl.addEventListener("click", function (e) {
    var b = e.target.closest("[data-thumb]");
    if (b) setImage(+b.getAttribute("data-thumb"));
  });

  /* Lightbox: the full, uncropped photograph on white. */
  function lbRender() {
    var key = p.images[idx];
    lb.innerHTML =
      '<button type="button" class="tbtn dlg__close" data-close>Close</button>' +
      '<div class="lb__img">' + V.img(key, { sizes: "100vw", eager: true }) + "</div>" +
      '<div class="lb__bar"><button type="button" class="tbtn" data-lb="-1">Previous</button>' +
      '<span class="mono" aria-live="polite">' + (idx + 1) + " / " + p.images.length + "</span>" +
      '<button type="button" class="tbtn" data-lb="1">Next</button></div>';
  }
  document.getElementById("pd-main").addEventListener("click", function (e) {
    lbRender();
    V.openDialog(lb, e.currentTarget);
    lb.querySelector("[data-close]").focus();
  });
  function step(dir, focusDir) {
    setImage(idx + dir);
    lbRender();
    var f = focusDir ? lb.querySelector('[data-lb="' + focusDir + '"]') : lb.querySelector("[data-close]");
    f.focus();
  }
  lb.addEventListener("click", function (e) {
    var t = e.target.closest("button");
    if (!t) return;
    if (t.hasAttribute("data-close")) { lb.close(); return; }
    if (t.hasAttribute("data-lb")) step(+t.getAttribute("data-lb"), t.getAttribute("data-lb"));
  });
  lb.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      step(e.key === "ArrowLeft" ? -1 : 1, document.activeElement && document.activeElement.getAttribute("data-lb"));
    }
  });

  setImage(0);
})();
