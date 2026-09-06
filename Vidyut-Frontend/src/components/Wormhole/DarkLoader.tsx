import { useState, useEffect } from 'react';
import './DarkLoader.css';

interface DarkLoaderProps {
  onComplete?: () => void;
}

export default function DarkLoader({ onComplete }: DarkLoaderProps) {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    // Increment counter to simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (onComplete) onComplete();
          return 100;
        }
        return prev + 1;
      });
    }, 25); // Takes roughly 2.5 seconds to reach 100%

    return () => clearInterval(interval);
  }, [onComplete]);

  // Approximate total length of the S-curve path in SVG units
  const pathLength = 260;
  const strokeDashoffset = pathLength - (progress / 100) * pathLength;

  return (
    <div className="loader-container">
      <div className="loader-content">
        <svg
          viewBox="0 0 100 60"
          className="loader-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* S-shaped curve path */}
          <path
            d="M 15,45 C 15,15 50,15 50,30 C 50,45 85,45 85,15"
            fill="none"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            style={{
              strokeDashoffset: strokeDashoffset,
              transition: 'stroke-dashoffset 0.05s linear',
            }}
          />
        </svg>

        {/* Progress percentage display */}
        <span className="loader-text">{progress}%</span>
      </div>
    </div>
  );
}