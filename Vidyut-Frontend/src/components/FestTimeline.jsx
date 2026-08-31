import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Radio } from 'lucide-react';
import { FEST_SCHEDULE } from '../data/festData';
import { sound } from '../audio/SoundEngine';

export const FestTimeline = () => {
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const currentDay = FEST_SCHEDULE[selectedDayIdx];

  const handleDaySelect = (idx) => {
    sound.playRelayClick(1.1);
    setSelectedDayIdx(idx);
  };

  return (
    <section id="schedule" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto select-none">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-ink-surface border border-terracotta/40 mb-3 shadow-sm">
          <span className="font-mono text-xs text-terracotta uppercase tracking-wider font-semibold">
            FESTIVAL ROADMAP
          </span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-stamp-cream mb-3">
          OCTOBER 15 – 18 SCHEDULE
        </h2>
        <p className="text-xs sm:text-sm font-body text-stamp-cream/70 max-w-lg mx-auto">
          Four days of robotics, coding marathons, workshops, pro-nights, and grand finales.
        </p>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
        {FEST_SCHEDULE.map((item, idx) => (
          <button
            key={item.day}
            onClick={() => handleDaySelect(idx)}
            className={`px-6 py-3.5 rounded-2xl border text-xs font-mono tracking-wider transition-all duration-200 flex flex-col items-center min-w-[140px] ${
              selectedDayIdx === idx
                ? 'bg-terracotta text-stamp-cream font-bold shadow-terracotta-glow border-terracotta'
                : 'bg-ink-surface text-stamp-cream/70 hover:text-stamp-cream border-ink-border hover:border-terracotta/40'
            }`}
          >
            <span className="text-[10px] opacity-80">{item.day}</span>
            <span className="text-sm font-bold font-display">{item.date}</span>
          </button>
        ))}
      </div>

      {/* Current Day Schedule Card */}
      <div className="p-6 sm:p-10 rounded-2xl border border-terracotta/40 bg-ink-surface max-w-4xl mx-auto shadow-2xl">
        {/* Day Theme Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-ink-border pb-4 mb-6 gap-2">
          <div>
            <span className="text-[10px] font-mono text-terracotta uppercase tracking-widest block font-bold">
              SCHEDULE FOCUS
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-stamp-cream">
              {currentDay.theme}
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-stamp-cream/70">
            <Radio className="w-4 h-4 text-terracotta animate-pulse" />
            <span>DAILY LINEUP</span>
          </div>
        </div>

        {/* Schedule List */}
        <div className="space-y-3.5">
          {currentDay.events.map((event, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-black/40 border border-ink-border hover:border-terracotta/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex items-start sm:items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs font-mono text-terracotta font-bold min-w-[90px]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{event.time}</span>
                </div>
                <div className="text-sm font-medium text-stamp-cream">
                  {event.title}
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono text-stamp-cream/60 self-end sm:self-auto">
                <MapPin className="w-3.5 h-3.5 text-terracotta" />
                <span>{event.loc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
