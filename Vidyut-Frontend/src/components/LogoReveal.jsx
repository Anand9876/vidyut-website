import React, { useState, useEffect } from 'react';
import { sound } from '../audio/SoundEngine';

export const LogoReveal = ({ onEnter }) => {
  const [logoAnimationDone, setLogoAnimationDone] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // 1. Logo animation runs first (1.6s duration)
    const timer = setTimeout(() => {
      setLogoAnimationDone(true);
    }, 1600);
    return () => clearTimeout(timer);
  }, []);

  const handleTap = () => {
    if (!logoAnimationDone || isFadingOut) return;
    setIsFadingOut(true);
    sound.playRelayClick(1.2);

    // Smooth fade out into Story Mode background
    setTimeout(() => {
      onEnter();
    }, 450);
  };

  return (
    <div
      onClick={handleTap}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white select-none overflow-hidden transition-all duration-500 ease-out ${
        logoAnimationDone ? 'cursor-pointer' : 'cursor-default'
      } ${
        isFadingOut ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Subtle Atmospheric Fog */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_70%)] pointer-events-none" />

      {/* Center Container */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6 text-center">
        
        {/* Step 1: Vidyut Logo Animates First (Emerges & Zooms In) */}
        <div className="w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 relative flex items-center justify-center animate-slow-zoom">
          <img
            src="/images/vidyut-logo.png"
            alt="VIDYUT Logo"
            className="w-full h-full object-contain filter drop-shadow-[0_0_35px_rgba(255,255,255,0.4)]"
          />
        </div>

        {/* Step 2: "TAP TO ENTER THE CHAOS" Animates Only After Logo Animation Completes */}
        <div
          className={`mt-10 transition-all duration-1000 transform ${
            logoAnimationDone
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-6 pointer-events-none'
          }`}
        >
          <p className="font-syncopate font-normal text-xs sm:text-sm tracking-[0.35em] text-white/90 uppercase animate-subtle-pulse">
            TAP TO ENTER THE CHAOS
          </p>
        </div>
      </div>
    </div>
  );
};
