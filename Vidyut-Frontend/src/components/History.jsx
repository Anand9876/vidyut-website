import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  useMotionValueEvent,
} from 'framer-motion';
import { HISTORY_EDITIONS, HISTORY_MOMENTS } from '../data/historyData';

/* ------------------------------------------------------------------
   HISTORY - Vidyut archive book
   (deep-space theme, realistic open / close, scroll-linked animation)
------------------------------------------------------------------ */

function buildSpreads(editions, moments) {
  const out = [];
  const per = editions.length ? Math.ceil(moments.length / editions.length) : moments.length;
  let m = 0;
  editions.forEach(e => {
    out.push({ type: 'edition', key: `e${e.year}`, data: e });
    for (let k = 0; k < per && m < moments.length; k += 1, m += 1) {
      out.push({ type: 'moment', key: `m${moments[m].id}`, data: moments[m] });
    }
  });
  while (m < moments.length) {
    out.push({ type: 'moment', key: `m${moments[m].id}`, data: moments[m] });
    m += 1;
  }
  return out;
}

const SPREADS = buildSpreads(HISTORY_EDITIONS, HISTORY_MOMENTS);
const N = SPREADS.length;

const pad = n => String(n).padStart(2, '0');
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const easeSine = u => 0.5 - 0.5 * Math.cos(Math.PI * clamp(u, 0, 1));

/* ---- page-turn tuning ---- */
const STRIPS = 8; // slices per bending page (more = smoother curl)
const BEND = 10; // curl per slice (deg)
const SLOT = 1.6; // scroll units per page
const DUR = 1.45; // portion of a slot the flip itself takes
const totalX = L => (L - 1) * SLOT + DUR;
const leafProgress = (v, i, L) => easeSine(clamp((v * totalX(L) - i * SLOT) / DUR, 0, 1));

/* ---- scroll budget (in viewport heights) ---- */
const INTRO_VH = 12; // short, so there is no empty scroll before the first page turns
const OUTRO_VH_DESKTOP = 150;
const OUTRO_VH_SINGLE = 100;
const PER_VH_DESKTOP = 220;
const PER_VH_SINGLE = 110;

const SPARKS = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 31.7) % 100,
  top: (i * 53.3) % 100,
  size: 1.5 + (i % 3),
  delay: (i % 7) * 0.5,
  dur: 3.5 + (i % 4),
}));

function useIsSingle() {
  const query = '(max-width: 899px)';
  const [single, setSingle] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : false
  );
  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mq = window.matchMedia(query);
    const on = e => setSingle(e.matches);
    setSingle(mq.matches);
    if (mq.addEventListener) mq.addEventListener('change', on);
    else mq.addListener(on);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', on);
      else mq.removeListener(on);
    };
  }, []);
  return single;
}

const imgInfo = new Map();
const subs = new Set();

function preload(src) {
  if (!src || imgInfo.has(src)) return;
  imgInfo.set(src, { state: 'loading', ratio: 1 });
  const im = new Image();
  im.decoding = 'async';
  im.onload = () => {
    imgInfo.set(src, { state: 'ok', ratio: im.naturalWidth / im.naturalHeight });
    subs.forEach(f => f());
  };
  im.onerror = () => {
    imgInfo.set(src, { state: 'bad', ratio: 1 });
    subs.forEach(f => f());
  };
  im.src = src;
}

function useImg(src) {
  const [, tick] = useState(0);
  useEffect(() => {
    preload(src);
    const f = () => tick(n => n + 1);
    subs.add(f);
    return () => {
      subs.delete(f);
    };
  }, [src]);
  return imgInfo.get(src) || { state: 'loading', ratio: 1 };
}

function Pic({ src, art, alt, className }) {
  const info = useImg(src);
  return (
    <img
      className={className}
      src={!src || info.state === 'bad' ? art : src}
      alt={alt}
      decoding="async"
      draggable="false"
    />
  );
}

function Corner({ pos }) {
  return (
    <svg className={`gr-corner gr-corner-${pos}`} viewBox="0 0 40 40" aria-hidden="true">
      <path d="M2 2H20V6H6V20H2V2Z" fill="#ffb07c" />
      <path d="M4 12L12 4" stroke="#ff9a5c" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="2" fill="#fff" />
    </svg>
  );
}

function ImageBody({ spread, index }) {
  const d = spread.data;
  const isEd = spread.type === 'edition';
  const info = useImg(d.image);
  const wide = d.fit === 'contain' || (info.state === 'ok' && info.ratio > 0.95);
  const alt = isEd ? `${d.label} highlights` : `${d.tag}: ${d.caption}`;
  return (
    <div className="gr-content gr-photo">
      <p className="gr-running">VIDYUT · ARCHIVE</p>
      <div className="gr-photo-frame">
        {wide && <Pic className="gr-img gr-img-backdrop" src={d.image} art={d.art} alt="" />}
        <Pic className={`gr-img${wide ? ' gr-img-contain' : ''}`} src={d.image} art={d.art} alt={alt} />
        <div className="gr-img-overlay" />
      </div>
      <p className="gr-plate">PLATE {pad(index + 1)}</p>
    </div>
  );
}

function TextBody({ spread, index }) {
  const d = spread.data;
  const isEd = spread.type === 'edition';
  const stats = (isEd && d.stats) || [];
  const chips = (isEd ? d.highlights : d.chips) || [];
  return (
    <div className="gr-content gr-textpage">
      <span className="gr-bignum" aria-hidden="true">
        {pad(index + 1)}
      </span>
      <p className="gr-running">VIDYUT · ARCHIVE</p>
      <p className="gr-kicker">{isEd ? `${d.label}${d.dates ? ` — ${d.dates}` : ''}` : d.tag}</p>
      <h3 className="gr-title">{isEd ? d.title : d.caption}</h3>
      <div className="gr-rule" />
      <p className="gr-blurb">{d.blurb}</p>
      {stats.length > 0 && (
        <ul className="gr-stats">
          {stats.map((st, k) => (
            <li key={st.label} style={{ '--i': k }}>
              <strong>{st.value}</strong>
              <span>{st.label}</span>
            </li>
          ))}
        </ul>
      )}
      {chips.length > 0 && (
        <ul className="gr-chips">
          {chips.map((c, k) => (
            <li key={c} style={{ '--i': k }}>
              {c}
            </li>
          ))}
        </ul>
      )}
      <p className="gr-folio">
        {pad(index + 1)} / {pad(N)}
      </p>
    </div>
  );
}

function CoverBody() {
  return (
    <div className="gr-content gr-cover">
      <div className="gr-cover-frame">
        <Corner pos="tl" />
        <Corner pos="tr" />
        <Corner pos="bl" />
        <Corner pos="br" />
        <p className="gr-cover-top">AMRITA VISHWA VIDYAPEETHAM</p>
        <h2 className="gr-cover-title">VIDYUT</h2>
        <div className="gr-cover-rule" />
        <p className="gr-cover-sub">HISTORY</p>
      </div>
      <p className="gr-cover-hint">SCROLL TO EXPLORE</p>
    </div>
  );
}

function BackBody() {
  return (
    <div className="gr-content gr-cover gr-backcover">
      <div className="gr-cover-frame">
        <Corner pos="tl" />
        <Corner pos="tr" />
        <Corner pos="bl" />
        <Corner pos="br" />
        <div className="gr-seal" aria-hidden="true">
          V
        </div>
        <div className="gr-cover-rule" />
        <p className="gr-cover-sub gr-back-sub">SEE YOU AT '27</p>
      </div>
    </div>
  );
}

function EndBody() {
  return (
    <div className="gr-content gr-end">
      <p className="gr-running">VIDYUT · ARCHIVE</p>
      <div className="gr-end-wrap">
        <div className="gr-end-mark" aria-hidden="true">
          V
        </div>
        <div className="gr-rule gr-rule-mid" />
        <p className="gr-end-text">THE STORY CONTINUES</p>
      </div>
    </div>
  );
}

function FinalBody() {
  return (
    <div className="gr-content gr-final">
      <div className="gr-final-wrap">
        <p className="gr-kicker">NEXT EDITION</p>
        <h3 className="gr-final-title">VIDYUT '27</h3>
        <div className="gr-rule gr-rule-mid" />
        <p className="gr-final-date">JANUARY 16 · 2027</p>
      </div>
    </div>
  );
}

function PageBody({ page }) {
  if (!page) return <div className="gr-content gr-blank" />;
  switch (page.type) {
    case 'cover':
      return <CoverBody />;
    case 'back':
      return <BackBody />;
    case 'end':
      return <EndBody />;
    case 'final':
      return <FinalBody />;
    case 'image':
      return <ImageBody spread={page.spread} index={page.index} />;
    default:
      return <TextBody spread={page.spread} index={page.index} />;
  }
}

const COVER_PAGE = { type: 'cover' };
const BACK_PAGE = { type: 'back' };
const END_PAGE = { type: 'end' };
const FINAL_PAGE = { type: 'final' };

const textPage = i => ({ type: 'text', spread: SPREADS[i], index: i });
const imagePage = i => ({ type: 'image', spread: SPREADS[i], index: i });

function buildLeaves(single) {
  if (single) {
    const leaves = [{ front: COVER_PAGE, back: null }];
    for (let i = 0; i < N; i += 1) {
      leaves.push({ front: textPage(i), back: null });
      leaves.push({ front: imagePage(i), back: null });
    }
    // last leaf never flips on mobile, it stays as the closing page
    leaves.push({ front: FINAL_PAGE, back: null });
    return leaves;
  }
  const leaves = [{ front: COVER_PAGE, back: textPage(0) }];
  for (let i = 0; i < N; i += 1) {
    const nextLeft = i + 1 < N ? textPage(i + 1) : FINAL_PAGE;
    leaves.push({ front: imagePage(i), back: nextLeft });
  }
  // back cover: swings over to the left and closes the book
  leaves.push({ front: END_PAGE, back: BACK_PAGE });
  return leaves;
}

function Strip({ i, n, p, leaf }) {
  const last = i === n - 1;
  const rotateY = useTransform(p, v => (i === 0 ? -180 * v : Math.sin(Math.PI * v) * BEND));
  const shade = useTransform(p, v => Math.sin(Math.PI * v) * (0.07 + i * 0.04));

  const frontOff = `calc(var(--pw) / ${n} * ${-i})`;
  const backOff = `calc(var(--pw) / ${n} * ${-(n - 1 - i)})`;

  return (
    <motion.div
      className="gr-strip"
      style={{
        rotateY,
        left: i === 0 ? 0 : `calc(var(--pw) / ${n})`,
        /* 1px overlap hides the hairline seams between slices */
        width: `calc(var(--pw) / ${n}${last ? '' : ' + 1px'})`,
        transformPerspective: i === 0 ? 2400 : undefined,
      }}
    >
      <div className="gr-face gr-front">
        <div className="gr-inner" style={{ transform: `translateX(${frontOff})` }}>
          <PageBody page={leaf.front} />
          {i === 0 && <div className="gr-gutter gr-gutter-r" />}
        </div>
        <motion.div className="gr-shade" style={{ opacity: shade }} />
      </div>
      <div className="gr-face gr-back">
        <div className="gr-inner" style={{ transform: `translateX(${backOff})` }}>
          <PageBody page={leaf.back} />
          {last && <div className="gr-gutter gr-gutter-l" />}
        </div>
        <motion.div className="gr-shade" style={{ opacity: shade }} />
      </div>
      {!last && <Strip i={i + 1} n={n} p={p} leaf={leaf} />}
    </motion.div>
  );
}

function Leaf({ index, total, flips, prog, leaf, single, bend, live }) {
  const p = useTransform(prog, v => leafProgress(v, index, flips));
  const zIndex = useTransform(p, v => (v < 0.5 ? total - index : index + 1));
  const opacity = useTransform(p, v => (single ? 1 - clamp((v - 0.45) / 0.45, 0, 1) : 1));

  /* soft shadow the turning page throws: first on the page it leaves, then on the page it lands on */
  const castR = useTransform(p, v => Math.sin(Math.PI * clamp(v / 0.5, 0, 1)) * 0.55);
  const castL = useTransform(p, v => Math.sin(Math.PI * clamp((v - 0.5) / 0.5, 0, 1)) * 0.55);

  return (
    <motion.div className={`gr-leaf${live ? ' is-live' : ''}`} style={{ zIndex, opacity }}>
      {!single && <motion.div className="gr-cast gr-cast-r" style={{ opacity: castR }} />}
      {!single && <motion.div className="gr-cast gr-cast-l" style={{ opacity: castL }} />}
      <Strip i={0} n={bend ? STRIPS : 1} p={p} leaf={leaf} />
    </motion.div>
  );
}

function NavIcon({ dir }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d={dir === 'prev' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PinnedStage() {
  const trackRef = useRef(null);
  const single = useIsSingle();
  const leaves = buildLeaves(single);
  const L = leaves.length;
  const F = single ? L - 1 : L; // number of leaves that actually flip

  /* scroll geometry */
  const flipsVh = (totalX(F) / SLOT) * (single ? PER_VH_SINGLE : PER_VH_DESKTOP);
  const outroVh = single ? OUTRO_VH_SINGLE : OUTRO_VH_DESKTOP;
  const scrollVh = INTRO_VH + flipsVh + outroVh;
  const S = INTRO_VH / scrollVh; // flips start
  const E = (INTRO_VH + flipsVh) / scrollVh; // flips end / outro start

  const [mode, setMode] = useState('before');

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;
    const update = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const next = r.top > 0 ? 'before' : r.bottom <= vh ? 'after' : 'active';
      setMode(m => (m === next ? m : next));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  /* main pinned progress: softer, heavier spring = smoother page turns */
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 45, damping: 22, mass: 1, restDelta: 0.00005 });
  const prog = useTransform(smooth, v => clamp((v - S) / (E - S), 0, 1));

  /* entry progress: 0 when the section peeks in, 1 when it is pinned */
  const { scrollYProgress: entryRaw } = useScroll({
    target: trackRef,
    offset: ['start end', 'start start'],
  });
  const entry = useSpring(entryRaw, { stiffness: 150, damping: 26, mass: 0.6, restDelta: 0.0005 });

  /* outro progress (0..1 across the closing scroll) */
  const outro = useTransform(smooth, v => clamp((v - E) / (1 - E), 0, 1));
  const closeP = useTransform(outro, v => easeSine(v / 0.5));
  const exitP = useTransform(outro, v => easeSine((v - 0.55) / 0.45));
  const contOp = useTransform(outro, v => clamp((v - 0.7) / 0.25, 0, 1));
  const contPE = useTransform(contOp, v => (v > 0.5 ? 'auto' : 'none'));

  const open = useTransform(prog, v => leafProgress(v, 0, F));

  /* book position: cover centred while closed, spread centred while open, back cover centred when shut */
  const grX = useTransform([open, closeP], ([o, c]) =>
    single ? '0px' : `calc(var(--pw) * ${-0.5 * (1 - o) + 0.5 * c})`
  );

  /* hardcover slab behind the pages: covers only the right half when closed, both halves when open,
     then only the left half once the back cover has closed */
  const bindLeft = useTransform(open, o => (single ? '0px' : `calc(var(--pw) * ${1 - o})`));
  const bindWidth = useTransform([open, closeP], ([o, c]) =>
    single ? 'var(--pw)' : `calc(var(--pw) * ${1 + o - c})`
  );

  /* page-block thickness: stack on the right shrinks, stack on the left grows as pages turn */
  const edgeR = useTransform(prog, v => 1 - v);
  const edgeL = useTransform(prog, v => v);

  /* crease shadow down the middle while the book is open */
  const spineOp = useTransform([open, closeP], ([o, c]) => (single ? 0 : o * (1 - c)));

  /* scene entrance + exit (book fades in early so the screen is never empty).
     Rotation: tipped back a little while closed, flat while reading. */
  const sceneScale = useTransform([entry, exitP], ([e, x]) => (0.72 + 0.28 * e) * (1 - 0.12 * x));
  const sceneY = useTransform([entry, exitP], ([e, x]) => (1 - e) * 140 - 36 * x);
  const sceneRot = useTransform([entry, open, closeP], ([e, o, c]) =>
    (1 - e) * 24 + (single ? 0 : 7 * (1 - o) + 7 * c)
  );
  const sceneOpacity = useTransform([entry, exitP], ([e, x]) => clamp(e / 0.3, 0, 1) * (1 - 0.7 * x));
  const bgOpacity = useTransform(entryRaw, [0, 1], [0, 1]);
  const maskStop = useTransform(entryRaw, [0, 1], ['40%', '0%']);

  /* page buttons at the bottom: visible while reading, replaced by Continue at the end */
  const navOp = useTransform([entry, exitP], ([e, x]) => clamp((e - 0.5) / 0.4, 0, 1) * (1 - clamp(x * 2, 0, 1)));
  const navPE = useTransform(navOp, v => (v > 0.5 ? 'auto' : 'none'));

  /* parallax background layers */
  const bgYA = useTransform(smooth, [0, 1], ['0vh', '-38vh']);
  const bgYB = useTransform(smooth, [0, 1], ['0vh', '30vh']);
  const sparkY = useTransform(smooth, [0, 1], ['0vh', '-70vh']);

  /* orbit rings that rotate with scroll */
  const orbitRot = useTransform(smooth, [0, 1], [0, 220]);
  const orbitRotRev = useTransform(smooth, [0, 1], [0, -160]);
  const orbitScale = useTransform(entry, [0, 1], [0.6, 1]);
  const orbitOp = useTransform([entry, exitP], ([e, x]) => e * (1 - 0.85 * x));

  /* giant intro title behind the book */
  const titleOp = useTransform([entry, smooth], ([e, s]) =>
    clamp((e - 0.25) / 0.6, 0, 1) * (1 - clamp(s / S, 0, 1))
  );
  const titleScale = useTransform([entry, smooth], ([e, s]) =>
    (0.85 + 0.15 * e) * (1 + 0.35 * clamp(s / S, 0, 1))
  );
  const titleY = useTransform(entry, [0, 1], [70, 0]);

  const [slot, setSlot] = useState(0);
  const [started, setStarted] = useState(false);
  useMotionValueEvent(prog, 'change', v => {
    const next = Math.floor((v * totalX(F)) / SLOT);
    setSlot(s => (s === next ? s : next));
    const st = v > 0.0005;
    setStarted(s => (s === st ? s : st));
  });

  const swipe = useRef(null);

  const goNext = () => {
    const sec = trackRef.current && trackRef.current.closest('section');
    let el = sec || trackRef.current;
    while (el && !el.nextElementSibling) el = el.parentElement;
    const target = el && el.nextElementSibling;
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  const pageTarget = k => {
    const total = totalX(F);
    const gap = (SLOT - DUR) / 2;
    const x = k <= 0 ? 0 : k >= F ? total : k * SLOT - gap;
    const sm = S + (x / total) * (E - S);
    const el = trackRef.current;
    const top = el.getBoundingClientRect().top + window.scrollY;
    return top + sm * (el.offsetHeight - window.innerHeight);
  };

  const currentPage = () => {
    const raw = clamp((scrollYProgress.get() - S) / (E - S), 0, 1);
    const x = raw * totalX(F);
    let k = 0;
    for (let i = 0; i < F; i += 1) if (x - i * SLOT >= DUR / 2) k += 1;
    return k;
  };

  const flip = dir => {
    if (!trackRef.current) return;
    const k = currentPage();
    if (dir > 0 && k >= F) {
      goNext();
      return;
    }
    const next = clamp(k + dir, 0, F);
    if (next === k) return;
    window.scrollTo({ top: pageTarget(next), behavior: 'smooth' });
  };

  const flipRef = useRef(flip);
  flipRef.current = flip;

  useEffect(() => {
    const onKey = e => {
      const tag = e.target && e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      const r = trackRef.current && trackRef.current.getBoundingClientRect();
      if (!r || r.top > 0 || r.bottom < window.innerHeight * 0.5) return;
      if (e.key === 'ArrowRight') flipRef.current(1);
      else if (e.key === 'ArrowLeft') flipRef.current(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const onDown = e => {
    swipe.current = { x: e.clientX, y: e.clientY, t: Date.now() };
  };
  const onUp = e => {
    const s0 = swipe.current;
    swipe.current = null;
    if (!s0) return;
    const dx = e.clientX - s0.x;
    const dy = e.clientY - s0.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      flip(dx < 0 ? 1 : -1);
    } else if (Math.abs(dx) < 10 && Math.abs(dy) < 10 && Date.now() - s0.t < 400) {
      const mid = window.innerWidth * (single ? 0.4 : 0.5);
      flip(e.clientX > mid ? 1 : -1);
    }
  };

  return (
    <div ref={trackRef} className="gr-track" style={{ '--h': scrollVh }}>
      <motion.div className={`gr-stage is-${mode}`} style={{ '--m': maskStop }}>
        {/* parallax background */}
        <motion.div className="gr-bg" aria-hidden="true" style={{ opacity: bgOpacity }}>
          <motion.div className="gr-layer" style={{ y: bgYA }}>
            <span className="gr-blob gr-blob-a" />
            <span className="gr-blob gr-blob-c" />
          </motion.div>
          <motion.div className="gr-layer" style={{ y: bgYB }}>
            <span className="gr-blob gr-blob-b" />
          </motion.div>
          <motion.div className="gr-layer gr-layer-tall" style={{ y: sparkY }}>
            {SPARKS.map((d, i) => (
              <span
                key={i}
                className="gr-spark"
                style={{
                  left: d.left + '%',
                  top: d.top + '%',
                  width: d.size,
                  height: d.size,
                  animationDelay: d.delay + 's',
                  animationDuration: d.dur + 's',
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* orbit rings, rotate with scroll */}
        <motion.div
          className="gr-orbit"
          aria-hidden="true"
          style={{ opacity: orbitOp, scale: orbitScale }}
        >
          <motion.svg viewBox="0 0 400 400" style={{ rotate: orbitRot }}>
            <circle className="gr-ring gr-ring-a" cx="200" cy="200" r="196" />
            <circle className="gr-ring gr-ring-b" cx="200" cy="200" r="150" />
            <circle className="gr-dot" cx="200" cy="4" r="4" />
            <circle className="gr-dot gr-dot-pink" cx="338" cy="62" r="3" />
            <circle className="gr-dot" cx="50" cy="306" r="3" />
          </motion.svg>
          <motion.svg viewBox="0 0 400 400" style={{ rotate: orbitRotRev }}>
            <circle className="gr-ring gr-ring-c" cx="200" cy="200" r="104" />
            <circle className="gr-dot gr-dot-pink" cx="304" cy="200" r="3" />
            <circle className="gr-dot" cx="127" cy="127" r="2.5" />
          </motion.svg>
        </motion.div>

        {/* giant intro title */}
        <motion.div
          className="gr-intro"
          aria-hidden="true"
          style={{ opacity: titleOp, scale: titleScale, y: titleY }}
        >
          <span className="gr-intro-small">VIDYUT</span>
          <span className="gr-intro-big">HISTORY</span>
        </motion.div>

        <motion.div
          className="gr-scene"
          style={{
            scale: sceneScale,
            y: sceneY,
            rotateX: sceneRot,
            opacity: sceneOpacity,
            transformPerspective: 1600,
            touchAction: 'pan-y',
          }}
          onPointerDown={onDown}
          onPointerUp={onUp}
          onPointerCancel={() => {
            swipe.current = null;
          }}
        >
          <motion.div className={`gr-book ${single ? 'is-single' : ''}`} style={{ x: grX }}>
            <motion.div
              className="gr-book-binding"
              aria-hidden="true"
              style={{ left: bindLeft, width: bindWidth }}
            />
            {!single && <motion.div className="gr-edge gr-edge-r" aria-hidden="true" style={{ scaleX: edgeR }} />}
            {!single && <motion.div className="gr-edge gr-edge-l" aria-hidden="true" style={{ scaleX: edgeL }} />}
            <div className={`gr-container ${single ? 'is-single' : ''}`}>
              {leaves.map((leaf, i) => (
                <Leaf
                  key={`${single ? 's' : 'd'}-${i}`}
                  index={i}
                  total={L}
                  flips={F}
                  prog={prog}
                  leaf={leaf}
                  single={single}
                  bend={i >= slot - 1 && i <= slot + 1}
                  live={started && i >= slot - 1 && i <= slot + 1}
                />
              ))}
            </div>
            {!single && <motion.div className="gr-spine" aria-hidden="true" style={{ opacity: spineOp }} />}
          </motion.div>
        </motion.div>

        {/* previous / next page buttons */}
        <motion.div className="gr-navbar" style={{ opacity: navOp, pointerEvents: navPE }}>
          <button type="button" className="gr-nav" onClick={() => flip(-1)} aria-label="Previous page">
            <NavIcon dir="prev" />
          </button>
          <button type="button" className="gr-nav" onClick={() => flip(1)} aria-label="Next page">
            <NavIcon dir="next" />
          </button>
        </motion.div>

        {/* continue to next section (appears once the book is closed) */}
        <div className="gr-continue-wrap">
          <motion.button
            type="button"
            className="gr-continue"
            style={{ opacity: contOp, pointerEvents: contPE }}
            onClick={goNext}
          >
            <span>CONTINUE</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

function StaticList() {
  return (
    <div className="gr-plain">
      <h2 className="gr-plain-title">History</h2>
      {SPREADS.map((sp, i) => (
        <React.Fragment key={sp.key}>
          <article className="gr-plain-card">
            <PageBody page={textPage(i)} />
          </article>
          <article className="gr-plain-card">
            <PageBody page={imagePage(i)} />
          </article>
        </React.Fragment>
      ))}
    </div>
  );
}

export function History() {
  const reduce = useReducedMotion();

  useEffect(() => {
    [...HISTORY_EDITIONS, ...HISTORY_MOMENTS].forEach(d => preload(d.image));
  }, []);

  return (
    <section id="history" className="gr-section" aria-label="History of Vidyut">
      <style>{STYLES}</style>
      {reduce ? <StaticList /> : <PinnedStage />}
    </section>
  );
}

export default History;

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  .gr-section {
    /* ---- THEME: change these to re-theme the whole book ---- */
    --bg-1: #2d1042;
    --bg-2: #0f0618;
    --bg-3: #05030a;
    --leather-1: #4a2270;
    --leather-2: #1a0a2c;
    --accent: #ff9a5c;
    --accent-2: #ffb07c;
    --cream: #ffd9a8;
    --pink: #ff7ab0;
    --page-1: #34195a;
    --page-2: #190c2d;
    --ink: #fff1e0;
    --ink-soft: #cdb5dc;
    --ink-body: #f1e4d8;

    position: relative;
    color: var(--ink);
    background: radial-gradient(ellipse at 50% 0%, var(--bg-1) 0%, var(--bg-2) 60%, var(--bg-3) 100%);
    font-family: "Plus Jakarta Sans", sans-serif;
    overflow: hidden;
  }

  .gr-track {
    position: relative;
    height: calc(var(--h) * 1vh + 100vh);
    height: calc(var(--h) * 1vh + 100svh);
  }

  .gr-stage {
    --ph: min(76vh, 680px);
    --ph: min(76svh, 680px);
    --pw: min(calc(var(--ph) * 0.72), 42vw);
    --u: calc(var(--pw) / 100);
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    height: 100svh;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(ellipse at 50% 0%, var(--bg-1) 0%, var(--bg-2) 60%, var(--bg-3) 100%);
    box-sizing: border-box;
  }

  /* soft top edge while the section is still sliding in from the landing page */
  .gr-stage.is-before {
    -webkit-mask-image: linear-gradient(180deg, transparent 0, #000 var(--m, 0%));
    mask-image: linear-gradient(180deg, transparent 0, #000 var(--m, 0%));
  }
  .gr-stage.is-active { position: fixed; top: 0; bottom: auto; }
  .gr-stage.is-after { top: auto; bottom: 0; }

  /* ---------- parallax background ---------- */
  .gr-bg { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
  .gr-layer { position: absolute; inset: 0; will-change: transform; }
  .gr-layer-tall { height: 170%; }

  .gr-blob {
    position: absolute;
    width: 60vmax;
    height: 60vmax;
    border-radius: 50%;
    will-change: transform;
    filter: blur(50px);
  }
  .gr-blob-a { left: -15vmax; top: -20vmax; background: rgba(255,122,60,0.18); animation: gr-drift-a 24s ease-in-out infinite alternate; }
  .gr-blob-b { right: -18vmax; bottom: -22vmax; background: rgba(214,58,140,0.18); animation: gr-drift-b 28s ease-in-out infinite alternate; }
  .gr-blob-c { left: 30%; top: 25%; width: 40vmax; height: 40vmax; background: rgba(90,43,214,0.2); animation: gr-drift-c 32s ease-in-out infinite alternate; }

  @keyframes gr-drift-a { to { transform: translate3d(14vmax, 10vmax, 0); } }
  @keyframes gr-drift-b { to { transform: translate3d(-15vmax, -12vmax, 0); } }
  @keyframes gr-drift-c { to { transform: translate3d(-10vmax, 10vmax, 0); } }

  .gr-spark {
    position: absolute;
    border-radius: 50%;
    background: var(--cream);
    opacity: 0;
    will-change: opacity;
    animation: gr-twinkle 4s ease-in-out infinite;
  }
  @keyframes gr-twinkle { 0%, 100% { opacity: 0; } 50% { opacity: 0.85; } }

  /* ---------- orbit rings ---------- */
  .gr-orbit {
    position: absolute;
    inset: 0;
    margin: auto;
    width: min(150vmin, 1400px);
    height: min(150vmin, 1400px);
    z-index: 1;
    pointer-events: none;
    will-change: transform, opacity;
  }
  .gr-orbit svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
  .gr-ring { fill: none; stroke: var(--accent); }
  .gr-ring-a { stroke-opacity: 0.22; stroke-width: 0.8; stroke-dasharray: 2 7; }
  .gr-ring-b { stroke-opacity: 0.14; stroke-width: 0.8; }
  .gr-ring-c { stroke: var(--pink); stroke-opacity: 0.2; stroke-width: 0.8; stroke-dasharray: 1 5; }
  .gr-dot { fill: var(--accent-2); filter: drop-shadow(0 0 4px var(--accent)); }
  .gr-dot-pink { fill: var(--pink); filter: drop-shadow(0 0 4px var(--pink)); }

  /* ---------- giant intro title ---------- */
  .gr-intro {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.4vw;
    pointer-events: none;
    text-align: center;
    will-change: transform, opacity;
  }
  .gr-intro-small {
    font-family: "Outfit", sans-serif;
    font-weight: 400;
    font-size: clamp(12px, 1.6vw, 22px);
    letter-spacing: 0.7em;
    padding-left: 0.7em;
    color: var(--accent-2);
  }
  .gr-intro-big {
    font-family: "Outfit", sans-serif;
    font-weight: 700;
    font-size: clamp(52px, 15vw, 250px);
    line-height: 1;
    letter-spacing: 0.04em;
    color: transparent;
    -webkit-text-stroke: 1.5px rgba(255,154,92,0.6);
    text-shadow: 0 0 60px rgba(255,122,60,0.25);
  }

  /* ---------- scene + book ---------- */
  .gr-scene {
    position: relative;
    z-index: 2;
    width: 100%;
    height: var(--ph);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    -webkit-tap-highlight-color: transparent;
    will-change: transform, opacity;
  }

  .gr-book {
    position: relative;
    width: calc(var(--pw) * 2);
    height: var(--ph);
    flex: 0 0 auto;
  }
  .gr-book.is-single { width: var(--pw); }

  /* hardcover slab (left + width are animated from JS) */
  .gr-book-binding {
    position: absolute;
    top: 0;
    height: var(--ph);
    background: linear-gradient(135deg, var(--leather-1), var(--leather-2));
    border-radius: 6px;
    box-shadow:
      0 0 0 5px var(--leather-2),
      0 0 0 6px rgba(255,154,92,0.45),
      0 0 90px rgba(255,154,92,0.22),
      0 35px 70px rgba(0,0,0,0.8);
    pointer-events: none;
    z-index: 0;
  }

  /* page-block thickness on either side of the book */
  .gr-edge {
    position: absolute;
    top: 3px;
    bottom: 3px;
    width: calc(var(--u) * 3.4);
    pointer-events: none;
    z-index: 0;
    background: repeating-linear-gradient(90deg, rgba(255,217,168,0.55) 0 1px, #2a1548 1px 3px);
    box-shadow: 0 6px 14px rgba(0,0,0,0.45);
    will-change: transform;
  }
  .gr-edge-r { left: 100%; transform-origin: left center; border-radius: 0 3px 3px 0; }
  .gr-edge-l { right: 100%; transform-origin: right center; border-radius: 3px 0 0 3px; }

  .gr-container {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    border-radius: 6px;
    overflow: hidden;
  }

  /* crease shadow down the spine while the book is open */
  .gr-spine {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: calc(var(--pw) * 0.18);
    margin-left: calc(var(--pw) * -0.09);
    z-index: 5;
    pointer-events: none;
    background: linear-gradient(90deg, transparent, rgba(0,0,0,0.38) 50%, transparent);
  }

  .gr-leaf {
    position: absolute;
    top: 0;
    left: 50%;
    width: var(--pw);
    height: var(--ph);
    transform-origin: left center;
    will-change: opacity;
  }
  .gr-container.is-single .gr-leaf { left: 0; }

  /* shadow thrown by the turning page onto the pages beside it */
  .gr-cast { position: absolute; top: 0; width: 100%; height: 100%; pointer-events: none; will-change: opacity; }
  .gr-cast-r { left: 0; background: linear-gradient(90deg, rgba(0,0,0,0.65), rgba(0,0,0,0.2) 42%, transparent 78%); }
  .gr-cast-l { left: -100%; background: linear-gradient(270deg, rgba(0,0,0,0.65), rgba(0,0,0,0.2) 42%, transparent 78%); }

  .gr-strip {
    position: absolute;
    top: 0;
    height: 100%;
    transform-origin: left center;
    transform-style: preserve-3d;
    will-change: transform;
  }
  .gr-leaf > .gr-strip { left: 0; }

  .gr-inner { position: absolute; top: 0; left: 0; width: var(--pw); height: var(--ph); }

  .gr-face {
    position: absolute;
    inset: 0;
    overflow: hidden;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    background: var(--page-2);
  }

  .gr-front { border-radius: 0; }
  .gr-back  { transform: rotateY(180deg); border-radius: 0; }

  .gr-shade {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: #000;
    opacity: 0;
  }

  .gr-gutter { position: absolute; top: 0; bottom: 0; width: 14%; pointer-events: none; z-index: 6; }
  .gr-gutter-r { left: 0; background: linear-gradient(90deg, rgba(0,0,0,0.45), transparent); }
  .gr-gutter-l { right: 0; background: linear-gradient(270deg, rgba(0,0,0,0.45), transparent); }

  /* ---------- pages ---------- */
  .gr-content {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    color: var(--ink);
    background: radial-gradient(circle at 50% 30%, var(--page-1), var(--page-2));
    box-shadow: inset 0 0 0 1px rgba(255,154,92,0.12), inset 0 0 60px rgba(0,0,0,0.35);
  }

  .gr-running {
    position: absolute;
    top: calc(var(--u) * 5.5);
    left: 0;
    right: 0;
    margin: 0;
    text-align: center;
    font-family: "Outfit", sans-serif;
    font-size: max(9px, calc(var(--u) * 1.6));
    letter-spacing: 0.3em;
    color: var(--accent-2);
  }

  .gr-kicker {
    margin: 0;
    font-family: "Outfit", sans-serif;
    font-weight: 500;
    font-size: max(10px, calc(var(--u) * 1.8));
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--accent);
  }

  .gr-title {
    margin: 0;
    font-family: "Outfit", sans-serif;
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: -0.01em;
    color: #fff;
    font-size: max(24px, calc(var(--u) * 5.8));
    text-shadow: 0 0 18px rgba(255,154,92,0.4);
    overflow-wrap: anywhere;
    text-wrap: balance;
  }

  .gr-rule {
    width: calc(var(--u) * 20);
    height: 1.5px;
    background: linear-gradient(90deg, var(--accent), rgba(255,154,92,0));
    box-shadow: 0 0 8px var(--accent);
    transform-origin: left center;
  }
  .gr-rule-mid {
    background: linear-gradient(90deg, rgba(255,154,92,0), var(--accent), rgba(255,154,92,0));
    margin: 0 auto;
    transform-origin: center;
  }

  .gr-blurb {
    margin: 0;
    font-size: max(13px, calc(var(--u) * 2.6));
    line-height: 1.7;
    color: var(--ink-body);
    font-weight: 300;
  }

  .gr-stats {
    list-style: none;
    margin: 0;
    padding: 12px 0 0;
    display: flex;
    flex-wrap: wrap;
    gap: 12px 28px;
  }
  .gr-stats strong {
    display: block;
    font-family: "Outfit", sans-serif;
    font-size: max(16px, calc(var(--u) * 3.5));
    font-weight: 600;
    color: var(--accent-2);
    text-shadow: 0 0 8px rgba(255,176,124,0.4);
  }
  .gr-stats span {
    font-size: max(9px, calc(var(--u) * 1.6));
    letter-spacing: 0.1em;
    color: var(--ink-soft);
    text-transform: uppercase;
  }

  .gr-chips {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .gr-chips li {
    padding: 4px 10px;
    font-size: max(9px, calc(var(--u) * 1.7));
    letter-spacing: 0.04em;
    color: var(--accent-2);
    background: rgba(255,154,92,0.14);
    border: 1px solid rgba(255,154,92,0.32);
    border-radius: 999px;
    box-shadow: 0 0 8px rgba(255,154,92,0.1);
  }

  .gr-textpage {
    justify-content: center;
    gap: 16px;
    padding: clamp(28px, 6vh, 56px) clamp(24px, 3vw, 44px);
    overflow: hidden;
  }

  .gr-bignum {
    position: absolute;
    right: 5%;
    bottom: 3%;
    font-family: "Outfit", sans-serif;
    font-size: calc(var(--u) * 32);
    line-height: 1;
    color: rgba(255,255,255,0.05);
    pointer-events: none;
    user-select: none;
  }

  .gr-folio {
    position: absolute;
    left: 0;
    right: 0;
    bottom: calc(var(--u) * 5);
    margin: 0;
    text-align: center;
    font-family: "Outfit", sans-serif;
    font-size: max(9px, calc(var(--u) * 1.6));
    letter-spacing: 0.2em;
    color: var(--ink-soft);
  }

  .gr-photo {
    padding: calc(var(--u) * 10) calc(var(--u) * 8) calc(var(--u) * 12);
  }

  .gr-photo-frame {
    position: relative;
    flex: 1 1 auto;
    min-height: 0;
    overflow: hidden;
    background: #25143b;
    border: 1px solid rgba(255,154,92,0.45);
    border-radius: 6px;
    box-shadow: 0 0 22px rgba(255,154,92,0.18), inset 0 0 15px rgba(255,154,92,0.1);
  }

  .gr-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(1.06) contrast(1.06);
  }

  .gr-img-contain { object-fit: contain; background: transparent; }
  .gr-img-backdrop {
    object-fit: cover;
    transform: scale(1.1);
    filter: blur(16px) brightness(0.7);
  }
  .gr-img-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(transparent 80%, rgba(15,5,25,0.55));
  }

  .gr-plate {
    position: absolute;
    left: 0;
    right: 0;
    bottom: calc(var(--u) * 5);
    margin: 0;
    text-align: center;
    font-family: "Outfit", sans-serif;
    font-size: max(9px, calc(var(--u) * 1.6));
    letter-spacing: 0.25em;
    color: var(--ink-soft);
  }

  /* ---------- covers ---------- */
  .gr-cover {
    padding: calc(var(--u) * 5);
    color: #fff;
    background:
      radial-gradient(ellipse at 30% 20%, rgba(255,154,92,0.25), transparent 60%),
      radial-gradient(ellipse at 80% 90%, rgba(214,58,140,0.2), transparent 55%),
      linear-gradient(145deg, var(--leather-1), var(--leather-2));
    box-shadow: inset 0 0 50px rgba(0,0,0,0.6);
  }

  .gr-cover-frame {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: calc(var(--u) * 2.5);
    text-align: center;
    border: 1.5px solid rgba(255,176,124,0.5);
    outline: 1px solid rgba(255,255,255,0.1);
    outline-offset: -8px;
    border-radius: 4px;
    box-shadow: inset 0 0 35px rgba(255,154,92,0.15), 0 0 20px rgba(255,154,92,0.1);
  }

  .gr-corner {
    position: absolute;
    width: calc(var(--u) * 8);
    height: calc(var(--u) * 8);
    pointer-events: none;
  }
  .gr-corner-tl { top: 4px; left: 4px; }
  .gr-corner-tr { top: 4px; right: 4px; transform: scaleX(-1); }
  .gr-corner-bl { bottom: 4px; left: 4px; transform: scaleY(-1); }
  .gr-corner-br { bottom: 4px; right: 4px; transform: scale(-1, -1); }

  .gr-cover-top {
    margin: 0;
    font-family: "Outfit", sans-serif;
    font-size: max(9px, calc(var(--u) * 1.6));
    letter-spacing: 0.3em;
    color: var(--accent-2);
  }

  .gr-cover-title {
    margin: 0;
    font-family: "Outfit", sans-serif;
    font-weight: 600;
    font-size: max(42px, calc(var(--u) * 13));
    color: #fff;
    letter-spacing: -0.02em;
    text-shadow: 0 0 30px rgba(255,154,92,0.7), 0 0 10px rgba(255,255,255,0.8);
  }

  .gr-cover-rule { width: calc(var(--u) * 14); height: 1.5px; background: var(--accent); box-shadow: 0 0 8px var(--accent); }
  .gr-cover-sub {
    margin: 0;
    font-family: "Outfit", sans-serif;
    font-weight: 400;
    font-size: max(13px, calc(var(--u) * 3.5));
    letter-spacing: 0.35em;
    padding-left: 0.35em;
    color: var(--accent-2);
  }
  .gr-back-sub { font-size: max(11px, calc(var(--u) * 2.6)); letter-spacing: 0.3em; }

  .gr-seal {
    width: calc(var(--u) * 22);
    height: calc(var(--u) * 22);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Outfit", sans-serif;
    font-weight: 600;
    font-size: calc(var(--u) * 11);
    color: #fff;
    border: 1.5px solid var(--accent);
    border-radius: 50%;
    text-shadow: 0 0 14px rgba(255,154,92,0.8);
    box-shadow: inset 0 0 18px rgba(255,154,92,0.25), 0 0 18px rgba(255,154,92,0.2);
  }

  .gr-cover-hint {
    position: absolute;
    bottom: calc(var(--u) * 9.5);
    left: 0;
    right: 0;
    margin: 0;
    text-align: center;
    font-family: "Outfit", sans-serif;
    font-size: max(9px, calc(var(--u) * 1.6));
    letter-spacing: 0.25em;
    color: var(--accent-2);
    animation: gr-pulse 2s ease-in-out infinite;
    z-index: 7;
  }
  @keyframes gr-pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }

  /* ---------- final + end pages ---------- */
  .gr-final, .gr-end {
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 14px;
    padding: clamp(22px, 4vh, 44px) clamp(22px, 2.4vw, 36px);
  }
  .gr-final-wrap, .gr-end-wrap { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 14px; }

  .gr-final-title {
    margin: 0;
    font-family: "Outfit", sans-serif;
    font-weight: 600;
    font-size: max(32px, calc(var(--u) * 9));
    color: #fff;
    letter-spacing: -0.01em;
    text-shadow: 0 0 18px rgba(255,154,92,0.45);
  }
  .gr-final-date {
    margin: 0;
    font-family: "Outfit", sans-serif;
    font-size: max(12px, calc(var(--u) * 2.2));
    letter-spacing: 0.25em;
    color: var(--accent-2);
  }

  .gr-end-mark {
    font-family: "Outfit", sans-serif;
    font-weight: 600;
    font-size: calc(var(--u) * 20);
    line-height: 1;
    color: var(--accent);
    text-shadow: 0 0 22px rgba(255,154,92,0.6);
  }
  .gr-end-text {
    margin: 0;
    font-family: "Outfit", sans-serif;
    font-size: max(9px, calc(var(--u) * 1.8));
    letter-spacing: 0.3em;
    color: var(--ink-soft);
  }

  /* ---------- page reveal animations (play when a page comes into view) ---------- */
  @keyframes gr-rise {
    from { opacity: 0; transform: translateY(calc(var(--u) * 4)); filter: blur(4px); }
    to   { opacity: 1; transform: none; filter: blur(0); }
  }
  @keyframes gr-fade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes gr-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
  @keyframes gr-frame {
    from { opacity: 0; clip-path: inset(0 0 100% 0); }
    to   { opacity: 1; clip-path: inset(0 0 0 0); }
  }
  @keyframes gr-kenburns { from { transform: scale(1.14); } to { transform: scale(1); } }

  .is-live .gr-running { animation: gr-fade 0.8s 0.1s both; }
  .is-live .gr-bignum  { animation: gr-fade 1.4s 0.3s both; }
  .is-live .gr-kicker  { animation: gr-rise 0.7s 0.15s cubic-bezier(0.2,0.7,0.2,1) both; }
  .is-live .gr-title   { animation: gr-rise 0.8s 0.28s cubic-bezier(0.2,0.7,0.2,1) both; }
  .is-live .gr-rule    { animation: gr-grow 0.9s 0.45s cubic-bezier(0.2,0.7,0.2,1) both; }
  .is-live .gr-blurb   { animation: gr-rise 0.8s 0.55s cubic-bezier(0.2,0.7,0.2,1) both; }
  .is-live .gr-stats li {
    animation: gr-rise 0.6s cubic-bezier(0.2,0.7,0.2,1) both;
    animation-delay: calc(0.7s + var(--i, 0) * 0.12s);
  }
  .is-live .gr-chips li {
    animation: gr-rise 0.6s cubic-bezier(0.2,0.7,0.2,1) both;
    animation-delay: calc(0.8s + var(--i, 0) * 0.08s);
  }
  .is-live .gr-folio, .is-live .gr-plate { animation: gr-fade 0.8s 0.9s both; }
  .is-live .gr-photo-frame { animation: gr-frame 1s 0.2s cubic-bezier(0.2,0.7,0.2,1) both; }
  .is-live .gr-img:not(.gr-img-backdrop) { animation: gr-kenburns 7s 0.2s ease-out both; }
  .is-live .gr-seal, .is-live .gr-end-mark, .is-live .gr-final-title {
    animation: gr-rise 0.9s 0.25s cubic-bezier(0.2,0.7,0.2,1) both;
  }
  .is-live .gr-final-date, .is-live .gr-end-text { animation: gr-fade 1s 0.6s both; }

  /* ---------- previous / next page buttons ---------- */
  .gr-navbar {
    position: absolute;
    left: 0;
    right: 0;
    bottom: clamp(14px, 4vh, 34px);
    display: flex;
    justify-content: center;
    gap: 16px;
    z-index: 30;
  }
  .gr-nav {
    width: 46px;
    height: 46px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    color: var(--accent-2);
    background: rgba(25,12,45,0.82);
    border: 1px solid rgba(255,154,92,0.45);
    border-radius: 50%;
    cursor: pointer;
    backdrop-filter: blur(6px);
    box-shadow: 0 0 16px rgba(255,154,92,0.18), 0 6px 14px rgba(0,0,0,0.45);
    transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
    -webkit-tap-highlight-color: transparent;
  }
  .gr-nav svg { width: 22px; height: 22px; }
  .gr-nav:hover { background: rgba(255,154,92,0.22); box-shadow: 0 0 22px rgba(255,154,92,0.35), 0 6px 14px rgba(0,0,0,0.45); }
  .gr-nav:active { transform: scale(0.92); }
  .gr-nav:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

  /* ---------- continue button (appears once the book is closed) ---------- */
  .gr-continue-wrap {
    position: absolute;
    left: 0;
    right: 0;
    bottom: clamp(20px, 6vh, 52px);
    display: flex;
    justify-content: center;
    pointer-events: none;
    z-index: 30;
  }
  .gr-continue {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 10px 22px 8px;
    font-family: "Outfit", sans-serif;
    font-size: 12px;
    letter-spacing: 0.3em;
    color: var(--accent-2);
    background: rgba(15,6,24,0.7);
    border: 1px solid rgba(255,154,92,0.5);
    border-radius: 999px;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    backdrop-filter: blur(6px);
    box-shadow: 0 0 18px rgba(255,154,92,0.2);
  }
  .gr-continue svg { width: 18px; height: 18px; animation: gr-bob 1.6s ease-in-out infinite; }
  .gr-continue:hover { background: rgba(255,154,92,0.2); }
  .gr-continue:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
  @keyframes gr-bob { 0%, 100% { transform: translateY(-2px); } 50% { transform: translateY(3px); } }

  /* ---------- reduced-motion list ---------- */
  .gr-plain { display: grid; gap: 24px; justify-items: center; max-width: 900px; margin: 0 auto; padding: 64px 24px; }
  .gr-plain-title { margin: 0; font-family: "Outfit", sans-serif; font-weight: 500; font-size: clamp(36px, 7vw, 64px); color: #fff; }
  .gr-plain-card {
    --pw: 420px;
    --ph: 540px;
    --u: calc(var(--pw) / 100);
    position: relative;
    width: min(100%, 420px);
    height: 540px;
    overflow: hidden;
    background: var(--page-2);
    border-radius: 6px;
  }

  @media (max-width: 899px) {
    .gr-stage {
      --ph: min(76vh, 680px);
      --ph: min(76svh, 680px);
      --pw: min(92vw, calc(var(--ph) * 0.78));
    }
    .gr-blurb { font-size: max(13px, calc(var(--u) * 2.6)); }
  }

  @media (max-height: 640px) {
    .gr-chips { display: none; }
  }

  @media (max-width: 899px) and (max-height: 680px) {
    .gr-stats { display: none; }
  }
`;