/* Shared chrome and helpers for every public page.
   All paths are relative so the site works under any subpath, e.g. /Vasili2/. */
(function () {
  "use strict";
  var V = window.VASILI;

  V.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  V.param = function (name) {
    return new URLSearchParams(window.location.search).get(name);
  };

  V.esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  V.product = function (id) {
    return V.products.find(function (p) { return p.id === id; }) || null;
  };
  V.collection = function (id) {
    return V.collections.find(function (c) { return c.id === id; }) || null;
  };

  /* Image helpers. variant "stage" uses the tighter 4:5 crop where one exists. */
  V.src = function (key, size, variant) {
    var im = V.images[key];
    if (!im) return "";
    var stage = variant === "stage" && im.stage ? "-stage" : "";
    return "assets/web/" + im.file + stage + "-" + (size || 1600) + ".jpg";
  };
  V.img = function (key, opts) {
    opts = opts || {};
    var im = V.images[key];
    if (!im) return "";
    var big = Math.min(1600, im.w);
    var w = im.w, h = im.h;
    if (opts.variant === "stage" && im.stage) { w = 1600; h = 2000; }
    return '<img src="' + V.src(key, 1600, opts.variant) + '"' +
      ' srcset="' + V.src(key, 800, opts.variant) + ' 800w, ' + V.src(key, 1600, opts.variant) + ' ' + big + 'w"' +
      ' sizes="' + (opts.sizes || "(max-width: 820px) 100vw, 50vw") + '"' +
      ' width="' + w + '" height="' + h + '"' +
      ' alt="' + V.esc(opts.alt != null ? opts.alt : im.alt) + '"' +
      (opts.eager ? ' fetchpriority="high"' : ' loading="lazy"') +
      ' decoding="async">';
  };

  /* Dialog helpers with focus restoration. Native <dialog> gives Escape and focus containment. */
  V.openDialog = function (dlg, opener) {
    dlg._opener = opener || document.activeElement;
    if (!dlg.open) dlg.showModal();
    var first = dlg.querySelector("[data-autofocus]") || dlg.querySelector("button, a, input");
    if (first) first.focus();
  };
  V.closeDialog = function (dlg) {
    if (dlg.open) dlg.close();
  };
  document.addEventListener("close", function (e) {
    var dlg = e.target;
    if (dlg && dlg.tagName === "DIALOG") {
      var op = dlg._opener;
      dlg._opener = null;
      if (op && document.contains(op) && typeof op.focus === "function") op.focus();
      if (typeof dlg._onclose === "function") dlg._onclose();
    }
  }, true);
  /* Click on the backdrop closes a dialog. */
  document.addEventListener("click", function (e) {
    var t = e.target;
    if (t && t.tagName === "DIALOG" && t.open && !t.hasAttribute("data-no-backdrop-close")) {
      var r = t.getBoundingClientRect();
      var inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!inside) t.close();
    }
  });

  /* Email field markup. No data is stored or transmitted. */
  V.emailForm = function (idSuffix, opts) {
    opts = opts || {};
    var id = "email-" + (idSuffix || "signup");
    return '<form class="email-form" novalidate data-inert-form>' +
      '<label for="' + id + '">Email</label>' +
      '<div class="signup__row"><input class="field" id="' + id + '" type="email" placeholder="[Email]" autocomplete="off">' +
      '<button type="submit" class="btn' + (opts.light ? " btn--light" : "") + '" disabled aria-describedby="' + id + '-p">Sign up</button></div>' +
      '<span class="pending" id="' + id + '-p">[Signup pending]</span>' +
      "</form>";
  };
  document.addEventListener("submit", function (e) {
    if (e.target.hasAttribute("data-inert-form")) e.preventDefault();
  });

  /* Media block that keeps the photo's proportions: cover crops evenly, never stretches.
     Studio shots on white use their 4:5 crop on a white tile. */
  V.media = function (key, opts) {
    opts = opts || {};
    var im = V.images[key];
    var light = im && im.light;
    return '<div class="ratio ' + (opts.ratio || "r-45") + (light ? " ratio--paper" : "") + (opts.zoom ? " zoom" : "") + '">' +
      V.img(key, { variant: light ? "stage" : null, sizes: opts.sizes, eager: opts.eager, alt: opts.alt }) + "</div>";
  };

  V.categoryLabel = function (id) {
    var c = V.categories.find(function (x) { return x.id === id; });
    return c ? c.label : "";
  };

  /* Product card used on the homepage, Pieces, collections and product pages. */
  V.card = function (p, opts) {
    opts = opts || {};
    var sizes = opts.sizes || "(max-width: 760px) 50vw, 25vw";
    return '<li class="pcard">' +
      '<a class="pcard__link" href="product.html?id=' + p.id + '">' +
        '<div class="pcard__media">' +
          V.img(p.stageImage, { variant: "stage", sizes: sizes }) +
          V.img(p.featureImage, { sizes: sizes, alt: "" }).replace("<img ", '<img class="alt" aria-hidden="true" ') +
        "</div>" +
        '<div class="pcard__body">' +
          '<div class="pcard__top"><span class="pcard__name">[Product name]</span><span class="mono">' + p.number + "</span></div>" +
          '<div class="pcard__cat">' + V.categoryLabel(p.category) + "</div>" +
          '<p class="pcard__desc ph ph-1">[Description here]</p>' +
        "</div>" +
      "</a>" +
      (opts.quick ? '<div class="pcard__actions"><button type="button" class="tbtn" data-qv="' + p.id + '" aria-haspopup="dialog"><span>Quick view</span><span class="visually-hidden"> item ' + p.number + "</span></button></div>" : "") +
      "</li>";
  };

  var LOGO = '<img src="assets/brand/vasili-logo-white.svg" alt="Vasili" width="243" height="104">';
  var CHEV = '<svg class="chev" viewBox="0 0 10 10" aria-hidden="true"><path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>';

  var SHOP = [{ label: "All pieces", href: "pieces.html" }].concat(V.categories.map(function (c) {
    return { label: c.label, href: "pieces.html?cat=" + c.id };
  }));
  var COLLS = V.collections.map(function (c) { return { label: c.title, href: "collection.html?id=" + c.id }; });
  var ABOUT = [
    { label: "About", href: "studio.html#about" },
    { label: "Preface", href: "studio.html#preface" },
    { label: "Collaborations", href: "studio.html#collaborations" },
    { label: "Journal", href: "journal.html" }
  ];
  var HELP = [
    { label: "FAQ", href: "info.html#faq" },
    { label: "Custom Inquiries", href: "info.html#custom" },
    { label: "Shipping", href: "info.html#shipping" },
    { label: "Returns", href: "info.html#returns" }
  ];
  function links(list) {
    return list.map(function (l) { return '<li><a href="' + l.href + '">' + V.esc(l.label) + "</a></li>"; }).join("");
  }

  function buildHeader() {
    var host = document.getElementById("chrome");
    if (!host) return;
    var page = document.body.getAttribute("data-page") || "";
    var cur = function (id) { return page === id ? ' aria-current="page"' : ""; };

    var tiles = V.collections.map(function (c) {
      return '<a href="collection.html?id=' + c.id + '">' + V.media(c.tileImage, { ratio: "r-45", sizes: "180px", alt: "" }) + "<span>" + V.esc(c.title) + "</span></a>";
    }).join("");

    host.innerHTML =
      '<a class="skip" href="#main">Skip to content</a>' +
      '<header class="site-header">' +
        '<div class="wrap site-header__bar">' +
          '<a class="site-header__logo" href="index.html" aria-label="Vasili, home">' + LOGO + "</a>" +
          '<nav class="site-nav" aria-label="Primary"><ul>' +
            '<li><button type="button" id="shop-btn" aria-expanded="false" aria-controls="shop-menu"' + (page === "shop" ? ' class="is-current"' : "") + ">Shop " + CHEV + "</button></li>" +
            '<li><a href="studio.html"' + cur("about") + ">About</a></li>" +
            '<li><a href="journal.html"' + cur("journal") + ">Journal</a></li>" +
            '<li><a href="info.html#faq"' + cur("info") + ">FAQ</a></li>" +
          "</ul></nav>" +
          '<button type="button" class="tbtn menu-btn" id="menu-btn" aria-haspopup="dialog">Menu</button>' +
        "</div>" +
        '<div class="mega" id="shop-menu" hidden>' +
          '<div class="wrap mega__inner">' +
            '<div><h2>Shop</h2><ul>' + links(SHOP) + "</ul></div>" +
            '<div><h2>Collections</h2><ul>' + links(COLLS) + "</ul></div>" +
            '<div class="mega__tiles">' + tiles + "</div>" +
          "</div>" +
        "</div>" +
      "</header>" +
      '<dialog class="menu-dlg" id="menu-dlg" aria-label="Menu">' +
        '<div class="menu-dlg__bar"><a href="index.html" aria-label="Vasili, home">' + LOGO + '</a><button type="button" class="tbtn" data-close data-autofocus>Close</button></div>' +
        '<nav aria-label="Primary">' +
          '<div class="m-group"><h2>Shop</h2><ul class="m-big">' + links(SHOP) + "</ul></div>" +
          '<div class="m-group"><h2>Collections</h2><ul class="m-big">' + links(COLLS) + "</ul></div>" +
          '<div class="m-group"><ul class="m-big">' +
            '<li><a href="studio.html">About</a></li><li><a href="journal.html">Journal</a></li><li><a href="info.html#faq">FAQ</a></li>' +
          "</ul></div>" +
          '<div class="m-group"><h2>Help</h2><ul class="m-small">' + links(HELP.slice(1)) + "</ul></div>" +
        "</nav>" +
      "</dialog>";

    /* Shop menu: click to open, Escape or click outside to close. */
    var btn = document.getElementById("shop-btn");
    var menu = document.getElementById("shop-menu");
    function setShop(open, focusBtn) {
      btn.setAttribute("aria-expanded", String(open));
      menu.hidden = !open;
      if (!open && focusBtn) btn.focus();
    }
    btn.addEventListener("click", function () { setShop(menu.hidden); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) setShop(false, true);
    });
    document.addEventListener("click", function (e) {
      if (!menu.hidden && !e.target.closest("#shop-menu, #shop-btn")) setShop(false);
    });
    menu.addEventListener("focusout", function (e) {
      if (e.relatedTarget && !menu.contains(e.relatedTarget) && e.relatedTarget !== btn) setShop(false);
    });

    var dlg = document.getElementById("menu-dlg");
    document.getElementById("menu-btn").addEventListener("click", function (e) { V.openDialog(dlg, e.currentTarget); });
    dlg.addEventListener("click", function (e) {
      var t = e.target.closest("a, button");
      if (!t) return;
      if (t.hasAttribute("data-close")) { dlg.close(); return; }
      /* Same-page hash links: close the menu so the target is visible. */
      var url = new URL(t.href || "", window.location.href);
      if (t.tagName === "A" && url.pathname === window.location.pathname) { dlg._opener = null; dlg.close(); }
    });
  }

  function buildEnd() {
    var host = document.getElementById("site-end");
    if (!host) return;
    host.innerHTML =
      '<section class="signup" aria-labelledby="signup-title">' +
        '<div class="wrap signup__inner">' +
          '<div class="signup__text"><span class="eyebrow">Newsletter</span><h2 class="h3" id="signup-title">[Heading here]</h2><p class="ph ph-1">[Short introduction]</p></div>' +
          '<div class="signup__form">' + V.emailForm("signup") + "</div>" +
        "</div>" +
      "</section>" +
      '<footer class="site-footer">' +
        '<div class="wrap">' +
          '<div class="site-footer__grid">' +
            '<div class="site-footer__brand"><a href="index.html" aria-label="Vasili, home">' + LOGO + '</a><p class="ph ph-2">[Short description]</p></div>' +
            '<nav aria-label="Shop"><h2>Shop</h2><ul>' + links(SHOP) + "</ul></nav>" +
            '<nav aria-label="Collections"><h2>Collections</h2><ul>' + links(COLLS) + "</ul></nav>" +
            '<nav aria-label="About"><h2>About</h2><ul>' + links(ABOUT) + "</ul></nav>" +
            '<nav aria-label="Help"><h2>Help</h2><ul>' + links(HELP) + "</ul></nav>" +
          "</div>" +
          '<div class="site-footer__bottom"><span>&copy; Vasili</span><span>[Legal links]</span></div>' +
        "</div>" +
      "</footer>";
  }

  buildHeader();
  buildEnd();
})();
