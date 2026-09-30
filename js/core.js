/* Starship Anatomy: shared runtime.
   Load order: three.js libs, data.js (window.SX_DATA), core.js, then view modules, which call SX.register().
   Everything here is plain browser JS (no modules) so the page also works from file://. */
(function () {
  'use strict';

  const SX = (window.SX = window.SX || {});
  const D = (SX.data = window.SX_DATA || {});
  D.asOf = D.asOf || '';
  D.sources = D.sources || {};
  D.facts = D.facts || {};
  D.timeline = D.timeline || [];
  D.flights = D.flights || [];
  D.comparisons = D.comparisons || [];

  /* ------------------------------------------------------------------ helpers */

  SX.reducedMotion = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  SX.coarse = !!(window.matchMedia && matchMedia('(pointer: coarse)').matches);
  SX.clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  SX.lerp = (a, b, t) => a + (b - a) * t;
  SX.smooth = (t) => t * t * (3 - 2 * t);
  SX.ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  SX.esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function applyAttrs(node, attrs, isSvg) {
    if (!attrs) return;
    for (const k in attrs) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'class') node.setAttribute('class', v);
      else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
      else if (k === 'html') node.innerHTML = v;
      else if (k === 'text') node.textContent = v;
      else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
      else if (!isSvg && (k === 'value' || k === 'checked' || k === 'disabled')) node[k] = v;
      else node.setAttribute(k, v === true ? '' : v);
    }
  }
  function appendKids(node, kids) {
    kids.flat(Infinity).forEach((c) => {
      if (c == null || c === false) return;
      node.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
    });
  }
  /** SX.el('div', {class:'panel', onclick: fn}, child, 'text', ...) */
  SX.el = function (tag, attrs, ...kids) {
    const n = document.createElement(tag);
    applyAttrs(n, attrs, false);
    appendKids(n, kids);
    return n;
  };
  const SVGNS = 'http://www.w3.org/2000/svg';
  /** SX.svg('rect', {x:0, y:0, width:10, height:10, class:'part'}) */
  SX.svg = function (tag, attrs, ...kids) {
    const n = document.createElementNS(SVGNS, tag);
    applyAttrs(n, attrs, true);
    appendKids(n, kids);
    return n;
  };
  /** Inject a stylesheet. Modules scope their rules under .v-<viewname>. */
  SX.css = function (text) {
    const s = document.createElement('style');
    s.textContent = text;
    document.head.appendChild(s);
    return s;
  };
  /** Read a CSS custom property from :root, e.g. SX.color('--lox') -> '#45b6ff'. */
  SX.color = function (name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  };

  /* ------------------------------------------------------------------ events */

  const bus = {};
  SX.on = function (ev, fn) {
    (bus[ev] = bus[ev] || []).push(fn);
    return () => SX.off(ev, fn);
  };
  SX.off = function (ev, fn) {
    if (bus[ev]) bus[ev] = bus[ev].filter((f) => f !== fn);
  };
  SX.emit = function (ev, ...args) {
    (bus[ev] || []).slice().forEach((fn) => {
      try { fn(...args); } catch (e) { console.error('[SX] handler for "' + ev + '" failed', e); }
    });
  };

  /* ------------------------------------------------------------------ facts + units */

  const CONF = {
    official: { label: 'Official', long: 'Published by SpaceX, NASA or the FAA' },
    reported: { label: 'Reported', long: 'Reported by credible press, not confirmed by SpaceX' },
    estimate: { label: 'Estimate', long: 'Analyst or community estimate, or derived from other figures' },
    disputed: { label: 'Disputed', long: 'Credible sources disagree' },
  };
  SX.CONF = CONF;

  /** Canonical facts win: modules may add facts the research file lacks, never override. */
  SX.addFacts = function (facts, sources) {
    Object.assign(D.sources, Object.assign({}, sources || {}, D.sources));
    for (const k in facts || {}) if (!(k in D.facts)) D.facts[k] = facts[k];
  };
  SX.fact = (k) => D.facts[k] || null;
  SX.val = function (k, fallback) {
    const f = D.facts[k];
    return f && f.v != null && f.v !== '' ? f.v : fallback;
  };

  let units = 'metric';
  try { units = localStorage.getItem('sx-units') || 'metric'; } catch (e) { /* storage blocked */ }
  SX.units = () => units;
  SX.setUnits = function (u) {
    units = u === 'imperial' ? 'imperial' : 'metric';
    try { localStorage.setItem('sx-units', units); } catch (e) { /* ignore */ }
    SX.renderFacts(document);
    document.querySelectorAll('[data-units]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.units === units)));
    SX.emit('units', units);
  };

  // factor converts FROM the key unit TO the target unit
  const CONV = {
    tf: { imperial: 'lbf', to: { kN: 9.80665, MN: 0.00980665, lbf: 2204.62, klbf: 2.20462, Mlbf: 0.00220462 } },
    kN: { imperial: 'lbf', to: { tf: 1 / 9.80665, MN: 0.001, lbf: 224.809 } },
    MN: { imperial: 'Mlbf', to: { kN: 1000, tf: 101.972, lbf: 224809, Mlbf: 0.224809 } },
    t: { imperial: 'lb', to: { kg: 1000, lb: 2204.62 } },
    kg: { imperial: 'lb', to: { t: 0.001, lb: 2.20462 } },
    m: { imperial: 'ft', to: { ft: 3.28084, cm: 100 } },
    cm: { imperial: 'in', to: { in: 0.393701, m: 0.01 } },
    mm: { imperial: 'in', to: { in: 0.0393701 } },
    km: { imperial: 'mi', to: { mi: 0.621371, m: 1000 } },
    'km/h': { imperial: 'mph', to: { mph: 0.621371, 'm/s': 1 / 3.6 } },
    'm/s': { imperial: 'ft/s', to: { 'ft/s': 3.28084, 'km/h': 3.6 } },
    bar: { imperial: 'psi', to: { psi: 14.5038, MPa: 0.1, atm: 0.986923 } },
    MPa: { imperial: 'psi', to: { psi: 145.038, bar: 10 } },
    'm³': { imperial: 'ft³', to: { 'ft³': 35.3147, L: 1000 } },
  };
  /** Convert a number between units. Temperatures handled specially. Returns [value, unit]. */
  SX.convert = function (v, unit, to) {
    if (typeof v !== 'number' || !to || to === unit) return [v, unit];
    if (unit === '°C' && to === '°F') return [v * 9 / 5 + 32, '°F'];
    if (unit === 'K' && to === '°F') return [(v - 273.15) * 9 / 5 + 32, '°F'];
    if (unit === 'K' && to === '°C') return [v - 273.15, '°C'];
    const c = CONV[unit];
    if (c && c.to[to] != null) return [v * c.to[to], to];
    return [v, unit];
  };
  function autoDigits(v) {
    const a = Math.abs(v);
    if (a >= 1000) return 0;
    if (a >= 100) return 1;
    if (a >= 10) return 1;
    if (a >= 1) return 2;
    return 3;
  }
  /** Format a raw number + unit. opts: {to, digits, units:'metric'|'imperial', unitless, plus (adds '+' for 'more than')} */
  SX.fmtValue = function (v, unit, opts) {
    opts = opts || {};
    unit = unit || '';
    if (v == null || v === '') return '?';
    if (typeof v !== 'number') return String(v) + (unit && !opts.unitless ? ' ' + unit : '');
    let to = opts.to;
    const sys = opts.units || units;
    if (!to && sys === 'imperial') {
      if (unit === '°C' || unit === 'K') to = '°F';
      else if (CONV[unit]) to = CONV[unit].imperial;
    }
    let [cv, cu] = SX.convert(v, unit, to);
    const converted = cu !== unit;
    // big imperial figures read better in millions (18.2 Mlbf, 12.6 million lb)
    if (!opts.to && cu === 'lbf' && Math.abs(cv) >= 1e6) { cv = cv / 1e6; cu = 'Mlbf'; }
    else if (!opts.to && cu === 'lb' && Math.abs(cv) >= 1e6) { cv = cv / 1e6; cu = 'million lb'; }
    let digits = opts.digits != null ? opts.digits : autoDigits(cv);
    // a converted figure is only as precise as its source: keep three significant figures (551,000 lbf, not 551,155)
    if (converted && opts.digits == null && cv !== 0) {
      const mag = Math.floor(Math.log10(Math.abs(cv)));
      const q = Math.pow(10, mag - 2);
      cv = Math.round(cv / q) * q;
      digits = Math.max(0, 2 - mag);
    }
    let num = cv.toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: 0 });
    if (opts.plus) num += '+';
    if (opts.unitless || !cu || cu === 'ratio') return num;
    if (cu === '%' || cu.startsWith('°') || cu === '×' || cu === ':1') return num + cu;
    return num + ' ' + cu;
  };
  /** Format a fact by key, honoring the page unit system. */
  SX.fmt = function (key, opts) {
    const f = D.facts[key];
    if (!f) return '?';
    // a fact on file with no value is a documented unknown: say so instead of printing '?'
    if (f.v == null || f.v === '') return 'Not published';
    return SX.fmtValue(f.v, f.unit, opts);
  };
  /** HTML for an inline, clickable fact with a confidence mark. */
  SX.factHTML = function (key, opts) {
    const o = opts ? SX.esc(JSON.stringify(opts)) : '';
    return '<span class="fact" data-fact="' + SX.esc(key) + '"' + (o ? ' data-fact-opts="' + o + '"' : '') + ' tabindex="0" role="button"></span>';
  };
  /** Replace {{fact.key}} or {{fact.key|to}} tokens in a string of HTML with fact spans. */
  SX.withFacts = function (html) {
    return String(html || '').replace(/\{\{\s*([\w.]+)(?:\|([^}\s]+))?\s*\}\}/g, (m, key, to) => SX.factHTML(key, to ? { to } : null));
  };
  SX.sourceTitle = function (id) {
    const s = D.sources[id];
    return s ? (s.publisher ? s.publisher + ', ' : '') + (s.title || id) : id;
  };
  SX.renderFacts = function (root) {
    (root || document).querySelectorAll('[data-fact]').forEach((n) => {
      const key = n.dataset.fact;
      const f = D.facts[key];
      let opts = null;
      if (n.dataset.factOpts) { try { opts = JSON.parse(n.dataset.factOpts); } catch (e) { opts = null; } }
      const conf = f && CONF[f.conf] ? f.conf : f ? 'reported' : 'missing';
      n.classList.add('fact');
      n.classList.remove('conf-official', 'conf-reported', 'conf-estimate', 'conf-disputed', 'conf-missing');
      n.classList.add('conf-' + conf);
      n.textContent = SX.fmt(key, opts);
      n.classList.toggle('fact-text', !!(f && typeof f.v !== 'number'));
      if (!n.hasAttribute('tabindex')) { n.setAttribute('tabindex', '0'); n.setAttribute('role', 'button'); }
      const src = f && f.src ? f.src.map(SX.sourceTitle).join('; ') : 'No source on file';
      n.setAttribute('aria-label', n.textContent + ', ' + (CONF[conf] ? CONF[conf].label : 'Missing') + ' figure. Source: ' + src);
      n.title = (CONF[conf] ? CONF[conf].label : 'Missing') + ' | ' + src + (f && f.note ? ' | ' + f.note : '');
    });
  };

  /* ------------------------------------------------------------------ popover (fact sources) */

  let pop = null;
  function closePop() { if (pop) { pop.remove(); pop = null; } }
  function openFactPop(anchor) {
    closePop();
    const key = anchor.dataset.fact;
    const f = D.facts[key];
    const conf = f && CONF[f.conf] ? f.conf : 'missing';
    const other = f && typeof f.v === 'number' ? SX.fmtValue(f.v, f.unit, { units: units === 'metric' ? 'imperial' : 'metric' }) : '';
    const srcs = (f && f.src ? f.src : []).map((id) => {
      const s = D.sources[id];
      if (!s) return '<li>' + SX.esc(id) + '</li>';
      return '<li><a href="' + SX.esc(s.url) + '" target="_blank" rel="noopener">' + SX.esc(s.title || id) + '</a><span>' + SX.esc([s.publisher, s.date].filter(Boolean).join(', ')) + '</span></li>';
    }).join('');
    pop = SX.el('div', { class: 'factpop', role: 'dialog', 'aria-label': 'Source for this figure' });
    pop.innerHTML =
      '<div class="factpop-v">' + SX.esc(SX.fmt(key)) + (other && other !== SX.fmt(key) ? '<small>' + SX.esc(other) + '</small>' : '') + '</div>' +
      '<div class="factpop-c conf-' + conf + '"><i></i>' + SX.esc(CONF[conf] ? CONF[conf].long : 'No sourced value on file yet') + '</div>' +
      (f && f.note ? '<p class="factpop-n">' + SX.esc(f.note) + '</p>' : '') +
      (srcs ? '<ul class="factpop-s">' + srcs + '</ul>' : '');
    document.body.appendChild(pop);
    const r = anchor.getBoundingClientRect();
    const pw = Math.min(320, window.innerWidth - 24);
    pop.style.width = pw + 'px';
    let left = SX.clamp(r.left + r.width / 2 - pw / 2, 12, window.innerWidth - pw - 12);
    let top = r.bottom + 8;
    if (top + pop.offsetHeight > window.innerHeight - 12) top = Math.max(12, r.top - pop.offsetHeight - 8);
    pop.style.left = left + 'px';
    pop.style.top = top + 'px';
  }
  document.addEventListener('click', (e) => {
    const f = e.target.closest && e.target.closest('.fact');
    if (f) { e.preventDefault(); e.stopPropagation(); openFactPop(f); return; }
    if (pop && !pop.contains(e.target)) closePop();
  }, true);
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('fact')) { e.preventDefault(); openFactPop(e.target); }
  });
  window.addEventListener('scroll', closePop, { passive: true });

  /* ------------------------------------------------------------------ tooltip */

  let tipEl = null;
  SX.tip = {
    show(html, x, y) {
      if (!tipEl) { tipEl = SX.el('div', { class: 'sx-tip', role: 'tooltip' }); document.body.appendChild(tipEl); }
      tipEl.innerHTML = html;
      tipEl.hidden = false;
      const w = tipEl.offsetWidth, h = tipEl.offsetHeight;
      let lx = x + 14, ly = y + 14;
      if (lx + w > window.innerWidth - 8) lx = x - w - 14;
      if (ly + h > window.innerHeight - 8) ly = y - h - 14;
      tipEl.style.left = Math.max(8, lx) + 'px';
      tipEl.style.top = Math.max(8, ly) + 'px';
    },
    hide() { if (tipEl) tipEl.hidden = true; },
  };

  /* ------------------------------------------------------------------ parts registry */

  const parts = (SX._parts = new Map());
  /** Register or extend part nodes. Later calls merge fields into earlier ones. */
  SX.addParts = function (list) {
    (Array.isArray(list) ? list : [list]).forEach((p) => {
      if (!p || !p.id) return;
      const prev = parts.get(p.id) || {};
      parts.set(p.id, Object.assign({}, prev, p));
    });
    SX.emit('parts');
  };
  SX.part = (id) => parts.get(id) || null;
  SX.allParts = () => Array.from(parts.values());
  SX.children = (id) => SX.allParts().filter((p) => p.parent === id).sort((a, b) => (a.order ?? 50) - (b.order ?? 50) || a.name.localeCompare(b.name));
  SX.lineage = function (id) {
    const out = [];
    let p = parts.get(id);
    let guard = 0;
    while (p && guard++ < 20) { out.unshift(p); p = p.parent ? parts.get(p.parent) : null; }
    return out;
  };

  // Top-level skeleton. View modules fill in bodies, specs and children.
  SX.addParts([
    { id: 'stack', parent: null, name: 'Starship system', kind: 'Vehicle', order: 0,
      summary: 'Two fully reusable stages stacked into the largest and most powerful rocket ever flown: the Super Heavy booster and the Starship upper stage.' },
    { id: 'booster', parent: 'stack', name: 'Super Heavy', kind: 'First stage', order: 1,
      summary: 'The booster: two giant stainless-steel propellant tanks over a cluster of Raptor engines. It flies back to the launch site to be caught by the tower.' },
    { id: 'ship', parent: 'stack', name: 'Starship', short: 'Ship', kind: 'Second stage and spacecraft', order: 2,
      summary: 'The upper stage and spacecraft. It carries the payload, reaches orbit on its own engines, and reenters belly-first behind a ceramic heat shield.' },
    { id: 'raptor3', parent: 'stack', name: 'Raptor 3', kind: 'Rocket engine', order: 3,
      summary: 'The methane and liquid oxygen engine that powers both stages, built around the full-flow staged combustion cycle.' },
    { id: 'flight', parent: 'stack', name: 'Mission profile', kind: 'Operations', order: 4,
      summary: 'What happens from ignition to catch: hot staging, boostback, reentry and landing.' },
    { id: 'ground', parent: 'stack', name: 'Launch and catch systems', kind: 'Ground systems', order: 5,
      summary: 'The tower, catch arms, launch mount and propellant farm that launch Starship and catch it on return.' },
  ]);

  /* ------------------------------------------------------------------ views */

  const views = (SX._views = new Map());
  /**
   * SX.register(name, { title, parts: [ids this view can show], init(mount), focus(partId), onSelect(partId) })
   * init runs lazily when the mount nears the viewport (or when SX.show needs it).
   */
  SX.register = function (name, def) {
    views.set(name, Object.assign({ name, title: name, parts: [], ready: false, failed: false }, def));
  };
  SX.viewsFor = function (id) {
    const out = [];
    views.forEach((v) => { if ((v.parts || []).includes(id) || (typeof v.owns === 'function' && v.owns(id))) out.push(v.name); });
    const p = parts.get(id);
    if (p && p.view && out.includes(p.view)) { out.splice(out.indexOf(p.view), 1); out.unshift(p.view); }
    return out;
  };
  SX.mountOf = (name) => document.querySelector('[data-view="' + name + '"]');
  SX.initView = function (name) {
    const v = views.get(name);
    if (!v || v.ready || v.failed) return v;
    const mount = SX.mountOf(name);
    if (!mount) { console.warn('[SX] no mount for view', name); v.failed = true; return v; }
    mount.classList.add('v-' + name);
    try {
      v.init(mount);
      v.ready = true;
      mount.dataset.ready = 'true';
      SX.renderFacts(mount);
      SX.emit('viewready', name);
    } catch (e) {
      v.failed = true;
      console.error('[SX] view "' + name + '" failed to initialise', e);
      mount.appendChild(SX.el('div', { class: 'view-error', role: 'alert' },
        SX.el('strong', null, 'This view could not load.'),
        ' ' + (window.THREE ? '' : 'The 3D library did not load, check your connection. ') + (e && e.message ? e.message : '')));
    }
    return v;
  };
  /** Scroll to the best view for a part, initialise it, focus the part and open the inspector. */
  SX.show = function (id, viewName) {
    const name = viewName || SX.viewsFor(id)[0];
    SX.select(id, { from: 'show' });
    if (!name) return;
    const v = SX.initView(name);
    const mount = SX.mountOf(name);
    if (mount) {
      const r = mount.getBoundingClientRect();
      const topbar = document.querySelector('.topbar');
      const offset = (topbar ? topbar.offsetHeight : 0) + 12;
      const inView = r.top >= offset - 4 && r.top < window.innerHeight * 0.5;
      if (!inView) window.scrollTo({ top: window.scrollY + r.top - offset, behavior: SX.reducedMotion ? 'auto' : 'smooth' });
    }
    if (v && v.ready && typeof v.focus === 'function') {
      setTimeout(() => { try { v.focus(id); } catch (e) { console.error('[SX] focus failed', name, id, e); } }, SX.reducedMotion ? 0 : 380);
    }
  };

  /* ------------------------------------------------------------------ selection */

  SX.selected = null;
  SX.select = function (id, opts) {
    opts = opts || {};
    if (id && !parts.has(id)) console.warn('[SX] select: unknown part id', id);
    SX.selected = id || null;
    SX.emit('select', SX.selected, opts);
    if (id && opts.inspector !== false) Inspector.open(id);
    if (!id) Inspector.close();
  };
  SX.hover = function (id, opts) { SX.emit('hover', id || null, opts || {}); };

  /* ------------------------------------------------------------------ inspector */

  const Inspector = (SX.inspector = {
    el: null,
    open(id) {
      const p = parts.get(id);
      if (!p || !this.el) return;
      this.render(p);
      this.el.classList.add('open');
      this.el.setAttribute('aria-hidden', 'false');
      this.el.inert = false;
      document.body.classList.add('inspector-open');
    },
    close() {
      if (!this.el) return;
      this.el.classList.remove('open');
      this.el.setAttribute('aria-hidden', 'true');
      this.el.inert = true;
      document.body.classList.remove('inspector-open');
    },
    render(p) {
      const el = this.el;
      const body = el.querySelector('.insp-body');
      body.innerHTML = '';
      const lineage = SX.lineage(p.id);
      const crumbs = SX.el('nav', { class: 'insp-crumbs', 'aria-label': 'Where this part sits' });
      lineage.forEach((q, i) => {
        if (i) crumbs.appendChild(SX.el('span', { class: 'sep', 'aria-hidden': 'true' }, '/'));
        crumbs.appendChild(i === lineage.length - 1
          ? SX.el('span', { class: 'here' }, q.short || q.name)
          : SX.el('button', { type: 'button', onclick: () => SX.select(q.id) }, q.short || q.name));
      });
      body.appendChild(crumbs);
      body.appendChild(SX.el('div', { class: 'insp-kind' }, p.kind || 'Component'));
      body.appendChild(SX.el('h2', { class: 'insp-name', id: 'insp-title' }, p.name, p.short && p.short !== p.name ? SX.el('span', { class: 'insp-short' }, p.short) : null));
      if (p.summary) body.appendChild(SX.el('p', { class: 'insp-summary', html: SX.withFacts(p.summary) }));

      const vs = SX.viewsFor(p.id);
      if (vs.length) {
        const row = SX.el('div', { class: 'insp-views' });
        vs.forEach((name, i) => {
          const v = views.get(name);
          row.appendChild(SX.el('button', { type: 'button', class: 'btn btn-sm' + (i === 0 ? ' btn-primary' : ''), onclick: () => SX.show(p.id, name) }, (i === 0 ? 'Show in ' : '') + (v.title || name)));
        });
        body.appendChild(row);
      }

      if (p.specs && p.specs.length) {
        const t = SX.el('table', { class: 'spec-table' });
        const tb = SX.el('tbody');
        p.specs.forEach((s) => {
          let valHTML;
          if (s.fact) {
            const fo = s.opts || {};
            ['to', 'digits', 'unitless', 'plus'].forEach((k) => { if (s[k] != null) fo[k] = s[k]; });
            valHTML = SX.factHTML(s.fact, Object.keys(fo).length ? fo : null);
          }
          else valHTML = SX.esc(s.value != null ? s.value : '') + (s.unit ? ' ' + SX.esc(s.unit) : '') + (s.conf ? ' <span class="conf-tag conf-' + SX.esc(s.conf) + '">' + SX.esc(CONF[s.conf] ? CONF[s.conf].label : s.conf) + '</span>' : '');
          tb.appendChild(SX.el('tr', null, SX.el('th', { scope: 'row' }, s.label), SX.el('td', { html: valHTML })));
        });
        t.appendChild(tb);
        body.appendChild(t);
      }
      (p.body || []).forEach((para) => body.appendChild(SX.el('p', { class: 'insp-p', html: SX.withFacts(para) })));

      const kids = SX.children(p.id);
      if (kids.length) {
        body.appendChild(SX.el('h3', { class: 'insp-h' }, 'Inside this'));
        const list = SX.el('div', { class: 'chip-row' });
        kids.forEach((k) => list.appendChild(SX.el('button', { type: 'button', class: 'chip', onclick: () => SX.select(k.id) }, k.name)));
        body.appendChild(list);
      }
      if (p.related && p.related.length) {
        body.appendChild(SX.el('h3', { class: 'insp-h' }, 'Related'));
        const list = SX.el('div', { class: 'chip-row' });
        p.related.forEach((rid) => { const r = parts.get(rid); if (r) list.appendChild(SX.el('button', { type: 'button', class: 'chip chip-quiet', onclick: () => SX.select(rid) }, r.name)); });
        body.appendChild(list);
      }
      // sibling stepper
      if (p.parent) {
        const sib = SX.children(p.parent);
        const i = sib.findIndex((s) => s.id === p.id);
        if (sib.length > 1) {
          const prev = sib[(i - 1 + sib.length) % sib.length], next = sib[(i + 1) % sib.length];
          body.appendChild(SX.el('div', { class: 'insp-step' },
            SX.el('button', { type: 'button', class: 'btn btn-sm btn-ghost', onclick: () => SX.select(prev.id), 'aria-label': 'Previous: ' + prev.name }, '← ' + prev.name),
            SX.el('button', { type: 'button', class: 'btn btn-sm btn-ghost', onclick: () => SX.select(next.id), 'aria-label': 'Next: ' + next.name }, next.name + ' →')));
        }
      }
      SX.renderFacts(body);
      body.scrollTop = 0;
      el.querySelector('.insp-scroll').scrollTop = 0;
    },
  });

  function buildInspector() {
    const el = SX.el('aside', { id: 'inspector', class: 'inspector', 'aria-labelledby': 'insp-title', 'aria-hidden': 'true' },
      SX.el('div', { class: 'insp-bar' },
        SX.el('span', { class: 'insp-label' }, 'Component'),
        SX.el('button', { type: 'button', class: 'btn btn-sm btn-ghost', onclick: () => SX.openIndex() }, 'Parts index'),
        SX.el('button', { type: 'button', class: 'insp-close', 'aria-label': 'Close inspector', onclick: () => SX.select(null) }, '×')),
      SX.el('div', { class: 'insp-scroll' }, SX.el('div', { class: 'insp-body' })));
    el.inert = true;
    document.body.appendChild(el);
    Inspector.el = el;
  }

  /* ------------------------------------------------------------------ parts index */

  let indexEl = null;
  SX.openIndex = function () {
    if (!indexEl) {
      indexEl = SX.el('div', { class: 'pindex', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Parts index', hidden: true },
        SX.el('div', { class: 'pindex-card' },
          SX.el('div', { class: 'pindex-head' },
            SX.el('label', { for: 'pindex-q', class: 'eyebrow' }, 'Parts index'),
            SX.el('input', { id: 'pindex-q', type: 'search', placeholder: 'Search parts, e.g. turbopump, grid fin, tile', autocomplete: 'off' }),
            SX.el('button', { type: 'button', class: 'insp-close', 'aria-label': 'Close parts index', onclick: () => SX.closeIndex() }, '×')),
          SX.el('div', { class: 'pindex-tree' })));
      indexEl.addEventListener('click', (e) => { if (e.target === indexEl) SX.closeIndex(); });
      document.body.appendChild(indexEl);
      indexEl.querySelector('input').addEventListener('input', (e) => renderIndex(e.target.value));
    }
    renderIndex('');
    indexEl.hidden = false;
    setTimeout(() => indexEl.querySelector('input').focus(), 0);
  };
  SX.closeIndex = function () { if (indexEl) indexEl.hidden = true; };
  function renderIndex(q) {
    const tree = indexEl.querySelector('.pindex-tree');
    tree.innerHTML = '';
    q = (q || '').trim().toLowerCase();
    const match = (p) => !q || [p.name, p.short, p.kind, p.summary].filter(Boolean).join(' ').toLowerCase().includes(q);
    const keep = new Set();
    SX.allParts().forEach((p) => { if (match(p)) SX.lineage(p.id).forEach((a) => keep.add(a.id)); });
    function branch(parentId, depth) {
      const kids = SX.children(parentId).filter((k) => keep.has(k.id));
      if (!kids.length) return null;
      const ul = SX.el('ul', { class: depth ? 'sub' : 'root' });
      kids.forEach((k) => {
        const has = SX.viewsFor(k.id).length > 0;
        ul.appendChild(SX.el('li', null,
          SX.el('button', { type: 'button', class: 'pindex-item' + (match(k) && q ? ' hit' : ''), onclick: () => { SX.closeIndex(); has ? SX.show(k.id) : SX.select(k.id); } },
            SX.el('span', null, k.name), SX.el('small', null, k.kind || '')),
          branch(k.id, depth + 1)));
      });
      return ul;
    }
    const root = SX.el('ul', { class: 'root' });
    const top = parts.get('stack');
    root.appendChild(SX.el('li', null,
      SX.el('button', { type: 'button', class: 'pindex-item', onclick: () => { SX.closeIndex(); SX.select('stack'); } }, SX.el('span', null, top.name), SX.el('small', null, top.kind)),
      branch('stack', 1)));
    tree.appendChild(root);
  }

  /* ------------------------------------------------------------------ animation loop */

  const loops = new Set(); // {el, fn, visible, t}
  const stages = new Set();
  const visIO = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.target.__sxVis) en.target.__sxVis(en.isIntersecting); });
  }, { rootMargin: '120px 0px' }) : null;
  function watchVisible(el, cb) {
    el.__sxVis = cb;
    if (visIO) visIO.observe(el); else cb(true);
  }
  /** Run fn(dt, t) every frame while el is on screen. Returns a stop function. dt in seconds. */
  SX.loop = function (el, fn) {
    const entry = { el, fn, visible: false, t: 0 };
    loops.add(entry);
    watchVisible(el, (v) => { entry.visible = v; });
    return () => { loops.delete(entry); if (visIO) visIO.unobserve(el); };
  };
  let last = 0;
  function tick(now) {
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
    last = now;
    if (!document.hidden) {
      loops.forEach((e) => { if (e.visible) { e.t += dt; try { e.fn(dt, e.t); } catch (err) { console.error('[SX] loop error', err); loops.delete(e); } } });
      stages.forEach((s) => { if (s.visible) s._frame(dt); });
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  /* ------------------------------------------------------------------ three.js helpers */

  const envCache = new WeakMap();
  SX.three = {
    get available() { return !!window.THREE; },
    /** Neutral studio reflections so stainless steel reads as metal. One per renderer. */
    env(renderer) {
      const THREE = window.THREE;
      if (envCache.has(renderer)) return envCache.get(renderer);
      let tex = null;
      if (THREE && THREE.RoomEnvironment) {
        const pm = new THREE.PMREMGenerator(renderer);
        tex = pm.fromScene(new THREE.RoomEnvironment(), 0.04).texture;
        pm.dispose();
      }
      envCache.set(renderer, tex);
      return tex;
    },
    /** LatheGeometry from [[radius, y], ...] pairs. */
    lathe(profile, segments) {
      const THREE = window.THREE;
      return new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(Math.max(0, r), y)), segments || 64);
    },
    /** World-space bounds that include InstancedMesh instances (Box3.setFromObject ignores them in r147). */
    box(obj) {
      const THREE = window.THREE;
      const out = new THREE.Box3();
      const tmpB = new THREE.Box3(), m = new THREE.Matrix4();
      obj.updateWorldMatrix(true, true);
      obj.traverse((n) => {
        if (!n.visible || !n.geometry) return;
        if (!n.geometry.boundingBox) n.geometry.computeBoundingBox();
        if (n.isInstancedMesh) {
          for (let i = 0; i < n.count; i++) {
            n.getMatrixAt(i, m);
            m.premultiply(n.matrixWorld);
            out.union(tmpB.copy(n.geometry.boundingBox).applyMatrix4(m));
          }
        } else {
          out.union(tmpB.copy(n.geometry.boundingBox).applyMatrix4(n.matrixWorld));
        }
      });
      if (out.isEmpty()) out.setFromObject(obj);
      return out;
    },
    /** A THREE.Color from a CSS token, converted to linear so it matches the token after sRGB output. */
    color(token) {
      const c = new window.THREE.Color(SX.color(token) || '#ffffff');
      return c.convertSRGBToLinear();
    },
    /** Tag an object (and everything under it) as a pickable part. */
    tag(obj, partId) { obj.userData.partId = partId; return obj; },
    partOf(obj) {
      while (obj) { if (obj.userData && obj.userData.partId) return obj.userData.partId; obj = obj.parent; }
      return null;
    },
    /** Emissive highlight on every mesh under obj. Pass color null to restore. Give each part its own material instances. */
    highlight(obj, color, intensity) {
      obj.traverse((m) => {
        if (!m.isMesh) return;
        (Array.isArray(m.material) ? m.material : [m.material]).forEach((mat) => {
          if (!mat || !mat.emissive) return;
          if (!mat.userData.__em) mat.userData.__em = { c: mat.emissive.clone(), i: mat.emissiveIntensity };
          if (color == null) { mat.emissive.copy(mat.userData.__em.c); mat.emissiveIntensity = mat.userData.__em.i; }
          else { mat.emissive.set(color); mat.emissiveIntensity = intensity == null ? 0.45 : intensity; }
        });
      });
    },
    /**
     * Create a WebGL stage inside mount (mount must have a CSS height).
     * opts: {fov, near, far, controls:true, env:true, exposure, target:[x,y,z], position:[x,y,z], minDistance, maxDistance}
     * Returns st: {THREE, scene, camera, renderer, controls, canvas, overlay, onFrame(fn), pick(targets,{onClick,onHover}),
     *              fly(target, position, ms), frame(obj, {dir, pad, ms}), label(text, fnWorldPos, opts), render(), dispose()}
     */
    stage(mount, opts) {
      const THREE = window.THREE;
      if (!THREE) throw new Error('three.js is not available');
      const o = Object.assign({ fov: 35, near: 0.05, far: 5000, controls: true, env: true, exposure: 1.0 }, opts || {});
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: !!o.preserve });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = o.exposure;
      renderer.localClippingEnabled = true;
      const canvas = renderer.domElement;
      canvas.className = 'three-canvas';
      const holder = SX.el('div', { class: 'three-holder' });
      holder.appendChild(canvas);
      const overlay = SX.el('div', { class: 'three-overlay', 'aria-hidden': 'true' });
      holder.appendChild(overlay);
      mount.appendChild(holder);

      const scene = new THREE.Scene();
      if (o.env) scene.environment = SX.three.env(renderer);
      const camera = new THREE.PerspectiveCamera(o.fov, 1, o.near, o.far);
      camera.position.fromArray(o.position || [0, 0, 10]);
      let controls = null;
      if (o.controls && THREE.OrbitControls) {
        controls = new THREE.OrbitControls(camera, canvas);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.screenSpacePanning = true;
        if (o.minDistance) controls.minDistance = o.minDistance;
        if (o.maxDistance) controls.maxDistance = o.maxDistance;
        controls.target.fromArray(o.target || [0, 0, 0]);
        controls.update();
        // On touch screens a full-size canvas would trap page scrolling; rotation is opt-in there.
        if (SX.coarse) {
          controls.enabled = false;
          canvas.style.touchAction = 'pan-y';
          const lock = SX.el('button', { type: 'button', class: 'btn btn-sm three-lock', 'aria-pressed': 'false' }, 'Rotate');
          lock.addEventListener('click', () => {
            controls.enabled = !controls.enabled;
            lock.setAttribute('aria-pressed', String(controls.enabled));
            lock.textContent = controls.enabled ? 'Done rotating' : 'Rotate';
            canvas.style.touchAction = controls.enabled ? 'none' : 'pan-y';
          });
          holder.appendChild(lock);
        }
      } else {
        camera.lookAt(new THREE.Vector3().fromArray(o.target || [0, 0, 0]));
      }

      const frameFns = [];
      const labels = [];
      let flight = null;
      let pickTargets = [], onClick = null, onHover = null, hoverId = null, lastMove = null, downAt = null;
      const ray = new THREE.Raycaster();
      const ndc = new THREE.Vector2();
      const tmp = new THREE.Vector3();

      const st = {
        THREE, scene, camera, renderer, controls, canvas, overlay, holder, mount,
        visible: false, clock: 0, disposed: false,
        onFrame(fn) { frameFns.push(fn); return () => { const i = frameFns.indexOf(fn); if (i >= 0) frameFns.splice(i, 1); }; },
        pick(targets, handlers) { pickTargets = targets; onClick = handlers && handlers.onClick; onHover = handlers && handlers.onHover; },
        /** Raycast at client coords; skips hidden objects and fragments removed by clipping planes. */
        hitTest(clientX, clientY) {
          const r = canvas.getBoundingClientRect();
          ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
          ray.setFromCamera(ndc, camera);
          const hits = ray.intersectObjects(pickTargets, true);
          for (const h of hits) {
            let vis = true, n = h.object;
            while (n) { if (!n.visible) { vis = false; break; } n = n.parent; }
            if (!vis) continue;
            const mats = Array.isArray(h.object.material) ? h.object.material : [h.object.material];
            const planes = [].concat(renderer.clippingPlanes || [], (mats[0] && mats[0].clippingPlanes) || []);
            if (planes.some((pl) => pl.distanceToPoint(h.point) < 0)) continue;
            if (mats[0] && mats[0].userData && mats[0].userData.noPick) continue;
            const id = SX.three.partOf(h.object);
            if (id) return { id, object: h.object, point: h.point };
          }
          return null;
        },
        fly(target, position, ms) {
          const T = target.isVector3 ? target : new THREE.Vector3().fromArray(target);
          const P = position.isVector3 ? position : new THREE.Vector3().fromArray(position);
          if (!controls || SX.reducedMotion) {
            camera.position.copy(P);
            if (controls) controls.target.copy(T); else camera.lookAt(T);
            return;
          }
          flight = { t: 0, dur: (ms || 900) / 1000, fT: controls.target.clone(), tT: T.clone(), fP: camera.position.clone(), tP: P.clone() };
        },
        /** Fly to frame an object. dir: view direction vector from target to camera. */
        frame(obj, fo) {
          fo = fo || {};
          const box = SX.three.box(obj);
          const sphere = box.getBoundingSphere(new THREE.Sphere());
          const dir = (fo.dir ? (fo.dir.isVector3 ? fo.dir.clone() : new THREE.Vector3().fromArray(fo.dir)) : camera.position.clone().sub(controls ? controls.target : sphere.center)).normalize();
          const fitH = sphere.radius / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2));
          const fitW = fitH / Math.max(0.35, Math.min(1, camera.aspect));
          const dist = Math.max(fitH, fitW) * (fo.pad || 1.15);
          st.fly(sphere.center, sphere.center.clone().add(dir.multiplyScalar(dist)), fo.ms);
        },
        /** HTML label pinned to a world position. getPos(): THREE.Vector3. Returns {el, remove()}. */
        label(html, getPos, lo) {
          lo = lo || {};
          const el = SX.el('div', { class: 'three-label' + (lo.className ? ' ' + lo.className : ''), html });
          overlay.appendChild(el);
          const L = { el, getPos, show: true, remove() { el.remove(); labels.splice(labels.indexOf(L), 1); } };
          labels.push(L);
          return L;
        },
        resize() {
          const w = Math.max(1, holder.clientWidth), h = Math.max(1, holder.clientHeight);
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        },
        render() { renderer.render(scene, camera); },
        _frame(dt) {
          if (st.disposed) return;
          st.clock += dt;
          if (flight) {
            flight.t += dt;
            const k = SX.ease(Math.min(1, flight.t / flight.dur));
            controls.target.lerpVectors(flight.fT, flight.tT, k);
            camera.position.lerpVectors(flight.fP, flight.tP, k);
            if (k >= 1) flight = null;
          }
          for (const fn of frameFns) { try { fn(dt, st.clock); } catch (e) { console.error('[SX] stage frame error', e); } }
          if (controls) controls.update();
          if (lastMove && onHover) {
            const hit = st.hitTest(lastMove.clientX, lastMove.clientY);
            const id = hit ? hit.id : null;
            canvas.style.cursor = id ? 'pointer' : '';
            if (id !== hoverId) { hoverId = id; onHover(hit, lastMove); }
            else if (id && onHover.move) onHover.move(hit, lastMove);
            lastMove = null;
          }
          renderer.render(scene, camera);
          if (labels.length) {
            const w = holder.clientWidth, h = holder.clientHeight;
            labels.forEach((L) => {
              const p = L.getPos();
              if (!p || !L.show) { L.el.hidden = true; return; }
              tmp.copy(p).project(camera);
              const behind = tmp.z > 1;
              L.el.hidden = behind;
              L.el.style.transform = 'translate(' + ((tmp.x * 0.5 + 0.5) * w).toFixed(1) + 'px,' + ((-tmp.y * 0.5 + 0.5) * h).toFixed(1) + 'px)';
            });
          }
        },
        dispose() { st.disposed = true; stages.delete(st); renderer.dispose(); },
      };

      canvas.addEventListener('pointerdown', (e) => { downAt = { x: e.clientX, y: e.clientY }; });
      canvas.addEventListener('pointerup', (e) => {
        if (!downAt) return;
        const moved = Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y);
        downAt = null;
        if (moved > 6 || !onClick) return;
        onClick(st.hitTest(e.clientX, e.clientY), e);
      });
      canvas.addEventListener('pointermove', (e) => { if (e.pointerType !== 'touch') lastMove = e; });
      canvas.addEventListener('pointerleave', () => { if (hoverId && onHover) { hoverId = null; onHover(null, null); } canvas.style.cursor = ''; SX.tip.hide(); });

      if ('ResizeObserver' in window) new ResizeObserver(() => st.resize()).observe(holder);
      else window.addEventListener('resize', () => st.resize());
      st.resize();
      watchVisible(holder, (v) => { st.visible = v; });
      stages.add(st);
      return st;
    },
  };

  /* ------------------------------------------------------------------ debug hooks (verification in headless or hidden tabs) */

  SX.debug = {
    /** Advance every stage and loop n frames synchronously, regardless of visibility. */
    step(n, dt) {
      n = n || 1; dt = dt || 1 / 60;
      for (let i = 0; i < n; i++) {
        loops.forEach((e) => { e.t += dt; try { e.fn(dt, e.t); } catch (err) { console.error(err); } });
        stages.forEach((s) => s._frame(dt));
      }
      return { stages: stages.size, loops: loops.size };
    },
    initAll() { views.forEach((v, k) => SX.initView(k)); return Array.from(views.values()).map((v) => ({ name: v.name, ready: v.ready, failed: v.failed })); },
    views: () => Array.from(views.values()).map((v) => ({ name: v.name, ready: v.ready, failed: v.failed, parts: (v.parts || []).length })),
    missingParts() {
      const miss = [];
      views.forEach((v) => (v.parts || []).forEach((id) => { if (!parts.has(id)) miss.push(v.name + ': ' + id); }));
      return miss;
    },
    missingFacts() {
      const miss = new Set();
      document.querySelectorAll('[data-fact]').forEach((n) => { if (!D.facts[n.dataset.fact]) miss.add(n.dataset.fact); });
      SX.allParts().forEach((p) => (p.specs || []).forEach((s) => { if (s.fact && !D.facts[s.fact]) miss.add(p.id + ' -> ' + s.fact); }));
      return Array.from(miss);
    },
  };
  window.__sx = SX.debug;

  /* ------------------------------------------------------------------ page chrome + boot */

  function setupNav() {
    const links = Array.from(document.querySelectorAll('.topnav a[href^="#"]'));
    const secs = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    if ('IntersectionObserver' in window && secs.length) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          links.forEach((a) => a.removeAttribute('aria-current'));
          const a = links.find((l) => l.getAttribute('href') === '#' + en.target.id);
          if (a) a.setAttribute('aria-current', 'true');
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      secs.forEach((s) => io.observe(s));
    }
    document.querySelectorAll('[data-units]').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.units === units));
      b.addEventListener('click', () => SX.setUnits(b.dataset.units));
    });
    document.querySelectorAll('[data-open-index]').forEach((b) => b.addEventListener('click', () => SX.openIndex()));
    document.querySelectorAll('[data-show]').forEach((b) => b.addEventListener('click', () => SX.show(b.dataset.show)));
  }

  function renderSources() {
    const box = document.getElementById('sources-list');
    if (!box) return;
    // canonical S# first in numeric order, then each module's prefixed ids (SB#, SS#, ...) grouped by prefix
    const pre = (id) => id.replace(/\d+$/, '');
    const num = (id) => parseInt(id.replace(/^\D+/, ''), 10) || 0;
    const ids = Object.keys(D.sources).sort((a, b) => {
      const pa = pre(a), pb = pre(b);
      if (pa !== pb) return pa === 'S' ? -1 : pb === 'S' ? 1 : pa.localeCompare(pb);
      return num(a) - num(b);
    });
    if (!ids.length) { box.appendChild(SX.el('p', { class: 'muted' }, 'Source list loads with the data file.')); return; }
    const ol = SX.el('ol', { class: 'sources' });
    const byUrl = new Map();
    ids.forEach((id) => {
      const s = D.sources[id];
      // the same document registered twice under different ids: list it once, keep the second id as an anchor
      const seen = s.url && byUrl.get(s.url);
      if (seen) { seen.appendChild(SX.el('span', { id: 'src-' + id, hidden: true })); return; }
      const li = SX.el('li', { id: 'src-' + id },
        SX.el('span', { class: 'src-id' }, id),
        s.url ? SX.el('a', { href: s.url, target: '_blank', rel: 'noopener' }, s.title || s.url) : SX.el('span', null, s.title || id),
        SX.el('span', { class: 'src-meta' }, [s.publisher, s.date].filter(Boolean).join(', ')));
      if (s.url) byUrl.set(s.url, li);
      ol.appendChild(li);
    });
    box.appendChild(ol);
  }

  function lazyViews() {
    const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { io.unobserve(en.target); SX.initView(en.target.dataset.view); } });
    }, { rootMargin: '700px 0px' }) : null;
    views.forEach((v, name) => {
      const m = SX.mountOf(name);
      if (!m) return;
      if (io) io.observe(m); else SX.initView(name);
    });
  }

  function boot() {
    document.querySelectorAll('[data-asof]').forEach((n) => { n.textContent = D.asOf || ''; });
    buildInspector();
    setupNav();
    renderSources();
    SX.renderFacts(document);
    lazyViews();
    document.addEventListener('keydown', (e) => {
      const typing = /INPUT|TEXTAREA|SELECT/.test((e.target && e.target.tagName) || '');
      if (e.key === 'Escape') {
        if (pop) closePop();
        else if (indexEl && !indexEl.hidden) SX.closeIndex();
        else if (SX.selected) SX.select(null);
      } else if (e.key === '/' && !typing) {
        e.preventDefault();
        SX.openIndex();
      }
    });
    SX.emit('boot');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else setTimeout(boot, 0);
})();
