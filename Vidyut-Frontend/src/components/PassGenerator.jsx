import React, { useState } from 'react';
import { X, Ticket, Download, Check, QrCode } from 'lucide-react';
import { useTransformation } from '../context/TransformationContext';
import { sound } from '../audio/SoundEngine';

export const PassGenerator = () => {
  const { isPassModalOpen, setIsPassModalOpen } = useTransformation();

  const [name, setName] = useState('ALEXANDER VANCE');
  const [college, setCollege] = useState('AMRITA VISHWA VIDYAPEETHAM');
  const [tier, setTier] = useState('ALL-ACCESS VIP');
  const [isCopied, setIsCopied] = useState(false);

  if (!isPassModalOpen) return null;

  const passId = `VDY-2026-${Math.abs((name.length * 73819 + tier.length * 291) % 89999 + 10000)}`;

  const handleClose = () => {
    sound.playRelayClick(0.9);
    setIsPassModalOpen(false);
  };

  const handleDownload = () => {
    sound.playEnergySurge();
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
      <div className="relative w-full max-w-2xl rounded-2xl border border-terracotta/50 bg-ink-surface text-stamp-cream p-6 sm:p-8 max-h-[95vh] overflow-y-auto shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-ink-border pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <Ticket className="w-5 h-5 text-terracotta" />
            <h3 className="text-xl sm:text-2xl font-bold font-display text-stamp-cream">
              DELEGATE FEST PASS
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full text-stamp-cream/60 hover:text-stamp-cream hover:bg-black/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Column: Form Inputs on Left, Stamp Badge Preview on Right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          
          {/* Controls Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono text-terracotta font-bold uppercase mb-1.5">
                DELEGATE NAME
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={26}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-ink-border text-stamp-cream font-mono text-xs focus:outline-none focus:border-terracotta"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-terracotta font-bold uppercase mb-1.5">
                COLLEGE / INSTITUTION
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                maxLength={34}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-ink-border text-stamp-cream font-mono text-xs focus:outline-none focus:border-terracotta"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-terracotta font-bold uppercase mb-1.5">
                PASS TIER
              </label>
              <select
                value={tier}
                onChange={(e) => {
                  sound.playRelayClick(1.0);
                  setTier(e.target.value);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-ink-border text-stamp-cream font-mono text-xs focus:outline-none focus:border-terracotta cursor-pointer"
              >
                <option value="ALL-ACCESS VIP">ALL-ACCESS VIP (Arena + Pro-Nights)</option>
                <option value="TECHNICAL BUILDER">TECHNICAL BUILDER (Hackathon + Arenas)</option>
                <option value="CULTURAL DELEGATE">CULTURAL DELEGATE (Bands + Choreo)</option>
                <option value="WORKSHOP PASS">WORKSHOP PASS (AI Conclave + Labs)</option>
              </select>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-ink-border text-xs font-mono text-stamp-cream/70 leading-relaxed">
              <span className="text-terracotta font-bold">INFO:</span> Grants full entry to competitive stages, keynote conclaves, and concert grounds at Amrita Vishwa Vidyapeetham.
            </div>
          </div>

          {/* Dynamic Postage Stamp Delegate Badge (Inspired by User Uploaded Art) */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-[280px] p-5 rounded-2xl border-2 border-terracotta bg-stamp-cream text-stamp-ink shadow-2xl relative overflow-hidden flex flex-col justify-between">
              
              {/* Postage Stamp Header */}
              <div className="flex items-start justify-between border-b-2 border-stamp-ink/20 pb-2 mb-3">
                <div>
                  <div className="text-[9px] font-mono font-bold tracking-widest text-terracotta uppercase">
                    OFFICIAL ADMISSION
                  </div>
                  <div className="font-display font-black text-xl tracking-tight text-stamp-ink leading-tight">
                    VIDYUT '26
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-display font-black text-lg text-terracotta block leading-none">
                    ₹500
                  </span>
                  <span className="text-[8px] font-mono text-stamp-ink/60">
                    AMRITA
                  </span>
                </div>
              </div>

              {/* Delegate Details */}
              <div className="mb-4">
                <span className="text-[9px] font-mono font-bold text-stamp-ink/60 uppercase block">
                  AUTHORIZED DELEGATE
                </span>
                <div className="text-base font-bold font-display text-stamp-ink truncate">
                  {name || 'DELEGATE NAME'}
                </div>
                <div className="text-[10px] font-mono text-stamp-ink/75 truncate mt-0.5">
                  {college || 'COLLEGE / UNIVERSITY'}
                </div>
                <div className="mt-2 inline-block px-2 py-0.5 rounded bg-terracotta text-stamp-cream font-mono text-[9px] font-bold uppercase">
                  {tier}
                </div>
              </div>

              {/* QR Code and Pass Identifier */}
              <div className="p-2.5 rounded-xl bg-ink-navy text-stamp-cream flex items-center justify-between gap-3 mb-2">
                <div className="space-y-0.5">
                  <span className="text-[8px] font-mono text-stamp-cream/60 block">
                    TELEMETRY CODE
                  </span>
                  <div className="text-xs font-mono font-bold text-electric-cyan">
                    {passId}
                  </div>
                  <div className="text-[8px] font-mono text-stamp-cream/50">
                    OCT 15 – 18, 2026
                  </div>
                </div>

                <div className="w-11 h-11 bg-white p-1 rounded-lg flex items-center justify-center">
                  <QrCode className="w-full h-full text-black" />
                </div>
              </div>

              {/* Stamp Footer Tagline */}
              <div className="text-[8px] font-mono font-bold text-terracotta text-center tracking-widest uppercase border-t border-stamp-ink/20 pt-1.5">
                BE THE CHANGE • AMRITAPURI
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-8 pt-4 border-t border-ink-border flex items-center justify-between">
          <div className="text-[11px] font-mono text-stamp-cream/60">
            OFFICIAL AMRITA CREDENTIALS
          </div>
          <button
            onClick={handleDownload}
            className="px-6 py-3 rounded-full bg-terracotta hover:bg-terracotta-light text-stamp-cream font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-terracotta-glow transition-all"
          >
            {isCopied ? (
              <>
                <Check className="w-4 h-4" />
                <span>SAVED TO WALLET</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>DOWNLOAD DELEGATE PASS</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
