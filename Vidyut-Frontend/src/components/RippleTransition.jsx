
import React, { useEffect, useState } from 'react';

export const RippleTransition = ({ onComplete }) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Start the ripple immediately after mounting.
    const startTimer = setTimeout(() => {
      setIsActive(true);
    }, 30);

    // Complete as soon as the longest ripple animation finishes.
    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, 1230);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center overflow-hidden bg-[#06070d]">

      {/* OUTER CYAN RIPPLE */}
      <div
        className={`absolute rounded-full border border-cyan-400/50 ${
          isActive
            ? 'h-[250vmax] w-[250vmax] opacity-0'
            : 'h-0 w-0 opacity-100'
        }`}
        style={{
          boxShadow: '0 0 80px 30px rgba(0, 255, 255, 0.3)',
          transition:
            'width 1200ms ease-out, height 1200ms ease-out, opacity 1200ms ease-out',
        }}
      />

      {/* MAIN WHITE SHOCKWAVE */}
      <div
        className={`absolute rounded-full bg-white ${
          isActive
            ? 'h-[300vmax] w-[300vmax] opacity-0'
            : 'h-0 w-0 opacity-100'
        }`}
        style={{
          transition:
            'width 1000ms cubic-bezier(0.16,1,0.3,1) 100ms, height 1000ms cubic-bezier(0.16,1,0.3,1) 100ms, opacity 1000ms ease-out 100ms',
        }}
      />

    </div>
  );
};

export default RippleTransition;
