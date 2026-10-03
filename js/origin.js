/* Origin: the hidden, pannable drawing.

   Entry points (the only public ones): See origin in a product's Details, and one link in an
   expanded FAQ answer. URL state:
     origin.html?entry=faq                     start near the central chain
     origin.html?node=demo-a&piece=piece-a      reveal the ancestor path, focus the node, open its panel
     ...&view=study | view=family              open the Study or Family view for that node
   Selecting a node pushes a history entry, so browser Back and refresh keep node and panel state.
   Discovered branches are remembered for the tab session (sessionStorage) when available. */
(function () {
  "use strict";
  var V = window.VASILI, G = V.originGeometry, SH = V.originShapes;
  var NS = "http://www.w3.org/2000/svg";

  /* ---------------------------------------------------------------- model */
  var nodes = {};
  var chainMid = G.chain.rings[3];
  nodes.chain = { id: "chain", ref: G.chain.ref, x: chainMid[0], y: chainMid[1], children: [], level: 0, isChain: true };
  G.nodes.forEach(function (n) { nodes[n.id] = Object.assign({ children: [] }, n); });
  G.nodes.forEach(function (n) {
    var p = nodes[n.parent];
    if (p) p.children.push(n.id);
  });
  var list = G.nodes.map(function (n) { return nodes[n.id]; });
  function level(id) { var l = 0, n = nodes[id]; while (n && n.parent) { l++; n = nodes[n.parent]; } return l; }
  function ancestors(id) { var out = [], n = nodes[id]; while (n && n.parent) { out.unshift(n.parent); n = nodes[n.parent]; } return out; }
  function familyRoot(id) { var a = ancestors(id); return a.length > 1 ? a[1] : id; }
  function radius(n) { return n.isChain ? G.chain.ringRadius : (n.frame || Math.max(20, 46 * (n.s || 1))); }

  var linkByNode = {};
  V.originLinks.forEach(function (l) { linkByNode[l.node] = l; });

  /* ---------------------------------------------------------------- persistence */
  var KEY = "vasili-origin-expanded";
  var expanded = new Set(["chain"]);
  try {
    var saved = JSON.parse(sessionStorage.getItem(KEY) || "[]");
    saved.forEach(function (id) { if (nodes[id]) expanded.add(id); });
  } catch (e) { /* storage unavailable: discovery simply restarts */ }
  function persist() { try { sessionStorage.setItem(KEY, JSON.stringify(Array.from(expanded))); } catch (e) {} }

  function visible(id) { var n = nodes[id]; return id === "chain" || (expanded.has(n.parent) && visible(n.parent)); }

  /* ---------------------------------------------------------------- drawing */
  var svg = document.getElementById("o-svg");
  var world = document.getElementById("o-world");
  var map = document.getElementById("o-map");

  function shapeMarkup(n) {
    var fn = SH[n.shape];
    var inner = fn ? fn(n) : "";
    return '<g transform="rotate(' + (n.rot || 0) + ") scale(" + (n.s || 1) + ')">' + inner + "</g>";
  }

  function connectorD(n) {
    if (n.noLine) return "";
    var p = nodes[n.parent];
    var start;
    if (p.isChain) {
      if (n.attach === null || n.attach === undefined) return "";
      var ring = G.chain.rings[n.attach];
      start = { x: ring[0], y: ring[1], r: G.chain.ringRadius * 1.02 };
    } else {
      start = { x: p.x, y: p.y, r: radius(p) };
    }
    var pts = [[start.x, start.y]].concat(n.via || []).concat([[n.x, n.y]]);
    function trim(a, b, r) {
      var dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy);
      if (l <= r) return a.slice();
      return [a[0] + dx / l * r, a[1] + dy / l * r];
    }
    pts[0] = trim(pts[0], pts[1], start.r);
    pts[pts.length - 1] = trim(pts[pts.length - 1], pts[pts.length - 2], radius(n) + 4);
    return "M" + pts.map(function (q) { return Math.round(q[0]) + "," + Math.round(q[1]); }).join("L");
  }

  function nodeLabel(n) {
    var l = linkByNode[n.id];
    var s = "Form " + n.ref;
    if (l) s += ", item " + V.product(l.piece).number;
    if (n.children.length) s += expanded.has(n.id) ? "" : ", has attached forms";
    return s;
  }

  function build() {
    var html = '<g id="o-conns" class="o-conns">';
    list.forEach(function (n) {
      var d = connectorD(n);
      if (d) html += '<path class="o-conn" data-for="' + n.id + '" d="' + d + '"/>';
    });
    G.brackets.forEach(function (b) { html += '<path class="o-conn" data-family="' + b.family + '" d="' + b.d + '"/>'; });
    html += "</g>";

    html += '<g class="o-chain o-art" id="n-chain" data-id="chain" role="button" tabindex="0" aria-label="Central chain, form ' + G.chain.ref + '">' +
      V.drawChain(G.chain.rings, G.chain.ringRadius, G.chain.tipStart, G.chain.tipEnd, false) + "</g>";

    list.forEach(function (n) {
      var r = radius(n);
      html += '<g class="o-node o-art" id="n-' + n.id + '" data-id="' + n.id + '" role="button" tabindex="0" transform="translate(' + n.x + "," + n.y + ')">' +
        '<circle class="o-hit" r="' + Math.max(r, 30) + '"/>' +
        (n.frame ? '<circle class="o-frame" r="' + n.frame + '"/>' : "") +
        '<g class="o-shape">' + shapeMarkup(n) + "</g>" +
        '<circle class="o-sel" r="' + (r + 10) + '"/>' +
        (n.children.length ? '<circle class="o-hint" cx="' + Math.round(r * 0.74) + '" cy="' + Math.round(-r * 0.74) + '" r="6"/>' : "") +
        "</g>";
    });
    world.innerHTML = html;
  }

  var selected = null;

  function refresh(newIds) {
    list.forEach(function (n) {
      var el = document.getElementById("n-" + n.id);
      var vis = visible(n.id);
      el.classList.toggle("is-hidden", !vis);
      el.classList.toggle("is-selected", selected === n.id);
      el.setAttribute("aria-label", nodeLabel(n));
      if (vis && n.children.length) el.setAttribute("aria-expanded", expanded.has(n.id) ? "true" : "false");
      var hint = el.querySelector(".o-hint");
      if (hint) hint.classList.toggle("is-hidden", expanded.has(n.id));
      var c = world.querySelector('.o-conn[data-for="' + n.id + '"]');
      if (c) c.classList.toggle("is-hidden", !vis);
      if (newIds && newIds.indexOf(n.id) > -1 && !V.reducedMotion) {
        el.classList.remove("is-new"); void el.getBBox(); el.classList.add("is-new");
      }
    });
    G.brackets.forEach(function (b) {
      var el = world.querySelector('.o-conn[data-family="' + b.family + '"]');
      if (el) el.classList.toggle("is-hidden", !expanded.has(b.family) || !visible(b.family));
    });
    document.getElementById("n-chain").classList.toggle("is-selected", selected === "chain");
  }

  function expand(id) {
    var added = [];
    if (!expanded.has(id) && nodes[id].children.length) {
      expanded.add(id);
      added = nodes[id].children.slice();
    }
    return added;
  }
  function expandPath(id) {
    var added = [];
    ancestors(id).concat([id]).forEach(function (a) { added = added.concat(expand(a)); });
    return added;
  }

  /* ---------------------------------------------------------------- camera */
  var cam = { x: 0, y: 0, k: 0.4 };
  var anim = null;
  function apply() { world.setAttribute("transform", "translate(" + cam.x.toFixed(1) + "," + cam.y.toFixed(1) + ") scale(" + cam.k.toFixed(4) + ")"); }
  function viewSize() {
    var r = svg.getBoundingClientRect();
    var panel = document.getElementById("o-panel");
    var w = r.width, h = r.height;
    if (!panel.hidden) {
      if (window.innerWidth > 820) w -= panel.offsetWidth; else h -= panel.offsetHeight;
    }
    return { w: w, h: h, top: 48 };
  }
  function animateTo(t) {
    if (anim) cancelAnimationFrame(anim);
    if (V.reducedMotion) { cam = t; apply(); return; }
    var from = Object.assign({}, cam), t0 = performance.now(), dur = 300;
    (function step(now) {
      var p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      cam = { x: from.x + (t.x - from.x) * e, y: from.y + (t.y - from.y) * e, k: from.k + (t.k - from.k) * e };
      apply();
      if (p < 1) anim = requestAnimationFrame(step); else anim = null;
    })(t0);
  }
  function centerOn(x, y, k, instant) {
    var vs = viewSize();
    var t = { k: k, x: vs.w / 2 - x * k, y: vs.top + (vs.h - vs.top) / 2 - y * k };
    if (instant) { cam = t; apply(); } else animateTo(t);
  }
  function clampK(k) { return Math.max(0.15, Math.min(3, k)); }
  function zoomAt(f, sx, sy) {
    var k = clampK(cam.k * f);
    var wx = (sx - cam.x) / cam.k, wy = (sy - cam.y) / cam.k;
    cam = { k: k, x: sx - wx * k, y: sy - wy * k };
    apply();
  }
  function visibleBounds() {
    var xs = [], ys = [];
    G.chain.rings.concat([G.chain.tipStart, G.chain.tipEnd]).forEach(function (p) { xs.push(p[0]); ys.push(p[1]); });
    list.forEach(function (n) {
      if (!visible(n.id)) return;
      var r = radius(n);
      xs.push(n.x - r, n.x + r); ys.push(n.y - r, n.y + r);
    });
    return { x0: Math.min.apply(null, xs), x1: Math.max.apply(null, xs), y0: Math.min.apply(null, ys), y1: Math.max.apply(null, ys) };
  }
  function overview(instant) {
    var b = visibleBounds(), vs = viewSize(), pad = 60;
    var k = clampK(Math.min((vs.w - pad * 2) / (b.x1 - b.x0), (vs.h - vs.top - pad * 2) / (b.y1 - b.y0)));
    centerOn((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2, k, instant);
  }
  function focusNode(id, instant) {
    var n = nodes[id];
    var k = Math.max(cam.k, window.innerWidth > 820 ? 0.85 : 0.7);
    if (n.isChain) k = viewSize().h / 1500;
    centerOn(n.x, n.y, clampK(k), instant);
  }
  function entryView() {
    var vs = viewSize();
    centerOn(chainMid[0] + 60, chainMid[1], clampK(vs.h / 1250), true);
  }

  /* Pointer: drag to pan, wheel to zoom, two-finger pinch. */
  var pointers = new Map(), drag = null, moved = false, pinch = null;
  svg.addEventListener("pointerdown", function (e) {
    svg.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    moved = false;
    if (pointers.size === 1) drag = { x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y, target: e.target };
    if (pointers.size === 2) {
      var p = Array.from(pointers.values());
      pinch = { d: Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y), k: cam.k };
      drag = null;
    }
  });
  svg.addEventListener("pointermove", function (e) {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch && pointers.size === 2) {
      var p = Array.from(pointers.values());
      var d = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
      var mx = (p[0].x + p[1].x) / 2, my = (p[0].y + p[1].y) / 2;
      zoomAt(clampK(pinch.k * d / pinch.d) / cam.k, mx, my);
      moved = true;
      return;
    }
    if (!drag) return;
    var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!moved && Math.hypot(dx, dy) < 6) return;
    moved = true;
    map.classList.add("is-dragging");
    if (anim) { cancelAnimationFrame(anim); anim = null; }
    cam.x = drag.cx + dx; cam.y = drag.cy + dy;
    apply();
  });
  function endPointer(e) {
    var wasDrag = drag;
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinch = null;
    map.classList.remove("is-dragging");
    if (e.type === "pointerup" && wasDrag && !moved) {
      var g = wasDrag.target.closest && wasDrag.target.closest("[data-id]");
      if (g) select(g.getAttribute("data-id"), { push: true, focusCam: false });
    }
    if (pointers.size === 0) drag = null;
  }
  svg.addEventListener("pointerup", endPointer);
  svg.addEventListener("pointercancel", endPointer);
  svg.addEventListener("wheel", function (e) {
    e.preventDefault();
    var r = svg.getBoundingClientRect();
    zoomAt(Math.exp(-e.deltaY * 0.0015), e.clientX - r.left, e.clientY - r.top);
  }, { passive: false });

  svg.addEventListener("keydown", function (e) {
    var g = e.target.closest && e.target.closest("[data-id]");
    if (g && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      select(g.getAttribute("data-id"), { push: true, focusCam: true });
      return;
    }
    var step = 80, vs = viewSize();
    if (e.key === "ArrowLeft") cam.x += step;
    else if (e.key === "ArrowRight") cam.x -= step;
    else if (e.key === "ArrowUp") cam.y += step;
    else if (e.key === "ArrowDown") cam.y -= step;
    else if (e.key === "+" || e.key === "=") { zoomAt(1.25, vs.w / 2, vs.h / 2); e.preventDefault(); return; }
    else if (e.key === "-" || e.key === "_") { zoomAt(0.8, vs.w / 2, vs.h / 2); e.preventDefault(); return; }
    else return;
    e.preventDefault();
    apply();
  });
  /* Keep a keyboard-focused node in view. */
  svg.addEventListener("focusin", function (e) {
    var g = e.target.closest && e.target.closest("[data-id]");
    if (!g || g.id === "n-chain") return;
    var n = nodes[g.getAttribute("data-id")], vs = viewSize();
    var sx = n.x * cam.k + cam.x, sy = n.y * cam.k + cam.y;
    if (sx < 40 || sx > vs.w - 40 || sy < vs.top + 20 || sy > vs.h - 40) centerOn(n.x, n.y, cam.k);
  });

  document.getElementById("o-zoom-in").addEventListener("click", function () { var vs = viewSize(); zoomAt(1.35, vs.w / 2, vs.top + (vs.h - vs.top) / 2); });
  document.getElementById("o-zoom-out").addEventListener("click", function () { var vs = viewSize(); zoomAt(1 / 1.35, vs.w / 2, vs.top + (vs.h - vs.top) / 2); });
  document.getElementById("o-overview").addEventListener("click", function () { overview(false); });

  /* ---------------------------------------------------------------- panel */
  var panel = document.getElementById("o-panel");
  var body = document.getElementById("o-panel-body");
  var live = document.getElementById("o-live");
  var shownPiece = null;

  function miniSvg(n, cls) {
    if (n.isChain) {
      return '<svg class="' + (cls || "") + ' o-art" viewBox="1180 140 760 2140" aria-hidden="true">' +
        V.drawChain(G.chain.rings, G.chain.ringRadius, G.chain.tipStart, G.chain.tipEnd, false) + "</svg>";
    }
    return '<svg class="' + (cls || "") + ' o-art" viewBox="-60 -60 120 120" aria-hidden="true">' + shapeMarkup(Object.assign({}, n, { s: 1 })) + "</svg>";
  }

  function renderPanel(id, pieceId) {
    var n = nodes[id];
    var link = linkByNode[id];
    var piece = pieceId ? V.product(pieceId) : (link ? V.product(link.piece) : null);
    shownPiece = piece ? piece.id : null;
    var h = '<div class="o-panel__head"><span class="mono">' + n.ref + '</span><button type="button" class="tbtn" id="o-close">Close</button></div>';
    if (piece) {
      h += '<figure class="o-photo">' + V.img(piece.stageImage, { variant: "stage", sizes: "360px", eager: true }) + "</figure>" +
        '<span class="mono">' + piece.number + '</span><h2 id="o-panel-title" tabindex="-1">[Product name]</h2>' +
        '<p><span class="o-confirm">[Connection to confirm]</span></p>' +
        '<p><a class="tbtn tbtn--line" href="product.html?id=' + piece.id + '">View piece</a></p>';
    } else {
      h += '<div class="o-drawing">' + miniSvg(n) + "</div>" +
        '<h2 id="o-panel-title" tabindex="-1">[Heading]</h2><p>[Text]</p>';
    }
    h += '<div class="o-actions"><button type="button" class="tbtn tbtn--line" data-view="study">Study</button>' +
      '<button type="button" class="tbtn tbtn--line" data-view="family">Family</button></div>';

    var rel = "";
    if (n.parent) rel += '<div class="o-rel"><h3>From</h3><ul><li><button type="button" class="tbtn" data-go="' + n.parent + '">' + nodes[n.parent].ref + "</button></li></ul></div>";
    if (n.children.length) {
      rel += '<div class="o-rel"><h3>Attached</h3><ul>' + n.children.map(function (c) {
        return '<li><button type="button" class="tbtn" data-go="' + c + '">' + nodes[c].ref + "</button></li>";
      }).join("") + "</ul></div>";
    }
    h += rel + '<div class="o-panel__foot">' + V.emailForm("origin") + "</div>";
    body.innerHTML = h;
    panel.hidden = false;
  }

  function closePanel(push) {
    if (panel.hidden) return;
    var prev = selected;
    panel.hidden = true;
    selected = null;
    shownPiece = null;
    refresh();
    if (push) history.pushState({ origin: true }, "", "origin.html" + entrySuffix());
    var el = prev && document.getElementById("n-" + prev);
    if (el && !el.classList.contains("is-hidden")) el.focus({ preventScroll: true });
    else svg.focus({ preventScroll: true });
  }

  panel.addEventListener("click", function (e) {
    var t = e.target.closest("button");
    if (!t) return;
    if (t.id === "o-close") { closePanel(true); return; }
    if (t.hasAttribute("data-go")) { select(t.getAttribute("data-go"), { push: true, focusCam: true, keepFocusInPanel: true }); return; }
    if (t.hasAttribute("data-view")) { openView(t.getAttribute("data-view"), true, t); }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !panel.hidden && !document.querySelector("dialog[open]")) { e.preventDefault(); closePanel(true); }
  });

  function entrySuffix() { return ""; }

  function urlFor(id, pieceId, view) {
    var q = new URLSearchParams();
    if (id) q.set("node", id);
    if (pieceId) q.set("piece", pieceId);
    if (view) q.set("view", view);
    var s = q.toString();
    return "origin.html" + (s ? "?" + s : "");
  }

  function select(id, o) {
    o = o || {};
    if (!nodes[id]) return;
    var added = expandPath(id);
    var link = linkByNode[id];
    var pieceId = o.piece || (link ? link.piece : null);
    var same = selected === id && !panel.hidden && shownPiece === pieceId;
    selected = id;
    persist();
    if (!same) renderPanel(id, pieceId);
    refresh(added);
    if (o.push) history.pushState({ origin: true }, "", urlFor(id, pieceId));
    if (o.focusCam !== false && !same) focusNode(id, o.instant);
    if (added.length) live.textContent = "Form " + nodes[id].ref + ": " + added.length + " attached forms revealed.";
    else live.textContent = "Form " + nodes[id].ref + " selected.";
    if (o.keepFocusInPanel || o.push) {
      var title = document.getElementById("o-panel-title");
      if (o.keepFocusInPanel && title) title.focus({ preventScroll: true });
    }
  }

  /* ---------------------------------------------------------------- study and family views */
  var study = document.getElementById("o-study");
  var family = document.getElementById("o-family");
  var listDlg = document.getElementById("o-list");
  var pushedView = false;

  function branchSvg(rootId) {
    /* The node with its visible descendants, framed to their bounds. */
    var ids = [rootId], out = "", xs = [], ys = [];
    for (var i = 0; i < ids.length; i++) nodes[ids[i]].children.forEach(function (c) { if (visible(c)) ids.push(c); });
    ids.forEach(function (id) {
      var n = nodes[id], r = radius(n);
      xs.push(n.x - r, n.x + r); ys.push(n.y - r, n.y + r);
      if (id !== rootId && !n.noLine) out += '<path class="o-conn" d="' + connectorD(n) + '"/>';
    });
    ids.forEach(function (id) {
      var n = nodes[id];
      out += '<g transform="translate(' + n.x + "," + n.y + ')">' + (n.frame ? '<circle class="o-frame" r="' + n.frame + '"/>' : "") + shapeMarkup(n) + "</g>";
    });
    var pad = 40, x0 = Math.min.apply(null, xs) - pad, y0 = Math.min.apply(null, ys) - pad;
    var w = Math.max.apply(null, xs) - x0 + pad, h = Math.max.apply(null, ys) - y0 + pad;
    return '<svg class="o-art" viewBox="' + [x0, y0, w, h].map(Math.round).join(" ") + '" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' + out + "</svg>";
  }

  function renderStudy(id) {
    var n = nodes[id];
    var art;
    if (n.isChain) {
      art = '<div class="o-study__art">' + miniSvg(n) + "</div>";
      art += '<div class="o-studies">' + G.studies.map(function (s) {
        return '<svg class="o-art" viewBox="-10 -40 1020 80" aria-hidden="true">' + V.drawStudy(s.link, s.count, s.wave, 1000) + "</svg>";
      }).join("") + "</div>";
      art = "<div>" + art + "</div>";
    } else {
      art = '<div class="o-study__art">' + branchSvg(id) + "</div>";
    }
    study.innerHTML = '<button type="button" class="tbtn dlg__close" data-close>Close</button>' +
      '<h2 id="o-study-title">Study <span class="mono">' + n.ref + "</span></h2>" +
      '<div class="o-study">' + art + '<div><div class="placeholder-box placeholder-box--video">[Video]</div><p style="margin-top:14px">[Text]</p></div></div>';
  }

  function renderFamily(id) {
    var root = id === "chain" ? "chain" : familyRoot(id);
    var ids = [root];
    for (var i = 0; i < ids.length; i++) nodes[ids[i]].children.forEach(function (c) { if (visible(c)) ids.push(c); });
    var cells = "";
    ids.forEach(function (cid) {
      var n = nodes[cid];
      cells += '<li><button type="button" data-go="' + cid + '"><span class="cell-art">' + miniSvg(n) + '</span><span class="cell-meta">' + n.ref + "</span></button></li>";
      var l = linkByNode[cid];
      if (l) {
        var p = V.product(l.piece);
        p.images.forEach(function (key) {
          cells += '<li><button type="button" data-go="' + cid + '"><span class="cell-photo"><img src="' + V.src(key, 800, V.images[key].stage ? "stage" : null) + '" alt="' + V.esc(V.images[key].alt) + '" loading="lazy"></span>' +
            '<span class="cell-meta">' + n.ref + " / " + p.number + " [Connection to confirm]</span></button></li>";
        });
      }
    });
    family.innerHTML = '<button type="button" class="tbtn dlg__close" data-close>Close</button>' +
      '<h2 id="o-family-title">Family <span class="mono">' + nodes[root].ref + "</span></h2>" +
      '<ul class="o-sheet">' + cells + "</ul>";
  }

  function openView(view, push, opener) {
    if (!selected) return;
    var dlg = view === "study" ? study : family;
    if (view === "study") renderStudy(selected); else renderFamily(selected);
    if (push) { history.pushState({ origin: true, view: view }, "", urlFor(selected, shownPiece, view)); pushedView = true; }
    V.openDialog(dlg, opener || panel.querySelector('[data-view="' + view + '"]'));
    dlg.querySelector("[data-close]").focus();
  }

  [study, family].forEach(function (dlg) {
    dlg.addEventListener("click", function (e) {
      var t = e.target.closest("button");
      if (!t) return;
      if (t.hasAttribute("data-close")) { dlg.close(); return; }
      if (t.hasAttribute("data-go")) {
        var go = t.getAttribute("data-go");
        dlg._opener = null;
        dlg.close();
        select(go, { push: true, focusCam: true, keepFocusInPanel: true });
      }
    });
    dlg._onclose = function () {
      if (new URLSearchParams(location.search).get("view")) {
        if (pushedView) { pushedView = false; history.back(); }
        else history.replaceState({ origin: true }, "", urlFor(selected, shownPiece));
      }
    };
  });

  /* Accessible list of discovered forms. */
  function renderList() {
    function li(id) {
      var n = nodes[id];
      var kids = n.children.filter(visible);
      return '<li><button type="button" data-go="' + id + '"' + (selected === id ? ' aria-current="true"' : "") + ">" +
        (n.isChain ? "Chain " : "Form ") + n.ref + (linkByNode[id] ? " / item " + V.product(linkByNode[id].piece).number : "") +
        (n.children.length && !expanded.has(id) ? " +" : "") + "</button>" +
        (kids.length ? "<ul>" + kids.map(li).join("") + "</ul>" : "") + "</li>";
    }
    listDlg.innerHTML = '<button type="button" class="tbtn dlg__close" data-close>Close</button>' +
      '<h2 id="o-list-title">Index of forms</h2><ul>' + li("chain") + "</ul>";
  }
  document.getElementById("o-list-btn").addEventListener("click", function (e) {
    renderList();
    V.openDialog(listDlg, e.currentTarget);
    listDlg.querySelector("[data-close]").focus();
  });
  listDlg.addEventListener("click", function (e) {
    var t = e.target.closest("button");
    if (!t) return;
    if (t.hasAttribute("data-close")) { listDlg.close(); return; }
    if (t.hasAttribute("data-go")) {
      listDlg._opener = null;
      listDlg.close();
      select(t.getAttribute("data-go"), { push: true, focusCam: true, keepFocusInPanel: true });
    }
  });

  /* ---------------------------------------------------------------- URL state */
  function applyState(initial) {
    var q = new URLSearchParams(location.search);
    var id = q.get("node"), piece = q.get("piece"), view = q.get("view");
    if (piece && !V.product(piece)) piece = null;
    if (id && nodes[id]) {
      select(id, { push: false, piece: piece, instant: initial, focusCam: true });
      if (view === "study" || view === "family") {
        var dlg = view === "study" ? study : family;
        if (!dlg.open) { pushedView = false; openView(view, false); }
      } else {
        [study, family].forEach(function (d) { if (d.open) { d._opener = null; d.close(); } });
      }
    } else {
      [study, family].forEach(function (d) { if (d.open) { d._opener = null; d.close(); } });
      if (!panel.hidden) { panel.hidden = true; selected = null; refresh(); }
      if (initial) entryView();
    }
  }
  window.addEventListener("popstate", function () { pushedView = false; applyState(false); });

  /* Return path out of the hidden room: the product or FAQ the visitor came from. */
  (function setBack() {
    var back = document.getElementById("o-back");
    var q = new URLSearchParams(location.search);
    var ret = null;
    if (q.get("piece") && V.product(q.get("piece"))) ret = "product.html?id=" + q.get("piece");
    else if (q.get("entry") === "faq") ret = "info.html#faq-origin";
    try {
      if (ret) sessionStorage.setItem("vasili-origin-return", ret);
      else ret = sessionStorage.getItem("vasili-origin-return");
    } catch (e) {}
    back.href = ret || "info.html#faq-origin";
  })();

  /* An ?entry=faq visit starts fresh, near the chain, with only the first level showing. */
  if (new URLSearchParams(location.search).get("entry") === "faq") {
    expanded = new Set(["chain"]);
    persist();
    history.replaceState({ origin: true }, "", "origin.html");
  }

  build();
  refresh();
  applyState(true);
  window.addEventListener("resize", function () { if (!selected) return; focusNode(selected, true); });
})();
