import React from 'react';
import { Award, GraduationCap, MapPin } from 'lucide-react';
import { UNIVERSITY_STATS, FEST_METADATA } from '../data/festData';

export const UniversityLegacy = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto select-none border-y border-ink-border bg-ink-navy/60">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        
        {/* Left Column: University Heritage Statement */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="w-5 h-5 text-terracotta" />
            <span className="font-mono text-xs text-terracotta uppercase tracking-wider font-semibold">
              INSTITUTIONAL HERITAGE
            </span>
          </div>

          <h3 className="text-2xl sm:text-4xl font-bold font-display text-stamp-cream mb-3">
            AMRITA VISHWA VIDYAPEETHAM
          </h3>

          <p className="text-xs sm:text-sm text-stamp-cream/70 font-body leading-relaxed mb-4">
            Ranked among India's top multi-disciplinary research universities. VIDYUT embodies the spirit of student ingenuity, engineering excellence, and cultural vibrancy.
          </p>

          <div className="flex items-center gap-2 text-xs font-mono text-stamp-cream/80">
            <MapPin className="w-4 h-4 text-terracotta" />
            <span>{FEST_METADATA.location}</span>
          </div>
        </div>

        {/* Right Columns: 4 Key Statistic Stamp Cards */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {UNIVERSITY_STATS.map((stat, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-ink-border bg-ink-surface flex flex-col justify-between shadow-stamp hover:border-terracotta/50 transition-colors"
            >
              <div>
                <span className="text-[10px] font-mono text-terracotta font-semibold block mb-1">
                  {stat.label}
                </span>
                <div className="text-2xl sm:text-3xl font-bold font-display text-stamp-cream mb-2 tracking-tight">
                  {stat.value}
                </div>
              </div>
              <p className="text-[10px] text-stamp-cream/60 font-mono leading-tight">
                {stat.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
