import React, { useEffect, useState } from 'react';

export const RippleTransition = ({ onComplete }) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Start the expansion shortly after mounting
    const startTimer = setTimeout(() => {
      setIsActive(true);
    }, 50);

    // Wait for the animation to finish before moving to the main page
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 1500);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#06070d] overflow-hidden pointer-events-none">
      
      {/* Outer Glow Ring */}
      <div
        className={`absolute rounded-full border border-cyan-400/50 transition-all duration-[1200ms] ease-out
          ${isActive ? 'w-[250vmax] h-[250vmax] opacity-0' : 'w-0 h-0 opacity-100'}
        `}
        style={{ boxShadow: '0 0 80px 30px rgba(0, 255, 255, 0.3)' }}
      />

      {/* Main Flash/Shockwave */}
      <div
        className={`absolute rounded-full bg-white transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] delay-100
          ${isActive ? 'w-[300vmax] h-[300vmax] opacity-0' : 'w-0 h-0 opacity-100'}
        `}
      />

    </div>
  );
};