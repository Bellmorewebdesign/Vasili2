/* Shop: product grid with category filters and an optional Quick view.
   Quick view never links to the origin drawing. */
(function () {
  "use strict";
  var V = window.VASILI;
  var grid = document.getElementById("grid");
  var filters = document.getElementById("filters");
  var title = document.getElementById("shop-title");
  var crumb = document.getElementById("crumb-cur");
  var qv = document.getElementById("qv");

  var valid = V.categories.map(function (c) { return c.id; });
  var active = valid.indexOf(V.param("cat")) > -1 ? V.param("cat") : "all";

  var opts = [{ id: "all", label: "All pieces" }].concat(V.categories);
  filters.innerHTML = opts.map(function (o) {
    return '<li><button type="button" data-cat="' + o.id + '" aria-pressed="' + (o.id === active) + '">' + o.label + "</button></li>";
  }).join("");

  function label() { return opts.find(function (o) { return o.id === active; }).label; }

  function render(animate) {
    var list = V.products.filter(function (p) { return active === "all" || p.category === active; });
    grid.classList.toggle("is-filtering", !!animate);
    /* Four columns when every piece shows; a filtered view uses three and closes the row with an inquiry tile. */
    var full = list.length % 4 === 0;
    grid.classList.toggle("pgrid--3", !full);
    grid.innerHTML = list.map(function (p) {
      return V.card(p, { quick: true, sizes: "(max-width: 760px) 50vw, " + (full ? "25vw" : "33vw") });
    }).join("") + (full ? "" :
      '<li class="promo"><span class="eyebrow">Custom Inquiries</span><h2 class="h3">[Heading here]</h2>' +
      '<p class="ph ph-2">[Short introduction]</p><a class="link" href="info.html#custom">Inquire <span class="arr" aria-hidden="true">&rarr;</span></a></li>');
    title.textContent = label();
    crumb.textContent = label();
    document.title = label() + " | Vasili";
  }

  filters.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-cat]");
    if (!b) return;
    active = b.getAttribute("data-cat");
    filters.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
    history.replaceState(null, "", "pieces.html" + (active === "all" ? "" : "?cat=" + active));
    render(true);
  });

  grid.addEventListener("click", function (e) {
    var b = e.target.closest("[data-qv]");
    if (!b) return;
    var p = V.product(b.getAttribute("data-qv"));
    qv.innerHTML =
      '<button type="button" class="tbtn dlg__close" data-close>Close</button>' +
      '<div class="qv">' +
        '<div class="ratio ratio--paper r-45">' + V.img(p.stageImage, { variant: "stage", sizes: "(max-width: 680px) 100vw, 500px" }) + "</div>" +
        '<div class="qv__body"><span class="mono">' + p.number + "</span>" +
          '<h2 class="h3" id="qv-title">[Product name]</h2>' +
          '<div class="pcard__cat">' + V.categoryLabel(p.category) + "</div>" +
          '<p class="ph ph-3">[Description here]</p>' +
          '<a class="btn" href="product.html?id=' + p.id + '" data-autofocus>View piece</a></div>' +
      "</div>";
    V.openDialog(qv, b);
  });
  qv.addEventListener("click", function (e) {
    if (e.target.closest("[data-close]")) qv.close();
  });

  render(false);
})();
