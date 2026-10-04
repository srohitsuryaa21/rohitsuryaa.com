import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { createField, fitName } from './field';

gsap.registerPlugin(ScrollTrigger, SplitText);

const root = document.documentElement;
const $ = <T extends Element = HTMLElement>(s: string, p: ParentNode = document) => p.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, p: ParentNode = document) => Array.from(p.querySelectorAll<T>(s));
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer: fine)').matches;

/* ───── Always-on utilities ───── */
function setupCopy() {
  const btn = $<HTMLButtonElement>('#copy-email');
  const status = $('#copy-status');
  if (!btn || !status) return;
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.email ?? '');
      status.textContent = btn.dataset.copied ?? 'Copied ✓';
    } catch {
      status.textContent = btn.dataset.fail ?? 'Press Ctrl+C to copy';
      const range = document.createRange();
      const email = $('.email');
      if (email) { range.selectNodeContents(email); getSelection()?.removeAllRanges(); getSelection()?.addRange(range); }
    }
    setTimeout(() => (status.textContent = ''), 2400);
  });
}

function setupClock() {
  const el = $('#local-time');
  if (!el) return;
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });
  const tick = () => (el.textContent = fmt.format(new Date()));
  tick();
  setInterval(tick, 30_000);
}

/* Work row: counter, progress rail, rolodex of project names and arrow buttons, shared by both modes */
let workIdx = 0;
let workJump: ((idx: number) => void) | null = null;
// where each card sits along the row (0..1); the last few can't reach the left edge, so they share the final stretch
function cardStops(panels: HTMLElement[], distance: number) {
  const n = panels.length;
  const raw = panels.map((p) => (p.offsetLeft - panels[0].offsetLeft) / (distance || 1));
  const f = Math.max(1, raw.findIndex((v) => v >= 1));
  if (raw[f] === undefined || raw[f] < 1) return raw;
  return raw.map((v, k) => (k < f ? v : raw[f - 1] + ((1 - raw[f - 1]) * (k - f + 1)) / (n - f)));
}
// progress along the row as a fractional card position, so the rolodex turns smoothly between cards
function fracIndex(p: number, stops: number[]) {
  if (p <= stops[0]) return 0;
  for (let k = 0; k < stops.length - 1; k++) {
    if (p <= stops[k + 1]) return k + (p - stops[k]) / (stops[k + 1] - stops[k] || 1);
  }
  return stops.length - 1;
}
// elements and the wheel's row height are looked up once, not on every frame (reading a size
// right after moving the cards would force the browser to lay the page out again each frame)
const wk = { ready: false, count: null as HTMLElement | null, rail: null as HTMLElement | null, btns: [] as HTMLButtonElement[], items: [] as HTMLElement[], row: 0, idx: -1 };
function workCache() {
  wk.count = $('.work-count');
  wk.rail = $('.work-rail i');
  wk.btns = $$<HTMLButtonElement>('.work-btn');
  wk.items = $$('.work-list.is-wheel li');
  wk.row = wk.items[0]?.offsetHeight ?? 0;
  wk.ready = true;
}
function workState(pos: number, n: number, progress: number) {
  if (!wk.ready) workCache();
  const idx = Math.round(pos);
  workIdx = idx;
  if (idx !== wk.idx) {
    wk.idx = idx;
    if (wk.count) wk.count.textContent = String(idx + 1).padStart(2, '0');
    wk.btns.forEach((b) => { b.disabled = Number(b.dataset.dir) < 0 ? idx === 0 : idx === n - 1; });
    wk.items.forEach((li, i) => li.classList.toggle('is-active', i === idx));
  }
  if (wk.rail) wk.rail.style.transform = `scaleX(${Math.max(1 / n, progress)})`;
  wk.items.forEach((li, i) => {
    const d = i - pos, a = Math.abs(d);
    if (a > 3.6) { if (li.style.visibility !== 'hidden') li.style.visibility = 'hidden'; return; }
    li.style.transform = `translate3d(0,${(d * wk.row).toFixed(1)}px,0) scale(${(1 - Math.min(2.6, a) * 0.07).toFixed(3)})`;
    li.style.opacity = String(Math.max(0, 1 - a * 0.3).toFixed(3));
    li.style.visibility = a > 2.6 ? 'hidden' : 'visible';
  });
}
addEventListener('resize', () => { wk.ready = false; });
function setupWorkRow() {
  const view = $('.work-viewport');
  const panels = $$('.work-track .panel');
  if (!view || !panels.length) return;
  const n = panels.length;
  $('.work-list')?.classList.add('is-wheel');
  const update = () => {
    if (root.classList.contains('motion-h')) return;
    const max = view.scrollWidth - view.clientWidth;
    const p = max > 0 ? view.scrollLeft / max : 1;
    workState(fracIndex(p, cardStops(panels, max)), n, p);
  };
  // desktop scrolls the page (workJump), everywhere else the row itself scrolls
  const go = (idx: number) => {
    idx = gsap.utils.clamp(0, n - 1, idx);
    if (root.classList.contains('motion-h') && workJump) return workJump(idx);
    const max = view.scrollWidth - view.clientWidth;
    view.scrollTo({ left: cardStops(panels, max)[idx] * max, behavior: reduced ? 'auto' : 'smooth' });
  };
  view.addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  $$<HTMLButtonElement>('.work-btn').forEach((b) => b.addEventListener('click', () => go(workIdx + Number(b.dataset.dir))));
  $$<HTMLAnchorElement>('.work-list a').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    go(Number(a.dataset.index));
  }));
  update();
}

/* Experience: on wide screens the entries alternate sides of one flowing S shaped line.
   A faint copy of the line runs through every dot; the orange line and a glowing point travel along it as you scroll. */
const zig = { total: 0, cum: [] as number[], lit: null as SVGPathElement | null, base: null as SVGPathElement | null, head: null as SVGPathElement | null };
function zigAt(len: number) {
  if (!zig.base || !zig.lit || !zig.head || !zig.total) return;
  zig.lit.style.strokeDashoffset = String(zig.total - len);
  // the arrow sits at the tip of the drawn line and turns to follow the curve
  const pt = zig.base.getPointAtLength(len);
  const a = zig.base.getPointAtLength(Math.max(0, len - 2)), b = zig.base.getPointAtLength(Math.min(zig.total, Math.max(len, 2)));
  const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
  zig.head.setAttribute('transform', `translate(${pt.x} ${pt.y}) rotate(${angle})`);
}
function setupZigzag() {
  const tl = $('.timeline');
  const items = $$('.timeline > li');
  if (!tl || items.length < 2) return;
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('class', 'timeline-zig');
  svg.setAttribute('aria-hidden', 'true');
  zig.base = document.createElementNS(ns, 'path');
  zig.base.setAttribute('class', 'zig-base');
  zig.lit = document.createElementNS(ns, 'path');
  zig.lit.setAttribute('class', 'zig-lit');
  zig.head = document.createElementNS(ns, 'path');
  zig.head.setAttribute('class', 'zig-head');
  zig.head.setAttribute('d', 'M-8 -8 L9 0 L-8 8 L-4 0 Z');
  svg.append(zig.base, zig.lit, zig.head);
  tl.prepend(svg);
  // the line runs on past the last entry: the story isn't finished
  const more = document.createElement('span');
  more.className = 'zig-more mono';
  more.textContent = tl.dataset.more ?? '';
  more.setAttribute('aria-hidden', 'true');
  tl.append(more);
  tl.classList.add('zig-ready');
  const draw = () => {
    if (!matchMedia('(min-width: 900px)').matches) return;
    svg.setAttribute('viewBox', `0 0 ${tl.clientWidth} ${tl.clientHeight}`);
    // each entry's dot: on the left edge of entries 1 and 3, on the right edge of entry 2 (its text sits on the other side)
    const pts = items.map((li, i) => [i % 2 ? li.offsetLeft + li.offsetWidth - 6.5 : li.offsetLeft + 6.5, li.offsetTop + 12.5]);
    // where each entry's content ends (the space below it is the gap to the next one)
    const ends = items.map((li) => li.offsetTop + li.offsetHeight - parseFloat(getComputedStyle(li).paddingBottom));
    // run straight down beside the text, swing across the gap in an S bend, then drop onto the next dot
    const step = (i: number) => {
      const [x0] = pts[i], [x1, y1] = pts[i + 1];
      const ya = ends[i] + 10, yb = y1 - 14, ym = (ya + yb) / 2;
      return `L${x0} ${ya} C${x0} ${ym} ${x1} ${ym} ${x1} ${yb} L${x1} ${y1}`;
    };
    const last = pts[pts.length - 1], tailY = tl.clientHeight - 36;
    const tail = `L${last[0]} ${tailY}`;
    more.style.left = `${last[0] + 22}px`;
    more.style.top = `${tailY - 6}px`;
    const d = `M${pts[0].join(' ')} ` + pts.slice(1).map((_, i) => step(i)).join(' ') + ' ' + tail;
    zig.base!.setAttribute('d', d);
    zig.lit!.setAttribute('d', d);
    // path length at each dot, so the scroll can move the point from one entry to the next
    const probe = document.createElementNS(ns, 'path');
    zig.cum = [0];
    for (let i = 0; i < items.length - 1; i++) {
      probe.setAttribute('d', `M${pts[0].join(' ')} ` + pts.slice(1, i + 2).map((_, k) => step(k)).join(' '));
      zig.cum.push(probe.getTotalLength());
    }
    zig.total = zig.base!.getTotalLength();
    zig.cum.push(zig.total);
    zig.lit!.style.strokeDasharray = String(zig.total);
    // without scroll motion the whole line is drawn and the point rests on the last entry
    zigAt(reduced ? zig.total : zigPos());
  };
  draw();
  addEventListener('resize', draw);
  document.fonts.ready.then(draw);
}
// scroll position along the line, set by buildTimeline (segment index + fraction)
let zigT = 0;
function zigPos() {
  const k = Math.min(Math.floor(zigT), zig.cum.length - 2);
  if (k < 0) return 0;
  return zig.cum[k] + (zig.cum[k + 1] - zig.cum[k]) * (zigT - k);
}

/* Numbers: on touch screens (no cursor to carry the note) a tap opens the story behind a number */
function setupNumberNotes() {
  $$('.numbers li').forEach((li) => {
    const btn = $<HTMLButtonElement>('.num-toggle', li);
    if (!btn) return;
    const toggle = () => {
      const open = !li.classList.contains('is-open');
      li.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    };
    btn.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
    // the whole tile is a tap target, not just the small button
    li.addEventListener('click', () => { if (!matchMedia('(pointer: fine)').matches) toggle(); });
  });
}

/* White mode: remembered per visitor; the new theme opens as a circle from the switch */
function setupTheme() {
  const btns = $$<HTMLButtonElement>('[data-theme-toggle]');
  const meta = $<HTMLMetaElement>('meta[name="theme-color"]');
  const label = () => btns.forEach((b) => b.setAttribute('aria-label', (root.dataset.theme === 'light' ? b.dataset.toDark : b.dataset.toLight) ?? ''));
  const apply = (light: boolean) => {
    if (light) root.dataset.theme = 'light'; else delete root.dataset.theme;
    if (meta) meta.content = light ? '#f6f4ef' : '#0d0d0c';
    try { localStorage.setItem('theme', light ? 'light' : 'dark'); } catch { /* private mode */ }
    label();
  };
  label();
  btns.forEach((b) => b.addEventListener('click', (e) => {
    const light = root.dataset.theme !== 'light';
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void> } };
    if (!doc.startViewTransition || reduced || document.hidden) return apply(light);
    const r = b.getBoundingClientRect();
    const x = e.clientX || r.left + r.width / 2, y = e.clientY || r.top + r.height / 2;
    const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const vt = doc.startViewTransition(() => apply(light));
    vt.ready.then(() => {
      root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
        { duration: 750, easing: 'cubic-bezier(.65,0,.35,1)', pseudoElement: '::view-transition-new(root)' });
    }).catch(() => {});
    // if the browser skips the transition, still switch
    vt.finished.catch(() => {}).finally(() => { if ((root.dataset.theme === 'light') !== light) apply(light); });
  }));
}

/* Header: a frosted bar once the page moves, tinted to match the section underneath */
function setupHeader() {
  const header = $('.site-header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  const under = new Map<Element, boolean>();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => under.set(e.target, e.isIntersecting));
    const hit = [...under].filter(([, on]) => on).map(([el]) => el);
    root.classList.toggle('on-accent', hit.some((el) => el.classList.contains('contact')));
    root.classList.toggle('on-light', hit.some((el) => el.classList.contains('light')));
  }, { rootMargin: '-3% 0px -94% 0px' });
  $$('.light, .contact').forEach((el) => io.observe(el));
}

/* Scroll story: whichever step crosses the middle of the screen sets the chart's scene */
function setupStory() {
  const fig = $('.story-fig');
  const steps = $$('.story-step');
  if (!fig || !steps.length) return;
  // the story reel: one segment per scene, filled up to the scene on screen
  const reel = document.createElement('div');
  reel.className = 'story-reel';
  reel.setAttribute('aria-hidden', 'true');
  const segs = steps.map(() => reel.appendChild(document.createElement('i')));
  const count = Object.assign(document.createElement('p'), { className: 'story-reel-n mono' });
  fig.append(reel, count);
  const show = (step: HTMLElement) => {
    const idx = steps.indexOf(step);
    segs.forEach((g, i) => { g.classList.toggle('done', i < idx); g.classList.toggle('now', i === idx); });
    count.innerHTML = `<b>${String(idx + 1).padStart(2, '0')}</b> / ${String(steps.length).padStart(2, '0')}`;
    steps.forEach((s) => s.classList.toggle('is-on', s === step));
    const k = step.dataset.step ?? '';
    fig.dataset.step = k;
    // chart pieces list the steps they belong to
    fig.querySelectorAll<SVGElement>('[data-show]').forEach((el) => el.classList.toggle('is-on', (el.dataset.show ?? '').split(' ').includes(k)));
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) show(e.target as HTMLElement); });
  }, { rootMargin: matchMedia('(max-width: 899px)').matches ? '-74% 0px -24% 0px' : '-48% 0px -48% 0px' });
  steps.forEach((s) => io.observe(s));
  show(steps[0]);
}

setupCopy();
setupTheme();
setupHeader();
setupClock();
setupNumberNotes();
setupStory();
setupZigzag();
setupWorkRow();
const heroName = $('.hero-name');
if (heroName) fitName(heroName);

if (reduced) {
  root.classList.add('reduced', 'loader-done');
  const canvas = $<HTMLCanvasElement>('.hero-field');
  if (canvas) createField(canvas, { animate: false }).setProgress(0.5);
} else if (!$('.hero')) {
  initLite();
} else {
  initMotion();
}

/* Case pages: smooth scroll, cursor and a light entrance */
function initLite() {
  root.classList.add('loader-done');
  const lenis = new Lenis({ lerp: 0.09, anchors: { offset: -40, duration: 1.4 } });
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  if (finePointer) { buildCursor(); buildMagnetic(); }
  buildHeaderHide();
  gsap.from('.case-hero > *', { y: 50, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08 });
  gsap.from('.case-art', { clipPath: 'inset(12% 8% 0% 8% round 22px)', duration: 1.4, ease: 'expo.out', delay: 0.2 });
  gsap.fromTo('.case-art .exhibit-art', { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.case-art', start: 'top bottom', end: 'bottom top', scrub: true } });
  $$('.case-body article, .case-links').forEach((el) => gsap.from(el, { y: 50, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }));
}

/* ───── Motion ───── */
function initMotion() {
  root.classList.add('motion');

  const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop();
  if (!location.hash) { history.scrollRestoration = 'manual'; window.scrollTo(0, 0); }

  // Smooth in-page anchors
  document.addEventListener('click', (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href')!;
    const target = id === '#top' ? 0 : $(id);
    if (target === null) return;
    e.preventDefault();
    lenis.scrollTo(target as number | HTMLElement, { duration: 1.6, easing: (x: number) => 1 - Math.pow(1 - x, 4) });
    if (target instanceof HTMLElement) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });

  const heroChars = new SplitText('.hero-name', { type: 'chars', charsClass: 'char' }).chars;
  const field = createField($<HTMLCanvasElement>('.hero-field')!, { animate: true });

  runLoader(() => {
    root.classList.add('loader-done');
    lenis.start();
  }, heroChars);

  const start = () => {
    // Each section is isolated: a failure in one must never leave the page half-built.
    const steps: [string, () => void][] = [
      ['hero', () => buildHero(field)],
      ['reveals', buildReveals],
      ['work', () => buildWork(lenis)],
      ['cards', buildCards],
      ['timeline', buildTimeline],
      ['headerHide', buildHeaderHide],
      ['network', buildNetwork],
    ];
    if (finePointer) steps.push(['cursor', buildCursor], ['magnetic', buildMagnetic]);
    for (const [name, fn] of steps) {
      try { fn(); } catch (err) { console.error(`[motion] ${name} failed`, err); }
    }
    // pins are created in section order, but other triggers were made first: sort by position before refreshing
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  };
  const fontsReady = Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]);
  fontsReady.then(start);
  addEventListener('load', () => ScrollTrigger.refresh());
}

function runLoader(done: () => void, heroChars: Element[]) {
  const loader = $('.loader');
  gsap.set(heroChars, { yPercent: 105 });
  const reveal = () => gsap.to(heroChars, { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.035 });
  if (!loader) { reveal(); done(); return; }

  let seen = false;
  try { seen = sessionStorage.getItem('rs-seen') === '1'; sessionStorage.setItem('rs-seen', '1'); } catch { /* storage unavailable */ }

  const num = $('.loader-num', loader)!;
  const words = $$('.loader-words span', loader);
  const counter = { v: 0 };
  const dur = seen ? 0.5 : 2.4;
  const tl = gsap.timeline({ onComplete: done });
  tl.to(counter, { v: 100, duration: dur, ease: 'power2.inOut', onUpdate: () => (num.textContent = String(Math.round(counter.v))) }, 0)
    .to('.loader-bar i', { scaleX: 1, duration: dur, ease: 'power2.inOut' }, 0);
  if (!seen) {
    // one word at a time: each fully leaves before the next arrives
    const step = dur / words.length;
    gsap.set(words, { yPercent: 100, opacity: 0 });
    words.forEach((w, i) => {
      tl.fromTo(w, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.28, ease: 'expo.out', immediateRender: false }, i * step);
      if (i < words.length - 1) tl.to(w, { yPercent: -100, opacity: 0, duration: 0.2, ease: 'power2.in' }, (i + 1) * step - 0.2);
    });
  }
  tl.to(loader, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '+=0.1')
    .add(reveal, '-=0.45');
}

function buildHero(field: { setProgress: (p: number) => void }) {
  // Intro: headline and sub line rise in after the loader
  gsap.from('.hero-title > [aria-hidden]', { y: 60, opacity: 0, duration: 1.3, ease: 'expo.out', delay: 0.15 });
  gsap.from('.hero-sub, .hero-legend', { y: 30, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08, delay: 0.4 });
  buildRotator();

  const name = $('.hero-name')!;
  const chars = $$('.char', name);
  const logo = $('.site-header .logo')!;
  const logoRs = $('.logo-rs', logo) ?? logo;
  // "ROHIT SURYAA" split into chars: keep the R (0) and the S (5), fold the rest away mid flight
  const folding = chars.filter((_, i) => i !== 0 && i !== 5);
  const hero = $('.hero')!;

  // Scroll, desktop: the curve settles first, then the big name shrinks and flies into the header logo.
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px) and (min-height: 600px)', () => {
    // geometry of the untransformed name inside the (pinned) hero, and of the logo it lands on
    const geo = () => {
      // offsetLeft/Top are layout values (unaffected by the running transform), relative to offsetParent
      const op = (name.offsetParent as HTMLElement).getBoundingClientRect();
      const hr = hero.getBoundingClientRect();
      const left = op.left - hr.left + name.offsetLeft;
      const top = op.top - hr.top + name.offsetTop;
      const height = name.offsetHeight;
      const lr = logoRs.getBoundingClientRect();
      // match the letter size of the mark, then centre on it vertically
      const scale = (parseFloat(getComputedStyle(logoRs).fontSize) * 1.05) / parseFloat(getComputedStyle(name).fontSize);
      return { x: lr.left - left, y: lr.top + lr.height / 2 - (top + (height * scale) / 2), scale };
    };
    gsap.set(logo, { autoAlpha: 0 });
    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: hero, start: 'top top', end: '+=110%', pin: true, scrub: 0.6, invalidateOnRefresh: true,
        onUpdate: (self) => {
          field.setProgress(self.progress / 0.5);
          root.classList.toggle('signal-found', self.progress > 0.38);
        },
      },
    })
      .to({}, { duration: 0.5 }, 0)
      .to('.hero-legend', { autoAlpha: 0, duration: 0.1 }, 0.45)
      // clear the headline out of the flight path
      .to('.hero-main', { autoAlpha: 0, y: -50, duration: 0.18, ease: 'power2.in' }, 0.5)
      .to(chars, { scaleY: 0.45, transformOrigin: '50% 100%', stagger: { each: 0.012, from: 'center' }, duration: 0.18, ease: 'power2.in' }, 0.48)
      .to(name, {
        x: () => geo().x, y: () => geo().y, scale: () => geo().scale,
        transformOrigin: '0% 0%', duration: 0.42, ease: 'power3.inOut',
      }, 0.52)
      .to(chars, { scaleY: 1, stagger: { each: 0.01, from: 'edges' }, duration: 0.22, ease: 'back.out(2)' }, 0.66)
      // max-width (not width) so letters keep their natural size until they fold, even while the hover changes their weight
      .fromTo(name, { wordSpacing: '0em' }, { wordSpacing: '-0.3em', duration: 0.2, ease: 'power2.inOut', immediateRender: false }, 0.62)
      .fromTo(folding, { maxWidth: '1.2em', opacity: 1 }, { maxWidth: '0em', opacity: 0, stagger: { each: 0.012, from: 'end' }, duration: 0.2, ease: 'power2.inOut', immediateRender: false }, 0.6)
      .to(name, { autoAlpha: 0, duration: 0.06 }, 0.94)
      .to(logo, { autoAlpha: 1, duration: 0.06 }, 0.94);
  });

  // Scroll, phones and short screens: no pin, so the letters squash flat one by one as the hero leaves.
  mm.add('(max-width: 899px), (max-height: 599px)', () => {
    ScrollTrigger.create({
      trigger: hero, start: 'top top', end: 'bottom top',
      onUpdate: (self) => {
        field.setProgress(self.progress * 2.2);
        root.classList.toggle('signal-found', self.progress > 0.35);
      },
    });
    gsap.to(chars, {
      scaleY: 0.15, transformOrigin: '50% 100%', ease: 'none',
      stagger: { each: 0.05, from: 'edges' },
      scrollTrigger: { trigger: name, start: 'top 85%', end: 'bottom top', scrub: true },
    });
  });

  // Hover, fine pointers: letters near the cursor thin out, the rest stay heavy.
  if (finePointer) {
    let px = -9999, py = -9999, raf = 0;
    const update = () => {
      raf = 0;
      for (const c of chars) {
        const r = c.getBoundingClientRect();
        const dx = r.left + r.width / 2 - px, dy = r.top + r.height / 2 - py;
        const k = Math.exp(-(dx * dx + dy * dy) / (2 * 250 * 250));
        gsap.to(c, { '--w': 800 - 600 * k, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
      }
    };
    hero.addEventListener('pointermove', (e) => { px = e.clientX; py = e.clientY; if (!raf) raf = requestAnimationFrame(update); });
    hero.addEventListener('pointerleave', () => { px = py = -9999; if (!raf) raf = requestAnimationFrame(update); });
  }
}

// Cycles the accent word in the headline; the box width follows each word.
function buildRotator() {
  const rot = $('.rotator');
  if (!rot) return;
  const words = $$('.rot-word', rot);
  let i = 0;
  gsap.set(words, { yPercent: 0, opacity: 0 });
  gsap.set(words[0], { opacity: 1 });
  const fit = () => gsap.set(rot, { width: words[i].offsetWidth });
  fit();
  document.fonts?.ready.then(fit);
  const next = () => {
    const cur = words[i];
    i = (i + 1) % words.length;
    const nxt = words[i];
    gsap.timeline()
      .to(cur, { yPercent: -100, opacity: 0, duration: 0.45, ease: 'power3.in' }, 0)
      .fromTo(nxt, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: 'expo.out' }, 0.35)
      .to(rot, { width: nxt.offsetWidth, duration: 0.7, ease: 'expo.inOut' }, 0.15);
  };
  let timer = setInterval(next, 2200);
  document.addEventListener('visibilitychange', () => {
    clearInterval(timer);
    if (!document.hidden) timer = setInterval(next, 2200);
  });
  addEventListener('resize', fit);
}

function buildReveals() {
  // Word-by-word fill on the manifesto
  $$('[data-fill]').forEach((el) => {
    const split = new SplitText(el, { type: 'words', wordsClass: 'word' });
    gsap.fromTo(split.words, { opacity: 0.12 }, {
      opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 40%', scrub: true },
    });
  });

  // Masked line reveals on headings
  $$('[data-split], .work-intro h2, .contact-title, .principles .card h3').forEach((el) => {
    const split = new SplitText(el, { type: 'lines', linesClass: 'split-line', mask: 'lines' });
    gsap.from(split.lines, {
      yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.08,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });

  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 90%', once: true,
    onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09, overwrite: true }),
  });

  // Counters
  $$('.num[data-count]').forEach((el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix ?? '';
    const padTo = Number(el.dataset.pad ?? 0);
    const locale = el.dataset.locale ?? 'en-US';
    const o = { v: 0 };
    const render = () => {
      const n = Math.round(o.v);
      el.textContent = (padTo ? String(n).padStart(padTo, '0') : n.toLocaleString(locale)) + suffix;
    };
    render();
    gsap.to(o, { v: target, duration: 2, ease: 'expo.out', onUpdate: render, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });

  // Portrait: opens from a narrow slit, then drifts with parallax
  gsap.fromTo('.about-portrait-inner', { clipPath: 'inset(18% 30% 18% 30% round 16px)' }, {
    clipPath: 'inset(0% 0% 0% 0% round 16px)', ease: 'power2.out',
    scrollTrigger: { trigger: '.about-portrait', start: 'top 90%', end: 'top 35%', scrub: 0.6 },
  });
  gsap.fromTo('.about-portrait img', { yPercent: -12, scale: 1.25 }, {
    yPercent: 0, scale: 1, ease: 'none',
    scrollTrigger: { trigger: '.about-portrait', start: 'top bottom', end: 'bottom top', scrub: true },
  });

  // Page progress bar
  gsap.to('.scroll-progress i', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
}

function buildWork(lenis: Lenis) {
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px) and (min-height: 600px)', () => {
    root.classList.add('motion-h');
    const track = $('.work-track')!;
    const panels = $$('.work-track .panel');
    const arts = panels.map((p) => $('.panel-art', p));
    const infos = panels.map((p) => $('.panel-info', p));
    const n = panels.length;
    // Coverflow: the current project faces you flat, the others turn and stack to either side like records on a shelf.
    const clamp = gsap.utils.clamp;
    // pos is the card facing you, as a fraction (2.5 = halfway between the third and fourth card)
    const place = (pos: number) => {
      const w = panels[0].offsetWidth;
      panels.forEach((panel, i) => {
        const d = i - pos, a = Math.abs(d), sgn = Math.sign(d), near = Math.min(a, 1), far = Math.max(a - 1, 0);
        // cards well out of view are hidden once and then left alone
        if (a > 3.6) { if (panel.style.visibility !== 'hidden') panel.style.visibility = 'hidden'; return; }
        const x = sgn * (near * w * 0.62 + far * w * 0.16);
        const o = a > 3.4 ? 0 : 1 - far * 0.25;
        panel.style.transform = `translate3d(${x.toFixed(1)}px,0,${(-near * 320 - far * 60).toFixed(1)}px) rotateY(${(-sgn * near * 55).toFixed(2)}deg)`;
        panel.style.opacity = String(o);
        panel.style.zIndex = String(100 - Math.round(a * 10));
        panel.style.visibility = o <= 0.01 ? 'hidden' : 'visible';
        panel.classList.toggle('is-side', a > 0.5);
        // the artwork drifts inside its frame as the card turns
        const art = arts[i];
        if (art) art.style.transform = `translate3d(${(clamp(-2, 2, -d) * 6).toFixed(2)}%,0,0)`;
        // the cards overlap, so only the front one keeps its text
        const info = infos[i];
        if (info) info.style.opacity = String(clamp(0, 1, 1 - a * 1.6));
      });
    };
    place(0);

    // declared before the trigger: it can call onRefresh while being created
    const turn = { pos: 0, target: 0 };
    const flow = ScrollTrigger.create({
      trigger: '.work-pin', start: 'top top', end: () => `+=${(n - 1) * innerHeight * 0.55}`,
      pin: true, invalidateOnRefresh: true,
      snap: { snapTo: 1 / (n - 1), directional: false, duration: { min: 0.25, max: 0.8 }, delay: 0.1, ease: 'power2.inOut' },
      onRefresh: (self) => { wk.ready = false; turn.target = self.progress * (n - 1); place(turn.pos); },
      onUpdate: (self) => { turn.target = self.progress * (n - 1); },
    });
    // one loop, in step with the screen: the cards ease a fixed share of the way to the scroll position each frame,
    // so they glide without starting a new animation on every wheel event, and stop working once they arrive
    const glide = (_t: number, dt: number) => {
      const gap = turn.target - turn.pos;
      if (Math.abs(gap) < 0.0005) {
        if (gap !== 0) { turn.pos = turn.target; place(turn.pos); workState(turn.pos, n, turn.pos / (n - 1)); }
        return;
      }
      turn.pos += gap * (1 - Math.pow(1 - 0.16, dt / 16.67));
      place(turn.pos);
      workState(turn.pos, n, turn.pos / (n - 1));
    };
    gsap.ticker.add(glide);

    // a card at the side comes to the front when clicked, instead of opening
    const onSide = (e: MouseEvent) => {
      const panel = (e.currentTarget as HTMLElement);
      if (!panel.classList.contains('is-side')) return;
      e.preventDefault();
      workJump?.(Number(panel.dataset.index));
    };
    panels.forEach((p) => p.addEventListener('click', onSide, true));

    // the arrows and the rolodex move through the cards by scrolling the page
    workJump = (idx) => lenis.scrollTo(flow.start + (flow.end - flow.start) * (idx / (n - 1)), { duration: 1.2 });

    return () => {
      root.classList.remove('motion-h');
      workJump = null;
      gsap.ticker.remove(glide);
      panels.forEach((p) => p.removeEventListener('click', onSide, true));
      gsap.set([...panels, ...arts, ...infos], { clearProps: 'transform,opacity,visibility,zIndex' });
      panels.forEach((p) => p.classList.remove('is-side'));
      track.style.removeProperty('transform');
    };
  });

  mm.add('(max-width: 899px), (max-height: 599px)', () => {
    gsap.from('.work-track .panel', {
      x: 80, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08,
      scrollTrigger: { trigger: '.work-viewport', start: 'top 85%', once: true },
    });
  });
}

function buildCards() {
  const cards = $$('.card');
  cards.forEach((card, i) => {
    const next = cards[i + 1];
    if (!next) return;
    const st = { trigger: next, start: 'top 85%', end: 'top 35%', scrub: true };
    gsap.to(card, { scale: 0.92 + i * 0.03, rotationX: -6, transformPerspective: 1400, transformOrigin: '50% 0%', ease: 'none', scrollTrigger: st });
    // covered cards drop their content so only a clean edge peeks out behind the next card
    gsap.to(card.children, { opacity: 0, ease: 'none', scrollTrigger: st });
  });
  cards.forEach((card) => {
    const glyph = $('.card-glyph', card);
    if (glyph) gsap.from(glyph.children, { opacity: 0, scale: 0.6, transformOrigin: '50% 50%', stagger: 0.05, duration: 0.8, ease: 'back.out(2)', scrollTrigger: { trigger: card, start: 'top 70%', once: true } });
  });
}

// Phones: the solid header slides away while scrolling down and returns on the way up.
function buildHeaderHide() {
  const header = $('.site-header');
  if (!header) return;
  const mm = gsap.matchMedia();
  mm.add('(max-width: 899px)', () => {
    const st = ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (self) => header.classList.toggle('is-hidden', self.direction === 1 && self.scroll() > 140),
    });
    return () => { st.kill(); header.classList.remove('is-hidden'); };
  });
}


function buildTimeline() {
  // S line: the point glides from one entry's dot to the next between the moments they light up.
  // A heavy scrub makes it trail the scroll a little, so it moves slowly and smoothly.
  const items = $$('.timeline > li');
  // one part per bend, plus the tail after the last entry
  const parts = items.map(() => ({ f: 0 }));
  parts.forEach((part, i) => {
    gsap.to(part, {
      f: 1, ease: 'none',
      scrollTrigger: { trigger: items[i], start: 'top 66%', endTrigger: items[i + 1] ?? '.timeline', end: items[i + 1] ? 'top 66%' : 'bottom 70%', scrub: 1.6 },
      onUpdate: () => { zigT = parts.reduce((sum, q) => sum + q.f, 0); zigAt(zigPos()); },
    });
  });
  gsap.to('.timeline-line i', {
    scaleY: 1, ease: 'none',
    scrollTrigger: { trigger: '.timeline', start: 'top 65%', end: 'bottom 65%', scrub: true },
  });
  $$('.timeline > li').forEach((li) => {
    ScrollTrigger.create({ trigger: li, start: 'top 66%', toggleClass: 'is-active' , end: 'max' });
  });
}

// The toolkit network: pin the section and move a camera down through the layers.
// Edges between two layers draw in as the signal passes; the copy on the left follows the current layer.
function buildNetwork() {
  const section = $('.network');
  const svg = $<SVGSVGElement>('.net-svg');
  if (!section || !svg) return;
  const view = $('.net-view')!;
  const count = $('.net-count b')!;
  const copy = $$('.net-layer');
  const layerGroups = $$('.net-nodes', svg);
  const edgeGroups = $$('.net-edges', svg).map((g) => $$<SVGPathElement>('.edge-lit', g));
  const n = layerGroups.length;
  const top = Number(svg.dataset.top), gap = Number(svg.dataset.gap), vbW = Number(svg.dataset.w);

  root.classList.add('motion-net');
  let current = -1;
  const show = (idx: number) => {
    if (idx === current) return;
    const prev = copy[current];
    current = idx;
    count.textContent = String(idx + 1).padStart(2, '0');
    // the old layer text is gone before the new one arrives, so they never overlap
    copy.forEach((c) => { if (c !== prev && c !== copy[idx]) gsap.set(c, { autoAlpha: 0 }); });
    if (prev) gsap.to(prev, { autoAlpha: 0, y: -20, duration: 0.18, ease: 'power2.in', overwrite: true });
    gsap.fromTo(copy[idx], { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'expo.out', delay: prev ? 0.2 : 0, overwrite: true });
  };

  const render = (f: number) => {
    // camera: keep the travelling layer at the vertical centre of the view
    const scale = svg.clientWidth / vbW;
    const y = view.clientHeight / 2 - (top + f * gap) * scale;
    gsap.set(svg, { y });
    edgeGroups.forEach((paths, i) => {
      const t = gsap.utils.clamp(0, 1, f - i);
      for (const path of paths) path.style.strokeDashoffset = String(1 - t);
    });
    const idx = Math.round(f);
    layerGroups.forEach((g, i) => {
      g.classList.toggle('is-on', i <= f + 0.05);
      g.classList.toggle('is-current', i === idx);
    });
    show(idx);
  };

  const st = ScrollTrigger.create({
    trigger: section, start: 'top top', end: () => `+=${(n - 1) * innerHeight * 0.75}`,
    pin: '.net-pin', scrub: true, invalidateOnRefresh: true,
    snap: { snapTo: 1 / (n - 1), duration: { min: 0.2, max: 0.6 }, delay: 0.1, ease: 'power2.inOut' },
    onUpdate: (self) => render(self.progress * (n - 1)),
    onRefresh: (self) => render(self.progress * (n - 1)),
  });
  render(st.progress * (n - 1));
}

function buildCursor() {
  const cursor = $('.cursor');
  const label = $('.cursor-label');
  if (!cursor || !label) return;
  const xTo = gsap.quickTo(cursor, 'x', { duration: 0.45, ease: 'power3' });
  const yTo = gsap.quickTo(cursor, 'y', { duration: 0.45, ease: 'power3' });
  addEventListener('pointermove', (e) => {
    xTo(e.clientX); yTo(e.clientY);
    cursor.classList.remove('is-hidden');
    // a note opens to the lower right of the pointer, or to the left near the right edge
    cursor.classList.toggle('flip', e.clientX > innerWidth - 340);
  });
  document.addEventListener('pointerleave', () => cursor.classList.add('is-hidden'));
  document.addEventListener('pointerover', (e) => {
    const el = e.target as Element;
    // a short note (the story behind a number) turns the dot into a small card
    const note = el.closest<HTMLElement>('[data-cursor-note]');
    const t = el.closest<HTMLElement>('[data-cursor]');
    if (note) { label.textContent = note.dataset.cursorNote ?? ''; cursor.classList.remove('has-label'); cursor.classList.add('has-note'); }
    else if (t) { label.textContent = t.dataset.cursor ?? ''; cursor.classList.remove('has-note'); cursor.classList.add('has-label'); }
    else cursor.classList.remove('has-label', 'has-note');
  });
}

function buildMagnetic() {
  $$('[data-magnetic]').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.35);
      yTo((e.clientY - r.top - r.height / 2) * 0.35);
    });
    el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });
}
