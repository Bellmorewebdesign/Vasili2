/* Journal: News and journal entries in one index. The first entry is featured; the rest form a grid
   with one labeled advertisement placement. Entries open in an accessible panel (?entry=j01). */
(function () {
  "use strict";
  var V = window.VASILI;
  var list = document.getElementById("jr");
  var feature = document.getElementById("jr-feature");
  var dlg = document.getElementById("jr-dlg");

  var entries = V.journal.filter(function (e) { return !e.ad; });
  var first = entries[0];

  feature.innerHTML = '<article class="jr-feature">' +
    '<div class="jr-feature__media">' + V.media(first.image, { ratio: "r-45", sizes: "(max-width: 900px) 100vw, 58vw", eager: true }) + "</div>" +
    '<div class="jr-feature__text"><div class="jr-meta"><span class="mono">' + first.number + "</span><span>" + first.kind + "</span></div>" +
      '<h2 class="h2">[Heading here]</h2><p class="ph ph-2">[Short summary]</p>' +
      '<button type="button" class="btn btn--ghost" data-entry="' + first.id + '" aria-haspopup="dialog">Read entry</button></div>' +
    "</article>";

  list.innerHTML = V.journal.slice(1).map(function (e) {
    if (e.ad) {
      return '<li class="ad-slot"><div class="placement" role="img" aria-label="Reserved space for a future advertisement">' +
        '<span class="placement__label">[Ad]</span><span class="placement__note">Advertisement, 4:5</span></div></li>';
    }
    return '<li><button type="button" class="jr-card" data-entry="' + e.id + '" aria-haspopup="dialog">' +
      V.media(e.image, { ratio: "r-45", sizes: "(max-width: 900px) 100vw, 33vw", alt: "" }) +
      '<div class="jr-meta"><span class="mono">' + e.number + "</span><span>" + e.kind + "</span></div>" +
      '<h3 class="h3">[Heading here]</h3><p class="ph ph-1">[Short summary]</p><span class="read">Read entry</span>' +
      "</button></li>";
  }).join("");

  function entry(id) { return entries.find(function (e) { return e.id === id; }); }

  function open(id, opener) {
    var e = entry(id);
    if (!e) return;
    dlg.innerHTML =
      '<button type="button" class="tbtn dlg__close" data-close>Close</button>' +
      '<div class="jr-dlg__body">' +
        V.media(e.image, { ratio: "r-45", sizes: "(max-width: 760px) 100vw, 540px" }) +
        '<div class="jr-dlg__copy"><div class="jr-meta" style="margin-top:0"><span class="mono">' + e.number + "</span><span>" + e.kind + "</span></div>" +
          '<h2 class="h2" id="jr-dlg-title">[Heading here]</h2>' +
          '<div class="body-copy"><p class="lead ph ph-1">[Introduction here]</p><p class="ph ph-3">[Text here]</p><p class="ph ph-2">[Text here]</p></div>' +
        "</div>" +
      "</div>";
    V.openDialog(dlg, opener);
    dlg.querySelector("[data-close]").focus();
    history.replaceState(null, "", "journal.html?entry=" + encodeURIComponent(id));
  }

  document.getElementById("main").addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-entry]");
    if (b) open(b.getAttribute("data-entry"), b);
  });
  dlg.addEventListener("click", function (ev) {
    if (ev.target.closest("[data-close]")) dlg.close();
  });
  dlg._onclose = function () { history.replaceState(null, "", "journal.html"); };

  var start = V.param("entry");
  if (start) open(start, document.querySelector('[data-entry="' + start + '"]'));
})();
