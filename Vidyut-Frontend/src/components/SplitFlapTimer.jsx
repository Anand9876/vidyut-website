import React, { useState, useEffect, useRef } from 'react';
import { useTransformation } from '../context/TransformationContext';
import { sound } from '../audio/SoundEngine';

// Single mechanical split-flap character unit
const SplitFlapDigit = ({ digit }) => {
  const [currentDigit, setCurrentDigit] = useState(digit);
  const [previousDigit, setPreviousDigit] = useState(digit);
  const [isFlipping, setIsFlipping] = useState(false);
  const prevDigitRef = useRef(digit);

  useEffect(() => {
    if (digit !== prevDigitRef.current) {
      setPreviousDigit(prevDigitRef.current);
      setCurrentDigit(digit);
      setIsFlipping(true);
      prevDigitRef.current = digit;

      sound.playSplitFlapSnap();

      const timer = setTimeout(() => {
        setIsFlipping(false);
      }, 320);

      return () => clearTimeout(timer);
    }
  }, [digit]);

  return (
    <div className="relative w-12 sm:w-16 md:w-20 h-18 sm:h-24 md:h-28 perspective-container select-none">
      {/* Background Card */}
      <div className="split-flap-card w-full h-full rounded-lg border border-terracotta/40 bg-ink-card text-stamp-cream shadow-stamp">
        {/* Top Half Static */}
        <div className="split-flap-top flex items-end justify-center pb-0.5 border-b border-black/70 bg-ink-surface text-stamp-cream">
          <span className="text-4xl sm:text-5xl md:text-6xl font-bold font-display leading-none translate-y-1/2">
            {currentDigit}
          </span>
        </div>

        {/* Bottom Half Static */}
        <div className="split-flap-bottom flex items-start justify-center pt-0.5 bg-ink-surface text-stamp-cream">
          <span className="text-4xl sm:text-5xl md:text-6xl font-bold font-display leading-none -translate-y-1/2">
            {isFlipping ? previousDigit : currentDigit}
          </span>
        </div>

        {/* Animated Front Leaf */}
        {isFlipping && (
          <div className="split-flap-top flap-leaf-front flex items-end justify-center pb-0.5 z-10 border-b border-black/90 bg-ink-surface text-stamp-cream">
            <span className="text-4xl sm:text-5xl md:text-6xl font-bold font-display leading-none translate-y-1/2">
              {previousDigit}
            </span>
          </div>
        )}

        {/* Animated Back Leaf */}
        {isFlipping && (
          <div className="split-flap-bottom flap-leaf-back flex items-start justify-center pt-0.5 z-10 bg-ink-surface text-stamp-cream">
            <span className="text-4xl sm:text-5xl md:text-6xl font-bold font-display leading-none -translate-y-1/2">
              {currentDigit}
            </span>
          </div>
        )}

        {/* Mechanical Split Hinge */}
        <div className="split-flap-hinge" />
      </div>
    </div>
  );
};

// Paired 2-digit unit (e.g. "04" Days)
const SplitFlapPair = ({ value, label }) => {
  const str = String(value).padStart(2, '0');
  const d1 = str[0];
  const d2 = str[1];

  return (
    <div className="flex flex-col items-center">
      {/* Digit Flap Pair */}
      <div className="flex gap-1.5 p-1.5 rounded-xl bg-black/50 border border-terracotta/30">
        <SplitFlapDigit digit={d1} />
        <SplitFlapDigit digit={d2} />
      </div>

      {/* Clean Unit Label */}
      <div className="mt-2 text-center">
        <span className="text-[11px] sm:text-xs font-mono font-bold tracking-widest text-terracotta uppercase">
          {label}
        </span>
      </div>
    </div>
  );
};

export const SplitFlapTimer = () => {
  const { timeLeft, transformationProgress } = useTransformation();

  return (
    <div id="countdown" className="w-full max-w-4xl mx-auto px-4 py-6 select-none">
      {/* Header Info Tag */}
      <div className="flex items-center justify-between mb-5 border-b border-terracotta/20 pb-2 text-xs font-mono tracking-wider">
        <div className="flex items-center gap-2 text-stamp-cream font-bold">
          <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
          <span>OFFICIAL FESTIVAL COUNTDOWN</span>
        </div>
        <div className="text-stamp-cream/60 hidden sm:block">
          OCTOBER 15, 2026 • AMRITA UNIVERSITY
        </div>
      </div>

      {/* Split Flap Units */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 md:gap-8">
        <SplitFlapPair value={timeLeft.days} label="DAYS" />
        <div className="text-2xl sm:text-4xl font-mono text-terracotta/40 -mt-6 hidden xs:block">:</div>
        <SplitFlapPair value={timeLeft.hours} label="HOURS" />
        <div className="text-2xl sm:text-4xl font-mono text-terracotta/40 -mt-6 hidden xs:block">:</div>
        <SplitFlapPair value={timeLeft.minutes} label="MINUTES" />
        <div className="text-2xl sm:text-4xl font-mono text-terracotta/40 -mt-6 hidden xs:block">:</div>
        <SplitFlapPair value={timeLeft.seconds} label="SECONDS" />
      </div>

      {/* Timeline Progress Bar */}
      <div className="mt-8 relative max-w-2xl mx-auto">
        <div className="flex justify-between items-center text-[10px] font-mono mb-1.5 text-stamp-cream/75">
          <span>PROGRESS TOWARDS FESTIVAL</span>
          <span className="font-bold text-terracotta">
            {(transformationProgress * 100).toFixed(1)}% SYNCHRONIZED
          </span>
        </div>

        <div className="h-2 w-full rounded-full bg-ink-card border border-terracotta/30 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-terracotta via-terracotta-light to-electric-cyan transition-all duration-300 ease-out rounded-full"
            style={{ width: `${Math.max(4, transformationProgress * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
