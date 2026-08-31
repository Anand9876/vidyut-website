import React, { useState, useEffect, useRef } from 'react';
import { FastForward, ChevronDown, Zap, ArrowUpRight } from 'lucide-react';
import { sound } from '../audio/SoundEngine';

export const StoryMode = ({ onComplete }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeScene, setActiveScene] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // 2-Step Choreographed Entrance: Background sets up first, then content appears with style
  const [bgReady, setBgReady] = useState(false);
  const [contentReady, setContentReady] = useState(false);

  // Background plates
  const bgImages = [
    '/landing-pages/secret-pathways-assets/generated/kage-sanmon-preview.webp',
    '/landing-pages/secret-pathways-assets/generated/kage-approach.webp',
    '/landing-pages/secret-pathways-assets/generated/kage-lantern-court.webp',
    '/landing-pages/secret-pathways-assets/generated/kage-moonwater.webp',
  ];

  // Choreographed 2-Step Entrance
  useEffect(() => {
    // Step 1: Background environment sets up first (80ms)
    const t1 = setTimeout(() => {
      setBgReady(true);
    }, 80);

    // Step 2: Content appears with style after background is established (650ms)
    const t2 = setTimeout(() => {
      setContentReady(true);
    }, 650);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Sound cue on chapter change
  useEffect(() => {
    if (contentReady) {
      sound.playChapterTransition(activeScene);
    }
  }, [activeScene, contentReady]);

  // Handle continuous scroll & header split-fade
  const handleScroll = () => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll <= 0) return;

    const progress = Math.min(1, Math.max(0, el.scrollTop / maxScroll));
    setScrollProgress(progress);

    // Track scroll threshold for header split-fade animation
    if (el.scrollTop > 35) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }

    // 5 Story Beats (0 to 4)
    const sceneIndex = Math.min(4, Math.floor(progress * 5));
    if (sceneIndex !== activeScene) {
      setActiveScene(sceneIndex);
    }
  };

  // Intersection Observer for scroll-triggered kinetic reveals
  useEffect(() => {
    if (!contentReady) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('story-in-view');
          }
        });
      },
      { threshold: 0.25 }
    );

    document.querySelectorAll('.story-scene-container').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [contentReady]);

  // Canvas WebGL / 2D Simulation (Vermilion Moon, Starry Night, Embers, Horizon Mist)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Drifting embers
    const embers = [];
    for (let i = 0; i < 55; i++) {
      embers.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 0.6,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.7 - 0.3,
        alpha: Math.random() * 0.7 + 0.2,
        isVermilion: Math.random() > 0.55,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const time = Date.now() * 0.001;

      // 1. Vermilion Moon that subtly descends/rises with scroll
      const moonY = height * 0.35 + (scrollProgress - 0.5) * 120;
      const moonRadius = Math.min(width, height) * 0.24;

      const moonGlow = ctx.createRadialGradient(
        centerX,
        moonY,
        0,
        centerX,
        moonY,
        moonRadius * 1.6
      );
      moonGlow.addColorStop(0, 'rgba(229, 9, 20, 0.22)');
      moonGlow.addColorStop(0.4, 'rgba(229, 9, 20, 0.08)');
      moonGlow.addColorStop(1, 'transparent');

      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, moonY, moonRadius * 1.6, 0, Math.PI * 2);
      ctx.fillStyle = moonGlow;
      ctx.fill();
      ctx.restore();

      // Sharp Vermilion Moon Ring
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, moonY, moonRadius * 0.72, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(229, 9, 20, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // 2. Horizon Mist / Ground Fog Lines that shift with scroll
      for (let i = 0; i < 4; i++) {
        const lineY = height * 0.65 + i * 35 + Math.sin(time + i) * 6 - scrollProgress * 50;
        const lineGrad = ctx.createLinearGradient(0, 0, width, 0);
        lineGrad.addColorStop(0, 'transparent');
        lineGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.06)');
        lineGrad.addColorStop(1, 'transparent');

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, lineY);
        ctx.lineTo(width, lineY);
        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }

      // 3. Upward Drifting Embers with velocity affected by scroll
      embers.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.isVermilion
          ? `rgba(255, 90, 60, ${p.alpha})`
          : `rgba(255, 255, 255, ${p.alpha})`;
        ctx.shadowBlur = 9;
        ctx.shadowColor = p.isVermilion ? '#e50914' : '#ffffff';
        ctx.fill();
        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [scrollProgress]);

  const handleEnterFest = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    sound.playEnergySurge();
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  // Compute crossfade opacities for background stills based on scrollProgress (0 to 1)
  const getBgOpacity = (index) => {
    const segment = 1 / (bgImages.length - 1);
    const targetProgress = index * segment;
    const dist = Math.abs(scrollProgress - targetProgress);
    return Math.max(0, 1 - dist / segment);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black text-white select-none overflow-hidden font-montserrat">
      
      {/* 
        LAYER 1: Canvas WebGL simulation (Vermilion Moon, Starry Night, Embers)
        (Fades in first at Phase 1)
      */}
      <canvas
        ref={canvasRef}
        className={`fixed inset-0 w-full h-full pointer-events-none z-0 transition-all duration-1000 ease-out ${
          bgReady ? 'opacity-90 scale-100' : 'opacity-0 scale-105'
        }`}
      />

      {/* 
        LAYER 2: Crossfading Temple Background Images (Sanmon -> Approach -> Court -> Moonwater)
        (Fades in first at Phase 1)
      */}
      <div
        className={`fixed inset-0 z-0 pointer-events-none overflow-hidden transition-all duration-1000 ease-out ${
          bgReady ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {bgImages.map((src, idx) => (
          <div
            key={idx}
            className="absolute inset-0 transition-opacity duration-700 ease-out"
            style={{ opacity: getBgOpacity(idx) * 0.4 }}
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover object-center filter brightness-70 contrast-125 scale-105"
            />
          </div>
        ))}

        {/* Cinematic Scrim & Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(0,0,0,0.85)_80%,#000000_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-transparent to-black/95" />
      </div>

      {/* 
        LAYER 3: Parallax Foreground Silhouettes (Pine, Wall, Lantern, Sakura, Bushes, Stones)
      */}
      <div
        className={`fixed inset-0 z-10 pointer-events-none overflow-hidden transition-all duration-1000 ease-out ${
          bgReady ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div
          className="absolute -left-12 sm:-left-4 bottom-0 w-44 sm:w-64 md:w-80 opacity-35 transition-transform duration-300 ease-out"
          style={{ transform: `translate3d(0, ${scrollProgress * 80}px, 0)` }}
        >
          <img
            src="/landing-pages/secret-pathways-assets/foreground/png/pine-tree.webp"
            alt=""
            className="w-full h-auto object-contain filter brightness-40"
          />
        </div>

        <div
          className="absolute -right-12 sm:-right-4 top-0 w-44 sm:w-64 md:w-80 opacity-30 transition-transform duration-300 ease-out"
          style={{ transform: `translate3d(0, ${-scrollProgress * 60}px, 0)` }}
        >
          <img
            src="/landing-pages/secret-pathways-assets/foreground/png/sakura-branch.webp"
            alt=""
            className="w-full h-auto object-contain filter brightness-40"
          />
        </div>

        <div
          className="absolute left-1/4 -bottom-10 w-40 sm:w-60 opacity-30 transition-transform duration-300 ease-out"
          style={{ transform: `translate3d(0, ${scrollProgress * 40}px, 0)` }}
        >
          <img
            src="/landing-pages/secret-pathways-assets/foreground/png/basalt-stones.webp"
            alt=""
            className="w-full h-auto object-contain filter brightness-40"
          />
        </div>
      </div>

      {/* 
        FIXED HUD HEADER: Dynamic split-fade & zoom out on scroll
      */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 max-w-7xl mx-auto px-6 sm:px-10 h-20 flex items-center justify-between pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          contentReady ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
        }`}
      >
        {/* Left Side: "VIDYUT • THE STORY OF THE SPARK" (Slides left & zooms out on scroll) */}
        <div
          className={`flex items-center gap-3 pointer-events-auto transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isScrolled
              ? '-translate-x-16 opacity-0 scale-90 pointer-events-none'
              : 'translate-x-0 opacity-100 scale-100'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-crimson-accent shadow-red-laser" />
          <span className="text-[10px] sm:text-xs font-syncopate font-semibold tracking-[0.3em] text-white/80 uppercase">
            VIDYUT • THE STORY OF THE SPARK
          </span>
        </div>

        {/* Right Side: "SKIP STORY" (Slides right & zooms out on scroll) */}
        <button
          onClick={onComplete}
          className={`pointer-events-auto flex items-center gap-2 text-[10px] font-syncopate tracking-[0.22em] text-white/70 hover:text-white uppercase px-4 py-1.5 rounded-full border border-white/15 hover:border-white/40 bg-black/60 backdrop-blur-md hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isScrolled
              ? 'translate-x-16 opacity-0 scale-90 pointer-events-none'
              : 'translate-x-0 opacity-100 scale-100'
          }`}
        >
          <span>SKIP STORY</span>
          <FastForward className="w-3 h-3 text-crimson-accent" />
        </button>
      </header>

      {/* 
        FIXED HUD SIDE PROGRESS TRACKER: Glides in at Phase 2
      */}
      <div
        className={`fixed right-6 sm:right-10 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-end gap-5 pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          contentReady ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
        }`}
      >
        {['01 山門', '02 参道', '03 灯籠', '04 月水', '05 変革'].map((label, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-3 text-[10px] font-syncopate tracking-[0.2em] uppercase transition-all duration-500 ${
              activeScene === idx ? 'text-white scale-105' : 'text-white/40 opacity-50'
            }`}
          >
            <span>{label}</span>
            <span
              className={`h-1.5 rounded-full transition-all duration-500 ${
                activeScene === idx ? 'w-6 bg-crimson-accent shadow-red-laser' : 'w-1.5 bg-white/20'
              }`}
            />
          </div>
        ))}
      </div>

      {/* 
        CONTINUOUS SINGLE-PAGE SCROLL CONTAINER (Reveals with style at Phase 2)
      */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className={`w-full h-full overflow-y-auto relative z-20 scroll-smooth transition-opacity duration-700 ${
          contentReady ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* =============================================================
            SCENE 01: [TEXT ON LEFT] | [COMIC PICTURE ON RIGHT]
        ============================================================= */}
        <section className="story-scene-container min-h-screen flex flex-col justify-center items-center px-6 sm:px-12 lg:px-20 py-24 relative group">
          <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            
            {/* Left Column: Story Text with kinetic scroll reveal */}
            <div className="text-left transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] transform opacity-0 translate-y-12 group-[.story-in-view]:opacity-100 group-[.story-in-view]:translate-y-0">
              
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full border border-white/10 bg-black/60 backdrop-blur-md text-[10px] sm:text-xs font-syncopate tracking-[0.25em] text-white/80 uppercase mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-crimson-accent" />
                <span>01 • 山門 • THE STILL MIND</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-syncopate font-bold text-white tracking-wide uppercase leading-snug drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)] transition-all duration-700 delay-150">
                A novice stood before the charred temple gate, gazing into the dark mountain.
              </h2>

              <p className="mt-6 text-sm sm:text-base font-montserrat text-white/80 leading-relaxed font-light tracking-wide transition-all duration-700 delay-300">
                “Master, the world is cold and unlit. How shall we find our way through the dark?”
              </p>

              <div className="mt-8 flex items-center gap-2 text-[10px] font-syncopate tracking-[0.22em] text-white/50 animate-subtle-pulse">
                <span>SCROLL TO ADVANCE</span>
                <ChevronDown className="w-3.5 h-3.5 animate-bounce text-crimson-accent" />
              </div>
            </div>

            {/* Right Column: Full-Bleed Comic Picture Frame */}
            <div className="comic-storybook-panel w-full aspect-[4/3] rounded-2xl border border-white/20 bg-white/[0.03] backdrop-blur-md p-3 relative overflow-hidden transition-all duration-1000 delay-200 ease-[cubic-bezier(0.16,1,0.3,1)] transform opacity-0 translate-x-12 scale-95 group-[.story-in-view]:opacity-100 group-[.story-in-view]:translate-x-0 group-[.story-in-view]:scale-100 hover:border-crimson-accent/60 shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
              <div className="w-full h-full rounded-xl overflow-hidden relative border border-white/10 bg-black/40 flex flex-col justify-between p-5">
                
                <img
                  src="/landing-pages/secret-pathways-assets/generated/kage-sanmon-preview.webp"
                  alt="Sanmon Gate"
                  className="absolute inset-0 w-full h-full object-cover filter brightness-75 contrast-125 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-[9px] font-syncopate tracking-[0.2em] text-white/90 uppercase border border-white/15">
                    PANEL 01
                  </span>
                  <span className="text-xs font-syncopate text-crimson-accent font-bold">山門</span>
                </div>

                <div className="relative z-10 text-left">
                  <div className="text-[10px] font-syncopate font-bold tracking-[0.2em] text-white uppercase">
                    [ ACTOR STAGE • NOVICE AT THE GATE ]
                  </div>
                  <div className="text-xs font-montserrat text-white/70 italic mt-0.5">
                    Character silhouette looking out into the mountain darkness
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* =============================================================
            SCENE 02: [COMIC PICTURE ON LEFT] | [TEXT ON RIGHT]
        ============================================================= */}
        <section className="story-scene-container min-h-screen flex flex-col justify-center items-center px-6 sm:px-12 lg:px-20 py-24 relative group">
          <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            
            {/* Left Column: Full-Bleed Comic Picture Frame */}
            <div className="order-2 lg:order-1 comic-storybook-panel w-full aspect-[4/3] rounded-2xl border border-white/20 bg-white/[0.03] backdrop-blur-md p-3 relative overflow-hidden transition-all duration-1000 delay-200 ease-[cubic-bezier(0.16,1,0.3,1)] transform opacity-0 -translate-x-12 scale-95 group-[.story-in-view]:opacity-100 group-[.story-in-view]:translate-x-0 group-[.story-in-view]:scale-100 hover:border-crimson-accent/60 shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
              <div className="w-full h-full rounded-xl overflow-hidden relative border border-white/10 bg-black/40 flex flex-col justify-between p-5">
                
                <img
                  src="/landing-pages/secret-pathways-assets/generated/kage-approach.webp"
                  alt="Forest Approach"
                  className="absolute inset-0 w-full h-full object-cover filter brightness-75 contrast-125 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-[9px] font-syncopate tracking-[0.2em] text-white/90 uppercase border border-white/15">
                    PANEL 02
                  </span>
                  <span className="text-xs font-syncopate text-crimson-accent font-bold">参道</span>
                </div>

                <div className="relative z-10 text-left">
                  <div className="text-[10px] font-syncopate font-bold tracking-[0.2em] text-white uppercase">
                    [ ACTOR STAGE • MASTER BESIDE THE LANTERN ]
                  </div>
                  <div className="text-xs font-montserrat text-white/70 italic mt-0.5">
                    The dormant spark waiting within the stone
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Story Text */}
            <div className="order-1 lg:order-2 text-left transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] transform opacity-0 translate-y-12 group-[.story-in-view]:opacity-100 group-[.story-in-view]:translate-y-0">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full border border-white/10 bg-black/60 backdrop-blur-md text-[10px] sm:text-xs font-syncopate tracking-[0.25em] text-white/80 uppercase mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-crimson-accent" />
                <span>02 • 参道 • THE UNLIT LANTERN</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-syncopate font-bold text-white tracking-wide uppercase leading-snug drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)] transition-all duration-700 delay-150">
                The Master stopped beside the moss-grown pines before a silent stone lantern.
              </h2>

              <p className="mt-6 text-sm sm:text-base font-montserrat text-white/80 leading-relaxed font-light tracking-wide transition-all duration-700 delay-300">
                “The stone does not beg the sun to shine. It only waits for a single ember from within.”
              </p>
            </div>

          </div>
        </section>

        {/* =============================================================
            SCENE 03: [TEXT ON LEFT] | [COMIC PICTURE ON RIGHT]
        ============================================================= */}
        <section className="story-scene-container min-h-screen flex flex-col justify-center items-center px-6 sm:px-12 lg:px-20 py-24 relative group">
          <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            
            {/* Left Column: Story Text */}
            <div className="text-left transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] transform opacity-0 translate-y-12 group-[.story-in-view]:opacity-100 group-[.story-in-view]:translate-y-0">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full border border-white/10 bg-black/60 backdrop-blur-md text-[10px] sm:text-xs font-syncopate tracking-[0.25em] text-white/80 uppercase mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-crimson-accent" />
                <span>03 • 灯籠 • THE CONVERGENCE</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-syncopate font-bold text-white tracking-wide uppercase leading-snug drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)] transition-all duration-700 delay-150">
                As one flame touched another, a thousand lanterns ignited across the courtyard.
              </h2>

              <p className="mt-6 text-sm sm:text-base font-montserrat text-white/80 leading-relaxed font-light tracking-wide transition-all duration-700 delay-300">
                “A single flame loses nothing when kindling another. It turns the vast darkness into an ocean of light.”
              </p>
            </div>

            {/* Right Column: Full-Bleed Comic Picture Frame */}
            <div className="comic-storybook-panel w-full aspect-[4/3] rounded-2xl border border-white/20 bg-white/[0.03] backdrop-blur-md p-3 relative overflow-hidden transition-all duration-1000 delay-200 ease-[cubic-bezier(0.16,1,0.3,1)] transform opacity-0 translate-x-12 scale-95 group-[.story-in-view]:opacity-100 group-[.story-in-view]:translate-x-0 group-[.story-in-view]:scale-100 hover:border-crimson-accent/60 shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
              <div className="w-full h-full rounded-xl overflow-hidden relative border border-white/10 bg-black/40 flex flex-col justify-between p-5">
                
                <img
                  src="/landing-pages/secret-pathways-assets/generated/kage-lantern-court.webp"
                  alt="Lantern Court"
                  className="absolute inset-0 w-full h-full object-cover filter brightness-75 contrast-125 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-[9px] font-syncopate tracking-[0.2em] text-white/90 uppercase border border-white/15">
                    PANEL 03
                  </span>
                  <span className="text-xs font-syncopate text-crimson-accent font-bold">灯籠</span>
                </div>

                <div className="relative z-10 text-left">
                  <div className="text-[10px] font-syncopate font-bold tracking-[0.2em] text-white uppercase">
                    [ ACTOR STAGE • THOUSAND LANTERNS IGNITE ]
                  </div>
                  <div className="text-xs font-montserrat text-white/70 italic mt-0.5">
                    45,000 sparks converging across the nation
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* =============================================================
            SCENE 04: [COMIC PICTURE ON LEFT] | [TEXT ON RIGHT]
        ============================================================= */}
        <section className="story-scene-container min-h-screen flex flex-col justify-center items-center px-6 sm:px-12 lg:px-20 py-24 relative group">
          <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            
            {/* Left Column: Full-Bleed Comic Picture Frame */}
            <div className="order-2 lg:order-1 comic-storybook-panel w-full aspect-[4/3] rounded-2xl border border-white/20 bg-white/[0.03] backdrop-blur-md p-3 relative overflow-hidden transition-all duration-1000 delay-200 ease-[cubic-bezier(0.16,1,0.3,1)] transform opacity-0 -translate-x-12 scale-95 group-[.story-in-view]:opacity-100 group-[.story-in-view]:translate-x-0 group-[.story-in-view]:scale-100 hover:border-crimson-accent/60 shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
              <div className="w-full h-full rounded-xl overflow-hidden relative border border-white/10 bg-black/40 flex flex-col justify-between p-5">
                
                <img
                  src="/landing-pages/secret-pathways-assets/generated/kage-moonwater.webp"
                  alt="Moonwater Lake"
                  className="absolute inset-0 w-full h-full object-cover filter brightness-75 contrast-125 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-[9px] font-syncopate tracking-[0.2em] text-white/90 uppercase border border-white/15">
                    PANEL 04
                  </span>
                  <span className="text-xs font-syncopate text-crimson-accent font-bold">月水</span>
                </div>

                <div className="relative z-10 text-left">
                  <div className="text-[10px] font-syncopate font-bold tracking-[0.2em] text-white uppercase">
                    [ ACTOR STAGE • RIPPLES IN THE WATER ]
                  </div>
                  <div className="text-xs font-montserrat text-white/70 italic mt-0.5">
                    The stone that breaks the surface of stillness
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Story Text */}
            <div className="order-1 lg:order-2 text-left transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] transform opacity-0 translate-y-12 group-[.story-in-view]:opacity-100 group-[.story-in-view]:translate-y-0">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full border border-white/10 bg-black/60 backdrop-blur-md text-[10px] sm:text-xs font-syncopate tracking-[0.25em] text-white/80 uppercase mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-crimson-accent" />
                <span>04 • 月水 • THE RIPPLE</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-syncopate font-bold text-white tracking-wide uppercase leading-snug drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)] transition-all duration-700 delay-150">
                Beneath the vermilion moon, the lake lay as still as mirror glass.
              </h2>

              <p className="mt-6 text-sm sm:text-base font-montserrat text-white/80 leading-relaxed font-light tracking-wide transition-all duration-700 delay-300">
                “If you wish the reflection to ripple across the water, you must be the stone that breaks the surface.”
              </p>
            </div>

          </div>
        </section>

        {/* =============================================================
            SCENE 05: GRAND CENTERPIECE & THEME REVELATION (BE THE CHANGE)
        ============================================================= */}
        <section className="story-scene-container min-h-screen flex flex-col justify-center items-center px-6 sm:px-12 py-24 relative group">
          <div className="max-w-4xl w-full mx-auto text-center transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] transform opacity-0 translate-y-16 group-[.story-in-view]:opacity-100 group-[.story-in-view]:translate-y-0">
            
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full border border-white/10 bg-black/60 backdrop-blur-md text-[10px] sm:text-xs font-syncopate tracking-[0.25em] text-white/80 uppercase mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-crimson-accent" />
              <span>05 • 黎明 • THE REVELATION</span>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-syncopate font-bold text-white uppercase tracking-wider leading-snug max-w-2xl mx-auto">
              Do not wait for the storm to pass. Do not wait for the world to change you.
            </h2>

            <div className="w-16 h-[1px] bg-crimson-accent mx-auto my-6" />

            <div className="text-[11px] font-syncopate tracking-[0.35em] text-white/70 uppercase mb-2">
              自分自身が変革となれ
            </div>

            {/* Monumental Theme Display Title */}
            <h1 className="font-impact text-6xl sm:text-8xl md:text-9xl lg:text-[10.5rem] uppercase tracking-[0.14em] text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] via-[#cbd5e1] to-[#64748b] drop-shadow-[0_4px_45px_rgba(255,255,255,0.45)] select-none leading-none my-4">
              BE THE CHANGE
            </h1>

            {/* Full Width Comic Hero Staging Panel */}
            <div className="comic-storybook-panel max-w-lg mx-auto aspect-[16/9] rounded-2xl border border-crimson-accent/50 bg-white/[0.03] backdrop-blur-md p-3 relative overflow-hidden group hover:border-crimson-accent transition-all shadow-[0_0_40px_rgba(229,9,20,0.3)] mt-6">
              <div className="w-full h-full rounded-xl overflow-hidden relative border border-white/10 bg-black/60 flex flex-col justify-between p-4">
                
                <img
                  src="/landing-pages/secret-pathways-assets/generated/kage-moonwater.webp"
                  alt="Awakening"
                  className="absolute inset-0 w-full h-full object-cover filter brightness-85 contrast-125 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-[9px] font-syncopate tracking-[0.2em] text-white font-bold uppercase border border-crimson-accent/40">
                    FINALE PANEL
                  </span>
                  <span className="text-xs font-syncopate text-crimson-accent font-bold">変革</span>
                </div>

                <div className="relative z-10 text-left">
                  <div className="text-[10px] font-syncopate font-black tracking-[0.2em] text-crimson-accent uppercase">
                    [ ACTOR STAGE • HERO AWAKENING ]
                  </div>
                  <div className="text-xs font-montserrat text-white/90 italic mt-0.5">
                    Igniting the dawn of VIDYUT 2026
                  </div>
                </div>

              </div>
            </div>

            {/* Enter Festival Action Button */}
            <div className="mt-10">
              <button
                onClick={handleEnterFest}
                className="px-9 py-4 rounded-full bg-white text-black font-syncopate font-bold text-xs tracking-[0.24em] uppercase shadow-silver-glow hover:bg-gray-200 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-3 group"
              >
                <Zap className="w-4 h-4 fill-current text-crimson-accent group-hover:rotate-12 transition-transform" />
                <span>ENTER VIDYUT 2026</span>
                <ArrowUpRight className="w-4 h-4 text-black" />
              </button>
            </div>

          </div>
        </section>
      </div>

      {/* 
        FIXED HUD FOOTER: Drops in at Phase 2
      */}
      <footer
        className={`fixed bottom-0 left-0 right-0 z-40 max-w-7xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          contentReady ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        {/* Stepper Dots */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className={`h-1 rounded-full transition-all duration-500 ${
                  activeScene === idx
                    ? 'w-8 bg-crimson-accent shadow-red-laser'
                    : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] font-syncopate text-white/50 tracking-widest ml-2">
            0{activeScene + 1} • 05
          </span>
        </div>

        {/* Continuous Scroll Percentage Progress Indicator */}
        <div className="pointer-events-auto flex items-center gap-3">
          <div className="w-24 sm:w-32 h-[1px] bg-white/10 relative overflow-hidden rounded-full">
            <div
              className="absolute left-0 top-0 bottom-0 bg-crimson-accent transition-all duration-150"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>
          <span className="text-[9px] font-syncopate text-white/80 tracking-widest">
            {Math.round(scrollProgress * 100)}%
          </span>
        </div>
      </footer>
    </div>
  );
};
