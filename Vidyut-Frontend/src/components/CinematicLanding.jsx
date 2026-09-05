import React, { useEffect, useRef, useState } from "react";

const CinematicLanding = ({ onEnter }) => {
  const [stage, setStage] = useState(0);
  const [soundOn, setSoundOn] = useState(false);

  const audioRef = useRef(null);
  const fadeTimerRef = useRef(null);

  /*
  ==========================================================
  CINEMATIC INTRO TIMELINE

  0.0s   → Pure black
  0.8s   → Dark atmosphere appears
  1.6s   → Hero image begins
  6.6s   → Hero finishes TWO slow rotations
  6.9s   → VIDYUT begins ONE rotation
  8.3s   → Date
  8.8s   → Main tagline
  9.4s   → Secondary tagline
  10.0s  → People / Passion / Possibilities
  10.8s  → Button
  12.0s  → Everything settled
  ==========================================================
  */

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 800),
      setTimeout(() => setStage(2), 1600),
      setTimeout(() => setStage(3), 6600),
      setTimeout(() => setStage(4), 8300),
      setTimeout(() => setStage(5), 8800),
      setTimeout(() => setStage(6), 9400),
      setTimeout(() => setStage(7), 10000),
      setTimeout(() => setStage(8), 10800),
      setTimeout(() => setStage(9), 12000),
    ];

    return () => {
      timers.forEach(clearTimeout);

      if (fadeTimerRef.current) {
        clearInterval(fadeTimerRef.current);
      }
    };
  }, []);

  /*
  ==========================================================
  START MUSIC

  Browser autoplay rules usually prevent sound from starting
  automatically. The first click/tap anywhere on the landing
  page starts the music.
  ==========================================================
  */

  const startMusic = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    try {
      audio.volume = 0;
      await audio.play();

      setSoundOn(true);

      // Smooth cinematic fade-in
      if (fadeTimerRef.current) {
        clearInterval(fadeTimerRef.current);
      }

      fadeTimerRef.current = setInterval(() => {
        if (!audioRef.current) return;

        const nextVolume = Math.min(
          audioRef.current.volume + 0.015,
          0.35
        );

        audioRef.current.volume = nextVolume;

        if (nextVolume >= 0.35) {
          clearInterval(fadeTimerRef.current);
        }
      }, 100);
    } catch (error) {
      console.log("Audio playback waiting for user interaction.");
    }
  };

  /*
  ==========================================================
  SOUND TOGGLE
  ==========================================================
  */

  const toggleSound = async (event) => {
    event.stopPropagation();

    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      await startMusic();
    } else {
      audio.pause();
      setSoundOn(false);
    }
  };

  /*
  ==========================================================
  ENTER EXPERIENCE

  Start music if possible, then continue the original flow.
  ==========================================================
  */

  const handleEnter = async () => {
    await startMusic();

    onEnter();
  };

  return (
    <section
      onClick={startMusic}
      className="
        fixed
        inset-0
        z-[9999]
        h-screen
        w-screen
        overflow-hidden
        bg-black
        text-white
      "
    >

      {/* ======================================================
          BACKGROUND MUSIC
          ====================================================== */}

      <audio
        ref={audioRef}
        src="/audio/vidyut-theme.mp3"
        loop
        preload="auto"
      />


      {/* ======================================================
          FONTS
          ====================================================== */}

      <style>{`
        @import url(
          'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Cinzel+Decorative:wght@400;700;900&display=swap'
        );
      `}</style>


      {/* ======================================================
          0. PURE BLACK OPENING
      ====================================================== */}

      <div
        className={`
          pointer-events-none
          absolute
          inset-0
          z-[100]
          bg-black
          transition-opacity
          duration-[1800ms]
          ease-out
          ${stage >= 1 ? "opacity-0" : "opacity-100"}
        `}
      />


      {/* ======================================================
          1. DARK CINEMATIC ATMOSPHERE
      ====================================================== */}

      <div
        className={`
          absolute
          inset-0
          z-0
          transition-opacity
          duration-[2400ms]
          ${stage >= 1 ? "opacity-100" : "opacity-0"}
        `}
      >

        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(
                ellipse at 50% 42%,
                rgba(20, 35, 65, 0.28),
                transparent 42%
              ),

              radial-gradient(
                ellipse at 52% 65%,
                rgba(170, 115, 35, 0.08),
                transparent 35%
              ),

              linear-gradient(
                180deg,
                #010203 0%,
                #030609 50%,
                #010203 100%
              )
            `,
          }}
        />

        {/* Subtle blue glow */}

        <div
          className="
            absolute
            left-1/2
            top-[35%]
            h-[45vh]
            w-[45vw]
            -translate-x-1/2
            rounded-full
            blur-[160px]
          "
          style={{
            background:
              "rgba(25, 70, 150, 0.06)",
          }}
        />

        {/* Subtle gold glow */}

        <div
          className="
            absolute
            left-1/2
            top-[48%]
            h-[30vh]
            w-[35vw]
            -translate-x-1/2
            rounded-full
            blur-[140px]
          "
          style={{
            background:
              "rgba(215, 165, 65, 0.045)",
          }}
        />

      </div>


      {/* ======================================================
          2. HERO IMAGE
          TWO SLOW ROTATIONS
          THEN STOPS
      ====================================================== */}

      <div
        className={`
          absolute
          inset-0
          z-[3]
          overflow-hidden
          transition-opacity
          duration-[1000ms]
          ${stage >= 2 ? "opacity-100" : "opacity-0"}
        `}
      >

        <div
          className={`
            absolute
            inset-[-7%]
            ${stage >= 2 ? "hero-image-intro" : ""}
          `}
        >

          <img
            src="/images/vidyut-hero.png"
            alt="Vidyut cinematic environment"
            className="
              h-full
              w-full
              object-cover
              select-none
            "
            draggable="false"
          />

        </div>

      </div>


      {/* ======================================================
          3. DARK OVERLAY
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-[5]
        "
        style={{
          background: `
            linear-gradient(
              180deg,
              rgba(0,0,0,0.45) 0%,
              rgba(0,0,0,0.08) 25%,
              rgba(0,0,0,0.12) 50%,
              rgba(0,0,0,0.48) 100%
            ),

            linear-gradient(
              90deg,
              rgba(0,0,0,0.38) 0%,
              transparent 25%,
              transparent 75%,
              rgba(0,0,0,0.38) 100%
            )
          `,
        }}
      />


      {/* ======================================================
          4. CINEMATIC VIGNETTE
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-[6]
        "
        style={{
          background: `
            radial-gradient(
              ellipse at center,
              transparent 28%,
              rgba(0,0,0,0.16) 55%,
              rgba(0,0,0,0.82) 100%
            )
          `,
        }}
      />


      {/* ======================================================
          5. CENTER LIGHT
      ====================================================== */}

      <div
        className={`
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          z-[7]
          h-[22rem]
          w-[22rem]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#d8b65f]/[0.055]
          blur-[120px]
          transition-all
          duration-[3000ms]
          ${
            stage >= 2
              ? "scale-100 opacity-100"
              : "scale-50 opacity-0"
          }
        `}
      />


      {/* ======================================================
          TOP INFORMATION
      ====================================================== */}

      <div
        className={`
          absolute
          left-1/2
          top-[7%]
          z-40
          -translate-x-1/2
          text-center
          transition-all
          duration-[1100ms]
          ${
            stage >= 4
              ? "translate-y-0 opacity-100"
              : "-translate-y-5 opacity-0"
          }
        `}
      >

        <p
          className="
            whitespace-nowrap
            text-[9px]
            uppercase
            tracking-[0.55em]
            text-[#e8d7ae]
          "
          style={{
            fontFamily: "'Cinzel', serif",
          }}
        >
          OCTOBER 24 • 25 • 26 • 2026
        </p>

        <p
          className="
            mt-3
            whitespace-nowrap
            text-[7px]
            uppercase
            tracking-[0.55em]
            text-white/55
          "
          style={{
            fontFamily: "'Cinzel', serif",
          }}
        >
          AMRITA AMRITAPURI
        </p>

      </div>


      {/* ======================================================
          MAIN CENTER CONTENT
      ====================================================== */}

      <div
        className="
          absolute
          inset-x-0
          top-1/2
          z-30
          flex
          -translate-y-1/2
          flex-col
          items-center
          text-center
        "
      >

        {/* ==================================================
            VIDYUT
        ================================================== */}

        <div
          className={`
            ${
              stage >= 3
                ? "vidyut-title-intro"
                : "opacity-0"
            }
          `}
        >

          <h1
            className="
              select-none
              whitespace-nowrap
              uppercase
              text-transparent
              bg-clip-text
              bg-gradient-to-b
              from-[#fffdf3]
              via-[#e9ca7d]
              to-[#8e6027]
            "
            style={{
              fontFamily:
                "'Cinzel Decorative', 'Cinzel', serif",

              fontSize:
                "clamp(3.5rem, 10vw, 9rem)",

              fontWeight: 700,

              lineHeight: 0.9,

              letterSpacing:
                "0.09em",

              textShadow: `
                0 2px 2px rgba(255,255,255,0.20),
                0 8px 30px rgba(0,0,0,0.90),
                0 0 45px rgba(214,178,90,0.12)
              `,

              transform:
                "scaleX(0.92)",

              transformOrigin:
                "center",
            }}
          >
            VIDYUT
          </h1>

        </div>


        {/* ==================================================
            MAIN TAGLINE
        ================================================== */}

        <div
          className={`
            mt-7
            transition-all
            duration-[1000ms]
            ${
              stage >= 5
                ? "translate-y-0 opacity-100"
                : "translate-y-6 opacity-0"
            }
          `}
        >

          <h2
            className="
              text-[10px]
              uppercase
              tracking-[0.48em]
              text-[#f1dfb3]
            "
            style={{
              fontFamily:
                "'Cinzel', serif",
              fontWeight: 500,
            }}
          >
            WHERE IDEAS IGNITE
          </h2>

        </div>


        {/* ==================================================
            SECOND TAGLINE
        ================================================== */}

        <div
          className={`
            mt-2
            transition-all
            duration-[1000ms]
            ${
              stage >= 6
                ? "translate-y-0 opacity-100"
                : "translate-y-5 opacity-0"
            }
          `}
        >

          <p
            className="
              text-[9px]
              uppercase
              tracking-[0.42em]
              text-white/70
            "
            style={{
              fontFamily:
                "'Cinzel', serif",
            }}
          >
            A BRIGHTER TOMORROW
          </p>

        </div>


        {/* ==================================================
            PEOPLE / PASSION / POSSIBILITIES
        ================================================== */}

        <div
          className={`
            mt-6
            transition-all
            duration-[1000ms]
            ${
              stage >= 7
                ? "translate-y-0 opacity-100"
                : "translate-y-5 opacity-0"
            }
          `}
        >

          <p
            className="
              whitespace-nowrap
              text-[7px]
              uppercase
              tracking-[0.48em]
              text-[#d7c59b]/70
            "
            style={{
              fontFamily:
                "'Cinzel', serif",
            }}
          >
            PEOPLE

            <span className="mx-3 text-[#c9a95e]">
              ×
            </span>

            PASSION

            <span className="mx-3 text-[#c9a95e]">
              ×
            </span>

            POSSIBILITIES
          </p>

        </div>


        {/* ==================================================
            CTA
        ================================================== */}

        <div
          className={`
            mt-9
            transition-all
            duration-[1100ms]
            ${
              stage >= 8
                ? "translate-y-0 opacity-100"
                : "translate-y-6 opacity-0"
            }
          `}
        >

          <button
            onClick={handleEnter}
            className="
              group
              relative
              flex
              min-w-[250px]
              items-center
              justify-center
              gap-6
              border
              border-[#d8b96b]
              bg-black/30
              px-8
              py-4
              text-[8px]
              uppercase
              tracking-[0.30em]
              text-[#ead59d]
              backdrop-blur-sm
              transition-all
              duration-500
              hover:bg-[#d8b96b]
              hover:text-black
              hover:shadow-[0_0_45px_rgba(216,185,107,0.30)]
            "
            style={{
              fontFamily:
                "'Cinzel', serif",
            }}
          >

            <span>
              ENTER THE EXPERIENCE
            </span>

            <span
              className="
                text-[13px]
                transition-transform
                duration-500
                group-hover:translate-x-2
              "
            >
              →
            </span>

          </button>

        </div>

      </div>


      {/* ======================================================
          SOUND CONTROL
      ====================================================== */}

      <button
        onClick={toggleSound}
        className={`
          absolute
          bottom-8
          right-8
          z-50
          flex
          items-center
          gap-3
          border
          px-4
          py-3
          text-[7px]
          uppercase
          tracking-[0.28em]
          backdrop-blur-md
          transition-all
          duration-500
          ${
            soundOn
              ? "border-[#d8b96b] text-[#ead59d] bg-black/30"
              : "border-white/25 text-white/55 bg-black/20"
          }
          hover:border-[#d8b96b]
          hover:text-[#ead59d]
        `}
        style={{
          fontFamily:
            "'Cinzel', serif",
        }}
      >

        <span>
          {soundOn ? "SOUND ON" : "SOUND OFF"}
        </span>

        <span className="text-[10px]">
          {soundOn ? "◉" : "○"}
        </span>

      </button>


      {/* ======================================================
          TOP RIGHT SMALL BUTTON
      ====================================================== */}

      <button
        onClick={handleEnter}
        className={`
          absolute
          right-8
          top-8
          z-50
          hidden
          border
          border-[#d8b96b]/45
          bg-black/20
          px-5
          py-3
          text-[7px]
          uppercase
          tracking-[0.30em]
          text-[#ead59d]
          backdrop-blur-md
          transition-all
          duration-1000
          hover:bg-[#d8b96b]
          hover:text-black
          sm:block
          sm:right-12
          sm:top-10
          ${
            stage >= 8
              ? "translate-y-0 opacity-100"
              : "-translate-y-5 opacity-0"
          }
        `}
        style={{
          fontFamily:
            "'Cinzel', serif",
        }}
      >
        Enter
      </button>


      {/* ======================================================
          BOTTOM SCROLL
      ====================================================== */}

      <div
        className={`
          absolute
          bottom-7
          left-1/2
          z-40
          -translate-x-1/2
          text-center
          transition-all
          duration-[1000ms]
          ${
            stage >= 9
              ? "translate-y-0 opacity-100"
              : "translate-y-5 opacity-0"
          }
        `}
      >

        <p
          className="
            text-[6px]
            uppercase
            tracking-[0.50em]
            text-white/40
          "
          style={{
            fontFamily:
              "'Cinzel', serif",
          }}
        >
          SCROLL TO EXPLORE
        </p>

        <div
          className="
            mx-auto
            mt-3
            h-8
            w-px
            bg-gradient-to-b
            from-[#d8b96b]
            to-transparent
          "
        />

      </div>


      {/* ======================================================
          SUBTLE CINEMATIC LIGHT
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-20
          overflow-hidden
        "
      >

        <div
          className="
            absolute
            left-[-30%]
            top-[-20%]
            h-[140%]
            w-[8%]
            rotate-[12deg]
            blur-[65px]
          "
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(75,140,255,0.07), rgba(255,210,120,0.06), transparent)",

            animation:
              "cinematicSweep 20s ease-in-out 12s infinite",
          }}
        />

      </div>


      {/* ======================================================
          ANIMATIONS
      ====================================================== */}

      <style>{`

        /* ====================================================
           HERO IMAGE
           TWO SLOW COMPLETE ROTATIONS
        ==================================================== */

        @keyframes heroTwoTurns {

          0% {

            transform:
              perspective(2600px)
              scale(1.16)
              rotateY(-720deg)
              rotateX(7deg);

            opacity: 0;

          }

          8% {
            opacity: 1;
          }

          25% {

            transform:
              perspective(2600px)
              scale(1.13)
              rotateY(-540deg)
              rotateX(5deg);

          }

          50% {

            transform:
              perspective(2600px)
              scale(1.10)
              rotateY(-360deg)
              rotateX(3deg);

          }

          75% {

            transform:
              perspective(2600px)
              scale(1.08)
              rotateY(-180deg)
              rotateX(1.5deg);

          }

          90% {

            transform:
              perspective(2600px)
              scale(1.08)
              rotateY(-45deg)
              rotateX(0deg);

          }

          100% {

            transform:
              perspective(2600px)
              scale(1.08)
              rotateY(0deg)
              rotateX(0deg);

            opacity: 1;

          }

        }


        .hero-image-intro {

          animation:
            heroTwoTurns
            5s
            cubic-bezier(0.16,1,0.3,1)
            forwards;

          transform-style:
            preserve-3d;

          backface-visibility:
            visible;

        }


        /* ====================================================
           VIDYUT
           ONE COMPLETE TURN
        ==================================================== */

        @keyframes vidyutOneTurn {

          0% {

            transform:
              perspective(1600px)
              rotateY(-360deg)
              rotateX(8deg)
              scale(0.72);

            opacity: 0;

          }

          18% {
            opacity: 1;
          }

          45% {

            transform:
              perspective(1600px)
              rotateY(-190deg)
              rotateX(5deg)
              scale(0.86);

          }

          72% {

            transform:
              perspective(1600px)
              rotateY(-60deg)
              rotateX(1deg)
              scale(0.96);

          }

          100% {

            transform:
              perspective(1600px)
              rotateY(0deg)
              rotateX(0deg)
              scale(1);

            opacity: 1;

          }

        }


        .vidyut-title-intro {

          animation:
            vidyutOneTurn
            1.5s
            cubic-bezier(0.16,1,0.3,1)
            forwards;

          transform-style:
            preserve-3d;

        }


        /* ====================================================
           LIGHT SWEEP
        ==================================================== */

        @keyframes cinematicSweep {

          0% {

            transform:
              translateX(0)
              rotate(12deg);

            opacity: 0;

          }

          12% {
            opacity: 0.08;
          }

          30% {
            opacity: 0.15;
          }

          48% {
            opacity: 0.04;
          }

          62% {
            opacity: 0;
          }

          100% {

            transform:
              translateX(1100%)
              rotate(12deg);

            opacity: 0;

          }

        }


        /* ====================================================
           MOBILE
        ==================================================== */

        @media (max-width: 768px) {

          .hero-image-intro {
            animation-duration: 4.5s;
          }

        }


        /* ====================================================
           REDUCED MOTION
        ==================================================== */

        @media (prefers-reduced-motion: reduce) {

          *,
          *::before,
          *::after {

            animation-duration: 0.01ms !important;

            animation-iteration-count: 1 !important;

            transition-duration: 0.01ms !important;

          }

        }

      `}</style>

    </section>
  );
};

export default CinematicLanding;