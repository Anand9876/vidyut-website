import React from 'react';
import { ArrowUp, Zap, MapPin } from 'lucide-react';
import { FEST_METADATA } from '../data/festData';
import { sound } from '../audio/SoundEngine';

export const Footer = () => {
  const scrollToTop = () => {
    sound.playRelayClick(1.3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-ink-navy text-stamp-cream border-t border-ink-border pt-20 pb-12 select-none">
      {/* Decorative top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-terracotta/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-14 border-b border-ink-border">
          
          {/* Col 1: Brand & Identity */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-terracotta text-stamp-cream flex items-center justify-center font-display font-bold text-sm shadow-terracotta-glow">
                V
              </div>
              <span className="font-display text-2xl font-extrabold tracking-wider text-stamp-cream">
                VIDYUT 2026
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stamp-cream/65 font-body max-w-md leading-relaxed">
              The premier National Multi-Fest of Amrita Vishwa Vidyapeetham. Integrating frontline engineering, competitive robotics, musical harmony, and ecological stewardship under the banner of <span className="text-terracotta font-semibold">BE THE CHANGE</span>.
            </p>

            <div className="flex items-center gap-2 text-xs font-mono text-stamp-cream/70 pt-2">
              <MapPin className="w-4 h-4 text-terracotta shrink-0" />
              <span>Amrita Vishwa Vidyapeetham • Amritapuri / Coimbatore, India</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="font-mono text-xs font-bold text-terracotta uppercase tracking-wider mb-4">
              PORTALS
            </h4>
            <ul className="space-y-2.5 text-xs font-mono text-stamp-cream/70">
              <li>
                <a href="#countdown" className="hover:text-terracotta transition-colors">
                  Countdown
                </a>
              </li>
              <li>
                <a href="#pillars" className="hover:text-terracotta transition-colors">
                  The Four Pillars
                </a>
              </li>
              <li>
                <a href="#arenas" className="hover:text-terracotta transition-colors">
                  60+ Competitive Arenas
                </a>
              </li>
              <li>
                <a href="#schedule" className="hover:text-terracotta transition-colors">
                  4-Day Operational Schedule
                </a>
              </li>
              <li>
                <a href="#proshows" className="hover:text-terracotta transition-colors">
                  Star Night Lineup
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Accreditation & Dates */}
          <div>
            <h4 className="font-mono text-xs font-bold text-terracotta uppercase tracking-wider mb-4">
              ACCREDITATION
            </h4>
            <ul className="space-y-2 text-xs font-mono text-stamp-cream/70">
              <li className="font-bold text-stamp-cream">Amrita Vishwa Vidyapeetham</li>
              <li>NAAC A++ Grade Accreditation</li>
              <li>NIRF Top 10 University in India</li>
              <li>Category-1 Autonomy</li>
              <li className="pt-3 text-[11px] text-terracotta font-bold">
                OCTOBER 15 – 18, 2026
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-stamp-cream/50">
          <div>
            © 2026 VIDYUT • AMRITA VISHWA VIDYAPEETHAM. ALL RIGHTS RESERVED.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-terracotta/40 hover:border-terracotta text-stamp-cream hover:bg-terracotta/15 transition-colors uppercase tracking-wider text-[11px]"
          >
            <span>RETURN TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5 text-terracotta" />
          </button>
        </div>
      </div>
    </footer>
  );
};
