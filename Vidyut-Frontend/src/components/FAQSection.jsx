import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from '../data/festData';
import { sound } from '../audio/SoundEngine';

export const FAQSection = () => {
  const [openIdx, setOpenIdx] = useState(null);

  const toggleAccordion = (idx) => {
    sound.playRelayClick(1.0);
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto select-none">
      {/* Header */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-ink-surface border border-terracotta/40 mb-3 shadow-sm">
          <span className="font-mono text-xs text-terracotta uppercase tracking-wider font-semibold">
            DELEGATE SUPPORT
          </span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-stamp-cream">
          FREQUENTLY ASKED QUESTIONS
        </h2>
      </div>

      {/* Accordion List */}
      <div className="space-y-3.5">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIdx === idx;

          return (
            <div
              key={idx}
              className="rounded-2xl border border-ink-border bg-ink-surface/90 shadow-stamp transition-colors"
            >
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full p-5 sm:p-6 flex items-center justify-between text-left gap-4"
              >
                <span className="text-base sm:text-lg font-bold font-display text-stamp-cream">
                  {item.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-terracotta transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 text-terracotta-light' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-ink-border">
                  <p className="text-xs sm:text-sm text-stamp-cream/75 font-body leading-relaxed">
                    {item.a}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
