import React, { useState, useRef } from 'react';
import { sound } from '../audio/SoundEngine';

export const VIDYUT_LETTERS = [
  {
    id: 'v',
    letter: 'V',
    title: "PROSHOW '25",
    subtitle: "STADIUM EDM NIGHT",
    video: "https://cdn.pixabay.com/video/2024/06/07/215697_large.mp4",
  },
  {
    id: 'i',
    letter: 'I',
    title: "ROBOWARS '25",
    subtitle: "440V ARENA COMBAT",
    video: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260808_112712_da9d53df-6d27-4b12-bdf6-aa9dc2622bdf.mp4",
  },
  {
    id: 'd',
    letter: 'D',
    title: "AUTOEXPO '25",
    subtitle: "SUPERCAR SHOWCASE",
    video: "https://cdn.pixabay.com/video/2024/06/07/215697_large.mp4",
  },
  {
    id: 'y',
    letter: 'Y',
    title: "HACKATHON '25",
    subtitle: "36H CODE CRUCIBLE",
    video: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260808_112712_da9d53df-6d27-4b12-bdf6-aa9dc2622bdf.mp4",
  },
  {
    id: 'u',
    letter: 'U',
    title: "CULTURALS '25",
    subtitle: "CHOREONITE BATTLES",
    video: "https://cdn.pixabay.com/video/2024/06/07/215697_large.mp4",
  },
  {
    id: 't',
    letter: 'T',
    title: "GRAND FINALE",
    subtitle: "TROPHY & CELEBRATION",
    video: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260808_112712_da9d53df-6d27-4b12-bdf6-aa9dc2622bdf.mp4",
  },
];

export const VidyutInteractiveBanner = () => {
  const [hoveredLetterId, setHoveredLetterId] = useState(null);

  const handleMouseEnter = (id) => {
    setHoveredLetterId(id);
    sound.playRelayClick(1.25);
  };

  const handleMouseLeave = () => {
    setHoveredLetterId(null);
    sound.playRelayClick(0.95);
  };

  return (
    <div className="relative inline-flex items-center justify-center select-none my-2 sm:my-4 transition-all duration-700">
      {/* Subtle Ambient Halo */}
      <div className="absolute -inset-10 bg-white/5 blur-3xl rounded-full opacity-40 pointer-events-none" />

      {/* Interactive Letter Row with Fluid Elastic Spacing */}
      <div className="flex items-center justify-center gap-0.5 sm:gap-1.5 md:gap-2">
        {VIDYUT_LETTERS.map((item) => {
          const isHovered = hoveredLetterId === item.id;

          return (
            <div
              key={item.id}
              onMouseEnter={() => handleMouseEnter(item.id)}
              onMouseLeave={handleMouseLeave}
              className="relative flex items-center justify-center cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                width: isHovered
                  ? 'clamp(180px, 24vw, 320px)'
                  : 'clamp(38px, 6.5vw, 110px)',
              }}
            >
              {/* DEFAULT LETTER STATE: Metallic Silver Typography */}
              <span
                className={`font-impact font-black tracking-tight leading-[0.85] uppercase text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] via-[#cbd5e1] to-[#64748b] transition-all duration-300 drop-shadow-[0_4px_25px_rgba(0,0,0,0.95)] text-6xl xs:text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] ${
                  isHovered
                    ? 'opacity-0 scale-75 pointer-events-none absolute'
                    : 'opacity-100 scale-100'
                }`}
              >
                {item.letter}
              </span>

              {/* EXPANDED VIDEO PORTAL STATE */}
              {isHovered && (
                <div className="w-full h-28 xs:h-36 sm:h-44 md:h-52 lg:h-60 rounded-2xl sm:rounded-3xl overflow-hidden border border-white/40 bg-black shadow-[0_0_35px_rgba(255,255,255,0.3)] relative animate-slow-zoom flex flex-col justify-end">
                  {/* Looping Glimpse Video */}
                  <video
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                  >
                    <source src={item.video} type="video/mp4" />
                  </video>

                  {/* Gradient Scrim for Label Legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                  {/* Video Badge / Glimpse Tag */}
                  <div className="relative z-10 p-3 sm:p-4 text-left">
                    <div className="text-[9px] sm:text-[11px] font-syncopate font-bold text-white tracking-[0.2em] uppercase">
                      {item.title}
                    </div>
                    <div className="text-[8px] sm:text-[9px] font-montserrat text-white/70 tracking-wider uppercase mt-0.5">
                      {item.subtitle}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
