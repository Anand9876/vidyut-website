import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

const EVENT_DATE = new Date(2027, 0, 16, 0, 0, 0);

const TIMELINE = {
  titleIn: 200,
  frame: 1600,
  titleMove: 3800,
  content: 5400,
  clock: 7800,
};

const STAGE = {
  START: 0,
  TITLE: 1,
  FRAME: 2,
  MOVED: 3,
  CONTENT: 4,
  CLOCK: 5,
};

const COPY_LINES = [
  'WHY VIDYUT IS NUMBER 1',
  'BIGGEST STAGE. BIGGEST CROWD.',
  'COMPETE. PERFORM. DOMINATE.',
];

const ABOUT_TEXT =
  "Vidyut is the No. 1 fest at Amrita Vishwa Vidyapeetham, where music, dance, tech and every talent collide on one electrifying stage. Don't just attend it. Own it.";

const ACCENT = '#ff9a5c';

const clamp01 = value => Math.max(0, Math.min(1, value));

const easeInOut = u =>
  u < 0.5
    ? 4 * u * u * u
    : 1 - Math.pow(-2 * u + 2, 3) / 2;

function getTimeLeft(target) {
  const diff = Math.max(target.getTime() - Date.now(), 0);

  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff / 3600000) % 24,
    minutes: Math.floor(diff / 60000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
  };
}

function useCountdown(target) {
  const [timeLeft, setTimeLeft] = useState(() =>
    getTimeLeft(target)
  );

  useEffect(() => {
    setTimeLeft(getTimeLeft(target));
    const id = setInterval(() => {
      setTimeLeft(getTimeLeft(target));
    }, 1000);
    return () => clearInterval(id);
  }, [target]);

  return timeLeft;
}

function useVisibleGate(rootRef, start) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (start === true) {
      setOpen(true);
      return;
    }
    if (start === false || open) return;
    const timer = setTimeout(() => setOpen(true), 1500);
    return () => clearTimeout(timer);
  }, [start, open]);

  return start === true || open;
}

function usePageReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) setReady(true);
      });
    } else {
      setReady(true);
    }
    return () => {
      cancelled = true;
    };
  }, []);

  return ready;
}

function useIntroStage(onNavbarReady, visible) {
  const pageReady = usePageReady();
  const ready = pageReady && visible;

  const [stage, setStage] = useState(STAGE.START);
  const callbackRef = useRef(onNavbarReady);

  useEffect(() => {
    callbackRef.current = onNavbarReady;
  }, [onNavbarReady]);

  useEffect(() => {
    if (!ready) return undefined;
    const go = next =>
      setStage(current => Math.max(current, next));

    const timers = [
      setTimeout(() => go(STAGE.TITLE), TIMELINE.titleIn),
      setTimeout(() => go(STAGE.FRAME), TIMELINE.frame),
      setTimeout(() => go(STAGE.MOVED), TIMELINE.titleMove),
      setTimeout(() => {
        go(STAGE.CONTENT);
        callbackRef.current?.();
      }, TIMELINE.content),
      setTimeout(() => go(STAGE.CLOCK), TIMELINE.clock),
    ];

    return () => timers.forEach(clearTimeout);
  }, [ready]);

  return stage;
}

function usePageLock() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const prevRoot = root.style.overflow;
    const prevBody = body.style.overflow;
    const prevMargin = body.style.margin;

    // Lock the page only on roomy screens; phones/small windows scroll normally
    const apply = () => {
      const lock = window.innerWidth >= 900 && window.innerHeight >= 800;
      root.style.overflow = lock ? 'hidden' : prevRoot;
      body.style.overflow = lock ? 'hidden' : prevBody;
      body.style.margin = '0';
    };
    apply();
    window.addEventListener('resize', apply);

    return () => {
      window.removeEventListener('resize', apply);
      root.style.overflow = prevRoot;
      body.style.overflow = prevBody;
      body.style.margin = prevMargin;
    };
  }, []);
}

function useTypedBlock(
  lines,
  active,
  speed = 55,
  lineStop = 600,
  startDelay = 500
) {
  const total = lines.reduce(
    (sum, line) => sum + line.length,
    0
  );
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active || count >= total) return undefined;
    let running = 0;
    const boundaries = new Set(
      lines.map(line => (running += line.length))
    );
    let delay = speed;
    if (count === 0) {
      delay = startDelay;
    } else if (boundaries.has(count)) {
      delay = lineStop;
    }

    const timer = setTimeout(() => {
      setCount(c => Math.min(c + 1, total));
    }, delay);

    return () => clearTimeout(timer);
  }, [active, count, total, lines, speed, lineStop, startDelay]);

  let remaining = count;
  let cursorPlaced = false;

  return lines.map((line, index) => {
    const shown = Math.max(
      0,
      Math.min(line.length, remaining)
    );
    remaining -= line.length;
    const isLast = index === lines.length - 1;
    const isActive =
      count < total &&
      !cursorPlaced &&
      (shown < line.length || isLast);

    if (isActive) cursorPlaced = true;

    return {
      text: line.slice(0, shown),
      active: isActive,
    };
  });
}

function useInkAlign(titleRef, copyRef, ready) {
  const [shift, setShift] = useState(0);

  useLayoutEffect(() => {
    if (!ready) return undefined;
    const ctx = document.createElement('canvas').getContext('2d');

    const inkLeft = (el, char, scale = 1) => {
      const cs = getComputedStyle(el);
      ctx.font = `${cs.fontWeight} ${parseFloat(cs.fontSize) * scale}px ${cs.fontFamily}`;
      return -ctx.measureText(char).actualBoundingBoxLeft;
    };

    const measure = () => {
      const title = titleRef.current;
      const para = copyRef.current?.querySelector('p');
      if (!title || !para) return;
      const sc =
        parseFloat(getComputedStyle(title).getPropertyValue('--title-scale')) || 0.72;
      setShift(
        inkLeft(para, COPY_LINES[0][0]) -
          inkLeft(title, 'V', sc)
      );
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [ready, titleRef, copyRef]);

  return shift;
}

function buildFrame(w, h, cy) {
  const m = 12;
  const c = w < 640 ? 18 : 30;
  const nw = Math.min(w * 0.42, 260);
  const nh = 12;
  const cx = w / 2;
  const accent = 26;

  const outline = [
    [m + c, m],
    [cx - nw, m],
    [cx - nw + 16, m + nh],
    [cx + nw - 16, m + nh],
    [cx + nw, m],
    [w - m - c, m],
    [w - m, m + c],
    [w - m, h - m - c],
    [w - m - c, h - m],
    [cx + nw, h - m],
    [cx + nw - 16, h - m - nh],
    [cx - nw + 16, h - m - nh],
    [cx - nw, h - m],
    [m + c, h - m],
    [m, h - m - c],
    [m, m + c],
  ]
    .map(([x, y], i) => `${i ? 'L' : 'M'} ${x} ${y}`)
    .join(' ') + ' Z';

  const corner = (a, b, p, q) =>
    `M ${a} L ${b} L ${p} L ${q}`;

  const accents = [
    corner(
      `${m} ${m + c + accent}`,
      `${m} ${m + c}`,
      `${m + c} ${m}`,
      `${m + c + accent} ${m}`
    ),
    corner(
      `${w - m - c - accent} ${m}`,
      `${w - m - c} ${m}`,
      `${w - m} ${m + c}`,
      `${w - m} ${m + c + accent}`
    ),
    corner(
      `${w - m} ${h - m - c - accent}`,
      `${w - m} ${h - m - c}`,
      `${w - m - c} ${h - m}`,
      `${w - m - c - accent} ${h - m}`
    ),
    corner(
      `${m + c + accent} ${h - m}`,
      `${m + c} ${h - m}`,
      `${m} ${h - m - c}`,
      `${m} ${h - m - c - accent}`
    ),
  ];

  const bars = [];
  for (let i = -2; i <= 2; i += 1) {
    const y = cy + i * 16;
    bars.push(`M ${m + 10} ${y + 9} L ${m + 20} ${y - 9}`);
    bars.push(
      `M ${w - m - 10} ${y + 9} L ${w - m - 20} ${y - 9}`
    );
  }

  const ticks = [];
  for (let i = 0; i < 9; i += 1) {
    const dx = 26 + i * 9;
    const len = i % 4 === 0 ? 8 : 4;
    [-1, 1].forEach(side => {
      const x = cx + side * (nw + dx);
      ticks.push(`M ${x} ${m + 5} L ${x} ${m + 5 + len}`);
      ticks.push(
        `M ${x} ${h - m - 5} L ${x} ${h - m - 5 - len}`
      );
    });
  }

  return {
    outline,
    accents,
    bars: bars.join(' '),
    ticks: ticks.join(' '),
  };
}

function HudFrame({ active }) {
  const frameRef = useRef(null);
  const geometry = useRef({ w: 0 });

  const [size, setSize] = useState({ w: 0, h: 0 });
  const [phase, setPhase] = useState('idle');
  const [detailsOn, setDetailsOn] = useState(false);

  useLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return undefined;
    const update = () => {
      setSize({
        w: el.clientWidth,
        h: el.clientHeight,
      });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const { w, h } = size;
  const ready = w > 0 && h > 0;
  const cx = w / 2;
  const cy =
    typeof window !== 'undefined'
      ? Math.min(h, window.innerHeight) / 2
      : h / 2;

  geometry.current = { w };
  const lines = ready ? buildFrame(w, h, cy) : null;

  useEffect(() => {
    if (!active || !ready) return undefined;
    setPhase('run');
    const start = performance.now();
    let raf = 0;

    const tick = now => {
      const t = now - start;
      const gw = geometry.current.w;
      const u = easeInOut(
        clamp01((t - 100) / 2200)
      );
      const half = (gw / 2) * u;

      if (frameRef.current) {
        frameRef.current.style.clipPath =
          `polygon(${gw / 2 - half}px 0, ${gw / 2 + half}px 0, ` +
          `${gw / 2 + half}px 100%, ${gw / 2 - half}px 100%)`;
      }

      if (t > 2300) {
        setPhase('done');
      } else {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    const detailTimer = setTimeout(() => setDetailsOn(true), 1500);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(detailTimer);
    };
  }, [active, ready]);

  const frameClip =
    phase === 'idle'
      ? {
          clipPath:
            `polygon(${cx}px 0, ${cx}px 0, ${cx}px 100%, ${cx}px 100%)`,
        }
      : phase === 'done'
        ? { clipPath: 'none' }
        : {};

  const fade = {
    opacity: detailsOn ? 1 : 0,
    transition: 'opacity 1200ms ease',
  };

  return (
    <div
      ref={frameRef}
      className="hud-frame"
      style={frameClip}
      aria-hidden="true"
    >
      {ready && (
        <svg
          width={w}
          height={h}
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'visible',
          }}
        >
          <path
            d={lines.outline}
            fill="none"
            stroke="rgba(255,190,140,0.55)"
            strokeWidth="1"
            strokeLinejoin="round"
            style={{
              filter:
                'drop-shadow(0 0 4px rgba(255,110,60,0.55))',
            }}
          />
          {lines.accents.map((d, i) => (
            <path
              key={i}
              d={d}
              pathLength="1"
              fill="none"
              stroke="#ffa35c"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="1"
              strokeDashoffset={detailsOn ? 0 : 1}
              style={{
                filter:
                  'drop-shadow(0 0 6px rgba(255,100,70,0.9))',
                transition:
                  `stroke-dashoffset 1100ms ease ${i * 140}ms`,
              }}
            />
          ))}
          <path
            d={lines.bars}
            fill="none"
            stroke="#ff7ab0"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{
              ...fade,
              filter:
                'drop-shadow(0 0 5px rgba(255,80,140,0.8))',
            }}
          />
          <path
            d={lines.ticks}
            fill="none"
            stroke="rgba(255,225,200,0.55)"
            strokeWidth="1"
            style={fade}
          />
        </svg>
      )}
    </div>
  );
}

/* ---------- 3D Model: "Energy Core" ----------
   Pure Canvas-2D 3D (no WebGL / no libraries) so it runs on every device. */
const PHI = (1 + Math.sqrt(5)) / 2;

function buildIcosphere(radius, detail) {
  const norm = v => {
    const l = Math.hypot(v[0], v[1], v[2]);
    return [(v[0] / l) * radius, (v[1] / l) * radius, (v[2] / l) * radius];
  };
  const verts = [
    [-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0],
    [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
    [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1],
  ].map(norm);
  let faces = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ];
  for (let d = 0; d < detail; d += 1) {
    const cache = {};
    const next = [];
    const mid = (i, j) => {
      const key = i < j ? `${i}_${j}` : `${j}_${i}`;
      if (cache[key] === undefined) {
        const A = verts[i], B = verts[j];
        cache[key] = verts.push(norm([(A[0] + B[0]) / 2, (A[1] + B[1]) / 2, (A[2] + B[2]) / 2])) - 1;
      }
      return cache[key];
    };
    faces.forEach(([i, j, k]) => {
      const ij = mid(i, j), jk = mid(j, k), ki = mid(k, i);
      next.push([i, ij, ki], [j, jk, ij], [k, ki, jk], [ij, jk, ki]);
    });
    faces = next;
  }
  return { verts, faces };
}

const rot3 = (v, rx, ry, rz) => {
  let x = v[0], y = v[1], z = v[2], c, s, t;
  c = Math.cos(rx); s = Math.sin(rx); t = y * c - z * s; z = y * s + z * c; y = t;
  c = Math.cos(ry); s = Math.sin(ry); t = x * c + z * s; z = -x * s + z * c; x = t;
  c = Math.cos(rz); s = Math.sin(rz); t = x * c - y * s; y = x * s + y * c; x = t;
  return [x, y, z];
};

function EnergyCore() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas && canvas.getContext('2d');
    if (!ctx) return undefined;

    const core = buildIcosphere(1.05, 1);
    const shell = buildIcosphere(1.85, 0);
    const shellEdges = [];
    const seen = {};
    shell.faces.forEach(f => {
      [[f[0], f[1]], [f[1], f[2]], [f[2], f[0]]].forEach(([i, j]) => {
        const key = i < j ? `${i}_${j}` : `${j}_${i}`;
        if (!seen[key]) { seen[key] = 1; shellEdges.push([i, j]); }
      });
    });

    const SEG = 72;
    const ringDefs = [
      { r: 2.5, color: '255,163,92', tx: Math.PI / 2.4, ty: 0, speed: 0.7, phase: 0 },
      { r: 2.9, color: '255,122,176', tx: Math.PI / 3, ty: Math.PI / 4, speed: -0.5, phase: 2 },
      { r: 3.3, color: '255,217,168', tx: Math.PI / 1.8, ty: -Math.PI / 5, speed: 0.35, phase: 4 },
    ];
    ringDefs.forEach(d => {
      d.base = Array.from({ length: SEG + 1 }, (_, i) => {
        const a = (i / SEG) * Math.PI * 2;
        return rot3([Math.cos(a) * d.r, Math.sin(a) * d.r, 0], d.tx, d.ty, 0);
      });
    });

    const dust = Array.from({ length: 150 }, () => {
      const r = 2.8 + Math.random() * 1.1;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      return [r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th), r * Math.cos(ph)];
    });

    const st = { rx: 0.25, ry: 0, vy: 0, drag: false, lx: 0, ly: 0, w: 0, h: 0 };
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const D = 8;

    const resize = () => {
      const p = canvas.parentElement;
      const w = p.clientWidth, h = p.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      st.w = w; st.h = h;
    };
    resize();

    let ro = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(resize);
      ro.observe(canvas.parentElement);
    } else {
      window.addEventListener('resize', resize);
    }

    const down = e => {
      st.drag = true; st.lx = e.clientX; st.ly = e.clientY;
      if (canvas.setPointerCapture) { try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ } }
      canvas.style.cursor = 'grabbing';
    };
    const move = e => {
      if (!st.drag) return;
      st.vy = (e.clientX - st.lx) * 0.006;
      st.ry += st.vy;
      st.rx = clamp(st.rx + (e.clientY - st.ly) * 0.006, -1.1, 1.1);
      st.lx = e.clientX; st.ly = e.clientY;
    };
    const up = () => { st.drag = false; canvas.style.cursor = 'grab'; };
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);

    let visible = true;
    let io = null;
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; });
      io.observe(canvas);
    }

    let raf = 0, last = performance.now(), t = 0;

    const frame = now => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!visible || !st.w || !st.h) return;
      t += dt;

      if (!st.drag) {
        st.ry += st.vy + dt * (reduce ? 0.05 : 0.25);
        st.vy *= 0.95;
        st.rx += (0.25 - st.rx) * 0.02;
      }

      const W = st.w, H = st.h, cx = W / 2, cy = H / 2;
      const k = Math.min(W, H) / 7;
      const G = v => rot3(v, st.rx, st.ry, 0);
      const P = v => { const sc = D / (D - v[2]); return [cx + v[0] * k * sc, cy - v[1] * k * sc]; };
      const depthA = z => clamp((z + 3.4) / 6.8, 0, 1);
      const pulse = 1 + Math.sin(t * 2) * 0.04;

      ctx.clearRect(0, 0, W, H);

      // soft glow
      ctx.globalCompositeOperation = 'lighter';
      let g = ctx.createRadialGradient(cx, cy, 0, cx, cy, k * 2.3 * pulse);
      g.addColorStop(0, 'rgba(255,154,92,0.34)');
      g.addColorStop(0.5, 'rgba(255,122,176,0.10)');
      g.addColorStop(1, 'rgba(255,122,176,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(cx, cy, k * 2.3 * pulse, 0, 7); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';

      // transformed geometry
      const shellV = shell.verts.map(G);
      const ringP = ringDefs.map(d => d.base.map(G));
      const sats = ringDefs.map(d => {
        const a = t * d.speed + d.phase;
        return G(rot3([Math.cos(a) * d.r, Math.sin(a) * d.r, 0], d.tx, d.ty, 0));
      });
      const dustP = dust.map(v => G(rot3(v, 0, t * 0.05, 0)));

      const drawLayer = front => {
        // wireframe shell
        ctx.lineWidth = 1;
        shellEdges.forEach(([i, j]) => {
          const A = shellV[i], B = shellV[j], z = (A[2] + B[2]) / 2;
          if ((z >= 0) !== front) return;
          const a = P(A), b = P(B);
          ctx.strokeStyle = `rgba(255,217,168,${0.12 + depthA(z) * 0.4})`;
          ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
        });
        // rings
        ctx.lineWidth = 1.6;
        ringP.forEach((pts, ri) => {
          for (let i = 0; i < SEG; i += 1) {
            const A = pts[i], B = pts[i + 1], z = (A[2] + B[2]) / 2;
            if ((z >= 0) !== front) continue;
            const a = P(A), b = P(B);
            ctx.strokeStyle = `rgba(${ringDefs[ri].color},${0.15 + depthA(z) * 0.75})`;
            ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
          }
        });
        // satellites
        sats.forEach((S, i) => {
          if ((S[2] >= 0) !== front) return;
          const q = P(S), r = k * 0.11 * (D / (D - S[2]));
          ctx.fillStyle = `rgb(${ringDefs[i].color})`;
          ctx.shadowColor = `rgb(${ringDefs[i].color})`;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.moveTo(q[0], q[1] - r); ctx.lineTo(q[0] + r, q[1]);
          ctx.lineTo(q[0], q[1] + r); ctx.lineTo(q[0] - r, q[1]);
          ctx.closePath(); ctx.fill();
          ctx.shadowBlur = 0;
        });
        // embers
        ctx.globalCompositeOperation = 'lighter';
        dustP.forEach(V => {
          if ((V[2] >= 0) !== front) return;
          const q = P(V);
          ctx.fillStyle = `rgba(255,217,168,${0.15 + depthA(V[2]) * 0.6})`;
          ctx.fillRect(q[0], q[1], 1.6, 1.6);
        });
        ctx.globalCompositeOperation = 'source-over';
      };

      drawLayer(false);

      // faceted core (convex -> back-face culling, flat shading)
      const cv = core.verts.map(v => {
        const q = rot3([v[0] * pulse, v[1] * pulse, v[2] * pulse], t * 0.3, t * 0.6, 0);
        return G(q);
      });
      const cp = cv.map(P);
      const L = [0.45, 0.6, 0.66];
      const lm = Math.hypot(L[0], L[1], L[2]);
      const glow = 0.08 + 0.06 * Math.sin(t * 2);
      core.faces.forEach(f => {
        const A = cv[f[0]], B = cv[f[1]], C = cv[f[2]];
        const mx = (A[0] + B[0] + C[0]) / 3, my = (A[1] + B[1] + C[1]) / 3, mz = (A[2] + B[2] + C[2]) / 3;
        const len = Math.hypot(mx, my, mz);
        if (mz <= (len * len) / D) return;
        const I = clamp((mx * L[0] + my * L[1] + mz * L[2]) / (len * lm), 0, 1);
        const rim = 1 - clamp(mz / len, 0, 1);
        const m = Math.pow(I, 0.9) + glow;
        const r = 45 + (255 - 45) * m + 40 * rim * 0.4;
        const gC = 16 + (154 - 16) * m + 30 * rim * 0.3;
        const b = 66 + (92 - 66) * m + 70 * rim * 0.5;
        const col = `rgb(${clamp(r, 0, 255) | 0},${clamp(gC, 0, 255) | 0},${clamp(b, 0, 255) | 0})`;
        const a = cp[f[0]], bq = cp[f[1]], c = cp[f[2]];
        ctx.fillStyle = col;
        ctx.strokeStyle = 'rgba(255,217,168,0.28)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]); ctx.lineTo(bq[0], bq[1]); ctx.lineTo(c[0], c[1]);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      });

      drawLayer(true);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      if (ro) ro.disconnect(); else window.removeEventListener('resize', resize);
      if (io) io.disconnect();
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', up);
      canvas.removeEventListener('pointercancel', up);
    };
  }, []);

  return (
    <div className="model-stage">
      <canvas ref={canvasRef} className="model-canvas" style={{ touchAction: 'pan-y' }} aria-hidden="true" />
    </div>
  );
}

function ChargeUnit({ value, label, max }) {
  const number = Math.max(Number(value) || 0, 0);
  const text = String(number).padStart(2, '0');
  const top = 20 + (1 - Math.min(number / max, 1)) * 60;

  return (
    <div className="flex min-w-0 flex-col items-start">
      <div
        className="timer-num font-goldman"
        role="timer"
        aria-label={`${number} ${label}`}
      >
        <span className="timer-num-outline" aria-hidden="true">
          {text}
        </span>
        <span
          className="timer-num-fill"
          aria-hidden="true"
          style={{ clipPath: `inset(${top}% 0 0 0)` }}
        >
          {text}
        </span>
      </div>
      <div className="timer-label">
        <span className="timer-label-rule" />
        {label}
      </div>
    </div>
  );
}

function SecondRuler({ seconds }) {
  return (
    <div className="second-ruler" aria-hidden="true">
      {Array.from({ length: 60 }, (_, i) => {
        const bg =
          i === seconds
            ? ACCENT
            : i < seconds
              ? 'rgba(255,255,255,0.45)'
              : 'rgba(255,255,255,0.1)';
        return (
          <span
            key={i}
            style={{ width: 1, background: bg, height: i === seconds ? 16 : i % 5 === 0 ? 12 : 6 }}
          />
        );
      })}
    </div>
  );
}

const Cursor = () => (
  <span className="ml-1 animate-pulse" style={{ color: ACCENT }}>▍</span>
);

function HeroScene({ onNavbarReady, start }) {
  const timeLeft = useCountdown(EVENT_DATE);
  const rootRef = useRef(null);
  const titleRef = useRef(null);
  const copyRef = useRef(null);
  const fontsReady = usePageReady();
  const inkShift = useInkAlign(titleRef, copyRef, fontsReady);

  const visible = useVisibleGate(rootRef, start);
  const stage = useIntroStage(onNavbarReady, visible);

  usePageLock();

  const contentOn = stage >= STAGE.CONTENT;
  const typedCopy = useTypedBlock(COPY_LINES, contentOn);
  const moved = stage >= STAGE.MOVED;

  const copyDone = typedCopy.every(
    (line, i) => line.text.length === COPY_LINES[i].length
  );

  const isLive = Object.values(timeLeft).every(
    value => value === 0
  );

  const totalHours =
    timeLeft.days * 24 + timeLeft.hours;

  const clockItems = [
    { label: 'DAYS', value: timeLeft.days, max: 365 },
    { label: 'HOURS', value: timeLeft.hours, max: 24 },
    { label: 'MINS', value: timeLeft.minutes, max: 60 },
    { label: 'SECS', value: timeLeft.seconds, max: 60 },
  ];

  return (
    <main ref={rootRef} className="vidyut-page isolate text-white">
      <style>{STYLES}</style>

      <HudFrame active={stage >= STAGE.FRAME} />

      <div className="page-frame">
        <section className="hero-section">
          <div className="vidyut-canvas">
            <h1
              ref={titleRef}
              className="vidyut-title eagle-lake-regular"
              style={{
                position: 'absolute',
                left: moved ? '0' : '50%',
                marginLeft: moved ? `${inkShift}px` : '0px',
                top: moved ? 'var(--title-offset)' : 'var(--title-start-top, 50%)',
                transformOrigin: 'left top',
                transform: moved
                  ? 'translate(0, 0) scale(var(--title-scale, 0.72))'
                  : 'translate(-50%, -50%) scale(1)',
                zIndex: 50,
                opacity: stage === STAGE.START ? 0 : 1,
                filter: stage === STAGE.START ? 'blur(10px)' : 'blur(0)',
                willChange: 'left, top, transform',
                transition:
                  'left 2400ms cubic-bezier(0.16, 1, 0.3, 1), top 2400ms cubic-bezier(0.16, 1, 0.3, 1), transform 2400ms cubic-bezier(0.16, 1, 0.3, 1), margin-left 2400ms cubic-bezier(0.16, 1, 0.3, 1), opacity 1000ms ease, filter 1000ms ease',
                textShadow: '0 0 45px rgba(255,120,60,0.45)',
              }}
            >
              VIDYUT
            </h1>

            <div className="hero-body">
              <div
                ref={copyRef}
                className="hero-copy"
                style={{
                  opacity: contentOn ? 1 : 0,
                  transform: contentOn
                    ? 'translate3d(0,0,0)'
                    : 'translate3d(0,12px,0)',
                  pointerEvents: contentOn ? 'auto' : 'none',
                }}
              >
                {typedCopy.map((line, i) => (
                  <div key={i} className={`copy-line copy-line-${i + 1}`}>
                    <p>
                      {line.text || ' '}
                      {line.active && <Cursor />}
                    </p>
                  </div>
                ))}

                <div className={`copy-details ${copyDone ? 'is-on' : ''}`}>
                  <p className="copy-blurb">{ABOUT_TEXT}</p>
                </div>
              </div>

              <div
                className="hero-model-wrapper"
                style={{
                  opacity: contentOn ? 1 : 0,
                  transform: contentOn
                    ? 'translate3d(0,0,0) scale(1)'
                    : 'translate3d(0,18px,0) scale(0.985)',
                  pointerEvents: contentOn ? 'auto' : 'none',
                }}
              >
                <EnergyCore />
              </div>
            </div>
          </div>
        </section>

        <section
          className="hero-clock"
          style={{
            opacity: stage >= STAGE.CLOCK ? 1 : 0,
            transform:
              stage >= STAGE.CLOCK
                ? 'translate3d(0,0,0)'
                : 'translate3d(0,12px,0)',
          }}
        >
          <div className="clock-heading">
            <span />
            <p>{isLive ? 'LIVE NOW' : 'COMING IN'}</p>
            <span />
          </div>

          <div className="clock-units">
            {clockItems.map((item, i) => (
              <React.Fragment key={item.label}>
                {i > 0 && <span className="timer-slash" />}
                <ChargeUnit {...item} />
              </React.Fragment>
            ))}
          </div>

          <SecondRuler seconds={timeLeft.seconds} />

          <div className="clock-footer">
            <span>JAN 16 · 2027</span>
            <span>{totalHours.toLocaleString('en-US')} HRS TO GO</span>
          </div>
        </section>
      </div>
    </main>
  );
}

export const Hero = props => <HeroScene {...props} />;

export default function App() {
  return <Hero />;
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Eagle+Lake&family=Goldman:wght@400;700&display=swap');

  * {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    background: #05030a;
  }

  .vidyut-page {
    position: relative;
    width: 100%;
    height: 100vh;
    height: 100svh;
    overflow: hidden;
    color: #fff;
    background: radial-gradient(ellipse at 15% 0%, #2d1042 0%, #0f0618 48%, #05030a 100%);
    font-family: "Goldman", sans-serif;
  }

  .hud-frame {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 40;
  }

  .page-frame {
    position: relative;
    z-index: 10;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: clamp(8px, 1.6vh, 20px);
    padding: clamp(32px, 5.5vh, 52px) clamp(28px, 4.5vw, 64px);
  }

  .hero-section {
    position: relative;
    z-index: 10;
    display: flex;
    flex: 1 1 auto;
    min-height: 0;
    width: 100%;
  }

  .vidyut-canvas {
    --title-start-top: 50%;
    --title-offset: clamp(28px, 9vh, 120px); /* how far down the title sits */
    --title-size: clamp(72px, min(18vw, 21vh), 240px);
    --title-scale: 0.72;
    --title-h: calc(var(--title-size) * 0.95 * var(--title-scale));

    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 1400px;
    height: 100%;
    min-height: 0;
    margin: 0 auto;
    padding-top: calc(var(--title-h) + var(--title-offset) + clamp(12px, 2.5vh, 28px));
  }

  .vidyut-title {
    margin: 0;
    line-height: 0.95;
    white-space: nowrap;
    font-size: var(--title-size);
    color: #fff1e0;
  }

  .eagle-lake-regular {
    font-family: "Eagle Lake", serif;
    font-weight: 400;
  }

  .hero-body {
    flex: 1 1 auto;
    min-height: 0;
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1.1fr);
    grid-template-rows: minmax(0, 1fr);
    gap: clamp(20px, 3vw, 48px);
    align-items: stretch;
  }

  .hero-copy {
    position: relative;
    min-width: 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding-top: clamp(4px, 1vh, 12px);
    z-index: 12;
    transition: opacity 1000ms ease, transform 1200ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* ---------- Spacing (less congested) ---------- */
  .copy-line {
    flex: 0 0 auto;
    width: 100%;
    min-height: 1.4em;
    margin: 0 0 clamp(10px, 2vh, 22px);
    animation: copy-appear 900ms ease both;
  }

  .copy-line p {
    margin: 0;
    line-height: 1.4;
    overflow-wrap: anywhere;
    text-shadow: 0 2px 14px rgba(0,0,0,0.7);
  }

  .copy-line-1 p {
    font-size: clamp(22px, min(2.3vw, 3.8vh), 38px);
    letter-spacing: 0.1em;
    color: #ffd9a8;
  }

  .copy-line-2 p {
    font-size: clamp(18px, min(1.8vw, 3vh), 30px);
    letter-spacing: 0.08em;
    color: #fff;
  }

  .copy-line-3 p {
    font-size: clamp(18px, min(1.8vw, 3vh), 30px);
    letter-spacing: 0.08em;
    color: #ff9a5c;
  }

  .copy-details {
    flex: 0 0 auto;
    width: 100%;
    margin-top: clamp(4px, 1vh, 12px);
    padding-top: clamp(12px, 2vh, 22px);
    border-top: 1px solid rgba(255,154,92,0.35);
    opacity: 0;
    transform: translate3d(0, 10px, 0);
    transition: opacity 1000ms ease, transform 1200ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .copy-details.is-on {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  .copy-blurb {
    max-width: 760px;
    margin: 0;
    color: #cdb8d6;
    font-size: clamp(15px, min(1.3vw, 2.3vh), 22px);
    line-height: 1.6;
    letter-spacing: 0.04em;
    text-shadow: 0 2px 12px rgba(0,0,0,0.7);
  }

  /* ---------- 3D Model ---------- */
  .hero-model-wrapper {
    min-width: 0;
    min-height: 0;
    /* fills the whole right column, from the top of the hero down to the clock */
    align-self: stretch;
    margin-top: calc(-1 * (var(--title-h) + var(--title-offset) + clamp(12px, 2.5vh, 28px)));
    justify-self: stretch;
    width: 100%;
    max-width: none;
    max-height: none;
    z-index: 10;
    transition: opacity 1400ms ease, transform 1600ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .model-stage {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .model-stage::before {
    content: "";
    position: absolute;
    inset: 8% 8%;
    background: radial-gradient(circle, rgba(255,154,92,0.2) 0%, rgba(255,154,92,0) 70%);
    pointer-events: none;
  }

  .model-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    cursor: grab;
  }

  /* ---------- Countdown ---------- */
  .hero-clock {
    --timer-size: clamp(36px, min(9.5vw, 11vh), 96px);
    position: relative;
    z-index: 10;
    flex: 0 0 auto;
    width: 100%;
    max-width: 680px;
    margin: 0 auto;
    transition: opacity 1000ms ease, transform 1200ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .clock-heading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 6px;
  }

  .clock-heading span {
    width: 24px;
    height: 1px;
    background: rgba(255,154,92,0.55);
  }

  .clock-heading p {
    margin: 0;
    color: rgba(255,225,205,0.85);
    font-size: 11px;
    letter-spacing: 0.25em;
  }

  .clock-units {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: clamp(12px, 3vw, 40px);
  }

  .timer-num {
    position: relative;
    font-size: var(--timer-size);
    line-height: 1.1;
    filter: drop-shadow(0 0 8px rgba(255,154,92,0.35));
  }

  .timer-num-outline {
    display: block;
    color: transparent;
    -webkit-text-stroke: 2.5px rgba(255,241,224,0.95);
    position: relative;
    z-index: 2;
  }

  .timer-num-fill {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    color: #ff9a5c;
    z-index: 1;
    transition: clip-path 1s linear;
  }

  .timer-label {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 4px;
    color: rgba(255,225,205,0.8);
    font-size: 10px;
    letter-spacing: 0.25em;
  }

  .timer-label-rule {
    display: none;
    width: 20px;
    height: 1px;
    background: rgba(255,255,255,0.3);
  }

  .timer-slash {
    align-self: flex-start;
    flex-shrink: 0;
    width: 1px;
    height: calc(var(--timer-size) * 1.1);
    background: rgba(255,255,255,0.25);
    transform: rotate(20deg);
  }

  .second-ruler {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    height: 16px;
    margin-top: clamp(6px, 1.2vh, 16px);
  }

  .clock-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 8px;
    color: rgba(220,190,210,0.85);
    font-size: 11px;
    letter-spacing: 0.18em;
  }

  @keyframes copy-appear {
    from {
      opacity: 0;
      transform: translate3d(-12px, 0, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @media (min-width: 640px) {
    .timer-label-rule {
      display: block;
    }
  }

  /* ---------- Responsive ---------- */
  @media (max-width: 899px), (max-height: 799px) {
    html, body { overflow-x: hidden; }
    .vidyut-page { height: auto; min-height: 100svh; overflow: visible; }
    .page-frame { height: auto; min-height: 100svh; }
    .hero-section { flex: 0 0 auto; }
    .vidyut-canvas { --title-start-top: calc(50svh - 40px); height: auto; }
    .hero-body { flex: 0 0 auto; }
    .hud-frame { position: fixed; }
    .hero-model-wrapper { height: 560px; max-height: none; margin-top: 0; }
    .hero-clock { margin-top: clamp(16px, 4vh, 36px); padding-bottom: 12px; }
  }

  @media (max-width: 899px) {
    .hero-body {
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: auto auto;
      gap: 28px;
    }
    .hero-model-wrapper {
      width: 100%;
      max-width: none;
      min-height: 380px;
      height: min(75svh, 600px);
      align-self: stretch;
      justify-self: stretch;
    }
    .copy-blurb { max-width: none; }
  }

  @media (max-width: 639px) {
    .page-frame { padding: 36px 20px; gap: 8px; }
    .vidyut-canvas { --title-size: clamp(72px, min(30vw, 18vh), 160px); --title-scale: 0.8; }
    .copy-line-1 p { font-size: clamp(22px, 6.4vw, 30px); letter-spacing: 0.06em; }
    .copy-line-2 p, .copy-line-3 p { font-size: clamp(18px, 5.4vw, 24px); letter-spacing: 0.05em; }
    .copy-blurb { font-size: 17px; }
    .hero-model-wrapper { min-height: 340px; height: min(72svh, 500px); }
    .hero-clock { --timer-size: clamp(30px, 11.5vw, 52px); max-width: 100%; }
    .timer-num-outline { -webkit-text-stroke-width: 2px; }
    .clock-units { gap: 10px; }
    .timer-label { font-size: 8px; letter-spacing: 0.15em; }
    .clock-footer { font-size: 9px; }
  }

  /* Large / ultrawide screens */
  @media (min-width: 1600px) {
    .vidyut-canvas { max-width: 1600px; }
    
    .hero-clock { max-width: 820px; }
  }

  /* Tablets (portrait) */
  @media (min-width: 640px) and (max-width: 899px) {
    .page-frame { padding: 44px 40px; }
    .vidyut-canvas { --title-size: clamp(100px, 21vw, 190px); }
    .hero-model-wrapper { height: min(68svh, 680px); }
    .hero-clock { max-width: 560px; }
  }

  /* Small phones */
  @media (max-width: 380px) {
    .page-frame { padding: 32px 14px; }
    .vidyut-canvas { --title-size: clamp(64px, 28vw, 110px); }
    .copy-line-1 p { font-size: 20px; letter-spacing: 0.04em; }
    .copy-line-2 p, .copy-line-3 p { font-size: 16px; letter-spacing: 0.03em; }
    .copy-blurb { font-size: 15px; line-height: 1.7; }
    .hero-clock { --timer-size: clamp(26px, 10.5vw, 40px); }
    .clock-units { gap: 6px; }
    .timer-slash { display: none; }
    .clock-footer { flex-direction: column; gap: 4px; }
    .hero-model-wrapper { min-height: 320px; height: min(66svh, 440px); }
  }

  /* Landscape phones (short and wide) */
  @media (max-height: 520px) and (orientation: landscape) {
    .vidyut-canvas { --title-size: clamp(52px, 16vh, 90px); --title-offset: 16px; }
    .hero-body { grid-template-columns: 1fr 1fr; }
    .hero-model-wrapper { height: min(80vh, 400px); min-height: 0; }
    .copy-line { margin-bottom: 6px; }
  }

  /* Respect reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .copy-line { animation: none; }
  }
`;