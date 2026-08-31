import React from 'react';
import { X, Trophy, Users, MapPin, Clock } from 'lucide-react';
import { useTransformation } from '../context/TransformationContext';
import { sound } from '../audio/SoundEngine';

export const EventModal = () => {
  const {
    activeEventModal,
    setActiveEventModal,
    setIsPassModalOpen,
  } = useTransformation();

  if (!activeEventModal) return null;
  const event = activeEventModal;

  const handleClose = () => {
    sound.playRelayClick(0.9);
    setActiveEventModal(null);
  };

  const handleRegister = () => {
    sound.playRelayClick(1.2);
    setActiveEventModal(null);
    setIsPassModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
      <div className="relative w-full max-w-2xl rounded-2xl border border-terracotta/50 bg-ink-surface text-stamp-cream p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-ink-border pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-black/50 text-stamp-cream border border-ink-border uppercase font-semibold">
                {event.category}
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-terracotta/20 text-terracotta border border-terracotta/40 uppercase font-bold">
                {event.badge}
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-stamp-cream">
              {event.title}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full text-stamp-cream/60 hover:text-stamp-cream hover:bg-black/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3 rounded-xl bg-black/40 border border-ink-border">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-terracotta font-semibold mb-1">
              <Trophy className="w-3.5 h-3.5" />
              <span>PRIZE POOL</span>
            </div>
            <div className="font-mono font-bold text-sm text-stamp-cream">
              {event.prize}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-ink-border">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-stamp-cream/60 font-semibold mb-1">
              <Users className="w-3.5 h-3.5" />
              <span>TEAM SQUAD</span>
            </div>
            <div className="font-mono font-bold text-xs text-stamp-cream">
              {event.teamSize}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-ink-border">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-stamp-cream/60 font-semibold mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>SCHEDULE</span>
            </div>
            <div className="font-mono font-bold text-[11px] text-stamp-cream truncate">
              {event.time}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-ink-border">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-stamp-cream/60 font-semibold mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>VENUE</span>
            </div>
            <div className="font-mono font-bold text-[11px] text-stamp-cream truncate">
              {event.venue}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h4 className="text-xs font-mono tracking-wider text-terracotta uppercase font-bold mb-2">
            EVENT BRIEFING
          </h4>
          <p className="text-sm text-stamp-cream/80 font-body leading-relaxed">
            {event.shortDesc}
          </p>
        </div>

        {/* Rulebook Clauses */}
        <div className="mb-6">
          <h4 className="text-xs font-mono tracking-wider text-terracotta uppercase font-bold mb-2">
            RULES & PROTOCOLS
          </h4>
          <ul className="space-y-2 text-xs text-stamp-cream/70 font-mono">
            {event.rules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-terracotta font-bold">[{idx + 1}]</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-ink-border pt-4">
          <div className="text-[10px] font-mono text-stamp-cream/60">
            LIMITED SLOTS AVAILABLE
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2.5 rounded-full text-xs font-mono text-stamp-cream/70 hover:text-stamp-cream border border-ink-border hover:border-terracotta"
            >
              CLOSE
            </button>
            <button
              onClick={handleRegister}
              className="px-6 py-2.5 rounded-full bg-terracotta hover:bg-terracotta-light text-stamp-cream font-mono text-xs font-bold uppercase tracking-wider shadow-terracotta-glow transition-all"
            >
              REGISTER WITH PASS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
