import React, { useState } from 'react';
import { X, Share2, Copy, Check, MessageSquare, Send, Globe } from 'lucide-react';
import { useTransformation } from '../context/TransformationContext';
import { FEST_METADATA } from '../data/festData';
import { sound } from '../audio/SoundEngine';

export const ShareModal = () => {
  const { isShareModalOpen, setIsShareModalOpen, timeLeft, transformationProgress } = useTransformation();
  const [isCopied, setIsCopied] = useState(false);

  if (!isShareModalOpen) return null;

  const isFuture = transformationProgress > 0.65;
  const shareText = `⚡ VIDYUT 2026 — Amrita Vishwa Vidyapeetham National Multi-Fest! Theme: BE THE CHANGE. Countdown: ${timeLeft.days}d ${timeLeft.hours}h remaining! Explore the arenas:`;
  const url = typeof window !== 'undefined' ? window.location.href : 'https://vidyut.amrita.edu';

  const handleClose = () => {
    sound.playRelayClick(0.9);
    setIsShareModalOpen(false);
  };

  const handleCopyLink = () => {
    sound.playEnergySurge();
    navigator.clipboard.writeText(`${shareText} ${url}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const shareToWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + url)}`, '_blank');
  };

  const shareToX = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none">
      <div
        className={`relative w-full max-w-md rounded-lg border p-6 ${
          isFuture
            ? 'bg-void-surface border-current-teal/50 shadow-teal-sharp text-glass-white'
            : 'bg-patina-surface border-brass/50 shadow-brass-glow text-parchment'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brass/20 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-filament-orange" />
            <h3
              className={`text-lg font-bold ${
                isFuture ? 'font-display text-glass-white' : 'font-vintage text-parchment'
              }`}
            >
              TRANSMIT COUNTDOWN
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded text-parchment/60 hover:text-parchment hover:bg-black/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Countdown Snippet */}
        <div className="p-4 rounded bg-black/50 border border-brass/20 mb-5 text-center">
          <div className="text-[10px] font-mono text-brass/70 uppercase mb-1">
            ACTIVE COUNTDOWN TELEMETRY
          </div>
          <div className="text-xl font-mono font-bold text-parchment mb-1">
            {timeLeft.days}D : {timeLeft.hours}H : {timeLeft.minutes}M : {timeLeft.seconds}S
          </div>
          <div className="text-[11px] font-mono text-current-teal">
            VIDYUT 2026 // BE THE CHANGE
          </div>
        </div>

        {/* Social Share Buttons */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <button
            onClick={shareToWhatsApp}
            className="p-3 rounded bg-black/40 border border-brass/20 hover:border-current-teal flex flex-col items-center gap-1.5 transition-colors"
          >
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <span className="text-[10px] font-mono text-parchment">WhatsApp</span>
          </button>

          <button
            onClick={shareToX}
            className="p-3 rounded bg-black/40 border border-brass/20 hover:border-current-teal flex flex-col items-center gap-1.5 transition-colors"
          >
            <span className="font-mono font-bold text-base text-sky-400">𝕏</span>
            <span className="text-[10px] font-mono text-parchment">X (Twitter)</span>
          </button>

          <button
            onClick={shareToLinkedIn}
            className="p-3 rounded bg-black/40 border border-brass/20 hover:border-current-teal flex flex-col items-center gap-1.5 transition-colors"
          >
            <Globe className="w-5 h-5 text-blue-400" />
            <span className="text-[10px] font-mono text-parchment">LinkedIn</span>
          </button>
        </div>

        {/* Copy Link Input Bar */}
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={url}
            className="w-full px-3 py-2 rounded bg-black/60 border border-brass/30 text-parchment font-mono text-xs focus:outline-none"
          />
          <button
            onClick={handleCopyLink}
            className={`px-4 py-2 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              isFuture
                ? 'bg-current-teal text-void hover:bg-white shadow-teal-sharp'
                : 'bg-brass text-patina-black hover:bg-brass-light shadow-brass-glow'
            }`}
          >
            {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{isCopied ? 'COPIED' : 'COPY'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
