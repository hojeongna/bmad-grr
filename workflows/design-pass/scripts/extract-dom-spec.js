/**
 * extract-dom-spec.js — deterministic 7-axis DOM spec extractor for design-pass.
 *
 * Injected verbatim into BOTH sides of every comparison (the served mockup and the
 * running app) so the two specs are produced by identical code rather than by two
 * agents' independent judgment. Granularity drift between sides is the failure mode
 * that makes a spec diff worthless; this file exists to remove the possibility.
 *
 * Usage (claude-in-chrome javascript_tool):
 *   1. PASTE this whole file as the call's text once per page load -> defines window.__grrSpec
 *   2. await window.__grrSpec.ready()             -> fonts, hydration, animations settled
 *   3. await window.__grrSpec.sweep()             -> reveal lazy/virtualized content
 *   4. await window.__grrSpec.extract(opts)       -> the spec object (JSON-serializable)
 *   5. window.__grrSpec.fingerprint()             -> visible-element projection, for S5 deltas
 *
 * Paste the contents; do not add a <script src> tag. javascript_tool is extension-injected
 * and ignores the page's CSP, while a script tag created from page context gets blocked by
 * any strict script-src. javascript_tool also has REPL semantics: end each call with the
 * expression you want back — a top-level `return` is a syntax error. This file is an IIFE,
 * so pasting it whole returns its own {injected, href} result.
 *
 * A page reload wipes window.__grrSpec. Re-paste after every navigation and after every
 * interaction trace that resets by reloading.
 *
 * opts:
 *   noiseSelectors  extra CSS selectors to exclude (cookie banners, in-house dev bars)
 *   collapseRepeats collapse runs of structurally identical siblings to template + count
 *                   (default true — a live list with 47 rows is not 47 findings)
 */
(() => {
  const t = (s) => (s || '').trim().replace(/\s+/g, ' ');

  /* ---------- normalization (mirrors data/dom-spec-schema.md) ---------- */

  const hex = (v) => {
    if (!v || v === 'none') return 'none';
    const m = v.match(/rgba?\(([^)]+)\)/);
    if (!m) return v.trim().toLowerCase();
    const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    const a = p.length > 3 ? p[3] : 1;
    if (a === 0) return 'transparent';
    const h = (n) => Math.round(n).toString(16).padStart(2, '0');
    return '#' + h(p[0]) + h(p[1]) + h(p[2]) + (a < 1 ? h(a * 255) : '');
  };
  const px = (v) => Math.round(parseFloat(v) || 0);
  const fam = (v) => (v || '').split(',')[0].replace(/["']/g, '').trim().toLowerCase();
  const lh = (v, fs) => (v === 'normal' ? 'normal' : (parseFloat(v) / fs).toFixed(2));
  const ls = (v) => (v === 'normal' ? '0.00' : (parseFloat(v) || 0).toFixed(2));
  const box = (s, p) => [`${p}Top`, `${p}Right`, `${p}Bottom`, `${p}Left`].map((k) => px(s[k])).join(' ');

  /* ---------- element predicates ---------- */

  const NOISE = [
    'nextjs-portal', '#__next-build-watcher', '[data-nextjs-toast]', '[data-nextjs-dialog-overlay]',
    'vite-error-overlay', '#vite-error-overlay', '#react-refresh-overlay',
    '[id*="webpack-dev-server"]', '#__vconsole', '.tsqd-parent-container',
    '[aria-label*="devtools" i]', '#stagewise-toolbar', '#axe-devtools',
    'script', 'style', 'link', 'meta', 'noscript', 'template',
  ];
  let noiseSel = NOISE.join(',');

  const isNoise = (el) => {
    try { return el.closest(noiseSel) !== null; } catch { return false; }
  };

  const isVisible = (el) => {
    const s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden' || s.visibility === 'collapse') return false;
    if (parseFloat(s.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };

  const IMPLICIT = {
    A: 'link', BUTTON: 'button', NAV: 'navigation', MAIN: 'main', HEADER: 'banner',
    FOOTER: 'contentinfo', ASIDE: 'complementary', FORM: 'form', DIALOG: 'dialog',
    TABLE: 'table', TR: 'row', TD: 'cell', TH: 'columnheader', UL: 'list', OL: 'list',
    LI: 'listitem', IMG: 'img', SELECT: 'combobox', TEXTAREA: 'textbox', PROGRESS: 'progressbar',
    H1: 'heading', H2: 'heading', H3: 'heading', H4: 'heading', H5: 'heading', H6: 'heading',
  };
  // Partial by design — an explicit role= always wins, and '-' is a legitimate answer.
  const role = (el) => {
    const r = el.getAttribute('role');
    if (r) return r;
    if (el.tagName === 'A') return el.hasAttribute('href') ? 'link' : '-';
    if (el.tagName === 'INPUT') {
      const ty = (el.type || 'text').toLowerCase();
      return { checkbox: 'checkbox', radio: 'radio', button: 'button', submit: 'button', reset: 'button', range: 'slider' }[ty] || 'textbox';
    }
    return IMPLICIT[el.tagName] || '-';
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
   * Accessible-name APPROXIMATION. The platform exposes no accessible-name API to page
   * script; this walks the spec's fallback order and stops at the first hit. Treat every
   * value as approximate — a name that matters and looks wrong is worth confirming against
   * CDP Accessibility.getPartialAXTree rather than trusting this.
   */
  const accName = (el) => {
    if (el.getAttribute('aria-label')) return t(el.getAttribute('aria-label'));
    const lb = el.getAttribute('aria-labelledby');
    if (lb) {
      const s = lb.split(/\s+/).map((id) => document.getElementById(id)?.textContent || '').join(' ');
      if (t(s)) return t(s);
    }
    if (el.id) {
      const l = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
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

  const layout = (el) => {
    const s = getComputedStyle(el);
    if (s.display.includes('grid')) return `grid(${s.gridTemplateColumns.split(/\s+/).filter(Boolean).length})`;
    if (s.display.includes('flex')) {
      return (s.flexDirection.startsWith('column') ? 'flex-col' : 'flex-row') + (s.flexWrap === 'wrap' ? ' wrap' : '');
    }
    if (s.display.startsWith('inline')) return 'inline';
    return 'block';
  };

  /* ---------- token signatures ---------- */

  const typo = (s) => ({
    family: fam(s.fontFamily), size: px(s.fontSize), weight: s.fontWeight,
    lineHeight: lh(s.lineHeight, parseFloat(s.fontSize)), letterSpacing: ls(s.letterSpacing),
  });
  const color = (s) => ({
    color: hex(s.color), background: hex(s.backgroundColor),
    border: px(s.borderTopWidth) === 0 ? 'none' : `${px(s.borderTopWidth)}px ${s.borderTopStyle} ${hex(s.borderTopColor)}`,
    shadow: s.boxShadow === 'none' ? 'none' : s.boxShadow.replace(/rgba?\([^)]+\)/g, (m) => hex(m)),
  });
  const space = (s) => ({
    padding: box(s, 'padding'), margin: box(s, 'margin'),
    gap: s.gap && s.gap !== 'normal' ? s.gap.split(/\s+/).map(px).join(' ') : '0',
    radius: px(s.borderTopLeftRadius),
  });
  const sig = (o) => Object.values(o).join('|');

  /* ---------- structure ---------- */

  const STRUCTURAL = 'main,nav,header,footer,aside,section,article,form,dialog,table,thead,tbody,tr,th,td,ul,ol,li,h1,h2,h3,h4,h5,h6,button,a,input,select,textarea,label,img,svg,video,iframe,[role]';
  const INTERACTIVE = 'button,a[href],input,select,textarea,[role=button],[role=link],[role=tab],[role=menuitem],[role=switch],[role=checkbox],[onclick],[tabindex]:not([tabindex="-1"])';

  const carries = (el) => {
    if (el.matches(STRUCTURAL)) return true;
    const own = t([...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(' '));
    return own.length > 0;
  };

  /** Structural signature used to collapse repeated siblings (list rows, cards, chips). */
  const repeatSig = (el) => {
    const s = getComputedStyle(el);
    const kids = [...el.children].slice(0, 8).map((c) => c.tagName + ':' + role(c)).join('>');
    return `${el.tagName}:${role(el)}:${kids}:${sig(typo(s))}:${sig(color(s))}`;
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

  function structure(root, collapseRepeats) {
    const out = [];
    const walk = (el, depth) => {
      const kids = [...el.children].filter((c) => !isNoise(c) && isVisible(c));

      // Visual-vs-DOM order: flag when CSS genuinely reorders siblings. Never normalize this
      // away — it is an accessibility defect on whichever side has it.
      const visual = visualOrder(kids);

      let i = 0;
      while (i < kids.length) {
        const el2 = kids[i];
        let run = 1;
        if (collapseRepeats) {
          const s0 = repeatSig(el2);
          while (i + run < kids.length && repeatSig(kids[i + run]) === s0) run++;
        }
        if (carries(el2)) {
          const vi = visual.indexOf(el2);
          out.push({
            depth, tag: el2.tagName.toLowerCase(), role: role(el2),
            name: accName(el2).slice(0, 120), layout: layout(el2),
            anchor: anchor(el2),
            repeat: run > 1 ? run : undefined,
            visualOrder: vi !== i ? vi + 1 : undefined,
          });
          walk(el2, depth + 1);            // descend the template instance only
        } else {
          walk(el2, depth);
        }
        i += run;                          // collapsed siblings are represented by the template
      }
    };
    walk(root, 0);
    return out;
  }

  /* ---------- the seven axes ---------- */

  function components() {
    const KINDS = {
      button: 'button,[role=button],input[type=button],input[type=submit],input[type=reset]',
      link: 'a[href],[role=link]', input: 'input:not([type=button]):not([type=submit]):not([type=reset]):not([type=checkbox]):not([type=radio])',
      select: 'select,[role=combobox]', checkbox: 'input[type=checkbox],[role=checkbox]',
      radio: 'input[type=radio],[role=radio]', textarea: 'textarea', table: 'table,[role=table]',
      list: 'ul,ol,[role=list]', card: '[class*="card" i],article', badge: '[class*="badge" i],[class*="chip" i],[class*="tag" i]',
      avatar: '[class*="avatar" i]', icon: 'svg', modal: 'dialog,[role=dialog],[role=alertdialog]',
      drawer: '[class*="drawer" i],[class*="sheet" i]', tab: '[role=tab]', tooltip: '[role=tooltip]',
      toast: '[role=status],[role=alert]', progress: 'progress,[role=progressbar],[class*="spinner" i]',
    };
    const out = {};
    for (const [kind, sel] of Object.entries(KINDS)) {
      const els = [...document.querySelectorAll(sel)].filter((e) => !isNoise(e) && isVisible(e));
      const variants = new Map();
      for (const e of els) {
        const s = getComputedStyle(e);
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

  function tokens() {
    const groups = { typography: new Map(), color: new Map(), spacing: new Map() };
    for (const el of document.querySelectorAll('*')) {
      if (isNoise(el) || !isVisible(el) || !carries(el)) continue;
      const s = getComputedStyle(el);
      const a = anchor(el);
      for (const [k, fn] of [['typography', typo], ['color', color], ['spacing', space]]) {
        const v = fn(s), key = sig(v);
        if (!groups[k].has(key)) groups[k].set(key, { ...v, appliesTo: [], count: 0 });
        const g = groups[k].get(key);
        g.count++;
        if (g.appliesTo.length < 4) g.appliesTo.push(a);
      }
    }
    const top = (m) => [...m.values()].sort((a, b) => b.count - a.count);
    return { typography: top(groups.typography), color: top(groups.color), spacing: top(groups.spacing), cssVars: cssVars() };
  }

  // Design tokens at their source, when the page declares them. Far more comparable
  // than per-element computed values when both sides use custom properties.
  function cssVars() {
    const out = {};
    for (const sh of document.styleSheets) {
      let rules;
      try { rules = sh.cssRules; } catch { continue; }   // cross-origin stylesheet
      for (const r of rules || []) {
        if (!r.style) continue;
        for (const p of r.style) if (p.startsWith('--')) out[p] = t(r.style.getPropertyValue(p));
      }
    }
    return out;
  }

  function copy() {
    const KIND = (el) => {
      if (/^H[1-6]$/.test(el.tagName)) return 'heading';
      if (el.tagName === 'LABEL') return 'label';
      if (el.matches('[role=alert],[class*="error" i]')) return 'error';
      if (el.matches('[class*="empty" i]')) return 'empty';
      if (el.matches('[role=tooltip]')) return 'tooltip';
      if (el.matches('[class*="help" i],[class*="hint" i],small')) return 'helper';
      if (el.matches('button,a,[role=button]')) return 'label';
      return 'body';
    };
    const out = [];
    for (const el of document.querySelectorAll('*')) {
      if (isNoise(el) || !isVisible(el)) continue;
      const own = t([...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(' '));
      if (own) out.push({ anchor: anchor(el), kind: KIND(el), text: own });
    }
    for (const el of document.querySelectorAll('[placeholder],img[alt]')) {
      if (isNoise(el) || !isVisible(el)) continue;
      const v = t(el.getAttribute('placeholder') || el.getAttribute('alt'));
      if (v) out.push({ anchor: anchor(el), kind: el.hasAttribute('placeholder') ? 'placeholder' : 'alt', text: v });
    }
    return out;
  }

  /* ---------- interaction support ---------- */

  const DESTRUCTIVE = /삭제|지우|제거|해지|탈퇴|승인|반려|거절|결제|구매|주문|전송|발송|제출|초기화|영구|비활성|delete|remove|destroy|deactivate|disable|approve|reject|submit|pay|purchase|checkout|send|reset|revoke|archive|publish|unsubscribe/i;

  function interactives() {
    return [...document.querySelectorAll(INTERACTIVE)]
      .filter((e) => !isNoise(e) && isVisible(e))
      .map((e, i) => ({
        idx: i, anchor: anchor(e), tag: e.tagName.toLowerCase(), role: role(e),
        name: accName(e).slice(0, 80),
        destructive: DESTRUCTIVE.test(accName(e) + ' ' + (e.className || '') + ' ' + (e.getAttribute('data-action') || '')),
        disabled: e.disabled === true || e.getAttribute('aria-disabled') === 'true',
        href: e.getAttribute('href') || undefined,
      }));
  }

  /**
   * Visible-element projection. S5 deltas are set differences over this, never full DOM dumps.
   *
   * The label falls back to the element's OWN text when it has no accessible name. Projecting
   * unnamed text nodes as bare `P|-|` collapses every paragraph on the page into one set entry,
   * so a modal that opens with new body copy produces no delta for that copy — the single most
   * useful thing a trace can find.
   */
  const fingerprint = () => [...document.querySelectorAll('*')]
    .filter((e) => !isNoise(e) && isVisible(e) && carries(e))
    .map((e) => {
      const own = t([...e.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(' '));
      return `${e.tagName}|${role(e)}|${(accName(e) || own).slice(0, 60)}`;
    });

  /* ---------- timing ---------- */

  function settle(quietMs = 400, timeout = 10000) {
    return new Promise((res) => {
      let timer, done = false;
      const finish = () => { if (done) return; done = true; obs.disconnect(); clearTimeout(timer); clearTimeout(hard); res(); };
      const obs = new MutationObserver(() => { clearTimeout(timer); timer = setTimeout(finish, quietMs); });
      obs.observe(document.documentElement, { childList: true, subtree: true, attributes: true, characterData: true });
      timer = setTimeout(finish, quietMs);
      const hard = setTimeout(finish, timeout);
    });
  }

  /**
   * Readiness gate. A fixed sleep either clips a slow hydration (phantom "missing element"
   * findings) or wastes time on a fast one. Wait on the actual signals instead.
   */
  async function ready({ quietMs = 500, timeout = 20000 } = {}) {
    const report = { fontsReady: false, fallbackFonts: [], quiet: false, animationsSettled: false };
    try { await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 8000))]); report.fontsReady = true; } catch {}
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    await settle(quietMs, timeout);
    report.quiet = true;
    const anims = (document.getAnimations?.() || []).filter((a) => a.playState === 'running');
    await Promise.race([
      Promise.allSettled(anims.map((a) => a.finished)),
      new Promise((r) => setTimeout(r, 3000)),
    ]);
    report.animationsSettled = true;
    // A family that never loaded silently rewrites every typography row. Surface it.
    const wanted = new Set();
    for (const el of document.querySelectorAll('body *')) {
      if (isVisible(el)) wanted.add(fam(getComputedStyle(el).fontFamily));
      if (wanted.size > 12) break;
    }
    for (const f of wanted) {
      if (f && !document.fonts.check(`16px "${f}"`)) report.fallbackFonts.push(f);
    }
    return report;
  }

  /** Reveal lazy-loaded / IntersectionObserver / virtualized content before extracting. */
  async function sweep({ step = 0.8, max = 40 } = {}) {
    const y0 = window.scrollY;
    let passes = 0, lastH = -1;
    while (passes < max) {
      const H = document.documentElement.scrollHeight;
      if (H === lastH && window.scrollY + window.innerHeight >= H - 2) break;
      lastH = H;
      window.scrollTo(0, Math.min(window.scrollY + window.innerHeight * step, H));
      await settle(350, 4000);
      passes++;
    }
    window.scrollTo(0, y0);
    await settle(300, 3000);
    return { passes, finalHeight: document.documentElement.scrollHeight };
  }

  /* ---------- entry point ---------- */

  async function extract(opts = {}) {
    const { noiseSelectors = [], collapseRepeats = true } = opts;
    if (noiseSelectors.length) noiseSel = NOISE.concat(noiseSelectors).join(',');
    return {
      meta: {
        url: location.href, title: document.title,
        viewport: { w: window.innerWidth, h: window.innerHeight, dpr: devicePixelRatio },
        extractedBy: 'extract-dom-spec.js', collapseRepeats,
      },
      s1_structure: structure(document.body, collapseRepeats),
      s2_components: components(),
      s3_tokens: tokens(),
      s4_copy: copy(),
      s5_interactives: interactives(),   // traces are driven from outside; this is the target list
      s6_states: null,                   // filled by the caller per live-capture-protocol.md
      s7_responsive: null,               // filled by re-running extract() at each viewport
    };
  }

  window.__grrSpec = { ready, sweep, extract, fingerprint, settle, interactives, anchor, accName, isVisible, isNoise };
  return { injected: true, href: location.href };
})();
