/* Journal: News and journal entries in one visual index. Entries open in an accessible panel.
   The [Ad] placement lives here, not on the homepage. ?entry=j01 opens an entry directly. */
(function () {
  "use strict";
  var V = window.VASILI;
  var list = document.getElementById("jr");
  var dlg = document.getElementById("jr-dlg");

  list.innerHTML = V.journal.map(function (e) {
    if (e.ad) return '<li class="is-ad"><div class="placeholder-box ad-box">[Ad]</div></li>';
    return '<li class="size-' + e.size + '"><button type="button" class="jr-entry" data-entry="' + e.id + '" aria-haspopup="dialog">' +
      '<div class="cover">' + V.img(e.image, { sizes: "(max-width: 820px) 90vw, 30vw", alt: "" }) + "</div>" +
      '<span class="jr-meta"><span class="mono">' + e.number + "</span><span>" + e.kind + "</span><span>[Heading]</span></span>" +
      "</button></li>";
  }).join("");

  function entry(id) { return V.journal.find(function (e) { return e.id === id; }); }

  function open(id, opener) {
    var e = entry(id);
    if (!e) return;
    dlg.innerHTML =
      '<button type="button" class="tbtn dlg__close" data-close data-autofocus>Close</button>' +
      '<div class="jr-dlg__body">' +
        '<div class="cover">' + V.img(e.image, { sizes: "(max-width: 640px) 100vw, 490px" }) + "</div>" +
        '<div class="jr-dlg__copy"><span class="mono">' + e.number + " " + e.kind + '</span><h2 id="jr-dlg-title">[Heading]</h2><p>[Text]</p></div>' +
      "</div>";
    V.openDialog(dlg, opener);
    var url = new URL(window.location.href);
    url.searchParams.set("entry", id);
    history.replaceState(null, "", "journal.html" + url.search);
  }

  list.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-entry]");
    if (b) open(b.getAttribute("data-entry"), b);
  });
  dlg.addEventListener("click", function (ev) {
    if (ev.target.closest("[data-close]")) dlg.close();
  });
  dlg._onclose = function () { history.replaceState(null, "", "journal.html"); };

  var start = V.param("entry");
  if (start) open(start, list.querySelector('[data-entry="' + start + '"]'));
})();
