import React, { useState, useEffect } from 'react';
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

  // ==========================================================
  // HERO ENTRANCE
  // ONLY FADE + SIMPLE TRANSLATION
  // NO ROTATION
  // NO FLIP
  // NO 3D
  // ==========================================================

  useEffect(() => {
    const t1 = setTimeout(() => {
      setEntranceStage(1);
    }, 120);

    const t2 = setTimeout(() => {
      setEntranceStage(2);
    }, 850);

    const t3 = setTimeout(() => {
      setEntranceStage(3);

      if (onNavbarReady) {
        onNavbarReady();
      }
    }, 1500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onNavbarReady]);

  return (
    <div
      className="
        relative
        min-h-screen
        w-full
        flex
        flex-col
        justify-between
        items-center
        bg-black
        text-white
        overflow-hidden
        select-none
      "
    >

      {/* ======================================================
          BACKGROUND VIDEO
      ====================================================== */}

      <div
        className="
          absolute
          inset-0
          z-0
          overflow-hidden
          pointer-events-none
        "
      >

        <video
          className="
            w-full
            h-full
            object-cover
            object-center
            opacity-65
            scale-105
          "
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source
            src="/videos/hero-bg.mp4"
            type="video/mp4"
          />
        </video>


        {/* ====================================================
            CINEMATIC VIGNETTE
        ==================================================== */}

        <div
          className="
            absolute
            inset-0
          "
          style={{
            background: `
              linear-gradient(
                to bottom,
                rgba(0,0,0,0.85) 0%,
                rgba(0,0,0,0.2) 20%,
                rgba(0,0,0,0.15) 50%,
                rgba(0,0,0,0.6) 80%,
                #000000 100%
              ),

              radial-gradient(
                ellipse at center,
                transparent 35%,
                rgba(0,0,0,0.8) 85%,
                #000000 100%
              )
            `,
          }}
        />

      </div>


      {/* ======================================================
          TOP SPACER FOR NAVBAR
      ====================================================== */}

      <div
        className="
          w-full
          h-16
          sm:h-20
        "
      />


      {/* ======================================================
          MAIN HERO CONTENT
      ====================================================== */}

      <div
        className="
          relative
          z-10
          max-w-5xl
          w-full
          mx-auto
          px-4
          text-center
          my-auto
          flex
          flex-col
          items-center
          justify-center
        "
      >

        {/* ====================================================
            VIDYUT TITLE
        ==================================================== */}

        <div
          className={`
            transition-all
            duration-1000
            ease-[cubic-bezier(0.16,1,0.3,1)]

            ${
              entranceStage === 0
                ? 'opacity-0 translate-y-10'
                : entranceStage === 1
                ? 'opacity-100 translate-y-4'
                : 'opacity-100 translate-y-0'
            }
          `}
        >

          <div
            className="
              relative
              inline-block
              select-none
              my-1
              sm:my-2
            "
          >

            {/* Soft glow */}

            <div
              className="
                absolute
                -inset-10
                bg-white/5
                blur-3xl
                rounded-full
                opacity-40
                pointer-events-none
              "
            />


            {/* =================================================
                VIDYUT

                CHAKRA PETCH
                NO ROTATION
            ================================================== */}

            <h1
              className="
                relative
                font-black
                tracking-[0.10em]
                sm:tracking-[0.10em]
                md:tracking-[0.10em]
                text-6xl
                xs:text-7xl
                sm:text-8xl
                md:text-9xl
                lg:text-[10.5rem]
                xl:text-[12rem]
                leading-[0.88]
                uppercase
                text-transparent
                bg-clip-text
                bg-gradient-to-b
                from-[#ffffff]
                via-[#cbd5e1]
                to-[#64748b]
                drop-shadow-[0_4px_25px_rgba(0,0,0,0.95)]
              "
            style={{
  fontFamily: "'Chakra Petch', sans-serif",
  fontWeight: 700,
  letterSpacing: '0.10em',
}}
            >
              VIDYUT
            </h1>

          </div>


          {/* ==================================================
              SUBTITLE
          ================================================== */}

          <div
            className={`
              mt-2
              sm:mt-3
              font-syncopate
              font-normal
              text-[10px]
              sm:text-xs
              md:text-sm
              tracking-[0.38em]
              text-white/90
              uppercase
              transition-all
              duration-700

              ${
                entranceStage >= 3
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }
            `}
          >
            NATIONAL LEVEL MULTIFEST • OCT 15, 2026
          </div>

        </div>


        {/* ======================================================
            COUNTDOWN
        ====================================================== */}

        <div
          className={`
            mt-6
            sm:mt-8
            w-full
            max-w-2xl
            mx-auto
            transition-all
            duration-700

            ${
              entranceStage >= 3
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-6'
            }
          `}
        >

          <div
            className="
              grid
              grid-cols-4
              gap-2.5
              sm:gap-4
              p-3
              sm:p-4
              rounded-2xl
              border
              border-white/15
              bg-black/50
              backdrop-blur-md
              shadow-silver-glow
            "
          >

            {/* ==================================================
                DAYS
            ================================================== */}

            <div
              className="
                p-2.5
                sm:p-4
                rounded-xl
                border
                border-white/10
                bg-white/[0.02]
                flex
                flex-col
                items-center
                justify-center
                transition-colors
                hover:border-white/25
              "
            >

              <span
                className="
                  text-3xl
                  sm:text-4xl
                  md:text-5xl
                  font-impact
                  font-bold
                  text-transparent
                  bg-clip-text
                  bg-gradient-to-b
                  from-[#ffffff]
                  to-[#94a3b8]
                  leading-none
                "
              >
                {String(timeLeft.days).padStart(2, '0')}
              </span>

              <span
                className="
                  text-[9px]
                  sm:text-[10px]
                  font-syncopate
                  text-white/70
                  uppercase
                  font-semibold
                  tracking-[0.2em]
                  mt-1.5
                  sm:mt-2
                "
              >
                DAYS
              </span>

            </div>


            {/* ==================================================
                HOURS
            ================================================== */}

            <div
              className="
                p-2.5
                sm:p-4
                rounded-xl
                border
                border-white/10
                bg-white/[0.02]
                flex
                flex-col
                items-center
                justify-center
                transition-colors
                hover:border-white/25
              "
            >

              <span
                className="
                  text-3xl
                  sm:text-4xl
                  md:text-5xl
                  font-impact
                  font-bold
                  text-transparent
                  bg-clip-text
                  bg-gradient-to-b
                  from-[#ffffff]
                  to-[#94a3b8]
                  leading-none
                "
              >
                {String(timeLeft.hours).padStart(2, '0')}
              </span>

              <span
                className="
                  text-[9px]
                  sm:text-[10px]
                  font-syncopate
                  text-white/70
                  uppercase
                  font-semibold
                  tracking-[0.2em]
                  mt-1.5
                  sm:mt-2
                "
              >
                HOURS
              </span>

            </div>


            {/* ==================================================
                MINUTES
            ================================================== */}

            <div
              className="
                p-2.5
                sm:p-4
                rounded-xl
                border
                border-white/10
                bg-white/[0.02]
                flex
                flex-col
                items-center
                justify-center
                transition-colors
                hover:border-white/25
              "
            >

              <span
                className="
                  text-3xl
                  sm:text-4xl
                  md:text-5xl
                  font-impact
                  font-bold
                  text-transparent
                  bg-clip-text
                  bg-gradient-to-b
                  from-[#ffffff]
                  to-[#94a3b8]
                  leading-none
                "
              >
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>

              <span
                className="
                  text-[9px]
                  sm:text-[10px]
                  font-syncopate
                  text-white/70
                  uppercase
                  font-semibold
                  tracking-[0.2em]
                  mt-1.5
                  sm:mt-2
                "
              >
                MINS
              </span>

            </div>


            {/* ==================================================
                SECONDS
            ================================================== */}

            <div
              className="
                p-2.5
                sm:p-4
                rounded-xl
                border
                border-white/10
                bg-white/[0.02]
                flex
                flex-col
                items-center
                justify-center
                transition-colors
                hover:border-white/25
              "
            >

              <div
                className="
                  flex
                  items-baseline
                  justify-center
                "
              >

                <span
                  className="
                    text-3xl
                    sm:text-4xl
                    md:text-5xl
                    font-impact
                    font-bold
                    text-transparent
                    bg-clip-text
                    bg-gradient-to-b
                    from-[#ffffff]
                    to-[#94a3b8]
                    leading-none
                  "
                >
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>

                <span
                  className="
                    text-[10px]
                    sm:text-xs
                    font-mono
                    text-crimson-accent
                    font-bold
                    ml-0.5
                  "
                >
                  .{String(timeLeft.milliseconds).padStart(2, '0')}
                </span>

              </div>


              <span
                className="
                  text-[9px]
                  sm:text-[10px]
                  font-syncopate
                  text-white/70
                  uppercase
                  font-semibold
                  tracking-[0.2em]
                  mt-1.5
                  sm:mt-2
                "
              >
                SECS
              </span>

            </div>

          </div>

        </div>


        {/* ======================================================
            ACTION BUTTONS
        ====================================================== */}

        <div
          className={`
            mt-6
            sm:mt-8
            flex
            flex-wrap
            items-center
            justify-center
            gap-3
            sm:gap-4
            transition-all
            duration-700

            ${
              entranceStage >= 3
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-6'
            }
          `}
        >

          {/* ==================================================
              CLAIM PASS
          ================================================== */}

          <button
            onClick={() =>
              setIsPassModalOpen(true)
            }
            className="
              px-7
              sm:px-8
              py-3
              rounded-full
              bg-white
              text-black
              font-syncopate
              font-bold
              text-xs
              tracking-[0.2em]
              uppercase
              shadow-silver-glow
              hover:bg-gray-200
              active:bg-gray-300
              transition-colors
              flex
              items-center
              gap-2
            "
          >

            <Ticket
              className="
                w-3.5
                h-3.5
                fill-current
              "
            />

            <span>
              CLAIM PASS
            </span>

          </button>


          {/* ==================================================
              SHOW INTEREST
          ================================================== */}

          <button
            onClick={() =>
              setIsInterestModalOpen(true)
            }
            className="
              px-7
              sm:px-8
              py-3
              rounded-full
              border
              border-white/30
              hover:border-white
              bg-black/60
              backdrop-blur-md
              text-white
              font-syncopate
              font-bold
              text-xs
              tracking-[0.2em]
              uppercase
              transition-colors
              flex
              items-center
              gap-2
            "
          >

            <Heart
              className="
                w-3.5
                h-3.5
                fill-current
                text-white
              "
            />

            <span>
              SHOW INTEREST
            </span>

          </button>


          {/* ==================================================
              PREVIOUS VIDYUT
          ================================================== */}

          <a
            href="https://vidyut-last.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="
              px-5
              sm:px-6
              py-3
              rounded-full
              border
              border-white/20
              hover:border-white
              bg-black/60
              backdrop-blur-md
              text-white/70
              hover:text-white
              font-syncopate
              font-bold
              text-xs
              tracking-[0.2em]
              uppercase
              transition-colors
              flex
              items-center
              gap-1.5
            "
          >

            <span>
              VIDYUT '25 ↗
            </span>

          </a>

        </div>

      </div>


      {/* ======================================================
          FOOTER
      ====================================================== */}

      <footer
        className="
          relative
          z-10
          w-full
          max-w-6xl
          mx-auto
          px-6
          py-4
          flex
          flex-col
          sm:flex-row
          items-center
          justify-between
          gap-2
          text-[10px]
          sm:text-[11px]
          font-montserrat
          text-white/40
          border-t
          border-white/10
        "
      >

        <div>
          © 2026 VIDYUT • AMRITA VISHWA VIDYAPEETHAM
        </div>

        <div
          className="
            font-syncopate
            tracking-[0.2em]
            text-white/60
          "
        >
          BE THE CHANGE
        </div>

      </footer>


      {/* ======================================================
          SHOW INTEREST MODAL
      ====================================================== */}

      <ShowInterestModal
        isOpen={isInterestModalOpen}
        onClose={() =>
          setIsInterestModalOpen(false)
        }
      />

    </div>
  );
};