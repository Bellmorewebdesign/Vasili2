/* About page: About, Preface and Collaborations as three selectable sections (ARIA tabs).
   The hash (#about, #preface, #collaborations) selects a section and survives refresh. */
(function () {
  "use strict";
  var V = window.VASILI;
  var tabs = document.getElementById("tabs");
  var panels = document.getElementById("panels");
  var secs = V.studio;

  tabs.innerHTML = secs.map(function (s) {
    return '<button type="button" role="tab" id="tab-' + s.id + '" aria-controls="panel-' + s.id + '" aria-selected="false" tabindex="-1">' + s.label + "</button>";
  }).join("");

  panels.innerHTML = secs.map(function (s) {
    var second = s.second || s.image;
    return '<section class="studio-panel" role="tabpanel" id="panel-' + s.id + '" aria-labelledby="tab-' + s.id + '" tabindex="0" hidden>' +
      '<div class="split">' +
        '<div class="split__media">' + V.media(s.image, { ratio: "r-45", sizes: "(max-width: 900px) 100vw, 50vw" }) + "</div>" +
        '<div class="split__text"><span class="eyebrow">' + s.label + '</span><h2 class="h2">[Heading here]</h2>' +
          '<div class="body-copy"><p class="lead ph ph-2">[Introduction here]</p><p class="ph ph-3">[Text here]</p></div></div>' +
      "</div>" +
      '<div class="studio-row">' +
        '<div class="studio-row__text"><h3 class="h3">[Heading here]</h3><div class="body-copy"><p class="ph ph-3">[Text here]</p></div></div>' +
        '<div class="studio-row__media">' + V.media(second, { ratio: "r-34", sizes: "(max-width: 900px) 100vw, 40vw" }) + "</div>" +
      "</div>" +
      "</section>";
  }).join("");

  function select(id, focus) {
    secs.forEach(function (s) {
      var on = s.id === id;
      var t = document.getElementById("tab-" + s.id);
      var pnl = document.getElementById("panel-" + s.id);
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      pnl.hidden = !on;
      pnl.classList.toggle("is-showing", on);
      if (on && focus) t.focus();
    });
  }
  function fromHash() {
    var h = window.location.hash.slice(1);
    return secs.some(function (s) { return s.id === h; }) ? h : secs[0].id;
  }
  function selectedId() {
    var sel = tabs.querySelector('[aria-selected="true"]');
    return sel ? sel.id.replace("tab-", "") : secs[0].id;
  }

  tabs.addEventListener("click", function (e) {
    var t = e.target.closest("[role=tab]");
    if (!t) return;
    var id = t.id.replace("tab-", "");
    history.replaceState(null, "", "#" + id);
    select(id, false);
  });
  tabs.addEventListener("keydown", function (e) {
    var ids = secs.map(function (s) { return s.id; });
    var cur = ids.indexOf(selectedId());
    var next = null;
    if (e.key === "ArrowRight") next = (cur + 1) % ids.length;
    if (e.key === "ArrowLeft") next = (cur - 1 + ids.length) % ids.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = ids.length - 1;
    if (next === null) return;
    e.preventDefault();
    history.replaceState(null, "", "#" + ids[next]);
    select(ids[next], true);
  });
  window.addEventListener("hashchange", function () { select(fromHash(), false); });

  select(fromHash(), false);
})();
