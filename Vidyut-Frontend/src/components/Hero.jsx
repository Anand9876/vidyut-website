import React, { useState, useEffect, useRef } from 'react';
import { Ticket, Heart } from 'lucide-react';
import { useTransformation } from '../context/TransformationContext';
import { ShowInterestModal } from './ShowInterestModal';

export const Hero = ({ onNavbarReady }) => {
  const {
    timeLeft,
    setIsPassModalOpen,
  } = useTransformation();

  const [isInterestModalOpen, setIsInterestModalOpen] = useState(false);
  const [entranceStage, setEntranceStage] = useState(0);

  // Image popup
  const [popupImage, setPopupImage] = useState(null);
  const [popupPosition, setPopupPosition] = useState({
    x: 50,
    y: 50,
  });

  const [blastKey, setBlastKey] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  // Timers
  const hoverTimerRef = useRef(null);
  const closeTimerRef = useRef(null);
  const lastHoverTimeRef = useRef(0);

  // --------------------------------------------------
  // VIDYUT INTRO IMAGES
  // --------------------------------------------------

  const vidyutImages = Array.from(
    { length: 16 },
    (_, index) =>
      `/images/vidyut-intro/${String(index + 1).padStart(2, '0')}.jpg`
  );

  // --------------------------------------------------
  // HERO ENTRANCE
  // --------------------------------------------------

  useEffect(() => {
    const timers = [
      setTimeout(() => setEntranceStage(1), 120),
      setTimeout(() => setEntranceStage(2), 850),
      setTimeout(() => setEntranceStage(3), 1500),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  // --------------------------------------------------
  // NAVBAR READY
  // --------------------------------------------------

  useEffect(() => {
    if (onNavbarReady) {
      onNavbarReady();
    }
  }, [onNavbarReady]);

  // --------------------------------------------------
  // CLOSE IMAGE AFTER 2 SECONDS OF NO MOVEMENT
  // --------------------------------------------------

  const startCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = setTimeout(() => {
      setPopupImage(null);
      setIsFlipping(false);
    }, 2000);
  };

  // --------------------------------------------------
  // SHOW RANDOM IMAGE AT CURSOR
  // --------------------------------------------------

  const showRandomImageAtCursor = (event) => {
    const target = event.target;

    // Don't trigger over buttons, links, inputs, etc.
    if (
      target.closest('button') ||
      target.closest('a') ||
      target.closest('input') ||
      target.closest('textarea') ||
      target.closest('[data-no-popup]')
    ) {
      return;
    }

    // ----------------------------------------------
    // IMPORTANT:
    // Every mouse movement resets the 2 second timer
    // ----------------------------------------------

    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    startCloseTimer();

    // ----------------------------------------------
    // IMAGE SPAWN COOLDOWN
    // ----------------------------------------------

    const now = Date.now();

    if (now - lastHoverTimeRef.current < 900) {
      return;
    }

    lastHoverTimeRef.current = now;

    // Clear previous image timer
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }

    // ----------------------------------------------
    // RANDOM IMAGE
    // ----------------------------------------------

    const image =
      vidyutImages[
        Math.floor(Math.random() * vidyutImages.length)
      ];

    // ----------------------------------------------
    // RESPONSIVE IMAGE SIZE
    // ----------------------------------------------

    const popupSize =
      window.innerWidth < 640 ? 170 : 190;

    const half = popupSize / 2;

    // ----------------------------------------------
    // KEEP IMAGE INSIDE SCREEN
    // ----------------------------------------------

    const x = Math.max(
      half + 10,
      Math.min(
        event.clientX,
        window.innerWidth - half - 10
      )
    );

    const y = Math.max(
      half + 10,
      Math.min(
        event.clientY,
        window.innerHeight - half - 10
      )
    );

    setPopupPosition({
      x,
      y,
    });

    // ----------------------------------------------
    // RESET FLIP
    // ----------------------------------------------

    setPopupImage(null);
    setIsFlipping(false);

    // ----------------------------------------------
    // RESTART BLAST
    // ----------------------------------------------

    setBlastKey((previous) => previous + 1);

    // ----------------------------------------------
    // SMOKE FIRST
    // ----------------------------------------------

    hoverTimerRef.current = setTimeout(() => {
      setPopupImage(image);

      // Start 3D flip
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsFlipping(true);
        });
      });

      // Start fresh 2-second close timer
      startCloseTimer();

    }, 280);
  };

  // --------------------------------------------------
  // CLEANUP TIMERS
  // --------------------------------------------------

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }

      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  // --------------------------------------------------
  // ESCAPE
  // --------------------------------------------------

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setPopupImage(null);
        setIsFlipping(false);

        if (closeTimerRef.current) {
          clearTimeout(closeTimerRef.current);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  }, []);

  // --------------------------------------------------
  // FORMAT COUNTDOWN
  // --------------------------------------------------

  const formatTime = (value) => {
    return String(value).padStart(2, '0');
  };

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <>
      <section
        id="home"
        onMouseMove={showRandomImageAtCursor}
        className="
          relative
          min-h-screen
          w-full
          overflow-hidden
          bg-black
          text-white
          flex
          items-center
          justify-center
        "
      >

        {/* =====================================================
            BACKGROUND VIDEO
        ====================================================== */}

        <div className="absolute inset-0 z-0 pointer-events-none">

          <video
            className="
              absolute
              inset-0
              w-full
              h-full
              object-cover
              scale-[1.05]
            "
            src="/videos/hero-bg.mp4"
            autoPlay
            muted
            loop
            playsInline
          />

          {/* Dark cinematic overlay */}
          <div className="absolute inset-0 bg-black/65" />

          {/* Bottom cinematic fade */}
          <div
            className="
              absolute
              inset-x-0
              bottom-0
              h-[45%]
            "
            style={{
              background:
                'linear-gradient(to top, rgba(0,0,0,0.95), transparent)',
            }}
          />

          {/* Center glow */}
          <div
            className="
              absolute
              inset-0
              pointer-events-none
            "
            style={{
              background:
                'radial-gradient(circle at center, rgba(255,255,255,0.05), transparent 48%)',
            }}
          />

        </div>

        {/* =====================================================
            CINEMATIC VIGNETTE
        ====================================================== */}

        <div
          className="
            absolute
            inset-0
            z-[1]
            pointer-events-none
          "
          style={{
            background:
              'radial-gradient(circle, transparent 35%, rgba(0,0,0,0.75) 100%)',
          }}
        />

        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}

        <div
          className={`
            relative
            z-10
            w-full
            max-w-[1500px]
            mx-auto
            px-5
            sm:px-8
            md:px-12
            pt-24
            pb-20
            flex
            flex-col
            items-center
            justify-center
            text-center
            transition-all
            duration-1000

            ${
              entranceStage >= 1
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }
          `}
        >

          {/* =====================================================
              TOP LABEL
          ====================================================== */}

          <div
            data-no-popup
            className={`
              mb-5
              sm:mb-7
              transition-all
              duration-1000

              ${
                entranceStage >= 1
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 -translate-y-5'
              }
            `}
          >

            <div className="flex items-center justify-center gap-3">

              <div className="h-px w-8 sm:w-14 bg-white/40" />

              <span
                className="
                  font-syncopate
                  text-[9px]
                  sm:text-xs
                  tracking-[0.35em]
                  text-white/60
                  uppercase
                "
              >
                AMRITA AMRITAPURI
              </span>

              <div className="h-px w-8 sm:w-14 bg-white/40" />

            </div>

          </div>

          {/* =====================================================
              VIDYUT TITLE
          ====================================================== */}

          <div
            data-no-popup
            className={`
              relative
              inline-block
              select-none
              my-1
              sm:my-2
              transition-all
              duration-[1200ms]

              ${
                entranceStage >= 2
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-90'
              }
            `}
          >

            {/* Glow */}
            <div
              className="
                absolute
                -inset-12
                sm:-inset-16
                bg-white/5
                blur-3xl
                rounded-full
                opacity-40
                pointer-events-none
              "
            />

            <h1
              className="
                relative
                font-black
                uppercase
                text-transparent
                bg-clip-text
                bg-gradient-to-b
                from-[#ffffff]
                via-[#cbd5e1]
                to-[#64748b]
                drop-shadow-[0_4px_25px_rgba(0,0,0,0.95)]
                leading-[0.88]
              "
              style={{
                fontFamily:
                  "'Chakra Petch', sans-serif",
                fontWeight: 700,
                letterSpacing: '0.10em',
                fontSize:
                  'clamp(4.5rem, 13vw, 12rem)',
              }}
            >
              VIDYUT
            </h1>

            {/* Light sweep */}
            <div
              className="
                absolute
                inset-y-0
                -left-[40%]
                w-[25%]
                bg-white/20
                blur-2xl
                skew-x-[-20deg]
                pointer-events-none
                animate-[lightSweep_5s_ease-in-out_infinite]
              "
            />

          </div>

          {/* =====================================================
              SUBTITLE
          ====================================================== */}

          <div
            data-no-popup
            className={`
              mt-5
              sm:mt-7
              transition-all
              duration-1000

              ${
                entranceStage >= 2
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-5'
              }
            `}
          >

            <p
              className="
                font-syncopate
                uppercase
                text-[10px]
                sm:text-xs
                md:text-sm
                tracking-[0.25em]
                sm:tracking-[0.4em]
                text-white/70
              "
            >
              Where Energy Meets Innovation
            </p>

          </div>

          {/* =====================================================
              COUNTDOWN
          ====================================================== */}

          <div
            data-no-popup
            className={`
              mt-10
              sm:mt-14
              transition-all
              duration-1000

              ${
                entranceStage >= 3
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-5'
              }
            `}
          >

            <div
              className="
                flex
                items-center
                justify-center
                gap-3
                sm:gap-6
              "
            >

              {/* DAYS */}
              <div className="text-center">

                <div
                  className="
                    font-impact
                    text-3xl
                    sm:text-5xl
                    md:text-6xl
                    tracking-wider
                    text-white
                  "
                >
                  {formatTime(timeLeft?.days ?? 0)}
                </div>

                <div
                  className="
                    mt-1
                    font-syncopate
                    text-[7px]
                    sm:text-[9px]
                    tracking-[0.25em]
                    text-white/40
                  "
                >
                  DAYS
                </div>

              </div>

              <span
                className="
                  font-impact
                  text-2xl
                  sm:text-4xl
                  text-white/30
                "
              >
                :
              </span>

              {/* HOURS */}
              <div className="text-center">

                <div
                  className="
                    font-impact
                    text-3xl
                    sm:text-5xl
                    md:text-6xl
                    tracking-wider
                    text-white
                  "
                >
                  {formatTime(timeLeft?.hours ?? 0)}
                </div>

                <div
                  className="
                    mt-1
                    font-syncopate
                    text-[7px]
                    sm:text-[9px]
                    tracking-[0.25em]
                    text-white/40
                  "
                >
                  HOURS
                </div>

              </div>

              <span
                className="
                  font-impact
                  text-2xl
                  sm:text-4xl
                  text-white/30
                "
              >
                :
              </span>

              {/* MINUTES */}
              <div className="text-center">

                <div
                  className="
                    font-impact
                    text-3xl
                    sm:text-5xl
                    md:text-6xl
                    tracking-wider
                    text-white
                  "
                >
                  {formatTime(timeLeft?.minutes ?? 0)}
                </div>

                <div
                  className="
                    mt-1
                    font-syncopate
                    text-[7px]
                    sm:text-[9px]
                    tracking-[0.25em]
                    text-white/40
                  "
                >
                  MINUTES
                </div>

              </div>

              <span
                className="
                  font-impact
                  text-2xl
                  sm:text-4xl
                  text-white/30
                "
              >
                :
              </span>

              {/* SECONDS */}
              <div className="text-center">

                <div
                  className="
                    font-impact
                    text-3xl
                    sm:text-5xl
                    md:text-6xl
                    tracking-wider
                    text-white
                  "
                >
                  {formatTime(timeLeft?.seconds ?? 0)}
                </div>

                <div
                  className="
                    mt-1
                    font-syncopate
                    text-[7px]
                    sm:text-[9px]
                    tracking-[0.25em]
                    text-white/40
                  "
                >
                  SECONDS
                </div>

              </div>

            </div>

          </div>

          {/* =====================================================
              BUTTONS
          ====================================================== */}

          <div
            data-no-popup
            className="
              mt-10
              sm:mt-14
              flex
              flex-col
              sm:flex-row
              items-center
              justify-center
              gap-3
              sm:gap-5
            "
          >

            {/* GET PASS */}
            <button
              onClick={(event) => {
                event.stopPropagation();
                setIsPassModalOpen(true);
              }}
              className="
                group
                relative
                overflow-hidden
                min-w-[190px]
                sm:min-w-[220px]
                px-7
                py-3.5
                sm:py-4
                border
                border-white/30
                bg-white
                text-black
                hover:bg-white/90
                transition-all
                duration-300
                font-syncopate
                text-[9px]
                sm:text-[10px]
                font-bold
                tracking-[0.2em]
                uppercase
              "
            >

              <span
                className="
                  relative
                  z-10
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                <Ticket size={15} />
                Get Pass
              </span>

              <span
                className="
                  absolute
                  inset-0
                  translate-x-[-110%]
                  group-hover:translate-x-[110%]
                  transition-transform
                  duration-700
                  bg-black/10
                  skew-x-[-20deg]
                "
              />

            </button>

            {/* SHOW INTEREST */}
            <button
              onClick={(event) => {
                event.stopPropagation();
                setIsInterestModalOpen(true);
              }}
              className="
                group
                relative
                min-w-[190px]
                sm:min-w-[220px]
                px-7
                py-3.5
                sm:py-4
                border
                border-white/30
                bg-white/5
                backdrop-blur-sm
                text-white
                hover:bg-white/10
                transition-all
                duration-300
                font-syncopate
                text-[9px]
                sm:text-[10px]
                font-bold
                tracking-[0.2em]
                uppercase
              "
            >

              <span
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >

                <Heart
                  size={14}
                  className="
                    group-hover:scale-110
                    transition-transform
                  "
                />

                Show Interest

              </span>

            </button>

          </div>

        </div>

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <div
          data-no-popup
          className="
            absolute
            bottom-5
            sm:bottom-7
            left-0
            right-0
            z-10
            px-6
            flex
            items-center
            justify-center
            sm:justify-between
            gap-4
          "
        >

          <div
            className="
              hidden
              sm:block
              font-montserrat
              text-[8px]
              tracking-[0.2em]
              text-white/30
              uppercase
            "
          >
            Amrita Vishwa Vidyapeetham
          </div>

          <div
            className="
              font-syncopate
              text-[8px]
              sm:text-[9px]
              tracking-[0.3em]
              text-white/30
              uppercase
            "
          >
            MOVE YOUR CURSOR TO EXPLORE
          </div>

        </div>

        {/* =====================================================
            SMOKE / BLAST
        ====================================================== */}

        {popupImage === null && (

          <div
            key={blastKey}
            className="
              vidyut-blast
              pointer-events-none
            "
            style={{
              left: popupPosition.x,
              top: popupPosition.y,
            }}
          >

            <div className="blast-flash" />

            <div className="smoke-cloud smoke-main" />

            <div className="smoke-cloud smoke-secondary" />

            <div className="smoke-cloud smoke-outer" />

            <div className="blast-ring" />

            <span className="blast-particle p1" />
            <span className="blast-particle p2" />
            <span className="blast-particle p3" />
            <span className="blast-particle p4" />
            <span className="blast-particle p5" />
            <span className="blast-particle p6" />
            <span className="blast-particle p7" />
            <span className="blast-particle p8" />
            <span className="blast-particle p9" />
            <span className="blast-particle p10" />

          </div>

        )}

        {/* =====================================================
            IMAGE POPUP
        ====================================================== */}

        {popupImage && (

          <div
            className="
              vidyut-image-popup
              pointer-events-none
            "
            style={{
              left: popupPosition.x,
              top: popupPosition.y,
            }}
          >

            <div
              className={`
                vidyut-image-card

                ${
                  isFlipping
                    ? 'image-front'
                    : 'image-back'
                }
              `}
            >

              {/* BACK */}
              <div
                className="
                  image-side
                  image-back-side
                "
              >

                <div className="back-energy" />

              </div>

              {/* FRONT */}
              <div
                className="
                  image-side
                  image-front-side
                "
              >

                <img
                  src={popupImage}
                  alt=""
                  draggable="false"
                />

              </div>

            </div>

          </div>

        )}

      </section>

      {/* =====================================================
          INTEREST MODAL
      ====================================================== */}

      {isInterestModalOpen && (

        <ShowInterestModal
          isOpen={isInterestModalOpen}
          onClose={() =>
            setIsInterestModalOpen(false)
          }
        />

      )}

      {/* =====================================================
          CUSTOM CSS
      ====================================================== */}

      <style>{`

        @import url(
          'https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&display=swap'
        );


        /* =====================================================
           TITLE LIGHT SWEEP
        ====================================================== */

        @keyframes lightSweep {

          0% {
            left: -40%;
            opacity: 0;
          }

          15% {
            opacity: 0.7;
          }

          45% {
            left: 120%;
            opacity: 0;
          }

          100% {
            left: 120%;
            opacity: 0;
          }

        }


        /* =====================================================
           BLAST
        ====================================================== */

        .vidyut-blast {

          position: fixed;

          width: 1px;
          height: 1px;

          z-index: 150;

          transform:
            translate(-50%, -50%);

        }


        /* =====================================================
           FLASH
        ====================================================== */

        .blast-flash {

          position: absolute;

          width: 90px;
          height: 90px;

          left: 50%;
          top: 50%;

          transform:
            translate(-50%, -50%);

          border-radius: 50%;

          background:
            radial-gradient(
              circle,
              rgba(255,255,255,1) 0%,
              rgba(255,255,255,0.85) 12%,
              rgba(220,230,255,0.35) 35%,
              transparent 75%
            );

          filter: blur(3px);

          animation:
            blastFlash
            0.42s
            ease-out
            forwards;

        }


        @keyframes blastFlash {

          0% {
            transform:
              translate(-50%, -50%)
              scale(0.15);

            opacity: 0;
          }

          15% {
            transform:
              translate(-50%, -50%)
              scale(0.7);

            opacity: 1;
          }

          100% {
            transform:
              translate(-50%, -50%)
              scale(3.2);

            opacity: 0;
          }

        }


        /* =====================================================
           SMOKE
        ====================================================== */

        .smoke-cloud {

          position: absolute;

          left: 50%;
          top: 50%;

          border-radius: 50%;

          transform:
            translate(-50%, -50%)
            scale(0.15);

          pointer-events: none;

          mix-blend-mode: screen;

        }


        .smoke-main {

          width: 150px;
          height: 150px;

          background:
            radial-gradient(
              circle,
              rgba(255,255,255,0.32) 0%,
              rgba(210,220,240,0.22) 20%,
              rgba(120,130,150,0.16) 42%,
              rgba(40,45,55,0.12) 62%,
              transparent 75%
            );

          filter: blur(10px);

          animation:
            smokeExplosion
            0.85s
            cubic-bezier(0.12,0.8,0.25,1)
            forwards;

        }


        .smoke-secondary {

          width: 110px;
          height: 110px;

          background:
            radial-gradient(
              circle,
              rgba(255,255,255,0.25),
              rgba(100,110,130,0.15) 45%,
              transparent 75%
            );

          filter: blur(13px);

          animation:
            smokeExplosion2
            0.75s
            cubic-bezier(0.12,0.8,0.25,1)
            forwards;

        }


        .smoke-outer {

          width: 210px;
          height: 210px;

          background:
            radial-gradient(
              circle,
              rgba(120,130,150,0.12),
              rgba(30,35,45,0.08) 50%,
              transparent 75%
            );

          filter: blur(18px);

          animation:
            smokeOuter
            0.9s
            ease-out
            forwards;

        }


        @keyframes smokeExplosion {

          0% {

            transform:
              translate(-50%, -50%)
              scale(0.15);

            opacity: 0;

          }

          15% {
            opacity: 0.95;
          }

          55% {

            transform:
              translate(-50%, -50%)
              scale(1.15);

            opacity: 0.65;

          }

          100% {

            transform:
              translate(-50%, -50%)
              scale(1.75);

            opacity: 0;

          }

        }


        @keyframes smokeExplosion2 {

          0% {

            transform:
              translate(-50%, -50%)
              scale(0.1);

            opacity: 0;

          }

          20% {
            opacity: 0.8;
          }

          65% {

            transform:
              translate(
                calc(-50% + 8px),
                calc(-50% - 5px)
              )
              scale(1.35);

            opacity: 0.45;

          }

          100% {

            transform:
              translate(
                calc(-50% - 10px),
                calc(-50% + 8px)
              )
              scale(2);

            opacity: 0;

          }

        }


        @keyframes smokeOuter {

          0% {

            transform:
              translate(-50%, -50%)
              scale(0.2);

            opacity: 0;

          }

          20% {
            opacity: 0.45;
          }

          100% {

            transform:
              translate(-50%, -50%)
              scale(1.7);

            opacity: 0;

          }

        }


        /* =====================================================
           ENERGY RING
        ====================================================== */

        .blast-ring {

          position: absolute;

          left: 50%;
          top: 50%;

          width: 30px;
          height: 30px;

          border:
            1px solid
            rgba(255,255,255,0.7);

          border-radius: 50%;

          transform:
            translate(-50%, -50%)
            scale(0.2);

          box-shadow:
            0 0 20px
            rgba(255,255,255,0.3);

          animation:
            ringExplosion
            0.65s
            ease-out
            forwards;

        }


        @keyframes ringExplosion {

          0% {

            transform:
              translate(-50%, -50%)
              scale(0.2);

            opacity: 0.9;

          }

          100% {

            transform:
              translate(-50%, -50%)
              scale(8);

            opacity: 0;

          }

        }


        /* =====================================================
           PARTICLES
        ====================================================== */

        .blast-particle {

          position: absolute;

          left: 50%;
          top: 50%;

          width: 3px;
          height: 3px;

          border-radius: 50%;

          background: white;

          box-shadow:
            0 0 8px
            rgba(255,255,255,0.9);

          animation:
            particleBlast
            0.7s
            ease-out
            forwards;

        }


        .p1 {
          --x: -75px;
          --y: -45px;
        }

        .p2 {
          --x: 80px;
          --y: -30px;
        }

        .p3 {
          --x: -50px;
          --y: 65px;
        }

        .p4 {
          --x: 70px;
          --y: 60px;
        }

        .p5 {
          --x: -90px;
          --y: 15px;
        }

        .p6 {
          --x: 95px;
          --y: 10px;
        }

        .p7 {
          --x: -20px;
          --y: -85px;
        }

        .p8 {
          --x: 30px;
          --y: 90px;
        }

        .p9 {
          --x: -65px;
          --y: -70px;
        }

        .p10 {
          --x: 60px;
          --y: -75px;
        }


        @keyframes particleBlast {

          0% {

            transform:
              translate(-50%, -50%)
              scale(0.2);

            opacity: 0;

          }

          20% {
            opacity: 1;
          }

          100% {

            transform:
              translate(
                calc(-50% + var(--x)),
                calc(-50% + var(--y))
              )
              scale(0);

            opacity: 0;

          }

        }


        /* =====================================================
           IMAGE POPUP
        ====================================================== */

        .vidyut-image-popup {

          position: fixed;

          width: 190px;
          height: 190px;

          transform:
            translate(-50%, -50%);

          perspective: 1200px;

          z-index: 100;

        }


        /* =====================================================
           3D CARD
        ====================================================== */

        .vidyut-image-card {

          position: relative;

          width: 100%;
          height: 100%;

          transform-style: preserve-3d;

          transition:
            transform
            1.05s
            cubic-bezier(0.16, 1, 0.3, 1);

        }


        .image-back {

          transform:
            perspective(1200px)
            rotateY(-180deg)
            scale(0.65);

        }


        .image-front {

          transform:
            perspective(1200px)
            rotateY(0deg)
            scale(1);

        }


        /* =====================================================
           IMAGE SIDES
        ====================================================== */

        .image-side {

          position: absolute;

          inset: 0;

          width: 100%;
          height: 100%;

          overflow: hidden;

          backface-visibility: hidden;

          transform-style: preserve-3d;

        }


        /* =====================================================
           BACK
        ====================================================== */

        .image-back-side {

          transform: rotateY(180deg);

          background:
            radial-gradient(
              circle,
              rgba(255,255,255,0.18),
              rgba(255,255,255,0.04) 35%,
              rgba(0,0,0,0.8) 75%,
              #000 100%
            );

          box-shadow:
            0 0 35px
            rgba(255,255,255,0.12),

            0 0 90px
            rgba(255,255,255,0.08);

        }


        /* =====================================================
           BACK ENERGY
        ====================================================== */

        .back-energy {

          position: absolute;

          width: 65%;
          height: 65%;

          left: 17.5%;
          top: 17.5%;

          border-radius: 50%;

          background:
            radial-gradient(
              circle,
              rgba(255,255,255,0.65) 0%,
              rgba(180,200,255,0.20) 20%,
              transparent 70%
            );

          filter: blur(5px);

          animation:
            energyPulse
            0.7s
            ease-out
            forwards;

        }


        @keyframes energyPulse {

          0% {

            transform: scale(0.3);

            opacity: 0;

          }

          30% {
            opacity: 1;
          }

          100% {

            transform: scale(1.5);

            opacity: 0;

          }

        }


        /* =====================================================
           FRONT
           NO FRAME
           NO BORDER
        ====================================================== */

        .image-front-side {

          transform: rotateY(0deg);

          background: transparent;

          overflow: hidden;

          border: none;

          border-radius: 0;

          box-shadow: none;

          mix-blend-mode: normal;

        }


        /* =====================================================
           IMAGE + FEATHERED EDGES
        ====================================================== */

        .image-front-side img {

          width: 100%;
          height: 100%;

          object-fit: cover;

          display: block;

          user-select: none;

          pointer-events: none;

          /*
            Feathered radial mask.

            Center = fully visible
            Edges = gradually disappear
          */

          -webkit-mask-image:
            radial-gradient(
              ellipse 68% 68% at center,
              #000 40%,
              rgba(0,0,0,0.98) 53%,
              rgba(0,0,0,0.78) 65%,
              rgba(0,0,0,0.42) 77%,
              rgba(0,0,0,0.12) 90%,
              transparent 100%
            );

          mask-image:
            radial-gradient(
              ellipse 68% 68% at center,
              #000 40%,
              rgba(0,0,0,0.98) 53%,
              rgba(0,0,0,0.78) 65%,
              rgba(0,0,0,0.42) 77%,
              rgba(0,0,0,0.12) 90%,
              transparent 100%
            );

          filter:
            contrast(1.03)
            saturate(0.92)
            brightness(0.88)
            drop-shadow(
              0 8px 25px
              rgba(0,0,0,0.45)
            );

        }


        /* =====================================================
           MOBILE
        ====================================================== */

        @media (max-width: 640px) {

          .vidyut-image-popup {

            width: 170px;
            height: 170px;

          }

        }

      `}</style>
    </>
  );
};