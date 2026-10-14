
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
  'JANUARY 16, 2027',
  'ONE STAGE. COUNTLESS TALENTS.',
  'AMRITA VISHWA VIDYAPEETHAM',
];

const CARD_LINES = [
  'LIVE THE MOMENT',
  'JANUARY 16, 2027',
  'ONE STAGE.',
  'COUNTLESS TALENTS.',
  'MUSIC · CULTURE · ENERGY',
];

const IMAGE_URL =
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1400&q=80';

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

function useIntroScrollLock(locked) {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!locked) return undefined;

    const root = document.documentElement;
    const previous = root.style.overflow;

    root.style.overflow = 'hidden';

    return () => {
      root.style.overflow = previous;
    };
  }, [locked]);
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

    const detailTimer = setTimeout(
      () => setDetailsOn(true),
      1500
    );

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
            stroke="rgba(150,210,255,0.55)"
            strokeWidth="1"
            strokeLinejoin="round"
            style={{
              filter:
                'drop-shadow(0 0 4px rgba(80,170,255,0.55))',
            }}
          />

          {lines.accents.map((d, i) => (
            <path
              key={i}
              d={d}
              pathLength="1"
              fill="none"
              stroke="#7fd0ff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="1"
              strokeDashoffset={detailsOn ? 0 : 1}
              style={{
                filter:
                  'drop-shadow(0 0 6px rgba(80,180,255,0.9))',
                transition:
                  `stroke-dashoffset 1100ms ease ${i * 140}ms`,
              }}
            />
          ))}

          <path
            d={lines.bars}
            fill="none"
            stroke="#7fd0ff"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{
              ...fade,
              filter:
                'drop-shadow(0 0 5px rgba(80,180,255,0.8))',
            }}
          />

          <path
            d={lines.ticks}
            fill="none"
            stroke="rgba(190,225,255,0.55)"
            strokeWidth="1"
            style={fade}
          />
        </svg>
      )}
    </div>
  );
}

function ChargeUnit({ value, label, max }) {
  const number = Math.max(Number(value) || 0, 0);
  const text = String(number).padStart(2, '0');

  const top =
    20 + (1 - Math.min(number / max, 1)) * 60;

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
        <span className="hidden h-px w-5 bg-white/30 sm:block" />
        {label}
      </div>
    </div>
  );
}

function SecondRuler({ seconds }) {
  return (
    <div
      className="mt-5 flex h-4 items-end justify-between"
      aria-hidden="true"
    >
      {Array.from({ length: 60 }, (_, i) => {
        const height =
          i === seconds
            ? 'h-4'
            : i % 5 === 0
              ? 'h-3'
              : 'h-1.5';

        const color =
          i === seconds
            ? 'bg-sky-300'
            : i < seconds
              ? 'bg-white/45'
              : 'bg-white/10';

        return (
          <span
            key={i}
            className={`w-px ${height} ${color}`}
          />
        );
      })}
    </div>
  );
}

const Cursor = () => (
  <span className="ml-1 animate-pulse text-sky-300">
    ▍
  </span>
);

function HeroScene({ onNavbarReady, start }) {
  const timeLeft = useCountdown(EVENT_DATE);
  const rootRef = useRef(null);

  const visible = useVisibleGate(rootRef, start);
  const stage = useIntroStage(onNavbarReady, visible);

  useIntroScrollLock(
    visible && stage < STAGE.CLOCK
  );

  const contentOn = stage >= STAGE.CONTENT;

  const typedCopy = useTypedBlock(COPY_LINES, contentOn);
  const typedCard = useTypedBlock(CARD_LINES, contentOn);

  const moved = stage >= STAGE.MOVED;

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
    <main
      ref={rootRef}
      className="vidyut-page isolate flex min-h-screen min-h-[100svh] flex-col overflow-x-clip bg-black text-white"
    >
      <style>{STYLES}</style>

      <HudFrame active={stage >= STAGE.FRAME} />

      <div className="page-frame">
        <div className="background-glow">
          <div className="background-grid" />
        </div>

        <section className="hero-section">
          <div className="vidyut-canvas">
            <h1
              className="vidyut-title eagle-lake-regular"
              style={{
                position: 'absolute',

                left: moved ? '0' : '50%',

                /* VIDYUT stays on the top row */
                top: moved ? '2.5rem' : '50%',

                transformOrigin: 'left top',

                transform: moved
                  ? 'translate(0, 0) scale(0.46)'
                  : 'translate(-50%, -50%) scale(1)',

                zIndex: 50,

                opacity: stage === STAGE.START ? 0 : 1,

                filter:
                  stage === STAGE.START
                    ? 'blur(10px)'
                    : 'blur(0)',

                willChange: 'left, top, transform',

                transition:
                  'left 2400ms cubic-bezier(0.16, 1, 0.3, 1), top 2400ms cubic-bezier(0.16, 1, 0.3, 1), transform 2400ms cubic-bezier(0.16, 1, 0.3, 1), opacity 1000ms ease, filter 1000ms ease',

                textShadow:
                  '0 0 45px rgba(65,155,255,0.4)',
              }}
            >
              VIDYUT
            </h1>

            <div
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
                <div
                  key={i}
                  className={`copy-line copy-line-${i + 1}`}
                >
                  <p>
                    {line.text || ' '}
                    {line.active && <Cursor />}
                  </p>
                </div>
              ))}
            </div>

            <div
              className="hero-image"
              style={{
                opacity: contentOn ? 1 : 0,

                transform: contentOn
                  ? 'translate3d(0,0,0) scale(1)'
                  : 'translate3d(0,18px,0) scale(0.985)',

                pointerEvents: contentOn ? 'auto' : 'none',
              }}
            >
              <div className="image-card">
                <img
                  src={IMAGE_URL}
                  alt="Festival stage with live music and dramatic lighting"
                  loading="eager"
                />

                <div className="image-overlay" />

                <div className="image-top-label">
                  <span className="live-dot" />

                  <span>
                    {typedCard[0].text}
                    {typedCard[0].active && <Cursor />}
                  </span>
                </div>

                <div className="image-bottom-content">
                  <p className="image-date">
                    {typedCard[1].text || ' '}
                    {typedCard[1].active && <Cursor />}
                  </p>

                  <h2>
                    <span>
                      {typedCard[2].text || ' '}
                      {typedCard[2].active && <Cursor />}
                    </span>

                    <span>
                      {typedCard[3].text || ' '}
                      {typedCard[3].active && <Cursor />}
                    </span>
                  </h2>

                  <div className="image-footer">
                    <span />
                    <p>
                      {typedCard[4].text || ' '}
                      {typedCard[4].active && <Cursor />}
                    </p>
                  </div>
                </div>
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
                {i > 0 && (
                  <span className="timer-slash" />
                )}

                <ChargeUnit {...item} />
              </React.Fragment>
            ))}
          </div>

          <SecondRuler seconds={timeLeft.seconds} />

          <div className="clock-footer">
            <span>JAN 16 · 2027</span>
            <span>
              {totalHours.toLocaleString('en-US')} HRS TO GO
            </span>
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

  .vidyut-page {
    position: relative;
    width: 100%;
    color: #fff;
    background: #000;
    font-family: "Goldman", sans-serif;
  }

  .page-frame {
    position: relative;
    width: 100%;
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    padding: 3.5rem;
  }

  .background-glow {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: -1;
    background:
      radial-gradient(
        ellipse at 28% 40%,
        rgba(20,70,160,0.22),
        transparent 58%
      ),
      radial-gradient(
        ellipse at 75% 75%,
        rgba(10,35,80,0.16),
        transparent 50%
      );
  }

  .background-grid {
    position: absolute;
    inset: 0;
    opacity: 0.04;
    background-image:
      linear-gradient(rgba(110,170,255,0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(110,170,255,0.08) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  .hud-frame {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 40;
  }

  .hero-section {
    position: relative;
    z-index: 10;
    display: flex;
    width: 100%;
    flex: 1;
    align-items: center;
    justify-content: center;
    padding: 1.5rem 0;
  }

  .vidyut-canvas {
    position: relative;
    width: 100%;
    max-width: 1400px;
    min-height: clamp(500px, 54vh, 600px);
    margin: 0 auto;
  }

  .vidyut-title {
    margin: 0;
    line-height: 0.95;
    white-space: nowrap;
    font-size: clamp(90px, 18vw, 240px);
    color: #e9f3ff;
  }

  .eagle-lake-regular {
    font-family: "Eagle Lake", serif;
    font-weight: 400;
  }

  .hero-copy {
    position: absolute;

    /* IMPORTANT: text goes BELOW VIDYUT */
    left: 0;
    top: 9rem;

    width: 52%;
    min-height: 100px;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    z-index: 12;

    transition:
      opacity 1000ms ease,
      transform 1200ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .copy-line {
    width: 100%;
    min-height: 1.4em;
    margin: 0 0 8px;
    animation: copy-appear 900ms ease both;
  }

  .copy-line p {
    margin: 0;
    line-height: 1.45;
    overflow-wrap: anywhere;
  }

  .copy-line-1 p {
    font-size: clamp(18px, 1.6vw, 26px);
    letter-spacing: 0.12em;
    color: #f0f5ff;
  }

  .copy-line-2 p {
    font-size: clamp(14px, 1.2vw, 19px);
    letter-spacing: 0.1em;
    color: #fff;
  }

  .copy-line-3 p {
    font-size: clamp(12px, 1vw, 16px);
    letter-spacing: 0.12em;
    color: #8292ab;
  }

  .hero-image {
    position: absolute;
    top: 90px;
    right: 0;
    width: 46%;
    max-width: 560px;

    z-index: 10;

    transition:
      opacity 1400ms ease,
      transform 1600ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .image-card {
    position: relative;
    width: 100%;
    overflow: hidden;
    border: 1px solid rgba(125,211,252,0.2);
    border-radius: 12px;
    background: #050812;
    box-shadow: 0 0 50px rgba(25,100,220,0.12);
  }

  .image-card > img {
    display: block;
    width: 100%;
    height: clamp(280px, 27vw, 350px);
    object-fit: cover;
    opacity: 0.75;
  }

  .image-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(
      to top,
      #000 0%,
      rgba(0,0,0,0.75) 20%,
      rgba(0,0,0,0.1) 100%
    );
  }

  .image-top-label {
    position: absolute;
    top: 20px;
    left: 20px;
    right: 12px;

    display: flex;
    align-items: center;
    gap: 8px;

    color: rgba(255,255,255,0.8);
    font-size: 15px;
    letter-spacing: 0.17em;
  }

  .live-dot {
    width: 7px;
    height: 7px;
    flex-shrink: 0;
    border-radius: 50%;
    background: #7dd3fc;
    animation: live-pulse 1.5s infinite;
  }

  .image-bottom-content {
    position: absolute;
    bottom: 20px;
    left: 20px;
    right: 20px;
  }

  .image-date {
    min-height: 1.3em;
    margin: 0;
    color: #7dd3fc;
    font-size: 12px;
    letter-spacing: 0.22em;
  }

  .image-bottom-content h2 {
    display: flex;
    flex-direction: column;
    margin: 8px 0 0;
    font-size: 24px;
    line-height: 1.35;
  }

  .image-bottom-content h2 span:first-child {
    color: #fff;
  }

  .image-bottom-content h2 span:last-child {
    color: #7dd3fc;
  }

  .image-footer {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
  }

  .image-footer > span {
    width: 24px;
    height: 1px;
    flex-shrink: 0;
    background: #7dd3fc;
  }

  .image-footer p {
    margin: 0;
    color: rgba(255,255,255,0.7);
    font-size: 10px;
    letter-spacing: 0.12em;
  }

  .hero-clock {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 680px;
    margin: 0 auto;
    padding-bottom: 8px;

    transition:
      opacity 1000ms ease,
      transform 1200ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .clock-heading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 8px;
  }

  .clock-heading span {
    width: 24px;
    height: 1px;
    background: rgba(125,211,252,0.5);
  }

  .clock-heading p {
    margin: 0;
    color: rgba(203,213,225,0.8);
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
    font-size: clamp(38px, 10vw, 96px);
    line-height: 1.1;
  }

  .timer-num-outline {
    display: block;
    color: transparent;
    -webkit-text-stroke: 1px rgba(233,243,255,0.5);
  }

  .timer-num-fill {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    color: #65c7ff;
    transition: clip-path 1s linear;
  }

  .timer-label {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
    color: rgba(203,213,225,0.7);
    font-size: 10px;
    letter-spacing: 0.25em;
  }

  .timer-slash {
    align-self: flex-start;
    flex-shrink: 0;
    width: 1px;
    height: calc(clamp(38px, 10vw, 96px) * 1.1);
    background: rgba(255,255,255,0.22);
    transform: rotate(20deg);
  }

  .clock-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 12px;
    color: rgba(148,163,184,0.7);
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

  @keyframes live-pulse {
    0%, 100% {
      opacity: 1;
    }

    50% {
      opacity: 0.4;
    }
  }

  @media (min-width: 1024px) {
    .page-frame {
      padding: 3.5rem;
    }

    .vidyut-canvas {
      min-height: clamp(500px, 54vh, 600px);
    }

    /* Keep all text BELOW VIDYUT */
    .hero-copy {
      left: 0;
      top: 9rem;
      width: 52%;
    }

    .hero-image {
      top: 90px;
      right: 0;
      width: 46%;
    }
  }

  @media (min-width: 640px) and (max-width: 1023px) {
    .page-frame {
      padding: 3rem 2rem;
    }

    .vidyut-canvas {
      min-height: 650px;
    }

    .vidyut-title {
      font-size: clamp(90px, 16vw, 170px);
    }

    .hero-copy {
      left: 0;
      top: 8.5rem;
      width: 100%;
    }

    .hero-image {
      top: 280px;
      left: 0;
      right: auto;
      width: min(100%, 500px);
    }

    .image-card > img {
      height: 280px;
    }
  }

  @media (max-width: 639px) {
    .page-frame {
      padding: 2.75rem 1.5rem;
      gap: 0.5rem;
    }

    .hero-section {
      padding: 1rem 0;
    }

    .vidyut-canvas {
      min-height: 650px;
    }

    .vidyut-title {
      font-size: clamp(74px, 17vw, 110px);
    }

    .hero-copy {
      left: 0;
      top: 7rem;
      width: 100%;
      min-height: auto;
    }

    .copy-line-1 p {
      font-size: 17px;
    }

    .copy-line-2 p {
      font-size: 13px;
    }

    .copy-line-3 p {
      font-size: 11px;
    }

    .hero-image {
      top: 230px;
      left: 0;
      right: auto;
      width: 100%;
    }

    .image-card > img {
      height: 240px;
    }

    .image-top-label {
      top: 12px;
      left: 12px;
      font-size: 11px;
    }

    .image-bottom-content {
      bottom: 12px;
      left: 12px;
      right: 12px;
    }

    .image-bottom-content h2 {
      font-size: 20px;
    }

    .hero-clock {
      max-width: 100%;
    }

    .clock-units {
      gap: 12px;
    }

    .timer-num {
      font-size: clamp(30px, 9vw, 48px);
    }

    .timer-slash {
      height: 50px;
    }

    .timer-label {
      font-size: 8px;
      letter-spacing: 0.12em;
    }

    .clock-footer {
      font-size: 8px;
      letter-spacing: 0.1em;
    }
  }
`;
