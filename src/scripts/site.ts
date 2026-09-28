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

setupCopy();
setupClock();
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
  const lenis = new Lenis({ lerp: 0.09 });
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
      ['header', buildHeaderTheme],
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
    const panels = $$('.work-stage .panel');
    const items = $$('.work-list li');
    const links = $$<HTMLAnchorElement>('.work-list a');
    const count = $('.work-count')!;
    const rail = $('.work-rail i')!;
    const n = panels.length;
    const R = 'inset(0% 0% 0% 0% round 18px)';

    const setActive = (idx: number) => {
      items.forEach((li, k) => li.classList.toggle('is-active', k === idx));
      panels.forEach((p, k) => { p.inert = k !== idx; });
      count.textContent = String(idx + 1).padStart(2, '0');
    };
    setActive(0);

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: '.work-pin', start: 'top top', end: () => `+=${(n - 1) * innerHeight * 0.85}`,
        pin: true, scrub: 0.8, invalidateOnRefresh: true,
        snap: { snapTo: 1 / (n - 1), duration: { min: 0.25, max: 0.7 }, delay: 0.08, ease: 'power2.inOut' },
        onUpdate: (self) => {
          gsap.set(rail, { scaleX: self.progress });
          setActive(Math.round(self.progress * (n - 1)));
        },
      },
    });

    gsap.set(panels.slice(1).map((p) => $('.panel-media', p)), { visibility: 'hidden' });
    panels.forEach((panel, i) => {
      if (i === 0) return;
      const prev = panels[i - 1];
      const at = i - 1;
      tl.set($('.panel-media', panel), { visibility: 'visible' }, at);
      // previous project sinks back while the next one wipes up over it
      tl.to($('.panel-media', prev), { scale: 0.9, opacity: 0.25, duration: 1 }, at)
        .to($('.panel-info', prev), { y: -30, opacity: 0, duration: 0.35 }, at)
        .fromTo($('.panel-media', panel), { clipPath: 'inset(100% 0% 0% 0% round 18px)' }, { clipPath: R, duration: 1, ease: 'power2.inOut' }, at)
        .fromTo($('.panel-art', panel), { scale: 1.3, yPercent: 12 }, { scale: 1, yPercent: 0, duration: 1 }, at)
        .fromTo($('.panel-metric', panel), { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5 }, at + 0.45)
        .fromTo($('.panel-info', panel), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, at + 0.55);
    });

    // index links jump straight to their project
    const onClick = (e: MouseEvent) => {
      const a = (e.currentTarget as HTMLElement);
      const st = tl.scrollTrigger;
      if (!st) return;
      e.preventDefault();
      const idx = Number(a.dataset.index);
      lenis.scrollTo(st.start + (st.end - st.start) * (idx / (n - 1)), { duration: 1.2 });
    };
    links.forEach((l) => l.addEventListener('click', onClick));

    return () => {
      root.classList.remove('motion-h');
      links.forEach((l) => l.removeEventListener('click', onClick));
      panels.forEach((p) => { p.inert = false; });
    };
  });

  mm.add('(max-width: 899px), (max-height: 599px)', () => {
    $$('.panel').forEach((panel) => {
      gsap.from($('.panel-media', panel), { clipPath: 'inset(30% 8% 0% 8% round 18px)', duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: panel, start: 'top 90%', once: true } });
      gsap.from($('.panel-info', panel), { y: 40, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: panel, start: 'top 75%', once: true } });
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

function buildHeaderTheme() {
  ScrollTrigger.create({
    trigger: '.contact', start: 'top 40px', end: 'bottom top',
    onToggle: (self) => root.classList.toggle('on-accent', self.isActive),
  });
}

function buildTimeline() {
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
  addEventListener('pointermove', (e) => { xTo(e.clientX); yTo(e.clientY); cursor.classList.remove('is-hidden'); });
  document.addEventListener('pointerleave', () => cursor.classList.add('is-hidden'));
  document.addEventListener('pointerover', (e) => {
    const t = (e.target as Element).closest<HTMLElement>('[data-cursor]');
    if (t) { label.textContent = t.dataset.cursor ?? ''; cursor.classList.add('has-label'); }
    else cursor.classList.remove('has-label');
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
