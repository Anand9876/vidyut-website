import React, { useState, useEffect } from 'react';
import { useTransformation } from '../context/TransformationContext';

export const Navbar = ({ isNavVisible = true }) => {
  const { setIsPassModalOpen } = useTransformation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 35) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const shouldHide = isScrolled || !isNavVisible;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-transparent text-white select-none pointer-events-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-24 flex items-center justify-between relative pointer-events-auto">
        
        {/* 
          LEFT HALF: SLIDES IN ON ENTRANCE, SLIDES OUT ON SCROLL
        */}
        <div
          className={`flex items-center space-x-6 sm:space-x-8 text-xs font-montserrat tracking-[0.18em] uppercase text-white/80 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            shouldHide
              ? '-translate-x-16 opacity-0 pointer-events-none'
              : 'translate-x-0 opacity-100'
          }`}
        >
          {/* Left Glowing Red Laser Line */}
          <div className="w-12 sm:w-20 md:w-28 h-[1px] bg-gradient-to-r from-transparent via-crimson-accent to-transparent hidden lg:block opacity-70" />

          <a
            href="#"
            className="hover:text-white hover:text-red-400 transition-colors py-2"
          >
            HOME
          </a>
          <a
            href="#countdown"
            className="hover:text-white hover:text-red-400 transition-colors py-2 hidden sm:inline-block"
          >
            COUNTDOWN
          </a>
        </div>

        {/* 
          CENTER VIDYUT LOGO: BLOOMS IN ON ENTRANCE, DISSOLVES ON SCROLL
        */}
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            shouldHide
              ? 'scale-50 opacity-0 pointer-events-none filter blur-sm'
              : 'scale-100 opacity-100 filter blur-0'
          }`}
        >
          <a href="#" className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center hover:scale-105 transition-transform group">
            <img
              src="/images/vidyut-logo.png"
              alt="Vidyut Logo"
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain filter drop-shadow-[0_0_16px_rgba(255,255,255,0.7)] group-hover:drop-shadow-[0_0_24px_rgba(255,255,255,0.95)] transition-all"
            />
          </a>
        </div>

        {/* 
          RIGHT HALF: SLIDES IN ON ENTRANCE, SLIDES OUT ON SCROLL
        */}
        <div
          className={`flex items-center space-x-6 sm:space-x-8 text-xs font-montserrat tracking-[0.18em] uppercase text-white/80 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            shouldHide
              ? 'translate-x-16 opacity-0 pointer-events-none'
              : 'translate-x-0 opacity-100'
          }`}
        >
          <a
            href="https://vidyut-last.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white hover:text-red-400 transition-colors py-2 hidden md:inline-block"
          >
            ARCHIVE ↗
          </a>

          {/* Register Pill Button */}
          <button
            onClick={() => setIsPassModalOpen(true)}
            className="px-5 sm:px-6 py-2 rounded-full border border-red-500/40 bg-black/30 backdrop-blur-sm hover:bg-black/60 hover:border-red-500 hover:shadow-[0_0_20px_rgba(229,9,20,0.4)] text-red-400 hover:text-white text-xs font-montserrat font-bold tracking-[0.2em] uppercase transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            REGISTER
          </button>

          {/* Right Glowing Red Laser Line */}
          <div className="w-12 sm:w-20 md:w-28 h-[1px] bg-gradient-to-l from-transparent via-crimson-accent to-transparent hidden lg:block opacity-70" />
        </div>

      </div>
    </header>
  );
};
