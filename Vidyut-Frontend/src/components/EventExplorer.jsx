import React, { useState } from 'react';
import { Trophy, Users, ArrowUpRight, Filter } from 'lucide-react';
import { useTransformation } from '../context/TransformationContext';
import { FEST_EVENTS } from '../data/festData';
import { sound } from '../audio/SoundEngine';

export const EventExplorer = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { setActiveEventModal } = useTransformation();

  const categories = ['All', 'Technical', 'Cultural', 'Workshops', 'Esports', 'Management'];

  const filteredEvents = selectedCategory === 'All'
    ? FEST_EVENTS
    : FEST_EVENTS.filter((e) => e.category === selectedCategory);

  const handleCategoryChange = (cat) => {
    sound.playRelayClick(1.05);
    setSelectedCategory(cat);
  };

  const handleEventClick = (event) => {
    sound.playRelayClick(1.2);
    setActiveEventModal(event);
  };

  return (
    <section id="arenas" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto select-none">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-ink-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ink-surface border border-terracotta/40 mb-2 shadow-sm">
            <span className="font-mono text-xs text-terracotta uppercase tracking-wider font-semibold">
              COMPETITIVE ARENAS
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-stamp-cream">
            FESTIVAL EVENTS & PRIZES
          </h2>
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-terracotta text-stamp-cream font-bold shadow-terracotta-glow'
                  : 'bg-ink-surface text-stamp-cream/70 hover:text-stamp-cream border border-ink-border hover:border-terracotta/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            onClick={() => handleEventClick(event)}
            className="group relative p-6 rounded-xl border border-ink-border bg-ink-surface/90 hover:border-terracotta hover:shadow-terracotta-glow transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Category & Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-black/50 text-stamp-cream border border-ink-border uppercase font-semibold">
                  {event.category}
                </span>
                <span className="text-[10px] font-mono font-bold text-terracotta">
                  {event.badge}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base font-bold font-display text-stamp-cream group-hover:text-terracotta-light transition-colors line-clamp-2 mb-2">
                {event.title}
              </h3>

              {/* Short Description */}
              <p className="text-xs text-stamp-cream/65 font-body leading-relaxed line-clamp-3 mb-4">
                {event.shortDesc}
              </p>
            </div>

            {/* Bottom Card Specs */}
            <div className="pt-4 border-t border-ink-border flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-1.5 text-terracotta font-bold">
                <Trophy className="w-3.5 h-3.5" />
                <span>{event.prize}</span>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-stamp-cream/70 group-hover:text-terracotta group-hover:translate-x-0.5 transition-transform">
                <span>DETAILS</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
