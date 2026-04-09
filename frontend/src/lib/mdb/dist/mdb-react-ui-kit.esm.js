(function(){"use strict";try{if(typeof document!="undefined"){var e=document.createElement("style");e.appendChild(document.createTextNode("")),document.head.appendChild(e)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}})();
import { jsx as a, jsxs as j, Fragment as we } from "react/jsx-runtime";
import se, { useState as N, useEffect as D, useRef as Z, useCallback as X, useMemo as Fe, useImperativeHandle as Dt, forwardRef as Tt, createContext as hn, useContext as Ye, Children as vs, cloneElement as lr, useId as ir } from "react";
import x from "clsx";
import { usePopper as kt } from "react-popper";
import ar, { createPortal as bs } from "react-dom";
import { flip as gs } from "@popperjs/core";
import { motion as vt, AnimatePresence as At } from "framer-motion";
import ur from "chartjs-plugin-datalabels";
import { Chart as ys, registerables as dr } from "chart.js";
import { Scatter as fr, Bubble as mr, Radar as hr, PolarArea as pr, Doughnut as vr, Pie as br, Line as gr, Bar as yr } from "react-chartjs-2";
import An from "deepmerge";
const wr = se.forwardRef(
  ({ breakpoint: e, fluid: t, children: n, className: s, tag: r = "div", ...o }, c) => {
    const l = x(`${t ? "container-fluid" : `container${e ? "-" + e : ""}`}`, s);
    return /* @__PURE__ */ a(r, { className: l, ...o, ref: c, children: n });
  }
);
wr.displayName = "MDBContainer";
const Nr = se.forwardRef(
  ({
    center: e,
    children: t,
    className: n,
    end: s,
    lg: r,
    md: o,
    offsetLg: c,
    offsetMd: l,
    offsetSm: i,
    order: d,
    size: u,
    sm: m,
    start: f,
    tag: p = "div",
    xl: g,
    xxl: b,
    xs: h,
    ...y
  }, v) => {
    const k = x(
      u && `col-${u}`,
      h && `col-xs-${h}`,
      m && `col-sm-${m}`,
      o && `col-md-${o}`,
      r && `col-lg-${r}`,
      g && `col-xl-${g}`,
      b && `col-xxl-${b}`,
      !u && !h && !m && !o && !r && !g && !b ? "col" : "",
      d && `order-${d}`,
      f && "align-self-start",
      e && "align-self-center",
      s && "align-self-end",
      i && `offset-sm-${i}`,
      l && `offset-md-${l}`,
      c && `offset-lg-${c}`,
      n
    );
    return /* @__PURE__ */ a(p, { className: k, ref: v, ...y, children: t });
  }
);
Nr.displayName = "MDBCol";
const kr = se.forwardRef(
  ({ className: e, color: t = "primary", pill: n, light: s, dot: r, tag: o = "span", children: c, notification: l, ...i }, d) => {
    const u = x(
      "badge",
      s ? t && `badge-${t}` : t && `bg-${t}`,
      r && "badge-dot",
      n && "rounded-pill",
      l && "badge-notification",
      e
    );
    return /* @__PURE__ */ a(o, { className: u, ref: d, ...i, children: c });
  }
);
kr.displayName = "MDBBadge";
const Mr = ({ ...e }) => {
  const [t, n] = N(!1), s = x("ripple-wave", t && "active");
  return D(() => {
    const r = setTimeout(() => {
      n(!0);
    }, 50);
    return () => {
      clearTimeout(r);
    };
  }, []), /* @__PURE__ */ a("div", { className: s, ...e });
}, xr = (...e) => {
  const t = se.useRef();
  return se.useEffect(() => {
    e.forEach((n) => {
      n && (typeof n == "function" ? n(t.current) : n.current = t.current);
    });
  }, [e]), t;
}, pn = se.forwardRef(
  ({
    className: e,
    rippleTag: t = "div",
    rippleCentered: n,
    rippleDuration: s = 500,
    rippleUnbound: r,
    rippleRadius: o = 0,
    rippleColor: c = "dark",
    children: l,
    onMouseDown: i,
    ...d
  }, u) => {
    const m = Z(null), f = xr(u, m), p = "rgba({{color}}, 0.2) 0, rgba({{color}}, 0.3) 40%, rgba({{color}}, 0.4) 50%, rgba({{color}}, 0.5) 60%, rgba({{color}}, 0) 70%", g = [0, 0, 0], b = ["primary", "secondary", "success", "danger", "warning", "info", "light", "dark"], [h, y] = N([]), [v, k] = N(!1), w = x(
      "ripple",
      "ripple-surface",
      r && "ripple-surface-unbound",
      v && `ripple-surface-${c}`,
      e
    ), S = () => {
      if (b.find((R) => R === (c == null ? void 0 : c.toLowerCase())))
        return k(!0);
      {
        const R = L(c).join(",");
        return `radial-gradient(circle, ${p.split("{{color}}").join(`${R}`)})`;
      }
    }, L = (Y) => {
      const R = (B) => (B.length < 7 && (B = `#${B[1]}${B[1]}${B[2]}${B[2]}${B[3]}${B[3]}`), [parseInt(B.substr(1, 2), 16), parseInt(B.substr(3, 2), 16), parseInt(B.substr(5, 2), 16)]), H = (B) => {
        const U = document.body.appendChild(document.createElement("fictum")), _ = "rgb(1, 2, 3)";
        return U.style.color = _, U.style.color !== _ || (U.style.color = B, U.style.color === _ || U.style.color === "") ? g : (B = getComputedStyle(U).color, document.body.removeChild(U), B);
      }, G = (B) => (B = B.match(/[.\d]+/g).map((U) => +Number(U)), B.length = 3, B);
      return Y.toLowerCase() === "transparent" ? g : Y[0] === "#" ? R(Y) : (Y.indexOf("rgb") === -1 && (Y = H(Y)), Y.indexOf("rgb") === 0 ? G(Y) : g);
    }, E = (Y) => {
      const { offsetX: R, offsetY: H, height: G, width: B } = Y, U = H <= G / 2, _ = R <= B / 2, z = (J, O) => Math.sqrt(J ** 2 + O ** 2), F = H === G / 2 && R === B / 2, V = {
        first: U === !0 && _ === !1,
        second: U === !0 && _ === !0,
        third: U === !1 && _ === !0,
        fourth: U === !1 && _ === !1
      }, C = {
        topLeft: z(R, H),
        topRight: z(B - R, H),
        bottomLeft: z(R, G - H),
        bottomRight: z(B - R, G - H)
      };
      let W = 0;
      return F || V.fourth ? W = C.topLeft : V.third ? W = C.topRight : V.second ? W = C.bottomRight : V.first && (W = C.bottomLeft), W * 2;
    }, M = (Y) => {
      var W;
      const R = (W = f.current) == null ? void 0 : W.getBoundingClientRect(), H = Y.clientX - R.left, G = Y.clientY - R.top, B = R.height, U = R.width, _ = {
        offsetX: n ? B / 2 : H,
        offsetY: n ? U / 2 : G,
        height: B,
        width: U
      }, z = {
        delay: s && s * 0.5,
        duration: s && s - s * 0.5
      }, F = E(_), V = o || F / 2, C = {
        left: n ? `${U / 2 - V}px` : `${H - V}px`,
        top: n ? `${B / 2 - V}px` : `${G - V}px`,
        height: o ? `${o * 2}px` : `${F}px`,
        width: o ? `${o * 2}px` : `${F}px`,
        transitionDelay: `0s, ${z.delay}ms`,
        transitionDuration: `${s}ms, ${z.duration}ms`
      };
      return v ? C : { ...C, backgroundImage: `${S()}` };
    }, q = (Y) => {
      const R = M(Y), H = h.concat(R);
      y(H), i && i(Y);
    };
    return D(() => {
      const Y = setTimeout(() => {
        h.length > 0 && y(h.splice(1, h.length - 1));
      }, s);
      return () => {
        clearTimeout(Y);
      };
    }, [s, h]), /* @__PURE__ */ j(t, { className: w, onMouseDown: (Y) => q(Y), ref: f, ...d, children: [
      l,
      h.map((Y, R) => /* @__PURE__ */ a(Mr, { style: Y }, R))
    ] });
  }
);
pn.displayName = "MDBRipple";
const We = se.forwardRef(
  ({
    className: e,
    color: t = "primary",
    outline: n,
    children: s,
    rounded: r,
    disabled: o,
    floating: c,
    size: l,
    href: i,
    block: d,
    active: u,
    toggle: m,
    noRipple: f,
    tag: p = "button",
    role: g = "button",
    ...b
  }, h) => {
    const [y, v] = N(u || !1);
    let k;
    const w = t && ["light", "link"].includes(t) || n ? "dark" : "light";
    t !== "none" ? n ? t ? k = `btn-outline-${t}` : k = "btn-outline-primary" : t ? k = `btn-${t}` : k = "btn-primary" : k = "";
    const S = x(
      t !== "none" && "btn",
      k,
      r && "btn-rounded",
      c && "btn-floating",
      l && `btn-${l}`,
      `${(i || p !== "button") && o ? "disabled" : ""}`,
      d && "btn-block",
      y && "active",
      e
    );
    return i && p !== "a" && (p = "a"), ["hr", "img", "input"].includes(p) || f ? /* @__PURE__ */ a(
      p,
      {
        className: S,
        onClick: m ? () => {
          v(!y);
        } : void 0,
        disabled: o && p === "button" ? !0 : void 0,
        href: i,
        ref: h,
        role: g,
        ...b,
        children: s
      }
    ) : /* @__PURE__ */ a(
      pn,
      {
        rippleTag: p,
        rippleColor: w,
        className: S,
        onClick: m ? () => {
          v(!y);
        } : void 0,
        disabled: o && p === "button" ? !0 : void 0,
        href: i,
        ref: h,
        role: g,
        ...b,
        children: s
      }
    );
  }
);
We.displayName = "MDBBtn";
const Er = se.forwardRef(
  ({ className: e, children: t, shadow: n, toolbar: s, size: r, vertical: o, tag: c = "div", role: l = "group", ...i }, d) => {
    let u;
    s ? u = "btn-toolbar" : o ? u = "btn-group-vertical" : u = "btn-group";
    const m = x(u, n && `shadow-${n}`, r && `btn-group-${r}`, e);
    return /* @__PURE__ */ a(c, { className: m, ref: d, role: l, ...i, children: t });
  }
);
Er.displayName = "MDBBtnGroup";
const ws = se.forwardRef(
  ({ className: e, children: t, tag: n = "div", color: s, grow: r, size: o, ...c }, l) => {
    const i = x(
      `${r ? "spinner-grow" : "spinner-border"}`,
      s && `text-${s}`,
      `${o ? r ? "spinner-grow-" + o : "spinner-border-" + o : ""}`,
      e
    );
    return /* @__PURE__ */ a(n, { className: i, ref: l, ...c, children: t });
  }
);
ws.displayName = "MDBSpinner";
const Dr = se.forwardRef(
  ({ className: e, children: t, border: n, background: s, tag: r = "div", shadow: o, alignment: c, ...l }, i) => {
    const d = x(
      "card",
      n && `border border-${n}`,
      s && `bg-${s}`,
      o && `shadow-${o}`,
      c && `text-${c}`,
      e
    );
    return /* @__PURE__ */ a(r, { className: d, ref: i, ...l, children: t });
  }
);
Dr.displayName = "MDBCard";
const Tr = se.forwardRef(
  ({ className: e, children: t, border: n, background: s, tag: r = "div", ...o }, c) => {
    const l = x("card-header", n && `border-${n}`, s && `bg-${s}`, e);
    return /* @__PURE__ */ a(r, { className: l, ...o, ref: c, children: t });
  }
);
Tr.displayName = "MDBCardHeader";
const Lr = se.forwardRef(
  ({ className: e, children: t, tag: n = "p", ...s }, r) => {
    const o = x("card-subtitle", e);
    return /* @__PURE__ */ a(n, { className: o, ...s, ref: r, children: t });
  }
);
Lr.displayName = "MDBCardSubTitle";
const Br = se.forwardRef(
  ({ className: e, children: t, tag: n = "h5", ...s }, r) => {
    const o = x("card-title", e);
    return /* @__PURE__ */ a(n, { className: o, ...s, ref: r, children: t });
  }
);
Br.displayName = "MDBCardTitle";
const Sr = se.forwardRef(
  ({ className: e, children: t, tag: n = "p", ...s }, r) => {
    const o = x("card-text", e);
    return /* @__PURE__ */ a(n, { className: o, ...s, ref: r, children: t });
  }
);
Sr.displayName = "MDBCardText";
const Ir = se.forwardRef(
  ({ className: e, children: t, tag: n = "div", ...s }, r) => {
    const o = x("card-body", e);
    return /* @__PURE__ */ a(n, { className: o, ...s, ref: r, children: t });
  }
);
Ir.displayName = "MDBCardBody";
const Ar = se.forwardRef(
  ({ className: e, children: t, border: n, background: s, tag: r = "div", ...o }, c) => {
    const l = x("card-footer", n && `border-${n}`, s && `bg-${s}`, e);
    return /* @__PURE__ */ a(r, { className: l, ...o, ref: c, children: t });
  }
);
Ar.displayName = "MDBCardFooter";
const oi = ({ className: e, children: t, overlay: n, position: s, fluid: r, ...o }) => {
  const c = x(s && `card-img-${s}`, r && "img-fluid", n && "card-img", e);
  return /* @__PURE__ */ a("img", { className: c, ...o, children: t });
}, $r = se.forwardRef(
  ({ className: e, children: t, tag: n = "div", ...s }, r) => {
    const o = x("card-img-overlay", e);
    return /* @__PURE__ */ a(n, { className: o, ...s, ref: r, children: t });
  }
);
$r.displayName = "MDBCardOverlay";
const ci = ({ className: e, children: t, ...n }) => {
  const s = x("card-link", e);
  return /* @__PURE__ */ a("a", { className: s, ...n, children: t });
}, Rr = se.forwardRef(
  ({ className: e, children: t, tag: n = "div", ...s }, r) => {
    const o = x("card-group", e);
    return /* @__PURE__ */ a(n, { className: o, ...s, ref: r, children: t });
  }
);
Rr.displayName = "MDBCardGroup";
const Hr = se.forwardRef(
  ({ className: e, tag: t = "ul", horizontal: n, horizontalSize: s, light: r, numbered: o, children: c, small: l, ...i }, d) => {
    const u = x(
      "list-group",
      n && (s ? `list-group-horizontal-${s}` : "list-group-horizontal"),
      r && "list-group-light",
      o && "list-group-numbered",
      l && "list-group-small",
      e
    );
    return /* @__PURE__ */ a(t, { className: u, ref: d, ...i, children: c });
  }
);
Hr.displayName = "MDBListGroup";
const Wr = se.forwardRef(
  ({ className: e, tag: t = "li", active: n, disabled: s, action: r, color: o, children: c, noBorders: l, ...i }, d) => {
    const u = t === "button", m = x(
      "list-group-item",
      n && "active",
      s && !u && "disabled",
      r && "list-group-item-action",
      o && `list-group-item-${o}`,
      l && "border-0",
      e
    );
    return /* @__PURE__ */ a(t, { className: m, disabled: u && s, ref: d, ...i, children: c });
  }
);
Wr.displayName = "MDBListGroupItem";
const ht = ({ children: e, containerRef: t, disablePortal: n }) => {
  const [s, r] = N(!1);
  return D(() => {
    !n && r(!0);
  }, [n]), n ? /* @__PURE__ */ a(we, { children: e }) : s ? bs(/* @__PURE__ */ a(we, { children: e }), (t == null ? void 0 : t.current) || document.body) : null;
}, Pr = ({
  className: e,
  children: t,
  disableMouseDown: n,
  tag: s = We,
  tooltipTag: r = "div",
  options: o,
  placement: c = "top",
  title: l,
  wrapperProps: i,
  wrapperClass: d,
  onOpen: u,
  onClose: m,
  onMouseEnter: f,
  onMouseLeave: p,
  type: g,
  ...b
}) => {
  const [h, y] = N(null), [v, k] = N(null), [w, S] = N(!1), [L, E] = N(!1), [M, q] = N(!1), [Y, R] = N(!1), H = x("tooltip", M && "show", "fade", e), { styles: G, attributes: B } = kt(h, v, {
    placement: c,
    ...o
  });
  D(() => {
    let F, V;
    return w || L ? (R(!0), F = setTimeout(() => {
      q(!0);
    }, 4)) : (q(!1), V = setTimeout(() => {
      R(!1);
    }, 300)), () => {
      clearTimeout(F), clearTimeout(V);
    };
  }, [w, L]);
  const U = (F) => {
    u == null || u(F), !F.defaultPrevented && S(!0), f == null || f(F);
  }, _ = (F) => {
    m == null || m(F), !F.defaultPrevented && S(!1), p == null || p(F);
  }, z = X(
    (F) => {
      F.target === h ? E(!0) : E(!1);
    },
    [h]
  );
  return D(() => {
    if (!n)
      return document.addEventListener("mousedown", z), () => {
        document.removeEventListener("mousedown", z);
      };
  }, [z, n]), /* @__PURE__ */ j(we, { children: [
    /* @__PURE__ */ a(
      s,
      {
        className: d,
        onMouseEnter: U,
        onMouseLeave: _,
        ref: y,
        ...i,
        type: g,
        children: t
      }
    ),
    Y && /* @__PURE__ */ a(ht, { children: /* @__PURE__ */ a(
      r,
      {
        ref: k,
        className: H,
        style: G.popper,
        ...B.popper,
        role: "tooltip",
        ...b,
        children: /* @__PURE__ */ a("div", { className: "tooltip-inner", children: l })
      }
    ) })
  ] });
}, Yr = se.forwardRef(
  ({
    around: e,
    between: t,
    bottom: n,
    center: s,
    children: r,
    className: o,
    evenly: c,
    end: l,
    middle: i,
    start: d,
    tag: u = "div",
    top: m,
    ...f
  }, p) => {
    const g = x(
      "row",
      e && "justify-content-around",
      t && "justify-content-between",
      n && "align-self-end",
      s && "justify-content-center",
      c && "justifty-content-evenly",
      l && "justify-content-end",
      i && "align-self-center",
      d && "justify-content-start",
      m && "align-self-start",
      o
    );
    return /* @__PURE__ */ a(u, { className: g, ...f, ref: p, children: r });
  }
);
Yr.displayName = "MDBRow";
const it = ({
  animate: e,
  className: t,
  icon: n,
  fab: s,
  fas: r,
  fal: o,
  far: c,
  flag: l,
  spin: i,
  fixed: d,
  flip: u,
  list: m,
  size: f,
  pull: p,
  pulse: g,
  color: b,
  border: h,
  rotate: y,
  inverse: v,
  stack: k,
  iconType: w,
  children: S,
  ...L
}) => {
  let E;
  l ? E = "flag" : s ? E = "fab" : r ? E = "fas" : c ? E = "far" : o ? E = "fal" : E = "fa";
  const M = x(
    w ? `fa-${w}` : E,
    e && `fa-${e}`,
    l ? `flag-${l}` : n && `fa-${n}`,
    f && `fa-${f}`,
    b && `text-${b}`,
    h && "fa-border",
    y && `fa-rotate-${y}`,
    p && `fa-pull-${p}`,
    i && !e && "fa-spin",
    m && "fa-li",
    d && "fa-fw",
    g && !e && "fa-pulse",
    v && "fa-inverse",
    u && `fa-flip-${u}`,
    k && `fa-stack-${k}`,
    t
  );
  return /* @__PURE__ */ a("i", { className: M, ...L, children: S });
}, Cr = se.forwardRef(
  ({
    className: e,
    children: t,
    tag: n = "p",
    variant: s,
    color: r,
    blockquote: o,
    note: c,
    noteColor: l,
    listUnStyled: i,
    listInLine: d,
    ...u
  }, m) => {
    const f = x(
      s && s,
      o && "blockquote",
      c && "note",
      r && `text-${r}`,
      l && `note-${l}`,
      i && "list-unstyled",
      d && "list-inline",
      e
    );
    return o && (n = "blockquote"), (i || d) && (n = "ul"), /* @__PURE__ */ a(n, { className: f, ref: m, ...u, children: t });
  }
);
Cr.displayName = "MDBTypography";
const Xr = se.forwardRef(
  ({ className: e, color: t, uppercase: n, bold: s, children: r, ...o }, c) => {
    const l = x(
      "breadcrumb",
      s && "font-weight-bold",
      t && `text-${t}`,
      n && "text-uppercase",
      e
    );
    return /* @__PURE__ */ a("nav", { "aria-label": "breadcrumb", children: /* @__PURE__ */ a("ol", { className: l, ref: c, ...o, children: r }) });
  }
);
Xr.displayName = "MDBBreadcrumb";
const Fr = se.forwardRef(
  ({ className: e, active: t, current: n = "page", children: s, ...r }, o) => {
    const c = x("breadcrumb-item", t && "active", e);
    return /* @__PURE__ */ a("li", { className: c, ref: o, "aria-current": t && n, ...r, children: s });
  }
);
Fr.displayName = "MDBBreadcrumbItem";
const Or = (e) => {
  if (e !== !1)
    return `navbar-expand-${e}`;
}, Ns = se.forwardRef(
  ({
    className: e,
    children: t,
    light: n,
    dark: s,
    scrolling: r,
    fixed: o,
    sticky: c,
    scrollingNavbarOffset: l,
    color: i,
    transparent: d,
    expand: u,
    tag: m = "nav",
    bgColor: f,
    ...p
  }, g) => {
    const [b, h] = N(!1), y = x(
      {
        "navbar-light": n,
        "navbar-dark": s,
        "scrolling-navbar": r || l,
        "top-nav-collapse": b,
        [`text-${i}`]: i && d ? b : i
      },
      o && `fixed-${o}`,
      c && "sticky-top",
      "navbar",
      u && Or(u),
      f && `bg-${f}`,
      e
    ), v = X(() => {
      l && window.pageYOffset > l ? h(!0) : h(!1);
    }, [l]);
    return D(() => ((r || l) && window.addEventListener("scroll", v), () => {
      window.removeEventListener("scroll", v);
    }), [v, r, l]), /* @__PURE__ */ a(m, { className: y, role: "navigation", ...p, ref: g, children: t });
  }
);
Ns.displayName = "MDBNavbar";
const Vr = se.forwardRef(
  ({ children: e, className: t = "", disabled: n = !1, active: s = !1, tag: r = "a", ...o }, c) => {
    const l = x("nav-link", n ? "disabled" : s ? "active" : "", t);
    return /* @__PURE__ */ a(r, { "data-test": "nav-link", className: l, style: { cursor: "pointer" }, ref: c, ...o, children: e });
  }
);
Vr.displayName = "MDBNavbarLink";
const jr = se.forwardRef(
  ({ className: e, children: t, tag: n = "a", ...s }, r) => {
    const o = x("navbar-brand", e);
    return /* @__PURE__ */ a(n, { className: o, ref: r, ...s, children: t });
  }
);
jr.displayName = "MDBNavbarBrand";
const Kr = se.forwardRef(
  ({ children: e, className: t, active: n, text: s, tag: r = "li", ...o }, c) => {
    const l = x("nav-item", n && "active", s && "navbar-text", t);
    return /* @__PURE__ */ a(r, { ...o, className: l, ref: c, children: e });
  }
);
Kr.displayName = "MDBNavbarItem";
const qr = se.forwardRef(
  ({ children: e, className: t, right: n, fullWidth: s = !0, left: r, tag: o = "ul", ...c }, l) => {
    const i = x("navbar-nav", s && "w-100", n && "ms-auto", r && "me-auto", t);
    return /* @__PURE__ */ a(o, { className: i, ref: l, ...c, children: e });
  }
);
qr.displayName = "MDBNavbarNav";
const _r = se.forwardRef(
  ({ children: e, className: t, tag: n = "button", ...s }, r) => {
    const o = x("navbar-toggler", t);
    return /* @__PURE__ */ a(n, { ...s, className: o, ref: r, children: e });
  }
);
_r.displayName = "MDBNavbarToggler";
const zr = se.forwardRef(
  ({ children: e, bgColor: t, color: n, className: s, ...r }, o) => {
    const c = x(t && `bg-${t}`, n && `text-${n}`, s);
    return /* @__PURE__ */ a("footer", { className: c, ...r, ref: o, children: e });
  }
);
zr.displayName = "MDBFooter";
const Ur = se.forwardRef(
  ({ children: e, size: t, circle: n, center: s, end: r, start: o, className: c, ...l }, i) => {
    const d = x(
      "pagination",
      s && "justify-content-center",
      n && "pagination-circle",
      r && "justify-content-end",
      t && `pagination-${t}`,
      o && "justify-content-start",
      c
    );
    return /* @__PURE__ */ a("ul", { className: d, ...l, ref: i, children: e });
  }
);
Ur.displayName = "MDBPagination";
const Gr = se.forwardRef(
  ({ children: e, className: t, tag: n = "a", ...s }, r) => {
    const o = x("page-link", t);
    return /* @__PURE__ */ a(n, { className: o, ...s, ref: r, children: e });
  }
);
Gr.displayName = "MDBPaginationLink";
const Qr = se.forwardRef(
  ({ children: e, className: t, active: n, disabled: s, ...r }, o) => {
    const c = x("page-item", n && "active", s && "disabled", t);
    return /* @__PURE__ */ a("li", { className: c, ...r, ref: o, children: e });
  }
);
Qr.displayName = "MDBPaginationItem";
const Jr = ({
  className: e,
  classNameResponsive: t,
  responsive: n,
  align: s,
  borderColor: r,
  bordered: o,
  borderless: c,
  children: l,
  color: i,
  hover: d,
  small: u,
  striped: m,
  ...f
}) => {
  const p = x(
    "table",
    s && `align-${s}`,
    r && `border-${r}`,
    o && "table-bordered",
    c && "table-borderless",
    i && `table-${i}`,
    d && "table-hover",
    u && "table-sm",
    m && "table-striped",
    e
  ), g = Fe(() => /* @__PURE__ */ a("table", { className: p, ...f, children: l }), [l, p, f]);
  if (n) {
    const b = x(
      typeof n == "string" ? `table-responsive-${n}` : "table-responsive",
      t
    );
    return /* @__PURE__ */ a("div", { className: b, children: g });
  } else
    return g;
}, Zr = ({ className: e, children: t, dark: n, light: s, ...r }) => {
  const o = x(n && "table-dark", s && "table-light", e);
  return /* @__PURE__ */ a("thead", { className: o, ...r, children: t });
}, eo = ({ className: e, children: t, ...n }) => {
  const s = x(e);
  return /* @__PURE__ */ a("tbody", { className: s, ...n, children: t });
}, ks = se.forwardRef(
  ({
    animated: e,
    children: t,
    className: n,
    style: s,
    tag: r = "div",
    valuenow: o,
    valuemax: c,
    striped: l,
    bgColor: i,
    valuemin: d,
    width: u,
    ...m
  }, f) => {
    const p = x(
      "progress-bar",
      i && `bg-${i}`,
      l && "progress-bar-striped",
      e && "progress-bar-animated",
      n
    ), g = { width: `${u}%`, ...s };
    return /* @__PURE__ */ a(
      r,
      {
        className: p,
        style: g,
        ref: f,
        role: "progressbar",
        ...m,
        "aria-valuenow": Number(u) ?? o,
        "aria-valuemin": Number(d),
        "aria-valuemax": Number(c),
        children: t
      }
    );
  }
);
ks.displayName = "MDBProgressBar";
const to = se.forwardRef(
  ({ className: e, children: t, tag: n = "div", height: s, style: r, ...o }, c) => {
    const l = x("progress", e), i = { height: `${s}px`, ...r };
    return /* @__PURE__ */ a(n, { className: l, ref: c, style: i, ...o, children: se.Children.map(t, (d) => {
      if (!se.isValidElement(d) || d.type !== ks) {
        console.error("Progress component only allows ProgressBar as child");
        return;
      } else
        return d;
    }) });
  }
);
to.displayName = "MDBProgress";
const no = (e) => {
  const [t, n] = N(!1), [s, r] = N(null);
  return D(() => {
    r(() => new IntersectionObserver(([o]) => {
      n(o.isIntersecting);
    }));
  }, []), D(() => {
    if (!(!e.current || !s))
      return s.observe(e.current), () => s.disconnect();
  }, [s, e]), t;
}, Mt = (e, t) => Fe(() => t !== void 0 ? t : e, [t, e]), wt = se.forwardRef(
  ({
    className: e,
    size: t,
    contrast: n,
    value: s,
    defaultValue: r,
    id: o,
    labelClass: c,
    wrapperClass: l,
    wrapperStyle: i,
    wrapperTag: d = "div",
    label: u,
    onChange: m,
    children: f,
    labelRef: p,
    labelStyle: g,
    type: b,
    onBlur: h,
    readonly: y = !1,
    showCounter: v = !1,
    ...k
  }, w) => {
    var $;
    const [S, L] = N(r), E = Fe(() => s !== void 0 ? s : S, [s, S]), [M, q] = N(0), [Y, R] = N(!1), [H, G] = N(0), B = Z(null), U = no(B), _ = Z(null), z = p || _;
    Dt(w, () => B.current);
    const F = x("form-outline", n && "form-white", l), C = ["date", "time", "datetime-local", "month", "week"].includes(b), W = x(
      "form-control",
      Y && "active",
      C && "active",
      t && `form-control-${t}`,
      e
    ), J = x("form-label", c), O = X(() => {
      var P;
      (P = z.current) != null && P.clientWidth && q(z.current.clientWidth * 0.8 + 8);
    }, [z]), Q = (P) => {
      L(P.target.value), v && G(P.target.value.length), m == null || m(P);
    }, T = X(
      (P) => {
        B.current && (R(!!E), h && h(P));
      },
      [E, h]
    );
    return D(() => {
      O();
    }, [($ = z.current) == null ? void 0 : $.clientWidth, O, U]), D(() => {
      if (E)
        return R(!0);
      R(!1);
    }, [E]), /* @__PURE__ */ j(d, { className: F, style: i, children: [
      /* @__PURE__ */ a(
        "input",
        {
          type: b,
          readOnly: y,
          className: W,
          onBlur: T,
          onChange: Q,
          onFocus: O,
          value: s,
          defaultValue: r,
          id: o,
          ref: B,
          ...k
        }
      ),
      u && /* @__PURE__ */ a("label", { className: J, style: g, htmlFor: o, ref: z, children: u }),
      /* @__PURE__ */ j("div", { className: "form-notch", children: [
        /* @__PURE__ */ a("div", { className: "form-notch-leading" }),
        /* @__PURE__ */ a("div", { className: "form-notch-middle", style: { width: M } }),
        /* @__PURE__ */ a("div", { className: "form-notch-trailing" })
      ] }),
      f,
      v && k.maxLength && /* @__PURE__ */ a("div", { className: "form-helper", children: /* @__PURE__ */ a("div", { className: "form-counter", children: `${H}/${k.maxLength}` }) })
    ] });
  }
);
wt.displayName = "MDBInput";
const tn = Tt(
  ({
    className: e,
    inputRef: t,
    labelClass: n,
    wrapperClass: s,
    labelStyle: r,
    wrapperTag: o = "div",
    wrapperStyle: c,
    label: l,
    inline: i,
    btn: d,
    id: u,
    btnColor: m,
    disableWrapper: f,
    toggleSwitch: p,
    ...g
  }, b) => {
    let h = "form-check-input", y = "form-check-label";
    d && (h = "btn-check", m ? y = `btn btn-${m}` : y = "btn btn-primary");
    const v = x(
      l && !d && "form-check",
      i && !d && "form-check-inline",
      p && "form-switch",
      s
    ), k = x(h, e), w = x(y, n), S = /* @__PURE__ */ j(we, { children: [
      /* @__PURE__ */ a("input", { className: k, id: u, ref: t, ...g }),
      l && /* @__PURE__ */ a("label", { className: w, style: r, htmlFor: u, children: l })
    ] });
    return /* @__PURE__ */ a(we, { children: f ? S : /* @__PURE__ */ a(o, { style: c, className: v, ref: b, children: S }) });
  }
);
tn.displayName = "InputTemplate";
const Yt = ({ ...e }) => /* @__PURE__ */ a(tn, { type: "checkbox", ...e }), li = ({ ...e }) => /* @__PURE__ */ a(tn, { type: "radio", ...e });
function so({ showCollapse: e, setCollapseHeight: t, refCollapse: n, contentRef: s }) {
  D(() => {
    e || t("0px");
  }, [e]), D(() => {
    const r = n.current, o = (l) => {
      if (!r)
        return;
      const i = l.contentRect.height, d = window.getComputedStyle(r), u = parseFloat(d.paddingTop) + parseFloat(d.paddingBottom) + parseFloat(d.marginBottom) + parseFloat(d.marginTop), m = `${i + u}px`;
      t(m);
    }, c = new ResizeObserver(([l]) => {
      o(l);
    });
    return c.observe(s.current), () => {
      c.disconnect();
    };
  }, []);
}
const Ms = ({
  className: e,
  children: t,
  open: n = !1,
  id: s,
  navbar: r,
  tag: o = "div",
  collapseRef: c,
  style: l,
  onOpen: i,
  onClose: d,
  ...u
}) => {
  const [m, f] = N(!1), [p, g] = N(void 0), [b, h] = N(!1), y = x(
    b ? "collapsing" : "collapse",
    !b && m && "show",
    r && "navbar-collapse",
    e
  ), v = Z(null), k = c ?? v, w = Z(null), S = X(() => {
    m && g(void 0);
  }, [m]);
  return D(() => (window.addEventListener("resize", S), () => {
    window.removeEventListener("resize", S);
  }), [S]), so({ showCollapse: m, setCollapseHeight: g, refCollapse: k, contentRef: w }), D(() => {
    m !== n && (n ? i == null || i() : d == null || d(), f(n)), m && h(!0);
    const L = setTimeout(() => {
      h(!1);
    }, 350);
    return () => {
      clearTimeout(L);
    };
  }, [n, m, i, d]), /* @__PURE__ */ a(o, { style: { height: p, ...l }, id: s, className: y, ...u, ref: k, children: /* @__PURE__ */ a("div", { ref: w, className: "collapse-content", children: t }) });
}, xs = hn(null), ro = ({
  children: e,
  isOpen: t = !1,
  options: n,
  animation: s = !0,
  dropup: r,
  dropright: o,
  dropleft: c,
  onClose: l,
  onOpen: i
}) => {
  const [d, u] = N(t), [m, f] = N(null), [p, g] = N(null), [b, h] = N(-1);
  return /* @__PURE__ */ a(
    xs.Provider,
    {
      value: {
        animation: s,
        activeIndex: b,
        isOpenState: d,
        setReferenceElement: f,
        setPopperElement: g,
        setActiveIndex: h,
        popperElement: p,
        setIsOpenState: u,
        referenceElement: m,
        onClose: l,
        onOpen: i,
        dropup: r,
        options: n,
        dropright: o,
        dropleft: c
      },
      children: e
    }
  );
}, oo = (e) => e instanceof HTMLElement, co = (e) => e instanceof Node, Ct = () => {
  const e = Ye(xs);
  if (!e)
    throw new Error("Missing context data");
  return e;
}, lo = () => {
  const { isOpenState: e, setIsOpenState: t, setActiveIndex: n, popperElement: s, referenceElement: r, onClose: o } = Ct(), c = X(
    (l) => {
      e && (o == null || o(l)), !(!e || !co(l.target) || s && s.contains(l.target) || r && r.contains(l.target) || l.defaultPrevented) && (t(!1), setTimeout(() => n(-1), 300));
    },
    [e, t, n, s, r, o]
  );
  D(() => (document.addEventListener("mousedown", c), () => document.removeEventListener("mousedown", c)), [c]);
}, io = ({
  className: e,
  tag: t = "div",
  group: n,
  children: s,
  dropup: r,
  dropright: o,
  dropleft: c,
  wrapper: l,
  ...i
}) => {
  lo();
  const d = x(
    n ? "btn-group" : "dropdown",
    r && "dropup",
    o && "dropend",
    c && "dropstart",
    e
  );
  return l ? /* @__PURE__ */ a(t, { className: d, ...i, children: s }) : /* @__PURE__ */ a(we, { children: s });
}, ii = ({ animation: e, onClose: t, onOpen: n, wrapper: s = !0, ...r }) => /* @__PURE__ */ a(ro, { animation: e, onClose: t, onOpen: n, ...r, children: /* @__PURE__ */ a(io, { wrapper: s, ...r }) }), ao = ({
  childTag: e,
  children: t,
  disabled: n,
  link: s,
  divider: r,
  header: o,
  href: c = "#"
}) => {
  const l = x("dropdown-item", n && "disabled");
  return s ? e ? /* @__PURE__ */ a(e, { className: l, children: t }) : /* @__PURE__ */ a("a", { href: c, className: l, children: t }) : r ? e ? /* @__PURE__ */ a(e, { className: "dropdown-divider", children: t }) : /* @__PURE__ */ a("hr", { className: "dropdown-divider" }) : o ? e ? /* @__PURE__ */ a(e, { className: "dropdown-header", children: t }) : /* @__PURE__ */ a("h6", { className: "dropdown-header", children: t }) : /* @__PURE__ */ a(we, { children: t });
}, ai = ({
  onClick: e,
  tag: t = "li",
  childTag: n,
  children: s,
  style: r,
  link: o,
  divider: c,
  header: l,
  disabled: i,
  href: d,
  preventCloseOnClick: u,
  ...m
}) => {
  const { setIsOpenState: f, onClose: p, setActiveIndex: g } = Ct();
  return /* @__PURE__ */ a(t, { style: r, onClick: (h) => {
    p == null || p(h), e == null || e(h), !(i || u || h.defaultPrevented) && (setTimeout(() => g(-1), 300), f(!1));
  }, ...m, children: /* @__PURE__ */ a(
    ao,
    {
      link: o,
      divider: c,
      header: l,
      disabled: i,
      href: d,
      childTag: n,
      children: s
    }
  ) });
}, $n = (e, t, n) => n === "up" ? e <= 0 ? t[t.length - 1].props.divider === !0 || t[t.length - 1].props.disabled === !0 : t[e - 1].props.divider === !0 || t[e - 1].props.disabled === !0 : e === t.length - 1 ? t[0].props.divider === !0 || t[0].props.disabled === !0 : t[e + 1].props.divider === !0 || t[e + 1].props.disabled === !0, uo = (e) => {
  const { activeIndex: t, isOpenState: n, setIsOpenState: s, setActiveIndex: r, onClose: o } = Ct(), c = X(
    (l) => {
      const i = ["ArrowUp", "ArrowDown", "Tab", "Enter", "Escape"];
      if (!(!Array.isArray(e) || !i.includes(l.key))) {
        if (oo(document.activeElement) && document.activeElement.blur(), l.key === "ArrowUp") {
          l.preventDefault();
          const d = $n(t, e, "up");
          if (t === 1) {
            r(d ? e.length - 1 : 0);
            return;
          }
          if (t <= 0) {
            r(d ? e.length - 2 : e.length - 1);
            return;
          }
          r((u) => d ? u - 2 : u - 1);
        }
        if (l.key === "ArrowDown" || l.key === "Tab") {
          l.preventDefault();
          const d = $n(t, e, "down");
          if (t === e.length - 2) {
            r((u) => d ? 0 : u + 1);
            return;
          }
          if (t === e.length - 1) {
            r(d ? 1 : 0);
            return;
          }
          r((u) => d ? u + 2 : u + 1);
        }
        if (l.key === "Enter") {
          const d = document.querySelector('[data-active="true"]'), u = d == null ? void 0 : d.firstElementChild;
          if (u)
            return u.click();
          if (o == null || o(l), l.defaultPrevented)
            return;
          s(!1), setTimeout(() => r(-1), 300);
        }
        if (l.key === "Escape") {
          if (o == null || o(l), l.defaultPrevented)
            return;
          s(!1), setTimeout(() => r(-1), 300);
        }
      }
    },
    [e, s, r, t, o]
  );
  D(() => (n && document.addEventListener("keydown", c), () => {
    n && document.removeEventListener("keydown", c);
  }), [n, c]), D(() => {
    const l = document.querySelector('[data-active="true"]'), i = l == null ? void 0 : l.firstElementChild;
    return i == null || i.focus(), () => i == null ? void 0 : i.blur();
  }, [t]);
}, fo = () => {
  const { isOpenState: e } = Ct(), [t, n] = N(!1), [s, r] = N(!1), [o, c] = N(e);
  return D(() => {
    let l;
    return e || (r(!0), n(!1), l = setTimeout(() => {
      r(!1), c(!1);
    }, 300)), e && (n(!0), r(!1), c(!0), l = setTimeout(() => {
      n(!1);
    }, 300)), () => clearTimeout(l);
  }, [e]), { open: o, isFadeIn: t, isFadeOut: s };
}, ui = ({
  className: e,
  tag: t = "ul",
  children: n,
  style: s,
  dark: r,
  responsive: o = "",
  appendToBody: c = !1,
  alwaysOpen: l,
  ...i
}) => {
  const {
    activeIndex: d,
    setPopperElement: u,
    isOpenState: m,
    animation: f,
    referenceElement: p,
    popperElement: g,
    options: b,
    dropleft: h,
    dropup: y,
    dropright: v
  } = Ct(), { open: k, isFadeIn: w, isFadeOut: S } = fo();
  uo(n);
  const L = () => {
    if (v)
      return "right-start";
    if (h)
      return "left-start";
    const Y = g && getComputedStyle(g).getPropertyValue("--mdb-position").trim() === "end";
    return y ? Y ? "top-end" : "top-start" : Y ? "bottom-end" : "bottom-start";
  }, { styles: E } = kt(p, g, {
    placement: L(),
    modifiers: [gs],
    ...b
  }), M = x(
    "dropdown-menu",
    r && "dropdown-menu-dark",
    m && "show",
    f && "animation",
    w && "fade-in",
    S && "fade-out",
    o && `dropdown-menu-${o}`,
    e
  );
  if (!k && !l)
    return null;
  const q = /* @__PURE__ */ a(
    t,
    {
      className: M,
      style: { position: "absolute", zIndex: 1e3, ...E.popper, ...s },
      ref: u,
      ...i,
      children: vs.map(
        n,
        (Y, R) => lr(Y, {
          tabIndex: 0,
          "data-active": d === R && !0,
          className: x(d === R ? "active" : "", Y.props.className)
        })
      )
    }
  );
  return /* @__PURE__ */ a(ht, { disablePortal: !c, children: q });
}, di = ({
  className: e,
  tag: t = We,
  children: n,
  onClick: s,
  split: r,
  ...o
}) => {
  const { setIsOpenState: c, setReferenceElement: l, isOpenState: i, setActiveIndex: d, onClose: u, onOpen: m } = Ct(), f = x("dropdown-toggle", r && "dropdown-toggle-split", e);
  return /* @__PURE__ */ a(
    t,
    {
      onClick: (g) => {
        s == null || s(g), i ? u == null || u(g) : m == null || m(g), !g.defaultPrevented && (c((b) => !b), setTimeout(() => d(-1), 300));
      },
      ref: l,
      className: f,
      "aria-expanded": !!i,
      ...o,
      children: n
    }
  );
}, mo = ({
  className: e,
  btnClassName: t,
  btnChildren: n,
  children: s,
  tag: r = We,
  onOpen: o,
  onClose: c,
  popperTag: l = "div",
  open: i,
  placement: d = "bottom",
  dismiss: u,
  options: m,
  poperStyle: f,
  onClick: p,
  disablePortal: g = !1,
  ...b
}) => {
  const [h, y] = N(), [v, k] = N(), { styles: w, attributes: S } = kt(h, v, { placement: d, ...m }), [L, E] = N(i ?? !1), M = Mt(L, i), [q, Y] = N(!1), [R, H] = N(!1), G = x("popover fade", q && M && "show", e), B = (_) => {
    M && !u ? c == null || c() : M || o == null || o(), u ? (H(!0), E(!0)) : E(!M), p && p(_);
  }, U = X(
    (_) => {
      R && v && M && h && !h.contains(_.target) && (E(!1), c == null || c());
    },
    [R, M, v, h, c]
  );
  return D(() => {
    const _ = setTimeout(() => {
      Y(M);
    }, 150);
    return () => {
      clearTimeout(_);
    };
  }, [M]), D(() => (M && document.addEventListener("mousedown", U), () => {
    document.removeEventListener("mousedown", U);
  }), [U, M]), /* @__PURE__ */ j(we, { children: [
    /* @__PURE__ */ a(r, { onClick: B, className: t, ...b, ref: y, children: n }),
    (q || M) && /* @__PURE__ */ a(ht, { disablePortal: g, children: /* @__PURE__ */ a(
      l,
      {
        className: G,
        ref: k,
        style: { ...w.popper, ...f },
        ...S.popper,
        children: s
      }
    ) })
  ] });
}, ho = ({
  className: e,
  children: t,
  tag: n = "div",
  ...s
}) => {
  const r = x("popover-body", e);
  return /* @__PURE__ */ a(n, { className: r, ...s, children: t });
}, fi = ({
  className: e,
  children: t,
  tag: n = "h3",
  ...s
}) => {
  const r = x("popover-header", e);
  return /* @__PURE__ */ a(n, { className: r, ...s, children: t });
}, po = (e) => X(() => e === "top" ? { top: -50, left: 0 } : e === "bottom" ? { top: 50, left: 0 } : e === "left" ? { top: 0, left: -50 } : e === "right" ? { top: 0, left: 50 } : { top: 0, left: 0 }, [e])(), vo = (e) => {
  const t = e instanceof HTMLElement ? e : e.current;
  if (!t)
    return [];
  const n = Array.from(
    t.querySelectorAll("button, a, input, select, textarea, [tabindex]")
  ).map((r) => ({
    element: r,
    focused: r === document.activeElement
  }));
  return n ? n.filter((r) => r.element.tabIndex !== -1).sort((r, o) => r.element.tabIndex === o.element.tabIndex ? 0 : o.element.tabIndex === null ? -1 : r.element.tabIndex === null ? 1 : r.element.tabIndex - o.element.tabIndex) : [];
}, bo = (e, t, n) => {
  let s = e;
  return t ? s = e - 1 < 0 ? n - 1 : e - 1 : s = e + 1 >= n ? 0 : e + 1, s;
}, go = {
  opacity: 1,
  top: 0,
  left: 0
}, mi = ({
  animationDirection: e = "top",
  appendToBody: t,
  backdrop: n = !0,
  children: s,
  className: r,
  closeOnEsc: o = !0,
  leaveHiddenModal: c = !1,
  modalRef: l,
  onClose: i,
  onClosePrevented: d,
  onOpen: u,
  open: m,
  defaultOpen: f = !1,
  staticBackdrop: p,
  nonInvasive: g = !1,
  tag: b = "div",
  animationVariants: h = {},
  ...y
}) => {
  const [v, k] = N(f), w = Mt(v, m), [S, L] = N(!1), [E, M] = N([]), q = Fe(() => vt(b), [b]), Y = Z(null), R = l || Y, H = {
    opacity: 0,
    ...po(e),
    ...h.initial ? h.initial : {}
  }, G = {
    ...go,
    ...h.animate ? h.animate : {}
  }, B = {
    ...H,
    ...h.exit ? h.exit : {}
  }, U = x(
    "modal",
    S && "modal-static",
    e,
    w && g && "modal-non-invasive-show",
    r
  ), _ = x("modal-backdrop"), z = X(() => {
    k(!1), i == null || i();
  }, [i]), F = X(() => {
    L(!0), d == null || d(), setTimeout(() => {
      L(!1);
    }, 300);
  }, [d]), V = X(
    (W) => {
      g && !w || w && W.target === R.current && (p ? F() : z());
    },
    [w, R, p, z, g, F]
  ), C = X(
    (W) => {
      if (w && W.key === "Tab") {
        W.preventDefault();
        const J = W.shiftKey, O = E.findIndex((T) => T.focused), Q = bo(O, J, E.length);
        M((T) => T == null ? void 0 : T.map(($, P) => ({
          ...$,
          focused: P === Q
        }))), E[Q].element.focus();
      }
      o && w && W.key === "Escape" && (W.preventDefault(), p ? F() : z());
    },
    [w, o, p, z, F, E]
  );
  return D(() => {
    if (!R || !w) {
      M([]);
      return;
    }
    M(() => vo(R));
  }, [R, w, s]), D(() => {
    const W = () => {
      const O = document.documentElement.clientWidth;
      return Math.abs(window.innerWidth - O);
    }, J = window.innerWidth > document.documentElement.clientWidth && window.innerWidth >= 576;
    if (w && J && !g) {
      const O = W();
      document.body.classList.add("modal-open"), document.body.style.overflow = "hidden", document.body.style.paddingRight = `${O}px`;
    } else
      document.body.classList.remove("modal-open"), document.body.style.overflow = "", document.body.style.paddingRight = "";
    return () => {
      document.body.classList.remove("modal-open"), document.body.style.overflow = "", document.body.style.paddingRight = "";
    };
  }, [w, g]), D(() => {
    const W = (J) => {
      J.target.closest(".modal-dialog") || window.addEventListener("mouseup", V, { once: !0 });
    };
    return window.addEventListener("mousedown", W), window.addEventListener("keydown", C), () => {
      window.removeEventListener("mousedown", W), window.removeEventListener("keydown", C);
    };
  }, [C, V]), /* @__PURE__ */ a(ht, { disablePortal: !t, children: /* @__PURE__ */ j(At, { children: [
    (w || c) && /* @__PURE__ */ j(we, { children: [
      /* @__PURE__ */ a(
        q,
        {
          initial: H,
          animate: G,
          exit: B,
          className: U,
          ref: R,
          style: { display: w ? "block" : "none", pointerEvents: g ? "none" : "initial" },
          ...y,
          children: s
        }
      ),
      n && w && !g && /* @__PURE__ */ a(
        vt.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 0.5 },
          exit: { opacity: 0 },
          onClick: () => {
            p ? d == null || d() : z();
          },
          className: _
        }
      )
    ] }),
    "),"
  ] }) });
}, yo = se.forwardRef(
  ({ className: e, children: t, tag: n = "div", ...s }, r) => {
    const o = x("modal-content", e);
    return /* @__PURE__ */ a(n, { className: o, ...s, ref: r, children: t });
  }
);
yo.displayName = "MDBModalContent";
const wo = se.forwardRef(
  ({ className: e, children: t, tag: n = "div", ...s }, r) => {
    const o = x("modal-header", e);
    return /* @__PURE__ */ a(n, { className: o, ...s, ref: r, children: t });
  }
);
wo.displayName = "MDBModalHeader";
const No = se.forwardRef(
  ({ className: e, children: t, tag: n = "h5", ...s }, r) => {
    const o = x("modal-title", e);
    return /* @__PURE__ */ a(n, { className: o, ...s, ref: r, children: t });
  }
);
No.displayName = "MDBModalTitle";
const ko = se.forwardRef(
  ({ className: e, children: t, tag: n = "div", ...s }, r) => {
    const o = x("modal-body", e);
    return /* @__PURE__ */ a(n, { className: o, ...s, ref: r, children: t });
  }
);
ko.displayName = "MDBModalBody";
const Mo = se.forwardRef(
  ({ className: e, children: t, tag: n = "div", ...s }, r) => {
    const o = x("modal-footer", e);
    return /* @__PURE__ */ a(n, { className: o, ...s, ref: r, children: t });
  }
);
Mo.displayName = "MDBModalFooter";
const vn = se.createContext({
  activeElement: null,
  setTargets: null
}), hi = ({
  container: e = typeof window !== void 0 ? window : null,
  className: t,
  children: n,
  offset: s = 10,
  ...r
}) => {
  const o = x("sticky-top", t), [c, l] = N(null), [i, d] = N([]), u = e instanceof Window, m = X(() => {
    var y, v, k;
    if (!i.length)
      return;
    const f = u ? window.pageYOffset : (y = e == null ? void 0 : e.current) == null ? void 0 : y.scrollTop, p = Number(s), g = (v = i[i.length - 1]) == null ? void 0 : v.current, b = (k = i[0]) == null ? void 0 : k.current;
    f + p < b.offsetTop && l(null), i.forEach((w, S) => {
      var q;
      const L = (q = i[S + 1]) == null ? void 0 : q.current, E = w.current;
      if (f > E.offsetTop - p && f < (L == null ? void 0 : L.offsetTop) - p) {
        l(E);
        return;
      }
    }), f > g.offsetTop - p && l(g);
  }, [s, i, u, e]);
  return D(() => {
    const f = u ? e : e == null ? void 0 : e.current;
    return m(), f == null || f.addEventListener("scroll", m), () => {
      f == null || f.removeEventListener("scroll", m);
    };
  }, [m, e, u]), /* @__PURE__ */ a("div", { className: o, ...r, children: /* @__PURE__ */ a("ul", { className: "nav flex-column nav-pills menu-sidebar", children: /* @__PURE__ */ a(vn.Provider, { value: { activeElement: c, setTargets: d }, children: n }) }) });
}, pi = ({
  className: e,
  collapsible: t,
  targetRef: n,
  children: s,
  subsections: r,
  onClick: o,
  onActivate: c,
  ...l
}) => {
  var b;
  const { activeElement: i, setTargets: d } = Ye(vn), u = () => r == null ? void 0 : r.some((h) => h.current.id === (i == null ? void 0 : i.id)), m = (i == null ? void 0 : i.id) === ((b = n.current) == null ? void 0 : b.id), f = m || u();
  m && (c == null || c(i == null ? void 0 : i.id));
  const p = x("nav-link", t && "collapsible-scrollspy", f && "active", e), g = (h) => {
    const y = n == null ? void 0 : n.current;
    y == null || y.scrollIntoView({ behavior: "smooth" }), o == null || o(h);
  };
  return D(() => {
    d((h) => [...h, n]);
  }, [d, n]), /* @__PURE__ */ a("li", { className: "nav-item", style: { cursor: "pointer" }, children: /* @__PURE__ */ a("a", { className: p, onClick: g, ...l, children: s }) });
}, vi = ({
  collapsible: e,
  className: t,
  children: n,
  style: s,
  ...r
}) => {
  const [o, c] = N("0px"), { activeElement: l } = Ye(vn), i = x("nav flex-column", t), d = Z(null);
  D(() => {
    const m = () => e == null ? void 0 : e.some((p) => p.current.id === (l == null ? void 0 : l.id)), f = d.current;
    m() ? c(`${f == null ? void 0 : f.scrollHeight}px`) : c("0px");
  }, [l, e]);
  const u = {
    overflow: "hidden",
    height: o,
    transition: "height .5s ease",
    flexWrap: "nowrap",
    ...s
  };
  return /* @__PURE__ */ a("ul", { className: i, ref: d, style: e ? u : s, ...r, children: n });
}, bi = ({ ...e }) => /* @__PURE__ */ a(tn, { type: "checkbox", toggleSwitch: !0, ...e }), xo = ({ value: e, min: t = "0", max: n = "100", showThumb: s }) => {
  const r = Number(e), [o, c] = N(
    (r || 0 - Number(t)) * 100 / (Number(n) - Number(t))
  ), l = x("thumb", s && "thumb-active");
  return D(() => {
    c((Number(e) - Number(t)) * 100 / (Number(n) - Number(t)));
  }, [e, n, t]), /* @__PURE__ */ a("span", { className: l, style: { left: `calc(${o}% + (${8 - o * 0.15}px))` }, children: /* @__PURE__ */ a("span", { className: "thumb-value", children: e }) });
}, Rn = ({
  className: e,
  defaultValue: t = 0,
  disableTooltip: n,
  labelId: s,
  max: r,
  min: o,
  onMouseDown: c,
  onMouseUp: l,
  onTouchStart: i,
  onTouchEnd: d,
  onChange: u,
  labelClass: m,
  value: f,
  label: p,
  id: g,
  inputRef: b,
  ...h
}) => {
  const [y, v] = N(t), [k, w] = N(!1), S = x("form-range", e), L = x("form-label", m);
  return /* @__PURE__ */ j(we, { children: [
    p && /* @__PURE__ */ a("label", { className: L, id: s, htmlFor: g, children: p }),
    /* @__PURE__ */ j("div", { className: "range", children: [
      /* @__PURE__ */ a(
        "input",
        {
          type: "range",
          onMouseDown: (H) => {
            w(!0), c && c(H);
          },
          onMouseUp: (H) => {
            w(!1), l && l(H);
          },
          onTouchStart: (H) => {
            w(!0), i && i(H);
          },
          onTouchEnd: (H) => {
            w(!1), d && d(H);
          },
          onChange: (H) => {
            v(H.target.value), u && u(H);
          },
          className: S,
          value: f || y,
          id: g,
          min: o,
          max: r,
          ref: b,
          ...h
        }
      ),
      !n && /* @__PURE__ */ a(xo, { value: f || y, showThumb: k, min: o, max: r })
    ] })
  ] });
}, Eo = Tt(
  ({ className: e, labelClass: t, labelStyle: n, inputRef: s, size: r, label: o, id: c, ...l }, i) => {
    const d = x("form-control", `form-control-${r}`, e), u = x("form-label", t), m = Z(null);
    return Dt(i, () => m.current || (s == null ? void 0 : s.current)), /* @__PURE__ */ j(we, { children: [
      o && /* @__PURE__ */ a("label", { className: u, style: n, htmlFor: c, children: o }),
      /* @__PURE__ */ a("input", { className: d, type: "file", id: c, ref: m, ...l })
    ] });
  }
);
Eo.displayName = "MDBFile";
const Es = se.forwardRef(
  ({
    className: e,
    children: t,
    noBorder: n,
    textBefore: s,
    textAfter: r,
    noWrap: o,
    tag: c = "div",
    textTag: l = "span",
    textClass: i,
    size: d,
    textProps: u,
    ...m
  }, f) => {
    const p = x("input-group", o && "flex-nowrap", d && `input-group-${d}`, e), g = x("input-group-text", n && "border-0", i), b = (h) => /* @__PURE__ */ a(we, { children: h && Array.isArray(h) ? h.map((y, v) => /* @__PURE__ */ a(l, { className: g, ...u, children: y }, v)) : /* @__PURE__ */ a(l, { className: g, ...u, children: h }) });
    return /* @__PURE__ */ j(c, { className: p, ref: f, ...m, children: [
      s && b(s),
      t,
      r && b(r)
    ] });
  }
);
Es.displayName = "MDBInputGroup";
const Ds = se.forwardRef(
  ({ className: e, children: t, isValidated: n = !1, onReset: s, onSubmit: r, noValidate: o = !0, ...c }, l) => {
    const [i, d] = N(n), u = x("needs-validation", i && "was-validated", e), m = (p) => {
      p.preventDefault(), d(!0), r && r(p);
    }, f = (p) => {
      p.preventDefault(), d(!1), s && s(p);
    };
    return D(() => {
      d(n);
    }, [n]), /* @__PURE__ */ a(
      "form",
      {
        className: u,
        onSubmit: m,
        onReset: f,
        ref: l,
        noValidate: o,
        ...c,
        children: t
      }
    );
  }
);
Ds.displayName = "MDBValidation";
const Do = se.forwardRef(
  ({ className: e, fill: t, pills: n, justify: s, children: r, ...o }, c) => {
    const l = x(
      "nav",
      n ? "nav-pills" : "nav-tabs",
      t && "nav-fill",
      s && "nav-justified",
      e
    );
    return /* @__PURE__ */ a("ul", { className: l, ref: c, ...o, children: r });
  }
);
Do.displayName = "MDBTabs";
const To = se.forwardRef(
  ({ className: e, children: t, style: n, tag: s = "li", ...r }, o) => {
    const c = x("nav-item", e);
    return /* @__PURE__ */ a(s, { className: c, style: { cursor: "pointer", ...n }, role: "presentation", ref: o, ...r, children: t });
  }
);
To.displayName = "MDBTabsItem";
const Lo = se.forwardRef(
  ({ className: e, color: t, active: n, onOpen: s, onClose: r, children: o, ...c }, l) => {
    const i = x("nav-link", n && "active", t && `bg-${t}`, e);
    return D(() => {
      n ? s == null || s() : r == null || r();
    }, [n]), /* @__PURE__ */ a("a", { className: i, ref: l, ...c, children: o });
  }
);
Lo.displayName = "MDBTabsLink";
const Bo = se.forwardRef(
  ({ className: e, tag: t = "div", children: n, ...s }, r) => {
    const o = x("tab-content", e);
    return /* @__PURE__ */ a(t, { className: o, ref: r, ...s, children: n });
  }
);
Bo.displayName = "MDBTabsContent";
const So = se.forwardRef(
  ({ className: e, tag: t = "div", open: n, children: s, ...r }, o) => {
    const [c, l] = N(!1), i = x("tab-pane", "fade", c && "show", n && "active", e);
    return D(() => {
      let d;
      return n ? d = setTimeout(() => {
        l(!0);
      }, 100) : l(!1), () => {
        clearTimeout(d);
      };
    }, [n]), /* @__PURE__ */ a(t, { className: i, role: "tabpanel", ref: o, ...r, children: s });
  }
);
So.displayName = "MDBTabsPane";
const bn = hn({
  active: 0
}), Io = ({ imagesCount: e, to: t }) => {
  const { active: n } = Ye(bn);
  return /* @__PURE__ */ a("ol", { className: "carousel-indicators", children: Array.from(Array(e)).map((s, r) => /* @__PURE__ */ a("li", { "data-mdb-target": r, className: x(n === r && "active"), onClick: () => t(r) }, r)) });
}, Ao = ({ move: e }) => /* @__PURE__ */ j(we, { children: [
  /* @__PURE__ */ j("a", { role: "button", className: "carousel-control-prev", onClick: () => e("prev"), children: [
    /* @__PURE__ */ a("span", { className: "carousel-control-prev-icon" }),
    /* @__PURE__ */ a("span", { className: "visually-hidden", children: "Previous" })
  ] }),
  /* @__PURE__ */ j("a", { role: "button", className: "carousel-control-next", onClick: () => e("next"), children: [
    /* @__PURE__ */ a("span", { className: "carousel-control-next-icon" }),
    /* @__PURE__ */ a("span", { className: "visually-hidden", children: "Next" })
  ] })
] }), $o = (e) => {
  const t = getComputedStyle(e), n = getComputedStyle(e == null ? void 0 : e.parentNode);
  return t.display !== "none" && n.display !== "none" && t.visibility !== "hidden";
}, Ro = (e) => Array.from(e == null ? void 0 : e.querySelectorAll(".carousel-item")), Ho = (e) => e.offsetHeight, Wo = (e, t, n = !0) => {
  if (!n) {
    Hn(e);
    return;
  }
  const s = Po(t);
  t.addEventListener("transitionend", () => Hn(e), { once: !0 }), Co(t, s);
}, Hn = (e) => {
  typeof e == "function" && e();
}, Po = (e) => {
  if (!e)
    return 0;
  let { transitionDuration: t, transitionDelay: n } = window.getComputedStyle(e);
  const s = Number.parseFloat(t), r = Number.parseFloat(n);
  return !s && !r ? 0 : (t = t.split(",")[0], n = n.split(",")[0], (Number.parseFloat(t) + Number.parseFloat(n)) * 1e3);
}, Yo = (e) => {
  e.dispatchEvent(new Event("transitionend"));
}, Co = (e, t) => {
  let n = !1;
  const r = t + 5;
  function o() {
    n = !0, e.removeEventListener("transitionend", o);
  }
  e.addEventListener("transitionend", o), setTimeout(() => {
    n || Yo(e);
  }, r);
}, gi = ({
  fade: e = !1,
  className: t,
  carouselInnerClassName: n,
  dark: s,
  children: r,
  interval: o = 5e3,
  keyboard: c = !1,
  touch: l = !0,
  showControls: i,
  showIndicators: d,
  onSlide: u,
  ...m
}) => {
  const f = Z([]), p = Z(null), g = Z(0), b = Z(!1), [h, y] = N(0), [v, k] = N(0), [w, S] = N({ initialX: 0, initialY: 0 }), [L, E] = N(!1), M = Z(null), q = x("carousel", "slide", e && "carousel-fade", s && "carousel-dark", t), Y = x("carousel-inner", n), R = X(
    (T, $) => {
      if ($ !== void 0)
        g.current = $, y($);
      else {
        const P = h === v - 1 ? 0 : h + 1, re = h === 0 ? v - 1 : h - 1;
        g.current = T === "next" ? P : re, y(T === "next" ? P : re);
      }
    },
    [h, v]
  ), H = X(() => {
    p.current && (clearInterval(p.current), p.current = null);
  }, []), G = X(
    (T, $, P) => {
      var Ee;
      if (!f.current || f.current.length < 2)
        return;
      E(!0);
      const ie = f.current[h], fe = Boolean(p.current), ne = T === "next", be = ne ? "carousel-item-start" : "carousel-item-end", ae = ne ? "carousel-item-next" : "carousel-item-prev";
      if ($.classList.contains("active")) {
        b.current = !1;
        return;
      }
      R(T, P), !(!ie || !$) && (b.current = !0, fe && H(), (Ee = M.current) != null && Ee.classList.contains("slide") ? ($.classList.add(ae), Ho($), ie.classList.add(be), $.classList.add(be), Wo(() => {
        E(!1), $.classList.remove(be, ae), $.classList.add("active"), ie.classList.remove("active", ae, be), b.current = !1;
      }, ie, !0)) : (ie.classList.remove("active"), $.classList.add("active"), b.current = !1));
    },
    [M, h, R, H]
  ), B = (T) => {
    b.current || (b.current = !0, setTimeout(() => {
      b.current = !1;
    }, T));
  }, U = X(
    (T) => {
      const $ = T === "prev", ie = (g.current + ($ ? -1 : 1)) % v, fe = f.current;
      return ie === -1 ? fe[v - 1] : fe[ie];
    },
    [v]
  ), _ = (T) => {
    const $ = g.current, P = T > $ ? "next" : "prev", re = f.current;
    return { direction: P, nextElement: re[T] };
  }, z = (T) => {
    if (b.current || (B(700), T > v - 1 || T < 0))
      return;
    const { direction: $, nextElement: P } = _(T);
    G($, P, T);
  }, F = X(
    (T) => {
      if (b.current)
        return;
      B(600);
      const $ = U(T);
      G(T, $);
    },
    [U, G]
  ), V = X(() => {
    const { visibilityState: T, hidden: $ } = document;
    if (T)
      return $ || !$o(M.current) ? void 0 : F("next");
    F("next");
  }, [M, F]), C = X(() => {
    var $, P;
    const T = (P = ($ = r == null ? void 0 : r[h]) == null ? void 0 : $.props) == null ? void 0 : P.interval;
    p.current && (clearInterval(p.current), p.current = null), p.current = setInterval(V, T || o);
  }, [V, o, r, h]), W = (T) => {
    l && S({ initialX: T.touches[0].clientX, initialY: T.touches[0].clientY });
  }, J = (T) => {
    b.current = !0;
    const { initialX: $, initialY: P } = w;
    if (!$ || !P)
      return;
    const re = T.touches[0].clientX, ie = T.touches[0].clientY, fe = $ - re, ne = P - ie;
    Math.abs(fe) > Math.abs(ne) && (fe > 0 ? F("prev") : F("next")), S({ initialX: 0, initialY: 0 });
  }, O = () => {
    b.current = !1;
  }, Q = X(
    (T) => {
      switch (T.key) {
        case "ArrowLeft":
          T.preventDefault(), F("prev");
          break;
        case "ArrowRight":
          T.preventDefault(), F("next");
          break;
      }
    },
    [F]
  );
  return D(() => {
    if (c)
      return window.addEventListener("keydown", Q), () => {
        window.removeEventListener("keydown", Q);
      };
  }, [Q, c]), D(() => {
    const T = M.current, $ = Ro(T);
    f.current = $, k($.length);
  }, [M]), D(() => {
    L && (u == null || u());
  }, [L, u]), D(() => (C(), () => {
    H();
  }), [C, H]), /* @__PURE__ */ a(
    "div",
    {
      onTouchStart: W,
      onTouchMove: J,
      onTouchEnd: O,
      onMouseEnter: H,
      onMouseLeave: C,
      className: q,
      ref: M,
      ...m,
      children: /* @__PURE__ */ a("div", { className: Y, children: /* @__PURE__ */ j(bn.Provider, { value: { active: h }, children: [
        d && /* @__PURE__ */ a(Io, { to: z, imagesCount: v }),
        r,
        i && /* @__PURE__ */ a(Ao, { move: F })
      ] }) })
    }
  );
}, yi = ({ className: e, children: t, itemId: n, ...s }) => {
  const { active: r } = Ye(bn), o = Z(!0), c = Z(null), l = x("carousel-item", e);
  return D(() => {
    if (o.current && r === n - 1) {
      const i = c.current;
      i == null || i.classList.add("active");
    }
    o.current = !1;
  }, [r, n]), /* @__PURE__ */ a("div", { className: l, ref: c, ...s, children: t });
}, wi = ({ className: e, children: t, ...n }) => {
  const s = x("carousel-caption d-none d-md-block", e);
  return /* @__PURE__ */ a("div", { className: s, ...n, children: t });
}, Ts = se.createContext({
  activeItem: 0,
  setActiveItem: null,
  alwaysOpen: !1,
  initialActive: 0
}), Xo = se.forwardRef(
  ({
    alwaysOpen: e,
    borderless: t,
    className: n,
    flush: s,
    active: r,
    initialActive: o = 0,
    tag: c = "div",
    children: l,
    onChange: i,
    ...d
  }, u) => {
    const m = Fe(() => typeof r < "u", [r]), f = x("accordion", s && "accordion-flush", t && "accordion-borderless", n), [p, g] = N(o);
    return /* @__PURE__ */ a(c, { className: f, ref: u, ...d, children: /* @__PURE__ */ a(
      Ts.Provider,
      {
        value: { activeItem: m ? r : p, setActiveItem: g, alwaysOpen: e, initialActive: o, onChange: i },
        children: l
      }
    ) });
  }
);
Xo.displayName = "MDBAccordion";
const Fo = se.forwardRef(
  ({
    className: e,
    bodyClassName: t,
    bodyStyle: n,
    headerClassName: s,
    collapseId: r,
    headerTitle: o,
    headerStyle: c,
    btnClassName: l,
    tag: i = "div",
    children: d,
    ...u
  }, m) => {
    const { activeItem: f, setActiveItem: p, alwaysOpen: g, onChange: b } = Ye(Ts), h = Fe(() => Array.isArray(f) ? f.includes(r) : f === r, [f, r]), y = x("accordion-item", e), v = x("accordion-header", s), k = x("accordion-body", t), w = x("accordion-button", !h && "collapsed", l), S = X(
      (L) => {
        let E = L;
        Array.isArray(f) ? f.includes(L) ? E = f.filter((q) => q !== L) : E = g ? [...f, L] : [L] : (E = f === L ? 0 : L, g && (E = [E])), b == null || b(E), p(E);
      },
      [b, f, p, g]
    );
    return /* @__PURE__ */ j(i, { className: y, ref: m, ...u, children: [
      /* @__PURE__ */ a("h2", { className: v, style: c, children: /* @__PURE__ */ a("button", { onClick: () => S(r), className: w, type: "button", children: o }) }),
      /* @__PURE__ */ a(Ms, { id: r.toString(), open: h, children: /* @__PURE__ */ a("div", { className: k, style: n, children: d }) })
    ] });
  }
);
Fo.displayName = "MDBAccordionItem";
const Ni = ({
  className: e,
  size: t,
  contrast: n,
  value: s,
  defaultValue: r,
  id: o,
  labelClass: c,
  wrapperClass: l,
  wrapperStyle: i,
  wrapperTag: d = "div",
  label: u,
  onChange: m,
  children: f,
  labelRef: p,
  labelStyle: g,
  inputRef: b,
  onBlur: h,
  readonly: y = !1,
  ...v
}) => {
  var V;
  const k = Z(null), w = Z(null), S = p || k, L = b || w, [E, M] = N(s || r), [q, Y] = N(0), [R, H] = N(
    s !== void 0 && s.length > 0 || r !== void 0 && r.length > 0
  ), G = x("form-outline", n && "form-white", l), B = x("form-control", R && "active", t && `form-control-${t}`, e), U = x("form-label", c);
  D(() => {
    var C;
    S.current && ((C = S.current) == null ? void 0 : C.clientWidth) !== 0 && Y(S.current.clientWidth * 0.8 + 8);
  }, [S, (V = S.current) == null ? void 0 : V.clientWidth]);
  const _ = () => {
    S.current && Y(S.current.clientWidth * 0.8 + 8);
  };
  D(() => {
    s !== void 0 && (s.length > 0 ? H(!0) : H(!1));
  }, [s]), D(() => {
    r !== void 0 && (r.length > 0 ? H(!0) : H(!1));
  }, [r]);
  const z = (C) => {
    M(C.currentTarget.value), m && m(C);
  }, F = X(
    (C) => {
      E !== void 0 && E.length > 0 || s !== void 0 && s.length > 0 ? H(!0) : H(!1), h && h(C);
    },
    [E, s, h]
  );
  return /* @__PURE__ */ j(d, { className: G, style: { ...i }, children: [
    /* @__PURE__ */ a(
      "textarea",
      {
        readOnly: y,
        className: B,
        onBlur: F,
        onChange: z,
        onFocus: _,
        defaultValue: r,
        value: s,
        id: o,
        ref: L,
        ...v
      }
    ),
    u && /* @__PURE__ */ a("label", { className: U, style: g, htmlFor: o, ref: S, children: u }),
    /* @__PURE__ */ j("div", { className: "form-notch", children: [
      /* @__PURE__ */ a("div", { className: "form-notch-leading" }),
      /* @__PURE__ */ a("div", { className: "form-notch-middle", style: { width: q } }),
      /* @__PURE__ */ a("div", { className: "form-notch-trailing" })
    ] }),
    f
  ] });
}, ki = ({
  children: e,
  invalid: t,
  feedback: n = "Looks good!",
  tooltip: s,
  tag: r = "div",
  ...o
}) => {
  const [c, l] = N(null), i = Z(null), d = x(
    t ? `invalid-${s ? "tooltip" : "feedback"}` : `valid-${s ? "tooltip" : "feedback"}`
  );
  return D(() => {
    var m, f;
    const u = (f = (m = i.current) == null ? void 0 : m.querySelector("input, textarea")) == null ? void 0 : f.parentElement;
    u && l(u);
  }, []), /* @__PURE__ */ j(r, { ref: i, ...o, children: [
    c && bs(/* @__PURE__ */ a("div", { className: d, children: n }), c),
    e
  ] });
}, Mi = ({ children: e }) => {
  const [t, n] = N(!1);
  return D(() => {
    n(!0);
  }, []), /* @__PURE__ */ a(we, { children: t ? e : null });
}, Ls = se.forwardRef(
  ({ className: e, open: t, tag: n = "div", children: s, ...r }, o) => {
    const c = x("select-dropdown", t && "open", e);
    return /* @__PURE__ */ a(n, { className: c, ...r, ref: o, children: s });
  }
);
Ls.displayName = "MDBSelectDropdown";
const Bs = se.forwardRef(
  ({ className: e, tag: t = "span", children: n, ...s }, r) => {
    const o = x("select-option-icon-container", e);
    return /* @__PURE__ */ a(t, { className: o, ...s, ref: r, children: n });
  }
);
Bs.displayName = "MDBSelectIconContainer";
const Wn = ({
  className: e,
  tag: t = "span",
  disabled: n,
  height: s,
  active: r,
  children: o,
  selected: c,
  style: l,
  secondaryText: i,
  text: d,
  revert: u = !1,
  onClick: m,
  multiple: f,
  ...p
}) => {
  const g = x(
    e !== void 0 && (e != null && e.includes("select-no-results")) ? "" : "select-option",
    c && "selected",
    n && "disabled",
    r && "active",
    e
  ), [b, h] = N(s), [y, v] = N(!1);
  D(() => {
    i && s === void 0 ? h(44) : s === void 0 && h(38);
  }, [i, s]);
  const k = X(
    (w) => {
      n || (m && m(w), v(!y));
    },
    [y, n, m]
  );
  return D(() => {
    f && v(!!(c && !n));
  }, [c, n, f]), /* @__PURE__ */ a(
    t,
    {
      className: g,
      style: { height: b, ...l },
      onClick: k,
      ...p,
      role: "option",
      children: u ? /* @__PURE__ */ j(we, { children: [
        o,
        /* @__PURE__ */ j("div", { className: "select-option-text", children: [
          f && /* @__PURE__ */ a(Yt, { label: d, onChange: k, checked: y, disabled: n }),
          !f && d,
          i && /* @__PURE__ */ a("span", { className: "select-option-secondary-text", children: i })
        ] })
      ] }) : /* @__PURE__ */ j(we, { children: [
        /* @__PURE__ */ j("div", { className: "select-option-text", children: [
          f && /* @__PURE__ */ a(Yt, { label: d, onChange: k, checked: y, disabled: n }),
          !f && d,
          i && /* @__PURE__ */ a("span", { className: "select-option-secondary-text", children: i })
        ] }),
        o
      ] })
    }
  );
}, Ss = se.forwardRef(
  ({ className: e, tag: t = "img", children: n, ...s }, r) => {
    const o = x("select-option-icon", e);
    return /* @__PURE__ */ a(t, { className: o, ...s, ref: r, children: n });
  }
);
Ss.displayName = "MDBSelectOptionIcon";
const Is = se.forwardRef(
  ({ className: e, tag: t = "div", children: n, ...s }, r) => {
    const o = x("select-options-list", e);
    return /* @__PURE__ */ a(t, { className: o, ...s, ref: r, children: n });
  }
);
Is.displayName = "MDBSelectOptionsList";
const As = se.forwardRef(({ className: e, tag: t = "div", children: n, maxHeight: s, ...r }, o) => {
  const c = x("select-options-wrapper", e);
  return /* @__PURE__ */ a(t, { className: c, style: { maxHeight: s }, ...r, ref: o, children: n });
});
As.displayName = "MDBSelectOptionsWrapper";
const xi = ({
  children: e,
  className: t,
  clearBtn: n,
  data: s,
  tag: r = "div",
  tagWrapper: o = "div",
  visibleOptions: c = 5,
  placeholder: l,
  disabled: i,
  search: d,
  getValue: u,
  multiple: m,
  optionSelected: f = "5",
  optionsSelectedLabel: p,
  label: g,
  getData: b,
  selectAllLabel: h = "Select all",
  noResultLabel: y = "No results",
  searchLabel: v = "Search...",
  size: k = "default",
  validation: w = !1,
  validFeedback: S,
  invalidFeedback: L,
  inputClassName: E,
  searchAriaLabel: M = "Search",
  ...q
}) => {
  const [Y, R] = N(!1), [H, G] = N(""), [B, U] = N(!1), [_, z] = N(!1), [F, V] = N(""), C = Z(null), [W, J] = N(null), [O, Q] = N(s), [T, $] = N(""), [P, re] = N(!1), [ie, fe] = N([]), [ne, be] = N(!1), [ae, Ee] = N(s), [me, Ne] = N(), [he, Te] = N(), [ge, De] = N(O.findIndex((K) => !K.disabled && K.selected)), pe = Z(null), [ke, de] = N(!1), je = Z(null), [Se, qe] = N(0), [lt, ot] = N(!1), [Ze, et] = N(!1), tt = Z(null), { styles: at, attributes: ut } = kt(me, he, {
    placement: "bottom-start"
  }), ct = x("select-wrapper", t), Ve = x(
    "select-input",
    l && "placeholder-active",
    P && g && "active",
    Y && "focused",
    k !== "default" && `form-control-${k}`,
    E
  );
  D(() => {
    Q(s), Ee(s);
    const K = s.filter((te) => te.selected === !0 && !te.disabled);
    K.length > 0 && V(K[0].text);
  }, [s]), D(() => {
    const K = [];
    O.forEach((te) => {
      te.selected && K.push({ text: te.text, value: te.value });
    }), u && K && u(m ? K : K[0]);
  }, [F]), D(() => {
    B && d && setTimeout(() => {
      var K;
      (K = je.current) == null || K.focus();
    }, 100);
  }, [B, d]);
  const Ge = X(() => {
    me != null && B && setTimeout(() => {
      var te;
      const K = (te = me.parentNode) == null ? void 0 : te.parentNode.getBoundingClientRect();
      G(K.width);
    }, 100);
  }, [me, B]);
  D(() => {
    var K, te;
    if (!(!S || !L) && me) {
      if (S) {
        const ce = document.createElement("div");
        ce.classList.add("valid-feedback"), ce.innerHTML = S, me.setAttribute("required", "true"), (K = me.parentNode) == null || K.insertBefore(ce, me.nextSibling);
      }
      if (L) {
        const ce = document.createElement("div");
        ce.classList.add("invalid-feedback"), ce.innerHTML = L, me.setAttribute("required", "true"), (te = me.parentNode) == null || te.insertBefore(ce, me.nextSibling);
      }
    }
  }, [S, L, me]), D(() => {
    Ge();
  }, [Ge]);
  const nt = X(
    (K) => {
      he && he !== null && Y && me && me !== null && (!he.contains(K.target) && !me.contains(K.target) ? (R(!1), re(!1), d && setTimeout(() => {
        $("");
      }, 100)) : re(!0));
    },
    [Y, he, me, d]
  ), A = X(() => {
    R(!Y), d && $("");
  }, [Y, d]), le = () => {
    V(""), re(!1), Q(
      s.map((K) => ({ ...K, active: !1, selected: !1 }))
    ), Ee(
      s.map((K) => ({ ...K, active: !1, selected: !1 }))
    );
  }, Me = () => {
    be(!ne);
  };
  D(() => {
    let K;
    if (ke && !B && Se !== void 0)
      if (m)
        R(!0);
      else {
        const te = s.map((ve, Ae) => Ae === Se ? { ...ve, selected: !0, active: !0 } : { ...ve, selected: !1, active: !1 });
        Se <= 0 ? V(te[0].text) : Se >= te.length - 1 ? V(te[te.length - 1].text) : V(te[Se].text);
        const ce = [];
        for (let ve = 0; ve < s.length; ve++)
          ce.push({
            // eslint-disable-next-line
            // @ts-ignore
            ...s[ve],
            ...te.find((Ae) => Ae.text === s[ve].text)
          });
        b && b(ce), Ee(ce), Q(ce);
      }
    return () => {
      clearTimeout(K);
    };
  }, [Se]), D(() => {
    let K, te;
    return Y ? (U(!0), g && re(!0), te = setTimeout(() => {
      z(!0);
    }, 100)) : (K = setTimeout(() => {
      U(!1);
    }, 100), g && re(!1), z(!1)), () => {
      clearTimeout(K), clearTimeout(te);
    };
  }, [Y, g]), D(() => {
    if (m)
      if (ne) {
        const K = O.map((ce) => ({ ...ce, selected: !0, active: !0 }));
        Q(K);
        const te = K.filter((ce) => !ce.disabled).map((ce) => ce.text);
        fe(te), V(`${te.length} option${te.length <= 1 ? "" : "s"} selected`);
      } else {
        Q(ae);
        const K = ae.filter((te) => !te.disabled && te.selected).map((te) => te.text);
        fe(K), V(`${K.length} option${K.length <= 1 ? "" : "s"} selected`);
      }
  }, [ne]), D(() => {
    m && (ie.length >= Number(f) ? V(p || `${ie.length} option${ie.length <= 1 ? "" : "s"} selected`) : V(ie.join(", ")));
  }, [ie, m, f, p]), D(() => {
    if (m) {
      const K = s.map((ce) => ce.selected === void 0 ? { ...ce, active: !1, selected: !1 } : { ...ce, active: !0 });
      Q(K);
      const te = ae.filter((ce) => ce.selected === !0 && !ce.disabled).map((ce) => ce.text);
      fe(te), ie.length >= Number(f) ? V(`${ie.length} option${ie.length <= 1 ? "" : "s"} selected`) : V(ie.join(", "));
    } else {
      const K = O.map((ce) => ce.selected === void 0 ? { ...ce, active: !1, selected: !1 } : { ...ce, active: !0 }), te = K.filter((ce) => ce.selected === !0 && !ce.disabled);
      te.length > 0 && (Q(K), V(te[0].text)), b && b(K);
    }
  }, []), D(() => (B && window.addEventListener("resize", Ge), () => {
    window.removeEventListener("resize", Ge);
  }), [Ge, B]), D(() => (B && window.addEventListener("click", nt), () => {
    window.removeEventListener("click", nt);
  }), [nt, B]);
  const I = X(
    (K, te, ce = c) => ([...K].slice(0, ce).forEach((ve) => {
      const { height: Ae } = getComputedStyle(ve);
      te.push(parseFloat(Ae));
    }), te),
    [c]
  );
  D(() => {
    var te;
    let K;
    if (B) {
      const ce = (te = C.current) == null ? void 0 : te.children, ve = [];
      K = setTimeout(() => {
        ce !== void 0 && (I(ce, ve), J(ve.reduce((Ae, Pe) => Ae + Pe)));
      }, 0);
    }
    return () => {
      clearTimeout(K);
    };
  }, [B, c, I]);
  const ue = X(
    ({ disabled: K, className: te, text: ce, selected: ve }, Ae) => {
      if (!(K || te !== void 0 && te.includes("select-no-results")))
        if (m)
          O[Ae].selected = !O[Ae].selected, Q(O), Ee(O), ce !== void 0 && (!ve || ve === void 0) ? fe([...ie, ce]) : ce !== void 0 && ve && fe(ie.filter((Pe) => Pe !== ce));
        else {
          De(Ae), V(ce), R(!1);
          const Pe = O.map((Be, ee) => (ee !== Ae ? (Be.selected = !1, Be.active = !1) : (Be.selected = !0, Be.active = !0), Be)), Ce = s.map((Be) => ({ ...Be, active: !1, selected: !1 })), Re = [];
          for (let Be = 0; Be < Ce.length; Be++)
            Re.push({
              ...Ce[Be],
              ...Pe.find((ee) => ee.text === Ce[Be].text)
            });
          Q(Re), Ee(Re), b && b(Re);
        }
    },
    [s, O, b, m, ie]
  ), Ie = X((K, te, ce) => {
    let ve = 0;
    return ce ? (ve = K - 1, ve < 0 && (ve = 0), te[ve].disabled && (ve = Ie(ve, te, !0))) : (ve = K + 1, ve > te.length - 1 && (ve = te.length - 1), te[ve].disabled && (ve = Ie(ve, te, !1))), ve;
  }, []), Xe = X(
    (K) => {
      const { key: te } = K;
      if (te !== "Escape" && te !== "ArrowDown" && te !== "ArrowUp" && te !== "Enter")
        return;
      let ce, ve, Ae;
      if (K.preventDefault(), te === "Escape" && (ce = setTimeout(() => {
        U(!1), d && $("");
      }, 100), R(!1), z(!1)), K.altKey && te === "ArrowDown" || K.altKey && te === "ArrowUp") {
        R(!Y), z(!_);
        return;
      }
      if (te === "ArrowDown") {
        const Pe = B ? O.findIndex((Re) => Re.active) : O.findIndex((Re) => Re.selected), Ce = Ie(Pe, O, !1);
        B ? (ot(!1), et(!0), De(Ce)) : qe(Ce);
      }
      if (te === "ArrowUp") {
        const Pe = B ? O.findIndex((Re) => Re.active) : O.findIndex((Re) => Re.selected), Ce = Ie(Pe, O, !0);
        B ? (ot(!0), et(!1), De(Ce)) : qe(Ce);
      }
      if (te === "Enter")
        if (!B)
          ve = setTimeout(() => {
            U(!0), R(!0), z(!0);
          }, 100);
        else if (m) {
          const Pe = O.findIndex((Ce) => Ce.active);
          ue(O[Pe], Pe);
        } else {
          Ae = setTimeout(() => {
            U(!1), d && $("");
          }, 100);
          const Pe = O.filter((Be) => Be.active && !Be.disabled)[0], Ce = O.findIndex((Be) => Be.active && !Be.disabled), Re = ae.map((Be, ee) => ee === Ce ? { ...Be, selected: !0 } : { ...Be, selected: !1 });
          V(Pe.text), R(!1), z(!1), Q(Re), Ee(Re);
        }
      return () => {
        clearTimeout(ce), clearTimeout(ve), clearTimeout(Ae);
      };
    },
    [d, O, m, ue, ae, B, Ie, _, Y]
  );
  D(() => {
    var ve;
    const K = tt.current;
    if (C === null)
      return;
    const te = [], ce = [];
    if (B) {
      const Ae = (ve = C.current) == null ? void 0 : ve.children;
      setTimeout(() => {
        if (I(Ae, te, s.length), I(Ae, ce, ge), ce.length === 0)
          return;
        const Pe = ce.reduce((Ce, Re) => Ce + Re);
        W === null || K === null || Pe > Number(W) && (K.scrollTop = Pe);
      }, 100);
    }
  }, [B, ge]), D(() => {
    var ve;
    const K = tt.current;
    if (C === null)
      return;
    const te = [], ce = [];
    if (B) {
      const Ae = (ve = C.current) == null ? void 0 : ve.children;
      setTimeout(() => {
        I(Ae, te, s.length), I(Ae, ce, ge + 2);
        const Pe = te.reduce((Be, ee) => Be + ee), Ce = ce.reduce((Be, ee) => Be + ee), Re = O.map((Be, ee) => ee === ge ? { ...Be, active: !0 } : { ...Be, active: !1 });
        Q(Re), !(W === null || K === null) && (Ze && (Ce > Number(W) ? K.scrollTop = Ce - W : K.scrollTop = 0), lt && (Ce <= Number(W) ? K.scrollTop = Ce - 38 * 2 : K.scrollTop = Pe));
      }, 100);
    }
  }, [B, s, Ze, lt, I, ge, W]), D(() => (ke && window.addEventListener("keydown", Xe), () => {
    window.removeEventListener("keydown", Xe);
  }), [ke, Xe]), D(() => {
    if (!m)
      return;
    const K = O.filter((ce) => ce.selected && !ce.disabled), te = O.filter((ce) => !ce.disabled);
    K.length !== te.length ? be(!1) : be(!0);
  }, [O, m]);
  const Qe = () => O.map((K, te) => /* @__PURE__ */ a(
    Wn,
    {
      onClick: () => ue(K, te),
      onChange: () => ue(K, te),
      "data-value": K.value,
      active: K.active,
      className: K.className,
      height: K.height,
      style: K.style,
      selected: K.selected,
      disabled: K.disabled,
      secondaryText: K.secondaryText,
      text: K.text,
      revert: K.revert,
      multiple: m,
      children: K.icon && /* @__PURE__ */ a(Bs, { children: typeof K.icon == "object" && K.icon.constructor === Object && !se.isValidElement(K.icon) ? /* @__PURE__ */ a(Ss, { className: K.icon.className, src: K.icon.src ? K.icon.src : "", children: K.icon.text }) : K.icon })
    },
    K.text + te
  )), _e = (K) => {
    $(K.target.value);
  };
  return Fe(() => {
    if (B && d) {
      const K = ae.filter((te) => te.text.toLowerCase().includes(T.toLowerCase()));
      K.length === 0 ? Q([{ text: y, className: "select-no-results" }]) : Q(K);
    }
  }, [B, ae, d, y, T]), /* @__PURE__ */ j(r, { className: ct, ref: pe, children: [
    /* @__PURE__ */ j(
      wt,
      {
        onFocus: () => de(!0),
        onBlur: () => de(!1),
        value: F,
        className: Ve,
        labelClass: x(Y ? "select-input-label-active" : "", "select-label"),
        ref: Ne,
        onClick: A,
        readOnly: !w,
        required: w,
        placeholder: l,
        disabled: i,
        wrapperStyle: { zIndex: 0 },
        label: g,
        "aria-expanded": !!B,
        "aria-disabled": !!i,
        "aria-haspopup": !0,
        role: "listbox",
        ...q,
        children: [
          F !== void 0 && F.length > 0 && n && /* @__PURE__ */ a("span", { className: "select-clear-btn d-block", role: "button", onClick: le, children: "✕" }),
          /* @__PURE__ */ a("span", { className: "select-arrow", style: { zIndex: -1 } })
        ]
      }
    ),
    B && ar.createPortal(
      /* @__PURE__ */ a(
        o,
        {
          style: { ...at.popper, width: H, zIndex: 1070 },
          ...ut.popper,
          ref: Te,
          className: "select-dropdown-container",
          children: /* @__PURE__ */ j(Ls, { open: _, children: [
            d && /* @__PURE__ */ a("div", { className: "input-group", children: /* @__PURE__ */ a(
              wt,
              {
                wrapperStyle: { width: "100%" },
                className: "select-filter-input placeholder-active",
                placeholder: v,
                role: "searchbox",
                type: "text",
                onKeyDown: Xe,
                onChange: _e,
                value: T,
                ref: je,
                "aria-label": M
              }
            ) }),
            /* @__PURE__ */ a(As, { ref: tt, maxHeight: W, children: /* @__PURE__ */ j(Is, { ref: C, children: [
              m && /* @__PURE__ */ a(
                Wn,
                {
                  onClick: Me,
                  selected: ne,
                  height: 38,
                  text: h,
                  multiple: !0
                }
              ),
              Qe(),
              e && /* @__PURE__ */ a("div", { className: "select-custom-content", children: e })
            ] }) })
          ] })
        }
      ),
      document.body
    )
  ] });
};
/*!
 * perfect-scrollbar v1.5.3
 * Copyright 2021 Hyunje Jun, MDBootstrap and Contributors
 * Licensed under MIT
 */
function gt(e) {
  return getComputedStyle(e);
}
function dt(e, t) {
  for (var n in t) {
    var s = t[n];
    typeof s == "number" && (s = s + "px"), e.style[n] = s;
  }
  return e;
}
function Ut(e) {
  var t = document.createElement("div");
  return t.className = e, t;
}
var Pn = typeof Element < "u" && (Element.prototype.matches || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector);
function Et(e, t) {
  if (!Pn)
    throw new Error("No element matching method supported");
  return Pn.call(e, t);
}
function Ht(e) {
  e.remove ? e.remove() : e.parentNode && e.parentNode.removeChild(e);
}
function Yn(e, t) {
  return Array.prototype.filter.call(
    e.children,
    function(n) {
      return Et(n, t);
    }
  );
}
var Ue = {
  main: "ps",
  rtl: "ps__rtl",
  element: {
    thumb: function(e) {
      return "ps__thumb-" + e;
    },
    rail: function(e) {
      return "ps__rail-" + e;
    },
    consuming: "ps__child--consume"
  },
  state: {
    focus: "ps--focus",
    clicking: "ps--clicking",
    active: function(e) {
      return "ps--active-" + e;
    },
    scrolling: function(e) {
      return "ps--scrolling-" + e;
    }
  }
}, $s = { x: null, y: null };
function Rs(e, t) {
  var n = e.element.classList, s = Ue.state.scrolling(t);
  n.contains(s) ? clearTimeout($s[t]) : n.add(s);
}
function Hs(e, t) {
  $s[t] = setTimeout(
    function() {
      return e.isAlive && e.element.classList.remove(Ue.state.scrolling(t));
    },
    e.settings.scrollingThreshold
  );
}
function Oo(e, t) {
  Rs(e, t), Hs(e, t);
}
var Kt = function(t) {
  this.element = t, this.handlers = {};
}, Ws = { isEmpty: { configurable: !0 } };
Kt.prototype.bind = function(t, n) {
  typeof this.handlers[t] > "u" && (this.handlers[t] = []), this.handlers[t].push(n), this.element.addEventListener(t, n, !1);
};
Kt.prototype.unbind = function(t, n) {
  var s = this;
  this.handlers[t] = this.handlers[t].filter(function(r) {
    return n && r !== n ? !0 : (s.element.removeEventListener(t, r, !1), !1);
  });
};
Kt.prototype.unbindAll = function() {
  for (var t in this.handlers)
    this.unbind(t);
};
Ws.isEmpty.get = function() {
  var e = this;
  return Object.keys(this.handlers).every(
    function(t) {
      return e.handlers[t].length === 0;
    }
  );
};
Object.defineProperties(Kt.prototype, Ws);
var Xt = function() {
  this.eventElements = [];
};
Xt.prototype.eventElement = function(t) {
  var n = this.eventElements.filter(function(s) {
    return s.element === t;
  })[0];
  return n || (n = new Kt(t), this.eventElements.push(n)), n;
};
Xt.prototype.bind = function(t, n, s) {
  this.eventElement(t).bind(n, s);
};
Xt.prototype.unbind = function(t, n, s) {
  var r = this.eventElement(t);
  r.unbind(n, s), r.isEmpty && this.eventElements.splice(this.eventElements.indexOf(r), 1);
};
Xt.prototype.unbindAll = function() {
  this.eventElements.forEach(function(t) {
    return t.unbindAll();
  }), this.eventElements = [];
};
Xt.prototype.once = function(t, n, s) {
  var r = this.eventElement(t), o = function(c) {
    r.unbind(n, o), s(c);
  };
  r.bind(n, o);
};
function Gt(e) {
  if (typeof window.CustomEvent == "function")
    return new CustomEvent(e);
  var t = document.createEvent("CustomEvent");
  return t.initCustomEvent(e, !1, !1, void 0), t;
}
function en(e, t, n, s, r) {
  s === void 0 && (s = !0), r === void 0 && (r = !1);
  var o;
  if (t === "top")
    o = [
      "contentHeight",
      "containerHeight",
      "scrollTop",
      "y",
      "up",
      "down"
    ];
  else if (t === "left")
    o = [
      "contentWidth",
      "containerWidth",
      "scrollLeft",
      "x",
      "left",
      "right"
    ];
  else
    throw new Error("A proper axis should be provided");
  Vo(e, n, o, s, r);
}
function Vo(e, t, n, s, r) {
  var o = n[0], c = n[1], l = n[2], i = n[3], d = n[4], u = n[5];
  s === void 0 && (s = !0), r === void 0 && (r = !1);
  var m = e.element;
  e.reach[i] = null, m[l] < 1 && (e.reach[i] = "start"), m[l] > e[o] - e[c] - 1 && (e.reach[i] = "end"), t && (m.dispatchEvent(Gt("ps-scroll-" + i)), t < 0 ? m.dispatchEvent(Gt("ps-scroll-" + d)) : t > 0 && m.dispatchEvent(Gt("ps-scroll-" + u)), s && Oo(e, i)), e.reach[i] && (t || r) && m.dispatchEvent(Gt("ps-" + i + "-reach-" + e.reach[i]));
}
function Oe(e) {
  return parseInt(e, 10) || 0;
}
function jo(e) {
  return Et(e, "input,[contenteditable]") || Et(e, "select,[contenteditable]") || Et(e, "textarea,[contenteditable]") || Et(e, "button,[contenteditable]");
}
function Ko(e) {
  var t = gt(e);
  return Oe(t.width) + Oe(t.paddingLeft) + Oe(t.paddingRight) + Oe(t.borderLeftWidth) + Oe(t.borderRightWidth);
}
var Rt = {
  isWebKit: typeof document < "u" && "WebkitAppearance" in document.documentElement.style,
  supportsTouch: typeof window < "u" && ("ontouchstart" in window || "maxTouchPoints" in window.navigator && window.navigator.maxTouchPoints > 0 || window.DocumentTouch && document instanceof window.DocumentTouch),
  supportsIePointer: typeof navigator < "u" && navigator.msMaxTouchPoints,
  isChrome: typeof navigator < "u" && /Chrome/i.test(navigator && navigator.userAgent)
};
function Nt(e) {
  var t = e.element, n = Math.floor(t.scrollTop), s = t.getBoundingClientRect();
  e.containerWidth = Math.round(s.width), e.containerHeight = Math.round(s.height), e.contentWidth = t.scrollWidth, e.contentHeight = t.scrollHeight, t.contains(e.scrollbarXRail) || (Yn(t, Ue.element.rail("x")).forEach(
    function(r) {
      return Ht(r);
    }
  ), t.appendChild(e.scrollbarXRail)), t.contains(e.scrollbarYRail) || (Yn(t, Ue.element.rail("y")).forEach(
    function(r) {
      return Ht(r);
    }
  ), t.appendChild(e.scrollbarYRail)), !e.settings.suppressScrollX && e.containerWidth + e.settings.scrollXMarginOffset < e.contentWidth ? (e.scrollbarXActive = !0, e.railXWidth = e.containerWidth - e.railXMarginWidth, e.railXRatio = e.containerWidth / e.railXWidth, e.scrollbarXWidth = Cn(
    e,
    Oe(e.railXWidth * e.containerWidth / e.contentWidth)
  ), e.scrollbarXLeft = Oe(
    (e.negativeScrollAdjustment + t.scrollLeft) * (e.railXWidth - e.scrollbarXWidth) / (e.contentWidth - e.containerWidth)
  )) : e.scrollbarXActive = !1, !e.settings.suppressScrollY && e.containerHeight + e.settings.scrollYMarginOffset < e.contentHeight ? (e.scrollbarYActive = !0, e.railYHeight = e.containerHeight - e.railYMarginHeight, e.railYRatio = e.containerHeight / e.railYHeight, e.scrollbarYHeight = Cn(
    e,
    Oe(e.railYHeight * e.containerHeight / e.contentHeight)
  ), e.scrollbarYTop = Oe(
    n * (e.railYHeight - e.scrollbarYHeight) / (e.contentHeight - e.containerHeight)
  )) : e.scrollbarYActive = !1, e.scrollbarXLeft >= e.railXWidth - e.scrollbarXWidth && (e.scrollbarXLeft = e.railXWidth - e.scrollbarXWidth), e.scrollbarYTop >= e.railYHeight - e.scrollbarYHeight && (e.scrollbarYTop = e.railYHeight - e.scrollbarYHeight), qo(t, e), e.scrollbarXActive ? t.classList.add(Ue.state.active("x")) : (t.classList.remove(Ue.state.active("x")), e.scrollbarXWidth = 0, e.scrollbarXLeft = 0, t.scrollLeft = e.isRtl === !0 ? e.contentWidth : 0), e.scrollbarYActive ? t.classList.add(Ue.state.active("y")) : (t.classList.remove(Ue.state.active("y")), e.scrollbarYHeight = 0, e.scrollbarYTop = 0, t.scrollTop = 0);
}
function Cn(e, t) {
  return e.settings.minScrollbarLength && (t = Math.max(t, e.settings.minScrollbarLength)), e.settings.maxScrollbarLength && (t = Math.min(t, e.settings.maxScrollbarLength)), t;
}
function qo(e, t) {
  var n = { width: t.railXWidth }, s = Math.floor(e.scrollTop);
  t.isRtl ? n.left = t.negativeScrollAdjustment + e.scrollLeft + t.containerWidth - t.contentWidth : n.left = e.scrollLeft, t.isScrollbarXUsingBottom ? n.bottom = t.scrollbarXBottom - s : n.top = t.scrollbarXTop + s, dt(t.scrollbarXRail, n);
  var r = { top: s, height: t.railYHeight };
  t.isScrollbarYUsingRight ? t.isRtl ? r.right = t.contentWidth - (t.negativeScrollAdjustment + e.scrollLeft) - t.scrollbarYRight - t.scrollbarYOuterWidth - 9 : r.right = t.scrollbarYRight - e.scrollLeft : t.isRtl ? r.left = t.negativeScrollAdjustment + e.scrollLeft + t.containerWidth * 2 - t.contentWidth - t.scrollbarYLeft - t.scrollbarYOuterWidth : r.left = t.scrollbarYLeft + e.scrollLeft, dt(t.scrollbarYRail, r), dt(t.scrollbarX, {
    left: t.scrollbarXLeft,
    width: t.scrollbarXWidth - t.railBorderXWidth
  }), dt(t.scrollbarY, {
    top: t.scrollbarYTop,
    height: t.scrollbarYHeight - t.railBorderYWidth
  });
}
function _o(e) {
  e.element, e.event.bind(e.scrollbarY, "mousedown", function(t) {
    return t.stopPropagation();
  }), e.event.bind(e.scrollbarYRail, "mousedown", function(t) {
    var n = t.pageY - window.pageYOffset - e.scrollbarYRail.getBoundingClientRect().top, s = n > e.scrollbarYTop ? 1 : -1;
    e.element.scrollTop += s * e.containerHeight, Nt(e), t.stopPropagation();
  }), e.event.bind(e.scrollbarX, "mousedown", function(t) {
    return t.stopPropagation();
  }), e.event.bind(e.scrollbarXRail, "mousedown", function(t) {
    var n = t.pageX - window.pageXOffset - e.scrollbarXRail.getBoundingClientRect().left, s = n > e.scrollbarXLeft ? 1 : -1;
    e.element.scrollLeft += s * e.containerWidth, Nt(e), t.stopPropagation();
  });
}
function zo(e) {
  Xn(e, [
    "containerWidth",
    "contentWidth",
    "pageX",
    "railXWidth",
    "scrollbarX",
    "scrollbarXWidth",
    "scrollLeft",
    "x",
    "scrollbarXRail"
  ]), Xn(e, [
    "containerHeight",
    "contentHeight",
    "pageY",
    "railYHeight",
    "scrollbarY",
    "scrollbarYHeight",
    "scrollTop",
    "y",
    "scrollbarYRail"
  ]);
}
function Xn(e, t) {
  var n = t[0], s = t[1], r = t[2], o = t[3], c = t[4], l = t[5], i = t[6], d = t[7], u = t[8], m = e.element, f = null, p = null, g = null;
  function b(v) {
    v.touches && v.touches[0] && (v[r] = v.touches[0].pageY), m[i] = f + g * (v[r] - p), Rs(e, d), Nt(e), v.stopPropagation(), v.type.startsWith("touch") && v.changedTouches.length > 1 && v.preventDefault();
  }
  function h() {
    Hs(e, d), e[u].classList.remove(Ue.state.clicking), e.event.unbind(e.ownerDocument, "mousemove", b);
  }
  function y(v, k) {
    f = m[i], k && v.touches && (v[r] = v.touches[0].pageY), p = v[r], g = (e[s] - e[n]) / (e[o] - e[l]), k ? e.event.bind(e.ownerDocument, "touchmove", b) : (e.event.bind(e.ownerDocument, "mousemove", b), e.event.once(e.ownerDocument, "mouseup", h), v.preventDefault()), e[u].classList.add(Ue.state.clicking), v.stopPropagation();
  }
  e.event.bind(e[c], "mousedown", function(v) {
    y(v);
  }), e.event.bind(e[c], "touchstart", function(v) {
    y(v, !0);
  });
}
function Uo(e) {
  var t = e.element, n = function() {
    return Et(t, ":hover");
  }, s = function() {
    return Et(e.scrollbarX, ":focus") || Et(e.scrollbarY, ":focus");
  };
  function r(o, c) {
    var l = Math.floor(t.scrollTop);
    if (o === 0) {
      if (!e.scrollbarYActive)
        return !1;
      if (l === 0 && c > 0 || l >= e.contentHeight - e.containerHeight && c < 0)
        return !e.settings.wheelPropagation;
    }
    var i = t.scrollLeft;
    if (c === 0) {
      if (!e.scrollbarXActive)
        return !1;
      if (i === 0 && o < 0 || i >= e.contentWidth - e.containerWidth && o > 0)
        return !e.settings.wheelPropagation;
    }
    return !0;
  }
  e.event.bind(e.ownerDocument, "keydown", function(o) {
    if (!(o.isDefaultPrevented && o.isDefaultPrevented() || o.defaultPrevented) && !(!n() && !s())) {
      var c = document.activeElement ? document.activeElement : e.ownerDocument.activeElement;
      if (c) {
        if (c.tagName === "IFRAME")
          c = c.contentDocument.activeElement;
        else
          for (; c.shadowRoot; )
            c = c.shadowRoot.activeElement;
        if (jo(c))
          return;
      }
      var l = 0, i = 0;
      switch (o.which) {
        case 37:
          o.metaKey ? l = -e.contentWidth : o.altKey ? l = -e.containerWidth : l = -30;
          break;
        case 38:
          o.metaKey ? i = e.contentHeight : o.altKey ? i = e.containerHeight : i = 30;
          break;
        case 39:
          o.metaKey ? l = e.contentWidth : o.altKey ? l = e.containerWidth : l = 30;
          break;
        case 40:
          o.metaKey ? i = -e.contentHeight : o.altKey ? i = -e.containerHeight : i = -30;
          break;
        case 32:
          o.shiftKey ? i = e.containerHeight : i = -e.containerHeight;
          break;
        case 33:
          i = e.containerHeight;
          break;
        case 34:
          i = -e.containerHeight;
          break;
        case 36:
          i = e.contentHeight;
          break;
        case 35:
          i = -e.contentHeight;
          break;
        default:
          return;
      }
      e.settings.suppressScrollX && l !== 0 || e.settings.suppressScrollY && i !== 0 || (t.scrollTop -= i, t.scrollLeft += l, Nt(e), r(l, i) && o.preventDefault());
    }
  });
}
function Go(e) {
  var t = e.element;
  function n(c, l) {
    var i = Math.floor(t.scrollTop), d = t.scrollTop === 0, u = i + t.offsetHeight === t.scrollHeight, m = t.scrollLeft === 0, f = t.scrollLeft + t.offsetWidth === t.scrollWidth, p;
    return Math.abs(l) > Math.abs(c) ? p = d || u : p = m || f, p ? !e.settings.wheelPropagation : !0;
  }
  function s(c) {
    var l = c.deltaX, i = -1 * c.deltaY;
    return (typeof l > "u" || typeof i > "u") && (l = -1 * c.wheelDeltaX / 6, i = c.wheelDeltaY / 6), c.deltaMode && c.deltaMode === 1 && (l *= 10, i *= 10), l !== l && i !== i && (l = 0, i = c.wheelDelta), c.shiftKey ? [-i, -l] : [l, i];
  }
  function r(c, l, i) {
    if (!Rt.isWebKit && t.querySelector("select:focus"))
      return !0;
    if (!t.contains(c))
      return !1;
    for (var d = c; d && d !== t; ) {
      if (d.classList.contains(Ue.element.consuming))
        return !0;
      var u = gt(d);
      if (i && u.overflowY.match(/(scroll|auto)/)) {
        var m = d.scrollHeight - d.clientHeight;
        if (m > 0 && (d.scrollTop > 0 && i < 0 || d.scrollTop < m && i > 0))
          return !0;
      }
      if (l && u.overflowX.match(/(scroll|auto)/)) {
        var f = d.scrollWidth - d.clientWidth;
        if (f > 0 && (d.scrollLeft > 0 && l < 0 || d.scrollLeft < f && l > 0))
          return !0;
      }
      d = d.parentNode;
    }
    return !1;
  }
  function o(c) {
    var l = s(c), i = l[0], d = l[1];
    if (!r(c.target, i, d)) {
      var u = !1;
      e.settings.useBothWheelAxes ? e.scrollbarYActive && !e.scrollbarXActive ? (d ? t.scrollTop -= d * e.settings.wheelSpeed : t.scrollTop += i * e.settings.wheelSpeed, u = !0) : e.scrollbarXActive && !e.scrollbarYActive && (i ? t.scrollLeft += i * e.settings.wheelSpeed : t.scrollLeft -= d * e.settings.wheelSpeed, u = !0) : (t.scrollTop -= d * e.settings.wheelSpeed, t.scrollLeft += i * e.settings.wheelSpeed), Nt(e), u = u || n(i, d), u && !c.ctrlKey && (c.stopPropagation(), c.preventDefault());
    }
  }
  typeof window.onwheel < "u" ? e.event.bind(t, "wheel", o) : typeof window.onmousewheel < "u" && e.event.bind(t, "mousewheel", o);
}
function Qo(e) {
  if (!Rt.supportsTouch && !Rt.supportsIePointer)
    return;
  var t = e.element;
  function n(g, b) {
    var h = Math.floor(t.scrollTop), y = t.scrollLeft, v = Math.abs(g), k = Math.abs(b);
    if (k > v) {
      if (b < 0 && h === e.contentHeight - e.containerHeight || b > 0 && h === 0)
        return window.scrollY === 0 && b > 0 && Rt.isChrome;
    } else if (v > k && (g < 0 && y === e.contentWidth - e.containerWidth || g > 0 && y === 0))
      return !0;
    return !0;
  }
  function s(g, b) {
    t.scrollTop -= b, t.scrollLeft -= g, Nt(e);
  }
  var r = {}, o = 0, c = {}, l = null;
  function i(g) {
    return g.targetTouches ? g.targetTouches[0] : g;
  }
  function d(g) {
    return g.pointerType && g.pointerType === "pen" && g.buttons === 0 ? !1 : !!(g.targetTouches && g.targetTouches.length === 1 || g.pointerType && g.pointerType !== "mouse" && g.pointerType !== g.MSPOINTER_TYPE_MOUSE);
  }
  function u(g) {
    if (d(g)) {
      var b = i(g);
      r.pageX = b.pageX, r.pageY = b.pageY, o = new Date().getTime(), l !== null && clearInterval(l);
    }
  }
  function m(g, b, h) {
    if (!t.contains(g))
      return !1;
    for (var y = g; y && y !== t; ) {
      if (y.classList.contains(Ue.element.consuming))
        return !0;
      var v = gt(y);
      if (h && v.overflowY.match(/(scroll|auto)/)) {
        var k = y.scrollHeight - y.clientHeight;
        if (k > 0 && (y.scrollTop > 0 && h < 0 || y.scrollTop < k && h > 0))
          return !0;
      }
      if (b && v.overflowX.match(/(scroll|auto)/)) {
        var w = y.scrollWidth - y.clientWidth;
        if (w > 0 && (y.scrollLeft > 0 && b < 0 || y.scrollLeft < w && b > 0))
          return !0;
      }
      y = y.parentNode;
    }
    return !1;
  }
  function f(g) {
    if (d(g)) {
      var b = i(g), h = { pageX: b.pageX, pageY: b.pageY }, y = h.pageX - r.pageX, v = h.pageY - r.pageY;
      if (m(g.target, y, v))
        return;
      s(y, v), r = h;
      var k = new Date().getTime(), w = k - o;
      w > 0 && (c.x = y / w, c.y = v / w, o = k), n(y, v) && g.preventDefault();
    }
  }
  function p() {
    e.settings.swipeEasing && (clearInterval(l), l = setInterval(function() {
      if (e.isInitialized) {
        clearInterval(l);
        return;
      }
      if (!c.x && !c.y) {
        clearInterval(l);
        return;
      }
      if (Math.abs(c.x) < 0.01 && Math.abs(c.y) < 0.01) {
        clearInterval(l);
        return;
      }
      if (!e.element) {
        clearInterval(l);
        return;
      }
      s(c.x * 30, c.y * 30), c.x *= 0.8, c.y *= 0.8;
    }, 10));
  }
  Rt.supportsTouch ? (e.event.bind(t, "touchstart", u), e.event.bind(t, "touchmove", f), e.event.bind(t, "touchend", p)) : Rt.supportsIePointer && (window.PointerEvent ? (e.event.bind(t, "pointerdown", u), e.event.bind(t, "pointermove", f), e.event.bind(t, "pointerup", p)) : window.MSPointerEvent && (e.event.bind(t, "MSPointerDown", u), e.event.bind(t, "MSPointerMove", f), e.event.bind(t, "MSPointerUp", p)));
}
var Jo = function() {
  return {
    handlers: ["click-rail", "drag-thumb", "keyboard", "wheel", "touch"],
    maxScrollbarLength: null,
    minScrollbarLength: null,
    scrollingThreshold: 1e3,
    scrollXMarginOffset: 0,
    scrollYMarginOffset: 0,
    suppressScrollX: !1,
    suppressScrollY: !1,
    swipeEasing: !0,
    useBothWheelAxes: !1,
    wheelPropagation: !0,
    wheelSpeed: 1
  };
}, Zo = {
  "click-rail": _o,
  "drag-thumb": zo,
  keyboard: Uo,
  wheel: Go,
  touch: Qo
}, qt = function(t, n) {
  var s = this;
  if (n === void 0 && (n = {}), typeof t == "string" && (t = document.querySelector(t)), !t || !t.nodeName)
    throw new Error("no element is specified to initialize PerfectScrollbar");
  this.element = t, t.classList.add(Ue.main), this.settings = Jo();
  for (var r in n)
    this.settings[r] = n[r];
  this.containerWidth = null, this.containerHeight = null, this.contentWidth = null, this.contentHeight = null;
  var o = function() {
    return t.classList.add(Ue.state.focus);
  }, c = function() {
    return t.classList.remove(Ue.state.focus);
  };
  this.isRtl = gt(t).direction === "rtl", this.isRtl === !0 && t.classList.add(Ue.rtl), this.isNegativeScroll = function() {
    var d = t.scrollLeft, u = null;
    return t.scrollLeft = -1, u = t.scrollLeft < 0, t.scrollLeft = d, u;
  }(), this.negativeScrollAdjustment = this.isNegativeScroll ? t.scrollWidth - t.clientWidth : 0, this.event = new Xt(), this.ownerDocument = t.ownerDocument || document, this.scrollbarXRail = Ut(Ue.element.rail("x")), t.appendChild(this.scrollbarXRail), this.scrollbarX = Ut(Ue.element.thumb("x")), this.scrollbarXRail.appendChild(this.scrollbarX), this.scrollbarX.setAttribute("tabindex", 0), this.event.bind(this.scrollbarX, "focus", o), this.event.bind(this.scrollbarX, "blur", c), this.scrollbarXActive = null, this.scrollbarXWidth = null, this.scrollbarXLeft = null;
  var l = gt(this.scrollbarXRail);
  this.scrollbarXBottom = parseInt(l.bottom, 10), isNaN(this.scrollbarXBottom) ? (this.isScrollbarXUsingBottom = !1, this.scrollbarXTop = Oe(l.top)) : this.isScrollbarXUsingBottom = !0, this.railBorderXWidth = Oe(l.borderLeftWidth) + Oe(l.borderRightWidth), dt(this.scrollbarXRail, { display: "block" }), this.railXMarginWidth = Oe(l.marginLeft) + Oe(l.marginRight), dt(this.scrollbarXRail, { display: "" }), this.railXWidth = null, this.railXRatio = null, this.scrollbarYRail = Ut(Ue.element.rail("y")), t.appendChild(this.scrollbarYRail), this.scrollbarY = Ut(Ue.element.thumb("y")), this.scrollbarYRail.appendChild(this.scrollbarY), this.scrollbarY.setAttribute("tabindex", 0), this.event.bind(this.scrollbarY, "focus", o), this.event.bind(this.scrollbarY, "blur", c), this.scrollbarYActive = null, this.scrollbarYHeight = null, this.scrollbarYTop = null;
  var i = gt(this.scrollbarYRail);
  this.scrollbarYRight = parseInt(i.right, 10), isNaN(this.scrollbarYRight) ? (this.isScrollbarYUsingRight = !1, this.scrollbarYLeft = Oe(i.left)) : this.isScrollbarYUsingRight = !0, this.scrollbarYOuterWidth = this.isRtl ? Ko(this.scrollbarY) : null, this.railBorderYWidth = Oe(i.borderTopWidth) + Oe(i.borderBottomWidth), dt(this.scrollbarYRail, { display: "block" }), this.railYMarginHeight = Oe(i.marginTop) + Oe(i.marginBottom), dt(this.scrollbarYRail, { display: "" }), this.railYHeight = null, this.railYRatio = null, this.reach = {
    x: t.scrollLeft <= 0 ? "start" : t.scrollLeft >= this.contentWidth - this.containerWidth ? "end" : null,
    y: t.scrollTop <= 0 ? "start" : t.scrollTop >= this.contentHeight - this.containerHeight ? "end" : null
  }, this.isAlive = !0, this.settings.handlers.forEach(function(d) {
    return Zo[d](s);
  }), this.lastScrollTop = Math.floor(t.scrollTop), this.lastScrollLeft = t.scrollLeft, this.event.bind(this.element, "scroll", function(d) {
    return s.onScroll(d);
  }), Nt(this);
};
qt.prototype.update = function() {
  this.isAlive && (this.negativeScrollAdjustment = this.isNegativeScroll ? this.element.scrollWidth - this.element.clientWidth : 0, dt(this.scrollbarXRail, { display: "block" }), dt(this.scrollbarYRail, { display: "block" }), this.railXMarginWidth = Oe(gt(this.scrollbarXRail).marginLeft) + Oe(gt(this.scrollbarXRail).marginRight), this.railYMarginHeight = Oe(gt(this.scrollbarYRail).marginTop) + Oe(gt(this.scrollbarYRail).marginBottom), dt(this.scrollbarXRail, { display: "none" }), dt(this.scrollbarYRail, { display: "none" }), Nt(this), en(this, "top", 0, !1, !0), en(this, "left", 0, !1, !0), dt(this.scrollbarXRail, { display: "" }), dt(this.scrollbarYRail, { display: "" }));
};
qt.prototype.onScroll = function(t) {
  this.isAlive && (Nt(this), en(this, "top", this.element.scrollTop - this.lastScrollTop), en(
    this,
    "left",
    this.element.scrollLeft - this.lastScrollLeft
  ), this.lastScrollTop = Math.floor(this.element.scrollTop), this.lastScrollLeft = this.element.scrollLeft);
};
qt.prototype.destroy = function() {
  this.isAlive && (this.event.unbindAll(), Ht(this.scrollbarX), Ht(this.scrollbarY), Ht(this.scrollbarXRail), Ht(this.scrollbarYRail), this.removePsClasses(), this.element = null, this.scrollbarX = null, this.scrollbarY = null, this.scrollbarXRail = null, this.scrollbarYRail = null, this.isAlive = !1);
};
qt.prototype.removePsClasses = function() {
  this.element.className = this.element.className.split(" ").filter(function(t) {
    return !t.match(/^ps([-_].+|)$/);
  }).join(" ");
};
const Ps = ({
  className: e,
  sidenav: t,
  tag: n = "div",
  handlers: s = ["click-rail", "drag-thumb", "keyboard", "wheel", "touch"],
  wheelSpeed: r = 1,
  wheelPropagation: o = !0,
  swipeEasing: c = !0,
  minScrollbarLength: l,
  maxScrollbarLength: i,
  scrollingThreshold: d = 1e3,
  useBothWheelAxes: u = !1,
  suppressScrollX: m = !1,
  suppressScrollY: f = !1,
  scrollXMarginOffset: p = 0,
  scrollYMarginOffset: g = 0,
  scrollBarRef: b,
  onScrollY: h,
  onScrollX: y,
  onScrollUp: v,
  onScrollDown: k,
  onScrollLeft: w,
  onScrollRight: S,
  onYReachStart: L,
  onYReachEnd: E,
  onXReachStart: M,
  onXReachEnd: q,
  children: Y,
  options: R,
  // prop considered to be removed in major release
  ...H
}) => {
  const G = x(t && "sidenav-menu", e), B = Z(null), U = Z(null);
  return D(() => {
    let _ = null;
    const z = [], F = {
      handlers: s,
      wheelSpeed: r,
      wheelPropagation: o,
      swipeEasing: c,
      minScrollbarLength: l,
      maxScrollbarLength: i,
      scrollingThreshold: d,
      useBothWheelAxes: u,
      suppressScrollX: m,
      suppressScrollY: f,
      scrollXMarginOffset: p,
      scrollYMarginOffset: g,
      ...R
    };
    if (!B.current)
      return;
    _ = B.current, U.current = new qt(_, F);
    const V = {
      "ps-scroll-y": h,
      "ps-scroll-x": y,
      "ps-scroll-up": v,
      "ps-scroll-down": k,
      "ps-scroll-left": w,
      "ps-scroll-right": S,
      "ps-y-reach-start": L,
      "ps-y-reach-end": E,
      "ps-x-reach-start": M,
      "ps-x-reach-end": q
    };
    return Object.keys(V).forEach((C) => {
      const W = V[C];
      if (typeof W == "function" && _) {
        const J = () => W(_);
        z.push({ eventName: C, handler: J }), _.addEventListener(C, J);
      }
    }), b && b(U.current), () => {
      var C;
      z.forEach((W) => {
        _ == null || _.removeEventListener(W.eventName, W.handler);
      }), (C = U.current) == null || C.destroy(), U.current = null;
    };
  }, [
    s,
    r,
    o,
    c,
    l,
    i,
    d,
    u,
    m,
    f,
    p,
    g,
    b,
    h,
    y,
    v,
    k,
    w,
    S,
    L,
    E,
    M,
    q,
    R
  ]), /* @__PURE__ */ a(n, { className: G, ref: B, ...H, children: Y });
}, Ys = se.createContext({
  color: "primary"
}), Ft = (e) => {
  const [t] = e.touches;
  return {
    x: t.clientX,
    y: t.clientY
  };
}, sn = ({ x: e, y: t }) => ({
  x: {
    direction: e < 0 ? "left" : "right",
    value: Math.abs(e)
  },
  y: {
    direction: t < 0 ? "up" : "down",
    value: Math.abs(t)
  }
}), Fn = ({ x: e, y: t }, { x: n, y: s }) => ({
  x: e - n,
  y: t - s
}), ec = ({ x1: e, x2: t, y1: n, y2: s }) => Math.sqrt((t - e) ** 2 + (s - n) ** 2), tc = (e) => {
  let t = null;
  const n = Number.MIN_VALUE;
  for (const s of e)
    s.clientX > n && (t = s);
  return t;
}, nc = (e, t, n, s) => {
  const o = Math.atan2(s - t, n - e) * (180 / Math.PI);
  return Math.round(o + 360) % 360;
}, sc = ({ x1: e, x2: t, y1: n, y2: s }) => ({
  x: e + (t - e) / 2,
  y: n + (s - n) / 2
}), On = (e) => {
  const [t, n] = e, s = {
    x1: t.clientX,
    x2: n.clientX,
    y1: t.clientY,
    y2: n.clientY
  };
  return [ec(s), sc(s)];
}, Vn = (e, t) => typeof e == "number" && typeof t == "number" && !isNaN(e) && !isNaN(t), rc = ({
  tag: e = "div",
  children: t,
  touchRef: n,
  type: s,
  threshold: r = 10,
  allDirections: o = !1,
  onSwipe: c,
  onSwipeLeft: l,
  onSwipeRight: i,
  onSwipeUp: d,
  onSwipeDown: u,
  onPan: m,
  onPanLeft: f,
  onPanRight: p,
  onPanUp: g,
  onPanDown: b,
  onPinch: h,
  onRotate: y,
  onTap: v,
  onPress: k,
  pointers: w = 1,
  interval: S = 500,
  taps: L = 1,
  duration: E = 250,
  preventSwipeScroll: M = !0,
  ...q
}) => {
  const Y = Z(null), R = n || Y, [H, G] = N(null), [B, U] = N(null), [_, z] = N(null), [F, V] = N(null), [C, W] = N({ x: 0, y: 0 }), [J, O] = N(null), [Q, T] = N(0), [$, P] = N(0), [re, ie] = N(0), [fe, ne] = N(0), [be, ae] = N(0), [Ee, me] = N({ x: 0, y: 0 }), [Ne, he] = N(0), [Te, ge] = N(null), De = Z();
  D(() => {
    s === "tap" && (Ne === 1 && (De.current = window.setTimeout(() => {
      he(0);
    }, S)), Ne === L && (window.clearTimeout(De.current), he(0), v && v(Te)));
  }, [Ne, S, L, v, Te, s]);
  const pe = X(
    (I) => {
      I.touches.length === w && (he(Ne + 1), ge(I));
    },
    [w, Ne]
  ), ke = X(() => {
  }, []), de = X(() => {
  }, []), je = X(
    (I) => {
      I.touches.length === w && (De.current = window.setTimeout(() => {
        k && k(I, E);
      }, E));
    },
    [E, w, k]
  ), Se = X(() => {
  }, []), qe = X(() => {
    window.clearTimeout(De.current);
  }, []), lt = X((I) => {
    G(Ft(I));
  }, []), ot = X(
    (I) => {
      if (I === "left")
        return l;
      if (I === "right")
        return i;
      if (I === "up")
        return d;
      if (I === "down")
        return u;
    },
    [u, l, i, d]
  ), Ze = X(
    (I) => {
      if (I.type === "touchmove" && M && I.preventDefault(), !H)
        return;
      const ue = Ft(I), Ie = {
        x: ue.x - H.x,
        y: ue.y - H.y
      }, Xe = sn(Ie), { x: Qe, y: _e } = Xe;
      if (o) {
        if (r && _e.value < r && Qe.value < r)
          return;
        const te = _e.value > Qe.value ? _e.direction : Qe.direction;
        c && c(I, { direction: te }), G(null);
        return;
      }
      const K = i || l ? "x" : "y";
      if (r && Xe[K].value > r) {
        const te = ot(Xe[K].direction);
        te && te(I), G(null);
      }
    },
    [
      o,
      c,
      H,
      r,
      i,
      l,
      ot,
      M
    ]
  ), et = X(() => {
    G(null);
  }, []), tt = X((I) => {
    U(Ft(I)), z(I);
  }, []), at = X(
    (I) => {
      if (I === "left")
        return f;
      if (I === "right")
        return p;
      if (I === "up")
        return g;
      if (I === "down")
        return b;
    },
    [b, f, p, g]
  ), ut = X(
    (I) => {
      I.type === "touchmove" && I.preventDefault();
      const ue = Ft(I), Ie = Ft(_), Xe = Fn(ue, B), Qe = Fn(ue, Ie), _e = sn(Xe), K = sn(Qe), { x: te, y: ce } = _e;
      r && o && (ce.value > r || te.value > r) && m && m(I);
      const ve = f || p ? "x" : "y";
      if (r && _e[ve].value > r) {
        const Ae = at(K[ve].direction);
        Ae && Ae(I);
      }
      z(I);
    },
    [o, _, B, r, m, f, p, at]
  ), ct = X((I) => {
    I.type === "touchend" && I.preventDefault(), U(null), z(null);
  }, []), Ve = X(
    (I) => {
      if (I.touches.length !== w)
        return;
      I.type === "touchstart" && I.preventDefault();
      const [ue, Ie] = On(I.touches);
      V(ue), U(ue), W(Ie);
    },
    [w]
  ), Ge = X(
    (I) => {
      I.touches.length === w && (I.type === "touchmove" && I.preventDefault(), V(On(I.touches)[0]), typeof B == "number" && typeof F == "number" && O(F / B), Vn(B, F) && typeof C == "object" && (r && C.x > r || r && C.y > r) && (U(F), h && h(I, { ratio: J, origin: C })));
    },
    [w, B, F, r, h, C, J]
  ), nt = X(() => {
    Vn(B, F) && U(null);
  }, [B, F]), A = X(
    (I) => {
      if (I.type === "touchstart" && I.preventDefault(), I.touches.length === 1 && w === 1) {
        const { left: ue, top: Ie, width: Xe, height: Qe } = I.target.element.getBoundingClientRect();
        me({ x: ue + Xe / 2, y: Ie + Qe / 2 });
      } else if (I.touches.length === 2 && w === 2) {
        const [ue, Ie] = I.touches, Xe = {
          x1: Ie.clientX,
          x2: ue.clientX,
          y1: Ie.clientY,
          y2: ue.clientY
        };
        me({
          x: (Xe.x1 + Xe.x2) / 2,
          y: (Xe.y1 + Xe.y2) / 2
        });
      } else
        return;
    },
    [w]
  ), le = X(
    (I) => {
      I.type === "touchmove" && I.preventDefault();
      let ue;
      if (I.touches.length === 1 && w === 1)
        ue = I.touches[0];
      else if (I.touches.length === 2 && w === 2)
        ue = tc(I.touches);
      else
        return;
      T(nc(Ee.x, Ee.y, ue.clientX, ue.clientY)), re ? (ae(Q - $), ne(fe + be)) : (P(Q), ie(Q), ne(0), ae(0)), P(Q), y && y(I, {
        currentAngle: Q,
        distance: fe,
        change: be
      });
    },
    [be, Q, $, Ee, y, fe, re, w]
  ), Me = X((I) => {
    I.type === "touchend" && I.preventDefault(), T(0), ie(0), P(0), ae(0), ne(0);
  }, []);
  return D(() => {
    const I = R.current;
    return s === "tap" && (I.addEventListener("touchstart", pe), I.addEventListener("touchmove", ke), I.addEventListener("touchend", de)), s === "press" && (I.addEventListener("touchstart", je), I.addEventListener("touchmove", Se), I.addEventListener("touchend", qe)), s === "swipe" && (I.addEventListener("touchstart", lt), I.addEventListener("touchmove", Ze), I.addEventListener("touchend", et)), s === "pan" && (I.addEventListener("touchstart", tt), I.addEventListener("touchmove", ut), I.addEventListener("touchend", ct)), s === "pinch" && (I.addEventListener("touchstart", Ve), I.addEventListener("touchmove", Ge), I.addEventListener("touchend", nt)), s === "rotate" && (I.addEventListener("touchstart", A), I.addEventListener("touchmove", le), I.addEventListener("touchend", Me)), () => {
      s === "tap" && (I.removeEventListener("touchstart", pe), I.removeEventListener("touchmove", ke), I.removeEventListener("touchend", de)), s === "press" && (I.removeEventListener("touchstart", je), I.removeEventListener("touchmove", Se), I.removeEventListener("touchend", qe)), s === "swipe" && (I.removeEventListener("touchstart", lt), I.removeEventListener("touchmove", Ze), I.removeEventListener("touchend", et)), s === "pan" && (I.removeEventListener("touchstart", tt), I.removeEventListener("touchmove", ut), I.removeEventListener("touchend", ct)), s === "pinch" && (I.removeEventListener("touchstart", Ve), I.removeEventListener("touchmove", Ge), I.removeEventListener("touchend", nt)), s === "rotate" && (I.removeEventListener("touchstart", A), I.removeEventListener("touchmove", le), I.removeEventListener("touchend", Me));
    };
  }, [
    R,
    pe,
    ke,
    de,
    je,
    Se,
    qe,
    lt,
    Ze,
    et,
    tt,
    ut,
    ct,
    Ve,
    Ge,
    nt,
    A,
    le,
    Me,
    s
  ]), /* @__PURE__ */ a(e, { ref: R, ...q, children: t });
}, Ei = ({
  className: e,
  open: t = !0,
  getOpenState: n,
  children: s,
  color: r = "primary",
  backdrop: o = !0,
  slim: c,
  slimCollapsed: l = !0,
  small: i = !1,
  constant: d = !1,
  bgColor: u,
  right: m,
  relative: f,
  absolute: p,
  light: g,
  mode: b = "over",
  contentRef: h,
  closeOnEsc: y = !0,
  onOpen: v,
  onClose: k,
  onExpand: w,
  onCollapse: S,
  nonInvasive: L = !0,
  ...E
}) => {
  const [M, q] = N(t), [Y, R] = N(t), [H, G] = N(0), [B, U] = N(l), _ = x(
    "sidenav",
    r && `sidenav-${r}`,
    u && `bg-${u}`,
    M ? "sidenav-shown" : "sidenav-hidden",
    f && "sidenav-relative",
    p && "sidenav-absolute",
    g && "sidenav-theme-light",
    m && "sidenav-right",
    c && "sidenav-slim",
    c && B && "sidenav-slim-collapsed",
    i && "sidenav-sm",
    e
  ), z = x("sidenav-content", M ? m ? "right-side-shown" : "side-shown" : "side-hidden"), F = x("sidenav-content", M ? m ? "right-push-shown" : "push-shown" : "push-hidden"), V = Z(null);
  D(() => {
    if (!M)
      return;
    const O = () => {
      const T = document.documentElement.clientWidth;
      return Math.abs(window.innerWidth - T);
    };
    if (window.innerWidth > document.documentElement.clientWidth && window.innerWidth >= 576 && !L) {
      const T = O();
      document.body.classList.add("modal-open"), document.body.style.overflow = "hidden", document.body.style.paddingRight = `${T}px`;
    } else
      document.body.classList.remove("modal-open"), document.body.style.overflow = "", document.body.style.paddingRight = "";
    return () => {
      document.body.classList.remove("modal-open"), document.body.style.overflow = "", document.body.style.paddingRight = "";
    };
  }, [L, M]);
  const C = X(
    (O) => {
      var Q;
      !d && o && b === "over" && O.target !== V.current && !((Q = V.current) != null && Q.contains(O.target)) && (q(!1), n && n(!1));
    },
    [V, n, d, o, b]
  ), W = X(
    (O) => {
      y && O.key === "Escape" && (q(!1), n && n(!1));
    },
    [n, y]
  ), J = X(() => {
    var O;
    G(f || p ? (O = V.current) == null ? void 0 : O.offsetHeight : window.innerHeight);
  }, [p, f]);
  return D(() => {
    var O;
    G((O = V.current) == null ? void 0 : O.offsetHeight);
  }, []), D(() => {
    h && (b === "push" ? h.className = F : b === "side" ? h.className = z : h.className = "sidenav-content");
  }, [b, h, z, F]), D(() => (M && (document.addEventListener("click", C), document.addEventListener("keydown", W), window.addEventListener("resize", J)), () => {
    document.removeEventListener("click", C), document.removeEventListener("keydown", W), window.removeEventListener("resize", J);
  }), [C, W, J, M]), D(() => {
    c && (U(l), l ? S == null || S() : w == null || w());
  }, [l, c]), D(() => {
    q(t), n && n(t);
  }, [t, n]), D(() => {
    let O, Q;
    return M ? (R(!0), O = setTimeout(() => {
      q(!0), v == null || v();
    }, 4)) : (q(!1), Q = setTimeout(() => {
      R(!1), k == null || k();
    }, 300)), () => {
      clearTimeout(O), clearTimeout(Q);
    };
  }, [M]), /* @__PURE__ */ j(Ys.Provider, { value: { color: r }, children: [
    /* @__PURE__ */ a(
      rc,
      {
        type: "swipe",
        onSwipeLeft: () => {
          c && M && !B && (U(!0), w == null || w());
        },
        onSwipeRight: () => {
          c && M && B && (U(!1), S == null || S());
        },
        tag: "nav",
        className: _,
        touchRef: V,
        ...E,
        children: /* @__PURE__ */ a(Ps, { suppressScrollX: !0, style: { height: H }, children: s })
      }
    ),
    o && b === "over" && (Y || M) && /* @__PURE__ */ a(
      "div",
      {
        className: "sidenav-backdrop",
        style: {
          transition: "opacity 0.3s ease-out 0s",
          position: p ? "absolute" : "fixed",
          width: "100%",
          height: "100%",
          opacity: M && Y ? 1 : 0
        }
      }
    )
  ] });
}, oc = se.forwardRef(
  ({ className: e, children: t, ...n }, s) => {
    const r = x("sidenav-menu", e);
    return /* @__PURE__ */ a("ul", { className: r, ref: s, ...n, children: t });
  }
);
oc.displayName = "MDBSideNavMenu";
const cc = se.forwardRef(
  ({ className: e, children: t, ...n }, s) => {
    const r = x("sidenav-item", e);
    return /* @__PURE__ */ a("li", { className: r, ref: s, ...n, children: t });
  }
);
cc.displayName = "MDBSideNavItem";
const lc = se.forwardRef(
  ({ className: e, icon: t, iconClasses: n, iconAngle: s = 180, shouldBeExpanded: r, children: o, active: c, tag: l = "a", ...i }, d) => {
    const { color: u } = Ye(Ys), m = x("sidenav-link", c && "active", e), f = x("rotate-icon", n), [p, g] = N(r ? s : 0);
    return D(() => {
      g(r ? s : 0);
    }, [r, s]), /* @__PURE__ */ j(
      pn,
      {
        rippleTag: l,
        onKeyDown: (b) => {
          b.key === "Enter" && b.target.click();
        },
        tabIndex: 1,
        rippleColor: u,
        className: m,
        ref: d,
        ...i,
        children: [
          o,
          t && /* @__PURE__ */ a(it, { icon: t, style: { transform: `rotate(${p}deg)` }, className: f })
        ]
      }
    );
  }
);
lc.displayName = "MDBSideNavLink";
const Di = ({ className: e, children: t, open: n, collapseRef: s, ...r }) => {
  const o = Z(null), c = s || o, l = x("sidenav-collapse", e);
  return D(() => {
    var u;
    const i = (u = c == null ? void 0 : c.current) == null ? void 0 : u.querySelectorAll(".sidenav-link"), d = n ? "1" : "-1";
    i == null || i.forEach((m) => {
      m.setAttribute("tabindex", d);
    });
  }, [n, c]), /* @__PURE__ */ a(Ms, { tag: "ul", open: n, className: l, collapseRef: c, ...r, children: t });
}, Cs = se.forwardRef(
  ({ className: e, centered: t, children: n, size: s, scrollable: r, tag: o = "div", ...c }, l) => {
    const i = x(
      "modal-dialog",
      r && "modal-dialog-scrollable",
      t && "modal-dialog-centered",
      s && `modal-${s}`,
      e
    );
    return /* @__PURE__ */ a(o, { className: i, ...c, ref: l, children: n });
  }
);
Cs.displayName = "MDBModalDialog";
const ic = se.forwardRef(
  ({ className: e, side: t, frame: n, position: s, children: r, tag: o = "div", ...c }, l) => {
    const i = x(t && "modal-side", n && "modal-frame", s && `modal-${s}`, e);
    return /* @__PURE__ */ a(Cs, { className: i, ...c, tag: o, ref: l, children: r });
  }
);
ic.displayName = "MDBModalDialog";
const Ti = ({
  animation: e = "slide-right",
  animationRef: t,
  className: n,
  children: s,
  delay: r,
  infinite: o,
  duration: c = 500,
  enableTarget: l = !1,
  target: i = !1,
  repeatOnScroll: d,
  reset: u,
  setTarget: m,
  start: f = "onClick",
  style: p,
  tag: g = "div",
  onEnd: b,
  animate: h,
  ...y
}) => {
  const [v, k] = N(f === "onLoad"), w = Fe(() => h === void 0 ? v : h, [h, v]), [S, L] = N(!1), E = Z(!0), M = x(w && "animation", w && e, n), q = Z(null), Y = t || q, R = () => {
    k((G) => !G);
  }, H = X(() => {
    if (Y.current) {
      const B = Y.current.getBoundingClientRect().top + document.body.scrollTop, U = Y.current.offsetHeight, _ = window.innerHeight, z = B <= _ && B + U >= 0;
      z && E.current ? (E.current = !1, r ? setTimeout(() => {
        k(!0), L(!0);
      }, r) : (k(!0), L(!0))) : !z && d && (L(!1), E.current = !0);
    }
  }, [Y, d, r]);
  return D(() => (f === "onScroll" && window.addEventListener("scroll", H), () => {
    window.removeEventListener("scroll", H);
  }), [H, f]), D(() => {
    f === "onLoad" && k(!0);
  }, [f]), D(() => {
    if (w && !o && u) {
      const G = setTimeout(() => {
        k(!1), b == null || b();
      }, c);
      return () => clearTimeout(G);
    }
  }, [w, c, o, u, b]), /* @__PURE__ */ j(we, { children: [
    f === "onClick" && /* @__PURE__ */ a(
      g,
      {
        onClick: R,
        className: M,
        ref: Y,
        ...y,
        style: {
          ...p,
          animationDuration: `${c}ms`,
          animationIterationCount: o ? "infinite" : null,
          animationDelay: r ? `${r}ms` : null
        },
        children: s
      }
    ),
    f === "onHover" && /* @__PURE__ */ a(
      g,
      {
        onMouseEnter: R,
        className: M,
        ref: Y,
        ...y,
        style: {
          ...p,
          animationDuration: `${c}ms`,
          animationIterationCount: o ? "infinite" : null,
          animationDelay: r ? `${r}ms` : null
        },
        children: s
      }
    ),
    (f === "onLoad" || f === "manually") && /* @__PURE__ */ a(
      g,
      {
        className: M,
        ref: Y,
        ...y,
        style: {
          ...p,
          animationDuration: `${c}ms`,
          animationIterationCount: o ? "infinite" : null,
          animationDelay: r ? `${r}ms` : null
        },
        children: s
      }
    ),
    f === "onScroll" && /* @__PURE__ */ a(
      g,
      {
        className: M,
        ref: Y,
        ...y,
        style: {
          ...p,
          animationDuration: `${c}ms`,
          visibility: S ? "visible" : "hidden",
          animationIterationCount: o ? "infinite" : null
        },
        children: s
      }
    )
  ] });
}, Xs = {
  format: "12h"
}, nn = se.createContext({
  onDatetimepickerModeSwitch: () => null,
  isInDatetimepicker: !1,
  setInputValue: null,
  setActiveHour: null,
  setActiveMinute: null,
  setPeriod: null,
  setMode: null,
  setHandAnimation: null,
  setMinuteAngle: null,
  setHourAngle: null,
  submitLabel: "",
  clearLabel: "",
  cancelLabel: "",
  activeHour: 12,
  activeMinute: 12,
  format: "12h",
  period: "",
  defaultValue: "",
  minHour: 0,
  maxHour: 23,
  minPeriod: "",
  maxPeriod: "",
  mode: "hours",
  handAnimation: !1,
  maxMinute: 59,
  minMinute: 0,
  minuteAngle: 360,
  hourAngle: 360,
  inline: !1,
  increment: !1,
  onChange: () => null,
  onOpen: () => null,
  onClose: () => null,
  onCloseHandler: () => null,
  amLabel: "AM",
  pmLabel: "PM",
  switchHoursToMinutesOnClick: !0,
  headId: "",
  bodyId: ""
}), Jt = (e) => {
  const t = e.split(":"), n = t[0], s = t[1].split(" ")[1], r = t[1].split(" ")[0];
  return {
    hour: parseInt(n),
    minute: parseInt(r),
    defaultPeriod: s
  };
}, jn = (e, t) => (t === "24h" ? /^([01]\d|2[0-3])(:[0-5]\d)$/ : /^(0?[1-9]|1[012])(:[0-5]\d) [APap][mM]$/).test(e), yt = (e, t, n, s, r, o) => {
  let c = !1;
  return t && (r !== "" ? e > t && s === r && (c = !0) : e > t && (c = !0)), n && (o !== "" ? e < n && s === o && (c = !0) : e < n && (c = !0)), c;
}, Kn = (e, t, n, s, r, o, c, l, i) => yt(s, r, o, c, l, i) && (n === t || n === e), ac = (e, t, n) => {
  t.split(" ").forEach((r) => {
    e.addEventListener(r, n);
  });
}, uc = (e, t, n) => {
  t.split(" ").forEach((r) => {
    e.removeEventListener(r, n);
  });
}, Fs = (e, t) => {
  const n = t.x - e.x, s = t.y - e.y;
  return Math.sqrt(n * n + s * s);
}, dc = (e, t) => {
  const n = 2 * Math.atan2(t.y - e.y - Fs(e, t), t.x - e.x);
  return Math.abs(n * 180 / Math.PI);
}, qn = (e) => ({
  radius: (e - 32) / 2 - 4
}), fc = (e) => {
  const t = new Date();
  let n = t.getHours();
  const s = t.getMinutes();
  if (e === "24h")
    return {
      hours: n,
      minutes: s,
      period: ""
    };
  const r = n >= 12 ? "PM" : "AM";
  return n = n % 12, n = n || 12, {
    hours: n,
    minutes: s,
    period: r
  };
}, rn = (e, t) => {
  const n = e.getMinutes();
  let s = e.getHours(), r;
  s === 24 && (s = 0);
  const o = s >= 12 ? "PM" : "AM";
  return t == "24h" ? r = s < 10 ? `0${s}:${n}` : `${s}:${n}` : t == "12h" && (r = `${(s + 24) % 12 || 12}:${n} ${o}`), r;
}, an = se.forwardRef(
  ({ ...e }, t) => {
    const {
      activeHour: n,
      format: s,
      period: r,
      setPeriod: o,
      mode: c,
      setMode: l,
      activeMinute: i,
      setHandAnimation: d,
      inline: u,
      setActiveHour: m,
      setActiveMinute: f,
      maxHour: p,
      maxMinute: g,
      minHour: b,
      minMinute: h,
      maxPeriod: y,
      minPeriod: v,
      setInputValue: k,
      increment: w,
      submitLabel: S,
      onChange: L,
      onCloseHandler: E,
      amLabel: M,
      pmLabel: q,
      headId: Y,
      show: R,
      onDatetimepickerModeSwitch: H,
      isInDatetimepicker: G
    } = Ye(nn), B = (F) => {
      l(F), d(!0);
    }, U = () => {
      if (yt(n, p, b, r, y, v) || yt(i, g, h, r, y, v) || !R)
        return;
      E == null || E();
      const F = n === 24 ? "00" : n < 10 ? `0${n}` : n, V = i < 10 ? `0${i}` : i, C = `${F}:${V} ${r}`.trim();
      k(C), L == null || L(C);
    }, _ = (F, V) => {
      const C = s === "12h" ? 12 : 24;
      if (V.type === "click")
        return m(F ? (W) => W === C ? 1 : W + 1 : (W) => W === 1 ? C : W - 1);
      if (V.type === "mousedown") {
        const W = setTimeout(() => {
          const O = setInterval(() => {
            m(F ? (T) => T === C ? 1 : T + 1 : (T) => T === 1 ? C : T - 1);
          }, 100), Q = () => {
            clearInterval(O), document.removeEventListener("mouseup", Q);
          };
          document.addEventListener("mouseup", Q);
        }, 300), J = () => {
          clearTimeout(W), document.removeEventListener("mouseup", J);
        };
        document.addEventListener("mouseup", J);
      }
    }, z = (F, V) => {
      const C = w ? 55 : 59, W = w ? 5 : 1;
      if (V.type === "click")
        return f(F ? (J) => J >= C ? 0 : J + W : (J) => J - W < 0 ? C : J - W);
      if (V.type === "mousedown") {
        const J = setTimeout(() => {
          const Q = setInterval(() => {
            f(F ? ($) => $ >= C ? 0 : $ + W : ($) => $ - W < 0 ? C : $ - W);
          }, 100), T = () => {
            clearInterval(Q), document.removeEventListener("mouseup", T);
          };
          document.addEventListener("mouseup", T);
        }, 300), O = () => {
          clearTimeout(J), document.removeEventListener("mouseup", O);
        };
        document.addEventListener("mouseup", O);
      }
    };
    return u ? /* @__PURE__ */ a(
      "div",
      {
        id: Y,
        className: "timepicker-head d-flex flex-row align-items-center justify-content-center timepicker-head-inline",
        style: { paddingRight: "0px" },
        ref: t,
        ...e,
        children: /* @__PURE__ */ j("div", { className: "timepicker-head-content d-flex w-100 justify-content-evenly align-items-center", children: [
          /* @__PURE__ */ j("div", { className: "timepicker-current-wrapper", children: [
            /* @__PURE__ */ j("span", { className: "position-relative h-100 timepicker-inline-hour-icons", children: [
              /* @__PURE__ */ a(
                it,
                {
                  fas: !0,
                  icon: "chevron-up",
                  style: { display: "flex" },
                  className: "position-absolute text-white timepicker-icon-up timepicker-icon-inline-hour",
                  onClick: (F) => _(!0, F),
                  onMouseDown: (F) => _(!0, F)
                }
              ),
              /* @__PURE__ */ a(
                We,
                {
                  type: "button",
                  color: "none",
                  onClick: () => {
                    B("hours");
                  },
                  className: `timepicker-current timepicker-current-inline timepicker-hour ${c === "hours" && "active"}`,
                  tabIndex: 0,
                  style: { pointerEvents: c === "hours" ? "none" : void 0 },
                  onFocus: () => {
                    B("hours");
                  },
                  children: n === 24 ? "00" : n < 10 ? `0${n}` : n
                }
              ),
              /* @__PURE__ */ a(
                it,
                {
                  fas: !0,
                  icon: "chevron-down",
                  style: { display: "flex" },
                  className: "position-absolute text-white timepicker-icon-down timepicker-icon-inline-hour",
                  onClick: (F) => _(!1, F),
                  onMouseDown: (F) => _(!1, F)
                }
              )
            ] }),
            /* @__PURE__ */ a(We, { color: "none", className: "timepicker-dot timepicker-current-inline", disabled: !0, children: ":" }),
            /* @__PURE__ */ j("span", { className: "position-relative h-100 timepicker-inline-minutes-icons", children: [
              /* @__PURE__ */ a(
                it,
                {
                  fas: !0,
                  icon: "chevron-up",
                  style: { display: "flex" },
                  className: "position-absolute text-white timepicker-icon-up timepicker-icon-inline-minute",
                  onClick: (F) => z(!0, F),
                  onMouseDown: (F) => z(!0, F)
                }
              ),
              /* @__PURE__ */ a(
                We,
                {
                  onClick: () => {
                    B("minutes");
                  },
                  type: "button",
                  color: "none",
                  className: `timepicker-current timepicker-current-inline timepicker-minute ${c === "minutes" && "active"}`,
                  tabIndex: 0,
                  style: { pointerEvents: c === "minutes" ? "none" : void 0 },
                  onFocus: () => {
                    B("minutes");
                  },
                  children: i < 10 ? `0${i}` : i
                }
              ),
              /* @__PURE__ */ a(
                it,
                {
                  fas: !0,
                  icon: "chevron-down",
                  style: { display: "flex" },
                  className: "position-absolute text-white timepicker-icon-down timepicker-icon-inline-minute",
                  onClick: (F) => z(!1, F),
                  onMouseDown: (F) => z(!1, F)
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ j("div", { className: "d-flex justify-content-center timepicker-mode-wrapper", children: [
            s === "12h" && /* @__PURE__ */ j(we, { children: [
              /* @__PURE__ */ a(
                We,
                {
                  onClick: () => o("AM"),
                  type: "button",
                  color: "none",
                  className: `timepicker-hour-mode timepicker-am me-2 ms-4 ${r.toLowerCase() === "am" && "active"}`,
                  tabIndex: 0,
                  children: M
                }
              ),
              /* @__PURE__ */ a(
                We,
                {
                  onClick: () => o("PM"),
                  type: "button",
                  color: "none",
                  className: `timepicker-hour-mode timepicker-pm ${r.toLowerCase() === "pm" && "active"}`,
                  tabIndex: 0,
                  children: q
                }
              )
            ] }),
            /* @__PURE__ */ a(
              We,
              {
                type: "button",
                color: "none",
                className: "timepicker-button timepicker-submit timepicker-submit-inline py-1 px-2 mb-0",
                tabIndex: 0,
                onClick: U,
                children: S
              }
            )
          ] })
        ] })
      }
    ) : /* @__PURE__ */ j(we, { children: [
      /* @__PURE__ */ a(
        "div",
        {
          id: Y,
          className: "timepicker-head d-flex flex-row align-items-center justify-content-center",
          style: { paddingRight: "0px" },
          ref: t,
          ...e,
          children: /* @__PURE__ */ j(
            "div",
            {
              className: "timepicker-head-content d-flex w-100 justify-content-evenly",
              style: { paddingRight: s === "24h" ? "50px" : "" },
              children: [
                /* @__PURE__ */ j("div", { className: "timepicker-current-wrapper", children: [
                  /* @__PURE__ */ a("span", { className: "position-relative h-100", children: /* @__PURE__ */ a(
                    We,
                    {
                      type: "button",
                      color: "none",
                      onClick: () => {
                        B("hours");
                      },
                      className: `timepicker-current timepicker-hour ${c === "hours" && "active"}`,
                      tabIndex: 0,
                      style: { pointerEvents: c === "hours" ? "none" : void 0 },
                      children: n === 24 ? "00" : n < 10 ? `0${n}` : n
                    }
                  ) }),
                  /* @__PURE__ */ a(We, { color: "none", className: "timepicker-dot", disabled: !0, children: ":" }),
                  /* @__PURE__ */ a("span", { className: "position-relative h-100", children: /* @__PURE__ */ a(
                    We,
                    {
                      onClick: () => {
                        B("minutes");
                      },
                      type: "button",
                      color: "none",
                      className: `timepicker-current timepicker-minute ${c === "minutes" && "active"}`,
                      tabIndex: 0,
                      style: { pointerEvents: c === "minutes" ? "none" : void 0 },
                      children: i < 10 ? `0${i}` : i
                    }
                  ) })
                ] }),
                s === "12h" && /* @__PURE__ */ j("div", { className: "d-flex flex-column justify-content-center timepicker-mode-wrapper", children: [
                  /* @__PURE__ */ a(
                    We,
                    {
                      onClick: () => o("AM"),
                      type: "button",
                      color: "none",
                      className: `timepicker-hour-mode timepicker-am ${r.toLowerCase() === "am" && "active"}`,
                      tabIndex: 0,
                      children: M
                    }
                  ),
                  /* @__PURE__ */ a(
                    We,
                    {
                      onClick: () => o("PM"),
                      type: "button",
                      color: "none",
                      className: `timepicker-hour-mode timepicker-pm ${r.toLowerCase() === "pm" && "active"}`,
                      tabIndex: 0,
                      children: q
                    }
                  )
                ] })
              ]
            }
          )
        }
      ),
      G && /* @__PURE__ */ j("div", { className: "buttons-container", children: [
        /* @__PURE__ */ a("button", { type: "button", className: "datepicker-button-toggle", onClick: H, children: /* @__PURE__ */ a("i", { className: "far fa-calendar datepicker-toggle-icon" }) }),
        /* @__PURE__ */ a("button", { type: "button", className: "timepicker-button-toggle", children: /* @__PURE__ */ a("i", { className: "far fa-clock fa-sm timepicker-icon" }) })
      ] })
    ] });
  }
);
an.displayName = "MDBTimePickerHeader";
const on = {
  hours: [
    {
      value: 1,
      left: "169px",
      bottom: "209.263px",
      angle: 30,
      id: `hour-1-${Math.floor(Math.random() * 1001)}`
    },
    {
      value: 2,
      left: "209.263px",
      bottom: "169px",
      angle: 60,
      id: `hour-2-${Math.floor(Math.random() * 1001)}`
    },
    {
      value: 3,
      left: "224px",
      bottom: "114px",
      angle: 90,
      id: `hour-3-${Math.floor(Math.random() * 1001)}`
    },
    {
      value: 4,
      left: "209.263px",
      bottom: "59px",
      angle: 120,
      id: `hour-4-${Math.floor(Math.random() * 1001)}`
    },
    {
      value: 5,
      left: "169px",
      bottom: "18.7372px",
      angle: 150,
      id: `hour-5-${Math.floor(Math.random() * 1001)}`
    },
    {
      value: 6,
      left: "114px",
      bottom: "4px",
      angle: 180,
      id: `hour-6-${Math.floor(Math.random() * 1001)}`
    },
    {
      value: 7,
      left: "59px",
      bottom: "18.7372px",
      angle: 210,
      id: `hour-7-${Math.floor(Math.random() * 1001)}`
    },
    {
      value: 8,
      left: "18.7372px",
      bottom: "59px",
      angle: 240,
      id: `hour-8-${Math.floor(Math.random() * 1001)}`
    },
    {
      value: 9,
      left: "4px",
      bottom: "114px",
      angle: 270,
      id: `hour-9-${Math.floor(Math.random() * 1001)}`
    },
    {
      value: 10,
      left: "18.7372px",
      bottom: "169px",
      angle: 300,
      id: `hour-10-${Math.floor(Math.random() * 1001)}`
    },
    {
      value: 11,
      left: "59px",
      bottom: "209.263px",
      angle: 330,
      id: `hour-11-${Math.floor(Math.random() * 1001)}`
    },
    {
      value: 12,
      left: "114px",
      bottom: "224px",
      angle: 360,
      id: `hour-12-${Math.floor(Math.random() * 1001)}`
    },
    {
      value: 13,
      left: "94px",
      bottom: "115.962px",
      angle: 30,
      id: `hour-13-${Math.floor(Math.random() * 1001)}`
    },
    {
      value: 14,
      left: "115.962px",
      bottom: "94px",
      angle: 60,
      id: `hour-14-${Math.floor(Math.random() * 1001)}`
    },
    {
      value: 15,
      left: "124px",
      bottom: "64px",
      angle: 90,
      id: `hour-15-${Math.floor(Math.random() * 1001)}`
    },
    {
      value: 16,
      left: "115.962px",
      bottom: "34px",
      angle: 120,
      id: `hour-16-${Math.floor(Math.random() * 1001)}`
    },
    {
      value: 17,
      left: "94px",
      bottom: "12.0385px",
      angle: 150,
      id: `hour-17-${Math.floor(Math.random() * 1001)}`
    },
    {
      value: 18,
      left: "64px",
      bottom: "4px",
      angle: 180,
      id: `hour-18-${Math.floor(Math.random() * 1001)}`
    },
    {
      value: 19,
      left: "34px",
      bottom: "12.0385px",
      angle: 210,
      id: `hour-19-${Math.floor(Math.random() * 1001)}`
    },
    {
      value: 20,
      left: "12.0385px",
      bottom: "34px",
      angle: 240,
      id: `hour-20-${Math.floor(Math.random() * 1001)}`
    },
    {
      value: 21,
      left: "4px",
      bottom: "64px",
      angle: 270,
      id: `hour-21-${Math.floor(Math.random() * 1001)}`
    },
    {
      value: 22,
      left: "12.0385px",
      bottom: "94px",
      angle: 300,
      id: `hour-22-${Math.floor(Math.random() * 1001)}`
    },
    {
      value: 23,
      left: "34px",
      bottom: "115.962px",
      angle: 330,
      id: `hour-23-${Math.floor(Math.random() * 1001)}`
    },
    {
      value: 24,
      left: "64px",
      bottom: "124px",
      angle: 360,
      id: `hour-0-${Math.floor(Math.random() * 1001)}`
    }
  ],
  //   ---------------------------------------------------------------------- MINUTES --------------------------------------------------------------------------
  minutes: [
    {
      value: 0,
      left: "114px",
      bottom: "224px",
      angle: 360,
      id: `minute-0-${Math.floor(Math.random() * 1001)}`
    },
    {
      value: 5,
      left: "169px",
      bottom: "209.263px",
      angle: 30,
      id: `minute-5-${Math.floor(Math.random() * 1001)}`
    },
    {
      value: 10,
      left: "209.263px",
      bottom: "169px",
      angle: 60,
      id: `minute-10-${Math.floor(Math.random() * 1001)}`
    },
    {
      value: 15,
      left: "224px",
      bottom: "114px",
      angle: 90,
      id: `minute-15-${Math.floor(Math.random() * 1001)}`
    },
    {
      value: 20,
      left: "209.263px",
      bottom: "59px",
      angle: 120,
      id: `minute-20-${Math.floor(Math.random() * 1001)}`
    },
    {
      value: 25,
      left: "169px",
      bottom: "18.7372px",
      angle: 150,
      id: `minute-25-${Math.floor(Math.random() * 1001)}`
    },
    {
      value: 30,
      left: "114px",
      bottom: "4px",
      angle: 180,
      id: `minute-30-${Math.floor(Math.random() * 1001)}`
    },
    {
      value: 35,
      left: "59px",
      bottom: "18.7372px",
      angle: 210,
      id: `minute-35-${Math.floor(Math.random() * 1001)}`
    },
    {
      value: 40,
      left: "18.7372px",
      bottom: "59px",
      angle: 240,
      id: `minute-40-${Math.floor(Math.random() * 1001)}`
    },
    {
      value: 45,
      left: "4px",
      bottom: "114px",
      angle: 270,
      id: `minute-45-${Math.floor(Math.random() * 1001)}`
    },
    {
      value: 50,
      left: "18.7372px",
      bottom: "169px",
      angle: 300,
      id: `minute-50-${Math.floor(Math.random() * 1001)}`
    },
    {
      value: 55,
      left: "59px",
      bottom: "209.263px",
      angle: 330,
      id: `minute-55-${Math.floor(Math.random() * 1001)}`
    }
  ]
}, Os = se.forwardRef(
  ({ ...e }, t) => {
    const n = Z(null), s = Z(null), [r, o] = N(!1), [c, l] = N(0), [i, d] = N(0), {
      setActiveHour: u,
      format: m,
      activeHour: f,
      minHour: p,
      maxHour: g,
      minPeriod: b,
      maxPeriod: h,
      period: y,
      mode: v,
      setMode: k,
      activeMinute: w,
      setActiveMinute: S,
      setHandAnimation: L,
      handAnimation: E,
      maxMinute: M,
      minMinute: q,
      hourAngle: Y,
      setHourAngle: R,
      minuteAngle: H,
      setMinuteAngle: G,
      increment: B,
      switchHoursToMinutesOnClick: U,
      bodyId: _
    } = Ye(nn), z = m === "24h" ? on.hours : on.hours.filter((P) => P.value < 13 && P.value !== 0), F = on.minutes, [V, C] = N("calc(40% + 1px)"), W = X(dc, []), J = () => {
      o(!0);
    }, O = X(
      (P) => {
        const re = P.target;
        o(!1), v === "hours" && re.closest(".timepicker-clock-wrapper") && (setTimeout(() => {
          U && k("minutes");
        }, 10), L(!0));
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [v, U]
    ), Q = X(
      (P, re) => {
        const ie = Math.round(W(P, re) + 360) % 360;
        return 30 * Math.round(ie / 30);
      },
      [W]
    ), T = X(
      (P, re, ie) => {
        const fe = Math.round(W(P, re) + 360) % 360, ne = ie ? 30 : 6;
        return ne * Math.round(fe / ne);
      },
      [W]
    );
    D(() => {
      const P = f * 30;
      R(P);
    }, [f]), D(() => {
      const P = w * 6;
      G(P);
    }, [w]);
    const $ = X(
      (P) => {
        var me;
        P.preventDefault();
        const { width: re, top: ie, left: fe } = (me = n.current) == null ? void 0 : me.getBoundingClientRect(), { clientX: ne, clientY: be } = "touches" in P ? P.touches[0] : P, ae = { x: re / 2, y: -re / 2 }, Ee = { x: ne - fe, y: ie - be };
        if (r)
          if (v === "hours") {
            const Ne = Q(ae, Ee);
            let he = Ne / 30;
            if (m === "24h") {
              const { radius: Te } = qn(c), { radius: ge } = qn(i);
              Fs(ae, Ee) < (Te + ge) / 2 - 16 && (he += 12);
            }
            yt(he, g, p, y, h, b) || (u(he), R(Ne));
          } else {
            const Ne = T(ae, Ee, B), he = Ne / 6;
            Kn(
              p,
              g,
              f,
              he,
              M,
              q,
              y,
              h,
              b
            ) || (S(he === 60 ? 0 : he), G(Ne));
          }
      },
      [
        f,
        M,
        q,
        h,
        b,
        v,
        y,
        S,
        g,
        p,
        u,
        i,
        c,
        m,
        R,
        G,
        B,
        r,
        Q,
        T
      ]
    );
    return D(() => {
      n.current && l(n.current.offsetWidth), s.current && d(s.current.offsetWidth);
    }, []), D(() => (ac(document, "click mousedown mousemove mouseover touchstart touchmove", $), () => {
      uc(document, "click mousedown mousemove mouseover touchstart touchmove", $);
    }), [$]), D(() => (document.addEventListener("mouseup", O), document.addEventListener("touchend", O), () => {
      document.removeEventListener("mouseup", O), document.removeEventListener("touchend", O);
    }), [O]), D(() => {
      const P = z.find((re) => re.value === f);
      P !== void 0 && (P.value > 12 || P.value === 24 ? C("21.5%") : C("calc(40% + 1px)"));
    }, [z, f]), /* @__PURE__ */ a(
      "div",
      {
        id: _,
        className: "timepicker-clock-wrapper d-flex justify-content-center flex-column align-items-center",
        ref: t,
        ...e,
        children: /* @__PURE__ */ j(
          "div",
          {
            onMouseDown: () => {
              J();
            },
            onTouchStart: () => {
              J();
            },
            ref: n,
            className: "timepicker-clock timepicker-clock-animation",
            children: [
              /* @__PURE__ */ a("span", { className: "timepicker-middle-dot position-absolute" }),
              /* @__PURE__ */ a(
                "div",
                {
                  className: `timepicker-hand-pointer position-absolute ${E && "timepicker-transform"}`,
                  style: {
                    transform: `rotateZ(${v === "hours" ? Y : H}deg)`,
                    height: v === "hours" ? V : "calc(40% + 1px)"
                  },
                  children: /* @__PURE__ */ a("div", { className: "timepicker-circle position-absolute", style: { backgroundColor: "rgb(25, 118, 210)" } })
                }
              ),
              v === "hours" && m === "24h" && /* @__PURE__ */ a("div", { ref: s, className: "timepicker-clock-inner", children: z.map((P) => {
                if (P.value > 12 || P.value === 0)
                  return /* @__PURE__ */ a(
                    "span",
                    {
                      id: P.id,
                      className: `timepicker-time-tips-inner ${yt(P.value, g, p, y, h, b) && "disabled"} ${P.value === f && "active"}`,
                      style: { left: P.left, bottom: P.bottom },
                      children: /* @__PURE__ */ a("span", { className: "timepicker-tips-inner-element", children: P.value === 24 ? "00" : P.value })
                    },
                    P.id
                  );
              }) }),
              v === "hours" && z.map((P) => {
                if (m === "24h") {
                  if (P.value < 13 && P.value !== 0)
                    return /* @__PURE__ */ a(
                      "span",
                      {
                        id: P.id,
                        className: `timepicker-time-tips-hours ${yt(P.value, g, p, y, h, b) && "disabled"} ${P.value === f && "active"}`,
                        style: { left: P.left, bottom: P.bottom },
                        children: /* @__PURE__ */ a("span", { className: "timepicker-tips-element", children: P.value })
                      },
                      P.id
                    );
                } else
                  return /* @__PURE__ */ a(
                    "span",
                    {
                      id: P.id,
                      className: `timepicker-time-tips-hours ${yt(P.value, g, p, y, h, b) && "disabled"} ${P.value === f && "active"}`,
                      style: { left: P.left, bottom: P.bottom },
                      children: /* @__PURE__ */ a("span", { className: "timepicker-tips-element", children: P.value })
                    },
                    P.id
                  );
              }),
              v === "minutes" && F.map((P) => /* @__PURE__ */ a(
                "span",
                {
                  id: P.id,
                  className: `timepicker-time-tips-minutes ${Kn(
                    p,
                    g,
                    f,
                    P.value,
                    M,
                    q,
                    y,
                    h,
                    b
                  ) && "disabled"} ${w === P.value && "active"}`,
                  style: { left: P.left, bottom: P.bottom },
                  children: /* @__PURE__ */ a("span", { className: "timepicker-tips-element", children: P.value < 10 ? `0${P.value}` : P.value })
                },
                P.id
              ))
            ]
          }
        )
      }
    );
  }
);
Os.displayName = "MDBTimePickerClock";
const Vs = se.forwardRef(
  ({ ...e }, t) => {
    const {
      setInputValue: n,
      cancelLabel: s,
      submitLabel: r,
      clearLabel: o,
      activeHour: c,
      period: l,
      activeMinute: i,
      maxHour: d,
      maxMinute: u,
      minHour: m,
      minMinute: f,
      maxPeriod: p,
      minPeriod: g,
      defaultValue: b,
      setActiveHour: h,
      setActiveMinute: y,
      setPeriod: v,
      format: k,
      setHourAngle: w,
      setMinuteAngle: S,
      onChange: L,
      onCloseHandler: E,
      setMode: M
    } = Ye(nn);
    return /* @__PURE__ */ a("div", { className: "timepicker-footer", ref: t, ...e, children: /* @__PURE__ */ j("div", { className: "w-100 d-flex justify-content-between", children: [
      /* @__PURE__ */ a(
        We,
        {
          onClick: () => {
            if (b !== "" && b !== void 0) {
              const { hour: R, minute: H, defaultPeriod: G } = Jt(b);
              k === "24h" ? (h(R === 0 ? 24 : R), R === 0 ? w(360) : R > 12 ? w((R - 12) * 30) : w(R * 30)) : (h(R), w(R * 30), v(G)), y(H), S(H * 6), n(b), L == null || L(b);
            } else
              h(12), w(360), y(0), S(360), n(""), L == null || L(""), v(k === "24h" ? "" : "AM");
            M("hours");
          },
          type: "button",
          color: "none",
          className: "timepicker-button timepicker-clear",
          tabIndex: 0,
          children: o
        }
      ),
      /* @__PURE__ */ a(
        We,
        {
          onClick: () => E == null ? void 0 : E(),
          type: "button",
          color: "none",
          className: "timepicker-button timepicker-cancel",
          tabIndex: 0,
          children: s
        }
      ),
      /* @__PURE__ */ a(
        We,
        {
          onClick: () => {
            if (yt(c, d, m, l, p, g) || yt(i, u, f, l, p, g))
              return;
            E == null || E();
            const R = c === 24 ? "00" : c < 10 ? `0${c}` : c, H = i < 10 ? `0${i}` : i, G = `${R}:${H} ${l}`.trim();
            n(G), L == null || L(G);
          },
          type: "button",
          color: "none",
          className: "timepicker-button timepicker-submit",
          tabIndex: 0,
          children: r
        }
      )
    ] }) });
  }
);
Vs.displayName = "MDBTimePickerFooter";
const mc = ({ isOpen: e, inline: t }) => {
  D(() => {
    if (t)
      return;
    const n = window.innerWidth > document.documentElement.clientWidth && window.innerWidth >= 576, r = `${(() => window.innerWidth - document.documentElement.clientWidth)()}px`;
    return e ? (document.body.style.overflow = "hidden", document.body.style.paddingRight = n ? r : "") : (document.body.style.overflow = "", document.body.style.paddingRight = ""), () => {
      document.body.style.overflow = "", document.body.style.paddingRight = "";
    };
  }, [e, t]);
}, hc = ({
  className: e,
  isOpen: t,
  wrapperRef: n,
  inline: s,
  referenceElement: r,
  onOpened: o,
  onClosed: c
}) => {
  const [l, i] = N(null), d = x("timepicker-modal", !s && "position-fixed", e), u = x(
    "timepicker-wrapper",
    "animation",
    "h-100",
    "d-flex",
    "align-items-center",
    "justify-content-center",
    "flex-column",
    s ? "timepicker-wrapper-inline" : "position-fixed",
    "fade",
    t && "show"
  ), { styles: m, attributes: f } = kt(r, l, {
    placement: "bottom-start"
  }), p = (g) => {
    g.opacity === 0 ? c() : o();
  };
  return mc({ isOpen: t, inline: s }), /* @__PURE__ */ a(we, { children: /* @__PURE__ */ a(ht, { children: /* @__PURE__ */ a(At, { children: t && (s ? /* @__PURE__ */ a(
    vt.div,
    {
      className: d,
      style: m.popper,
      ...f.popper,
      role: "dialog",
      ref: i,
      tabIndex: -1,
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      onAnimationComplete: (g) => p(g),
      children: /* @__PURE__ */ a("div", { ref: n, className: u, children: /* @__PURE__ */ a(
        "div",
        {
          className: "d-flex align-items-center justify-content-center flex-column shadow timepicker-container",
          style: { overflowY: "inherit" },
          children: /* @__PURE__ */ a("div", { className: "d-flex flex-column timepicker-elements justify-content-around timepicker-elements-inline", children: /* @__PURE__ */ a(an, {}) })
        }
      ) })
    }
  ) : /* @__PURE__ */ a(
    vt.div,
    {
      className: d,
      role: "dialog",
      tabIndex: -1,
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.3 },
      onAnimationComplete: (g) => p(g),
      children: /* @__PURE__ */ a("div", { ref: n, className: u, children: /* @__PURE__ */ j("div", { className: "d-flex align-items-center justify-content-center flex-column shadow timepicker-container", children: [
        /* @__PURE__ */ j("div", { className: "d-flex flex-column timepicker-elements justify-content-around", children: [
          /* @__PURE__ */ a(an, {}),
          /* @__PURE__ */ a(Os, {})
        ] }),
        /* @__PURE__ */ a(Vs, {})
      ] }) })
    }
  )) }) }) });
}, _n = (e, t, n, s, r) => {
  const o = n ? 55 : 59, c = n ? 5 : 1;
  let l;
  r ? l = s >= o ? 0 : s + c : l = s <= 0 ? o : s - c, e(l), t(l * 6);
}, Qt = (e, t, n, s, r, o) => {
  if (o && e === "24h") {
    let i = t;
    o === "isLeft" && (i = t <= 12 ? t + 12 : t), o === "isRight" && (i = t > 12 ? t - 12 : t), n(i), s(i * 30);
    return;
  }
  const c = e === "12h" ? 12 : 24;
  let l = t === 1 ? c : t - 1;
  r ? l = t === c ? 1 : t + 1 : l = t === 1 ? c : t - 1, n(l), s(l * 30);
}, zn = (e, t, n) => {
  const s = n == null ? void 0 : n.querySelectorAll('[tabindex="0"]');
  s && s[t] && (s[t].focus(), t === s.length - 1 ? e(0) : e(t + 1));
}, pc = (e, t, n, s, r, o) => {
  var c;
  !t && e.target === n && o && (o == null || o()), t && e.target !== n && !(n != null && n.contains(e.target)) && e.target !== (s == null ? void 0 : s.parentNode) && !((c = s == null ? void 0 : s.parentNode) != null && c.contains(e.target)) && r && (o == null || o());
}, Un = "ArrowLeft", Gn = "ArrowUp", Qn = "ArrowRight", Jn = "ArrowDown", Zn = "Enter", es = "Escape", ts = "Tab", js = Tt(
  ({
    isInDatetimepicker: e,
    onDatetimepickerModeSwitch: t,
    datetimepickerRef: n,
    className: s,
    defaultValue: r,
    value: o,
    maxTime: c,
    minTime: l,
    noIcon: i = !1,
    inputID: d,
    justInput: u = !1,
    inputClasses: m,
    inputLabel: f,
    invalidLabel: p,
    clearLabel: g,
    submitLabel: b,
    cancelLabel: h,
    format: y = Xs.format,
    timePickerClasses: v,
    customIcon: k = "far fa-clock",
    customIconSize: w = "sm",
    btnIcon: S = !0,
    inline: L = !1,
    increment: E = !1,
    onChange: M,
    inputStyle: q,
    onOpen: Y,
    onOpened: R,
    onClose: H,
    onClosed: G,
    disableFuture: B,
    disablePast: U,
    disabled: _ = !1,
    amLabel: z = "AM",
    pmLabel: F = "PM",
    switchHoursToMinutesOnClick: V = !0,
    headId: C = "",
    bodyId: W = "",
    open: J,
    style: O,
    ...Q
  }, T) => {
    const $ = Fe(() => r instanceof Date ? rn(r, y) : r, []), P = Fe(() => o instanceof Date ? rn(o, y) : o, [o, y]), [re, ie] = N(!1), [fe, ne] = N(!1), be = Mt(fe, J), [ae, Ee] = N(P || $ || ""), [me, Ne] = N(!1), [he, Te] = N(12), [ge, De] = N(0), [pe, ke] = N(y === "24h" ? "" : "AM"), [de, je] = N(24), [Se, qe] = N(1), [lt, ot] = N(59), [Ze, et] = N(0), [tt, at] = N(""), [ut, ct] = N(""), [Ve, Ge] = N("hours"), [nt, A] = N(!1), [le, Me] = N(360), [I, ue] = N(360), [Ie, Xe] = N(null), [Qe, _e] = N(0);
    r instanceof Date && (r = rn(r, y));
    const K = ir(), te = d ?? K, ce = {
      input: f ?? "Select a time",
      invalid: p ?? "Invalid Time Format",
      clear: g ?? "Clear",
      submit: b ?? "Ok",
      cancel: h ?? "Cancel"
    }, ve = x("timepicker", s), Ae = x("timepicker-input", me && "is-invalid", m), Pe = Z(null), Ce = Z(null), Re = Z(null), Be = Z(null);
    Dt(T, () => Be.current, [Be]);
    const ee = (He) => {
      Ee(He.target.value), M == null || M(He.target.value);
    }, oe = (He) => {
      u && (He.target.blur(), Y == null || Y());
    }, xe = X(() => {
      ne(!1), H == null || H();
    }, [H]), Le = X(() => {
      Te(Number(ae ? ae.split(":")[0] : 12)), De(Number(ae ? ae.split(":")[1].split(" ")[0] : 0)), A(!0), ne(!0), Y == null || Y();
    }, [Y, ae]), ze = X(() => {
      ie(!1), G == null || G(), Ge("hours"), _e(0);
    }, [G]), bt = X(() => {
      ie(!0), R == null || R();
    }, [R]), St = X(
      (He) => {
        re && pc(He, L, Re.current, Be.current, be, xe);
      },
      [Re, L, Be, be, xe, re]
    ), Ke = X(
      (He) => {
        var Sn, In;
        const { key: mt } = He, st = document.activeElement, rr = st === ((Sn = Re.current) == null ? void 0 : Sn.querySelector(".timepicker-hour")), or = st === ((In = Re.current) == null ? void 0 : In.querySelector(".timepicker-minute")), cr = st == null ? void 0 : st.closest('.timepicker-modal [tabindex="0"]');
        if (![Jn, Gn, es, ts, Zn, Un, Qn].includes(mt))
          return;
        L && !cr && zn(_e, 0, Re.current), He.preventDefault();
        const zt = !L && Ve === "hours" || L && rr, Bn = !L && Ve === "minutes" || L && or;
        switch (mt) {
          case es:
            return H == null ? void 0 : H();
          case Gn:
            if (zt)
              return Qt(y, he, Te, Me, !0);
            if (Bn)
              return _n(De, ue, E, ge, !0);
            break;
          case Jn:
            if (zt)
              return Qt(y, he, Te, Me, !1);
            if (Bn)
              return _n(De, ue, E, ge, !1);
            break;
          case Un:
            if (zt && !L)
              return Qt(y, he, Te, Me, !1, "isLeft");
            break;
          case Qn:
            if (zt && !L)
              return Qt(y, he, Te, Me, !0, "isRight");
            break;
          case ts:
            zn(_e, Qe, Re.current);
            break;
          case Zn:
            st.click();
            break;
        }
      },
      [he, y, Ve, ge, E, L, Qe, H]
    );
    return D(() => {
      if (!U && !B)
        return;
      const { hours: He, minutes: mt, period: st } = fc(y);
      if (U)
        return qe(He), et(mt), at(st);
      if (B)
        return je(He), ot(mt), ct(st);
    }, [B, U, y]), D(() => (be && re && (document.addEventListener("click", St), document.addEventListener("keydown", Ke)), () => {
      document.removeEventListener("click", St), document.removeEventListener("keydown", Ke);
    }), [be, re, St, Ke]), D(() => {
      if (c) {
        const { hour: He, minute: mt, defaultPeriod: st } = Jt(c);
        je(He), ot(mt), st !== void 0 && ct(st);
      }
      if (l) {
        const { hour: He, minute: mt, defaultPeriod: st } = Jt(l);
        qe(He), et(mt), st !== void 0 && at(st);
      }
    }, [c, l]), D(() => {
      typeof o == "string" && o && jn(o, y) && Ee(o);
    }, [o, y]), D(() => {
      if (jn(ae, y) || ae === "") {
        if (Ne(!1), ae !== "") {
          const { hour: He, minute: mt, defaultPeriod: st } = Jt(ae);
          y === "24h" ? (Te(He === 0 ? 24 : He), He === 0 ? Me(360) : He > 12 ? Me((He - 12) * 30) : Me(He * 30)) : (Te(He), Me(He * 30), ke(st)), De(mt), ue(mt * 6);
        }
      } else
        Ne(!0);
    }, [ae, y]), D(() => {
      let He;
      return nt && (He = setTimeout(() => {
        A(!1);
      }, 400)), () => {
        clearTimeout(He);
      };
    }, [nt]), /* @__PURE__ */ a(we, { children: /* @__PURE__ */ a(
      nn.Provider,
      {
        value: {
          isInDatetimepicker: e,
          onDatetimepickerModeSwitch: t,
          show: be,
          setInputValue: Ee,
          submitLabel: ce.submit,
          clearLabel: ce.clear,
          cancelLabel: ce.cancel,
          activeHour: he,
          activeMinute: ge,
          setActiveHour: Te,
          setActiveMinute: De,
          format: y,
          period: pe,
          setPeriod: ke,
          defaultValue: r,
          maxHour: de,
          minHour: Se,
          maxPeriod: ut,
          minPeriod: tt,
          mode: Ve,
          setMode: Ge,
          setHandAnimation: A,
          handAnimation: nt,
          minMinute: Ze,
          maxMinute: lt,
          hourAngle: le,
          setHourAngle: Me,
          minuteAngle: I,
          setMinuteAngle: ue,
          inline: L,
          increment: E,
          onChange: M,
          onOpen: Y,
          onClose: H,
          onCloseHandler: xe,
          amLabel: z,
          pmLabel: F,
          switchHoursToMinutesOnClick: V,
          headId: C,
          bodyId: W
        },
        children: /* @__PURE__ */ j(we, { children: [
          /* @__PURE__ */ a(
            "div",
            {
              className: ve,
              ref: L ? Xe : Pe,
              style: { ...O, height: "fit-content" },
              ...Q,
              children: !e && /* @__PURE__ */ a(
                wt,
                {
                  onFocus: oe,
                  ref: Be,
                  labelRef: Ce,
                  className: Ae,
                  label: ce.input,
                  id: te,
                  value: ae,
                  onChange: ee,
                  wrapperClass: "timepicker",
                  style: q,
                  disabled: _,
                  onClick: () => {
                    u && Le();
                  },
                  children: !u && !i && (S ? /* @__PURE__ */ a(
                    We,
                    {
                      className: "timepicker-toggle-button",
                      onClick: Le,
                      color: "none",
                      tabIndex: 0,
                      type: "button",
                      disabled: _,
                      style: { pointerEvents: _ ? "none" : "auto" },
                      children: /* @__PURE__ */ a("i", { className: `${k} ${w} timepicker-icon` })
                    }
                  ) : /* @__PURE__ */ a(
                    "i",
                    {
                      onClick: Le,
                      className: `${k} ${w} timepicker-icon timepicker-toggle-button`
                    }
                  ))
                }
              )
            }
          ),
          /* @__PURE__ */ a(
            hc,
            {
              isOpen: be,
              wrapperRef: Re,
              referenceElement: n || Ie,
              inline: L,
              className: v,
              onClosed: ze,
              onOpened: bt
            }
          )
        ] })
      }
    ) });
  }
);
js.displayName = "MDBTimepicker";
const vc = ({
  className: e,
  dropdown: t,
  children: n,
  styles: s,
  attributes: r,
  setPopperElement: o,
  style: c,
  onClosed: l,
  onOpened: i
}) => {
  const d = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  }, u = x("datepicker-dropdown-container", e), m = x("datepicker-modal-container", e), f = (p) => {
    p.opacity === 0 ? l == null || l() : i == null || i();
  };
  return /* @__PURE__ */ a(we, { children: t ? /* @__PURE__ */ a(
    vt.div,
    {
      style: { position: "absolute", zIndex: 1065, ...s.popper },
      ...r.popper,
      ref: o,
      className: u,
      tabIndex: -1,
      ...d,
      onAnimationComplete: (p) => f(p),
      children: n
    }
  ) : /* @__PURE__ */ a(
    vt.div,
    {
      ...d,
      className: m,
      style: c,
      onAnimationComplete: (p) => f(p),
      children: n
    }
  ) });
}, Je = {
  closeOnEsc: !0,
  title: "Select date",
  okBtnText: "Ok",
  clearBtnText: "Clear",
  cancelBtnText: "Cancel",
  customIcon: "far fa-calendar",
  customHeader: "",
  inputLabel: "Select a date",
  monthsFull: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ],
  monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  views: "days",
  format: "dd/mm/yyyy",
  weekdaysFull: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  weekdaysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  weekdaysNarrow: ["S", "M", "T", "W", "T", "F", "S"],
  startDay: 0
};
function rt(e) {
  return e.getDate();
}
function ns(e) {
  return e.getDay();
}
function $e(e) {
  return e.getMonth();
}
function ye(e) {
  return e.getFullYear();
}
function bc(e, t, n) {
  const s = n, r = s > 0 ? 7 - s : 0, c = new Date(e, t).getDay() + r;
  return c >= 7 ? c - 7 : c;
}
function gc(e) {
  return e.getDate() === jt(e);
}
function un(e) {
  return gc(e) ? jt(new Date(ye(e), $e(e) + 1, 1)) : rt(e);
}
function jt(e) {
  return yc(e).getDate();
}
function yc(e) {
  return It(e.getFullYear(), e.getMonth() + 1, 0);
}
function Wt() {
  return new Date();
}
function pt(e, t) {
  return ft(e, t * 12);
}
function ft(e, t) {
  const n = It(e.getFullYear(), e.getMonth() + t, e.getDate()), s = rt(e), r = rt(n);
  return s !== r && n.setDate(0), n;
}
function $t(e, t) {
  return It(e.getFullYear(), e.getMonth(), e.getDate() + t);
}
function It(e, t, n) {
  const s = new Date(e, t, n);
  return e >= 0 && e < 100 && s.setFullYear(s.getFullYear() - 1900), s;
}
function Zt(e) {
  return !Number.isNaN(e.getTime());
}
function ss(e, t) {
  return ye(e) - ye(t) || $e(e) - $e(t) || rt(e) - rt(t);
}
function xt(e, t) {
  return e.setHours(0, 0, 0, 0), t.setHours(0, 0, 0, 0), e.getTime() === t.getTime();
}
function rs(e) {
  return parseInt(e, 10) < 10 ? `0${e}` : e;
}
function dn(e, t) {
  const s = ye(e) - Ks(0, null, null);
  return wc(s, t);
}
function wc(e, t) {
  return (e % t + t) % t;
}
function Ks(e, t, n) {
  let s = 0;
  return n ? s = ye(n) - e + 1 : t && (s = ye(t)), s;
}
function Pt(e, t, n, s) {
  const r = t && ss(e, t) <= 0, o = n && ss(e, n) >= 0, c = s && s(e) === !1;
  return Boolean(r || o || c);
}
function fn(e, t, n, s, r, o) {
  const c = s && ye(s), l = s && $e(s), i = n && ye(n), d = n && $e(n), u = new Date().getFullYear(), m = new Date().getMonth();
  if (o && u === t && e < m || r && u === t && e > m || o && u > t || r && u < t)
    return !0;
  const f = l && c ? t > c || t === c && e > l : !1, p = d && i ? t < i || t === i && e < d : !1;
  return f || p;
}
function mn(e, t, n, s, r) {
  const o = new Date().getFullYear();
  if (r && e < o || s && e > o)
    return !0;
  const c = t && ye(t), l = n && ye(n), i = l ? e > l : !1, d = c ? e < c : !1;
  return i || d;
}
function Nc(e) {
  return e.match(/[^(dmy)]{1,}/g);
}
function kc(e, t) {
  return t.findIndex((n) => n === e);
}
function os(e, t, n, s, r) {
  return r ? qs(e, r, t, n, s, r) : !1;
}
function cs(e, t, n, s, r) {
  return s ? qs(e, s, t, n, s, r) : !1;
}
function qs(e, t, n, s, r, o) {
  if (n === "days")
    return ye(e) === ye(t) && $e(e) === $e(t);
  if (n === "months")
    return ye(e) === ye(t);
  if (n === "years") {
    const c = Ks(s, r, o);
    return Math.floor((ye(e) - c) / s) === Math.floor((ye(t) - c) / s);
  }
  return !1;
}
function Vt(e, t, n, s) {
  let r;
  if (t) {
    const o = Nc(t);
    if (o) {
      o[0] !== o[1] ? r = o[0] + o[1] : r = o[0];
      const c = new RegExp(`[${r}]`), l = e.split(c), i = t == null ? void 0 : t.split(c), d = (t == null ? void 0 : t.indexOf("mmm")) !== -1, u = [];
      i == null || i.forEach((h, y) => {
        h.indexOf("yy") !== -1 && (u[0] = { value: l[y], format: h }), h.indexOf("m") !== -1 && (u[1] = { value: l[y], format: h }), h.indexOf("d") !== -1 && h.length <= 2 && (u[2] = { value: l[y], format: h });
      });
      let m;
      (t == null ? void 0 : t.indexOf("mmmm")) !== -1 ? m = n : m = s;
      const f = Number(u[0].value), p = d ? kc(u[1].value, m) : Number(u[1].value) - 1, g = Number(u[2].value);
      return It(f, p, g);
    }
  }
}
function ls(e, t, n, s, r, o) {
  const c = rt(e), l = rs(rt(e).toString()), i = n[ns(e)], d = s[ns(e)], u = $e(e), m = rs(($e(e) + 1).toString()), f = r[$e(e)], p = o[$e(e)], g = ye(e).toString().length === 2 ? ye(e) : ye(e).toString().slice(2, 4), b = ye(e), h = t.split(/(d{1,4}|m{1,4}|y{4}|yy|!.)/g);
  let y = "";
  return h.forEach((v) => {
    switch (v) {
      case "dddd":
        v = v.replace(v, d);
        break;
      case "ddd":
        v = v.replace(v, i);
        break;
      case "dd":
        v = v.replace(v, l);
        break;
      case "d":
        v = v.replace(v, c.toString());
        break;
      case "mmmm":
        v = v.replace(v, p);
        break;
      case "mmm":
        v = v.replace(v, f);
        break;
      case "mm":
        v = v.replace(v, m);
        break;
      case "m":
        v = v.replace(v, u.toString());
        break;
      case "yyyy":
        v = v.replace(v, b.toString());
        break;
      case "yy":
        v = v.replace(v, g.toString());
        break;
    }
    y += v;
  }), y;
}
const _s = (e, t) => {
  if (!t)
    return !1;
  const n = new Date();
  return n.setHours(0, 0, 0, 0) === e.setHours(0, 0, 0, 0) ? !1 : e < n;
}, zs = (e, t) => {
  if (!t)
    return !1;
  const n = new Date();
  return e > n;
}, Lt = se.createContext({
  view: "days",
  setView: null,
  activeDate: new Date(),
  setActiveDate: null,
  selectedDate: new Date(),
  setSelectedDate: null,
  weekdaysShort: [],
  monthsShort: [],
  monthsFull: [],
  min: void 0,
  max: void 0,
  weekdaysFull: [],
  yearScope: [],
  tabCount: 0,
  inline: !1,
  disableFuture: !1,
  disablePast: !1
}), Mc = ({
  clearBtnText: e = "Clear",
  cancelBtnText: t = "Cancel",
  okBtnText: n = "Ok",
  setValue: s,
  selectDate: r,
  onClose: o
}) => {
  const { setActiveDate: c, setSelectedDate: l, selectedDate: i, isInDatetimepicker: d, onDatetimepickerModeSwitch: u } = Ye(Lt), m = (f) => {
    f.currentTarget.blur(), c(new Date()), l(void 0), s("");
  };
  return /* @__PURE__ */ j("div", { className: "datepicker-footer", children: [
    /* @__PURE__ */ a("button", { tabIndex: 0, onClick: (f) => m(f), className: "datepicker-footer-btn datepicker-clear-btn", children: e }),
    /* @__PURE__ */ a("button", { tabIndex: 0, onClick: () => o == null ? void 0 : o(), className: "datepicker-footer-btn datepicker-cancel-btn", children: t }),
    /* @__PURE__ */ a(
      "button",
      {
        tabIndex: 0,
        onClick: () => {
          r(i), d && (u == null || u()), o == null || o();
        },
        className: "datepicker-footer-btn datepicker-ok-btn",
        children: n
      }
    )
  ] });
}, xc = (e, t, n) => {
  const s = document.createElement("button"), r = document.createElement("div");
  s.id = `datepicker-toggle-${Math.floor(Math.random() * 10001)}`, s.tabIndex = 0, s.type = "button", s.style.pointerEvents = "auto";
  const o = document.createElement("i");
  o.className = `${e} fa-${t} datepicker-icon`, n && s.appendChild(o);
  const c = n ? s : o;
  return c.classList.add("datepicker-toggle-button"), {
    div: r,
    selector: c
  };
}, Ec = (e, t, n, s, r, o) => {
  const c = [], l = $e(e), i = $e(ft(e, -1)), d = $e(ft(e, 1)), u = ye(e), m = bc(u, l, o), f = jt(e), p = jt(ft(e, -1)), g = 7;
  let b = 1, h = !1;
  for (let y = 1; y < g; y++) {
    const v = [];
    if (y === 1) {
      const k = p - m + 1;
      for (let S = k; S <= p; S++) {
        const L = It(u, i, S);
        v.push({
          date: L,
          currentMonth: h,
          isSelected: t && xt(L, t),
          isToday: xt(L, Wt()),
          dayNumber: rt(L),
          disabled: Pt(L, n, s, r)
        });
      }
      h = !0;
      const w = g - v.length;
      for (let S = 0; S < w; S++) {
        const L = It(u, l, b);
        v.push({
          date: L,
          currentMonth: h,
          isSelected: t && xt(L, t),
          isToday: xt(L, Wt()),
          dayNumber: rt(L),
          disabled: Pt(L, n, s, r)
        }), b++;
      }
    } else
      for (let k = 1; k < 8; k++) {
        b > f && (b = 1, h = !1);
        const w = It(u, h ? l : d, b);
        v.push({
          date: w,
          currentMonth: h,
          isSelected: t && xt(w, t),
          isToday: xt(w, Wt()),
          dayNumber: rt(w),
          disabled: Pt(w, n, s, r)
        }), b++;
      }
    c.push(v);
  }
  return c;
}, Dc = (e) => {
  const t = [], n = e[0];
  let s = [];
  for (let r = 0; r < 24; r++)
    if (s.push(n + r), s.length === 4) {
      const o = s;
      t.push(o), s = [];
    }
  return t;
}, Tc = (e) => {
  const t = [];
  let n = [];
  return e.forEach((s) => {
    if (n.push(s), n.length === 4) {
      const r = n;
      t.push(r), n = [];
    }
  }), t;
}, Lc = ({
  filter: e,
  startWeekdays: t,
  startDay: n,
  inlineDayClick: s,
  selectOnClick: r,
  selectDate: o,
  onClose: c
}) => {
  const { min: l, max: i, setActiveDate: d, setSelectedDate: u, activeDate: m, selectedDate: f, tabCount: p, disableFuture: g, disablePast: b } = Ye(Lt), h = (y) => {
    !Pt(y, l, i, e) && (d(y), u(y), s(y), r && (o(y), c == null || c()));
  };
  return /* @__PURE__ */ j("table", { className: "datepicker-table", children: [
    /* @__PURE__ */ a("thead", { children: /* @__PURE__ */ a("tr", { children: t.map((y, v) => /* @__PURE__ */ a("th", { className: "datepicker-day-heading", scope: "col", children: y }, v)) }) }),
    /* @__PURE__ */ a("tbody", { className: "datepicker-table-body", children: Ec(m, f, l, i, e, n).map((y, v) => /* @__PURE__ */ a("tr", { children: y.map((k, w) => /* @__PURE__ */ a(
      "td",
      {
        onClick: () => h(k.date),
        tabIndex: xt(k.date, m) ? 0 : void 0,
        className: x(
          "datepicker-cell",
          "datepicker-small-cell",
          "datepicker-day-cell",
          k.isToday && "current",
          k.isSelected && "selected",
          k.disabled && "disabled",
          p === 3 && xt(k.date, m) && "focused",
          $e(m) !== $e(k.date) && "disabled",
          zs(k.date, g) && "disabled",
          _s(k.date, b) && "disabled"
        ),
        children: /* @__PURE__ */ a(
          "div",
          {
            className: "datepicker-cell-content datepicker-small-cell-content",
            style: { display: k.currentMonth ? "block" : "none" },
            children: k.dayNumber
          }
        )
      },
      w
    )) }, v)) })
  ] });
}, Bc = () => {
  const {
    yearScope: e,
    setView: t,
    setActiveDate: n,
    activeDate: s,
    selectedDate: r,
    tabCount: o,
    min: c,
    max: l,
    disableFuture: i,
    disablePast: d
  } = Ye(Lt);
  return /* @__PURE__ */ a("table", { className: "datepicker-table", children: /* @__PURE__ */ a("tbody", { className: "datepicker-table-body", children: Dc(e).map((u, m) => /* @__PURE__ */ a("tr", { children: u.map((f) => /* @__PURE__ */ a(
    "td",
    {
      onClick: () => {
        n(new Date(f, $e(s), rt(s))), t("months");
      },
      tabIndex: f === ye(s) ? 0 : void 0,
      className: x(
        "datepicker-cell",
        "datepicker-large-cell",
        "datepicker-year-cell",
        r && f === ye(r) && "selected",
        o === 3 && f === ye(s) && "focused",
        mn(f, c, l, i, d) && "disabled",
        ye(Wt()) === f && "current"
      ),
      children: /* @__PURE__ */ a("div", { className: "datepicker-cell-content datepicker-large-cell-content", children: f })
    },
    f
  )) }, m)) }) });
}, Sc = () => {
  const {
    monthsShort: e,
    setActiveDate: t,
    setView: n,
    activeDate: s,
    selectedDate: r,
    tabCount: o,
    min: c,
    max: l,
    disableFuture: i,
    disablePast: d
  } = Ye(Lt);
  return /* @__PURE__ */ a("table", { className: "datepicker-table", children: /* @__PURE__ */ a("tbody", { className: "datepicker-table-body", children: Tc(e).map((u, m) => /* @__PURE__ */ a("tr", { children: u.map((f) => /* @__PURE__ */ a(
    "td",
    {
      onClick: () => {
        t(new Date(ye(s), e.indexOf(f), un(s))), n("days");
      },
      tabIndex: e.indexOf(f) === $e(s) ? 0 : void 0,
      className: x(
        "datepicker-cell",
        "datepicker-large-cell",
        "datepicker-month-cell",
        r && e.indexOf(f) === $e(r) && ye(s) === ye(r) && "selected",
        o === 3 && e.indexOf(f) === $e(s) && "focused",
        $e(Wt()) === e.indexOf(f) && ye(Wt()) === ye(s) && "current",
        fn(
          e.indexOf(f),
          ye(s),
          c,
          l,
          i,
          d
        ) && "disabled"
      ),
      children: /* @__PURE__ */ a("div", { className: "datepicker-cell-content datepicker-large-cell-content", children: f })
    },
    e.indexOf(f)
  )) }, m)) }) });
}, Ic = ({ title: e, customHeader: t }) => {
  const { weekdaysShort: n, monthsShort: s, selectedDate: r, isInDatetimepicker: o, onDatetimepickerModeSwitch: c } = Ye(Lt), l = r || new Date();
  return /* @__PURE__ */ j("div", { className: "datepicker-header", children: [
    /* @__PURE__ */ a("div", { className: "datepicker-title", children: /* @__PURE__ */ a("span", { className: "datepicker-title-text", children: e }) }),
    /* @__PURE__ */ j("div", { className: "datepicker-date", children: [
      !t && /* @__PURE__ */ j("span", { className: "datepicker-date-text", children: [
        n[l.getDay()],
        ", ",
        s[l.getMonth()],
        " ",
        l.getDate()
      ] }),
      t && t
    ] }),
    o && /* @__PURE__ */ j("div", { className: "buttons-container", children: [
      /* @__PURE__ */ a("button", { type: "button", className: "datepicker-button-toggle", children: /* @__PURE__ */ a("i", { className: "far fa-calendar datepicker-toggle-icon" }) }),
      /* @__PURE__ */ a("button", { type: "button", className: "timepicker-button-toggle", onClick: c, children: /* @__PURE__ */ a("i", { className: "far fa-clock fa-sm timepicker-icon" }) })
    ] })
  ] });
}, Ac = () => {
  const { view: e, setView: t, activeDate: n, setActiveDate: s, monthsFull: r, min: o, max: c, yearScope: l } = Ye(Lt), i = (d) => {
    if (e === "days") {
      const u = d ? new Date(ye(n), $e(n) + 1, un(n)) : new Date(ye(n), $e(n) - 1, un(n));
      d ? !os(ft(u, -1), "days", 1, o, c) && s(u) : !cs(ft(u, 1), "days", 1, o, c) && s(u);
    } else if (e === "years") {
      const u = d ? new Date(ye(n) + 24, $e(n), rt(n)) : new Date(ye(n) - 24, $e(n), rt(n));
      d ? c ? l[0] + 24 < ye(c) && s(u) : s(u) : o ? l[1] - 24 > ye(o) && s(u) : s(u);
    } else if (e === "months") {
      const u = d ? new Date(ye(n) + 1, $e(n), rt(n)) : new Date(ye(n) - 1, $e(n), rt(n));
      d ? !os(pt(u, -1), "months", 1, o, c) && s(u) : !cs(pt(u, 1), "months", 1, o, c) && s(u);
    }
  };
  return /* @__PURE__ */ j("div", { className: "datepicker-date-controls", children: [
    e === "days" && /* @__PURE__ */ j("button", { tabIndex: 0, className: "datepicker-view-change-button", onClick: () => t("years"), children: [
      r[n.getMonth()],
      " ",
      n.getFullYear()
    ] }),
    e === "years" && /* @__PURE__ */ j("button", { tabIndex: 0, className: "datepicker-view-change-button", onClick: () => t("days"), children: [
      l[0],
      " - ",
      l[1]
    ] }),
    e === "months" && /* @__PURE__ */ a("button", { tabIndex: 0, className: "datepicker-view-change-button", onClick: () => t("days"), children: ye(n) }),
    /* @__PURE__ */ j("div", { className: "datepicker-arrow-controls", children: [
      /* @__PURE__ */ a("button", { tabIndex: 0, className: "datepicker-previous-button", onClick: () => i(!1) }),
      /* @__PURE__ */ a("button", { tabIndex: 0, className: "datepicker-next-button", onClick: () => i(!0) })
    ] })
  ] });
}, $c = ({
  labelText: e,
  inline: t,
  setReferenceElement: n,
  inputClasses: s,
  value: r,
  style: o,
  inputStyle: c,
  icon: l,
  input: i,
  inputId: d,
  inputToggle: u,
  setDatepickerValue: m,
  format: f,
  onOpenHandler: p,
  ...g
}) => {
  const { monthsFull: b, monthsShort: h, setSelectedDate: y, setActiveDate: v } = Ye(Lt), k = x(r ? "active" : "", s), w = Z(null);
  return D(() => {
    var Y;
    if (u)
      return;
    const E = (Y = w.current) == null ? void 0 : Y.parentNode, { div: M, selector: q } = xc(l, "sm", !0);
    return E == null || E.insertBefore(M, w.current), E == null || E.insertBefore(q, w.current), q.addEventListener("click", () => p == null ? void 0 : p()), () => {
      q.removeEventListener("click", () => p == null ? void 0 : p()), E == null || E.removeChild(q);
    };
  }, [l, p, u]), /* @__PURE__ */ a(
    wt,
    {
      className: k,
      label: e,
      id: d,
      ref: t ? n : i,
      labelRef: w,
      wrapperClass: "datepicker",
      value: r,
      onChange: (E) => {
        const M = Vt(E.target.value, f, b, h);
        m(E.target.value), M && Zt(M) ? (v(M), y(M)) : (v(new Date()), y(void 0));
      },
      style: c,
      wrapperStyle: o,
      onClick: () => {
        u && (p == null || p());
      },
      ...g
    }
  );
}, gn = "ArrowLeft", yn = "ArrowUp", wn = "ArrowRight", Nn = "ArrowDown", kn = "Home", Mn = "End", xn = "PageUp", En = "PageDown", Dn = "Enter", Tn = " ", Rc = (e, t, n, s, r, o, c, l, i, d) => {
  switch (e) {
    case gn:
      t((u) => $t(u, -1));
      break;
    case wn:
      t((u) => $t(u, 1));
      break;
    case yn:
      t((u) => $t(u, -7));
      break;
    case Nn:
      t((u) => $t(u, 7));
      break;
    case kn:
      t((u) => $t(u, 1 - rt(u)));
      break;
    case Mn:
      t((u) => $t(u, jt(u) - rt(u)));
      break;
    case xn:
      t((u) => ft(u, -1));
      break;
    case En:
      t((u) => ft(u, 1));
      break;
    case Dn:
      if (Pt(n, s, r, c) || _s(n, d) || zs(n, i))
        return;
      l(n), o(n);
      break;
    case Tn:
      if (!c || c(n)) {
        if (Pt(n, s, r, c))
          return;
        l(n), o(n);
      }
      break;
    default:
      return;
  }
}, Hc = (e, t, n, s, r, o, c, l, i) => {
  switch (e) {
    case gn:
      n((m) => pt(m, -1));
      break;
    case wn:
      n((m) => pt(m, 1));
      break;
    case yn:
      n((m) => pt(m, -4));
      break;
    case Nn:
      n((m) => pt(m, 4));
      break;
    case kn:
      n((m) => pt(m, -dn(m, 24)));
      break;
    case Mn:
      n((m) => pt(m, 24 - dn(m, 24) - 1));
      break;
    case xn:
      n((m) => pt(m, -24));
      break;
    case En:
      n((m) => pt(m, 24));
      break;
    case Dn:
      !mn(ye(t), s, r, l, i) && o("months");
      break;
    case Tn:
      !mn(ye(t), s, r, l, i) && c(t);
      return;
    default:
      return;
  }
}, Wc = (e, t, n, s, r, o, c, l, i, d) => {
  switch (e) {
    case gn:
      n((u) => ft(u, -1));
      break;
    case wn:
      n((u) => ft(u, 1));
      break;
    case yn:
      n((u) => ft(u, -4));
      break;
    case Nn:
      n((u) => ft(u, 4));
      break;
    case kn:
      n((u) => ft(u, -$e(u)));
      break;
    case Mn:
      n((u) => ft(u, 11 - $e(u)));
      break;
    case xn:
      n((u) => pt(u, -1));
      break;
    case En:
      n((u) => pt(u, 1));
      break;
    case Dn:
      !fn($e(t), ye(t), s, r, i, d) && o("days");
      break;
    case Tn:
      !fn($e(t), ye(t), s, r, i, d) && c(t);
      return;
    default:
      return;
  }
}, Pc = ({
  closeOnEsc: e,
  isOpen: t,
  activeDate: n,
  setActiveDate: s,
  min: r,
  max: o,
  view: c,
  setView: l,
  setSelectedDate: i,
  filter: d,
  setInlineDate: u,
  disableFuture: m,
  disablePast: f,
  onClose: p
}) => {
  const [g, b] = N(3), h = Z(null), y = X(
    (v) => {
      var w, S, L;
      if (e && v.key === "Escape" && (p == null || p()), v.preventDefault(), !v.shiftKey && v.key === "Tab") {
        const E = (w = h.current) == null ? void 0 : w.querySelectorAll('[tabindex="0"]');
        E && (g === E.length - 1 ? b(0) : b(g + 1));
      } else if (v.key === "Enter")
        g !== 3 && document.activeElement && document.activeElement.click();
      else if (v.shiftKey && v.key === "Tab") {
        const E = (S = h.current) == null ? void 0 : S.querySelectorAll('[tabindex="0"]');
        E && b(g === 0 ? E.length - 1 : g - 1);
      }
      ((L = h.current) == null ? void 0 : L.querySelector(".focused")) && g !== 4 && (c === "days" ? Rc(
        v.key,
        s,
        n,
        r,
        o,
        i,
        d,
        u,
        m,
        f
      ) : c === "years" ? Hc(
        v.key,
        n,
        s,
        r,
        o,
        l,
        i,
        m,
        f
      ) : c === "months" && Wc(
        v.key,
        n,
        s,
        r,
        o,
        l,
        i,
        d,
        m,
        f
      ));
    },
    [
      n,
      c,
      d,
      o,
      r,
      e,
      g,
      l,
      s,
      i,
      u,
      m,
      f,
      p
    ]
  );
  return D(() => {
    var k, w;
    const v = (k = h.current) == null ? void 0 : k.querySelectorAll('[tabindex="0"]');
    if (v) {
      const S = v[g];
      if (S.tagName !== "TD") {
        S.focus();
        const L = (w = h.current) == null ? void 0 : w.querySelector(".focused");
        L == null || L.classList.remove("focused");
      } else
        v[g - 1].blur(), S.classList.add("focused");
    }
  }, [g]), D(() => {
    t || b(3);
  }, [t]), D(() => {
    b(3);
  }, [c]), D(() => {
    if (t)
      return document.addEventListener("keydown", y), () => {
        document.removeEventListener("keydown", y);
      };
  }, [y, t]), { tabCount: g, modalRef: h };
}, Yc = ({ isOpen: e, inline: t }) => {
  D(() => {
    const n = window.innerWidth > document.documentElement.clientWidth && window.innerWidth >= 576;
    if (!t)
      return e && n ? (document.body.style.overflow = "hidden", document.body.style.paddingRight = "17px") : (document.body.style.overflow = "", document.body.style.paddingRight = ""), () => {
        document.body.style.overflow = "", document.body.style.paddingRight = "";
      };
  }, [e, t]);
}, Cc = ({
  isOpened: e,
  isOpen: t,
  inline: n,
  popperElement: s,
  referenceElement: r,
  backdropRef: o,
  onCloseHandler: c
}) => {
  const l = X(
    (i) => {
      var d;
      n ? !(s != null && s.contains(i.target)) && !((d = r == null ? void 0 : r.parentNode) != null && d.contains(i.target)) && !i.target.classList.contains("datepicker-view-change-button") && !i.target.classList.contains("datepicker-large-cell-content") && t && c() : i.target === o.current && t && c();
    },
    [s, r, o, n, t, c]
  );
  D(() => (e && document.addEventListener("click", l), () => {
    document.removeEventListener("click", l);
  }), [e, l]);
}, Us = Tt(
  ({
    datetimepickerRef: e,
    isInDatetimepicker: t,
    onDatetimepickerModeSwitch: n,
    closeOnEsc: s = Je.closeOnEsc,
    customHeader: r,
    title: o = Je.title,
    weekdaysNarrow: c = Je.weekdaysNarrow,
    monthsFull: l = Je.monthsFull,
    monthsShort: i = Je.monthsShort,
    weekdaysFull: d = Je.weekdaysFull,
    weekdaysShort: u = Je.weekdaysShort,
    disableFuture: m,
    disablePast: f,
    filter: p,
    inline: g,
    className: b,
    min: h,
    max: y,
    format: v = Je.format,
    okBtnText: k = Je.okBtnText,
    clearBtnText: w = Je.clearBtnText,
    cancelBtnText: S = Je.cancelBtnText,
    inputToggle: L,
    customIcon: E = Je.customIcon,
    inputLabel: M = Je.inputLabel,
    inputStyle: q,
    startDay: Y = Je.startDay,
    views: R = Je.views,
    style: H,
    defaultValue: G = "",
    onChange: B,
    onClose: U,
    onClosed: _,
    onOpen: z,
    onOpened: F,
    getFormattedDateValues: V,
    value: C,
    wrapperClass: W,
    selectOnClick: J = !1,
    open: O,
    disablePortal: Q,
    ...T
  }, $) => {
    const [P, re] = N(!1), [ie, fe] = N(!1), ne = Mt(ie, O), [be, ae] = N(new Date()), [Ee, me] = N(new Date()), [Ne, he] = N(R), [Te, ge] = N(C || G), [De, pe] = N(), [ke, de] = N(), [je, Se] = N(c), [qe, lt] = N([0, 0]), ot = Z(null), Ze = Z(null), et = Z(G && !0), { styles: tt, attributes: at } = kt(e || ke, De, {
      placement: "bottom-start",
      modifiers: [gs]
    });
    Dt($, () => g ? ke : Ze.current, [
      g,
      ke
    ]);
    const ut = (I) => {
      if (!g)
        return;
      if (g) {
        const Ie = ls(I, v, u, d, i, l);
        ge(Ie), t && (n == null || n()), Ve();
      }
    }, ct = (I) => {
      const ue = I && ls(I, v, u, d, i, l);
      ue && ge(ue);
    }, Ve = X(() => {
      fe(!1), U == null || U();
    }, [U]), Ge = X(() => {
      const I = Vt(Te, v, l, i);
      I && Zt(I) && (me(I), ae(I)), fe(!0), z == null || z();
    }, [z, Te, v, l, i]), nt = X(() => {
      re(!1), _ == null || _();
    }, [_]), A = X(() => {
      re(!0), F == null || F();
    }, [F]), { tabCount: le, modalRef: Me } = Pc({
      closeOnEsc: s,
      isOpen: ne,
      activeDate: be,
      setActiveDate: ae,
      min: h,
      max: y,
      view: Ne,
      setView: he,
      setSelectedDate: me,
      filter: p,
      setInlineDate: ut,
      disableFuture: m,
      disablePast: f
    });
    return Yc({ isOpen: ne, inline: g }), Cc({
      isOpened: P,
      isOpen: ne,
      inline: g,
      referenceElement: ke,
      popperElement: De,
      backdropRef: ot,
      onCloseHandler: Ve
    }), D(() => {
      const I = ye(be), ue = dn(be, 24), Ie = I - ue;
      lt([Ie, Ie + 23]);
    }, [be]), D(() => {
      const I = c.slice(Y).concat(c.slice(0, Y));
      Se(I);
    }, [c, Y]), D(() => {
      if (!ne)
        return;
      const I = g ? ke : Ze.current, ue = I == null ? void 0 : I.parentNode, Ie = ue == null ? void 0 : ue.querySelector("button");
      Ie ? Ie.blur() : I == null || I.blur();
    }, [ne, Ze, ke, g, z]), D(() => {
      O && !ne && !P && (z == null || z(), fe(!0));
    }, [O, ne, P, z]), D(() => {
      if (!et.current)
        return;
      const ue = Vt(Te, v, l, i);
      ue && Zt(ue) && (ae(ue), me(ue)), et.current = !1;
    }, [G, Te, v, l, i]), D(() => {
      const I = C && Vt(C, v, l, i);
      I && Zt(I) && (ae(I), me(I), ge(C)), C === "" && (ae(new Date()), me(void 0), ge(C));
    }, [C, v, l, i]), D(() => {
      ne || (he(R), Te || (ae(new Date()), me(void 0)));
    }, [ne, R, Te]), D(() => {
      B == null || B(Te, be);
    }, [Te]), D(() => {
      const I = Ee || new Date(), ue = String(I.getDate()), Ie = u[I.getDay()], Xe = d[I.getDay()], Qe = i[I.getMonth()], _e = l[I.getMonth()], K = String(I.getFullYear()), te = K.slice(-2);
      V == null || V({ dayNumber: ue, weekdayShort: Ie, weekdayFull: Xe, monthShort: Qe, monthFull: _e, yearFull: K, yearShort: te });
    }, [Ee]), /* @__PURE__ */ a(
      Lt.Provider,
      {
        value: {
          isInDatetimepicker: t,
          onDatetimepickerModeSwitch: n,
          view: Ne,
          setView: he,
          activeDate: be,
          setActiveDate: ae,
          selectedDate: Ee,
          setSelectedDate: me,
          weekdaysShort: u,
          monthsShort: i,
          monthsFull: l,
          min: h,
          max: y,
          weekdaysFull: d,
          yearScope: qe,
          tabCount: le,
          isOpen: ne,
          disablePast: f,
          disableFuture: m
        },
        children: /* @__PURE__ */ j(we, { children: [
          !t && /* @__PURE__ */ a(
            $c,
            {
              inputClasses: b,
              labelText: M,
              inline: g,
              setReferenceElement: de,
              value: Te,
              setDatepickerValue: ge,
              style: H,
              inputStyle: q,
              format: v,
              icon: E,
              input: Ze,
              inputToggle: L,
              onOpenHandler: Ge,
              ...T
            }
          ),
          /* @__PURE__ */ a(ht, { disablePortal: Q, children: /* @__PURE__ */ a(At, { children: ne && /* @__PURE__ */ j(we, { children: [
            /* @__PURE__ */ j(
              vc,
              {
                className: W,
                dropdown: g,
                styles: tt,
                attributes: at,
                setPopperElement: pe,
                onClosed: nt,
                onOpened: A,
                children: [
                  !g && /* @__PURE__ */ a(Ic, { title: o, customHeader: r, onClose: Ve }),
                  /* @__PURE__ */ j("div", { className: "datepicker-main", ref: Me, children: [
                    /* @__PURE__ */ a(Ac, {}),
                    /* @__PURE__ */ j("div", { className: "datepicker-view", children: [
                      Ne === "days" && /* @__PURE__ */ a(
                        Lc,
                        {
                          startWeekdays: je,
                          startDay: Y,
                          filter: p,
                          inlineDayClick: ut,
                          selectDate: ct,
                          selectOnClick: J,
                          onClose: Ve
                        }
                      ),
                      Ne === "years" && /* @__PURE__ */ a(Bc, {}),
                      Ne === "months" && /* @__PURE__ */ a(Sc, {})
                    ] }),
                    !g && /* @__PURE__ */ a(
                      Mc,
                      {
                        okBtnText: k,
                        clearBtnText: w,
                        cancelBtnText: S,
                        setValue: ge,
                        selectDate: ct,
                        onClose: Ve
                      }
                    )
                  ] })
                ]
              },
              "datepicker-modal-container"
            ),
            !g && /* @__PURE__ */ a(
              vt.div,
              {
                className: "datepicker-backdrop",
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 },
                transition: { duration: 0.3 },
                ref: ot
              }
            )
          ] }) }) })
        ] })
      }
    );
  }
);
Us.displayName = "MDBDatepicker";
const Xc = (e) => {
  const t = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9] [APap][mM]$/, n = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
  return e.match(t) || e.match(n);
}, Fc = (e) => e && Object.prototype.toString.call(e) === "[object Date]" && !isNaN(e.getTime()), is = 300, Oc = Tt(
  ({
    className: e,
    label: t = "Select Date and Time",
    labelStyle: n,
    labelClass: s,
    labelRef: r,
    inputClass: o = "",
    inline: c,
    disabled: l,
    value: i,
    invalidLabel: d,
    inputToggle: u = !1,
    timepickerOptions: m,
    datepickerOptions: f,
    showFormat: p,
    appendValidationInfo: g = !0,
    onChange: b,
    onOpen: h,
    onClose: y,
    onDatepickerOpen: v,
    onDatepickerClose: k,
    onTimepickerOpen: w,
    onTimepickerClose: S,
    ...L
  }, E) => {
    const M = Z(!1), [q, Y] = N(!1), [R, H] = N(!1), [G, B] = N((f == null ? void 0 : f.defaultValue) || ""), [U, _] = N((m == null ? void 0 : m.defaultValue) || ""), [z, F] = N(""), V = Z(), C = G ? z.split(",")[0] : null, W = U ? z.split(", ")[1] : null, J = x("form-outline", "datetimepicker", e), O = (f == null ? void 0 : f.format) || Je.format, Q = (m == null ? void 0 : m.format) || Xs.format, T = (f == null ? void 0 : f.defaultValue) || "", $ = (m == null ? void 0 : m.defaultValue) || "", P = () => {
      const he = C && Vt(C, O, Je.monthsFull, Je.monthsShort);
      return z && !C && !W || C && !Fc(he) || W && !Xc(W) ? o + " is-invalid" : o;
    }, re = X((he) => {
      B(he);
    }, []), ie = X((he) => {
      _(he);
    }, []), fe = X(() => {
      H(!1), M.current = !1, k == null || k();
    }, [k]), ne = X(() => {
      S == null || S(), Y(!1), M.current = !1;
    }, [S]), be = X(() => {
      v == null || v();
    }, [v]), ae = X(() => {
      w == null || w();
    }, [w]), Ee = () => {
      H(!0), h == null || h(), M.current = !0;
    }, me = X(() => {
      R ? (H(!1), setTimeout(() => {
        Y(!0);
      }, is)) : q && (Y(!1), setTimeout(() => {
        H(!0);
      }, is));
    }, [R, q]);
    D(() => {
      !U || !G || (b == null || b(`${G}, ${U}`), !i && F(`${G}, ${U}`));
    }, [U, G, b, i]), D(() => {
      i && (F(i), b == null || b(i));
    }, [i, b]), D(() => {
      !R && !q && !M.current && (y == null || y());
    }, [R, q, y]);
    const Ne = (he) => {
      F(he);
      const [Te, ge] = he.split(", ");
      B(Te || ""), _(ge || "");
    };
    return /* @__PURE__ */ j(we, { children: [
      /* @__PURE__ */ j("div", { className: J, ref: V, ...L, children: [
        /* @__PURE__ */ a(
          wt,
          {
            label: t,
            labelStyle: n,
            labelClass: s,
            ref: E,
            labelRef: r,
            placeholder: p ? `${O}, ${Q}` : void 0,
            value: i || z,
            onChange: (he) => {
              Ne(he.target.value), b == null || b(he.target.value);
            },
            className: g ? P() : o,
            disabled: l,
            onClick: () => {
              u && Ee();
            },
            children: d && /* @__PURE__ */ a("div", { className: "invalid-feedback", children: d })
          }
        ),
        !u && /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            className: "datetimepicker-toggle-button",
            onClick: Ee,
            disabled: l,
            style: { pointerEvents: l ? "none" : "initial" },
            children: /* @__PURE__ */ a("i", { className: "far fa-calendar datepicker-toggle-icon" })
          }
        )
      ] }),
      /* @__PURE__ */ a(
        Us,
        {
          ...f,
          inline: c,
          onChange: re,
          format: O,
          datetimepickerRef: V.current,
          defaultValue: T,
          value: G,
          onClose: fe,
          onOpen: be,
          isInDatetimepicker: !0,
          open: R,
          onDatetimepickerModeSwitch: me
        }
      ),
      /* @__PURE__ */ a(
        js,
        {
          ...m,
          inline: c,
          onChange: ie,
          format: Q,
          datetimepickerRef: V.current,
          defaultValue: $,
          value: U,
          onClose: ne,
          onOpen: ae,
          isInDatetimepicker: !0,
          open: q,
          onDatetimepickerModeSwitch: me
        }
      )
    ] });
  }
);
Oc.displayName = "MDBDateTimepicker";
const Vc = {
  open: {
    opacity: 1
  },
  closed: {
    opacity: 0
  }
}, Li = ({
  className: e,
  alertRef: t,
  position: n,
  delay: s = 1e3,
  autohide: r,
  width: o = "unset",
  containerRef: c,
  appendToBody: l,
  color: i,
  children: d,
  defaultOpen: u = !1,
  open: m,
  onClose: f,
  onClosed: p,
  onOpen: g,
  onOpened: b,
  dismissBtn: h = !1,
  animationVariants: y = {},
  initialAnimation: v = !1,
  style: k,
  ...w
}) => {
  const [S, L] = N(u), E = Mt(S, m), M = Z(null), q = t || M, Y = x(
    "alert",
    "fade",
    n && !c && "alert-fixed",
    h && "alert-dismissible",
    n && `alert-${n}`,
    c && "alert-absolute",
    i ? `alert-${i}` : "alert-primary",
    E && "show",
    e
  );
  D(() => {
    c != null && c.current.classList.add("parent-alert-relative");
  }, [c]), D(() => {
    E && (g == null || g());
  }, [E, g]), D(() => {
    let H;
    return r && E && (H = setTimeout(() => {
      f == null || f(), L(!1);
    }, s)), () => {
      clearTimeout(H);
    };
  }, [r, E, s, f]);
  const R = /* @__PURE__ */ a(At, { initial: v, children: E && /* @__PURE__ */ j(
    vt.div,
    {
      ...w,
      variants: { ...Vc, ...y },
      initial: "closed",
      animate: "open",
      exit: "closed",
      onAnimationComplete: (H) => {
        H === "open" ? b == null || b() : p == null || p();
      },
      className: Y,
      ref: q,
      style: {
        ...k,
        width: o === "unset" ? o : `${o}px`
      },
      children: [
        d,
        h && /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            className: "btn-close",
            "aria-label": "Close",
            onClick: () => {
              f == null || f(), L(!1);
            }
          }
        )
      ]
    }
  ) });
  return /* @__PURE__ */ a(ht, { disablePortal: !l, children: R });
}, Gs = se.forwardRef(
  ({ className: e, color: t, children: n, ...s }, r) => {
    const o = x("toast-header", t && `toast-${t}`, e);
    return /* @__PURE__ */ a("div", { className: o, ref: r, ...s, children: n });
  }
);
Gs.displayName = "MDBToastHeader";
const Qs = se.forwardRef(
  ({ className: e, children: t, ...n }, s) => {
    const r = x("toast-body", e);
    return /* @__PURE__ */ a("div", { className: r, ref: s, ...n, children: t });
  }
);
Qs.displayName = "MDBToastBody";
const Js = se.forwardRef(
  ({ className: e, white: t, children: n, ...s }, r) => {
    const o = x("btn-close", t && "btn-close-white", e);
    return /* @__PURE__ */ a(We, { className: o, color: "none", ref: r, ...s, children: n });
  }
);
Js.displayName = "MDBToastClose";
const jc = {
  open: {
    opacity: 1
  },
  closed: {
    opacity: 0
  }
}, Bi = ({
  className: e,
  position: t,
  delay: n = 1e3,
  autohide: s,
  width: r = "width",
  onOpen: o,
  onOpened: c,
  onClose: l,
  onClosed: i,
  containerRef: d,
  toastRef: u,
  appendToBody: m,
  color: f,
  defaultOpen: p = !1,
  open: g,
  bodyContent: b,
  headerContent: h,
  bodyClasses: y,
  headerClasses: v,
  closeBtnClasses: k,
  initialAnimation: w = !1,
  animationVariants: S,
  style: L,
  ...E
}) => {
  const [M, q] = N(p), Y = Mt(M, g), R = Z(null), H = u || R, G = x(
    "toast",
    "fade",
    t && !d && "toast-fixed",
    t && `toast-${t}`,
    d && "toast-absolute",
    f && `toast-${f}`,
    Y && "show",
    e
  ), B = X(() => {
    q(!1), Y && (l == null || l());
  }, [Y, l]);
  D(() => {
    d != null && d.current.classList.add("parent-toast-relative");
  }, [d]), D(() => {
    let _;
    return s && Y && (_ = setTimeout(() => {
      B();
    }, n)), () => {
      clearTimeout(_);
    };
  }, [s, Y, n, B]);
  const U = /* @__PURE__ */ a(At, { initial: w, children: Y && /* @__PURE__ */ j(
    vt.div,
    {
      ...E,
      variants: { ...jc, ...S },
      initial: "closed",
      animate: "open",
      exit: "closed",
      onAnimationComplete: (_) => {
        _ === "open" ? c == null || c() : i == null || i();
      },
      className: G,
      ref: H,
      style: { ...L, width: r === "unset" ? r : `${r}px` },
      children: [
        h && /* @__PURE__ */ j(Gs, { className: v, color: f, children: [
          h,
          /* @__PURE__ */ a(
            Js,
            {
              onClick: B,
              className: k,
              white: !!(f && f !== "light")
            }
          )
        ] }),
        /* @__PURE__ */ a(Qs, { className: y, children: b })
      ]
    }
  ) });
  return /* @__PURE__ */ a(ht, { disablePortal: !m, children: U });
}, Kc = 0, qc = ({
  selectedElements: e,
  optionHeight: t,
  data: n,
  multiple: s,
  selectAll: r,
  handleSelectAll: o,
  handleOptionClick: c,
  selectAllLabel: l,
  selectData: i,
  activeElementIndex: d,
  noResults: u,
  search: m
}) => {
  const f = Fe(() => i.filter((y) => y.optgroup).map((y) => y.optgroup), [i]), p = Fe(() => {
    let h = 0;
    return i.map((v) => (v.optgroup && h++, { ...v, groupIndex: h }));
  }, [i]), g = Fe(() => i.filter((h) => !h.optgroup && !h.hidden).length === 0, [i]), b = (h) => p.map((y) => {
    if (!y.optgroup && h === y.groupIndex)
      return /* @__PURE__ */ j(
        "div",
        {
          className: x(
            "select-option",
            e.includes(y.elementPosition) && "selected",
            y.disabled && "disabled",
            y.hidden && "d-none",
            d === y.elementPosition && "active"
          ),
          role: "option",
          style: { height: t },
          onClick: () => c(y),
          children: [
            /* @__PURE__ */ j("span", { className: "select-option-text", children: [
              s && /* @__PURE__ */ a(
                Yt,
                {
                  disabled: y.disabled,
                  disableWrapper: !0,
                  checked: e.includes(y.elementPosition),
                  readOnly: !0
                }
              ),
              y.text,
              y.secondaryText && /* @__PURE__ */ a("span", { className: "select-option-secondary-text", children: y.secondaryText })
            ] }),
            y.icon && /* @__PURE__ */ a("span", { className: "select-option-icon-container", children: /* @__PURE__ */ a("img", { className: "select-option-icon rounded-circle", src: y.icon }) })
          ]
        },
        y.elementPosition
      );
  });
  return /* @__PURE__ */ j(we, { children: [
    /* @__PURE__ */ j("div", { className: "select-options-list", children: [
      s && r && !g && /* @__PURE__ */ a(
        "div",
        {
          className: x(
            "select-option",
            e.length === n.filter((h) => !h.disabled).length && "selected",
            d === -1 && "active"
          ),
          role: "option",
          onClick: o,
          style: { height: t },
          children: /* @__PURE__ */ j("span", { className: "select-option-text", children: [
            /* @__PURE__ */ a(
              Yt,
              {
                disableWrapper: !0,
                checked: n.filter((h) => !h.disabled && !h.optgroup).length === e.length,
                readOnly: !0
              }
            ),
            l
          ] })
        }
      ),
      b(Kc),
      !g && (f == null ? void 0 : f.map((h, y) => {
        const v = b(y + 1).filter((k) => k !== void 0);
        if (v.length !== 0)
          return /* @__PURE__ */ j("div", { className: "select-option-group", children: [
            /* @__PURE__ */ a("label", { className: "select-option-group-label", style: { height: t }, children: h }),
            v
          ] }, `select-option-group ${h} ${y}`);
      }))
    ] }),
    m && g && /* @__PURE__ */ a("div", { className: "select-no-results", style: { height: t }, children: u })
  ] });
}, cn = "ArrowUp", ln = "ArrowDown", as = "Enter", us = "Escape", ds = "Tab", _c = (e, t) => {
  if (e.length !== t.length)
    return !1;
  for (let n = 0; n < e.length; n++) {
    const s = e[n], r = t[n], o = Object.keys(s), c = Object.keys(r);
    if (o.length !== c.length || !o.every((l) => c.includes(l)) || !o.every((l) => s[l] === r[l]))
      return !1;
  }
  return !0;
}, zc = (e) => e.map((t, n) => ({ ...t, elementPosition: n })), Uc = {
  open: {
    opacity: 1,
    transform: "scaleY(1)",
    transition: {
      duration: 0.2
    }
  },
  closed: {
    opacity: 0,
    transform: "scaleY(0.8)",
    transition: {
      duration: 0.2
    }
  }
}, Ot = -1, Zs = Tt(
  ({
    data: e,
    className: t,
    inputClassName: n,
    optionHeight: s = 38,
    visibleOptions: r = 5,
    disabled: o,
    placeholder: c,
    label: l,
    clearBtn: i,
    children: d,
    multiple: u,
    displayedLabels: m = 5,
    optionsSelectedLabel: f = "options selected",
    selectAll: p = !0,
    selectAllLabel: g = "Select all",
    size: b,
    openRef: h,
    contrast: y = !1,
    open: v,
    onOpen: k,
    onOpened: w,
    onClose: S,
    onClosed: L,
    onValueChange: E,
    onChange: M,
    search: q = !1,
    searchLabel: Y = "Search...",
    searchFn: R,
    autoSelect: H = !1,
    noResultsText: G = "No results",
    validation: B = !1,
    validFeedback: U = "Valid",
    invalidFeedback: _ = "Invalid",
    preventFirstSelection: z = !1,
    value: F,
    animationVariants: V,
    disablePortal: C,
    style: W,
    ...J
  }, O) => {
    const [Q, T] = N(!1), $ = Mt(Q, v), [P, re] = N(!0), [ie, fe] = N(null), [ne, be] = N(), [ae, Ee] = N();
    Dt(O, () => ne, [ne]);
    const [me, Ne] = N(""), [he, Te] = N(""), [ge, De] = N(() => p ? Ot : e.findIndex((ee) => !ee.disabled)), [pe, ke] = N([]), [de, je] = N([]), [Se, qe] = N(de), [lt, ot] = N(""), [Ze, et] = N(0), [tt, at] = N(!1), ut = x("select-wrapper", t), ct = x("select-input", c && "placeholder-active", $ && "focused", n), Ve = x($ || ie && l ? "active" : "", l && "select-label"), Ge = x("select-dropdown", $ && "open"), { styles: nt, attributes: A } = kt(ne, ae, {
      placement: "bottom-start"
    }), le = Z(null), Me = Z(null), I = Z(null), ue = Fe(
      () => u && p ? r + 1 : r,
      [p, r, u]
    );
    D(() => {
      if (!he)
        return qe(de);
      if (R && he) {
        const ee = R(he, de);
        return qe(ee || []);
      }
      qe(() => de.filter(
        (ee) => {
          var oe;
          return ((oe = ee.text) == null ? void 0 : oe.toLocaleLowerCase().includes(he.toLocaleLowerCase())) || ee.optgroup;
        }
      ));
    }, [he, de, R, me]), D(() => {
      $ && he && De(-1);
    }, [$, he]), D(() => {
      if (!B)
        return;
      const ee = pe.every((bt) => de[bt].value), oe = pe.every((bt) => !de[bt].disabled), xe = pe.length > 0;
      !u && (!xe || !ee || !oe) || u && (!xe || !oe) ? ne == null || ne.setCustomValidity(_) : ne == null || ne.setCustomValidity("");
    }, [B, _, pe, ne, de, me, u]);
    const Ie = (ee) => {
      if (de.length === 0)
        return;
      const oe = Me.current, xe = oe.offsetHeight, Le = oe.scrollTop, ze = de.filter((Ke) => Ke.hidden && Ke.elementPosition < ee).length, bt = u && p ? ee + 1 : ee;
      if (ee > (u && p ? -2 : -1)) {
        const Ke = (bt - ze) * s, He = Ke + s > Le + xe;
        Ke < Le ? oe.scrollTop = Ke : He ? oe.scrollTop = Ke - xe + s : oe.scrollTop = Le;
      }
    }, Xe = () => {
      const ee = (xe) => Se.findIndex((Le) => Le.elementPosition == xe);
      let oe = ge;
      for (; oe < de.length - 1; ) {
        oe++;
        const xe = ee(oe) != -1, Le = de[oe].disabled || de[oe].hidden || de[oe].optgroup, ze = Se[ee(oe - 1)] === Se[Se.length - 1];
        if (oe === de.length && (!xe || Le) || ze)
          return ge;
        if (xe && !Le)
          break;
      }
      return oe;
    }, Qe = () => {
      let ee = ge;
      for (; ee >= 0; ) {
        ee -= 1;
        const oe = Se.findIndex((Le) => Le.elementPosition == ee) != -1, xe = ee >= 0 && (de[ee].disabled || de[ee].hidden || de[ee].optgroup);
        if (ee <= 0 && (!oe || xe))
          return u && p ? ee = -1 : ge;
        if (oe && !xe)
          break;
      }
      return ee;
    }, _e = (ee) => {
      const { key: oe } = ee;
      if ([cn, ln, as, ds, us].includes(oe)) {
        if (oe === ds)
          return H && Ce(Se[ge]), ne == null || ne.focus(), T(!1);
        if (ee.preventDefault(), ee.altKey && (oe === ln || oe === cn))
          return $ ? S == null || S() : k == null || k(), T(!$);
        if (oe === ln) {
          const xe = Xe();
          if (!$) {
            u ? T(!0) : (ke([xe]), M == null || M(e[xe]));
            return;
          }
          return Ie(xe), De(xe);
        }
        if (oe === cn) {
          const xe = Qe();
          if (!$) {
            u ? T(!0) : (ke([xe]), M == null || M(e[xe]));
            return;
          }
          return Ie(xe), De(xe);
        }
        if (oe === as) {
          const xe = Se.findIndex((Le) => Le.elementPosition == ge);
          return $ ? ge === Ot ? ve() : Ce(Se[xe]) : (k == null || k(), T(!0));
        }
        if (oe === us)
          return T(!1), ne == null ? void 0 : ne.focus();
      }
    }, K = X(() => {
      T((ee) => !ee);
    }, []), te = X(
      (ee) => {
        if (h && h.current === ee.target)
          return;
        const oe = ae && ae !== null, xe = ne && ne !== null, Le = !(ae != null && ae.contains(ee.target)) && !(ne != null && ne.contains(ee.target)), ze = ee.target === I.current;
        oe && $ && xe && Le && !ze && (T(!1), S == null || S());
      },
      [ae, ne, $, S, h]
    );
    D(() => {
      const ee = zc(e);
      _c(ee, de) || je(ee);
    }, [e, de]);
    const ce = X(() => {
      $ && ot(`${ne == null ? void 0 : ne.offsetWidth}px`);
    }, [ne, $]), ve = () => {
      if (!u || !p)
        return;
      if (pe.length === e.filter((oe) => !oe.disabled && !oe.optgroup).length)
        return ke([]), E == null || E([]), M == null || M([]), Pe([]);
      const ee = de == null ? void 0 : de.filter((oe) => !oe.disabled && !oe.optgroup).map((oe) => oe.elementPosition);
      return ke(ee), E == null || E(e.filter((oe) => !oe.disabled)), M == null || M(e.filter((oe) => !oe.disabled)), Pe(ee);
    }, Ae = X(() => {
      if (de.length === 0)
        return;
      let ee = pe[0];
      const oe = ee === void 0, xe = ee >= de.length;
      if (tt && !u) {
        if (oe && z || !tt || u || xe)
          return;
        oe && (ee = 0);
        const Le = de[ee].value, ze = String(de[ee].text);
        ze ? (fe(Le ? null : ze), Ne(Le ? ze : "")) : (fe(null), Ne(Le ? " " : ""));
      }
    }, [u, tt, pe, de, z]), Pe = X(
      (ee) => {
        const oe = m === -1 || ee.length > m;
        if (ee.length <= 0 && (fe(null), Ne("")), oe)
          return fe(null), Ne(`${ee.length} ${f}`);
        const xe = ee.map((Ke) => de[Ke].text || "").filter((Ke) => Ke !== ""), Le = ee.map((Ke) => de[Ke].value || "").filter((Ke) => Ke !== ""), ze = xe.findIndex((Ke) => Ke !== "") === -1, bt = Le.length > 0, St = xe.join(", ");
        ze ? (fe(null), Ne(bt ? " " : "")) : bt ? (Ne(St), fe(null)) : (Ne(""), fe(St));
      },
      [m, f, de]
    );
    D(() => {
      Ae();
    }, [pe, Ae]);
    const Ce = (ee) => {
      if (!ee || ee.disabled)
        return;
      const { elementPosition: oe } = ee;
      if (u) {
        const Le = pe.includes(oe) ? pe.filter((ze) => ze !== oe) : [...pe, oe];
        return ke(Le), E == null || E(Le.map((ze) => e[ze])), M == null || M(Le.map((ze) => e[ze])), Pe(Le);
      }
      return ke([oe]), T(!1), E == null || E(e[oe]), M == null || M(e[oe]), S == null || S(), ne == null ? void 0 : ne.focus();
    };
    D(() => {
      at(!0);
    }, []), D(() => {
      if (u) {
        const oe = de.filter((xe) => xe.defaultSelected).map((xe) => xe.elementPosition);
        return Pe(oe), ke(oe);
      }
      let ee = de.findIndex((oe) => oe.defaultSelected);
      ee === Ot && !z && (ee = de.findIndex((oe) => !oe.disabled && !oe.hidden)), ee !== Ot && ke([ee]);
    }, [de, Pe, u, z]), D(() => {
      if ($ && q && pe.length === 0)
        return De(Ot);
      $ || (pe.length > 0 ? De(Math.max(...pe)) : De(0));
    }, [Se, $, q, pe]), D(() => {
      et(ue * s);
    }, [ue, s]), D(() => {
      ce();
    }, [ce]), D(() => ($ && (window.addEventListener("click", te), window.addEventListener("resize", ce)), () => {
      window.removeEventListener("click", te), window.removeEventListener("resize", ce);
    }), [te, ce, $]), D(() => {
      if (h) {
        const ee = h.current;
        return ee == null || ee.addEventListener("click", K), () => {
          ee == null || ee.removeEventListener("click", K);
        };
      }
    }, [h, K]), D(() => {
      if (!F)
        return;
      const ee = Array.isArray(F) ? F : [F], oe = de.filter((Le) => Le.value && ee.includes(Le.value)).map((Le) => Le.elementPosition);
      if (oe.toString() === pe.toString())
        return;
      const xe = u ? oe.map((Le) => de[Le]) : de[oe[0]];
      E == null || E(xe), M == null || M(xe), ke(oe), u ? Pe(oe) : Ae();
    }, [F, de, u, E, M, pe, Ae, Pe]);
    const Re = X(() => {
      o || (ne == null || ne.focus(), $ ? S == null || S() : k == null || k(), T(!$));
    }, [o, $, k, S, ne]), Be = X(
      (ee) => {
        var oe;
        ee === "open" && (re(!1), w == null || w(), q && ((oe = le.current) == null || oe.focus())), ee === "closed" && (re(!0), L == null || L(), q && Te(""));
      },
      [w, L, q]
    );
    return /* @__PURE__ */ a("div", { className: ut, style: W, children: /* @__PURE__ */ j(we, { children: [
      /* @__PURE__ */ j(
        wt,
        {
          ref: be,
          onClick: Re,
          onKeyDown: _e,
          className: ct,
          value: me,
          readonly: !B,
          required: B,
          disabled: o,
          placeholder: ie ? void 0 : c,
          label: l,
          labelClass: Ve,
          size: b,
          contrast: y,
          ...J,
          children: [
            B && /* @__PURE__ */ j(we, { children: [
              /* @__PURE__ */ a("div", { className: "invalid-feedback", children: _ }),
              /* @__PURE__ */ a("div", { className: "valid-feedback", children: U })
            ] }),
            ie && /* @__PURE__ */ a("div", { className: "form-label select-fake-value active", children: ie }),
            i && (me.length > 0 || ie) && /* @__PURE__ */ a(
              "span",
              {
                tabIndex: 0,
                className: `select-clear-btn d-block ${o ? "pe-none" : ""}`,
                role: "button",
                onClick: () => {
                  Ne(""), ke([]), E == null || E(u ? [] : {}), M == null || M(u ? [] : {});
                },
                children: "✕"
              }
            ),
            /* @__PURE__ */ a(
              "span",
              {
                className: `select-arrow ${o ? "pe-none" : ""}`,
                ref: I,
                onClick: Re,
                style: { cursor: "pointer" }
              }
            )
          ]
        }
      ),
      (e == null ? void 0 : e.length) > 0 && ($ || !P) && /* @__PURE__ */ a(ht, { disablePortal: C, children: /* @__PURE__ */ a(
        "div",
        {
          style: { ...nt.popper, width: lt, zIndex: 1070 },
          ...A.popper,
          ref: Ee,
          className: "select-dropdown-container",
          children: /* @__PURE__ */ a(At, { children: $ && /* @__PURE__ */ j(
            vt.div,
            {
              variants: { ...Uc, ...V },
              initial: "closed",
              animate: "open",
              exit: "closed",
              tabIndex: 0,
              className: Ge,
              onAnimationStart: () => {
                re(!1);
              },
              onAnimationComplete: Be,
              children: [
                q && /* @__PURE__ */ a("div", { className: "input-group", children: /* @__PURE__ */ a(
                  "input",
                  {
                    onKeyDown: _e,
                    onChange: (ee) => Te(ee.target.value),
                    ref: le,
                    type: "text",
                    className: "form-control select-filter-input",
                    role: "searchbox",
                    placeholder: Y
                  }
                ) }),
                /* @__PURE__ */ a(
                  "div",
                  {
                    className: "select-options-wrapper",
                    ref: Me,
                    style: { maxHeight: `${Ze}px` },
                    children: /* @__PURE__ */ a(
                      qc,
                      {
                        data: e,
                        selectData: Se,
                        selectedElements: pe,
                        optionHeight: s,
                        visibleOptions: ue,
                        handleOptionClick: Ce,
                        handleSelectAll: ve,
                        selectAll: p,
                        selectAllLabel: g,
                        multiple: u,
                        activeElementIndex: ge,
                        noResults: G,
                        search: q
                      }
                    )
                  }
                ),
                d && /* @__PURE__ */ a("div", { className: "select-custom-content", children: d })
              ]
            }
          ) })
        }
      ) })
    ] }) });
  }
);
Zs.displayName = "MDBSelectV2";
const _t = hn({
  isLoading: !1,
  activePage: 0,
  setActivePage: null,
  sort: { column: "", option: "" },
  fixedHeader: !1,
  handleSort: null
}), Gc = ({
  fullPagination: e,
  rowsText: t = "Rows per page:",
  selectValue: n,
  setSelectValue: s,
  activeDataLength: r,
  entriesOptions: o = [10, 25, 50, 200],
  fullDataLength: c,
  allText: l = "All",
  ofText: i = "of"
}) => {
  const { isLoading: d, activePage: u, setActivePage: m } = Ye(_t), f = u === 0 || d, p = r <= n * (u + 1) || d, g = u === Math.floor(r / n), b = o.map((v) => ({
    text: v.toString(),
    value: v,
    defaultSelected: n === v
  }));
  b.push({
    text: l,
    value: c,
    defaultSelected: n === c
  });
  const h = (v) => {
    v instanceof Array || (s(v.value), m(0));
  }, y = `${u * n + 1} - ${(u + 1) * n > r ? r : (u + 1) * n} ${i} ${r}`;
  return /* @__PURE__ */ j("div", { className: "datatable-pagination", children: [
    /* @__PURE__ */ j("div", { className: "datatable-select-wrapper", children: [
      /* @__PURE__ */ a("p", { className: "datatable-select-text", children: t }),
      /* @__PURE__ */ a(Zs, { onValueChange: h, data: b, disabled: d })
    ] }),
    /* @__PURE__ */ a("div", { className: "datatable-pagination-nav", children: y }),
    /* @__PURE__ */ j("div", { className: "datatable-pagination-buttons", children: [
      e && /* @__PURE__ */ a(
        We,
        {
          disabled: f,
          onClick: () => m(0),
          className: "datatable-pagination-button datatable-pagination-start",
          color: "link",
          children: /* @__PURE__ */ a(it, { icon: "angle-double-left" })
        }
      ),
      /* @__PURE__ */ a(
        We,
        {
          disabled: f,
          onClick: () => m(u - 1),
          className: "datatable-pagination-button datatable-pagination-left",
          color: "link",
          children: /* @__PURE__ */ a(it, { icon: "chevron-left" })
        }
      ),
      /* @__PURE__ */ a(
        We,
        {
          disabled: p,
          onClick: () => m(u + 1),
          className: "datatable-pagination-button datatable-pagination-right",
          color: "link",
          children: /* @__PURE__ */ a(it, { icon: "chevron-right" })
        }
      ),
      e && /* @__PURE__ */ a(
        We,
        {
          disabled: g,
          onClick: () => m(Math.floor(r / n)),
          className: "datatable-pagination-button datatable-pagination-end",
          color: "link",
          children: /* @__PURE__ */ a(it, { icon: "angle-double-right" })
        }
      )
    ] })
  ] });
}, fs = (e, t, n) => {
  const s = (r) => r.toString().toLowerCase().includes(t.toLowerCase());
  return e.filter((r) => {
    if (n && typeof n == "string")
      return s(r[n]);
    let o = Object.values(r);
    return n && Array.isArray(n) && (o = Object.keys(r).filter((c) => n.includes(c)).map((c) => r[c])), o.filter((c) => s(c)).length > 0;
  });
}, Qc = (e, t, n) => Object.assign([], e).sort((r, o) => {
  const c = typeof r[t] == "string" ? r[t].toLowerCase() : r[t], l = typeof o[t] == "string" ? o[t].toLowerCase() : o[t];
  return c < l ? n === "desc" ? 1 : -1 : c > l ? n === "desc" ? -1 : 1 : 0;
}), er = (e) => e.every((t) => typeof t == "string"), Ln = (e) => !e.every((t) => typeof t == "string"), Jc = (e) => Array.isArray(e), ms = (e) => !Array.isArray(e), Zc = ({
  search: e,
  advancedSearch: t,
  searchValue: n,
  setSearchValue: s,
  searchInputProps: r,
  label: o = "Search",
  setAdvancedSearchValue: c
}) => /* @__PURE__ */ j(we, { children: [
  e && /* @__PURE__ */ a(
    wt,
    {
      value: n,
      onChange: (l) => s(l.target.value),
      label: o,
      className: "mb-4",
      ...r
    }
  ),
  t && /* @__PURE__ */ j(Es, { className: "mb-4", children: [
    /* @__PURE__ */ a(
      "input",
      {
        className: "form-control",
        value: n,
        onChange: (l) => s(l.target.value),
        ...r
      }
    ),
    /* @__PURE__ */ a(
      We,
      {
        className: "datatable-advanced-search",
        onClick: () => c(t(n)),
        children: /* @__PURE__ */ a(it, { icon: "search" })
      }
    )
  ] })
] }), el = ({ dataColumns: e }) => {
  const { sort: t, fixedHeader: n, handleSort: s } = Ye(_t), [r, o] = N("rotate(0deg)"), c = (l) => x("datatable-sort-icon", `${l === t.column && "active"}`);
  return D(() => {
    const l = t.option === "desc" ? "rotate(180deg)" : "rotate(0deg)";
    o(l);
  }, [t.option]), /* @__PURE__ */ a(we, { children: e.map((l, i) => /* @__PURE__ */ j(
    "th",
    {
      className: n ? "fixed-cell" : "",
      style: { cursor: "pointer" },
      scope: "row",
      onClick: () => s(l),
      children: [
        /* @__PURE__ */ a(
          it,
          {
            fas: !0,
            icon: "arrow-up",
            className: c(l),
            style: { transform: l === t.column ? r : "rotate(0deg)" }
          }
        ),
        l
      ]
    },
    i
  )) });
}, tl = ({ dataColumns: e }) => {
  const [t, n] = N("rotate(0deg)"), { sort: s, fixedHeader: r, handleSort: o, isLoading: c } = Ye(_t), l = (i) => x("datatable-sort-icon", `${i === s.column && "active"}`);
  return D(() => {
    const i = s.option === "desc" ? "rotate(180deg)" : "rotate(0deg)";
    n(i);
  }, [s.option]), /* @__PURE__ */ a(we, { children: e.map((i, d) => {
    const { fixedValue: u, fixed: m, label: f } = i, p = i.sort !== !1 && !c, h = { ...{ cursor: x(p && "pointer") }, ...{
      left: m === "left" ? u || 0 : void 0,
      right: m === "right" ? u || 0 : void 0
    } }, y = x((r || m) && "fixed-cell");
    return /* @__PURE__ */ j(
      "th",
      {
        className: y,
        style: h,
        scope: "row",
        onClick: () => p && o(f),
        children: [
          p && /* @__PURE__ */ a(
            it,
            {
              fas: !0,
              icon: "arrow-up",
              className: l(f),
              style: { transform: s.column === f ? t : "rotate(0deg)" }
            }
          ),
          f
        ]
      },
      d
    );
  }) });
}, nl = ({ row: e, dataColumns: t, format: n, editable: s }) => /* @__PURE__ */ a(we, { children: t.map((r, o) => {
  const { field: c, fixed: l, width: i, fixedValue: d, columnSelector: u } = r, m = e[c], f = Number(m), p = n == null ? void 0 : n(c, f ? Number(m) : String(m)), b = { ...{
    minWidth: i,
    maxWidth: i,
    left: l === "left" && (d || 0),
    right: l === "right" && (d || 0)
  }, ...p }, h = x(l && "fixed-cell", u && `mdb-datatable-${u}`);
  return /* @__PURE__ */ a("td", { contentEditable: s, className: h, style: b, children: m }, o);
}) }), sl = ({ row: e, editable: t }) => /* @__PURE__ */ a(we, { children: e.map((n, s) => /* @__PURE__ */ a("td", { contentEditable: t, children: n }, s)) }), rl = ({
  activeData: e,
  dataRows: t,
  isOnThePage: n,
  noFoundMessage: s,
  dataColumns: r,
  onRowClick: o,
  selectable: c,
  handleRowSelect: l,
  selectedRows: i,
  format: d,
  editable: u
}) => {
  const { isLoading: m } = Ye(_t), f = e.length, p = r.length, g = (b, h) => {
    b.target.nodeName !== "INPUT" && (o == null || o(h));
  };
  return /* @__PURE__ */ j(eo, { className: "datatable-body", children: [
    e.map((b, h) => {
      const y = t.indexOf(b), v = i.includes(y), k = x(
        v && "active",
        ms(b) && b.rowSelector && `mdb-datatable-${b.rowSelector}`
      );
      if (n(h))
        return /* @__PURE__ */ j(
          "tr",
          {
            onClick: (w) => g(w, b),
            className: k,
            style: { cursor: o && "pointer" },
            children: [
              c && /* @__PURE__ */ a("td", { children: /* @__PURE__ */ a(Yt, { checked: v, onChange: () => l(y) }) }),
              Jc(b) && /* @__PURE__ */ a(sl, { editable: u, row: b }),
              ms(b) && Ln(r) && /* @__PURE__ */ a(nl, { editable: u, row: b, dataColumns: r, format: d })
            ]
          },
          h
        );
    }),
    !f && !m && /* @__PURE__ */ a("tr", { className: "datatable-results-info", children: /* @__PURE__ */ a("td", { colSpan: p, className: "text-center", children: s }) })
  ] });
}, ol = ({
  dataColumns: e,
  dataRows: t,
  sort: n,
  searchValue: s,
  advancedSearch: r,
  advancedSearchValue: o
}) => {
  const [c, l] = N(t);
  return D(() => {
    const { column: i, option: d } = n, { phrase: u, columns: m } = o;
    let f;
    if (i) {
      let p, g = 0;
      Ln(e) && (p = e.find((b) => b.label === i)), er(e) && (g = e.indexOf(i)), f = Qc(t, p ? p.field : g, d);
    }
    s && !r && (f = fs(f || t, s, void 0)), u && (f = fs(f || t, u, m)), l(f || t);
  }, [n, t, e, s, r, o]), c;
}, cl = se.forwardRef(
  ({
    advancedSearch: e,
    allText: t,
    className: n,
    bordered: s,
    borderless: r,
    borderColor: o = "",
    color: c = "",
    dark: l,
    entries: i = 10,
    editable: d,
    entriesOptions: u,
    fixedHeader: m,
    fullPagination: f,
    hover: p,
    format: g,
    loaderClass: b = "bg-primary",
    isLoading: h,
    loadingMessage: y = "Loading results...",
    maxWidth: v = "",
    maxHeight: k = "",
    multi: w,
    noFoundMessage: S = "No matching results found",
    pagination: L = !0,
    selectable: E,
    sortField: M = "",
    searchInputProps: q,
    sortOrder: Y = "asc",
    sm: R,
    striped: H,
    rowsText: G,
    data: B = {
      columns: [],
      rows: []
    },
    search: U,
    onSelectRow: _,
    onRowClick: z,
    searchLabel: F,
    ofText: V,
    ...C
  }, W) => {
    const [J, O] = N(0), [Q, T] = N(i), [$, P] = N({ column: "", option: "" }), [re, ie] = N([]), [fe, ne] = N(""), [be, ae] = N({
      phrase: "",
      columns: ""
    }), Ee = ol({
      dataColumns: B.columns,
      dataRows: B.rows,
      sort: $,
      searchValue: fe,
      advancedSearch: e,
      advancedSearchValue: be
    }), me = x(
      "datatable",
      p && "datatable-hover",
      c && `bg-${c}`,
      l && "datatable-dark",
      s && "datatable-bordered",
      r && "datatable-borderless",
      o && `border-${o}`,
      H && "datatable-striped",
      R && "datatable-sm",
      h && "datatable-loading",
      n
    ), Ne = (De) => J * Q <= De && De < (J + 1) * Q, he = (De) => {
      const { column: pe, option: ke } = $;
      P(pe === De ? ke === "asc" ? { ...$, option: "desc" } : { column: "", option: "" } : { column: De, option: "asc" });
    }, Te = (De) => {
      const ke = De.currentTarget.checked, de = ke ? Array.from({ length: B.rows.length }, (Se, qe) => qe) : [], je = de.map((Se) => Ee[Se]);
      _ == null || _(je, de, ke), ie(de);
    }, ge = (De) => {
      const pe = re.includes(De);
      let ke;
      w ? pe ? ke = re.filter((Se) => Se !== De) : ke = [...re, De] : pe ? ke = [] : ke = [De];
      const de = ke.map((Se) => Ee[Se]), je = ke.length === B.rows.length;
      _ == null || _(de, ke, je), ie(ke);
    };
    return D(() => {
      M && P({ column: M, option: Y });
    }, [M, Y]), D(() => {
      O(0);
    }, [fe]), /* @__PURE__ */ j(
      _t.Provider,
      {
        value: {
          isLoading: h,
          activePage: J,
          setActivePage: O,
          sort: $,
          fixedHeader: m,
          handleSort: he
        },
        children: [
          /* @__PURE__ */ a(
            Zc,
            {
              search: U,
              advancedSearch: e,
              searchValue: fe,
              setSearchValue: ne,
              searchInputProps: q,
              label: F,
              setAdvancedSearchValue: ae
            }
          ),
          /* @__PURE__ */ j("div", { className: me, ref: W, style: { maxWidth: v }, ...C, children: [
            /* @__PURE__ */ a(
              Ps,
              {
                className: "datatable-inner table-responsive ps",
                style: { overflow: "auto", position: "relative", maxWidth: v, maxHeight: k },
                children: /* @__PURE__ */ j(Jr, { className: "datatable-table", children: [
                  /* @__PURE__ */ a(Zr, { className: "datatable-header", children: /* @__PURE__ */ j("tr", { children: [
                    E && /* @__PURE__ */ a("th", { className: m ? "fixed-cell" : "", children: w && /* @__PURE__ */ a(Yt, { checked: re.length === B.rows.length, onChange: Te }) }),
                    er(B.columns) && /* @__PURE__ */ a(el, { dataColumns: B.columns }),
                    Ln(B.columns) && /* @__PURE__ */ a(tl, { dataColumns: B.columns })
                  ] }) }),
                  /* @__PURE__ */ a(
                    rl,
                    {
                      activeData: Ee,
                      dataColumns: B.columns,
                      dataRows: B.rows,
                      isOnThePage: Ne,
                      onRowClick: z,
                      format: g,
                      handleRowSelect: ge,
                      selectedRows: re,
                      selectable: E,
                      noFoundMessage: S,
                      editable: d
                    }
                  )
                ] })
              }
            ),
            h && /* @__PURE__ */ j(we, { children: [
              /* @__PURE__ */ a("div", { className: "datatable-loader bg-light}", children: /* @__PURE__ */ a("span", { className: "datatable-loader-inner", children: /* @__PURE__ */ a("span", { className: x("datatable-progress", b) }) }) }),
              /* @__PURE__ */ a("p", { className: "text-center text-muted my-4", children: y })
            ] }),
            L && /* @__PURE__ */ a(
              Gc,
              {
                fullPagination: f,
                selectValue: Q,
                setSelectValue: T,
                activeDataLength: Ee.length,
                rowsText: G,
                entriesOptions: u,
                fullDataLength: B.rows.length,
                allText: t,
                ofText: V
              }
            )
          ] })
        ]
      }
    );
  }
);
cl.displayName = "MDBDatatable";
ys.register(...dr || []);
const ll = (e) => {
  switch (e.toLowerCase()) {
    case "bar":
      return yr;
    case "line":
      return gr;
    case "pie":
      return br;
    case "doughnut":
      return vr;
    case "polararea":
      return pr;
    case "radar":
      return hr;
    case "bubble":
      return mr;
    default:
      return fr;
  }
}, il = (e, t, n) => {
  e || (e = {});
  const s = (r, o, c) => {
    const l = r.slice();
    return o.forEach((i, d) => {
      typeof l[d] > "u" ? l[d] = c.cloneUnlessOtherwiseSpecified(i, c) : c.isMergeableObject(i) ? l[d] = An(r[d], i, c) : r.indexOf(i) === -1 && l.push(i);
    }), l;
  };
  return An(n[t], e, {
    arrayMerge: s
  });
}, al = {
  line: {
    elements: {
      line: {
        backgroundColor: "rgba(66, 133, 244, 0.0)",
        borderColor: "rgb(66, 133, 244)",
        borderWidth: 2,
        tension: 0
      },
      point: {
        borderColor: "rgb(66, 133, 244)",
        backgroundColor: "rgb(66, 133, 244)"
      }
    },
    responsive: !0,
    plugins: {
      tooltip: {
        intersect: !1,
        mode: "index"
      },
      legend: {
        display: !0
      }
    },
    scales: {
      x: {
        stacked: !0,
        grid: {
          display: !1,
          drawBorder: !1
        },
        ticks: {
          color: "rgba(0,0,0, 0.5)"
        }
      },
      y: {
        stacked: !0,
        grid: {
          borderDash: [2],
          drawBorder: !1,
          tickBorderDash: [2],
          tickBorderDashOffset: [2]
        },
        ticks: {
          color: "rgba(0,0,0, 0.5)"
        }
      }
    }
  },
  bar: {
    elements: {
      line: {
        backgroundColor: "rgb(66, 133, 244)"
      },
      bar: {
        backgroundColor: "rgb(66, 133, 244)"
      }
    },
    responsive: !0,
    plugins: {
      tooltip: {
        intersect: !1,
        mode: "index"
      },
      legend: {
        display: !0
      }
    },
    scales: {
      x: {
        stacked: !0,
        grid: {
          display: !1,
          drawBorder: !1
        },
        ticks: {
          color: "rgba(0,0,0, 0.5)"
        }
      },
      y: {
        stacked: !0,
        grid: {
          borderDash: [2],
          drawBorder: !1,
          color: function(e) {
            return e.tick && e.tick.value === 0 ? "rgba(0,0,0, 0)" : ys.defaults.borderColor;
          },
          tickBorderDash: [2],
          tickBorderDashOffset: [2]
        },
        ticks: {
          color: "rgba(0,0,0, 0.5)"
        }
      }
    }
  },
  pie: {
    elements: {
      arc: { backgroundColor: "rgb(66, 133, 244)" }
    },
    responsive: !0,
    plugins: {
      legend: {
        display: !0
      }
    }
  },
  doughnut: {
    elements: {
      arc: { backgroundColor: "rgb(66, 133, 244)" }
    },
    responsive: !0,
    plugins: {
      legend: {
        display: !0
      }
    }
  },
  polarArea: {
    elements: {
      arc: { backgroundColor: "rgba(66, 133, 244, 0.5)" }
    },
    responsive: !0,
    plugins: {
      legend: {
        display: !0
      }
    }
  },
  radar: {
    elements: {
      line: {
        backgroundColor: "rgba(66, 133, 244, 0.5)",
        borderColor: "rgb(66, 133, 244)",
        borderWidth: 2
      },
      point: {
        borderColor: "rgb(66, 133, 244)",
        backgroundColor: "rgb(66, 133, 244)"
      }
    },
    responsive: !0,
    plugins: {
      legend: {
        display: !0
      }
    }
  },
  scatter: {
    elements: {
      line: {
        backgroundColor: "rgba(66, 133, 244, 0.5)",
        borderColor: "rgb(66, 133, 244)",
        borderWidth: 2,
        tension: 0
      },
      point: {
        borderColor: "rgb(66, 133, 244)",
        backgroundColor: "rgba(66, 133, 244, 0.5)"
      }
    },
    responsive: !0,
    plugins: {
      tooltip: {
        intersect: !1,
        mode: "index"
      },
      legend: {
        display: !0
      }
    },
    datasets: {
      borderColor: "red"
    },
    scales: {
      x: {
        stacked: !0,
        grid: {
          display: !1,
          drawBorder: !1
        },
        ticks: {
          color: "rgba(0,0,0, 0.5)"
        }
      },
      y: {
        stacked: !1,
        grid: {
          borderDash: [2],
          drawBorder: !1,
          tickBorderDash: [2],
          tickBorderDashOffset: [2]
        },
        ticks: {
          color: "rgba(0,0,0, 0.5)"
        }
      }
    }
  },
  bubble: {
    elements: {
      point: {
        borderColor: "rgb(66, 133, 244)",
        backgroundColor: "rgba(66, 133, 244, 0.5)"
      }
    },
    responsive: !0,
    plugins: {
      legend: {
        display: !0
      }
    },
    scales: {
      x: {
        grid: {
          display: !1,
          drawBorder: !1
        },
        ticks: {
          color: "rgba(0,0,0, 0.5)"
        }
      },
      y: {
        grid: {
          borderDash: [2],
          drawBorder: !1,
          tickBorderDash: [2],
          tickBorderDashOffset: [2]
        },
        ticks: {
          color: "rgba(0,0,0, 0.5)"
        }
      }
    }
  }
}, Si = ({ data: e, datalabels: t, options: n, type: s, chartRef: r, ...o }) => {
  const c = Z(null), l = r || c, i = ll(s);
  return /* @__PURE__ */ a(
    i,
    {
      data: e,
      options: il(n, s, al),
      ref: l,
      plugins: t ? [ur] : void 0,
      ...o
    }
  );
}, Ii = ({ children: e, position: t = "top-right", className: n, style: s }) => {
  const r = x("stack", `stack-${t}`, n), o = Fe(() => t.split("-")[0], [t]), c = Fe(() => t.split("-")[1], [t]), l = Fe(() => c !== "center" ? {
    [o]: 10,
    [c]: 10
  } : {
    [o]: 10,
    left: "50%",
    transform: "translateX(-50%)"
  }, [c, o]), i = Fe(() => {
    const d = vs.toArray(e);
    return o === "bottom" ? d.reverse() : d;
  }, [e, o]);
  return /* @__PURE__ */ a(
    "div",
    {
      className: r,
      style: {
        ...l,
        ...s
      },
      children: i.length > 0 && i.map((d, u) => se.cloneElement(d, {
        ...d.props,
        style: {
          marginTop: o === "bottom" ? "10px" : "0",
          marginBottom: o === "top" ? "10px" : "0",
          ...d.props.style
        },
        key: u
      }))
    }
  );
}, Bt = se.createContext({
  activeItem: 1,
  setActiveItem: null,
  prevActive: { current: 1 },
  setHeight: null,
  completed: [],
  noEditable: !1,
  isAnimating: { current: !1 },
  linear: !1,
  formRef: { current: null },
  validate: { target: 0, after: 0 },
  setValidate: null,
  type: "horizontal",
  stepsLength: 0,
  onValid: void 0,
  onInvalid: void 0,
  mobileProgress: !1,
  disableHeadSteps: !1,
  animations: !0,
  stepperRef: { current: null }
}), ul = ({ ofLabel: e = "of", stepLabel: t = "step" }) => {
  const { activeItem: n, stepsLength: s } = Ye(Bt);
  return /* @__PURE__ */ j("div", { className: "stepper-mobile-head bg-light", children: [
    t,
    " ",
    n,
    " ",
    e,
    " ",
    s
  ] });
}, dl = ({
  mobileProgress: e,
  backLabel: t = "BACK",
  nextLabel: n = "NEXT"
}) => {
  const { activeItem: s, setActiveItem: r, prevActive: o, isAnimating: c, stepsLength: l, onChange: i } = Ye(Bt), d = () => {
    if (c.current && s !== o.current)
      return;
    o.current = s;
    const m = s !== l ? s + 1 : s;
    i == null || i(m), r(m);
  };
  return /* @__PURE__ */ j("div", { className: "stepper-mobile-footer bg-light", children: [
    /* @__PURE__ */ a("div", { className: "stepper-back-btn", children: /* @__PURE__ */ j(We, { color: "link", onClick: () => {
      if (c.current && s !== o.current)
        return;
      o.current = s;
      const m = s !== 1 ? s - 1 : s;
      i == null || i(m), r(m);
    }, children: [
      /* @__PURE__ */ a(it, { fas: !0, icon: "chevron-left" }),
      t
    ] }) }),
    e && /* @__PURE__ */ a("div", { className: "stepper-mobile-progress gray-500", children: /* @__PURE__ */ a(
      "div",
      {
        className: "stepper-mobile-progress-bar bg-primary",
        style: { width: `${s / l * 100}%` }
      }
    ) }),
    /* @__PURE__ */ a("div", { className: "stepper-next-btn", children: /* @__PURE__ */ j(We, { color: "link", onClick: d, children: [
      n,
      /* @__PURE__ */ a(it, { fas: !0, icon: "chevron-right" })
    ] }) })
  ] });
}, fl = 500, Ai = ({
  className: e,
  children: t,
  defaultStep: n = 1,
  activeStep: s,
  linear: r,
  noEditable: o,
  externalNext: c,
  externalPrev: l,
  style: i,
  type: d = "horizontal",
  onChange: u,
  onInvalid: m,
  onValid: f,
  mobileProgress: p,
  disableHeadSteps: g,
  mobileOfLabel: b,
  mobileStepLabel: h,
  mobileBackLabel: y,
  mobileNextLabel: v,
  animations: k = !0,
  ...w
}) => {
  const [S, L] = N(s || n), E = Fe(() => s === void 0 ? S : s, [s, S]), [M, q] = N(void 0), [Y, R] = N([]), [H, G] = N({ target: 0, after: 0 }), [B, U] = N(0), _ = Z(n), z = Z(!1), F = d === "mobile", V = x(
    "stepper",
    d === "horizontal" && "stepper-horizontal",
    d === "vertical" && "stepper-vertical",
    F && "stepper-mobile",
    e
  ), C = { height: x(d !== "vertical" && M && String(M)), ...i }, W = Z(null), J = Z(null);
  return D(() => {
    const O = () => {
      L((T) => {
        if (z.current && T !== _.current)
          return T;
        _.current = T;
        const $ = T !== B ? T + 1 : T;
        return r ? (G({ target: T, after: $ }), T) : (u == null || u($), $);
      });
    }, Q = c == null ? void 0 : c.current;
    if (Q)
      return Q.addEventListener("click", O), () => {
        Q.removeEventListener("click", O);
      };
  }, [c, r, B, u]), D(() => {
    const O = () => {
      L((T) => {
        if (z.current && T !== _.current)
          return T;
        _.current = T;
        const $ = T !== 1 ? T - 1 : T;
        return r ? (G({ target: T, after: $ }), T) : (u == null || u($), $);
      });
    }, Q = l == null ? void 0 : l.current;
    if (Q)
      return Q.addEventListener("click", O), () => {
        Q.removeEventListener("click", O);
      };
  }, [l, r, u]), D(() => {
    R((O) => O.includes(E) ? O : [...O, E]);
  }, [E]), D(() => {
    z.current = !0;
    const O = setTimeout(() => {
      _.current = E, z.current = !1;
    }, fl);
    return () => {
      clearTimeout(O);
    };
  }, [E]), D(() => {
    const O = W.current;
    if (!O)
      return;
    const Q = O.querySelectorAll("li").length;
    U(Q);
  }, []), /* @__PURE__ */ a("ul", { ref: W, className: V, ...w, style: C, children: /* @__PURE__ */ j(
    Bt.Provider,
    {
      value: {
        activeItem: E,
        setActiveItem: L,
        prevActive: _,
        setHeight: q,
        completed: Y,
        noEditable: o,
        isAnimating: z,
        linear: r,
        formRef: J,
        validate: H,
        setValidate: G,
        type: d,
        stepsLength: B,
        onValid: f,
        onInvalid: m,
        onChange: u,
        mobileProgress: p,
        disableHeadSteps: g,
        animations: k,
        isControlled: s !== void 0,
        stepperRef: W
      },
      children: [
        F && /* @__PURE__ */ a(ul, { ofLabel: b, stepLabel: h }),
        t,
        F && /* @__PURE__ */ a(
          dl,
          {
            backLabel: y,
            nextLabel: v,
            mobileProgress: p
          }
        )
      ]
    }
  ) });
}, ml = (e, t, n, s, r, o, c) => {
  const { setHeight: l } = Ye(Bt);
  D(() => {
    if (r || !t.current)
      return;
    const d = (c ? t.current.querySelector(".stepper-mobile-head") : n == null ? void 0 : n.current).offsetHeight || 0, u = (f) => {
      if (!e || !s.current)
        return;
      const p = t.current;
      let g = 0;
      c && p && (g = p.querySelector(".stepper-mobile-footer").offsetHeight);
      const b = f[0].contentRect.height, h = window.getComputedStyle(s.current), y = parseFloat(h.paddingTop) + parseFloat(h.paddingBottom) + parseFloat(h.marginBottom) + parseFloat(h.marginTop);
      l(`${b + y + d + g}px`);
    }, m = new ResizeObserver((f) => {
      u(f);
    });
    return m.observe(s.current), () => {
      m.disconnect();
    };
  }, [e, o, c, s, n, t, r, l]);
}, hl = (e, t, n) => {
  let s = "";
  const r = n > t, o = n < t;
  return e ? s = x(r && "slide-out-left", o && "slide-out-right") : s = x(r && "slide-in-right", o && "slide-in-left"), s;
}, pl = (e, t) => Array.from(
  e.querySelectorAll("input[required], select[required], textarea[required]")
).every((s) => t ? t(s) : s.checkValidity()), tr = Tt(
  ({ itemId: e, children: t, className: n, style: s }, r) => {
    const { activeItem: o, prevActive: c, animations: l } = Ye(Bt), [i, d] = N(e === o), [u, m] = N(!1), f = hl(u, c.current, o), p = x(
      "stepper-content",
      "animation",
      "py-3",
      !i && "stepper-content-hide",
      f && f,
      n
    ), b = { display: (l ? i || u : i) ? "block" : "none", ...s };
    return D(() => {
      const { current: h } = c;
      e === h && (m(!0), setTimeout(() => {
        m(!1);
      }, 800));
    }, [e, c, o]), D(() => {
      d(e === o);
    }, [e, o]), /* @__PURE__ */ a("div", { className: p, style: b, ref: r, children: /* @__PURE__ */ a("span", { children: t }) });
  }
);
tr.displayName = "MDBStepperContent";
const vl = ({ itemId: e, children: t, className: n, style: s }) => {
  const { activeItem: r } = Ye(Bt), [o, c] = N(!0), l = x("stepper-content", "py-0", "d-grid", !o && "stepper-content-hide", n), i = {
    transition: "grid-template-rows 0.3s ease-in-out",
    gridTemplateRows: o ? "1fr" : "0fr",
    ...s
  };
  return D(() => {
    c(e === r);
  }, [e, r]), /* @__PURE__ */ a("div", { style: i, className: l, children: /* @__PURE__ */ a(
    "span",
    {
      className: `${o ? "py-3" : "py-0"} overflow-hidden`,
      style: {
        transition: "padding 0.3s ease-in-out"
      },
      children: t
    }
  ) });
}, $i = ({
  className: e,
  itemId: t,
  children: n,
  headIcon: s,
  headText: r,
  customValidation: o,
  headClassName: c,
  contentClassName: l,
  headStyle: i,
  contentStyle: d,
  ...u
}) => {
  const {
    activeItem: m,
    setActiveItem: f,
    prevActive: p,
    completed: g,
    noEditable: b,
    linear: h,
    formRef: y,
    validate: v,
    setValidate: k,
    type: w,
    onInvalid: S,
    onValid: L,
    onChange: E,
    mobileProgress: M,
    isAnimating: q,
    disableHeadSteps: Y,
    isControlled: R,
    stepperRef: H
  } = Ye(Bt), G = w === "vertical", B = w === "mobile", [U, _] = N(!1), [z, F] = N(!1), V = g.includes(t), C = m === t, W = b && V && !C, O = x(
    "stepper-step",
    C && "stepper-active",
    V && "stepper-completed",
    W && "stepper-disabled",
    h && U && "was-validated",
    z && "stepper-invalid",
    e
  ), Q = x("stepper-head", c), T = Z(null), $ = Z(null), P = Z(null), re = { cursor: x(Y && "auto"), ...i }, ie = () => {
    const fe = q.current && !G && m !== p.current;
    if (!(W || C || Y || fe)) {
      if (h && !R) {
        k({ target: m, after: t });
        return;
      }
      p.current = m, f(t), E == null || E(t);
    }
  };
  return D(() => {
    const { target: fe, after: ne } = v;
    if (t === fe && h) {
      if (ne < fe) {
        p.current = fe, f(ne), E == null || E(ne);
        return;
      }
      const be = $.current, ae = y.current;
      ae == null || ae.classList.add("was-validated");
      const Ee = pl(be, o);
      _(!0), F(!Ee), Ee ? (L == null || L(t), ae == null || ae.classList.remove("was-validated"), p.current = fe, f(ne), E == null || E(ne)) : S == null || S(t);
    }
  }, [
    v,
    t,
    y,
    h,
    f,
    p,
    R,
    L,
    S,
    E,
    o
  ]), ml(C, H, T, P, G, n, B), /* @__PURE__ */ j("li", { ref: $, className: O, ...u, children: [
    !M && /* @__PURE__ */ j("div", { className: Q, tabIndex: C ? 0 : -1, ref: T, onClick: ie, style: re, children: [
      /* @__PURE__ */ a("span", { className: "stepper-head-icon", children: s }),
      /* @__PURE__ */ a("span", { className: "stepper-head-text", children: r })
    ] }),
    G ? /* @__PURE__ */ a(
      vl,
      {
        style: d,
        className: l,
        isValidated: U,
        itemId: t,
        children: n
      }
    ) : /* @__PURE__ */ a(tr, { ref: P, style: d, className: l, itemId: t, children: n })
  ] });
}, Ri = ({ className: e, children: t, onSubmit: n, ...s }) => {
  const { formRef: r, setValidate: o, activeItem: c } = Ye(Bt), l = x("stepper-form", e);
  return /* @__PURE__ */ a(Ds, { onSubmit: (d) => {
    o({ target: c, after: c }), n == null || n(d);
  }, ref: r, className: l, ...s, noValidate: !0, children: t });
}, nr = se.createContext({
  activeItem: 0,
  dynamic: !1,
  dynamicStyle: { color: "", icon: "" },
  setDynamicStyle: null,
  setActiveItem: null,
  hoveredItem: 0,
  setHoveredItem: null,
  readonly: !1,
  onChange: void 0
}), Hi = ({
  className: e,
  readonly: t = !1,
  defaultValue: n = 0,
  value: s,
  dynamic: r,
  children: o,
  onChange: c,
  ...l
}) => {
  const i = x("rating", e), [d, u] = N(0), [m, f] = N({ color: "", icon: "" }), [p, g] = N(n), b = Fe(() => s !== void 0 ? s : p, [s, p]);
  return /* @__PURE__ */ a("ul", { className: i, ...l, children: /* @__PURE__ */ a(
    nr.Provider,
    {
      value: {
        readonly: t,
        activeItem: b,
        setActiveItem: g,
        hoveredItem: d,
        setHoveredItem: u,
        dynamic: r,
        dynamicStyle: m,
        setDynamicStyle: f,
        onChange: c
      },
      children: o
    }
  ) });
}, Wi = ({
  className: e,
  color: t,
  itemId: n,
  iconClassName: s,
  insertAfter: r,
  insertBefore: o,
  icon: c,
  onClick: l,
  onMouseEnter: i,
  onMouseLeave: d,
  popover: u,
  size: m = "sm",
  title: f,
  style: p,
  ...g
}) => {
  const {
    activeItem: b,
    setActiveItem: h,
    hoveredItem: y,
    setHoveredItem: v,
    dynamic: k,
    dynamicStyle: w,
    setDynamicStyle: S,
    readonly: L,
    onChange: E
  } = Ye(nr), M = !y && b && b >= n || y >= n, q = x(M && "active", !t && "text-primary", s), Y = (B) => {
    L || (h && h(n), E == null || E(n), l && l(B));
  }, R = (B) => {
    L || (h && v(n), i && i(B));
  }, H = (B) => {
    L || (h && v(0), d && d(B));
  };
  D(() => {
    k && (y || b) === n && S({ color: t, icon: c });
  }, [b, n, t, c, k, S, y]);
  const G = /* @__PURE__ */ a(we, { children: /* @__PURE__ */ j(
    "li",
    {
      className: e,
      onMouseEnter: R,
      onMouseLeave: H,
      onClick: Y,
      style: { cursor: L ? "default" : "pointer", ...p },
      ...g,
      children: [
        o,
        /* @__PURE__ */ a(
          it,
          {
            far: !M,
            fas: M,
            icon: w.icon ? w.icon : c,
            size: m,
            className: q,
            style: { color: w.color ? w.color : t && t }
          }
        ),
        r
      ]
    }
  ) });
  return /* @__PURE__ */ a(we, { children: f ? /* @__PURE__ */ a(Pr, { tag: "a", title: f, children: G }) : u ? /* @__PURE__ */ a(mo, { tag: "a", btnChildren: G, children: /* @__PURE__ */ a(ho, { children: u }) }) : G });
}, bl = ({
  animation: e = "fade-in",
  className: t,
  containerRef: n,
  lazyRef: s,
  lazyOffset: r = 0,
  lazySrc: o,
  lazyError: c,
  lazyDelay: l = 500,
  lazyPlaceholder: i,
  video: d,
  onLoad: u,
  onError: m,
  ...f
}) => {
  const p = Z(null), g = s || p, [b, h] = N(i || "..."), [y, v] = N(!1), [k, w] = N(!1), S = x(e !== "none" && y && `animation ${e}`, t), L = X(() => {
    const M = g.current.getBoundingClientRect();
    if (n) {
      const q = n.current.getBoundingClientRect();
      q.y > 0 && q.y < window.innerHeight && M.y >= q.y && M.y <= q.y + q.height && M.y <= window.innerHeight && (w(!0), u && u());
    }
    M.top + r <= window.innerHeight && M.bottom >= 0 && (w(!0), u && u());
  }, [r, g, n, u]), E = X(() => {
    m && m(c), c && h(c), v(!0);
  }, [c, m]);
  return D(() => {
    k && setTimeout(() => {
      o && h(o), v(!0);
    }, l);
  }, [k, l, o]), D(() => {
    let M;
    n ? n.current.classList.contains("lazy-container") ? M = window : M = n.current : M = window;
    const q = g.current;
    return M.addEventListener("scroll", L), q.addEventListener("error", E), k && M.removeEventListener("scroll", L), () => {
      M.removeEventListener("scroll", L), q.removeEventListener("error", E);
    };
  }, [n, L, k, E, g]), d ? /* @__PURE__ */ a("video", { className: S, src: b, ref: g, ...f }) : /* @__PURE__ */ a("img", { className: S, src: b, ref: g, ...f });
}, Pi = ({
  tag: e = "div",
  lazyContainerRef: t,
  lazyItems: n = [],
  lazyPlaceholder: s,
  lazyError: r,
  className: o,
  ...c
}) => {
  const l = x("lazy-container", o), i = Z(null), d = t || i;
  return /* @__PURE__ */ a(e, { ref: d, className: l, ...c, children: n.map((u) => {
    const m = { ...u };
    return s && (m.lazyPlaceholder = s), r && (m.lazyError = r), m.containerRef = d, /* @__PURE__ */ a(bl, { ...m }, Math.floor(Math.random() * 999 + 1));
  }) });
}, Yi = ({
  children: e,
  infiniteScrollRef: t,
  infiniteDirection: n,
  tag: s = "div",
  onInfiniteScroll: r,
  onComplete: o,
  windowParent: c = !1,
  ...l
}) => {
  const i = Z(null), d = t || i, u = (p) => p.getBoundingClientRect(), m = X(() => {
    if (c)
      return window.scrollY + window.innerHeight === document.documentElement.scrollHeight;
    const p = u(d.current);
    return n === "x" ? p.width + d.current.scrollLeft + 10 >= d.current.scrollWidth : Math.ceil(p.height + d.current.scrollTop) >= d.current.scrollHeight;
  }, [c, n, d]), f = X(() => {
    m() && (o && o(), r && r());
  }, [m, r, o]);
  return D(() => {
    const p = c ? window : d.current;
    return p.addEventListener("scroll", f), () => {
      p.removeEventListener("scroll", f);
    };
  }, [f, d, c]), /* @__PURE__ */ a(s, { ref: d, ...l, children: e });
};
function gl(e) {
  const t = e.getBoundingClientRect();
  return {
    top: t.top + document.body.scrollTop,
    left: t.left + document.body.scrollLeft
  };
}
function hs(e) {
  const t = gl(e), n = e.getBoundingClientRect(), s = t.left === 0 && t.top === 0 ? 0 : window.innerHeight - n.bottom;
  return {
    ...t,
    bottom: s
  };
}
const Ci = ({
  className: e,
  stickyRef: t,
  animationSticky: n,
  animationUnsticky: s,
  boundary: r,
  delay: o = 0,
  direction: c = "down",
  offset: l = 0,
  position: i = "top",
  tag: d = "span",
  children: u,
  onActive: m,
  onInactive: f,
  ...p
}) => {
  const g = Z(null), b = Z(null), h = t || g, y = Z(""), v = Z(!1), k = Z(0), w = Z(0), S = Z(0), [L, E] = N(), [M, q] = N(), [Y, R] = N(!1), [H, G] = N({}), [B, U] = N(!1), _ = x(
    "sticky",
    n && Y && `animation ${n}`,
    s && B && `animation ${s}`,
    e
  ), z = X(() => {
    const Q = b.current, T = h.current;
    Q ? k.current = Q.offsetTop : k.current = T.offsetTop;
  }, [h]), F = X(() => {
    const Q = h.current;
    Q && (i === "top" ? S.current = k.current - o : S.current = k.current + Q.height - document.body.scrollHeight + o);
  }, [o, i, h]), V = X((Q) => {
    Q > w.current ? y.current = "down" : y.current = "up";
  }, []), C = (Q, T) => {
    Object.keys(T).forEach(($) => {
      Q.style[$] = T[$];
    });
  }, W = X(() => {
    const Q = b.current, T = h.current;
    if (Q) {
      const { left: $ } = Q.getBoundingClientRect();
      G({ left: `${$}px` });
    } else
      G({});
    C(T, H), z();
  }, [z, H, h]), J = X(() => {
    const Q = h.current, T = l, { height: $ } = Q.getBoundingClientRect(), P = {
      height: Q.parentElement.getBoundingClientRect().height,
      ...hs(Q.parentElement)
    };
    let re;
    const ie = typeof r != "boolean" && (r == null ? void 0 : r.current);
    ie ? re = hs(ie).top - $ - T : re = P.height + P[i] - $ - T;
    const fe = i === "top", ne = i === "bottom", be = r, ae = re < 0, Ee = re > P.height - $;
    let me;
    fe && (ae && be ? me = { top: `${T + re}px` } : me = { top: `${T + 0}px` }), ne && (ae && be ? me = { bottom: `${T + re}px` } : Ee && be ? me = { bottom: `${l + P.bottom}px` } : me = { bottom: `${T + 0}px` }), C(Q, me);
  }, [r, l, i, h]), O = X(() => {
    const Q = window.pageYOffset || document.documentElement.scrollTop, T = l;
    z(), F(), V(Q);
    const $ = [y.current, "both"].includes(c), P = S.current <= Q, re = P && !v.current && $, ie = (!P || !$) && v.current;
    if (re) {
      const { height: fe, left: ne, width: be } = h.current.getBoundingClientRect();
      m && m(), R(!0), q({
        height: `${fe}px`,
        width: `${be}px`,
        opacity: "0"
      }), E({
        top: i === "top" ? `${0 + T}px` : null,
        bottom: i === "bottom" ? `${0 + T}px` : null,
        height: `${fe}px`,
        width: `${be}px`,
        left: `${ne}px`,
        zIndex: "100",
        position: "fixed"
      }), J(), v.current = !0;
    }
    ie && (f && f(), s ? (U(!0), setTimeout(() => {
      E({
        top: null,
        bottom: null,
        position: null,
        left: null,
        zIndex: null,
        width: null,
        height: null
      }), R(!1), q({
        height: null,
        width: null,
        opacity: null
      }), U(!1);
    }, 200)) : (E({
      top: null,
      bottom: null,
      position: null,
      left: null,
      zIndex: null,
      width: null,
      height: null
    }), R(!1), q({
      height: null,
      width: null,
      opacity: null
    })), v.current = !1), v.current && (C(h.current, H), J()), w.current = Q <= 0 ? 0 : Q;
  }, [
    c,
    z,
    F,
    V,
    l,
    i,
    h,
    H,
    J,
    s,
    m,
    f
  ]);
  return D(() => (window.addEventListener("resize", W), window.addEventListener("scroll", O), () => {
    window.removeEventListener("resize", W), window.removeEventListener("scroll", O);
  }), [W, O]), /* @__PURE__ */ j(we, { children: [
    Y && /* @__PURE__ */ a(d, { className: _, ref: b, style: M, ...p, children: u }),
    /* @__PURE__ */ a(d, { className: _, ref: h, style: L, ...p, children: u })
  ] });
}, yl = se.forwardRef(
  ({
    backdrop: e = !0,
    backdropColor: t = "black",
    backdropOpacity: n = 0.4,
    color: s,
    className: r,
    loadingText: o = "Loading...",
    isOpen: c,
    fullScreen: l,
    overflow: i = !0,
    parentRef: d,
    spinnerElement: u = /* @__PURE__ */ a(ws, { className: "loading-icon", role: "status" }),
    textClassName: m,
    textStyles: f,
    tag: p = "div",
    ...g
  }, b) => {
    const h = x("loading-text", m), y = x(
      l ? "loading-full" : "loading",
      "loading-spinner",
      l ? "position-fixed" : "position-absolute",
      s && `text-${s}`,
      r
    ), v = x("loading-backdrop", !l && "position-absolute");
    D(() => {
      const S = d == null ? void 0 : d.current;
      if (S)
        return S.classList.add("position-relative"), () => {
          S.classList.remove("position-relative");
        };
    }, [d]), D(() => {
      if (l && i)
        return c ? document.body.style.overflow = "hidden" : document.body.style.overflow = "", () => {
          document.body.style.overflow = "";
        };
    }, [l, c, i]);
    const k = /* @__PURE__ */ j(p, { className: y, ref: b, ...g, children: [
      u,
      /* @__PURE__ */ a("span", { className: h, style: f, children: o })
    ] }), w = /* @__PURE__ */ a("div", { className: v, style: { opacity: n, backgroundColor: t } });
    return /* @__PURE__ */ a(we, { children: c !== !1 && /* @__PURE__ */ a(we, { children: l ? /* @__PURE__ */ j(ht, { children: [
      k,
      w
    ] }) : /* @__PURE__ */ j(we, { children: [
      k,
      e && w
    ] }) }) });
  }
);
yl.displayName = "MDBLoadingManagement";
const wl = ({
  isOpened: e,
  inputRef: t,
  dropdownEl: n,
  setOpenState: s,
  onClose: r
}) => {
  const o = X(
    (c) => {
      if (!n)
        return;
      const l = t.current === c.target, i = n === c.target, d = n.contains(c.target);
      e && !l && !i && !d && (s(!1), r == null || r());
    },
    [e, s, n, t, r]
  );
  D(() => (document.addEventListener("click", o), () => {
    document.removeEventListener("click", o);
  }), [o]);
}, Nl = ({ inputRef: e, dropdownEl: t }) => {
  const n = X(() => {
    if (!e.current || !t)
      return;
    const { width: s } = window.getComputedStyle(e.current);
    t.style.width = s;
  }, [t, e]);
  D(() => (n(), window.addEventListener("resize", n), () => {
    window.removeEventListener("resize", n);
  }), [n]);
}, kl = ({ isOpen: e }) => {
  const [t, n] = N(!1);
  return D(() => {
    let s;
    return e ? n(!0) : s = setTimeout(() => {
      n(!1);
    }, 100), () => {
      clearTimeout(s);
    };
  }, [e]), t;
}, Ml = ({
  className: e,
  customContent: t = null,
  inputRef: n,
  isOpen: s,
  isOpened: r,
  children: o,
  setOpenState: c,
  listHeight: l = "190px",
  onOpened: i,
  onClose: d,
  onClosed: u,
  ...m
}) => {
  const [f, p] = N(null), [g, b] = N(null), h = Fe(
    () => [
      {
        name: "matchReferenceWidth",
        enabled: !0,
        fn: ({ state: L, instance: E }) => {
          if (!g)
            return;
          const M = g.offsetWidth, q = L.rects.reference.width;
          Math.round(M) !== Math.round(q) && (g.style.width = `${q}px`, E.update());
        },
        phase: "beforeWrite",
        requires: ["computeStyles"]
      }
    ],
    [g]
  ), y = kl({ isOpen: s }), { styles: v, attributes: k, update: w } = kt(f, g, { modifiers: h }), S = x("autocomplete-dropdown", s && "open", e);
  return wl({ isOpened: r, setOpenState: c, dropdownEl: g, inputRef: n, onClose: d }), Nl({ inputRef: n, dropdownEl: g }), D(() => {
    n.current && p(n.current);
  }, [n]), D(() => {
    s && (w == null || w());
  }, [s, w, y]), /* @__PURE__ */ a(we, { children: /* @__PURE__ */ a(ht, { children: /* @__PURE__ */ a(
    "div",
    {
      className: "autocomplete-dropdown-container",
      ref: b,
      ...m,
      style: v.popper,
      ...k.popper,
      onTransitionEnd: (L) => {
        L.propertyName === "opacity" && (y ? i == null || i() : u == null || u());
      },
      children: /* @__PURE__ */ j("div", { className: S, children: [
        /* @__PURE__ */ a(
          "ul",
          {
            className: "autocomplete-items-list",
            role: "listbox",
            style: { maxHeight: l, display: y ? "block" : "none" },
            children: o
          }
        ),
        t
      ] })
    }
  ) }) });
}, xl = ({
  className: e,
  isActive: t,
  children: n,
  onSelect: s,
  value: r,
  itemData: o,
  ...c
}) => {
  const l = x("autocomplete-item", t && "active", e), i = Z(null);
  return D(() => {
    if (!t || !i.current)
      return;
    i.current.scrollIntoView({ block: "nearest" });
  }, [t]), /* @__PURE__ */ a(
    "li",
    {
      className: l,
      onClick: () => {
        s(r, o);
      },
      ref: i,
      ...c,
      children: n
    }
  );
}, El = ({ isOpen: e, setOpenState: t, length: n }) => {
  const [s, r] = N(-1), o = X(
    (c) => {
      const l = c.key === "Tab", i = c.key === "Escape", d = c.key === "ArrowUp", u = c.key === "ArrowDown", m = c.key === "Home", f = c.key === "End", p = c.key === "Enter", g = c.altKey, b = n - 1;
      if (!e)
        return r(-1);
      if (i || p || l || g && d)
        return t(!1);
      if (u) {
        c.preventDefault(), r((h) => h === b ? b : h + 1);
        return;
      }
      if (d) {
        c.preventDefault(), r((h) => h === 0 ? 0 : h - 1);
        return;
      }
      if (m && s !== -1) {
        c.preventDefault(), r(0);
        return;
      }
      if (f && s !== -1) {
        c.preventDefault(), r(b);
        return;
      }
    },
    [e, t, n, s]
  );
  return D(() => {
    r(-1);
  }, [n]), D(() => (document.addEventListener("keydown", o), () => {
    document.removeEventListener("keydown", o);
  }), [o]), s;
}, Dl = se.forwardRef(
  ({
    open: e,
    autoSelect: t,
    className: n,
    customContent: s,
    data: r = [],
    displayValue: o,
    value: c,
    isLoading: l,
    listHeight: i,
    noResults: d = "No results found",
    itemContent: u,
    onSelect: m,
    onSearch: f,
    onChange: p,
    onClose: g,
    onClosed: b,
    onOpen: h,
    onOpened: y,
    ...v
  }, k) => {
    const w = Z(null), [S, L] = N(!1), [E, M] = N(!1), q = Mt(S, e), [Y, R] = N(""), H = Fe(() => c !== void 0 ? c : Y, [c, Y]), G = El({ isOpen: q, setOpenState: L, length: r.length });
    Dt(k, () => w.current);
    const B = x(q && "focused", "autocomplete-input", n), U = x((q || H) && "active", "autocomplete-label"), _ = () => {
      L(!0), h == null || h(), w.current && !w.current.value && (f == null || f(""));
    }, z = (W) => o ? o(W) : W, F = (W, J) => {
      L(!1), w.current && (w.current.value = W, f == null || f(W), m == null || m(J), p == null || p(W), g == null || g(), R(W));
    };
    return /* @__PURE__ */ j(we, { children: [
      /* @__PURE__ */ a(
        wt,
        {
          autoComplete: "off",
          onKeyDown: (W) => {
            const J = W.key === "Enter", O = W.key === "Tab";
            if (!S)
              return L(!0);
            G !== -1 && (J || t && O) && F(z(r[G]), r[G]);
          },
          onChange: (W) => {
            f == null || f(W.target.value), p == null || p(W.target.value), R(W.target.value);
          },
          onFocus: _,
          className: B,
          labelClass: U,
          ref: w,
          role: "combobox",
          value: H,
          ...v,
          children: l && /* @__PURE__ */ a("div", { className: "autocomplete-loader spinner-border", children: /* @__PURE__ */ a("span", { className: "sr-only", children: "Loading..." }) })
        }
      ),
      /* @__PURE__ */ j(
        Ml,
        {
          isOpen: q,
          isOpened: E,
          inputRef: w,
          setOpenState: L,
          customContent: s,
          listHeight: i,
          onClose: g,
          onOpened: () => {
            y == null || y(), M(!0);
          },
          onClosed: () => {
            b == null || b(), M(!1);
          },
          children: [
            r.length === 0 && /* @__PURE__ */ a("li", { className: "autocomplete-item autocomplete-no-results", children: d }),
            r.map((W, J) => /* @__PURE__ */ a(
              xl,
              {
                isActive: G === J,
                itemData: W,
                value: z(W),
                onSelect: F,
                children: u ? u(W) : z(W)
              },
              J
            ))
          ]
        }
      )
    ] });
  }
);
Dl.displayName = "MDBAutocomplete";
const Tl = (e) => {
  const t = e instanceof HTMLElement ? e : e.current;
  if (!t)
    return [];
  const n = Array.from(
    t.querySelectorAll("button, a, input, select, textarea, [tabindex]")
  ).map((r) => ({
    element: r,
    focused: r === document.activeElement
  }));
  return n ? n.filter((r) => r.element.tabIndex !== -1).sort((r, o) => r.element.tabIndex === o.element.tabIndex ? 0 : o.element.tabIndex === null ? -1 : r.element.tabIndex === null ? 1 : r.element.tabIndex - o.element.tabIndex) : [];
}, Ll = (e, t, n) => {
  let s = e;
  return t ? s = e - 1 < 0 ? n - 1 : e - 1 : s = e + 1 >= n ? 0 : e + 1, s;
}, Bl = ["Escape", "Tab"], Xi = ({
  className: e,
  btnClassName: t,
  btnChildren: n,
  confirmBtnText: s = "Ok",
  cancelBtnClasses: r,
  confirmBtnClasses: o,
  cancelBtnText: c = "Cancel",
  placement: l = "top",
  children: i,
  modal: d = !1,
  onClick: u,
  onConfirm: m,
  onCancel: f,
  onClose: p,
  open: g,
  options: b,
  popperTag: h = "div",
  ...y
}) => {
  const [v, k] = N(), [w, S] = N(), [L, E] = N(!1), M = Mt(L, g), [q, Y] = N(!1), [R, H] = N(!1), [G, B] = N([]), { styles: U, attributes: _ } = kt(v, w, { placement: l, ...b }), z = x(d ? "popconfirm-modal" : "popconfirm-popover", "shadow-4", e), F = x("popconfirm", !d && "fade", q && "show"), V = (T) => {
    E(!0), u && u(T);
  }, C = X(
    (T) => {
      const $ = v === T.target, P = T.target === w, re = w && w.contains(T.target), ie = v == null ? void 0 : v.contains(T.target);
      !$ && !P && !re && !ie && (M && q) && (p == null || p(T), E(!1));
    },
    [w, v, M, q, p]
  ), W = X(
    (T) => {
      if (!(!Bl.includes(T.key) || !M)) {
        if (T.preventDefault(), T.key === "Escape")
          return E(!1);
        if (T.key === "Tab") {
          const $ = T.shiftKey, P = G.findIndex((ie) => ie.focused), re = Ll(P, $, G.length);
          B((ie) => ie == null ? void 0 : ie.map((fe, ne) => ({
            ...fe,
            focused: ne === re
          }))), G[re].element.focus();
        }
      }
    },
    [G, M]
  ), J = (T) => {
    m == null || m(T), p == null || p(T), E(!1);
  }, O = (T) => {
    f == null || f(T), p == null || p(T), E(!1);
  };
  D(() => {
    M ? (H(!0), setTimeout(() => {
      Y(!0);
    }, 0)) : (Y(!1), d ? H(!1) : setTimeout(() => {
      H(!1);
    }, 150));
  }, [d, M]), D(() => {
    if (!w || !M) {
      B([]);
      return;
    }
    B(() => Tl(w));
  }, [w, M, i]), D(() => (window.addEventListener("click", C), () => {
    window.removeEventListener("click", C);
  }), [C]), D(() => (document.addEventListener("keydown", W), () => {
    document.removeEventListener("keydown", W);
  }), [W]);
  const Q = /* @__PURE__ */ j("div", { className: F, children: [
    i,
    /* @__PURE__ */ j("div", { className: "popconfirm-buttons-container", children: [
      /* @__PURE__ */ a(We, { className: r, onClick: O, size: "sm", children: c }),
      /* @__PURE__ */ a(We, { className: o, onClick: J, size: "sm", children: s })
    ] })
  ] });
  return /* @__PURE__ */ j(we, { children: [
    /* @__PURE__ */ a(We, { onClick: V, className: t, ...y, ref: k, children: n }),
    R && /* @__PURE__ */ a(ht, { children: d ? /* @__PURE__ */ a(At, { children: /* @__PURE__ */ a(
      vt.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.3 },
        className: "popconfirm-backdrop",
        children: /* @__PURE__ */ a(h, { ref: S, className: z, children: Q })
      }
    ) }) : /* @__PURE__ */ a(h, { className: z, ref: S, style: { ...U.popper }, ..._.popper, children: Q }) })
  ] });
}, Sl = se.forwardRef(({ className: e, icon: t, tag: n = "p", children: s, ...r }, o) => {
  const c = x("popconfirm-message", e);
  return /* @__PURE__ */ j(n, { className: c, ref: o, ...r, children: [
    t && /* @__PURE__ */ a("span", { className: "popconfirm-icon-container", children: t }),
    /* @__PURE__ */ a("span", { className: "popconfirm-message-text", children: s })
  ] });
});
Sl.displayName = "MDBPopconfirmMessage";
const ps = (e) => e, Il = (e) => e * e, Al = (e) => e * e * e, $l = (e) => e * e * e * e, Rl = (e) => e * e * e * e * e, Hl = (e) => e < 0.5 ? 2 * e * e : -1 + (4 - 2 * e) * e, Wl = (e) => (e /= 0.5, e < 1 ? e * e * e / 2 : (e -= 2, (e * e * e + 2) / 2)), Pl = (e) => (e /= 0.5, e < 1 ? 0.5 * e * e * e * e : (e -= 2, -(e * e * e * e - 2) / 2)), Yl = (e) => (e /= 0.5, e < 1 ? e * e * e * e * e / 2 : (e -= 2, (e * e * e * e * e + 2) / 2)), Cl = (e) => -e * (e - 2), Xl = (e) => (e--, e * e * e + 1), Fl = (e) => (e--, -(e * e * e * e - 1)), Ol = (e) => (e--, e * e * e * e * e + 1), Vl = (e, t) => {
  switch (t) {
    case "motionLinear":
      return ps(e);
    case "motionEaseInQuad":
      return Il(e);
    case "motionEaseInCubic":
      return Al(e);
    case "motionEaseInQuart":
      return $l(e);
    case "motionEaseInQuint":
      return Rl(e);
    case "motionEaseInOutQuad":
      return Hl(e);
    case "motionEaseInOutCubic":
      return Wl(e);
    case "motionEaseInOutQuart":
      return Pl(e);
    case "motionEaseInOutQuint":
      return Yl(e);
    case "motionEaseOutQuad":
      return Cl(e);
    case "motionEaseOutCubic":
      return Xl(e);
    case "motionEaseOutQuart":
      return Fl(e);
    case "motionEaseOutQuint":
      return Ol(e);
    default:
      return ps(e);
  }
}, Fi = ({
  className: e,
  duration: t = 500,
  href: n = "#",
  offset: s = 0,
  easing: r = "motionLinear",
  containerRef: o,
  targetRef: c,
  children: l,
  ...i
}) => {
  const d = Z(null);
  D(() => {
    d.current = o ? o.current : document.documentElement;
  }, [o]);
  const u = (b) => {
    const h = b.getBoundingClientRect();
    return {
      top: h.top + document.body.scrollTop,
      left: h.left + document.body.scrollLeft
    };
  }, m = () => {
    const b = d.current, h = c == null ? void 0 : c.current;
    if (b && s !== void 0) {
      const y = b.scrollTop;
      if (!o)
        return u(h).top - s + y;
      const v = h.getBoundingClientRect().y, k = b.getBoundingClientRect().y;
      return v - k - s + y;
    }
  }, f = () => {
    var b;
    if (!o)
      return !0;
    if (d.current) {
      const h = (b = d.current) == null ? void 0 : b.getBoundingClientRect();
      return h.top >= 0 && h.bottom <= (window.innerHeight || document.documentElement.clientHeight);
    }
  }, p = (b, h, y, v, k, w) => {
    const S = v < 0, L = v > 1, E = k <= 0;
    if (S || L || E) {
      b.scrollTop = y;
      return;
    }
    r && (b.scrollTo({
      top: h - (h - y) * Vl(v, r)
    }), v += k * w, setTimeout(() => {
      p(b, h, y, v, k, w);
    }));
  };
  return /* @__PURE__ */ a("a", { className: e, href: n, onClick: (b) => {
    b.preventDefault();
    const h = d.current;
    if (h && t) {
      const y = h.scrollTop, v = m(), k = 0, w = 1 / t, S = 4.25;
      f() ? p(h, y, v, k, w, S) : (p(
        document.documentElement,
        document.documentElement.scrollTop,
        h.offsetTop,
        k,
        w,
        S
      ), setTimeout(() => {
        p(h, y, v, k, w, S);
      }, t));
    }
  }, ...i, children: l });
}, jl = se.forwardRef(
  ({
    className: e,
    tag: t = "div",
    zoomLevel: n = 1,
    fontAwesome: s = "free",
    children: r,
    lightboxRef: o,
    onOpen: c,
    onClose: l,
    onSlide: i,
    onZoomIn: d,
    onZoomOut: u,
    disablePortal: m,
    ...f
  }, p) => {
    const g = Z(null), b = Z(null), h = o || b, y = Z(null), [v, k] = N(!1), [w, S] = N(0), [L, E] = N(!1), [M, q] = N([]), [Y, R] = N(""), [H, G] = N(1), [B, U] = N(!1), [_, z] = N(), [F, V] = N(!1), C = Z(!1), W = Z(!1), J = Z(), O = Z(), Q = Z(), T = Z(), $ = Z(), P = Z(), re = Z(), ie = x("lightbox", e), fe = x("lightbox-gallery-close-btn"), ne = x("lightbox-gallery-fullscreen-btn", L && "active"), be = x("lightbox-gallery-zoom-btn", H > 1 && "active"), ae = Fe(() => document.documentElement.dir === "rtl", []), Ee = () => {
      C.current = !0, setTimeout(() => {
        C.current = !1;
      }, 400);
    }, me = X(
      (A) => {
        let le = A;
        return le > M.length - 1 ? le = 0 : le < 0 && (le = M.length - 1), M[le].classList.contains("lightbox-disabled") ? me(le - 1) : le;
      },
      [M]
    ), Ne = X(() => {
      H >= 3 || (G((A) => A + n), d == null || d());
    }, [d, H, n]), he = X(() => {
      var le;
      const A = (le = g.current) == null ? void 0 : le.querySelector(".lightbox-gallery-item.active");
      A != null && A.parentElement && (A.parentElement.style.left = "0", A.parentElement.style.top = "0", A.style.transition = "all 0.5s ease-out", A.style.left = "0", A.style.top = "0", at(A), setTimeout(() => {
        A.style.transition = "none";
      }, 500));
    }, []), Te = X(() => {
      H - n === 1 && he(), !(H <= 1) && (G((A) => A - n), u == null || u());
    }, [u, he, H, n]), ge = X(() => {
      var le;
      if (!g.current)
        return;
      Array.from(
        (le = g.current) == null ? void 0 : le.querySelectorAll(".lightbox-gallery-item")
      ).forEach((Me) => {
        at(Me);
      });
    }, []), De = X(() => {
      L && document.exitFullscreen && document.exitFullscreen(), setTimeout(() => {
        document.body.classList.remove("disabled-scroll"), document.body.classList.remove("replace-scrollbar");
      }), k(!1), G(1), U(!1), ge(), l == null || l();
    }, [ge, L, l]), pe = X(
      (A) => {
        if (C.current || M.length <= 1)
          return w;
        let le = 0;
        switch (A) {
          case "left":
            le = w - 1;
            break;
          case "right":
            le = w + 1;
            break;
          case "last":
            le = M.length - 1;
            break;
          case "first":
            le = 0;
            break;
        }
        Ee();
        const Me = me(le);
        S(Me), G(1), U(!1), setTimeout(() => {
          var ue;
          const I = (ue = g.current) == null ? void 0 : ue.querySelector(".lightbox-gallery-item.active");
          ge(), R(I.getAttribute("data-mdb-caption"));
        }, 300), i == null || i();
      },
      [w, ge, M.length, i, me]
    ), ke = X(
      (A) => {
        if (!v)
          return;
        switch (A.nativeEvent.key) {
          case "ArrowRight":
            pe(ae ? "left" : "right");
            break;
          case "ArrowLeft":
            pe(ae ? "right" : "left");
            break;
          case "Escape":
            De();
            break;
          case "Home":
            pe("first");
            break;
          case "End":
            pe("last");
            break;
          case "ArrowUp":
            Ne();
            break;
          case "ArrowDown":
            Te();
            break;
        }
      },
      [De, pe, Ne, Te, v, ae]
    ), de = X(
      (A) => {
        document.body.classList.add("disabled-scroll"), document.documentElement.scrollHeight > document.documentElement.clientHeight && document.body.classList.add("replace-scrollbar"), k(!0), S(A), U(!1), ge(), setTimeout(() => {
          var Me;
          const le = (Me = g.current) == null ? void 0 : Me.querySelector(".lightbox-gallery-item.active");
          R(le.getAttribute("data-mdb-caption"));
        }, 0), c == null || c();
      },
      [ge, c]
    );
    Dt(p, () => ({
      outsideAccess(A) {
        de(A);
      }
    }));
    const je = X(() => {
      // eslint-disable-next-line
      //@ts-ignore
      (document.webkitIsFullScreen || // eslint-disable-next-line
      //@ts-ignore
      document.mozFullScreen || // eslint-disable-next-line
      //@ts-ignore
      document.msFullscreenElement) === void 0 && E(!1);
    }, []), Se = () => {
      var A, le, Me;
      if (!L) {
        (le = (A = g.current) == null ? void 0 : A.requestFullscreen) == null || le.call(A), E(!0);
        return;
      }
      (Me = document.exitFullscreen) == null || Me.call(document), E(!1);
    }, qe = (A) => {
      A.nativeEvent.preventDefault();
      const le = A.nativeEvent instanceof TouchEvent ? A.nativeEvent.touches[0] : A.nativeEvent, Me = le.clientX, I = le.clientY;
      A.nativeEvent instanceof TouchEvent && A.type === "touchstart" && A.nativeEvent.touches.length > 1 && (V(!0), z(A.nativeEvent.touches));
      const ue = A.target;
      Q.current = parseFloat(ue.style.left), T.current = parseFloat(ue.style.top), J.current = parseFloat(ue.style.left), O.current = parseFloat(ue.style.top), $.current = Me * (1 / H) - J.current, P.current = I * (1 / H) - O.current, U(!0);
    }, lt = (A) => {
      if (A.type === "touchmove" && A.nativeEvent instanceof TouchEvent && A.nativeEvent.targetTouches.length > 1 && (A.nativeEvent.preventDefault(), tt(A)), !B || F)
        return;
      const le = A.nativeEvent instanceof TouchEvent ? A.nativeEvent.touches[0] : A.nativeEvent, Me = le.clientX, I = le.clientY, ue = A.target;
      if (H !== 1) {
        J.current = Me * (1 / H) - $.current, O.current = I * (1 / H) - P.current, ue.style.left = `${J.current}px`, ue.style.top = `${O.current}px`;
        return;
      }
      M.length <= 1 || (J.current = Me * (1 / H) - $.current, ue.style.left = `${J.current}px`);
    }, ot = X(() => {
      if (H !== 1 || M.length <= 1 || !J.current || F)
        return;
      if (J.current - (Q.current || 0) > 0) {
        pe(ae ? "right" : "left");
        return;
      }
      pe(ae ? "left" : "right");
    }, [pe, F, ae, M.length, H]), Ze = X(
      (A) => {
        F || (A.nativeEvent instanceof TouchEvent && !A.nativeEvent.touches && Ge(A), H !== 1 ? Te() : Ne());
      },
      [Ne, Te, F, H]
    ), et = (A) => {
      if (U(!1), A.nativeEvent instanceof MouseEvent) {
        ot(), U(!1);
        return;
      }
      if (F && A.targetTouches.length === 0) {
        V(!1), z(void 0);
        return;
      }
      U(!1), ot();
    }, tt = (A) => {
      if (!_)
        return;
      const le = Math.hypot(
        _[1].pageX - _[0].pageX,
        _[1].pageY - _[0].pageY
      ), Me = Math.hypot(
        A.nativeEvent.touches[1].pageX - A.nativeEvent.touches[0].pageX,
        A.nativeEvent.touches[1].pageY - A.nativeEvent.touches[0].pageY
      ), I = Math.abs(le - Me), ue = A.nativeEvent.view.screen.width;
      I <= ue * 0.03 || (le <= Me ? Ne() : Te(), z(A.nativeEvent.touches));
    }, at = (A) => {
      A.parentElement && (A.width >= A.height ? (A.style.width = "100%", A.style.maxWidth = "100%", A.style.height = "auto", A.style.top = `${(A.parentElement.offsetHeight - A.height) / 2}px`, A.style.left = "0") : (A.style.height = "100%", A.style.maxHeight = "100%", A.style.width = "auto", A.style.left = `${(A.parentElement.offsetWidth - A.width) / 2}px`, A.style.top = "0"), A.width >= A.parentElement.offsetWidth && (A.style.width = `${A.parentElement.offsetWidth}px`, A.style.height = "auto", A.style.left = "0", A.style.top = `${(A.parentElement.offsetHeight - A.height) / 2}px`), A.height >= A.parentElement.offsetHeight && (A.style.height = `${A.parentElement.offsetHeight}px`, A.style.width = "auto", A.style.top = "0", A.style.left = `${(A.parentElement.offsetWidth - A.width) / 2}px`), J.current = parseFloat(A.style.left) || 0, O.current = parseFloat(A.style.top) || 0);
    }, ut = (A) => {
      const le = A.getAttribute("data-mdb-img") ? A.getAttribute("data-mdb-img") : A.getAttribute("src") ? A.getAttribute("src") : "", Me = A.getAttribute("alt") ? A.getAttribute("alt") : A.getAttribute("data-mdb-caption") ? A.getAttribute("data-mdb-caption") : "", I = A.getAttribute("data-mdb-caption") ? A.getAttribute("data-mdb-caption") : A.getAttribute("alt") ? A.getAttribute("alt") : "";
      return { source: le, alt: Me, caption: I };
    }, ct = X(() => {
      const le = [...h.current.querySelectorAll(".lightbox-item")].filter((Me) => !Me.classList.contains("lightbox-disabled"));
      q(le);
    }, [h]), Ve = X(() => {
      ge();
    }, [ge]), Ge = (A) => {
      J.current = window.innerWidth / 2 - A.nativeEvent.offsetX - 50, O.current = window.innerHeight / 2 - A.nativeEvent.offsetY - 50;
      const le = A.target;
      le.style.left = `${J.current}px`, le.style.top = `${O.current}px`, le.style.transition = "all 0.5s ease-out", setTimeout(() => {
        le.style.transition = "none";
      }, 500);
    }, nt = (A) => {
      if (A.deltaY > 0)
        return Te();
      H >= 3 || (Ge(A), Ne());
    };
    return D(() => {
      ct();
    }, [ct]), D(() => {
      M.length && ge();
    }, [ge, M]), D(() => (M.forEach((A, le) => {
      !A.classList.contains("lightbox-disabled") && A.addEventListener("click", () => de(le));
    }), () => {
      M.forEach((A, le) => {
        A.removeEventListener("click", () => de(le));
      });
    }), [de, M]), D(() => (window.addEventListener("resize", Ve), window.addEventListener("fullscreenchange", je), () => {
      window.removeEventListener("resize", Ve), window.removeEventListener("fullscreenchange", je);
    }), [je, Ve]), D(() => {
      const A = document.querySelector("meta[name=viewport]");
      if (re.current || (re.current = (A == null ? void 0 : A.getAttribute("content")) || ""), !v) {
        W.current = !1, A == null || A.setAttribute("content", re.current);
        return;
      }
      setTimeout(() => {
        var le;
        W.current = !0, (le = y.current) == null || le.focus(), A == null || A.setAttribute("content", `${re.current} user-scalable=no`);
      }, 300);
    }, [v]), /* @__PURE__ */ j(we, { children: [
      /* @__PURE__ */ a(t, { ref: h, className: ie, ...f, children: r }),
      /* @__PURE__ */ a(ht, { disablePortal: m, children: /* @__PURE__ */ j(
        "div",
        {
          className: "lightbox-gallery",
          onClick: (A) => A.target.tagName === "DIV" && De(),
          onKeyUp: ke,
          ref: g,
          style: {
            opacity: v ? 1 : 0,
            pointerEvents: v ? "initial" : "none",
            visibility: v ? "visible" : "hidden"
          },
          children: [
            /* @__PURE__ */ a("div", { className: "lightbox-gallery-loader" }),
            /* @__PURE__ */ j("div", { className: "lightbox-gallery-toolbar", children: [
              /* @__PURE__ */ a("div", { className: "lightbox-gallery-left-tools", children: /* @__PURE__ */ a("p", { className: "lightbox-gallery-counter", children: `${w + 1} / ${M.length}` }) }),
              /* @__PURE__ */ j("div", { className: "lightbox-gallery-right-tools", children: [
                /* @__PURE__ */ a("button", { className: ne, onClick: Se }),
                /* @__PURE__ */ a(
                  "button",
                  {
                    "aria-label": H > 1 ? "Zoom out" : "Zoom in",
                    className: be,
                    onClick: () => H > 1 ? Te() : Ne()
                  }
                ),
                /* @__PURE__ */ a("button", { className: fe, onClick: De })
              ] })
            ] }),
            /* @__PURE__ */ a(
              "div",
              {
                className: "lightbox-gallery-content",
                style: {
                  transform: v ? "scale(1)" : "scale(0.25)",
                  transition: "all 0.5s ease-out"
                },
                children: M.map((A, le) => {
                  const { source: Me, alt: I, caption: ue } = ut(A), Ie = le === w ? 1 : 0, Xe = le === w ? H : 0, Qe = w === M.length - 1 && le === 0 && M.length > 1, _e = w === 0 && le === M.length - 1 && M.length > 1;
                  let K;
                  return w < le && !_e || Qe ? K = "100%" : w > le && !Qe || _e ? K = "-100%" : K = "0%", /* @__PURE__ */ a(
                    "div",
                    {
                      className: "lightbox-gallery-image",
                      style: {
                        position: "absolute",
                        opacity: Ie,
                        left: v ? K : "0%",
                        transform: `scale(${Xe})`,
                        transition: w === le || W.current ? "all 0.5s ease-out" : "none"
                      },
                      children: /* @__PURE__ */ a(
                        "img",
                        {
                          src: Me || "",
                          alt: I || "",
                          "data-mdb-caption": ue || "",
                          onMouseDown: qe,
                          onMouseMove: lt,
                          onMouseUp: et,
                          onWheel: nt,
                          onTouchStart: qe,
                          onTouchMove: lt,
                          onTouchEnd: et,
                          onDoubleClick: Ze,
                          className: `lightbox-gallery-item ${w === le && "active"}`
                        }
                      )
                    },
                    le
                  );
                })
              }
            ),
            /* @__PURE__ */ a("div", { className: "lightbox-gallery-arrow-left", children: /* @__PURE__ */ a("button", { "aria-label": "Previous", onClick: () => pe("left") }) }),
            /* @__PURE__ */ a("div", { className: "lightbox-gallery-arrow-right", children: /* @__PURE__ */ a("button", { "aria-label": "Next", onClick: () => pe("right"), ref: y }) }),
            /* @__PURE__ */ a("div", { className: "lightbox-gallery-caption-wrapper", children: /* @__PURE__ */ a("p", { className: "lightbox-gallery-caption", children: Y }) })
          ]
        }
      ) })
    ] });
  }
);
jl.displayName = "MDBLightbox";
const Kl = se.forwardRef(
  ({ className: e, fullscreenSrc: t, disabled: n, caption: s, ...r }, o) => {
    const c = x("lightbox-item", n && "lightbox-disabled", e);
    return /* @__PURE__ */ a("img", { ref: o, "data-mdb-caption": s, "data-mdb-img": t, className: c, ...r });
  }
);
Kl.displayName = "MDBLightboxItem";
const ql = se.forwardRef(
  ({ className: e, ...t }, n) => {
    const [s, r] = N(!1), o = X(() => {
      const l = document.documentElement.scrollTop;
      r(!!l);
    }, []), c = x(s && "navbar-scrolled", "navbar-scroll", e);
    return D(() => {
      window.addEventListener("scroll", o);
    }, [o]), /* @__PURE__ */ a(Ns, { className: c, ref: n, ...t });
  }
);
ql.displayName = "MDBAnimatedNavbar";
const sr = Tt(
  ({ className: e, closeIcon: t, tag: n = "div", color: s, size: r, children: o, onDelete: c, ...l }, i) => {
    const [d, u] = N(!0), m = x("chip", r && `chip-${r}`, s && `chip-outline btn-outline-${s}`, e);
    return d ? /* @__PURE__ */ j(n, { ref: i, className: m, ...l, children: [
      o,
      t && /* @__PURE__ */ a("i", { className: "close fas fa-times", onClick: () => {
        c == null || c(o), u(!1);
      } })
    ] }) : null;
  }
);
sr.displayName = "MDBChip";
const _l = se.forwardRef(
  ({
    className: e,
    value: t = "",
    id: n,
    labelId: s,
    labelClass: r,
    label: o,
    onChange: c,
    labelRef: l,
    labelStyle: i,
    readonly: d,
    editable: u,
    onAdd: m,
    onDelete: f,
    initialValues: p = [],
    ...g
  }, b) => {
    const h = Z(null), y = l ?? h, v = Z(null);
    Dt(b, () => v.current);
    const [k, w] = N(p), [S, L] = N(null), [E, M] = N(0), [q, Y] = N(null), [R, H] = N(t), G = k.length > 0 || R.length > 0, B = x(
      "form-outline",
      "chips-input-wrapper",
      k.length > 0 && "chips-padding chips-transition"
    ), U = x("form-control", G && "active", e), _ = x("form-label", r);
    D(() => {
      !y.current || y.current.clientWidth === 0 || M(y.current.clientWidth * 0.8 + 8);
    }, [y]);
    const z = () => {
      y.current && M(y.current.clientWidth * 0.8 + 8);
    }, F = (T) => {
      H(T.target.value), c == null || c(T);
    }, V = (T) => {
      R.length || ((T.key === "ArrowLeft" || T.key === "ArrowDown") && Y(($) => $ ? $ - 1 : k.length - 1), (T.key === "ArrowRight" || T.key === "ArrowUp") && Y(($) => $ === k.length - 1 || $ === null ? 0 : $ + 1), T.key === "Backspace" && q !== null && C(q)), T.key === "Enter" && R.trim().length && (m == null || m(R), w([...k, { tag: R }]), H(""));
    }, C = (T) => {
      const $ = k.find((P, re) => T === re);
      if ($) {
        f == null || f($ == null ? void 0 : $.tag);
        const P = k.filter((re, ie) => T !== ie);
        w(P), Y(null);
      }
    }, W = (T, $) => {
      u && L($);
    }, J = (T, $) => {
      if (!u)
        return;
      const P = T.currentTarget.textContent, re = k.map((ie, fe) => fe === $ && P ? {
        tag: P
      } : ie);
      P ? w(re) : C($), L(null), Y(null);
    }, O = (T, $) => {
      T.key === "Enter" && u && S !== null && J(T, $);
    }, Q = () => {
      R.trim().length && (m == null || m(R), w([...k, { tag: R }]), H(""));
    };
    return /* @__PURE__ */ a("div", { className: "chips chips-placeholder", children: /* @__PURE__ */ j("div", { className: B, children: [
      k.map((T, $) => /* @__PURE__ */ a(
        sr,
        {
          contentEditable: S === $,
          suppressContentEditableWarning: !0,
          onDoubleClick: (P) => W(P, $),
          onDelete: () => C($),
          onKeyDown: (P) => O(P, $),
          closeIcon: S !== $,
          className: x("btn", $ === q && "active"),
          children: T.tag
        },
        `${Math.random()}-${$}`
      )),
      /* @__PURE__ */ a(
        "input",
        {
          type: "text",
          readOnly: d,
          className: U,
          onChange: F,
          onFocus: z,
          onKeyDown: V,
          onBlur: () => Q(),
          value: R,
          id: n,
          ref: v,
          ...g
        }
      ),
      o && /* @__PURE__ */ a("label", { className: _, style: i, id: s, htmlFor: n, ref: y, children: o }),
      /* @__PURE__ */ j("div", { className: "form-notch", children: [
        /* @__PURE__ */ a("div", { className: "form-notch-leading" }),
        /* @__PURE__ */ a("div", { className: "form-notch-middle", style: { width: E } }),
        /* @__PURE__ */ a("div", { className: "form-notch-trailing" })
      ] })
    ] }) });
  }
);
_l.displayName = "MDBChipsInput";
const Oi = ({
  className: e,
  defaultValues: t = [0, 100],
  values: n,
  getValues: s,
  onChange: r,
  min: o = 0,
  max: c = 100,
  step: l = "1",
  tooltips: i,
  ...d
}) => {
  const [u, m] = N(n || t), f = Fe(() => n === void 0 ? u : n, [n, u]), p = x("multi-range", e), [g, b] = N({ zIndex: "auto" }), h = (v) => {
    const k = Number(v.target.value), w = Number(f[1]);
    b(k === w ? { zIndex: 1 } : { zIndex: "auto" }), !(k > w) && (m([k, f[1]]), r && r([k, f[1]]));
  }, y = (v) => {
    const k = Number(v.target.value), w = Number(f[0]);
    k < w || (m([f[0], k]), r && r([f[0], k]));
  };
  return D(() => {
    s && s({ first: u[0], second: u[1] });
  }, [u, s]), /* @__PURE__ */ j("div", { className: p, ...d, children: [
    /* @__PURE__ */ a(
      Rn,
      {
        value: f[0],
        onChange: h,
        min: o,
        max: c,
        step: l,
        disableTooltip: !i,
        style: g
      }
    ),
    /* @__PURE__ */ a(
      Rn,
      {
        value: f[1],
        onChange: y,
        min: o,
        max: c,
        step: l,
        className: "multi-range-slider-second",
        disableTooltip: !i
      }
    )
  ] });
}, Vi = ({
  animationSticky: e,
  animationUnsticky: t,
  boundary: n = !1,
  delay: s = 0,
  direction: r = "down",
  offset: o = 0,
  position: c = "top"
}) => {
  const l = Z(null), i = Z(null), d = Z(""), u = Z(!1), m = Z(0), f = Z(0), p = Z(0), g = Z(!1), b = Z(""), [h, y] = N({}), [v, k] = N({}), [w, S] = N({}), [L, E] = N(!1), [M, q] = N(!1), Y = (V) => {
    const C = V.getBoundingClientRect(), W = C.left + document.body.scrollLeft, J = C.top + document.body.scrollTop, O = W === 0 && J === 0 ? 0 : window.innerHeight - C.bottom;
    return {
      top: J,
      left: W,
      bottom: O
    };
  }, R = X(() => {
    const V = i.current, C = l.current;
    C && (m.current = V ? V.offsetTop : C.offsetTop);
  }, [l]), H = X(() => {
    const V = l.current;
    if (!V)
      return;
    const { height: C } = V.getBoundingClientRect(), W = m.current, J = W - s - C / 2, O = W + C - document.body.scrollHeight + s;
    p.current = c === "top" ? J : O;
  }, [s, c, l]), G = X((V) => {
    d.current = V > f.current ? "down" : "up";
  }, []), B = (V, C) => {
    Object.keys(C).forEach((W) => {
      V.style[W] = C[W];
    });
  }, U = X(() => {
    const V = i.current, C = l.current;
    if (!C)
      return;
    const { left: W } = V.getBoundingClientRect(), J = V ? { left: W } : {};
    S(J), B(C, J), R();
  }, [R, l]), _ = X(() => {
    var ie;
    const V = l.current;
    if (!V)
      return;
    const { height: C } = V.getBoundingClientRect(), W = {
      height: (ie = V.parentElement) == null ? void 0 : ie.getBoundingClientRect().height,
      ...Y(V.parentElement)
    }, J = typeof n != "boolean" && (n == null ? void 0 : n.current), O = J ? Y(J).top - C - o : W.height + W[c] - C - o, Q = c === "bottom", T = n, $ = O < 0, P = O > W.height - C;
    let re;
    if ($ && T)
      return re = { [c]: `${o + O}px` }, B(V, re);
    if (P && T && Q)
      return re = { bottom: `${o + W.bottom}px` }, B(V, re);
    re = { [c]: `${o}px` }, B(V, re);
  }, [n, o, c, l]), z = X(() => {
    y({
      [c]: null,
      height: null,
      width: null,
      left: null,
      zIndex: null,
      position: null
    }), E(!1), k({
      height: null,
      width: null,
      opacity: null
    });
  }, [c]), F = X(() => {
    if (!l.current)
      return;
    const V = window.pageYOffset || document.documentElement.scrollTop;
    R(), H(), G(V);
    const C = [d.current, "both"].includes(r), W = p.current <= V, J = W && !u.current && C, O = (!W || !C) && u.current;
    if (J) {
      const { height: Q, left: T, width: $ } = l.current.getBoundingClientRect();
      E(!0), k({
        height: `${Q}px`,
        width: `${$}px`,
        opacity: "0"
      }), y({
        [c]: `${o}px`,
        height: `${Q}px`,
        width: `${$}px`,
        left: `${T}px`,
        zIndex: "100",
        position: "fixed"
      }), _(), u.current = !0;
    }
    O && (t ? (q(!0), setTimeout(() => {
      z(), q(!1);
    }, 200)) : z(), u.current = !1), u.current && (B(l.current, w), _()), f.current = V <= 0 ? 0 : V;
  }, [
    t,
    _,
    r,
    w,
    o,
    c,
    z,
    R,
    H,
    G
  ]);
  return D(() => {
    var W;
    if (!l.current || g.current)
      return;
    const V = l.current.tagName.toLowerCase(), C = document.createElement(V);
    i.current = C, (W = l.current.parentElement) == null || W.insertBefore(C, l.current), b.current = l.current.className, g.current = !0;
  }, [g]), D(() => {
    B(i.current, v);
  }, [v]), D(() => {
    l.current && B(l.current, h);
  }, [h]), D(() => {
    const V = l.current;
    if (!V)
      return;
    const C = x(e && L && `animation ${e}`), W = x(t && M && `animation ${t}`), J = x(L && b.current);
    V.className = x("sticky", b.current, C, W), i.current.className = x(J);
  }, [e, t, M, L]), D(() => (window.addEventListener("resize", U), window.addEventListener("scroll", F), () => {
    window.removeEventListener("resize", U), window.removeEventListener("scroll", F);
  }), [U, F]), l;
}, ji = ({
  animation: e = "slide-right",
  delay: t,
  infinite: n,
  duration: s = 500,
  repeatOnScroll: r,
  reset: o,
  start: c = "onClick",
  externalElement: l
}) => {
  const i = Z(null), d = Z(!1), u = X(() => {
    if (!i.current)
      return;
    const b = i.current.getBoundingClientRect(), h = b.top >= 0 && b.left >= 0 && b.right <= (innerWidth || document.documentElement.clientWidth) && b.bottom <= (innerHeight || document.documentElement.clientHeight);
    d.current = h;
  }, [i]);
  D(() => (u(), addEventListener("scroll", u), () => removeEventListener("scroll", u)), [u]);
  const m = X(() => {
    i.current && (t && (i.current.style.animationDelay = t.toString() + "ms"), s && (i.current.style.animationDuration = s.toString() + "ms"), n && (i.current.style.animationIterationCount = "infinite"), i.current.classList.add(e, "animation"));
  }, [t, s, i, n, e]), f = X(() => {
    i.current && (i.current.style.animationDelay = "", i.current.style.animationDuration = "", i.current.style.animationIterationCount = "", i.current.classList.remove(e, "animation"));
  }, [e, i]), p = X(() => {
    var b;
    o && ((b = i.current) == null || b.addEventListener("animationend", f));
  }, [i, f, o]), g = X(
    (b) => {
      var h, y, v, k;
      if (b === "onLoad") {
        p(), m();
        return;
      }
      if (b === "onClick") {
        p(), l ? (h = l.current) == null || h.addEventListener("click", m) : (y = i.current) == null || y.addEventListener("click", m);
        return;
      }
      if (b === "onHover") {
        p(), l ? (v = l.current) == null || v.addEventListener("mouseenter", m) : (k = i.current) == null || k.addEventListener("mouseenter", m);
        return;
      }
      b === "onScroll" && addEventListener("scroll", () => {
        var w;
        if (!((w = i.current) != null && w.classList.contains(e) && !r)) {
          if (d.current) {
            m();
            return;
          }
          f();
        }
      });
    },
    [
      m,
      d,
      i,
      f,
      p,
      e,
      r,
      l
    ]
  );
  return D(() => g(c), [g, c]), i;
}, Ki = (e, t) => {
  const n = X(() => {
    navigator.clipboard.writeText(e);
  }, [e]);
  D(() => {
    const s = t.current;
    return s.addEventListener("click", n), () => {
      s.removeEventListener("click", n);
    };
  }, [n, t]);
};
export {
  Xo as MDBAccordion,
  Fo as MDBAccordionItem,
  Li as MDBAlert,
  ql as MDBAnimatedNavbar,
  Ti as MDBAnimation,
  Dl as MDBAutocomplete,
  kr as MDBBadge,
  Xr as MDBBreadcrumb,
  Fr as MDBBreadcrumbItem,
  We as MDBBtn,
  Er as MDBBtnGroup,
  Dr as MDBCard,
  Ir as MDBCardBody,
  Ar as MDBCardFooter,
  Rr as MDBCardGroup,
  Tr as MDBCardHeader,
  oi as MDBCardImage,
  ci as MDBCardLink,
  $r as MDBCardOverlay,
  Lr as MDBCardSubTitle,
  Sr as MDBCardText,
  Br as MDBCardTitle,
  gi as MDBCarousel,
  wi as MDBCarouselCaption,
  yi as MDBCarouselItem,
  Si as MDBChart,
  Yt as MDBCheckbox,
  sr as MDBChip,
  _l as MDBChipsInput,
  Mi as MDBClientOnly,
  Nr as MDBCol,
  Ms as MDBCollapse,
  wr as MDBContainer,
  cl as MDBDatatable,
  Oc as MDBDateTimepicker,
  Us as MDBDatepicker,
  ii as MDBDropdown,
  ai as MDBDropdownItem,
  ui as MDBDropdownMenu,
  di as MDBDropdownToggle,
  Eo as MDBFile,
  zr as MDBFooter,
  it as MDBIcon,
  Yi as MDBInfiniteScroll,
  wt as MDBInput,
  Es as MDBInputGroup,
  Pi as MDBLazyContainer,
  bl as MDBLazyLoading,
  jl as MDBLightbox,
  Kl as MDBLightboxItem,
  Hr as MDBListGroup,
  Wr as MDBListGroupItem,
  yl as MDBLoadingManagement,
  mi as MDBModal,
  ko as MDBModalBody,
  yo as MDBModalContent,
  ic as MDBModalDialog,
  Mo as MDBModalFooter,
  wo as MDBModalHeader,
  No as MDBModalTitle,
  Oi as MDBMultiRange,
  Ns as MDBNavbar,
  jr as MDBNavbarBrand,
  Kr as MDBNavbarItem,
  Vr as MDBNavbarLink,
  qr as MDBNavbarNav,
  _r as MDBNavbarToggler,
  Ur as MDBPagination,
  Qr as MDBPaginationItem,
  Gr as MDBPaginationLink,
  Xi as MDBPopconfirm,
  Sl as MDBPopconfirmMessage,
  mo as MDBPopover,
  ho as MDBPopoverBody,
  fi as MDBPopoverHeader,
  to as MDBProgress,
  ks as MDBProgressBar,
  li as MDBRadio,
  Rn as MDBRange,
  Hi as MDBRating,
  Wi as MDBRatingElement,
  pn as MDBRipple,
  Yr as MDBRow,
  Ps as MDBScrollbar,
  hi as MDBScrollspy,
  pi as MDBScrollspyLink,
  vi as MDBScrollspySubList,
  Zs as MDBSelect,
  xi as MDBSelectDeprecated,
  Ei as MDBSideNav,
  Di as MDBSideNavCollapse,
  cc as MDBSideNavItem,
  lc as MDBSideNavLink,
  oc as MDBSideNavMenu,
  Fi as MDBSmoothScroll,
  ws as MDBSpinner,
  Ii as MDBStack,
  Ai as MDBStepper,
  Ri as MDBStepperForm,
  $i as MDBStepperStep,
  Ci as MDBSticky,
  bi as MDBSwitch,
  Jr as MDBTable,
  eo as MDBTableBody,
  Zr as MDBTableHead,
  Do as MDBTabs,
  Bo as MDBTabsContent,
  To as MDBTabsItem,
  Lo as MDBTabsLink,
  So as MDBTabsPane,
  Ni as MDBTextArea,
  js as MDBTimepicker,
  Bi as MDBToast,
  Pr as MDBTooltip,
  rc as MDBTouch,
  Cr as MDBTypography,
  Ds as MDBValidation,
  ki as MDBValidationItem,
  ji as useAnimatedRef,
  Ki as useClipboard,
  Vi as useStickyRef
};
