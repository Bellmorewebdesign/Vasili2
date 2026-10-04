/* SVG linework primitives for the origin drawing.
   Each family shape returns markup in a local box of about -50..50, scaled per node.
   The central chain is drawn by VASILI.drawChain from ring centers in canvas units.
   Line classes: .ln (outline, non-scaling), .fl (filled ink with outline), .sh (soft shading). */
(function () {
  "use strict";
  var V = window.VASILI;
  var r1 = function (n) { return Math.round(n * 10) / 10; };
  var pt = function (x, y) { return r1(x) + "," + r1(y); };

  function el(tag, attrs) {
    var s = "<" + tag;
    for (var k in attrs) s += " " + k + '="' + attrs[k] + '"';
    return s + "/>";
  }
  function ell(cx, cy, rx, ry, cls, rot) {
    return el("ellipse", { cx: r1(cx), cy: r1(cy), rx: r1(rx), ry: r1(ry), "class": cls || "ln",
      transform: rot ? "rotate(" + r1(rot) + " " + r1(cx) + " " + r1(cy) + ")" : "" }).replace(' transform=""', "");
  }
  function circ(cx, cy, r, cls) { return el("circle", { cx: r1(cx), cy: r1(cy), r: r1(r), "class": cls || "ln" }); }
  function path(d, cls) { return el("path", { d: d, "class": cls || "ln" }); }
  function poly(pts, cls) { return path("M" + pts.map(function (p) { return pt(p[0], p[1]); }).join("L") + "Z", cls); }

  /* Deterministic jitter so the drawing is identical on every load. */
  function jit(i, amt) { var x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return (x - Math.floor(x) - 0.5) * 2 * amt; }

  /* Small chain links placed around an ellipse, alternating face-on and edge-on. */
  function linksOn(rx, ry, n, size, opts) {
    opts = opts || {};
    var out = "";
    for (var i = 0; i < n; i++) {
      var a = (i / n) * Math.PI * 2;
      var jr = opts.jitter ? 1 + jit(i, opts.jitter) : 1;
      var x = Math.cos(a) * rx * jr, y = Math.sin(a) * ry * jr;
      var tx = -Math.sin(a) * rx, ty = Math.cos(a) * ry;
      var rot = Math.atan2(ty, tx) * 180 / Math.PI;
      if (opts.beads) out += circ(x, y, size * (i % 2 ? 0.75 : 1), "fl");
      else out += ell(x, y, size * 1.25, size * (i % 2 ? 0.45 : 0.8), "fl", rot);
    }
    return out;
  }
  function linksAlong(p0, p1, p2, n, size) {
    var out = "";
    for (var i = 0; i <= n; i++) {
      var t = i / n, u = 1 - t;
      var x = u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0];
      var y = u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1];
      var dx = 2 * u * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]);
      var dy = 2 * u * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]);
      out += ell(x, y, size * 1.2, size * (i % 2 ? 0.45 : 0.75), "fl", Math.atan2(dy, dx) * 180 / Math.PI);
    }
    return out;
  }

  /* Central chain: thorned ring links joined by double-cone spindles, with end spikes. */
  V.drawChain = function (rings, R, tipStart, tipEnd, mini) {
    var parts = { thorn: "", spindle: "", ring: "", inner: "" };
    var sw = mini ? "ln" : "ink";
    function unit(a, b) { var dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; }
    function P(c, t, u, v) { var n = [-t[1], t[0]]; return [c[0] + t[0] * u + n[0] * v, c[1] + t[1] * u + n[1] * v]; }
    function spike(base, d, L) {
      var tip = [base[0] + d[0] * L, base[1] + d[1] * L];
      var a = P(base, d, 0, 0.25 * R), b = P(base, d, 0.42 * L, 0.42 * R), e = P(base, d, 0.42 * L, -0.42 * R), f = P(base, d, 0, -0.25 * R);
      parts.spindle += poly([a, b, tip, e, f], sw + " fl");
      parts.spindle += poly([a, b, tip, base], "sh");
      parts.spindle += path("M" + pt(base[0], base[1]) + "L" + pt(tip[0], tip[1]), mini ? "ln" : "ink-thin");
    }
    rings.forEach(function (c, i) {
      var prev = rings[i - 1] || tipStart, next = rings[i + 1] || tipEnd;
      var t = unit(prev, next);
      [1, -1].forEach(function (sg) {
        var q = function (u, v) { return P(c, t, u * R, v * R * sg); };
        var d = "M" + pt.apply(null, q(-0.98, 0.18)) +
          "C" + pt.apply(null, q(-0.94, 0.92)) + " " + pt.apply(null, q(-0.14, 0.92)) + " " + pt.apply(null, q(0, 1.78)) +
          "C" + pt.apply(null, q(0.14, 0.92)) + " " + pt.apply(null, q(0.94, 0.92)) + " " + pt.apply(null, q(0.98, 0.18)) + "Z";
        parts.thorn += path(d, sw + " fl");
        if (!mini) {
          parts.thorn += poly([q(-0.62, 0.66), q(0, 1.72), q(0, 0.72)], "sh");
          parts.thorn += path("M" + pt.apply(null, q(0, 1.72)) + "L" + pt.apply(null, q(0, 0.98)), "ink-thin");
        }
      });
      parts.ring += path("M" + pt(c[0] + R, c[1]) + "a" + R + "," + R + " 0 1,0 " + (-2 * R) + ",0a" + R + "," + R + " 0 1,0 " + (2 * R) + ",0Z" +
        "M" + pt(c[0] + 0.66 * R, c[1]) + "a" + r1(0.66 * R) + "," + r1(0.66 * R) + " 0 1,1 " + r1(-1.32 * R) + ",0a" + r1(0.66 * R) + "," + r1(0.66 * R) + " 0 1,1 " + r1(1.32 * R) + ",0Z",
        sw + " fl ring");
      if (!mini) {
        [1, -1].forEach(function (sg) {
          var q = function (u, v) { return P(c, t, u * R * sg, v * R); };
          parts.inner += poly([q(-0.64, -0.28), q(-0.64, 0.28), q(-0.14, 0)], "ink-thin fl");
        });
      }
      if (i < rings.length - 1) {
        var d2 = unit(c, next), A = P(c, d2, 0.9 * R, 0), B = P(next, d2, -0.9 * R, 0);
        var L = Math.hypot(B[0] - A[0], B[1] - A[1]), M = P(A, d2, L / 2, 0);
        var pA1 = P(A, d2, 0, 0.2 * R), pM1 = P(M, d2, 0, 0.42 * R), pB1 = P(B, d2, 0, 0.2 * R);
        var pB2 = P(B, d2, 0, -0.2 * R), pM2 = P(M, d2, 0, -0.42 * R), pA2 = P(A, d2, 0, -0.2 * R);
        parts.spindle += poly([pA1, pM1, pB1, pB2, pM2, pA2], sw + " fl");
        if (!mini) {
          parts.spindle += poly([pA1, pM1, M, A], "sh");
          parts.spindle += poly([pB2, pM2, M, B], "sh");
          parts.spindle += path("M" + pt(pM1[0], pM1[1]) + "L" + pt(pM2[0], pM2[1]) + "M" + pt(A[0], A[1]) + "L" + pt(B[0], B[1]), "ink-thin");
        }
      }
    });
    var d0 = unit(rings[0], tipStart), dn = unit(rings[rings.length - 1], tipEnd);
    spike(P(rings[0], d0, 0.9 * R, 0), d0, Math.hypot(tipStart[0] - rings[0][0], tipStart[1] - rings[0][1]) - 0.9 * R);
    spike(P(rings[rings.length - 1], dn, 0.9 * R, 0), dn, Math.hypot(tipEnd[0] - rings[rings.length - 1][0], tipEnd[1] - rings[rings.length - 1][1]) - 0.9 * R);
    return parts.thorn + parts.spindle + parts.ring + parts.inner;
  };

  /* Straight chain studies after references 01, 07 and 08. */
  V.drawStudy = function (kind, count, wave, width) {
    var out = "", step = width / count;
    for (var i = 0; i < count; i++) {
      var x = i * step + step / 2, y = wave ? Math.sin(i / count * Math.PI * 2.2) * step * 0.6 : 0;
      if (kind === "thornEye") {
        out += ell(x, y, step * 0.28, step * 0.22, "fl");
        out += poly([[x - step * 0.08, y - step * 0.2], [x, y - step * 0.42], [x + step * 0.08, y - step * 0.2]], "fl");
        out += poly([[x - step * 0.08, y + step * 0.2], [x, y + step * 0.42], [x + step * 0.08, y + step * 0.2]], "fl");
        out += path("M" + pt(x + step * 0.28, y) + "L" + pt(x + step * 0.72, y), "ln");
      } else {
        out += circ(x, y, step * 0.52, "ln") + circ(x, y, step * 0.4, "ln");
        out += poly([[x - step * 0.07, y - step * 0.5], [x, y - step * 0.72], [x + step * 0.07, y - step * 0.5]], "fl");
        out += poly([[x - step * 0.07, y + step * 0.5], [x, y + step * 0.72], [x + step * 0.07, y + step * 0.5]], "fl");
      }
    }
    return out;
  };

  function cBand(ro, ri, ry, a0, a1) {
    var f = Math.PI / 180, k = ry;
    var o0 = [ro * Math.cos(a0 * f), ro * k * Math.sin(a0 * f)], o1 = [ro * Math.cos(a1 * f), ro * k * Math.sin(a1 * f)];
    var i0 = [ri * Math.cos(a0 * f), ri * k * Math.sin(a0 * f)], i1 = [ri * Math.cos(a1 * f), ri * k * Math.sin(a1 * f)];
    return "M" + pt(o0[0], o0[1]) + "A" + ro + "," + r1(ro * k) + " 0 1,1 " + pt(o1[0], o1[1]) +
      "L" + pt(i1[0], i1[1]) + "A" + ri + "," + r1(ri * k) + " 0 1,0 " + pt(i0[0], i0[1]) + "Z";
  }
  function starPath(n, ro, ri, rot) {
    var pts = [];
    for (var i = 0; i < n * 2; i++) {
      var a = (i / (n * 2)) * Math.PI * 2 + (rot || -Math.PI / 2), r = i % 2 ? ri : ro;
      pts.push([Math.cos(a) * r, Math.sin(a) * r]);
    }
    return pts;
  }
  function heartD(s) {
    return "M0," + r1(22 * s) + "C" + pt(-32 * s, 2 * s) + " " + pt(-26 * s, -26 * s) + " 0," + r1(-10 * s) +
      "C" + pt(26 * s, -26 * s) + " " + pt(32 * s, 2 * s) + " 0," + r1(22 * s) + "Z";
  }
  function crossArms(lens, w, tip) {
    /* Cross with flared or pointed arm ends; lens = [top, right, bottom, left]. */
    var out = "";
    lens.forEach(function (L, k) {
      var a = k * 90;
      var arm = tip === "point"
        ? [[-w, -w], [-w, -L + 9], [-w - 5, -L + 7], [0, -L - 3], [w + 5, -L + 7], [w, -L + 9], [w, -w]]
        : [[-w * 0.7, -w], [-w - 5, -L], [w + 5, -L], [w * 0.7, -w]];
      out += '<g transform="rotate(' + a + ')">' + poly(arm, "fl") + "</g>";
    });
    return out + circ(0, 0, w + 1, "fl");
  }

  var S = {};
  S.studHoop = function () { return ell(0, 0, 40, 13, "fl") + ell(0, -1, 33, 8) + path("M0,-12L0,-32") + circ(0, -35, 3, "fl"); };
  S.studPin = function () { return ell(0, 6, 18, 10, "fl") + ell(0, 6, 10, 5) + path("M0,4L0,-26") + circ(0, -28, 3, "fl"); };
  S.studRing = function () { return ell(0, 0, 21, 13, "fl") + ell(0, -1, 13, 7); };
  S.studDrop = function () { return ell(0, 6, 18, 11, "fl") + ell(0, 6, 10, 5) + path("M-8,0Q0,-34 8,0", "fl"); };
  S.studThorn = function () { return poly(starPath(4, 26, 7), "fl") + circ(0, 0, 5); };
  S.hoop = function () { return path("M-44,4A44,16 0 0,0 44,4", "ln") + ell(0, 0, 44, 16, "fl") + ell(0, 0, 37, 11); };
  S.hoopFlat = function () { return path("M-38,4A38,12 0 0,0 38,4", "ln") + ell(0, 0, 38, 12, "fl") + ell(0, 0, 31, 7); };
  S.leafHoop = function () { return path("M-28,0Q0,-22 28,0Q0,22 -28,0Z", "fl") + path("M-19,0Q0,-11 19,0Q0,11 -19,0Z"); };
  S.cuff = function () { return path(cBand(36, 29, 0.55, 40, 320), "fl"); };
  S.curbArc = function () { return linksAlong([-6, -40], [-46, -4], [-10, 40], 20, 3.2) + circ(-6, -42, 3.5) + circ(-10, 42, 3.5); };
  S.ringPlain = function () { return circ(0, 0, 30, "fl") + circ(0, 0, 24); };
  S.ringKnobs3 = function () {
    var o = S.ringPlain();
    [-90, 30, 150].forEach(function (a) { var f = a * Math.PI / 180; o += circ(Math.cos(f) * 27, Math.sin(f) * 27, 5.5, "fl"); });
    return o;
  };
  S.ringKnobs6 = function () {
    var o = S.ringPlain();
    for (var i = 0; i < 6; i++) { var f = (i * 60 - 90) * Math.PI / 180; o += circ(Math.cos(f) * 27, Math.sin(f) * 27, 5, "fl"); }
    return o;
  };
  S.ringOpen = function () { return path(cBand(30, 24, 1, 35, 325), "fl") + circ(24.6, 17.2, 4, "fl") + circ(24.6, -17.2, 4, "fl"); };
  S.ringOpenSpike = function () { return path(cBand(34, 27, 1, 40, 330), "fl") + poly([[26, 21.8], [20.7, 17.4], [36, 2]], "fl"); };
  S.chainSeg = function () {
    return '<g class="mini">' + V.drawChain([[-24, 6], [0, -5], [24, 6]], 9, [-46, 18], [46, 18], true) + "</g>";
  };
  S.chainOpen = function () {
    return '<g class="mini">' + V.drawChain([[-26, -16], [-2, -4]], 9, [-44, -30], [14, 6], true) + "</g>" +
      path("M14,6Q34,10 30,30Q26,42 12,36") + circ(12, 36, 4, "fl");
  };
  S.thornRing = function () {
    var o = "";
    for (var i = 0; i < 10; i++) {
      var a = (i / 10) * Math.PI * 2, x = Math.cos(a) * 32, y = Math.sin(a) * 32;
      o += circ(x, y, 9, "fl") + circ(x, y, 5.5);
      var b = a + Math.PI / 10, xo = Math.cos(b) * 34, yo = Math.sin(b) * 34;
      o += poly([[Math.cos(b - 0.08) * 31, Math.sin(b - 0.08) * 31], [Math.cos(b) * 46, Math.sin(b) * 46], [Math.cos(b + 0.08) * 31, Math.sin(b + 0.08) * 31]], "fl");
      o += poly([[xo * 0.94 + Math.cos(b - 1.6) * 3, yo * 0.94 + Math.sin(b - 1.6) * 3], [Math.cos(b) * 22, Math.sin(b) * 22], [xo * 0.94 + Math.cos(b + 1.6) * 3, yo * 0.94 + Math.sin(b + 1.6) * 3]], "fl");
    }
    return o;
  };
  S.braceletThorn = function () {
    var o = "";
    for (var i = 0; i < 10; i++) {
      var a = (i / 10) * Math.PI * 2, x = Math.cos(a) * 30, y = Math.sin(a) * 30, rot = a * 180 / Math.PI + 90;
      o += '<g transform="translate(' + pt(x, y) + ") rotate(" + r1(rot) + ') scale(.32)">' + S.leafHoop() + "</g>";
      var b = a + Math.PI / 10;
      o += poly([[Math.cos(b) * 28, Math.sin(b) * 28], [Math.cos(b) * 39, Math.sin(b) * 39], [Math.cos(b + 0.06) * 30, Math.sin(b + 0.06) * 30]], "fl");
    }
    return o;
  };
  S.braceletBead = function () { return linksOn(30, 30, 18, 3.6, { beads: true }); };
  S.braceletChain = function () { return linksOn(30, 30, 14, 6); };
  S.braceletRough = function () { return linksOn(30, 27, 16, 4.6, { jitter: 0.12 }); };
  S.braceletTwist = function () {
    var a = "", b = "";
    for (var i = 0; i <= 96; i++) {
      var t = (i / 96) * Math.PI * 2, w = Math.sin(t * 12) * 3.5;
      a += (i ? "L" : "M") + pt(Math.cos(t) * (30 + w), Math.sin(t) * (30 + w));
      b += (i ? "L" : "M") + pt(Math.cos(t) * (30 - w), Math.sin(t) * (30 - w));
    }
    return path(a) + path(b);
  };
  S.gCurl = function () {
    var o = "";
    for (var i = 0; i < 26; i++) {
      var t = i / 25, a = -0.3 + t * Math.PI * 1.75, r = 32 - t * 18;
      o += circ(Math.cos(a) * r, Math.sin(a) * r, 3.6 - t * 1.2, "fl");
    }
    return o;
  };
  S.necklaceOval = function () { return linksOn(22, 42, 30, 3.3); };
  S.necklaceLong = function () { return linksOn(15, 46, 32, 3); };
  S.necklaceRough = function () { return linksOn(22, 42, 30, 3.4, { jitter: 0.09 }); };
  S.star6 = function () { return poly(starPath(6, 28, 15), "fl") + poly(starPath(6, 17, 9)); };
  S.flower5 = function () {
    var o = "";
    for (var i = 0; i < 5; i++) {
      var a = i * 72 - 90, f = a * Math.PI / 180;
      o += ell(Math.cos(f) * 14, Math.sin(f) * 14, 15, 8, "fl", a);
    }
    return o + circ(0, 0, 6, "fl");
  };
  S.knot = function () { return ell(-9, 0, 19, 11, "fl", 28) + ell(9, 0, 19, 11, "fl", -28) + ell(-9, 0, 11, 5, "ln", 28) + ell(9, 0, 11, 5, "ln", -28); };
  S.heart = function () { return path(heartD(1), "fl") + path(heartD(0.62)); };
  S.heartCurl = function () { return path(heartD(1), "fl") + path("M-2,8C-14,0 -12,-12 -2,-6C6,-2 4,8 -4,4"); };
  S.crossA = function () { return crossArms([28, 28, 28, 28], 6, "flare"); };
  S.crossB = function () { return crossArms([28, 26, 34, 26], 4.5, "point"); };
  S.crossC = function () { return crossArms([26, 24, 38, 24], 5, "flare"); };
  S.pendant = function (o) {
    var charm = S[o.charm] ? S[o.charm](o) : "";
    return linksAlong([-5, -10], [-18, 14], [-32, 42], 9, 2.4) + linksAlong([5, -10], [18, 14], [32, 42], 9, 2.4) +
      '<g transform="translate(0,-24) scale(.5)">' + charm + "</g>";
  };
  S.swag = function (o) {
    var charm = S[o.charm] ? S[o.charm](o) : "";
    return linksAlong([-40, 34], [-20, -18], [0, -14], 8, 2.4) + linksAlong([0, -14], [20, -18], [40, 34], 8, 2.4) +
      '<g transform="translate(0,-20) scale(.42)">' + charm + "</g>";
  };
  S.fig8 = function () { return circ(0, -14, 17, "fl") + circ(0, 14, 17, "fl") + circ(0, -14, 11) + circ(0, 14, 11) + path("M-8,0L8,0"); };
  S.fig8Twist = function () { return '<g transform="rotate(35)">' + S.fig8() + "</g>" + path("M-14,10Q0,-6 14,-10"); };
  S.bow = function () { return ell(-15, 0, 15, 10, "fl", 18) + ell(15, 0, 15, 10, "fl", -18) + ell(-15, 0, 8, 4, "ln", 18) + ell(15, 0, 8, 4, "ln", -18) + circ(0, 0, 5, "fl"); };
  S.fig8Knot = function () { return '<g transform="rotate(-20)">' + S.fig8() + "</g>" + path("M-16,-4Q0,10 16,4"); };

  V.originShapes = S;
})();
