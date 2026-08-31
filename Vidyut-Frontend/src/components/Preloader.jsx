import React, { useState, useEffect } from 'react';
import { Zap, Sparkles } from 'lucide-react';
import { sound } from '../audio/SoundEngine';

export const Preloader = ({ onComplete }) => {
  const [percent, setPercent] = useState(0);
  const [statusLog, setStatusLog] = useState("INITIALIZING VIDYUT 2026...");

  useEffect(() => {
    const logs = [
      { at: 10, text: "CONNECTING TO AMRITA CORE NODE..." },
      { at: 28, text: "SYNCHRONIZING 45,000+ DELEGATE AURAS..." },
      { at: 48, text: "ENERGIZING 440V ROBOTIC COMBAT ARENAS..." },
      { at: 68, text: "CALIBRATING EDM STADIUM PRO-SHOW RIGS..." },
      { at: 85, text: "LOCK IN // WE ARE OFFICIALLY COOKING 🔥" },
      { at: 96, text: "TRANSMUTING FREQUENCIES: BE THE CHANGE..." },
      { at: 100, text: "OVERDRIVE COMPLETE. FAAAHHH!" },
    ];

    let current = 0;
    // ~2.8s total duration for a satisfying, immersive initial load
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 3) + 1;
      if (current >= 100) {
        current = 100;
        setPercent(100);
        clearInterval(interval);
        
        // Play FAAAH meme sound on completion!
        sound.playFaaah();

        setTimeout(() => {
          onComplete();
        }, 850);
      } else {
        setPercent(current);
        const matchingLog = logs.slice().reverse().find((l) => current >= l.at);
        if (matchingLog) {
          setStatusLog(matchingLog.text);
        }
      }
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSkip = () => {
    sound.playFaaah();
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#06070d] text-white select-none px-6">
      {/* Vibrant Ambient Glow Layers */}
      <div className="absolute w-[500px] h-[500px] bg-neon-cyan/25 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute w-[450px] h-[450px] bg-neon-violet/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-20 w-[400px] h-[400px] bg-neon-pink/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full text-center">
        {/* Glowing Badge Icon */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-neon-cyan via-neon-violet to-neon-pink p-0.5 shadow-cyan-sharp mb-6 animate-bounce">
          <div className="w-full h-full bg-[#07080e] rounded-[22px] flex items-center justify-center">
            <Zap className="w-10 h-10 text-neon-cyan animate-pulse" />
          </div>
        </div>

        <div className="text-xs font-mono text-neon-cyan font-bold tracking-widest uppercase mb-1">
          AMRITA VISHWA VIDYAPEETHAM
        </div>

        <h2 className="text-4xl sm:text-5xl font-syne font-black tracking-tight text-white mb-2">
          VIDYUT '26
        </h2>

        {/* Dynamic Percentage Counter */}
        <div className="flex items-baseline gap-1 my-4">
          <span className="font-syne text-7xl sm:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-violet">
            {String(percent).padStart(3, '0')}
          </span>
          <span className="font-mono text-xl text-neon-cyan font-bold">%</span>
        </div>

        {/* Neon Gradient Progress Bar */}
        <div className="w-full h-3 bg-cyber-card border border-neon-cyan/40 rounded-full overflow-hidden mb-4 shadow-cyan-glow">
          <div
            className="h-full bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-pink transition-all duration-75 rounded-full"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Live Status Telemetry */}
        <div className="h-6 font-mono text-xs sm:text-sm text-neon-cyan font-semibold tracking-wide">
          {statusLog}
        </div>

        {/* Instant Skip CTA */}
        <button
          onClick={handleSkip}
          className="mt-8 text-xs font-mono tracking-widest text-white/60 hover:text-neon-cyan px-5 py-2 rounded-full border border-white/20 hover:border-neon-cyan transition-all uppercase hover:bg-neon-cyan/10"
        >
          [ SKIP INITIALIZATION ⚡ ]
        </button>
      </div>
    </div>
  );
};
