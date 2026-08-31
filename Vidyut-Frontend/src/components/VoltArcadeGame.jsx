import React, { useState, useEffect, useRef } from 'react';
import { Zap, Trophy, RotateCcw, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../audio/SoundEngine';

export const VoltArcadeGame = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('vidyut_high_score') || '0', 10);
  });
  const [combo, setCombo] = useState(0);
  const [sparks, setSparks] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameTimeLeft, setGameTimeLeft] = useState(30);
  const [isOverdrive, setIsOverdrive] = useState(false);
  const [comboStatus, setComboStatus] = useState("TAP SPARKS TO CHARGE");

  const gameAreaRef = useRef(null);

  const getStatusText = (c) => {
    if (c >= 25) return "MAXIMUM ENERGY CONVERGENCE";
    if (c >= 20) return "HIGH VOLTAGE OVERDRIVE";
    if (c >= 15) return "SYSTEM SYNCHRONIZED";
    if (c >= 10) return "PEAK FREQUENCY DETECTED";
    if (c >= 5) return "ACCELERATING CURRENT";
    if (c >= 1) return "CHARGING CAPACITORS";
    return "TAP SPARKS TO CHARGE";
  };

  const startGame = () => {
    sound.playEnergySurge();
    setScore(0);
    setCombo(0);
    setGameTimeLeft(30);
    setIsPlaying(true);
    setIsOverdrive(false);
    setComboStatus("CHARGING GRID");
  };

  useEffect(() => {
    if (!isPlaying) return;

    const spawnInterval = setInterval(() => {
      if (sparks.length < 5) {
        const id = Math.random().toString(36).substring(2, 9);
        const isGold = Math.random() > 0.8;
        const x = Math.floor(Math.random() * 80) + 10;
        const y = Math.floor(Math.random() * 70) + 15;
        const size = isGold ? 48 : 40;

        setSparks((prev) => [
          ...prev.slice(-4),
          { id, x, y, isGold, size, expiresAt: Date.now() + 2400 },
        ]);
      }
    }, 450);

    return () => clearInterval(spawnInterval);
  }, [isPlaying, sparks]);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setGameTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsPlaying(false);
          sound.playEnergySurge();
          return 0;
        }
        return prev - 1;
      });

      setSparks((prev) => {
        const now = Date.now();
        const active = prev.filter((s) => s.expiresAt > now);
        if (active.length < prev.length) {
          setCombo(0);
          setComboStatus("STREAK INTERRUPTED");
        }
        return active;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('vidyut_high_score', score.toString());
    }
  }, [score, highScore]);

  const handleSparkClick = (spark, e) => {
    e.stopPropagation();
    sound.playRelayClick(1.2 + Math.min(combo * 0.05, 1.0));

    const addedPoints = spark.isGold ? 500 : 150;
    const newCombo = combo + 1;
    const newScore = score + addedPoints * Math.min(newCombo, 5);

    setScore(newScore);
    setCombo(newCombo);
    setComboStatus(getStatusText(newCombo));

    setSparks((prev) => prev.filter((s) => s.id !== spark.id));

    if (newCombo >= 15 && !isOverdrive) {
      setIsOverdrive(true);
      sound.playEnergySurge();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#ffffff', '#cbd5e1', '#94a3b8', '#e50914'],
      });
    }
  };

  return (
    <div id="arcade" className="w-full max-w-4xl mx-auto my-16 px-4 select-none">
      <div className="relative rounded-3xl p-6 sm:p-8 bg-[#090a10] border border-white/15 shadow-2xl overflow-hidden">
        
        {/* Top Header & Scoreboard */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-black flex items-center justify-center font-impact text-xl">
              ⚡
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-syncopate font-bold text-base text-white tracking-wider">
                  VOLT RUSH
                </span>
                <span className="text-[9px] font-syncopate font-bold px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/20">
                  REACTOR ARENA
                </span>
              </div>
              <p className="text-xs text-white/60 font-montserrat">
                Tap lightning sparks to build your score & charge the grid
              </p>
            </div>
          </div>

          {/* Score & Time Badges */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-black/60 border border-white/15 text-center">
              <div className="text-[9px] font-syncopate text-white/60 font-bold uppercase tracking-wider">
                POINTS
              </div>
              <div className="text-xl font-impact font-bold text-white">
                {score}
              </div>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-black/60 border border-white/15 text-center">
              <div className="text-[9px] font-syncopate text-white/60 font-bold uppercase tracking-wider">
                TIME LEFT
              </div>
              <div className="text-xl font-impact font-bold text-white">
                {gameTimeLeft}s
              </div>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-black/60 border border-white/15 text-center hidden md:block">
              <div className="text-[9px] font-syncopate text-white/60 font-bold uppercase tracking-wider">
                HIGH SCORE
              </div>
              <div className="text-xl font-impact font-bold text-white">
                {highScore}
              </div>
            </div>
          </div>
        </div>

        {/* Status Line */}
        <div className="relative z-10 mb-4 flex items-center justify-between text-xs font-syncopate tracking-wider">
          <span className="text-white/80 font-bold">
            {comboStatus}
          </span>
          <span className="text-white/80 font-bold">
            STREAK: <span className="text-white text-sm font-impact">{combo}x</span>
          </span>
        </div>

        {/* Play Arena */}
        <div
          ref={gameAreaRef}
          className="relative w-full h-[280px] sm:h-[340px] rounded-2xl bg-black border border-white/10 overflow-hidden flex items-center justify-center"
        >
          {/* Central Pulsing Core */}
          <div className="relative flex items-center justify-center">
            <div className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full border border-white/20 flex items-center justify-center transition-transform duration-300 ${
              isOverdrive ? 'scale-125 border-white shadow-silver-glow animate-pulse' : 'scale-100'
            }`}>
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/5 border border-white/30 flex items-center justify-center">
                <Zap className={`w-8 h-8 ${isOverdrive ? 'text-white animate-spin' : 'text-white/80'}`} />
              </div>
            </div>
          </div>

          {/* Spawning Sparks */}
          {isPlaying && sparks.map((spark) => (
            <button
              key={spark.id}
              onClick={(e) => handleSparkClick(spark, e)}
              style={{
                top: `${spark.y}%`,
                left: `${spark.x}%`,
                width: `${spark.size}px`,
                height: `${spark.size}px`,
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-125 active:scale-95 animate-bounce shadow-2xl ${
                spark.isGold
                  ? 'bg-white text-black border-2 border-white shadow-silver-glow'
                  : 'bg-white/90 text-black border border-white'
              }`}
            >
              <Zap className="w-5 h-5 fill-current" />
            </button>
          ))}

          {/* Idle / Finished Overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
              <h3 className="text-2xl sm:text-3xl font-impact font-bold text-white mb-2 tracking-wide uppercase">
                {score > 0 ? `SESSION COMPLETE: ${score} POINTS` : 'VIDYUT REACTOR READY'}
              </h3>
              <p className="text-xs sm:text-sm text-white/70 font-montserrat max-w-sm mb-6">
                {score > 0
                  ? `Peak streak reached: ${combo}x. Ready to break your high score?`
                  : 'Tap the spawning electric sparks within 30 seconds to charge the festival grid.'}
              </p>
              <button
                onClick={startGame}
                className="px-8 py-3.5 rounded-full bg-white text-black font-syncopate font-bold text-xs tracking-[0.2em] uppercase shadow-silver-glow hover:bg-gray-200 hover:scale-105 transition-all flex items-center gap-2"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>{score > 0 ? 'PLAY AGAIN' : 'START RUSH'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="relative z-10 mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-montserrat text-white/50">
          <span>VIDYUT 2026 • 45,000+ PARTICIPANTS COMPETING</span>

          {isPlaying && (
            <button
              onClick={startGame}
              className="flex items-center gap-1 text-white hover:underline transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESTART</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
