import React from 'react';
import { Cpu, Radio, Zap, Compass, CheckCircle2 } from 'lucide-react';
import { useTransformation } from '../context/TransformationContext';
import { PILLARS_OF_CHANGE } from '../data/festData';

const iconMap = {
  Cpu,
  Radio,
  Zap,
  Compass,
};

export const BeTheChange = () => {
  const {
    activePillars,
    activatePillar,
    allPillarsActive,
  } = useTransformation();

  return (
    <section id="pillars" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto select-none">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ink-surface border border-terracotta/40 mb-3 shadow-sm">
          <span className="font-mono text-xs text-terracotta uppercase tracking-wider font-semibold">
            FOUNDATIONAL DOMAINS
          </span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-stamp-cream mb-4">
          THE FOUR PILLARS
        </h2>
        <p className="text-xs sm:text-sm font-body text-stamp-cream/70 leading-relaxed max-w-xl mx-auto">
          VIDYUT converges engineering brilliance, artistic expression, ecological innovation, and intellectual strategy.
        </p>
      </div>

      {/* 4 Pillar Grid in Postage Stamp Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PILLARS_OF_CHANGE.map((pillar) => {
          const Icon = iconMap[pillar.icon] || Zap;
          const isActive = activePillars.has(pillar.id);

          return (
            <div
              key={pillar.id}
              onClick={() => activatePillar(pillar.id)}
              className={`group relative p-6 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-ink-card border-terracotta shadow-terracotta-glow'
                  : 'bg-ink-surface/80 border-ink-border opacity-85 hover:opacity-100 hover:border-terracotta/40'
              }`}
            >
              <div>
                {/* Stamp Top Perforation Strip */}
                <div className="flex items-center justify-between mb-4 border-b border-ink-border pb-3">
                  <span className="text-[10px] font-mono text-terracotta tracking-wider font-bold">
                    {pillar.tag}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full transition-colors ${
                        isActive ? 'bg-terracotta shadow-terracotta-glow' : 'bg-ink-border'
                      }`}
                    />
                    <span className="text-[10px] font-mono font-bold text-stamp-cream/80">
                      {isActive ? 'ACTIVE' : 'DORMANT'}
                    </span>
                  </div>
                </div>

                {/* Pillar Icon & Metric */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors ${
                      isActive
                        ? 'border-terracotta bg-terracotta/15 text-terracotta'
                        : 'border-ink-border text-stamp-cream/40 bg-black/30'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xl font-mono font-bold text-stamp-cream">
                    {pillar.metric}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-bold font-display text-stamp-cream mb-1">
                  {pillar.title}
                </h3>
                <p className="text-[11px] font-mono text-terracotta-light mb-3">
                  {pillar.subtitle}
                </p>
                <p className="text-xs text-stamp-cream/70 font-body leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              {/* Bottom State Bar */}
              <div className="mt-6 pt-4 border-t border-ink-border flex items-center justify-between text-xs font-mono">
                <span className="text-stamp-cream/50 text-[10px]">
                  CIRCUIT STATE
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider transition-colors ${
                    isActive
                      ? 'bg-terracotta/20 text-terracotta border border-terracotta/40'
                      : 'bg-black/40 text-stamp-cream/40 border border-ink-border'
                  }`}
                >
                  {isActive ? 'ENERGIZED' : 'CLICK TO LATCH'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Global Status Bar */}
      <div className="mt-12 p-4 rounded-xl bg-ink-surface border border-terracotta/30 max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${
              allPillarsActive
                ? 'bg-terracotta shadow-terracotta-glow animate-pulse'
                : 'bg-terracotta-dark'
            }`}
          />
          <div>
            <div className="text-stamp-cream font-bold">
              {allPillarsActive
                ? 'ALL PILLARS SYNCHRONIZED'
                : `${activePillars.size} OF 4 PILLARS ENERGIZED`}
            </div>
            <div className="text-[10px] text-stamp-cream/60">
              {allPillarsActive
                ? 'Harmonic frequency achieved across all festival tracks.'
                : 'Click any pillar card to activate its circuit.'}
            </div>
          </div>
        </div>

        {allPillarsActive && (
          <span className="px-3 py-1 rounded-full bg-terracotta/15 border border-terracotta/40 text-terracotta text-[10px] font-bold uppercase tracking-wider">
            HARMONIC CONVERGENCE
          </span>
        )}
      </div>
    </section>
  );
};
