// "Find the signal": a dot-matrix field that shows a noisy data series which
// settles into a clean fitted curve as `progress` goes from 0 to 1.
// Dots near the pointer light up. Pure 2D canvas, no dependencies.

interface FieldOptions { animate: boolean }

export function createField(canvas: HTMLCanvasElement, { animate }: FieldOptions) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return { setProgress: (_p: number) => {} };

  let w = 0, h = 0, dpr = 1, gap = 26, cols = 0, rows = 0;
  let progress = 0, t = 0, running = false, visible = true, raf = 0;
  const pointer = { x: -9999, y: -9999, active: false };
  let jitter: number[] = [];

  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    gap = w < 700 ? 20 : 26;
    cols = Math.ceil(w / gap) + 1; rows = Math.ceil(h / gap) + 1;
    // stable per-column scatter so the "raw data" reads as measurements, not static
    jitter = Array.from({ length: cols }, (_, i) => ((Math.sin(i * 12.9898) * 43758.5453) % 1));
    draw();
  };

  // y position of the series at column i
  const series = (i: number) => {
    const nx = i / cols;
    const clean = h * 0.7 - h * 0.22 * nx + h * 0.05 * Math.sin(nx * 5.5 + t * 0.5);
    const n = 1 - progress;
    const noise = h * 0.1 * (Math.sin(nx * 37 + t * 1.6) * 0.5 + Math.sin(nx * 71 - t * 2.1) * 0.3 + Math.sin(nx * 13 + t * 0.8) * 0.4);
    return clean + (noise + jitter[i] * h * 0.13) * n * n;
  };

  const draw = () => {
    const ink = document.documentElement.dataset.theme === 'light' ? '13,13,12' : '236,232,223';
    ctx.clearRect(0, 0, w, h);
    const sigma = gap * (0.55 + 1.1 * (1 - progress));
    const twoS2 = 2 * sigma * sigma;
    const pr = w < 700 ? 90 : 130;
    const twoP2 = 2 * pr * pr;

    const hot: [number, number, number, number, number][] = [];
    for (let i = 0; i < cols; i++) {
      const x = i * gap;
      const sy = series(i);
      for (let j = 0; j < rows; j++) {
        const y = j * gap;
        const d = y - sy;
        const k = Math.exp(-(d * d) / twoS2);
        let m = 0;
        if (pointer.active) {
          const dx = x - pointer.x, dy = y - pointer.y;
          m = Math.exp(-(dx * dx + dy * dy) / twoP2);
        }
        if (k < 0.08 && m < 0.08) continue;
        hot.push([x, y, k, m, 0.8 + k * 1.8 + m * 1.2]);
      }
    }
    for (const [x, y, k, m, r] of hot) {
      // signal dots are vermilion, pointer-lit dots are bone
      const a = Math.min(0.9, k * 0.8 + m * 0.35);
      ctx.fillStyle = k >= m ? `rgba(255,77,31,${a})` : `rgba(${ink},${a})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // the fitted line fades in as the noise disappears
    if (progress > 0.35) {
      ctx.strokeStyle = `rgba(255,77,31,${Math.min(0.7, (progress - 0.35) * 1.1)})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i < cols; i++) {
        if (i) ctx.lineTo(i * gap, series(i));
        else ctx.moveTo(0, series(0));
      }
      ctx.stroke();
    }
  };

  const loop = () => {
    raf = 0;
    if (!running) return;
    t += 0.016;
    draw();
    raf = requestAnimationFrame(loop);
  };
  const setRunning = () => {
    const should = animate && visible && !document.hidden;
    if (should === running) return;
    running = should;
    if (running && !raf) raf = requestAnimationFrame(loop);
  };

  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; setRunning(); }).observe(canvas);
  document.addEventListener('visibilitychange', setRunning);
  const host = canvas.parentElement ?? canvas;
  host.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top; pointer.active = true;
    if (!running) draw();
  });
  host.addEventListener('pointerleave', () => { pointer.active = false; if (!running) draw(); });

  resize();
  setRunning();

  return {
    setProgress(p: number) { progress = Math.min(1, Math.max(0, p)); if (!running) draw(); },
  };
}

// Scale the one-line name so it spans the full content width.
export function fitName(el: HTMLElement) {
  const parent = el.parentElement;
  if (!parent) return;
  const fit = () => {
    el.style.fontSize = '100px';
    el.style.width = 'max-content';
    const natural = el.getBoundingClientRect().width;
    el.style.width = '';
    const style = getComputedStyle(parent);
    const target = parent.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    // full width, but never so tall that it pushes the hero past one screen
    const size = Math.min((100 * target) / natural, innerHeight * 0.26);
    el.style.fontSize = `${Math.floor(size * 10) / 10}px`;
  };
  fit();
  new ResizeObserver(fit).observe(parent);
  addEventListener('resize', fit);
  document.fonts?.ready.then(fit);
}
