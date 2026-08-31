import React, { useState, useEffect, useRef } from 'react';
import { FastForward, Zap, ArrowUpRight, BookOpen, ChevronRight, ChevronLeft } from 'lucide-react';
import { sound } from '../audio/SoundEngine';

export const GRIMOIRE_SPREADS = [
  {
    id: 1,
    kanjiNumber: "一",
    roman: "CHAPTER I",
    title: "THE STILL MIND",
    kanjiTitle: "山門 • 静寂",
    dropCap: "A",
    lead: "novice stood before the charred temple gate, gazing into the dark mountain.",
    quote: "“Master, the world is cold and unlit. How shall we find our way through the vast silence?”",
    reflection: "The path does not reveal itself to the hesitant. It awaits the first brave step.",
    artImage: "/landing-pages/secret-pathways-assets/generated/kage-sanmon-preview.webp",
    artLabel: "SANMON GATE • THE THRESHOLD",
    artKanji: "山門",
  },
  {
    id: 2,
    kanjiNumber: "二",
    roman: "CHAPTER II",
    title: "THE UNLIT LANTERN",
    kanjiTitle: "参道 • 秘火",
    dropCap: "T",
    lead: "he Master stopped beside the moss-grown pines before a silent stone lantern.",
    quote: "“The stone does not beg the sun to shine. It only waits for a single ember from within.”",
    reflection: "Power is not given from the heavens. It is ignited from the core of your spirit.",
    artImage: "/landing-pages/secret-pathways-assets/generated/kage-approach.webp",
    artLabel: "FOREST APPROACH • THE STONE EMBERS",
    artKanji: "参道",
  },
  {
    id: 3,
    kanjiNumber: "三",
    roman: "CHAPTER III",
    title: "THE CONVERGENCE",
    kanjiTitle: "灯籠 • 共鳴",
    dropCap: "A",
    lead: "s one flame touched another, a thousand lanterns ignited across the sacred courtyard.",
    quote: "“A single flame loses nothing when kindling another. It turns the dark into an ocean of light.”",
    reflection: "45,000 sparks from across the nation converging upon Amrita as one unified storm.",
    artImage: "/landing-pages/secret-pathways-assets/generated/kage-lantern-court.webp",
    artLabel: "LANTERN COURT • THE OCEAN OF FLAME",
    artKanji: "灯籠",
  },
  {
    id: 4,
    kanjiNumber: "四",
    roman: "CHAPTER IV",
    title: "THE RIPPLE",
    kanjiTitle: "月水 • 波紋",
    dropCap: "B",
    lead: "eneath the vermilion moon, the mountain lake lay as still as black mirror glass.",
    quote: "“If you wish the reflection to ripple across the water, you must be the stone that breaks the surface.”",
    reflection: "Do not wait for change to occur. You must become the disruption.",
    artImage: "/landing-pages/secret-pathways-assets/generated/kage-moonwater.webp",
    artLabel: "MOONWATER • THE MIRROR SURFACE",
    artKanji: "月水",
  },
  {
    id: 5,
    kanjiNumber: "五",
    roman: "CHAPTER V",
    title: "THE REVELATION",
    kanjiTitle: "黎明 • 変革",
    dropCap: "D",
    lead: "o not wait for the storm to pass. Do not wait for the world to change you.",
    quote: "“Command your energy. Awaken the fire. Ignite the dawn of VIDYUT 2026.”",
    reflection: "自分自身が変革となれ — Become the transformation yourself.",
    themeReveal: "BE THE CHANGE",
    artImage: "/landing-pages/secret-pathways-assets/generated/kage-moonwater.webp",
    artLabel: "THE AWAKENING • VIDYUT 2026",
    artKanji: "変革",
  },
];

export const JapaneseGrimoire = ({ onComplete }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentSpread, setCurrentSpread] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState('next');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [glintPos, setGlintPos] = useState({ x: 50, y: 50 });

  const canvasRef = useRef(null);

  // Background temple vista images for dynamic atmospheric slideshow
  const bgImages = [
    '/landing-pages/secret-pathways-assets/generated/kage-sanmon-preview.webp',
    '/landing-pages/secret-pathways-assets/generated/kage-approach.webp',
    '/landing-pages/secret-pathways-assets/generated/kage-lantern-court.webp',
    '/landing-pages/secret-pathways-assets/generated/kage-moonwater.webp',
    '/landing-pages/secret-pathways-assets/generated/kage-moonwater.webp',
  ];

  // 1. Smooth Appearance
  useEffect(() => {
    const t = setTimeout(() => {
      setIsRevealed(true);
    }, 450);
    return () => clearTimeout(t);
  }, []);

  // 3D Parallax & Specular Light Tracking
  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    const normX = e.clientX / innerWidth;
    const normY = e.clientY / innerHeight;

    const x = (normX - 0.5) * 10;
    const y = (normY - 0.5) * -10;
    setMousePos({ x, y });
    setGlintPos({ x: normX * 100, y: normY * 100 });
  };

  // Persistent Background Particle Canvas (Always running, never unmounted)
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

    const embers = [];
    for (let i = 0; i < 60; i++) {
      embers.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2.2 + 0.6,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -Math.random() * 0.7 - 0.25,
        alpha: Math.random() * 0.7 + 0.2,
        isGold: Math.random() > 0.5,
      });
    }

    let animationId;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const time = Date.now() * 0.001;

      // Vermilion Moon Halo (Always visible behind the book)
      const moonRadius = Math.min(width, height) * 0.28;
      const moonY = centerY - 50;

      const moonGlow = ctx.createRadialGradient(
        centerX,
        moonY,
        0,
        centerX,
        moonY,
        moonRadius * 1.6
      );
      moonGlow.addColorStop(0, 'rgba(229, 9, 20, 0.24)');
      moonGlow.addColorStop(0.45, 'rgba(229, 9, 20, 0.07)');
      moonGlow.addColorStop(1, 'transparent');

      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, moonY, moonRadius * 1.6, 0, Math.PI * 2);
      ctx.fillStyle = moonGlow;
      ctx.fill();
      ctx.restore();

      // Sharp Moon Ring
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, moonY, moonRadius * 0.72, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(229, 9, 20, 0.35)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // Horizon Mist Lines
      for (let i = 0; i < 4; i++) {
        const lineY = height * 0.7 + i * 35 + Math.sin(time + i) * 6;
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

      // Embers
      embers.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.isGold
          ? `rgba(201, 162, 74, ${p.alpha})`
          : `rgba(229, 9, 20, ${p.alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.isGold ? '#c9a24a' : '#e50914';
        ctx.fill();
        ctx.restore();
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        if (!isOpen) handleOpenBook();
        else handleNextSpread();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (isOpen) handlePrevSpread();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onComplete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSpread, isFlipping]);

  // Direct Book Opening (Directly into the 1st Spread with Sound Cue)
  const handleOpenBook = () => {
    if (isOpen) return;
    sound.playPageFlip();
    sound.playHankoStamp();
    setIsOpen(true);
  };

  // Direct Page-Click Navigation Forward (Right Page)
  const handleNextSpread = () => {
    if (isFlipping) return;
    if (currentSpread < GRIMOIRE_SPREADS.length - 1) {
      sound.playPageFlip();
      setFlipDirection('next');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentSpread((prev) => prev + 1);
        setIsFlipping(false);
      }, 550);
    } else {
      handleEnterFest();
    }
  };

  // Direct Page-Click Navigation Backward (Left Page)
  const handlePrevSpread = () => {
    if (isFlipping) return;
    if (currentSpread > 0) {
      sound.playPageFlip();
      setFlipDirection('prev');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentSpread((prev) => prev - 1);
        setIsFlipping(false);
      }, 550);
    } else {
      sound.playPageFlip();
      setIsOpen(false);
    }
  };

  const handleEnterFest = () => {
    sound.playHankoStamp();
    sound.playEnergySurge();
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  const spread = GRIMOIRE_SPREADS[currentSpread];

  return (
    <div
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-50 bg-black text-white select-none overflow-hidden font-montserrat flex flex-col justify-between items-center py-6 px-4"
    >
      {/* LAYER 1: Persistent Background Particle Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-90" />
      
      {/* LAYER 2: Dynamic Background Temple Slideshow */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {bgImages.map((src, idx) => (
          <div
            key={idx}
            className="absolute inset-0 transition-opacity duration-1000 ease-out"
            style={{ opacity: currentSpread === idx ? 0.38 : 0 }}
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover object-center filter brightness-65 contrast-125 scale-105"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.85)_80%,#000000_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-transparent to-black/95" />
      </div>

      {/* Top Header: Clean Branding & Skip Button */}
      <header className="relative z-20 max-w-6xl w-full flex items-center justify-between pointer-events-none px-2 sm:px-6">
        <div className="flex items-center gap-3 pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-crimson-accent shadow-red-laser" />
          <span className="text-[10px] sm:text-xs font-syncopate font-semibold tracking-[0.3em] text-white/80 uppercase">
            VIDYUT • 火花の書 • CHRONICLE OF THE SPARK
          </span>
        </div>

        <button
          onClick={onComplete}
          className="pointer-events-auto flex items-center gap-2 text-[10px] font-syncopate tracking-[0.22em] text-white/70 hover:text-white uppercase px-4 py-1.5 rounded-full border border-white/15 hover:border-white/40 bg-black/60 backdrop-blur-md hover:scale-105 transition-all"
        >
          <span>SKIP TO FEST</span>
          <FastForward className="w-3 h-3 text-crimson-accent" />
        </button>
      </header>

      {/* 
        3D GRIMOIRE STAGE: Zoom-In Appearance & Symmetrical Centering
      */}
      <div
        className={`relative z-10 w-full max-w-5xl my-auto flex items-center justify-center [perspective:2500px] transition-all duration-1200 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
          isRevealed ? 'opacity-100 scale-100 filter blur-0' : 'opacity-0 scale-85 filter blur-sm'
        }`}
      >
        {/* Parallax 3D Tilt Shell */}
        <div
          style={{
            transform: `rotateX(${mousePos.y}deg) rotateY(${mousePos.x}deg)`,
            transition: 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="relative flex items-center justify-center [transform-style:preserve-3d]"
        >
          
          {/* =========================================================================
              STATE 1: CLOSED TOME (COVER VIEW MATCHING REFERENCE IMAGES 1-3)
          ========================================================================= */}
          {!isOpen ? (
            <div
              onClick={handleOpenBook}
              className="group relative cursor-pointer [transform-style:preserve-3d] hover:scale-[1.02] transition-transform duration-500"
            >
              {/* Deep 3D Ground Drop Shadow */}
              <div className="absolute -inset-8 bg-black/95 blur-3xl rounded-3xl opacity-85 group-hover:opacity-100 transition-opacity transform translate-y-10" />

              {/* 
                THE CLOSED LEATHER COVER
              */}
              <div className="relative w-[320px] sm:w-[410px] md:w-[490px] aspect-[3/4] rounded-r-2xl rounded-l-lg bg-[#3a2214] border border-[#2a170c] shadow-[0_30px_90px_rgba(0,0,0,0.98)] overflow-hidden flex flex-col justify-between p-8 sm:p-10 [transform-style:preserve-3d]">
                {/* 100% Solid Opaque Leather Background */}
                <div
                  className="absolute inset-0 bg-[#3a2214]"
                  style={{
                    background: `
                      radial-gradient(ellipse at 50% 30%, rgba(212,143,56,0.35) 0%, transparent 65%),
                      linear-gradient(135deg, #4d2e1b 0%, #2b180d 50%, #170b05 100%)
                    `,
                  }}
                />

                {/* Interactive Dynamic Specular Lighting Sheen */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-40 mix-blend-color-dodge transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at ${glintPos.x}% ${glintPos.y}%, rgba(255,230,160,0.5) 0%, transparent 60%)`,
                  }}
                />

                {/* Ornate Gold Filigree Border Embossing */}
                <div className="absolute inset-3 border-2 border-[#d4a046]/40 rounded-r-xl rounded-l-md pointer-events-none shadow-inner" />
                <div className="absolute inset-4 border border-[#d4a046]/20 rounded-r-lg rounded-l-sm pointer-events-none" />

                {/* Left Spine with Dual Heavy Gold Metallic Clasps */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#170b05] via-[#2d180d] to-[#452716] border-r border-[#170b05] shadow-lg flex flex-col justify-around py-16 pointer-events-none">
                  <div className="w-10 h-7 -ml-2 rounded-r-md bg-gradient-to-r from-[#8f6d2b] via-[#e5b85a] to-[#fff1b0] shadow-[0_4px_12px_rgba(0,0,0,0.8)] border border-[#4d360f] flex items-center justify-end pr-1.5 transform group-hover:scale-105 transition-transform">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3d2708] border border-[#ffeaa7]" />
                  </div>

                  <div className="w-10 h-7 -ml-2 rounded-r-md bg-gradient-to-r from-[#8f6d2b] via-[#e5b85a] to-[#fff1b0] shadow-[0_4px_12px_rgba(0,0,0,0.8)] border border-[#4d360f] flex items-center justify-end pr-1.5 transform group-hover:scale-105 transition-transform">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3d2708] border border-[#ffeaa7]" />
                  </div>
                </div>

                {/* Top Header Stamp */}
                <div className="relative z-10 text-center pl-6">
                  <span className="text-[10px] font-syncopate tracking-[0.35em] text-[#e5b85a] uppercase font-bold drop-shadow">
                    AMRITA VISHWA VIDYAPEETHAM
                  </span>
                  <div className="w-20 h-[1px] bg-[#e5b85a]/40 mx-auto mt-2" />
                </div>

                {/* Center Crest & Inscription */}
                <div className="relative z-10 text-center flex flex-col items-center pl-6">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 relative flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
                    <img
                      src="/images/vidyut-logo.png"
                      alt="Vidyut Emblem"
                      className="w-full h-full object-contain filter drop-shadow-[0_0_25px_rgba(229,184,90,0.8)]"
                    />
                  </div>

                  <h1 className="font-impact text-4xl sm:text-5xl uppercase tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] via-[#faebd7] to-[#c5a059] drop-shadow-[0_4px_25px_rgba(0,0,0,0.95)]">
                    VIDYUT 2026
                  </h1>
                  
                  <p className="mt-2 text-[11px] font-syncopate tracking-[0.38em] text-crimson-accent font-bold">
                    火花の書 • THE BOOK OF THE SPARK
                  </p>
                </div>

                {/* Bottom Tap Trigger */}
                <div className="relative z-10 text-center pl-6">
                  <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#e5b85a]/60 bg-black/70 backdrop-blur-md text-[10px] font-syncopate tracking-[0.25em] text-white uppercase shadow-silver-glow animate-subtle-pulse group-hover:border-[#e5b85a] group-hover:scale-105 transition-all">
                    <BookOpen className="w-3.5 h-3.5 text-[#e5b85a]" />
                    <span>TAP TOME TO UNSEAL</span>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            /* =========================================================================
               STATE 2: OPEN 2-PAGE SPREAD
               - SPREAD 0 (1st click): Left is BLANK inner cover, Right is full quote page (PIC 1).
               - SPREAD 1-4: Standard 2-page spreads (Story on Left, Sumi-E Art on Right).
            ========================================================================= */
            <div className="relative w-full max-w-5xl aspect-auto md:aspect-[16/10] max-h-[82vh] rounded-2xl bg-[#1b1008] border-2 border-[#4d2e1b] shadow-[0_30px_100px_rgba(0,0,0,0.98)] flex flex-col md:flex-row overflow-hidden [transform-style:preserve-3d] animate-[fadeIn_0.5s_ease-out]">
              
              {/* Outer Dark Leather Casing Border */}
              <div className="absolute inset-0 border-[6px] border-[#2b180d] rounded-2xl pointer-events-none z-40 shadow-inner" />

              {/* Center Spine Shadow & Binding Crease */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-12 -translate-x-1/2 z-30 pointer-events-none bg-gradient-to-r from-black/60 via-black/85 to-black/60 shadow-2xl" />

              {/* ---------------------------------------------------------------------
                  LEFT SIDE:
                  - If SPREAD 0: Blank Inner Leather Binding (Same as Cover, No Text)
                  - If SPREAD > 0: Story Parable Page
              --------------------------------------------------------------------- */}
              {currentSpread === 0 ? (
                <div
                  onClick={handlePrevSpread}
                  title="Click to close book"
                  className="group flex-1 p-6 sm:p-10 md:p-12 flex flex-col justify-between relative border-b md:border-b-0 md:border-r border-[#170b05] overflow-hidden cursor-pointer select-none"
                  style={{
                    background: `
                      radial-gradient(ellipse at 50% 30%, rgba(212,143,56,0.3) 0%, transparent 65%),
                      linear-gradient(135deg, #4d2e1b 0%, #2b180d 50%, #170b05 100%)
                    `,
                  }}
                >
                  {/* Ornate Gold Filigree Inner Border Inlay */}
                  <div className="absolute inset-3 border-2 border-[#d4a046]/30 rounded-l-xl rounded-r-md pointer-events-none shadow-inner" />
                  <div className="absolute inset-4 border border-[#d4a046]/15 rounded-l-lg rounded-r-sm pointer-events-none" />

                  {/* Left Spine Dual Gold Clasps */}
                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#170b05] via-[#2d180d] to-[#452716] border-r border-[#170b05] shadow-lg flex flex-col justify-around py-16 pointer-events-none">
                    <div className="w-10 h-7 -ml-2 rounded-r-md bg-gradient-to-r from-[#8f6d2b] via-[#e5b85a] to-[#fff1b0] shadow-md border border-[#4d360f]" />
                    <div className="w-10 h-7 -ml-2 rounded-r-md bg-gradient-to-r from-[#8f6d2b] via-[#e5b85a] to-[#fff1b0] shadow-md border border-[#4d360f]" />
                  </div>

                  {/* Subtle Close Prompt at Bottom */}
                  <div className="relative z-10 flex items-center justify-between pt-4 mt-auto">
                    <div className="flex items-center gap-1.5 text-[10px] font-syncopate text-[#e5b85a]/60 font-bold group-hover:text-[#e5b85a] transition-colors">
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>CLOSE COVER</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Standard Story Parable on Left (Spread 1 to 4) */
                <div
                  onClick={handlePrevSpread}
                  title="Click left page to flip backward"
                  className="group flex-1 p-6 sm:p-10 md:p-12 flex flex-col justify-between relative border-b md:border-b-0 md:border-r border-[#3a2010] overflow-hidden cursor-pointer select-none transition-colors"
                  style={{
                    background: `
                      radial-gradient(ellipse at 30% 40%, #e2d2ab 0%, #c4ab7c 45%, #8c6e45 78%, #3d2915 100%)
                    `,
                    color: '#1a0e05',
                  }}
                >
                  <div className="absolute inset-0 border-[10px] border-[#382310]/50 pointer-events-none" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(38,20,8,0.55)_90%,rgba(20,9,3,0.85)_100%)] pointer-events-none" />

                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-syncopate font-bold tracking-[0.3em] text-[#783e18] uppercase">
                        {spread.roman}
                      </span>
                      <div className="text-xs font-syncopate tracking-[0.2em] text-[#4a2e16] uppercase mt-0.5 font-bold">
                        {spread.title}
                      </div>
                    </div>

                    <div className="w-9 h-9 rounded-lg border-2 border-crimson-accent bg-crimson-accent/20 flex items-center justify-center shadow-md transform -rotate-6">
                      <span className="font-serif font-bold text-xs text-crimson-accent">
                        {spread.artKanji}
                      </span>
                    </div>
                  </div>

                  <div className="relative z-10 my-4 sm:my-6">
                    <div className="text-lg sm:text-xl font-syncopate font-black text-[#2e1809] tracking-wide uppercase mb-4">
                      {spread.kanjiTitle}
                    </div>

                    <div className="text-sm sm:text-base md:text-lg font-montserrat text-[#251508] leading-relaxed font-semibold">
                      <span className="float-left text-4xl sm:text-5xl font-impact font-bold text-[#8c3514] leading-none pr-3 pt-1">
                        {spread.dropCap}
                      </span>
                      {spread.lead}
                    </div>

                    <div className="mt-5 p-4 rounded-xl border-l-4 border-crimson-accent bg-black/10 backdrop-blur-sm">
                      <p className="text-xs sm:text-sm font-montserrat font-bold text-[#200f04] italic leading-relaxed">
                        {spread.quote}
                      </p>
                    </div>

                    <p className="mt-4 text-[11px] sm:text-xs font-montserrat text-[#4f311a] leading-relaxed tracking-wide font-medium">
                      {spread.reflection}
                    </p>
                  </div>

                  <div className="relative z-10 flex items-center justify-between pt-4 border-t border-[#6b4926]/30">
                    <div className="flex items-center gap-1.5 text-[10px] font-syncopate text-[#633a18] font-bold group-hover:text-crimson-accent transition-colors">
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>PREV PAGE</span>
                    </div>
                    <span className="text-xs font-serif text-[#6b3a13] font-bold">
                      巻之 {spread.kanjiNumber}
                    </span>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------------------------
                  RIGHT SIDE:
                  - If SPREAD 0: Full Traditional Japanese Manuscript Page with Powerful Quote
                  - If SPREAD 1-4: Sumi-E Artwork Illumination (or Finale Theme Reveal)
              --------------------------------------------------------------------- */}
              {currentSpread === 0 ? (
                /* SPREAD 0 RIGHT SIDE: Full Traditional Japanese Manuscript Page with Powerful Quote (PIC 1) */
                <div
                  onClick={handleNextSpread}
                  title="Click right page to flip to next chapter"
                  className="group flex-1 p-6 sm:p-10 md:p-12 flex flex-col justify-between relative overflow-hidden cursor-pointer select-none"
                  style={{
                    background: `
                      radial-gradient(ellipse at 50% 40%, #e2d2ab 0%, #c4ab7c 45%, #8c6e45 78%, #3d2915 100%)
                    `,
                    color: '#1a0e05',
                  }}
                >
                  <div className="absolute inset-0 border-[10px] border-[#382310]/50 pointer-events-none" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(38,20,8,0.55)_90%,rgba(20,9,3,0.85)_100%)] pointer-events-none" />

                  {/* Top Chapter Stamp & Hanko Seal */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-syncopate font-bold tracking-[0.3em] text-[#783e18] uppercase">
                        {spread.roman} • PROLOGUE
                      </span>
                      <div className="text-xs font-syncopate tracking-[0.2em] text-[#4a2e16] uppercase mt-0.5 font-bold">
                        {spread.title}
                      </div>
                    </div>

                    <div className="w-9 h-9 rounded-lg border-2 border-crimson-accent bg-crimson-accent/20 flex items-center justify-center shadow-md transform -rotate-6">
                      <span className="font-serif font-bold text-xs text-crimson-accent">
                        {spread.artKanji}
                      </span>
                    </div>
                  </div>

                  {/* Core Narrative & Powerful Theme Quote */}
                  <div className="relative z-10 my-4 sm:my-6">
                    <div className="text-lg sm:text-xl font-syncopate font-black text-[#2e1809] tracking-wide uppercase mb-4">
                      {spread.kanjiTitle}
                    </div>

                    <div className="text-sm sm:text-base md:text-lg font-montserrat text-[#251508] leading-relaxed font-semibold">
                      <span className="float-left text-4xl sm:text-5xl font-impact font-bold text-[#8c3514] leading-none pr-3 pt-1">
                        {spread.dropCap}
                      </span>
                      {spread.lead}
                    </div>

                    {/* Master's Powerful Theme Matching Quote Box */}
                    <div className="mt-5 p-5 rounded-xl border-l-4 border-crimson-accent bg-black/10 backdrop-blur-sm shadow-md">
                      <p className="text-sm sm:text-base font-montserrat font-bold text-[#1f0e04] italic leading-relaxed">
                        {spread.quote}
                      </p>
                    </div>

                    <p className="mt-4 text-xs sm:text-sm font-montserrat text-[#4f311a] leading-relaxed tracking-wide font-semibold">
                      {spread.reflection}
                    </p>
                  </div>

                  {/* Right Page Footer & Turn Cue */}
                  <div className="relative z-10 flex items-center justify-between pt-4 border-t border-[#6b4926]/30">
                    <span className="text-xs font-serif text-[#6b3a13] font-bold">
                      巻之 {spread.kanjiNumber}
                    </span>
                    <div className="flex items-center gap-1.5 text-[10px] font-syncopate text-[#633a18] font-bold group-hover:text-crimson-accent transition-colors">
                      <span>TURN PAGE</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ) : (
                /* SPREAD 1-4 RIGHT SIDE: Sumi-E Artwork Illumination (or Finale Theme Reveal) */
                <div
                  onClick={handleNextSpread}
                  title="Click right page to flip forward"
                  className="group flex-1 p-6 sm:p-10 md:p-12 flex flex-col justify-between relative overflow-hidden cursor-pointer select-none"
                  style={{
                    background: `
                      radial-gradient(ellipse at 70% 40%, #e2d2ab 0%, #c4ab7c 45%, #8c6e45 78%, #3d2915 100%)
                    `,
                  }}
                >
                  <div className="absolute inset-0 border-[10px] border-[#382310]/50 pointer-events-none" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(38,20,8,0.55)_90%,rgba(20,9,3,0.85)_100%)] pointer-events-none" />

                  <div className="relative w-full h-full rounded-xl overflow-hidden border-2 border-[#5c3717] bg-black/70 flex flex-col justify-between p-5 shadow-2xl">
                    <img
                      src={spread.artImage}
                      alt={spread.artLabel}
                      className="absolute inset-0 w-full h-full object-cover filter brightness-85 contrast-125 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />

                    <div className="relative z-10 flex items-center justify-between">
                      <span className="px-3 py-1 rounded bg-black/85 backdrop-blur-md text-[9px] font-syncopate tracking-[0.2em] text-[#e5b85a] uppercase border border-[#e5b85a]/40 font-bold">
                        {spread.artLabel}
                      </span>
                      <span className="text-sm font-syncopate text-crimson-accent font-black drop-shadow">
                        {spread.artKanji}
                      </span>
                    </div>

                    {spread.themeReveal ? (
                      <div className="relative z-10 text-center my-auto py-6">
                        <div className="w-16 h-[2px] bg-crimson-accent mx-auto mb-3" />
                        <div className="text-[10px] font-syncopate tracking-[0.35em] text-[#e5b85a] uppercase mb-2 font-bold">
                          THE SUPREME THEME
                        </div>
                        
                        <h1 className="font-impact text-4xl sm:text-6xl md:text-7xl uppercase tracking-[0.14em] text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] via-[#faebd7] to-[#c5a059] drop-shadow-[0_4px_30px_rgba(255,255,255,0.5)] leading-none my-3">
                          {spread.themeReveal}
                        </h1>

                        <div className="mt-6">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEnterFest();
                            }}
                            className="px-8 py-3.5 rounded-full bg-white text-black font-syncopate font-bold text-xs tracking-[0.24em] uppercase shadow-silver-glow hover:bg-gray-200 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 group/btn"
                          >
                            <Zap className="w-4 h-4 fill-current text-crimson-accent group-hover/btn:rotate-12 transition-transform" />
                            <span>ENTER VIDYUT 2026</span>
                            <ArrowUpRight className="w-4 h-4 text-black" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative z-10 text-left">
                        <div className="text-[10px] font-syncopate font-bold tracking-[0.2em] text-white uppercase drop-shadow">
                          [ SUMI-E ILLUMINATION • {spread.title} ]
                        </div>
                        <div className="text-xs font-montserrat text-white/90 italic mt-0.5 drop-shadow">
                          {spread.reflection}
                        </div>
                      </div>
                    )}
                  </div>

                  {!spread.themeReveal && (
                    <div className="relative z-10 flex items-center justify-end pt-3 text-[10px] font-syncopate text-[#633a18] font-bold group-hover:text-crimson-accent transition-colors gap-1.5">
                      <span>NEXT PAGE</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              )}

              {/* -------------------------------------------------------------
                  3D CURLING PAGE OVERLAY (ANIMATING FROM RIGHT TO LEFT)
              ------------------------------------------------------------- */}
              {isFlipping && (
                <div
                  className={`absolute right-0 top-0 bottom-0 w-1/2 z-50 pointer-events-none origin-left transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] [transform-style:preserve-3d] shadow-[0_20px_50px_rgba(0,0,0,0.9)] ${
                    flipDirection === 'next'
                      ? 'animate-[flipNext_0.55s_ease-in-out_forwards]'
                      : 'animate-[flipPrev_0.55s_ease-in-out_forwards]'
                  }`}
                  style={{
                    background: `
                      linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(226,210,171,0.95) 25%, #d1bc91 75%, rgba(61,41,21,0.9) 100%)
                    `,
                  }}
                />
              )}

            </div>
          )}

        </div>

      </div>

      {/* 
        MINIMAL BOTTOM SPREAD INDICATOR DOTS
      */}
      {isOpen && (
        <footer className="relative z-20 max-w-4xl w-full flex items-center justify-center px-4 pt-3">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
            {GRIMOIRE_SPREADS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  if (idx !== currentSpread) {
                    sound.playPageFlip();
                    setIsFlipping(true);
                    setTimeout(() => {
                      setCurrentSpread(idx);
                      setIsFlipping(false);
                    }, 400);
                  }
                }}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  idx === currentSpread
                    ? 'w-8 bg-crimson-accent shadow-red-laser'
                    : 'w-2.5 bg-white/20 hover:bg-white/50'
                }`}
                title={`Spread ${s.kanjiNumber}`}
              />
            ))}
          </div>
        </footer>
      )}

    </div>
  );
};
