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

  /* Email strip. No data is stored or transmitted. */
  V.emailForm = function (idSuffix) {
    var id = "email-" + (idSuffix || "strip");
    return '<form class="email-form" novalidate data-inert-form>' +
      '<label for="' + id + '">Email</label> ' +
      '<input id="' + id + '" type="email" placeholder="[Email]" autocomplete="off"> ' +
      '<button type="submit" disabled aria-describedby="' + id + '-p">Submit</button> ' +
      '<span class="pending" id="' + id + '-p">[Signup pending]</span>' +
      "</form>";
  };
  document.addEventListener("submit", function (e) {
    if (e.target.hasAttribute("data-inert-form")) e.preventDefault();
  });

  var NAV = [
    { id: "pieces", label: "Pieces", href: "pieces.html" },
    { id: "index", label: "Index", overlay: true },
    { id: "studio", label: "Studio", href: "studio.html" },
    { id: "journal", label: "Journal", href: "journal.html" }
  ];
  var INFO = [
    { label: "FAQ", href: "info.html#faq" },
    { label: "Custom Inquiries", href: "info.html#custom" },
    { label: "Shipping", href: "info.html#shipping" },
    { label: "Returns", href: "info.html#returns" }
  ];

  function navItems(page, cls) {
    return NAV.map(function (n) {
      if (n.overlay) {
        return '<li><button type="button" class="' + cls + '" data-open-index aria-expanded="false" aria-haspopup="dialog">' + n.label + "</button></li>";
      }
      var cur = page === n.id ? ' aria-current="page"' : "";
      return '<li><a class="' + cls + '" href="' + n.href + '"' + cur + ">" + n.label + "</a></li>";
    }).join("");
  }

  var LOGO = '<img src="assets/brand/vasili-logo-white.svg" alt="Vasili" width="243" height="104">';

  function buildChrome() {
    var page = document.body.getAttribute("data-page") || "";
    var host = document.getElementById("chrome");
    if (!host) return;

    var indexTiles = V.collections.map(function (c) {
      return '<a class="index-tile" href="collection.html?id=' + c.id + '">' +
        '<div class="index-tile__img">' + V.img(c.tileImage, { sizes: "240px", alt: "" }) + "</div>" +
        '<span class="index-tile__name"><span>' + V.esc(c.title) + "</span></span></a>";
    }).join("");
    var cats = '<li><a href="pieces.html">All pieces</a></li>' + V.categories.map(function (c) {
      return '<li><a href="pieces.html?cat=' + c.id + '">' + c.label + "</a></li>";
    }).join("");

    host.innerHTML =
      '<a class="skip" href="#main">Skip to content</a>' +
      '<header class="rail" aria-label="Site">' +
        '<a class="rail__logo" href="index.html" aria-label="Vasili, home">' + LOGO + "</a>" +
        '<nav aria-label="Primary"><ul class="rail__nav">' + navItems(page, "") + "</ul></nav>" +
        '<button type="button" class="rail__info" data-open-info aria-haspopup="dialog">Info</button>' +
      "</header>" +
      '<header class="topbar" aria-label="Site">' +
        '<a class="topbar__logo" href="index.html" aria-label="Vasili, home">' + LOGO + "</a>" +
        '<button type="button" class="tbtn" data-open-menu aria-haspopup="dialog">Menu</button>' +
      "</header>" +

      '<dialog class="dlg info-dlg" id="info-dlg" aria-label="Info">' +
        "<ul>" + INFO.map(function (i) { return '<li><a href="' + i.href + '">' + i.label + "</a></li>"; }).join("") + "</ul>" +
        '<button type="button" class="tbtn dlg__close" data-close>Close</button>' +
      "</dialog>" +

      '<dialog class="dlg index-dlg" id="index-dlg" aria-labelledby="index-title">' +
        '<button type="button" class="tbtn dlg__close" data-close data-autofocus>Close</button>' +
        '<h2 id="index-title">Index</h2>' +
        '<div class="index-grid">' + indexTiles + "</div>" +
        '<ul class="index-sel" aria-label="Pieces">' + cats + "</ul>" +
      "</dialog>" +

      '<dialog class="dlg menu-dlg" id="menu-dlg" aria-label="Menu">' +
        '<div class="menu-dlg__bar"><a href="index.html" aria-label="Vasili, home">' + LOGO + '</a><button type="button" class="tbtn" data-close data-autofocus>Close</button></div>' +
        '<nav aria-label="Primary"><ul>' + navItems(page, "") + "</ul>" +
          '<ul class="menu-dlg__info">' + INFO.map(function (i) { return '<li><a href="' + i.href + '">' + i.label + "</a></li>"; }).join("") + "</ul>" +
        "</nav>" +
      "</dialog>";

    var info = document.getElementById("info-dlg");
    var index = document.getElementById("index-dlg");
    var menu = document.getElementById("menu-dlg");

    host.addEventListener("click", function (e) {
      var t = e.target.closest("button, a");
      if (!t) return;
      if (t.hasAttribute("data-close")) { t.closest("dialog").close(); return; }
      if (t.hasAttribute("data-open-info")) { V.openDialog(info, t); return; }
      if (t.hasAttribute("data-open-menu")) { V.openDialog(menu, t); return; }
      if (t.hasAttribute("data-open-index")) {
        var opener = t;
        if (menu.open) { menu.close(); opener = document.querySelector(".topbar [data-open-menu]"); }
        setExpanded(true);
        V.openDialog(index, opener);
        return;
      }
      /* Following an in-page hash link from a dialog: close it first. */
      if (t.tagName === "A" && t.closest("dialog")) {
        var dlg = t.closest("dialog");
        var url = new URL(t.href, window.location.href);
        if (url.pathname === window.location.pathname && url.hash) {
          dlg._opener = null;
          dlg.close();
        }
      }
    });
    function setExpanded(v) {
      document.querySelectorAll("[data-open-index]").forEach(function (b) { b.setAttribute("aria-expanded", v ? "true" : "false"); });
    }
    index._onclose = function () { setExpanded(false); };
  }

  function buildStrip() {
    var strip = document.getElementById("strip");
    if (!strip) return;
    strip.classList.add("strip");
    strip.innerHTML = '<div class="strip__inner">' + V.emailForm("strip") +
      '<span class="strip__end"><a href="info.html#faq">Info</a></span></div>';
  }

  buildChrome();
  buildStrip();
})();
