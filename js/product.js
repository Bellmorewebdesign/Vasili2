/* Product presentation: large stage, thumbnail strip, narrow band with Details accordion,
   close-up lightbox, reserved video frame and related pieces.
   The quiet See origin link is the only path into the drawing from here. */
(function () {
  "use strict";
  var V = window.VASILI;
  var host = document.getElementById("pd");
  var lb = document.getElementById("lb");
  var p = V.product(V.param("id")) || V.products[0];
  var idx = 0;

  document.title = "Item " + p.number + " | Vasili";

  function variantFor(key) { return V.images[key].stage ? "stage" : null; }

  var thumbs = p.images.map(function (key, i) {
    return '<li><button type="button" data-thumb="' + i + '" aria-label="Image ' + (i + 1) + " of " + p.images.length + '"' + (i === 0 ? ' aria-current="true"' : "") + ">" +
      '<img src="' + V.src(key, 800) + '" alt="" loading="lazy" width="64" height="80"></button></li>';
  }).join("");

  var related = V.products.filter(function (o) { return o.id !== p.id; }).slice(0, 2).map(function (o) {
    return '<li><a class="card" href="product.html?id=' + o.id + '">' +
      '<div class="card__img frame frame--pad">' + V.img(o.stageImage, { variant: "stage", sizes: "(max-width: 820px) 45vw, 14vw" }) + "</div>" +
      '<span class="card__meta"><span class="mono">' + o.number + "</span><span>[Product name]</span></span></a></li>";
  }).join("");

  var originHref = p.origin && p.origin.node
    ? "origin.html?node=" + encodeURIComponent(p.origin.node) + "&piece=" + encodeURIComponent(p.id)
    : null;

  host.innerHTML =
    '<button type="button" class="pd-stage" id="pd-stage" aria-label="Open close-up view" aria-haspopup="dialog">' +
      '<span class="pd-stage__img" id="pd-stage-img"></span>' +
      '<span class="pd-stage__hint mono" aria-hidden="true">+</span>' +
    "</button>" +
    '<ul class="pd-thumbs" id="pd-thumbs" aria-label="Images">' + thumbs + "</ul>" +

    '<div class="pd-band">' +
      '<span class="mono">' + p.number + "</span>" +
      "<h1>[Product name]</h1>" +
      '<button type="button" class="tbtn" id="pd-toggle" aria-expanded="false" aria-controls="pd-details">Details <span aria-hidden="true">+</span></button>' +
    "</div>" +
    '<div class="pd-details" id="pd-details" role="region" aria-label="Details" hidden><div>' +
      '<div class="pd-details__inner">' +
        "<p>[Product details]</p>" +
        (p.hasOptions ? '<div class="pd-options mono" aria-label="Options area reserved">[Options]</div>' : "<div></div>") +
        (originHref ? '<p class="pd-origin"><a href="' + originHref + '">See origin</a></p>' : "") +
      "</div>" +
    "</div></div>" +

    '<div class="pd-lower">' +
      '<div class="pd-video"><div class="placeholder-box placeholder-box--video">[Video]</div></div>' +
      '<section class="pd-related" aria-labelledby="rel-h"><h2 id="rel-h">Pieces</h2><ul>' + related + "</ul></section>" +
    "</div>";

  var stageImg = document.getElementById("pd-stage-img");
  var thumbsEl = document.getElementById("pd-thumbs");

  function setImage(i) {
    idx = (i + p.images.length) % p.images.length;
    var key = p.images[idx];
    stageImg.style.opacity = 0;
    var apply = function () {
      stageImg.innerHTML = V.img(key, { variant: variantFor(key), sizes: "(max-width: 820px) 100vw, 80vw", eager: true });
      stageImg.style.opacity = 1;
    };
    if (V.reducedMotion || !stageImg.innerHTML) apply(); else setTimeout(apply, 160);
    thumbsEl.querySelectorAll("button").forEach(function (b, k) {
      if (k === idx) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current");
    });
  }
  thumbsEl.addEventListener("click", function (e) {
    var b = e.target.closest("[data-thumb]");
    if (b) setImage(+b.getAttribute("data-thumb"));
  });

  /* Details accordion (in flow, below the band). */
  var toggle = document.getElementById("pd-toggle");
  var details = document.getElementById("pd-details");
  toggle.addEventListener("click", function () {
    var open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    if (open) {
      details.hidden = false;
      requestAnimationFrame(function () { details.classList.add("is-open"); });
    } else {
      details.classList.remove("is-open");
      setTimeout(function () { if (toggle.getAttribute("aria-expanded") === "false") details.hidden = true; }, V.reducedMotion ? 0 : 260);
    }
  });

  /* Lightbox */
  function lbRender() {
    var key = p.images[idx];
    lb.innerHTML =
      '<button type="button" class="tbtn dlg__close" data-close>Close</button>' +
      '<div class="lb__img">' + V.img(key, { sizes: "100vw", eager: true }) + "</div>" +
      '<div class="lb__bar"><span class="count mono" aria-live="polite">' + (idx + 1) + " / " + p.images.length + "</span>" +
      '<button type="button" class="tbtn" data-lb="-1">Previous</button><button type="button" class="tbtn" data-lb="1">Next</button></div>';
  }
  document.getElementById("pd-stage").addEventListener("click", function (e) {
    lbRender();
    V.openDialog(lb, e.currentTarget);
    lb.querySelector("[data-close]").focus();
  });
  lb.addEventListener("click", function (e) {
    var t = e.target.closest("button");
    if (!t) return;
    if (t.hasAttribute("data-close")) { lb.close(); return; }
    if (t.hasAttribute("data-lb")) {
      var dir = +t.getAttribute("data-lb");
      setImage(idx + dir);
      lbRender();
      lb.querySelector('[data-lb="' + dir + '"]').focus();
    }
  });
  lb.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      setImage(idx + (e.key === "ArrowLeft" ? -1 : 1));
      var focusedDir = document.activeElement && document.activeElement.getAttribute("data-lb");
      lbRender();
      var f = focusedDir ? lb.querySelector('[data-lb="' + focusedDir + '"]') : lb.querySelector("[data-close]");
      f.focus();
    }
  });

  setImage(0);
})();
