import React, { useState } from 'react';
import { Radio, Unlock, Sparkles } from 'lucide-react';
import { STAR_NIGHT_TEASERS } from '../data/festData';
import { sound } from '../audio/SoundEngine';

export const StarNightReveal = () => {
  const [revealedCards, setRevealedCards] = useState({});

  const handleReveal = (id) => {
    sound.playNeedleKick();
    sound.playRelayClick(1.3);
    sound.playEnergySurge();
    setRevealedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section id="proshows" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto select-none">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-ink-surface border border-terracotta/40 mb-3 shadow-sm">
          <span className="font-mono text-xs text-terracotta uppercase tracking-wider font-semibold">
            PRO-SHOWS & CONCERTS
          </span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-stamp-cream mb-3">
          STAR NIGHT LINEUP
        </h2>
        <p className="text-xs sm:text-sm font-body text-stamp-cream/70 max-w-lg mx-auto">
          Tune the frequency to unlock official hints for the headline performances.
        </p>
      </div>

      {/* 3 Teaser Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {STAR_NIGHT_TEASERS.map((teaser) => {
          const isRevealed = !!revealedCards[teaser.id];

          return (
            <div
              key={teaser.id}
              className={`p-6 sm:p-8 rounded-2xl border transition-all duration-500 flex flex-col justify-between shadow-stamp ${
                isRevealed
                  ? 'bg-ink-card border-terracotta shadow-terracotta-glow'
                  : 'bg-ink-surface border-ink-border'
              }`}
            >
              <div>
                {/* Night Header */}
                <div className="flex items-center justify-between border-b border-ink-border pb-3 mb-5">
                  <span className="text-xs font-mono font-bold text-stamp-cream tracking-wider">
                    {teaser.night.replace('//', '•')}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                      isRevealed
                        ? 'bg-terracotta/20 text-terracotta border-terracotta/40'
                        : 'bg-black/50 text-stamp-cream/50 border-ink-border'
                    }`}
                  >
                    {isRevealed ? 'UNVEILED' : 'LOCKED'}
                  </span>
                </div>

                {/* Genre & Teaser Title */}
                <div className="text-center mb-6">
                  <div className="text-xs font-mono text-terracotta mb-2 font-semibold uppercase">
                    {teaser.genre}
                  </div>
                  <h3 className="text-xl font-bold font-display text-stamp-cream">
                    {isRevealed ? teaser.placeholderName : 'ARTIST TRANSMISSION'}
                  </h3>
                </div>

                {/* Hint Text Area */}
                <div className="p-4 rounded-xl bg-black/40 border border-ink-border text-center min-h-[70px] flex items-center justify-center">
                  <p className="text-xs font-mono text-stamp-cream/80 leading-relaxed">
                    {isRevealed ? teaser.hint : "Click below to reveal the lineup teaser."}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleReveal(teaser.id)}
                className={`mt-6 w-full py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  isRevealed
                    ? 'bg-ink-surface text-terracotta border border-terracotta hover:bg-terracotta/10'
                    : 'bg-terracotta text-stamp-cream hover:bg-terracotta-light shadow-terracotta-glow'
                }`}
              >
                {isRevealed ? (
                  <>
                    <Unlock className="w-3.5 h-3.5" />
                    <span>RE-LOCK TEASER</span>
                  </>
                ) : (
                  <>
                    <Radio className="w-3.5 h-3.5" />
                    <span>TUNE FREQUENCY</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
