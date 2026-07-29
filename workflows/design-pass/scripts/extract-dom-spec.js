/**
 * extract-dom-spec.js — deterministic DOM spec extractor for design-pass.
 *
 * Injected verbatim into BOTH sides of every comparison (the served mockup and the
 * running app) so the two specs are produced by identical code rather than by two
 * agents' independent judgment. Granularity drift between sides is the failure mode
 * that makes a spec diff worthless; this file exists to remove the possibility.
 *
 * The product is `records` — a flat list of [key, field, value] triples covering every
 * visible element, dumped to sorted TSV by `tsv()`. Two TSV files are compared with a
 * real `diff`, not by an agent reading two JSON blobs. That is the whole point: the
 * model never performs the comparison, so it cannot skim past a difference.
 *
 * Usage (claude-in-chrome javascript_tool):
 *   1. inject (see below)                         -> defines window.__grrCore + window.__grrSpec
 *   2. await window.__grrSpec.ready()             -> fonts, hydration, animations settled
 *   3. await window.__grrSpec.sweep()             -> reveal lazy/virtualized content
 *   4. const spec = await window.__grrSpec.extract(opts)
 *   5. await window.__grrSpec.upload(server, name, window.__grrSpec.tsv(spec))
 *   6. await window.__grrSpec.responsive([375,768,1440])   -> S7, via same-origin iframes
 *
 * INJECTION — fetch it from the spec server and eval it. Verified working from an https
 * production origin against http://localhost: Chrome exempts localhost from mixed-content
 * blocking, spec-server.py sends permissive CORS, and neither `eval` nor `Function` was
 * restricted. Two lines, no paste-size question:
 *
 *   (0, eval)(await (await fetch('http://localhost:8973/extract-dom-spec.js')).text())
 *
 * FALLBACK — a target whose CSP omits 'unsafe-eval' will throw on that line. Paste the file
 * contents instead: javascript_tool is extension-injected and page CSP does not apply to it.
 * Do NOT add a <script src> tag — a tag created from page context does get blocked. The file
 * is two independent IIFEs so it can go in as one call or as PART 1 then PART 2; PART 2
 * requires PART 1 to have run.
 *
 * javascript_tool has REPL semantics: end each call with the expression you want back — a
 * top-level `return` is a syntax error. Never combine a reload or navigation with extraction
 * in one call; the evaluation context dies mid-call and the tool errors with "Inspected
 * target navigated or closed".
 *
 * A page reload wipes window.__grrSpec and window.__grrCore. Re-inject after every navigation
 * and after every interaction trace that resets by reloading.
 *
 * NEVER hand a caller an object whose KEYS are page-derived strings. The claude-in-chrome
 * result filter redacts values under any key that looks sensitive — a CSS custom property
 * named `--color-token-fg` comes back as "[BLOCKED: Sensitive key]" and the design system
 * silently vanishes from the spec. Array triples and TSV lines pass through untouched, which
 * is why every page-derived name in this file lives in a value position.
 */

/* =========================== PART 1 of 2 — primitives =========================== */
(() => {
  /* ---------- render context ----------
   * Everything reads through D/W rather than the globals so the same functions can run
   * against a same-origin iframe during the responsive pass. resize_window reports success
   * and does nothing when the window is maximized, so an iframe is the only viewport
   * mechanism on this path that actually works. */
  let D = document, W = window;
  const ctx = {
    set(d, w) { D = d; W = w; },
    reset() { D = document; W = window; },
    get d() { return D; },
    get w() { return W; },
  };
  const cs = (el) => W.getComputedStyle(el);
  const t = (s) => (s || '').trim().replace(/\s+/g, ' ');
  const ownText = (el) => t([...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(' '));

  /* ---------- color ----------
   * Painted through a 1x1 canvas so every color space collapses to concrete sRGB bytes.
   * getComputedStyle hands back `color(srgb ...)`, `oklch(...)`, and `color-mix(...)` verbatim
   * in the space the author wrote them, so a mockup and an implementation can express the
   * identical color in two syntaxes and diff as a token drift that does not exist. */
  let CX = null;
  const canvas2d = () => {
    if (!CX) {
      const c = document.createElement('canvas');
      c.width = c.height = 1;
      CX = c.getContext('2d', { willReadFrequently: true });
    }
    return CX;
  };
  // A page resolves to a few hundred distinct colors across tens of thousands of reads, and each
  // uncached read costs a canvas paint plus a getImageData. Memoizing is the difference between
  // an extraction that finishes and one that times out. Color -> hex is context-independent, so
  // the cache never needs clearing.
  const hexCache = new Map();
  const hex = (v) => {
    const s = (v || '').trim();
    if (!s || s === 'none') return 'none';
    if (s === 'transparent') return 'transparent';
    const memo = hexCache.get(s);
    if (memo !== undefined) return memo;
    const out = hexUncached(s);
    hexCache.set(s, out);
    return out;
  };
  const hexUncached = (s) => {
    let x;
    try { x = canvas2d(); } catch { return s.toLowerCase(); }
    // Assigning an unparseable value leaves fillStyle at its previous value rather than
    // throwing. Two different sentinels distinguish "parsed" from "silently ignored".
    x.fillStyle = '#010203'; x.fillStyle = s; const a = x.fillStyle;
    x.fillStyle = '#040506'; x.fillStyle = s; const b = x.fillStyle;
    if (a !== b) return 'UNPARSED:' + s.toLowerCase();
    x.clearRect(0, 0, 1, 1);
    x.fillRect(0, 0, 1, 1);
    const d = x.getImageData(0, 0, 1, 1).data;
    if (d[3] === 0) return 'transparent';
    const h = (n) => n.toString(16).padStart(2, '0');
    return '#' + h(d[0]) + h(d[1]) + h(d[2]) + (d[3] < 255 ? h(d[3]) : '');
  };
  const COLORFN = /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color-mix|color)\((?:[^()]|\([^()]*\))*\)/gi;
  const normColors = (v) => (v || '').replace(COLORFN, (m) => hex(m));

  /* ---------- lengths ---------- */
  const px = (v) => Math.round(parseFloat(v) || 0);
  const fam = (v) => (v || '').split(',')[0].replace(/["']/g, '').trim().toLowerCase();
  // font-size: 0 is a real technique (icon-only cells, whitespace suppression). Dividing by
  // it produced "NaN" line-height on every such node and bucketed them into one phantom
  // typography group.
  const lh = (v, fs) => {
    if (v === 'normal') return 'normal';
    const n = parseFloat(v);
    if (!isFinite(n)) return 'n/a';
    if (!(fs > 0)) return Math.round(n) + 'px';
    return (n / fs).toFixed(2);
  };
  const ls = (v) => (v === 'normal' ? '0.00' : (parseFloat(v) || 0).toFixed(2));
  const box4 = (s, p) => ['Top', 'Right', 'Bottom', 'Left'].map((k) => px(s[p + k])).join(' ');
  // Table rows carry only border-bottom and cells only border-right. Reading border-top alone
  // recorded every rule in every table as `none` — the axis the comparison was about.
  const border4 = (s) => ['Top', 'Right', 'Bottom', 'Left'].map((k) => {
    const w = px(s['border' + k + 'Width']);
    const st = s['border' + k + 'Style'];
    return (w === 0 || st === 'none') ? 'none' : `${w}px ${st} ${hex(s['border' + k + 'Color'])}`;
  }).join(' / ');
  const radius4 = (s) => ['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft']
    .map((k) => (s['border' + k + 'Radius'] || '0px').split(/\s+/).map(px).join('/')).join(' ');

  /* ---------- contrast ---------- */
  const chan = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const lumOf = (h) => {
    const m = /^#([0-9a-f]{6})/i.exec(h || '');
    if (!m) return null;
    const n = parseInt(m[1], 16);
    return 0.2126 * chan((n >> 16) & 255) + 0.7152 * chan((n >> 8) & 255) + 0.0722 * chan(n & 255);
  };
  const contrast = (fg, bg) => {
    const a = lumOf(fg), b = lumOf(bg);
    if (a == null || b == null) return null;
    return Math.round(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)) * 100) / 100;
  };
  // The declared background of a text node's own element is usually transparent; the color it
  // is actually read against lives further up. Returns null when the answer is genuinely not a
  // flat color — text on a gradient or a photo has a different contrast ratio at every pixel,
  // and walking past the gradient to the white page underneath reports 1:1 for white-on-blue.
  // A fabricated accessibility failure is worse than a missing one.
  const effectiveBg = (el) => {
    let n = el;
    while (n && n.nodeType === 1) {
      const st = cs(n);
      if (st.backgroundImage && st.backgroundImage !== 'none') return null;
      const c = hex(st.backgroundColor);
      if (c === 'transparent' || c === 'none') { n = n.parentElement; continue; }
      if (/^#[0-9a-f]{8}$/i.test(c)) return null;   // translucent — composited, not this color
      return c;
    }
    return '#ffffff';
  };

  /* ---------- noise ----------
   * claude-in-chrome injects its own indicator DOM into every page it drives, so those
   * selectors are baked in rather than left to each run to rediscover. Everything
   * app-specific still has to be passed via opts.noiseSelectors. */
  const NOISE = [
    'nextjs-portal', '#__next-build-watcher', '[data-nextjs-toast]', '[data-nextjs-dialog-overlay]',
    'next-route-announcer', 'vite-error-overlay', '#vite-error-overlay', '#react-refresh-overlay',
    '[id*="webpack-dev-server"]', '#__vconsole', '.tsqd-parent-container',
    '[aria-label*="devtools" i]', '#stagewise-toolbar', '#axe-devtools',
    '#claude-agent-glow-border', '#claude-static-indicator-container',
    '[data-vercel-toolbar]', 'vercel-live-feedback',
    'iframe[data-grr-probe]',
    'script', 'style', 'link', 'meta', 'noscript', 'template',
  ];
  let noiseSel = NOISE.join(',');
  const setNoise = (extra) => { noiseSel = NOISE.concat(extra || []).join(','); };
  const isNoise = (el) => { try { return el.closest(noiseSel) !== null; } catch { return false; } };

  const isVisible = (el) => {
    const s = cs(el);
    if (s.display === 'none' || s.visibility === 'hidden' || s.visibility === 'collapse') return false;
    if (parseFloat(s.opacity) === 0) return false;
    if (s.display === 'contents') return true;   // box-less, children still render
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  // Screen-reader-only affordances have a rendered box and are not content. Astryx-style
  // component kits attach one `span[role=status]` per button, which classified as 60 toasts.
  const isSrOnly = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width <= 1 || r.height <= 1) return true;
    const s = cs(el);
    return s.clipPath === 'inset(50%)' || s.clip === 'rect(0px, 0px, 0px, 0px)';
  };

  /* ---------- roles ---------- */
  const IMPLICIT = {
    A: 'link', BUTTON: 'button', NAV: 'navigation', MAIN: 'main',
    ASIDE: 'complementary', FORM: 'form', DIALOG: 'dialog', SUMMARY: 'button',
    TABLE: 'table', TR: 'row', TD: 'cell', TH: 'columnheader', UL: 'list', OL: 'list',
    LI: 'listitem', IMG: 'img', SELECT: 'combobox', TEXTAREA: 'textbox', PROGRESS: 'progressbar',
    H1: 'heading', H2: 'heading', H3: 'heading', H4: 'heading', H5: 'heading', H6: 'heading',
  };
  const SECTIONING = 'article,aside,main,nav,section,[role=article],[role=complementary],[role=main],[role=navigation],[role=region]';
  // Partial by design — an explicit role= always wins, and '-' is a legitimate answer.
  const role = (el) => {
    const r = el.getAttribute('role');
    if (r) return r.trim().split(/\s+/)[0];
    const tag = el.tagName;
    // A <header>/<footer> scoped to a sectioning element is NOT banner/contentinfo. Recording
    // it as one puts two banners on a page and makes the landmark diff report a gap that the
    // HTML spec says isn't there.
    if (tag === 'HEADER' || tag === 'FOOTER') {
      if (el.parentElement && el.parentElement.closest(SECTIONING)) return '-';
      return tag === 'HEADER' ? 'banner' : 'contentinfo';
    }
    if (tag === 'SECTION') return (el.hasAttribute('aria-label') || el.hasAttribute('aria-labelledby')) ? 'region' : '-';
    if (tag === 'A') return el.hasAttribute('href') ? 'link' : '-';
    if (tag === 'INPUT') {
      const ty = (el.type || 'text').toLowerCase();
      return { checkbox: 'checkbox', radio: 'radio', button: 'button', submit: 'button', reset: 'button', range: 'slider' }[ty] || 'textbox';
    }
    return IMPLICIT[tag] || '-';
  };

  /**
   * Roles whose accessible name may come from their own subtree text. Everything else —
   * main, form, list, region, generic containers — takes a name only from an explicit
   * label. Letting a container name itself from its subtree makes its anchor a copy of
   * every string on the page, so one word of copy drift renames it and the two sides stop
   * matching: phantom structural findings, with the real copy diff buried underneath.
   */
  const NAME_FROM_CONTENT = new Set([
    'button', 'link', 'heading', 'cell', 'gridcell', 'columnheader', 'rowheader', 'row',
    'listitem', 'option', 'tab', 'tooltip', 'treeitem', 'radio', 'checkbox', 'switch',
    'menuitem', 'menuitemcheckbox', 'menuitemradio', 'status', 'alert',
  ]);

  /**
   * Accessible-name APPROXIMATION. Verified: the platform exposes no accessible-name API to
   * page script — `getComputedAccessibleNode` is undefined and `computedName` is not on the
   * element. This walks the spec's fallback order and stops at the first hit. Treat every
   * value as approximate.
   */
  // Memoized per pass: accName runs a querySelector and a closest() on every call, and the
  // anchor, the repeat signature, the copy axis and the fingerprint all ask for it. The cache is
  // cleared at the start of every extract and every fingerprint, because a trace can change a
  // label between them.
  let nameCache = new WeakMap();
  const resetNameCache = () => { nameCache = new WeakMap(); };
  const accName = (el) => {
    const memo = nameCache.get(el);
    if (memo !== undefined) return memo;
    const out = accNameUncached(el);
    nameCache.set(el, out);
    return out;
  };
  const accNameUncached = (el) => {
    if (el.getAttribute('aria-label')) return t(el.getAttribute('aria-label'));
    const lb = el.getAttribute('aria-labelledby');
    if (lb) {
      const s = lb.split(/\s+/).map((id) => (D.getElementById(id) || {}).textContent || '').join(' ');
      if (t(s)) return t(s);
    }
    if (el.id) {
      const l = D.querySelector(`label[for="${CSS.escape(el.id)}"]`);
      if (l) return t(l.textContent);
    }
    if (el.matches('input,select,textarea')) {
      const cl = el.closest('label');
      if (cl) return t(cl.textContent);
    }
    if (el.matches('img,area,input[type=image]') && el.alt != null) return t(el.alt);
    if (el.matches('input[type=submit],input[type=button],input[type=reset]')) return t(el.value);
    if (NAME_FROM_CONTENT.has(role(el))) {
      const own = t(el.textContent);
      if (own && own.length <= 120) return own;
    }
    if (el.title) return t(el.title);
    if (el.getAttribute('placeholder')) return t(el.getAttribute('placeholder'));
    return '';
  };

  /**
   * Icon-only controls have no name — identify them by their SVG geometry instead.
   * Strictly icon-only: the element must BE an svg, or wrap exactly one and carry no text
   * of its own. A descendant search without those guards hangs a hash off every ancestor of
   * every icon, so changing one glyph renames <main>.
   */
  const iconHash = (el) => {
    const isSvg = el.tagName.toLowerCase() === 'svg';
    if (!isSvg && t(el.textContent)) return '';
    const svgs = isSvg ? [el] : [...el.querySelectorAll('svg')];
    if (svgs.length !== 1) return '';
    const d = [...svgs[0].querySelectorAll('path')].map((p) => p.getAttribute('d') || '').join('|');
    if (!d) return '';
    let h = 0;
    for (let i = 0; i < d.length; i++) h = (h * 31 + d.charCodeAt(i)) | 0;
    return '~' + (h >>> 0).toString(36);
  };

  const LANDMARK = 'main,nav,header,footer,aside,form,dialog,[role=main],[role=navigation],[role=banner],[role=contentinfo],[role=complementary],[role=dialog],[role=search],section[aria-label],section[aria-labelledby]';

  /** Stable cross-side anchor. Names survive a rewrite from Tailwind to CSS modules; selectors do not. */
  const anchor = (el) => {
    const lm = el.closest(LANDMARK);
    const scope = lm && lm !== el ? (lm.getAttribute('role') || lm.tagName.toLowerCase()) : 'doc';
    const tag = el.tagName.toLowerCase();
    const n = accName(el);
    if (n) return `${scope}/${tag}[${role(el)}]"${n}"`;
    const sibs = el.parentElement ? [...el.parentElement.children].filter((c) => c.tagName === el.tagName) : [el];
    return `${scope}/${tag}[${role(el)}]#${sibs.indexOf(el) + 1}${iconHash(el)}`;
  };

  /** Scope-free match key for tier-A cross-side pairing. Empty when the element has no name. */
  const matchKey = (el) => { const n = accName(el); return n ? role(el) + '|' + n : ''; };

  /** Deterministic positional fallback for elements no name or text can pair. */
  const domPath = (el) => {
    const parts = [];
    let n = el;
    while (n && n.nodeType === 1 && n !== D.body && parts.length < 24) {
      const sibs = n.parentElement ? [...n.parentElement.children].filter((c) => c.tagName === n.tagName) : [n];
      parts.unshift(n.tagName.toLowerCase() + (sibs.length > 1 ? ':' + (sibs.indexOf(n) + 1) : ''));
      n = n.parentElement;
    }
    return parts.join('>');
  };

  const layout = (s) => {
    if (s.display.includes('grid')) return `grid(${s.gridTemplateColumns.split(/\s+/).filter(Boolean).length})`;
    if (s.display.includes('flex')) {
      return (s.flexDirection.startsWith('column') ? 'flex-col' : 'flex-row') + (s.flexWrap === 'wrap' ? ' wrap' : '');
    }
    if (s.display.startsWith('inline')) return 'inline';
    return 'block';
  };

  /* ---------- structural membership ---------- */
  const STRUCTURAL = 'main,nav,header,footer,aside,section,article,form,dialog,table,thead,tbody,tr,th,td,ul,ol,li,h1,h2,h3,h4,h5,h6,button,a,input,select,textarea,label,img,svg,video,iframe,summary,details,[role]';

  /**
   * Every visible, non-noise element with a rendered box. No cleverness about which ones "carry
   * structure".
   *
   * Two earlier attempts both failed the same way. Keeping only semantic tags collapsed a
   * div-soup mockup to 66 nodes against an implementation's 283, and diffing those two is
   * arithmetic over unrelated sets. Promoting only flex/grid ITEMS fixed that and introduced a
   * quieter version of it: a wrapper `div` holding two buttons inside a plain `<td>` was not an
   * item of a flex container, so it never appeared — and that wrapper is exactly the element
   * whose `flex-direction` decides whether the two buttons sit side by side or stacked. The
   * element that determines a layout was the element being filtered out.
   *
   * Any rule that selects which elements are worth recording will keep having this bug, because
   * the axis nobody thought of is always attached to the element nobody selected. So: record
   * them all, and let the diff drop what matches. Volume is not the constraint — the dump goes
   * to disk, and only differences are ever read.
   */
  const carries = (el) => {
    if (cs(el).display === 'contents') return true;   // box-less, but its children render
    const r = el.getBoundingClientRect();
    return r.width > 0 || r.height > 0;
  };

  /* ---------- timing ---------- */
  const settle = (quietMs = 400, timeout = 10000) => new Promise((res) => {
    let timer, done = false;
    const finish = () => { if (done) return; done = true; obs.disconnect(); clearTimeout(timer); clearTimeout(hard); res(); };
    const obs = new W.MutationObserver(() => { clearTimeout(timer); timer = setTimeout(finish, quietMs); });
    obs.observe(D.documentElement, { childList: true, subtree: true, attributes: true, characterData: true });
    timer = setTimeout(finish, quietMs);
    const hard = setTimeout(finish, timeout);
  });

  /**
   * A background tab never fires requestAnimationFrame. Awaiting two frames unconditionally
   * hung the readiness gate forever whenever the capture tab was not foreground — which, when
   * an agent is driving it, is the normal case. Verified: visibilityState is "hidden" and
   * document.hasFocus() is false on a tab driven this way.
   */
  const twoFrames = () => new Promise((res) => {
    let done = false, fired = false;
    const fin = () => { if (!done) { done = true; res(fired); } };
    const timer = setTimeout(fin, 250);
    try {
      W.requestAnimationFrame(() => W.requestAnimationFrame(() => { fired = true; clearTimeout(timer); fin(); }));
    } catch { fin(); }
  });

  window.__grrCore = {
    ctx, cs, t, ownText, hex, normColors, px, fam, lh, ls, box4, border4, radius4,
    contrast, effectiveBg, NOISE, setNoise, isNoise, isVisible, isSrOnly,
    role, accName, resetNameCache, iconHash, anchor, matchKey, domPath, layout, carries,
    LANDMARK, STRUCTURAL, settle, twoFrames,
  };
})();

/* ======================= PART 2 of 2 — axes, records, entry ======================= */
(() => {
  const C = window.__grrCore;
  const { cs, t, ownText, hex, normColors, px, fam, lh, ls, box4, border4, radius4 } = C;
  const { isNoise, isVisible, isSrOnly, role, accName, anchor, matchKey, domPath, layout, carries } = C;
  const { contrast, effectiveBg, settle, twoFrames, LANDMARK } = C;
  const D = () => C.ctx.d;
  const W = () => C.ctx.w;

  const INTERACTIVE = 'button,a[href],input,select,textarea,summary,[role=button],[role=link],[role=tab],[role=menuitem],[role=switch],[role=checkbox],[role=radio],[onclick],[tabindex]:not([tabindex="-1"])';

  /* ---------- token signatures ---------- */
  const typo = (s) => ({
    family: fam(s.fontFamily), size: px(s.fontSize), weight: s.fontWeight,
    lh: lh(s.lineHeight, parseFloat(s.fontSize)), ls: ls(s.letterSpacing),
  });
  const colorSig = (s) => ({ color: hex(s.color), background: hex(s.backgroundColor), border: border4(s) });
  const space = (s) => ({
    padding: box4(s, 'padding'), margin: box4(s, 'margin'),
    gap: s.gap && s.gap !== 'normal' ? s.gap.split(/\s+/).map(px).join(' ') : '0',
    radius: radius4(s),
  });
  const sig = (o) => Object.values(o).join('|');

  /* ---------- repeat collapsing ----------
   * Accessible name belongs in the signature for roles where the name IS the identity, and
   * must stay out of it for roles where it is just data. Including it everywhere stops a
   * 47-row list from collapsing; excluding it everywhere merged three distinct row controls
   * ("위로 이동" / "아래로 이동" / "삭제") into one entry and rewrote every column header to
   * whichever `th` came first. */
  const NAME_IS_IDENTITY = new Set([
    'button', 'link', 'tab', 'columnheader', 'rowheader', 'heading', 'option',
    'menuitem', 'menuitemcheckbox', 'menuitemradio', 'checkbox', 'radio', 'switch',
    'combobox', 'textbox', 'region', 'navigation', 'main', 'banner', 'contentinfo',
    'complementary', 'form', 'dialog', 'search',
  ]);
  /** Columns are positional identities, not repetition. Collapsing the cells inside one row
   *  deletes every column but the first — which silently removed the one cell carrying an
   *  alignment drift, and would erase seven day-columns down to one. Rows repeat; cells do not. */
  const NEVER_COLLAPSE = new Set(['cell', 'gridcell', 'columnheader', 'rowheader']);

  /**
   * Collapse decides whether two siblings are the same thing repeated. Judging that from the
   * sibling's OWN style plus its children's tag:role is not enough: two table rows whose cells
   * differ several levels down produce identical signatures, so the second row collapses into
   * the first and the walk never descends into it. Everything inside it — a wrapper whose
   * flex-direction decides a button layout, a cell that overflows to the left — becomes
   * unreachable, and an element that is never recorded can never appear in a diff.
   *
   * The signature therefore covers the whole subtree: structure, roles, identity-bearing names,
   * and the computed properties that decide layout at every level. Text content is deliberately
   * excluded — 47 rows of different data ARE the same row template, and collapsing them is the
   * point. Memoized, because adjacent-sibling comparison would otherwise rebuild each subtree
   * once per neighbour.
   */
  let sigMemo = new WeakMap();
  const subtreeSig = (el, depth = 0) => {
    // Memoized at EVERY depth. Caching only the top level meant each sibling comparison rebuilt
    // whole subtrees from scratch, which is what turned a four-second extraction into a timeout.
    const hit = sigMemo.get(el);
    if (hit) return hit;
    const s = cs(el);
    const r = role(el);
    const self = [
      el.tagName, r,
      NAME_IS_IDENTITY.has(r) ? accName(el) : '',
      el.colSpan > 1 ? 'cs' + el.colSpan : '', el.rowSpan > 1 ? 'rs' + el.rowSpan : '',
      sig(typo(s)), sig(colorSig(s)),
      s.display, s.flexDirection, s.flexWrap, s.textAlign, s.justifyContent, s.alignItems,
      s.gridTemplateColumns, s.float, s.position,
      box4(s, 'padding'), border4(s),
    ].join('|');
    const kids = depth >= 6 ? '…' : [...el.children]
      .filter((c) => !isNoise(c) && isVisible(c))
      .map((c) => subtreeSig(c, depth + 1)).join(',');
    const out = self + '{' + kids + '}';
    sigMemo.set(el, out);
    return out;
  };
  const repeatSig = (el) => subtreeSig(el, 0);

  /* ---------- unique, order-stable keys ----------
   * Two cells reading "1,234" in different rows produce the same anchor. Sorted into a TSV
   * those lines are byte-identical, so a diff cannot tell which one changed and a count
   * mismatch between sides reads as an unrelated addition. Every element gets an occurrence
   * ordinal, assigned once in document order before any axis runs, so both sides number the
   * same elements the same way. */
  let keyMap = new WeakMap(), keyCount = new Map();
  const keyOf = (el) => {
    let k = keyMap.get(el);
    if (k) return k;
    const base = anchor(el);
    const n = (keyCount.get(base) || 0) + 1;
    keyCount.set(base, n);
    k = n === 1 ? base : base + '§' + n;
    keyMap.set(el, k);
    return k;
  };
  const seedKeys = (d) => {
    keyMap = new WeakMap();
    keyCount = new Map();
    for (const el of d.querySelectorAll('body *')) {
      if (!isNoise(el) && isVisible(el)) keyOf(el);
    }
  };

  /**
   * Visual reading order, banded into rows first.
   *
   * Sorting siblings by raw `top` is wrong for anything inline: baseline alignment gives an
   * <input> and its sibling <span> different `top` values on the same visual line, so a plain
   * top-then-left sort reports every ordinary form as visually reordered. Group elements whose
   * vertical extents substantially overlap into one row, then order within the row by `left`.
   */
  function visualOrder(kids) {
    const boxes = kids.map((el) => ({ el, r: el.getBoundingClientRect() }));
    const byTop = [...boxes].sort((a, b) => a.r.top - b.r.top);
    const rows = [];
    for (const b of byTop) {
      const row = rows[rows.length - 1];
      const shares = row && row.some(({ r }) => {
        const overlap = Math.min(r.bottom, b.r.bottom) - Math.max(r.top, b.r.top);
        return overlap > Math.min(r.height, b.r.height) * 0.5;
      });
      if (shares) row.push(b); else rows.push([b]);
    }
    return rows.flatMap((row) => row.sort((a, b) => a.r.left - b.r.left)).map((x) => x.el);
  }

  /* ---------- structure walk: yields the node list AND the element list in the same order ---------- */
  function structure(root, collapseRepeats) {
    const nodes = [], els = [];
    const walk = (el, depth) => {
      const kids = [...el.children].filter((c) => !isNoise(c) && isVisible(c));
      const visual = visualOrder(kids);
      let i = 0;
      while (i < kids.length) {
        const el2 = kids[i];
        let run = 1;
        if (collapseRepeats && !NEVER_COLLAPSE.has(role(el2))) {
          const s0 = repeatSig(el2);
          while (i + run < kids.length && repeatSig(kids[i + run]) === s0) run++;
        }
        if (carries(el2)) {
          const vi = visual.indexOf(el2);
          nodes.push({
            depth, tag: el2.tagName.toLowerCase(), role: role(el2),
            name: accName(el2).slice(0, 120), layout: layout(cs(el2)),
            key: keyOf(el2), mkey: matchKey(el2), path: domPath(el2),
            repeat: run > 1 ? run : undefined,
            visualOrder: vi !== i ? vi + 1 : undefined,
          });
          els.push(el2);
          walk(el2, depth + 1);            // descend the template instance only
        } else {
          walk(el2, depth);
        }
        i += run;                          // collapsed siblings are represented by the template
      }
    };
    walk(root, 0);
    return { nodes, els };
  }

  /* ---------- pseudo-state rules ----------
   * Verified: a synthetic mouseover does not put an element into :hover, and .focus() does not
   * produce :focus-visible while the tab lacks document focus. Reading the rules out of the
   * stylesheets is the only mechanism that works here, and it is enough — a mockup and an
   * implementation are compared on what the hover state IS, not on watching it happen. */
  const PSEUDO_ONE = /:(focus-visible|focus-within|hover|focus|active|disabled|checked|invalid|indeterminate)\b/;
  const PSEUDO_ALL = /:(focus-visible|focus-within|hover|focus|active|disabled|checked|invalid|indeterminate)\b/g;
  function pseudoIndex() {
    const out = [], seen = new Set();
    const walk = (rules) => {
      for (const r of rules || []) {
        if (r.style && r.selectorText && PSEUDO_ONE.test(r.selectorText)) {
          for (const one of r.selectorText.split(',')) {
            const sel = one.trim();
            const m = sel.match(PSEUDO_ONE);
            if (!m) continue;
            const base = sel.replace(PSEUDO_ALL, '').replace(/::[\w-]+/g, '').trim() || '*';
            const css = normColors(r.style.cssText);
            const k = base + '§' + m[1] + '§' + css;
            if (seen.has(k)) continue;
            seen.add(k);
            out.push({ base, state: m[1], css });
          }
        }
        // CSSStyleRule ALSO exposes .cssRules now that CSS Nesting exists — it is an empty
        // list on a plain rule. Branching on its existence instead of its length treats every
        // ordinary rule as a container and reads no declarations at all, which silently
        // returned zero variables and zero pseudo rules for a whole page.
        if (r.cssRules && r.cssRules.length) walk(r.cssRules);
      }
    };
    for (const sh of D().styleSheets) { try { walk(sh.cssRules); } catch { /* cross-origin */ } }
    return out;
  }

  /* ---------- CSS custom properties ---------- */
  function cssVars() {
    const declared = [], names = new Set();
    const walk = (rules, cond) => {
      for (const r of rules || []) {
        if (r.style) {
          for (const p of r.style) {
            if (!p.startsWith('--')) continue;
            declared.push([r.selectorText || cond || '?', p, t(r.style.getPropertyValue(p))]);
            names.add(p);
          }
        }
        if (r.cssRules && r.cssRules.length) walk(r.cssRules, r.conditionText || r.selectorText || cond);
      }
    };
    for (const sh of D().styleSheets) { try { walk(sh.cssRules, null); } catch { /* cross-origin */ } }

    // The declaration list is NOT the applied value. Recording the last declaration in file
    // order reported a cell font of 17px on a page rendering it at 12px. The computed value on
    // a real element is the cascade winner, and it is also the only reading that sees through
    // @layer, @scope, @media and @supports — verified against all four.
    const scopes = [['root', D().documentElement], ['body', D().body]];
    for (const lm of D().querySelectorAll(LANDMARK)) {
      if (scopes.length >= 10) break;
      if (!isNoise(lm)) scopes.push([lm.getAttribute('role') || lm.tagName.toLowerCase(), lm]);
    }
    const resolved = [];
    for (const [label, el] of scopes) {
      if (!el) continue;
      const s = cs(el);
      for (const n of names) {
        const v = t(s.getPropertyValue(n));
        if (v) resolved.push([label, n, v]);
      }
    }
    return { declared, resolved, count: names.size };
  }

  /* ---------- component inventory ---------- */
  function components() {
    const KINDS = {
      button: 'button,[role=button],input[type=button],input[type=submit],input[type=reset]',
      link: 'a[href],[role=link]',
      input: 'input:not([type=button]):not([type=submit]):not([type=reset]):not([type=checkbox]):not([type=radio])',
      select: 'select,[role=combobox]', checkbox: 'input[type=checkbox],[role=checkbox]',
      radio: 'input[type=radio],[role=radio]', textarea: 'textarea', table: 'table,[role=table],[role=grid]',
      list: 'ul,ol,[role=list]', card: '[class*="card" i],article', badge: '[class*="badge" i],[class*="chip" i],[class*="tag" i]',
      avatar: '[class*="avatar" i]', icon: 'svg', modal: 'dialog[open],[role=dialog],[role=alertdialog]',
      drawer: '[class*="drawer" i],[class*="sheet" i]', tab: '[role=tab]', tooltip: '[role=tooltip]',
      toast: '[role=status],[role=alert]', progress: 'progress,[role=progressbar],[class*="spinner" i]',
    };
    // A component kit that attaches a live region to every control turns `[role=status]` into
    // a count of the buttons on the page. Kinds whose whole point is a visible surface must
    // actually have one.
    const NEEDS_SURFACE = new Set(['toast', 'badge', 'card', 'modal', 'drawer', 'tooltip']);
    const out = {};
    for (const [kind, sel] of Object.entries(KINDS)) {
      let els = [...D().querySelectorAll(sel)].filter((e) => !isNoise(e) && isVisible(e));
      if (NEEDS_SURFACE.has(kind)) els = els.filter((e) => !isSrOnly(e));
      const variants = new Map();
      for (const e of els) {
        const s = cs(e);
        const v = `${hex(s.backgroundColor)}/${hex(s.color)}/${px(s.borderTopWidth)}/${s.fontWeight}`;
        if (!variants.has(v)) variants.set(v, []);
        variants.get(v).push(accName(e).slice(0, 40));
      }
      out[kind] = {
        count: els.length,
        variants: [...variants.entries()].map(([v, names]) => ({ signature: v, count: names.length, examples: names.filter(Boolean).slice(0, 3) })),
      };
    }
    return out;
  }

  /* ---------- tables ---------- */
  function tables() {
    const out = [];
    for (const tb of D().querySelectorAll('table,[role=table],[role=grid]')) {
      if (isNoise(tb) || !isVisible(tb)) continue;
      const s = cs(tb);
      const base = tb.getBoundingClientRect();
      const head = tb.querySelector('thead tr') || tb.querySelector('tr');
      const cells = head ? [...head.children].filter((c) => isVisible(c)) : [];
      out.push({
        key: keyOf(tb),
        // table-layout is the single declaration that decides every column width. Without it
        // a column-width diff has no cause to point at.
        layout: s.tableLayout, collapse: s.borderCollapse, spacing: s.borderSpacing,
        width: Math.round(base.width),
        colgroup: [...tb.querySelectorAll('col')].map((c) => c.getAttribute('width') || c.style.width || cs(c).width),
        columns: cells.map((c) => {
          const r = c.getBoundingClientRect();
          return {
            name: t(c.textContent).slice(0, 40) || accName(c).slice(0, 40),
            x: Math.round(r.left - base.left), w: Math.round(r.width),
            span: c.colSpan > 1 ? c.colSpan : undefined,
            align: cs(c).textAlign,
          };
        }),
        stickyCells: [...tb.querySelectorAll('th,td')].filter((c) => cs(c).position === 'sticky').length,
        rows: tb.querySelectorAll('tr').length,
        spans: [...tb.querySelectorAll('[colspan],[rowspan]')].map((c) => `${keyOf(c)}=${c.colSpan}x${c.rowSpan}`).slice(0, 40),
      });
    }
    return out;
  }

  /* ---------- option sets ----------
   * Option text reached S4 on one side only: invisible inside a real <select>, and swept up as
   * a cell's textContent on a div-grid mockup. Extracting it as its own axis makes both sides
   * report the same thing. */
  function optionSets() {
    const out = [];
    for (const el of D().querySelectorAll('select,datalist,[role=listbox]')) {
      if (isNoise(el)) continue;
      out.push({
        key: keyOf(el),
        values: [...el.querySelectorAll('option,[role=option]')].map((o) => t(o.textContent) || t(o.value)),
      });
    }
    return out;
  }

  /* ---------- copy ----------
   * Kind is derived from role and tag only. Class-name sniffing flipped the same badge between
   * `body` and `error` across the two sides, because class names legitimately differ between a
   * mockup and a component library. */
  function copy() {
    const KIND = (el) => {
      if (/^H[1-6]$/.test(el.tagName)) return 'heading';
      if (el.tagName === 'LABEL') return 'label';
      if (el.tagName === 'OPTION') return 'option';
      if (el.matches('th,[role=columnheader],[role=rowheader]')) return 'columnheader';
      if (el.matches('[role=alert],[aria-live]')) return 'live';
      if (el.matches('[role=tooltip]')) return 'tooltip';
      if (el.matches('button,a,summary,[role=button],[role=link]')) return 'label';
      if (el.matches('small,figcaption,caption')) return 'helper';
      return 'body';
    };
    const out = [];
    for (const el of D().querySelectorAll('*')) {
      if (isNoise(el) || !isVisible(el)) continue;
      if (el.closest('select,datalist,[role=listbox]')) continue;   // owned by the options axis
      const own = ownText(el);
      if (own) out.push({ key: keyOf(el), kind: KIND(el), text: own });
    }
    for (const el of D().querySelectorAll('[placeholder],img[alt],[title]')) {
      if (isNoise(el) || !isVisible(el)) continue;
      const p = t(el.getAttribute('placeholder'));
      if (p) out.push({ key: keyOf(el), kind: 'placeholder', text: p });
      const a = t(el.getAttribute('alt'));
      if (a) out.push({ key: keyOf(el), kind: 'alt', text: a });
      const ti = t(el.getAttribute('title'));
      if (ti) out.push({ key: keyOf(el), kind: 'title', text: ti });
    }
    return out;
  }

  /* ---------- interaction targets ---------- */
  const DESTRUCTIVE = /삭제|지우|제거|해지|탈퇴|승인|반려|거절|결제|구매|주문|전송|발송|제출|초기화|영구|비활성|delete|remove|destroy|deactivate|disable|approve|reject|submit|pay|purchase|checkout|send|reset|revoke|archive|publish|unsubscribe/i;

  function interactives() {
    return [...D().querySelectorAll(INTERACTIVE)]
      .filter((e) => !isNoise(e) && isVisible(e))
      .map((e, i) => ({
        idx: i, key: keyOf(e), mkey: matchKey(e), tag: e.tagName.toLowerCase(), role: role(e),
        name: accName(e).slice(0, 80),
        destructive: DESTRUCTIVE.test(accName(e) + ' ' + (e.className || '') + ' ' + (e.getAttribute('data-action') || '')),
        disabled: e.disabled === true || e.getAttribute('aria-disabled') === 'true',
        expanded: e.getAttribute('aria-expanded') || undefined,
        checked: e.getAttribute('aria-checked') || (e.checked === true ? 'true' : undefined),
        selected: e.getAttribute('aria-selected') || undefined,
        type: e.getAttribute('type') || undefined,
        required: e.required === true || undefined,
        href: e.getAttribute('href') || undefined,
      }));
  }

  /**
   * Visible-element projection. Interaction deltas are set differences over this, never full
   * DOM dumps.
   *
   * The label falls back to the element's OWN text when it has no accessible name. Projecting
   * unnamed text nodes as bare `P|-|` collapses every paragraph on the page into one set entry,
   * so a modal that opens with new body copy produces no delta for that copy — the single most
   * useful thing a trace can find.
   */
  const fingerprint = () => (C.resetNameCache(), [...D().querySelectorAll('*')])
    .filter((e) => !isNoise(e) && isVisible(e) && carries(e))
    .map((e) => `${e.tagName}|${role(e)}|${(accName(e) || ownText(e)).slice(0, 60)}`);

  /* ================= the record stream — the surface the diff runs on ================= */

  /**
   * The catch-all sweep.
   *
   * Everything above this point is a curated field with a readable name, because
   * `align.textAlign right → left` names an edit and `text-align` buried in an alphabetical dump
   * does not. But curation is also a filter, and a filter is how an axis becomes permanently
   * invisible: whatever property nobody thought to list is a property no diff can ever surface.
   * `flex-direction` was exactly that — reachable only as `flex-row` vs `flex-col`, so
   * `row-reverse` read as plain `row`, and `float` was not there at all.
   *
   * So after the curated fields, sweep every remaining computed property. The readable fields
   * still lead; nothing is unreachable behind them.
   */
  const COVERED = new Set([
    'display', 'box-sizing', 'width', 'height', 'min-width', 'max-width', 'min-height',
    'max-height', 'aspect-ratio', 'text-align', 'vertical-align', 'justify-content',
    'align-items', 'align-content', 'align-self', 'justify-self', 'order', 'flex-grow',
    'flex-shrink', 'flex-basis', 'grid-column-start', 'grid-column-end', 'grid-row-start',
    'grid-row-end', 'grid-template-columns', 'grid-auto-flow', 'font-family', 'font-size',
    'font-weight', 'line-height', 'letter-spacing', 'font-style', 'text-transform',
    'text-decoration-line', 'font-variant-numeric', 'white-space', 'word-break',
    'text-overflow', '-webkit-line-clamp', 'color', 'background-color', 'box-shadow',
    'text-shadow', 'outline-width', 'outline-style', 'outline-color', 'outline-offset',
    'row-gap', 'column-gap', 'background-image', 'background-size', 'background-position',
    'background-repeat', 'transform', 'transform-origin', 'opacity', 'filter',
    'backdrop-filter', 'mix-blend-mode', 'position', 'top', 'right', 'bottom', 'left',
    'z-index', 'overflow-x', 'overflow-y', 'cursor', 'transition-property',
    'transition-duration', 'transition-timing-function', 'animation-name', 'object-fit',
  ]);
  /* Properties that restate something already in the dump. Suppressing these is not the same as
   * the curation this sweep exists to undo — none of them can hold a fact of their own:
   *   - logical properties are the physical ones under another name
   *   - `perspective-origin` resolves to the element's own box centre, so it echoes geometry
   *   - the `currentcolor` family resolves to `color`, which is recorded as `color.fg`
   *   - `border-collapse` is recorded once per table in `@table:*`, not once per cell
   * Anything that can differ independently stays in. */
  const ALIAS = new RegExp([
    '^(inline-size|block-size|(min|max)-(inline|block)-size)$',
    '^(inset|padding|margin|border)-(inline|block)',
    '^border-(start|end)-(start|end)-radius$',
    '^overflow-(inline|block)$',
    '^perspective-origin$',
    '^(caret|text-emphasis|column-rule|row-rule|-webkit-text-stroke)-color$',
    '^border-collapse$',
    '^-webkit-(border-|box-align|box-orient|box-direction|text-fill|font-smoothing|locale|rtl-ordering|tap-highlight|user-drag|writing-mode|perspective-origin|transform-origin)',
  ].join('|'));
  const sweptSides = (p) => /^(border-(top|right|bottom|left)-(width|style|color)|(padding|margin)-(top|right|bottom|left)|border-(top-left|top-right|bottom-right|bottom-left)-radius)$/.test(p);

  let BASE = null;
  /** CSS initial values, taken from an element reset with `all: initial`. Document-independent,
   *  so a value equal to it can be suppressed on one side without hiding a difference from the
   *  other — unlike a baseline sampled from the page, where both sides would suppress their own
   *  differing defaults and the difference would vanish. */
  function baseline(d) {
    const probe = d.createElement('div');
    probe.style.cssText = 'all:initial;position:absolute;left:-99999px;top:0';
    d.body.appendChild(probe);
    const s = cs(probe);
    const m = new Map();
    for (const p of s) m.set(p, s.getPropertyValue(p));
    probe.remove();
    return m;
  }

  /**
   * Fields are emitted only when they differ from the CSS initial / uninteresting value. That
   * keeps the dump to what a designer would actually point at, and a one-sided line still
   * reads correctly: the missing side is at the documented default. `dom-spec-schema.md`
   * carries the default table so a lone `+` line stays interpretable.
   */
  function recordsFor(el, node, ps, push) {
    const k = node.key;
    const s = cs(el);
    const r = el.getBoundingClientRect();
    const put = (f, v, dflt) => {
      if (v === undefined || v === null) return;
      const str = String(v);
      if (str === '' || (dflt !== undefined && str === String(dflt))) return;
      push([k, f, str]);
    };

    /* identity */
    put('node.tag', node.tag);
    put('node.role', node.role, '-');
    put('node.name', node.name);
    put('node.depth', node.depth);
    put('node.path', node.path);
    put('node.mkey', node.mkey);
    put('node.repeat', node.repeat);
    put('node.visualOrder', node.visualOrder);

    /* geometry — relative to the enclosing landmark, never to the page. A header one pixel
     * taller on one side would otherwise shift every absolute coordinate below it and turn a
     * whole screen into findings. */
    const lm = el.closest(LANDMARK);
    const base = (lm && lm !== el) ? lm.getBoundingClientRect() : { left: 0, top: 0 };
    put('geom.w', Math.round(r.width));
    put('geom.h', Math.round(r.height));
    put('geom.dx', Math.round(r.left - base.left));
    put('geom.dy', Math.round(r.top - base.top));

    /* box sizing — the declared intent behind the measured width */
    put('box.display', s.display, 'block');
    put('box.boxSizing', s.boxSizing, 'content-box');
    put('box.width', s.width, 'auto');
    put('box.height', s.height, 'auto');
    put('box.minWidth', s.minWidth, '0px');
    put('box.maxWidth', s.maxWidth, 'none');
    put('box.minHeight', s.minHeight, '0px');
    put('box.maxHeight', s.maxHeight, 'none');
    put('box.aspectRatio', s.aspectRatio, 'auto');
    put('box.layout', node.layout, 'block');

    /* alignment and placement — the CAUSE of a geometry difference. Without these a diff can
     * say a cell moved 24px and cannot say that one side is right-aligned and the other is
     * not, so the fix has to be guessed. */
    put('align.textAlign', s.textAlign, 'start');
    put('align.verticalAlign', s.verticalAlign, 'baseline');
    put('align.justifyContent', s.justifyContent, 'normal');
    put('align.alignItems', s.alignItems, 'normal');
    put('align.alignContent', s.alignContent, 'normal');
    put('align.alignSelf', s.alignSelf, 'auto');
    put('align.justifySelf', s.justifySelf, 'auto');
    put('align.order', s.order, '0');
    put('align.flexGrow', s.flexGrow, '0');
    put('align.flexShrink', s.flexShrink, '1');
    put('align.flexBasis', s.flexBasis, 'auto');
    put('align.gridColumn', s.gridColumn, 'auto / auto');
    put('align.gridRow', s.gridRow, 'auto / auto');
    put('align.gridTemplateColumns', s.gridTemplateColumns, 'none');
    put('align.gridAutoFlow', s.gridAutoFlow, 'row');

    /* typography */
    const ty = typo(s);
    put('type.family', ty.family);
    put('type.size', ty.size);
    put('type.weight', ty.weight, '400');
    put('type.lineHeight', ty.lh, 'normal');
    put('type.letterSpacing', ty.ls, '0.00');
    put('type.style', s.fontStyle, 'normal');
    put('type.transform', s.textTransform, 'none');
    put('type.decoration', s.textDecorationLine, 'none');
    put('type.numeric', s.fontVariantNumeric, 'normal');
    put('type.whiteSpace', s.whiteSpace, 'normal');
    put('type.wordBreak', s.wordBreak, 'normal');
    put('type.textOverflow', s.textOverflow, 'clip');
    put('type.lineClamp', s.webkitLineClamp, 'none');

    /* color */
    put('color.fg', hex(s.color));
    put('color.bg', hex(s.backgroundColor), 'transparent');
    put('color.border', border4(s), 'none / none / none / none');
    put('color.shadow', normColors(s.boxShadow), 'none');
    put('color.textShadow', normColors(s.textShadow), 'none');
    // A focus ring drawn in the mockup and absent from the build is invisible to every other
    // axis, because it only exists in the outline properties.
    put('color.outline', s.outlineStyle === 'none' ? 'none' : `${px(s.outlineWidth)}px ${s.outlineStyle} ${hex(s.outlineColor)}`, 'none');
    put('color.outlineOffset', s.outlineOffset, '0px');

    /* spacing */
    const sp = space(s);
    put('space.padding', sp.padding, '0 0 0 0');
    put('space.margin', sp.margin, '0 0 0 0');
    put('space.gap', sp.gap, '0');
    put('space.radius', sp.radius, '0 0 0 0');

    /* visual effects — a gradient header records as a transparent background on every other
     * axis, which is how an entire hero treatment goes missing from a spec. */
    put('vis.backgroundImage', normColors(s.backgroundImage), 'none');
    put('vis.backgroundSize', s.backgroundSize, 'auto');
    put('vis.backgroundPosition', s.backgroundPosition, '0% 0%');
    put('vis.backgroundRepeat', s.backgroundRepeat, 'repeat');
    put('vis.transform', s.transform, 'none');
    // transformOrigin resolves to pixels off the element's own box, so emitting it
    // unconditionally puts a unique, meaningless line on every element on the page.
    if (s.transform !== 'none') put('vis.transformOrigin', s.transformOrigin);
    put('vis.opacity', s.opacity, '1');
    put('vis.filter', s.filter, 'none');
    put('vis.backdropFilter', s.backdropFilter, 'none');
    put('vis.mixBlendMode', s.mixBlendMode, 'normal');
    put('vis.position', s.position, 'static');
    put('vis.inset', s.position === 'static' ? '' : [s.top, s.right, s.bottom, s.left].join(' '), 'auto auto auto auto');
    put('vis.zIndex', s.zIndex, 'auto');
    put('vis.overflowX', s.overflowX, 'visible');
    put('vis.overflowY', s.overflowY, 'visible');
    put('vis.cursor', s.cursor, 'auto');
    put('vis.transition', s.transitionProperty === 'all' && s.transitionDuration === '0s' ? '' : `${s.transitionProperty} ${s.transitionDuration} ${s.transitionTimingFunction}`);
    put('vis.animation', s.animationName, 'none');

    /* measured facts — things no declaration can tell you.
     *
     * Overflow needs three separate checks, not one. `scrollWidth > clientWidth` only sees
     * content that overflows to the RIGHT of its own scroll box; content pushed off the LEFT
     * edge, or a child sticking out of a parent that clips it, produces no scroll extent at all
     * and reads as perfectly fine. "왼쪽이 잘린다" is only visible in the third check. */
    if (el.scrollWidth > el.clientWidth + 1) put('meas.overflowX', el.scrollWidth + '>' + el.clientWidth);
    if (el.scrollHeight > el.clientHeight + 1) put('meas.overflowY', el.scrollHeight + '>' + el.clientHeight);
    const par = el.parentElement;
    if (par && par.nodeType === 1 && !isNoise(par) && s.position !== 'fixed' && s.position !== 'absolute') {
      const pr = par.getBoundingClientRect();
      const pp = cs(par);
      /* Where the element sits INSIDE its parent, as the four gaps from the parent's content
       * box. An absolute coordinate says where the cell is and nothing at all about where the
       * content sits within it: a column can align to 0px on both sides while one side's content
       * is centred and the other's is jammed into the top-left corner, and no x-coordinate check
       * will ever say so. Left ≈ right means horizontally centred; top ≈ bottom, vertically. */
      put('geom.gapInParent', [
        Math.round(r.left - (pr.left + px(pp.borderLeftWidth) + px(pp.paddingLeft))),
        Math.round((pr.right - px(pp.borderRightWidth) - px(pp.paddingRight)) - r.right),
        Math.round(r.top - (pr.top + px(pp.borderTopWidth) + px(pp.paddingTop))),
        Math.round((pr.bottom - px(pp.borderBottomWidth) - px(pp.paddingBottom)) - r.bottom),
      ].join(' '));
      const esc = [];
      if (pr.left - r.left > 1) esc.push('left ' + Math.round(pr.left - r.left));
      if (r.right - pr.right > 1) esc.push('right ' + Math.round(r.right - pr.right));
      if (pr.top - r.top > 1) esc.push('top ' + Math.round(pr.top - r.top));
      if (r.bottom - pr.bottom > 1) esc.push('bottom ' + Math.round(r.bottom - pr.bottom));
      if (esc.length) put('meas.escapesParent', esc.join(' / ') + (cs(par).overflow === 'visible' ? '' : ' (clipped)'));
    }
    const own = ownText(el);
    if (own) {
      // A label that fits on one line in the mockup and wraps to two in the build changes every
      // row height below it. `meas.lines` catches it where the element's children are inline;
      // this catches the rest, where a Range would measure the block children instead.
      const lhpx = parseFloat(s.lineHeight) || parseFloat(s.fontSize) * 1.2;
      if (lhpx > 0 && el.clientHeight > lhpx * 1.5) put('meas.tallerThanOneLine', el.clientHeight + 'px vs line-height ' + Math.round(lhpx));
    }
    if (own) {
      // `ellipsis` in the stylesheet says nothing about whether text is actually being cut.
      put('meas.clipped', (el.scrollWidth > el.clientWidth + 1 && s.overflow !== 'visible') ? 'yes' : '', '');
      // Element.getClientRects() returns ONE rect for a block, whatever the text does inside
      // it. A Range over its contents returns one rect per rendered line, which is the number
      // that decides row height and whether a label wraps on one side only.
      const inlineOnly = [...el.children].every((c) => cs(c).display.startsWith('inline'));
      if (inlineOnly) {
        try {
          const rg = D().createRange();
          rg.selectNodeContents(el);
          const n = rg.getClientRects().length;
          if (n > 1) put('meas.lines', n);
        } catch { /* detached or unsupported */ }
      }
      const fg = hex(s.color), bg = effectiveBg(el);
      if (bg === null) {
        put('meas.contrast', 'not computable (text sits on a gradient, image or translucent fill)');
      } else {
        const cr = contrast(fg, bg);
        if (cr != null) {
          put('meas.contrast', cr + ':1 (' + fg + ' on ' + bg + ')');
          if (cr < 4.5) put('meas.contrastFail', 'below WCAG AA 4.5:1');
        }
      }
    }
    if (el.tagName === 'IMG') {
      put('meas.natural', el.naturalWidth + 'x' + el.naturalHeight);
      put('meas.objectFit', s.objectFit, 'fill');
      if (el.naturalWidth && Math.abs(el.naturalWidth - r.width) / el.naturalWidth > 0.25) {
        put('meas.imgScaled', el.naturalWidth + 'x' + el.naturalHeight + ' -> ' + Math.round(r.width) + 'x' + Math.round(r.height));
      }
      put('attr.src', (el.getAttribute('src') || '').slice(0, 120));
    }

    /* semantics that change behavior */
    put('attr.type', el.getAttribute('type'));
    put('attr.href', el.getAttribute('href'));
    put('attr.disabled', el.disabled === true ? 'true' : el.getAttribute('aria-disabled'));
    put('attr.required', el.required === true ? 'true' : '');
    put('attr.readonly', el.readOnly === true ? 'true' : '');
    put('attr.placeholder', el.getAttribute('placeholder'));
    put('attr.maxlength', el.getAttribute('maxlength'));
    put('attr.min', el.getAttribute('min'));
    put('attr.max', el.getAttribute('max'));
    put('attr.step', el.getAttribute('step'));
    put('attr.inputmode', el.getAttribute('inputmode'));
    put('attr.autocomplete', el.getAttribute('autocomplete'));
    put('attr.colspan', el.colSpan > 1 ? el.colSpan : '');
    put('attr.rowspan', el.rowSpan > 1 ? el.rowSpan : '');
    put('attr.ariaExpanded', el.getAttribute('aria-expanded'));
    put('attr.ariaChecked', el.getAttribute('aria-checked'));
    put('attr.ariaSelected', el.getAttribute('aria-selected'));
    put('attr.ariaCurrent', el.getAttribute('aria-current'));
    put('attr.ariaHidden', el.getAttribute('aria-hidden'));
    put('attr.tabindex', el.getAttribute('tabindex'));
    put('attr.icon', C.iconHash(el));

    /* copy, verbatim */
    if (own) put('text.own', own);

    /* pseudo-state treatments that apply to this element */
    for (const p of ps) {
      let hit = false;
      try { hit = el.matches(p.base); } catch { hit = false; }
      if (hit) push([k, 'ps.' + p.state, normColors(p.css)]);
    }

    /* everything the curated fields didn't name */
    for (const prop of s) {
      if (COVERED.has(prop) || sweptSides(prop) || ALIAS.test(prop)) continue;
      const v = s.getPropertyValue(prop);
      if (!v || (BASE && BASE.get(prop) === v)) continue;
      push([k, 'css.' + prop, normColors(v)]);
    }
  }

  function docRecordsFor(meta, comps, tbls, opts, vars) {
    const R = [];
    const put = (scope, f, v) => { if (v !== undefined && v !== null && String(v) !== '') R.push([scope, f, String(v)]); };
    put('doc', 'title', meta.title);
    put('doc', 'viewport', meta.viewport.w + 'x' + meta.viewport.h + '@' + meta.viewport.dpr);
    put('doc', 'scrollWidth', D().documentElement.scrollWidth);
    put('doc', 'scrollHeight', D().documentElement.scrollHeight);
    put('doc', 'hOverflow', D().documentElement.scrollWidth > W().innerWidth ? 'yes' : 'no');
    put('doc', 'colorScheme', cs(D().documentElement).colorScheme);
    put('doc', 'reducedMotion', W().matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reduce' : 'no-preference');
    put('doc', 'pointerCoarse', W().matchMedia('(pointer: coarse)').matches ? 'coarse' : 'fine');
    put('doc', 'scrollbarWidth', W().innerWidth - D().documentElement.clientWidth);

    for (const [kind, v] of Object.entries(comps)) {
      put('components', kind + '.count', v.count);
      put('components', kind + '.variants', v.variants.length);
    }
    // Value position, never key position — see the file header. A design system whose tokens
    // are named `--*-token-*` comes back redacted the moment these become object keys.
    for (const [sel, name, value] of vars.declared) R.push(['cssvar.declared', name, value + '   @' + sel]);
    for (const [scope, name, value] of vars.resolved) R.push(['cssvar.applied', name, value + '   @' + scope]);

    for (const tb of tbls) {
      put('table:' + tb.key, 'layout', tb.layout);
      put('table:' + tb.key, 'collapse', tb.collapse);
      put('table:' + tb.key, 'spacing', tb.spacing);
      put('table:' + tb.key, 'width', tb.width);
      put('table:' + tb.key, 'rows', tb.rows);
      put('table:' + tb.key, 'stickyCells', tb.stickyCells);
      put('table:' + tb.key, 'colgroup', tb.colgroup.join(' | '));
      tb.columns.forEach((c, i) => put('table:' + tb.key, 'col' + (i + 1), `${c.name} x=${c.x} w=${c.w} align=${c.align}${c.span ? ' span=' + c.span : ''}`));
      tb.spans.forEach((sp, i) => put('table:' + tb.key, 'span' + (i + 1), sp));
    }
    return R;
  }

  /* ---------- readiness ---------- */
  async function ready({ quietMs = 500, timeout = 20000 } = {}) {
    const report = {
      fontsReady: false, fallbackFonts: [], quiet: false, animationsSettled: false,
      visibility: D().visibilityState, hasFocus: D().hasFocus(), rafFired: false,
    };
    try { await Promise.race([D().fonts.ready, new Promise((r) => setTimeout(r, 8000))]); report.fontsReady = true; } catch { /* no font API */ }
    report.rafFired = await twoFrames();
    await settle(quietMs, timeout);
    report.quiet = true;
    const anims = (D().getAnimations ? D().getAnimations() : []).filter((a) => a.playState === 'running');
    await Promise.race([
      Promise.allSettled(anims.map((a) => a.finished)),
      new Promise((r) => setTimeout(r, 3000)),
    ]);
    report.animationsSettled = true;
    // A family that never loaded silently rewrites every typography row. Surface it.
    const wanted = new Set();
    for (const el of D().querySelectorAll('body *')) {
      if (isVisible(el)) wanted.add(fam(cs(el).fontFamily));
      if (wanted.size > 12) break;
    }
    for (const f of wanted) {
      try { if (f && !D().fonts.check(`16px "${f}"`)) report.fallbackFonts.push(f); } catch { /* ignore */ }
    }
    return report;
  }

  /** Reveal lazy-loaded / IntersectionObserver / virtualized content before extracting. */
  async function sweep({ step = 0.8, max = 40 } = {}) {
    const w = W(), d = D();
    const y0 = w.scrollY;
    let passes = 0, lastH = -1;
    while (passes < max) {
      const H = d.documentElement.scrollHeight;
      if (H === lastH && w.scrollY + w.innerHeight >= H - 2) break;
      lastH = H;
      w.scrollTo(0, Math.min(w.scrollY + w.innerHeight * step, H));
      await settle(350, 4000);
      passes++;
    }
    w.scrollTo(0, y0);
    await settle(300, 3000);
    return { passes, finalHeight: d.documentElement.scrollHeight };
  }

  /* ---------- entry point ---------- */
  async function extract(opts = {}) {
    const { noiseSelectors = [], collapseRepeats = true } = opts;
    C.setNoise(noiseSelectors);
    const w = W(), d = D();
    // Ordinals must be handed out in document order before any axis asks for a key, or the
    // structure walk and the copy walk would number duplicate anchors differently.
    C.resetNameCache();
    seedKeys(d);
    BASE = baseline(d);
    sigMemo = new WeakMap();   // layout changes between viewports; a stale signature would collapse rows that no longer match
    const meta = {
      url: w.location.href, title: d.title,
      viewport: { w: w.innerWidth, h: w.innerHeight, dpr: w.devicePixelRatio },
      extractedBy: 'extract-dom-spec.js', collapseRepeats,
      noiseSelectors,
    };
    const { nodes, els } = structure(d.body, collapseRepeats);
    const ps = pseudoIndex();
    const comps = components();
    const tbls = tables();
    const vars = cssVars();

    const records = [];
    const push = (triple) => records.push(triple);
    for (let i = 0; i < els.length; i++) recordsFor(els[i], nodes[i], ps, push);

    // A mockup with no semantic markup at all can still collapse to a fraction of the live
    // tree. Emitting the ratio makes that visible before anyone diffs against it, instead of
    // after, as several hundred phantom findings.
    const visibleCount = [...d.querySelectorAll('body *')].filter((e) => !isNoise(e) && isVisible(e)).length;
    const health = {
      structuralNodes: nodes.length,
      visibleElements: visibleCount,
      ratio: visibleCount ? Math.round((nodes.length / visibleCount) * 100) / 100 : 0,
      collapsed: visibleCount > 40 && nodes.length / visibleCount < 0.15,
      pseudoRules: ps.length,
      cssVarNames: vars.count,
    };

    return {
      meta, health,
      s1_structure: nodes,
      s2_components: comps,
      s3_cssVars: { declared: vars.declared, applied: vars.resolved },
      s4_copy: copy(),
      s5_interactives: interactives(),
      s6_states: null,                   // filled by the caller per live-capture-protocol.md
      s7_responsive: null,               // filled by responsive()
      s8_tables: tbls,
      s9_options: optionSets(),
      records,
      docRecords: docRecordsFor(meta, comps, tbls, opts, vars),
    };
  }

  /* ---------- the diff surface ---------- */
  const esc = (v) => String(v).replace(/[\t\r\n]+/g, ' ');
  function tsv(spec) {
    const lines = [];
    for (const [k, f, v] of spec.records) lines.push(esc(k) + '\t' + f + '\t' + esc(v));
    for (const [k, f, v] of spec.docRecords) lines.push('@' + esc(k) + '\t' + f + '\t' + esc(v));
    for (const c of spec.s4_copy) lines.push(esc(c.key) + '\tcopy.' + c.kind + '\t' + esc(c.text));
    for (const o of spec.s9_options) lines.push(esc(o.key) + '\toptions\t' + esc(o.values.join(' | ')));
    lines.sort();
    return lines.join('\n');
  }

  /* ---------- responsive ----------
   * resize_window returns success and changes nothing when the window is maximized — verified
   * twice, at 1024x800 and 700x600, with innerWidth staying at 1920 both times. A same-origin
   * iframe is a real viewport: media queries evaluate against ITS width, computed styles flip,
   * geometry measures inside it, and the parent window is untouched, so the responsive pass no
   * longer has to run sequentially across screens.
   *
   * The iframe inherits cookies, session and localStorage from the parent origin, which is what
   * makes an authenticated route reachable — and also means any persisted UI state (a view
   * toggle, a density setting) is inherited too. Assert that state via opts.prepare; do not
   * assume it. */
  async function responsive(widths = [375, 768, 1440], opts = {}) {
    const d = D();
    const url = opts.url || W().location.href;
    const results = [];
    for (const width of widths) {
      d.querySelectorAll('iframe[data-grr-probe]').forEach((f) => f.remove());
      const f = d.createElement('iframe');
      f.setAttribute('data-grr-probe', '1');
      // On-screen and on top deliberately. An off-screen iframe suppresses IntersectionObserver
      // in Chrome, so lazy content never loads and a narrow viewport reads as half-empty. The
      // capture tab is dedicated to this, so covering it for a few seconds costs nothing.
      f.style.cssText = `position:fixed;left:0;top:0;z-index:2147483647;border:0;background:#fff;width:${width}px;height:${opts.height || 900}px`;
      f.src = url;
      d.body.appendChild(f);
      const event = await Promise.race([
        new Promise((r) => { f.onload = () => r('load'); }),
        new Promise((r) => setTimeout(() => r('timeout'), opts.loadTimeout || 20000)),
      ]);
      let cd = null;
      try { cd = f.contentDocument; } catch { cd = null; }
      if (!cd || !cd.body) {
        results.push({ width, event, error: 'framing refused (X-Frame-Options / CSP frame-ancestors) or cross-origin — S7 not measurable for this target' });
        f.remove();
        continue;
      }
      C.ctx.set(cd, f.contentWindow);
      try {
        if (opts.prepare) await opts.prepare(f.contentWindow, cd);
        const rep = await ready(opts.readyOpts);
        const sw = await sweep();
        const spec = await extract(Object.assign({}, opts.extractOpts, { noiseSelectors: opts.noiseSelectors || [] }));
        results.push({ width, event, ready: rep, sweep: sw, spec, tsv: tsv(spec) });
      } finally {
        C.ctx.reset();
      }
      f.remove();
    }
    return results;
  }

  /* ---------- hand the spec to disk without routing it through the model ----------
   * A full record dump is hundreds of kilobytes. Returning it through the tool result would
   * put it in the agent's context, which is exactly the reading-and-skimming this rewrite
   * exists to eliminate. POST it to the local spec server instead and let `diff` do the work
   * on disk. */
  async function upload(server, name, body) {
    const url = String(server).replace(/\/+$/, '') + '/__spec/' + encodeURIComponent(name);
    const r = await fetch(url, { method: 'POST', mode: 'cors', headers: { 'content-type': 'text/plain;charset=utf-8' }, body });
    return { ok: r.ok, status: r.status, bytes: body.length, url };
  }

  window.__grrSpec = {
    ready, sweep, extract, tsv, upload, responsive, fingerprint, settle, interactives,
    anchor, accName, matchKey, isVisible, isNoise, pseudoIndex, cssVars, tables, optionSets,
  };
  return { injected: true, href: location.href, parts: 2 };
})();
