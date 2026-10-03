/* Pieces: asymmetric exhibition grid with category filters and an optional Quick view.
   Quick view never links to the origin drawing. */
(function () {
  "use strict";
  var V = window.VASILI;
  var grid = document.getElementById("grid");
  var filters = document.getElementById("filters");
  var qv = document.getElementById("qv");

  var valid = V.categories.map(function (c) { return c.id; });
  var active = valid.indexOf(V.param("cat")) > -1 ? V.param("cat") : "all";

  var opts = [{ id: "all", label: "All" }].concat(V.categories);
  filters.innerHTML = opts.map(function (o) {
    return '<li><button type="button" data-cat="' + o.id + '" aria-pressed="' + (o.id === active) + '">' + o.label + "</button></li>";
  }).join("");

  function card(p, i) {
    var lead = i === 0;
    var cls = lead ? "is-lead" : "slot-" + (i + 1);
    var media = lead
      ? '<div class="card__img cover">' + V.img(p.featureImage, { sizes: "(max-width: 820px) 100vw, 45vw" }) + "</div>"
      : '<div class="card__img frame frame--pad">' + V.img(p.stageImage, { variant: "stage", sizes: "(max-width: 820px) 50vw, 22vw" }) + "</div>";
    return '<li class="' + cls + '">' +
      '<a class="card" href="product.html?id=' + p.id + '">' + media +
      '<span class="card__meta"><span class="mono">' + p.number + "</span><span>[Product name]</span></span></a>" +
      '<button type="button" class="tbtn quick" data-qv="' + p.id + '" aria-haspopup="dialog">Quick view<span class="visually-hidden"> item ' + p.number + "</span></button>" +
      "</li>";
  }

  function render(animate) {
    var list = V.products.filter(function (p) { return active === "all" || p.category === active; });
    grid.classList.toggle("is-filtering", !!animate);
    grid.innerHTML = list.map(card).join("");
  }

  filters.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-cat]");
    if (!b) return;
    active = b.getAttribute("data-cat");
    filters.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
    var url = new URL(window.location.href);
    if (active === "all") url.searchParams.delete("cat"); else url.searchParams.set("cat", active);
    history.replaceState(null, "", url.pathname.split("/").pop() + url.search);
    render(true);
  });

  grid.addEventListener("click", function (e) {
    var b = e.target.closest("[data-qv]");
    if (!b) return;
    var p = V.product(b.getAttribute("data-qv"));
    qv.innerHTML =
      '<button type="button" class="tbtn dlg__close" data-close data-autofocus>Close</button>' +
      '<div class="qv">' +
        '<div class="frame frame--pad">' + V.img(p.stageImage, { variant: "stage", sizes: "(max-width: 640px) 100vw, 480px" }) + "</div>" +
        '<div class="qv__body"><span class="mono">' + p.number + '</span><h2 id="qv-title" style="font-weight:400;font-size:18px;margin:0">[Product name]</h2>' +
        "<p>[Product details]</p>" +
        '<a class="tbtn tbtn--line" href="product.html?id=' + p.id + '">View piece</a></div>' +
      "</div>";
    V.openDialog(qv, b);
  });
  qv.addEventListener("click", function (e) {
    if (e.target.closest("[data-close]")) qv.close();
  });

  render(false);
})();
