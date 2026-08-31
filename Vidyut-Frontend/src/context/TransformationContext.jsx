import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { FEST_METADATA } from '../data/festData';
import { sound } from '../audio/SoundEngine';

const TransformationContext = createContext(null);

export const TransformationProvider = ({ children }) => {
  // Target date timestamp
  const targetTimestamp = useMemo(() => new Date(FEST_METADATA.targetDate).getTime(), []);
  const startAnchorTimestamp = useMemo(() => new Date(FEST_METADATA.startDateISO).getTime(), []);
  const totalSpanMs = useMemo(() => Math.max(1, targetTimestamp - startAnchorTimestamp), [targetTimestamp, startAnchorTimestamp]);

  // Live time remaining
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
    totalRemainingMs: 0,
  });

  // Manual scrubber override for interactive demonstration
  const [isScrubberActive, setIsScrubberActive] = useState(false);
  const [manualProgress, setManualProgress] = useState(0.42); // Default initial aesthetic midpoint if scrubbing

  // Pillar relay activations (4 Pillars of Change)
  const [activePillars, setActivePillars] = useState(new Set(['tech'])); // Tech active by default
  const [lastActivatedPillar, setLastActivatedPillar] = useState('tech');

  // Audio mute state
  const [isMuted, setIsMuted] = useState(sound.isMuted);

  // Modals & Active Views
  const [activeEventModal, setActiveEventModal] = useState(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [instrumentNeedleKickCount, setInstrumentNeedleKickCount] = useState(0);

  // Live countdown tick
  useEffect(() => {
    const calculateTime = () => {
      const now = Date.now();
      const diff = Math.max(0, targetTimestamp - now);

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      const ms = Math.floor((diff % 1000) / 10); // 0-99

      setTimeLeft({
        days: d,
        hours: h,
        minutes: m,
        seconds: s,
        milliseconds: ms,
        totalRemainingMs: diff,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 50); // High-res frame tick
    return () => clearInterval(interval);
  }, [targetTimestamp]);

  // Unified transformation progress calculation (0.00 -> 1.00)
  const computedProgress = useMemo(() => {
    if (isScrubberActive) return manualProgress;
    
    // Natural timeline calculation: percentage of time elapsed toward fest
    const now = Date.now();
    const elapsed = now - startAnchorTimestamp;
    const rawProgress = elapsed / totalSpanMs;
    // Keep it in a tangible aesthetic range (e.g. 0.35 to 0.95) for the countdown experience
    return Math.min(Math.max(rawProgress, 0.32), 1.0);
  }, [isScrubberActive, manualProgress, startAnchorTimestamp, totalSpanMs]);

  // Pillar toggle handler
  const activatePillar = useCallback((pillarId) => {
    setActivePillars((prev) => {
      const next = new Set(prev);
      const wasPresent = next.has(pillarId);
      if (wasPresent) {
        if (next.size > 1) { // Keep at least one active
          next.delete(pillarId);
          sound.playRelayClick(0.85);
        }
      } else {
        next.add(pillarId);
        sound.playRelayClick(1.15);
        setLastActivatedPillar(pillarId);
        if (next.size === 4) {
          sound.playEnergySurge();
        }
      }
      return next;
    });
  }, []);

  // Needle interaction trigger
  const triggerNeedleKick = useCallback(() => {
    sound.playNeedleKick();
    sound.playRelayClick(1.3);
    setInstrumentNeedleKickCount((c) => c + 1);
  }, []);

  const toggleMuteState = useCallback(() => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sound.playRelayClick(1.0);
    }
  }, []);

  const value = {
    timeLeft,
    transformationProgress: computedProgress,
    isScrubberActive,
    setIsScrubberActive,
    manualProgress,
    setManualProgress,
    activePillars,
    activatePillar,
    allPillarsActive: activePillars.size === 4,
    lastActivatedPillar,
    instrumentNeedleKickCount,
    triggerNeedleKick,
    isMuted,
    toggleMuteState,
    activeEventModal,
    setActiveEventModal,
    isPassModalOpen,
    setIsPassModalOpen,
    isShareModalOpen,
    setIsShareModalOpen,
  };

  return (
    <TransformationContext.Provider value={value}>
      {children}
    </TransformationContext.Provider>
  );
};

export const useTransformation = () => {
  const context = useContext(TransformationContext);
  if (!context) {
    throw new Error('useTransformation must be used within a TransformationProvider');
  }
  return context;
};
