import React, { useState } from 'react';
import { X, Sparkles, Check, Send, Heart } from 'lucide-react';
import { sound } from '../audio/SoundEngine';

export const ShowInterestModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    sound.playFaaah();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setEmail('');
      setName('');
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
      <div className="relative w-full max-w-md rounded-3xl p-6 sm:p-8 bg-[#0a0c14] border border-white/20 shadow-2xl text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-white to-gray-400 text-black flex items-center justify-center font-bold">
              ⚡
            </div>
            <h3 className="font-impact text-2xl tracking-wide text-white uppercase">
              REGISTER YOUR INTEREST
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-white text-black flex items-center justify-center text-2xl shadow-cyan-glow">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>
            <h4 className="font-impact text-2xl tracking-wide text-white">
              YOU'RE ON THE PRIORITY LIST
            </h4>
            <p className="text-xs text-white/70 font-outfit">
              We'll notify you the moment early-bird registration and team slots open for VIDYUT 2026.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-white/70 font-outfit leading-relaxed">
              Get early access to flagship hackathon slots, concert front-row passes, and robotic arena registrations.
            </p>

            <div>
              <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1 font-bold">
                YOUR NAME
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1 font-bold">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3.5 rounded-full bg-gradient-to-r from-silver-top to-silver-bottom text-black font-impact text-base tracking-wider uppercase shadow-silver-glow hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 font-bold"
            >
              <Heart className="w-4 h-4 fill-current text-black" />
              <span>CONFIRM INTEREST</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
