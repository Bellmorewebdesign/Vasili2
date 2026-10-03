/* Info: open a FAQ item when its anchor is targeted (for example info.html#faq-origin). */
(function () {
  "use strict";
  function openTarget() {
    var id = window.location.hash.slice(1);
    if (!id) return;
    var el = document.getElementById(id);
    if (el && el.tagName === "DETAILS") {
      el.open = true;
      var s = el.querySelector("summary");
      if (s) s.focus();
    }
  }
  window.addEventListener("hashchange", openTarget);
  openTarget();
})();
