import React, { useEffect, useMemo, useState } from "react";

const INTRO_IMAGES = Array.from(
  { length: 16 },
  (_, i) => `/images/vidyut-intro/${String(i + 1).padStart(2, "0")}.jpg`
);

const EFFECTS = [
  "zoomIn",
  "zoomOut",
  "fadeIn",
  "slideLeft",
  "slideRight",
  "slideUp",
  "slideDown",
  "rotate3D",
  "flip3D",
  "diagonalTL",
  "diagonalBR",
  "blurFocus",
  "colorReveal",
  "flashIn",
  "tiltZoom",
  "softFocus",
];

const PARTICLE_COUNT = 90;

const particleData = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  left: `${(i * 37.17) % 100}%`,
  top: `${(i * 61.83) % 100}%`,
  size: `${1 + ((i * 17) % 4) * 0.45}px`,
  duration: `${3.5 + ((i * 29) % 70) / 10}s`,
  delay: `${-((i * 23) % 80) / 10}s`,
  driftX: `${-45 + ((i * 47) % 90)}px`,
  driftY: `${-55 + ((i * 71) % 110)}px`,
  opacity: 0.28 + ((i * 13) % 55) / 100,
  type:
    i % 11 === 0
      ? "orange"
      : i % 17 === 0
        ? "red"
        : i % 5 === 0
          ? "blue"
          : "white",
}));

const COMETS = [
  {
    left: "-15%",
    top: "15%",
    dx: "125vw",
    dy: "68vh",
    rotate: "27deg",
    duration: "3.7s",
    delay: "-1.5s",
  },
  {
    left: "112%",
    top: "18%",
    dx: "-125vw",
    dy: "58vh",
    rotate: "151deg",
    duration: "4.4s",
    delay: "-3.2s",
  },
  {
    left: "-12%",
    top: "48%",
    dx: "125vw",
    dy: "3vh",
    rotate: "7deg",
    duration: "3.2s",
    delay: "-2.1s",
  },
  {
    left: "110%",
    top: "55%",
    dx: "-125vw",
    dy: "-8vh",
    rotate: "184deg",
    duration: "3.9s",
    delay: "-0.8s",
  },
  {
    left: "10%",
    top: "-15%",
    dx: "80vw",
    dy: "125vh",
    rotate: "47deg",
    duration: "4.6s",
    delay: "-4s",
  },
  {
    left: "74%",
    top: "-18%",
    dx: "-52vw",
    dy: "125vh",
    rotate: "112deg",
    duration: "4.1s",
    delay: "-1.2s",
  },
  {
    left: "-10%",
    top: "78%",
    dx: "120vw",
    dy: "-68vh",
    rotate: "-27deg",
    duration: "4.8s",
    delay: "-2.8s",
  },
  {
    left: "108%",
    top: "84%",
    dx: "-120vw",
    dy: "-72vh",
    rotate: "208deg",
    duration: "4.3s",
    delay: "-3.7s",
  },
  {
    left: "38%",
    top: "-12%",
    dx: "8vw",
    dy: "125vh",
    rotate: "84deg",
    duration: "3.5s",
    delay: "-1.9s",
  },
  {
    left: "60%",
    top: "112%",
    dx: "-10vw",
    dy: "-125vh",
    rotate: "-94deg",
    duration: "4.2s",
    delay: "-3.1s",
  },
  {
    left: "-15%",
    top: "33%",
    dx: "125vw",
    dy: "34vh",
    rotate: "17deg",
    duration: "3.6s",
    delay: "-4.5s",
  },
  {
    left: "114%",
    top: "38%",
    dx: "-125vw",
    dy: "25vh",
    rotate: "166deg",
    duration: "4.7s",
    delay: "-2.5s",
  },
];

function preloadImages(images) {
  return Promise.all(
    images.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve;
          img.src = src;
        })
    )
  );
}

export default function VidyutIntro({ onComplete }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [showImage, setShowImage] = useState(false);
  const [showLogo, setShowLogo] = useState(false);

  const particles = useMemo(() => particleData, []);

  useEffect(() => {
    let mounted = true;

    preloadImages(INTRO_IMAGES).then(() => {
      if (mounted) {
        setShowImage(true);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!showImage) return;

    const imageTimer = setInterval(() => {
      setCurrentImage((previous) => {
        if (previous >= INTRO_IMAGES.length - 1) {
          clearInterval(imageTimer);

          setTimeout(() => {
            setShowImage(false);

            setTimeout(() => {
              setShowLogo(true);
            }, 250);
          }, 320);

          return previous;
        }

        return previous + 1;
      });
    }, 300);

    return () => clearInterval(imageTimer);
  }, [showImage]);

  useEffect(() => {
    if (!showLogo) return;

    const finishTimer = setTimeout(() => {
      onComplete?.();
    }, 2600);

    return () => clearTimeout(finishTimer);
  }, [showLogo, onComplete]);

  return (
    <div className="vidyut-intro">

      {/* ================= SPACE BACKGROUND ================= */}

      <div className="space-background">

        <div className="nebula nebula-blue" />
        <div className="nebula nebula-red" />
        <div className="nebula nebula-orange" />
        <div className="nebula nebula-purple" />

        <div className="space-cloud cloud-one" />
        <div className="space-cloud cloud-two" />
        <div className="space-cloud cloud-three" />

        <div className="space-center-glow" />

        {/* PARTICLES */}

        <div className="particle-layer">
          {particles.map((particle, index) => (
            <span
              key={index}
              className={`particle particle-${particle.type}`}
              style={{
                left: particle.left,
                top: particle.top,
                width: particle.size,
                height: particle.size,
                opacity: particle.opacity,
                animationDuration: particle.duration,
                animationDelay: particle.delay,
                "--drift-x": particle.driftX,
                "--drift-y": particle.driftY,
              }}
            />
          ))}
        </div>

        {/* COMETS */}

        <div className="comet-layer">
          {COMETS.map((comet, index) => (
            <span
              key={index}
              className={`comet comet-${index % 4}`}
              style={{
                left: comet.left,
                top: comet.top,
                "--comet-x": comet.dx,
                "--comet-y": comet.dy,
                "--comet-rotate": comet.rotate,
                animationDuration: comet.duration,
                animationDelay: comet.delay,
              }}
            >
              <span className="comet-head" />
              <span className="comet-tail" />
            </span>
          ))}
        </div>

        {/* FOREGROUND DUST */}

        <div className="foreground-dust">
          {Array.from({ length: 24 }).map((_, index) => (
            <span
              key={index}
              className="dust"
              style={{
                left: `${(index * 43) % 100}%`,
                top: `${(index * 71) % 100}%`,
                animationDelay: `${-(index % 8)}s`,
                animationDuration: `${5 + (index % 5)}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* ================= COSMIC LAYERS ================= */}

      <div className="cosmic-grid" />
      <div className="cosmic-ring ring-one" />
      <div className="cosmic-ring ring-two" />

      <div className="light-beam beam-one" />
      <div className="light-beam beam-two" />

      {/* ================= IMAGE MONTAGE ================= */}

      {showImage && (
        <div className="image-stage">

          <div className="image-glow" />

          <div className="image-frame">
            {INTRO_IMAGES.map((src, index) => (
              <img
                key={src}
                src={src}
                alt=""
                draggable="false"
                className={`intro-photo ${
                  index === currentImage
                    ? `active effect-${EFFECTS[index]}`
                    : ""
                }`}
              />
            ))}
          </div>

          <div className="image-color-glow" />
          <div className="image-sweep" />
        </div>
      )}

      {/* ================= FINAL LOGO ================= */}

      {showLogo && (
        <div className="logo-stage">

          <div className="logo-stars">
            {Array.from({ length: 35 }).map((_, index) => (
              <span
                key={index}
                className="logo-star"
                style={{
                  left: `${(index * 31.7) % 100}%`,
                  top: `${(index * 47.3) % 100}%`,
                  animationDelay: `${-(index % 7)}s`,
                }}
              />
            ))}
          </div>

          <div className="logo-energy energy-one" />
          <div className="logo-energy energy-two" />
          <div className="logo-energy energy-three" />

          <div className="logo-burst" />

          <div className="logo-content">

            <div className="logo-small">
              AMRITA AMRITAPURI
            </div>

            <h1 className="vidyut-logo">
              <span>V</span>
              <span>I</span>
              <span>D</span>
              <span>Y</span>
              <span>U</span>
              <span>T</span>
            </h1>

            <div className="logo-line">
              <span />
              <p>WHERE IDEAS IGNITE</p>
              <span />
            </div>

          </div>
        </div>
      )}

      {/* ================= OVERLAYS ================= */}

      <div className="intro-vignette" />
      <div className="intro-grain" />
      <div className="intro-scanlines" />

      <style>{`

        * {
          box-sizing: border-box;
        }

        .vidyut-intro {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background: #010207;
          color: white;
          z-index: 99999;
          isolation: isolate;
          font-family: "Cinzel", Georgia, serif;
        }

        /* =====================================================
           SPACE BACKGROUND
        ====================================================== */

        .space-background {
          position: absolute;
          inset: -8%;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 50% 50%,
              rgba(25, 42, 90, 0.42) 0%,
              rgba(5, 10, 25, 0.9) 30%,
              #010207 72%
            );
          z-index: 0;
        }

        .nebula {
          position: absolute;
          border-radius: 50%;
          filter: blur(55px);
          mix-blend-mode: screen;
          pointer-events: none;
        }

        .nebula-blue {
          width: 70vw;
          height: 55vw;
          left: -20vw;
          top: 5vh;
          background:
            radial-gradient(
              ellipse,
              rgba(20, 90, 255, 0.30) 0%,
              rgba(12, 43, 140, 0.18) 35%,
              transparent 72%
            );
          animation: nebulaBlue 13s ease-in-out infinite alternate;
        }

        .nebula-red {
          width: 65vw;
          height: 55vw;
          right: -18vw;
          top: -10vh;
          background:
            radial-gradient(
              ellipse,
              rgba(255, 35, 35, 0.25) 0%,
              rgba(150, 15, 30, 0.15) 38%,
              transparent 72%
            );
          animation: nebulaRed 16s ease-in-out infinite alternate;
        }

        .nebula-orange {
          width: 58vw;
          height: 48vw;
          left: 25vw;
          bottom: -28vw;
          background:
            radial-gradient(
              ellipse,
              rgba(255, 106, 25, 0.27) 0%,
              rgba(180, 52, 15, 0.13) 40%,
              transparent 72%
            );
          animation: nebulaOrange 11s ease-in-out infinite alternate;
        }

        .nebula-purple {
          width: 55vw;
          height: 45vw;
          left: 35vw;
          top: 20vh;
          background:
            radial-gradient(
              ellipse,
              rgba(105, 35, 255, 0.13),
              transparent 70%
            );
          filter: blur(80px);
          animation: nebulaPurple 18s ease-in-out infinite alternate;
        }

        .space-cloud {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(35px);
          opacity: 0.5;
          mix-blend-mode: screen;
        }

        .cloud-one {
          width: 32vw;
          height: 18vw;
          left: 5%;
          top: 38%;
          background:
            radial-gradient(
              ellipse,
              rgba(0, 105, 255, 0.16),
              transparent 70%
            );
          animation: cloudMoveOne 9s ease-in-out infinite alternate;
        }

        .cloud-two {
          width: 38vw;
          height: 20vw;
          right: 3%;
          top: 42%;
          background:
            radial-gradient(
              ellipse,
              rgba(255, 65, 35, 0.15),
              transparent 70%
            );
          animation: cloudMoveTwo 12s ease-in-out infinite alternate;
        }

        .cloud-three {
          width: 30vw;
          height: 16vw;
          left: 35%;
          top: 10%;
          background:
            radial-gradient(
              ellipse,
              rgba(255, 145, 35, 0.10),
              transparent 70%
            );
          animation: cloudMoveThree 15s ease-in-out infinite alternate;
        }

        .space-center-glow {
          position: absolute;
          width: 42vw;
          height: 42vw;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background:
            radial-gradient(
              circle,
              rgba(55, 100, 255, 0.11) 0%,
              rgba(255, 70, 25, 0.055) 28%,
              transparent 68%
            );
          filter: blur(18px);
          animation: centerPulse 4s ease-in-out infinite;
        }

        /* =====================================================
           PARTICLES
        ====================================================== */

        .particle-layer {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          display: block;
          border-radius: 50%;
          animation: particleFloat ease-in-out infinite;
          will-change: transform, opacity;
        }

        .particle-white {
          background: white;
          box-shadow: 0 0 5px rgba(255,255,255,0.8);
        }

        .particle-blue {
          background: #70a8ff;
          box-shadow: 0 0 7px rgba(50,130,255,0.95);
        }

        .particle-orange {
          background: #ff9a42;
          box-shadow: 0 0 8px rgba(255,90,25,0.9);
        }

        .particle-red {
          background: #ff4d4d;
          box-shadow: 0 0 8px rgba(255,30,30,0.9);
        }

        /* =====================================================
           COMETS
        ====================================================== */

        .comet-layer {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .comet {
          position: absolute;
          width: 150px;
          height: 3px;
          transform-origin: left center;
          transform: rotate(var(--comet-rotate));
          animation: cometFly linear infinite;
          opacity: 0;
          z-index: 5;
          will-change: transform, opacity;
        }

        .comet-head {
          position: absolute;
          right: 0;
          top: 50%;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          transform: translateY(-50%);
          background: white;
          box-shadow:
            0 0 5px white,
            0 0 12px rgba(90,160,255,0.95),
            0 0 22px rgba(255,110,50,0.65);
        }

        .comet-tail {
          position: absolute;
          right: 4px;
          top: 50%;
          width: 145px;
          height: 2px;
          transform: translateY(-50%);
          transform-origin: right center;
          background:
            linear-gradient(
              to left,
              rgba(255,255,255,0.95),
              rgba(85,155,255,0.7) 28%,
              rgba(255,80,35,0.25) 60%,
              transparent
            );
          filter: blur(0.7px);
        }

        /* =====================================================
           DUST
        ====================================================== */

        .foreground-dust {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 8;
        }

        .dust {
          position: absolute;
          width: 2px;
          height: 2px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 0 7px rgba(110,170,255,0.9);
          animation: dustFloat linear infinite;
        }

        /* =====================================================
           COSMIC GRID
        ====================================================== */

        .cosmic-grid {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          opacity: 0.11;
          background-image:
            linear-gradient(
              rgba(100,150,255,0.18) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(100,150,255,0.18) 1px,
              transparent 1px
            );
          background-size: 100px 100px;
          mask-image:
            radial-gradient(
              circle at center,
              black 0%,
              transparent 65%
            );
          animation: gridMove 18s linear infinite;
        }

        .cosmic-ring {
          position: absolute;
          left: 50%;
          top: 50%;
          border: 1px solid rgba(100,150,255,0.08);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 4;
        }

        .ring-one {
          width: 65vw;
          height: 65vw;
          animation: ringRotate 28s linear infinite;
        }

        .ring-two {
          width: 85vw;
          height: 85vw;
          border-color: rgba(255,90,40,0.05);
          animation: ringRotateReverse 38s linear infinite;
        }

        /* =====================================================
           IMAGE STAGE
        ====================================================== */

        .image-stage {
          position: absolute;
          inset: 0;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .image-frame {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .intro-photo {
          position: absolute;
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          opacity: 0;
          visibility: hidden;
          transform: scale(1);
          filter: saturate(1.05) contrast(1.05);
          will-change: transform, opacity, filter;
        }

        .intro-photo.active {
          visibility: visible;
          opacity: 1;
        }

        .image-glow {
          position: absolute;
          width: 65%;
          height: 65%;
          border-radius: 50%;
          background:
            radial-gradient(
              circle,
              rgba(50,100,255,0.13),
              rgba(255,55,25,0.05) 38%,
              transparent 70%
            );
          filter: blur(45px);
          animation: imageGlow 3s ease-in-out infinite;
        }

        .image-color-glow {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(
              circle at center,
              transparent 30%,
              rgba(0,30,100,0.10) 60%,
              rgba(100,0,0,0.20) 100%
            );
          mix-blend-mode: screen;
        }

        .image-sweep {
          position: absolute;
          width: 180%;
          height: 3px;
          left: -40%;
          top: 50%;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(90,170,255,0.7),
              rgba(255,160,70,0.8),
              transparent
            );
          filter: blur(2px);
          opacity: 0.18;
          animation: sweepAcross 2.4s linear infinite;
        }

        /* =====================================================
           IMAGE EFFECTS
        ====================================================== */

        .effect-zoomIn {
          animation: zoomIn 300ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .effect-zoomOut {
          animation: zoomOut 300ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .effect-fadeIn {
          animation: fadeIn 300ms ease-out forwards;
        }

        .effect-slideLeft {
          animation: slideLeft 300ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .effect-slideRight {
          animation: slideRight 300ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .effect-slideUp {
          animation: slideUp 300ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .effect-slideDown {
          animation: slideDown 300ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .effect-rotate3D {
          animation: rotate3D 300ms cubic-bezier(0.15, 0.75, 0.2, 1) forwards;
        }

        .effect-flip3D {
          animation: flip3D 300ms cubic-bezier(0.15, 0.75, 0.2, 1) forwards;
        }

        .effect-diagonalTL {
          animation: diagonalTL 300ms cubic-bezier(0.15, 0.75, 0.2, 1) forwards;
        }

        .effect-diagonalBR {
          animation: diagonalBR 300ms cubic-bezier(0.15, 0.75, 0.2, 1) forwards;
        }

        .effect-blurFocus {
          animation: blurFocus 300ms ease-out forwards;
        }

        .effect-colorReveal {
          animation: colorReveal 300ms ease-out forwards;
        }

        .effect-flashIn {
          animation: flashIn 300ms ease-out forwards;
        }

        .effect-tiltZoom {
          animation: tiltZoom 300ms cubic-bezier(0.15, 0.75, 0.2, 1) forwards;
        }

        .effect-softFocus {
          animation: softFocus 300ms ease-out forwards;
        }

        /* =====================================================
           ⭐ NEW IMAGE #5 ANIMATION
           CORNER → JUMP → CENTER
        ====================================================== */

        .effect-cornerJump {
          animation:
            cornerJump
            300ms
            cubic-bezier(0.15, 0.85, 0.2, 1)
            forwards;
          transform-origin: center center;
        }

        @keyframes cornerJump {

          /* Starts outside the upper-left corner */
          0% {
            opacity: 0;
            transform:
              translate(-48vw, -38vh)
              scale(0.35)
              rotate(-18deg);
            filter:
              blur(5px)
              brightness(1.35);
          }

          /* Quickly appears while moving toward center */
          20% {
            opacity: 0.75;
            transform:
              translate(-31vw, -24vh)
              scale(0.48)
              rotate(-13deg);
          }

          /* First jump */
          42% {
            opacity: 1;
            transform:
              translate(-15vw, -11vh)
              scale(0.72)
              rotate(-7deg);
          }

          /* Hits near center and grows */
          62% {
            opacity: 1;
            transform:
              translate(3vw, 3vh)
              scale(1.10)
              rotate(4deg);
          }

          /* Small bounce backward */
          78% {
            transform:
              translate(-1.4vw, -1.3vh)
              scale(0.94)
              rotate(-2deg);
          }

          /* Settles perfectly in center */
          100% {
            opacity: 1;
            transform:
              translate(0, 0)
              scale(1)
              rotate(0deg);
            filter:
              blur(0)
              brightness(1);
          }
        }

        /* =====================================================
           LOGO
        ====================================================== */

        .logo-stage {
          position: absolute;
          inset: 0;
          z-index: 40;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background:
            radial-gradient(
              circle at center,
              rgba(30,55,130,0.20),
              rgba(0,0,0,0.25) 40%,
              rgba(0,0,0,0.72) 100%
            );
          animation: logoStageIn 700ms ease-out forwards;
        }

        .logo-content {
          position: relative;
          z-index: 8;
          text-align: center;
          animation:
            logoZoom
            1800ms
            cubic-bezier(0.12, 0.75, 0.15, 1)
            forwards;
        }

        .logo-small {
          margin-bottom: 18px;
          font-family: "Cinzel", Georgia, serif;
          font-size: clamp(9px, 1vw, 15px);
          letter-spacing: 0.55em;
          color: rgba(215,225,255,0.82);
          animation: logoSmallIn 900ms ease-out 350ms both;
        }

        .vidyut-logo {
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          gap: clamp(1px, 0.25vw, 6px);
          font-family:
            "Cinzel Decorative",
            "Cinzel",
            Georgia,
            serif;
          font-size: clamp(58px, 13vw, 190px);
          line-height: 0.85;
          font-weight: 700;
          letter-spacing: 0.01em;
          color: transparent;
          background:
            linear-gradient(
              105deg,
              #ffffff 0%,
              #b9c6dd 20%,
              #fff4c4 38%,
              #d9983c 52%,
              #fff1bc 67%,
              #9db5df 82%,
              #ffffff 100%
            );
          -webkit-background-clip: text;
          background-clip: text;
          filter:
            drop-shadow(0 0 5px rgba(255,255,255,0.45))
            drop-shadow(0 0 20px rgba(255,170,50,0.30))
            drop-shadow(0 0 45px rgba(40,110,255,0.30));
        }

        .vidyut-logo span {
          display: inline-block;
          animation:
            letterReveal
            850ms
            cubic-bezier(0.12, 0.75, 0.15, 1)
            both;
        }

        .vidyut-logo span:nth-child(1) {
          animation-delay: 300ms;
        }

        .vidyut-logo span:nth-child(2) {
          animation-delay: 370ms;
        }

        .vidyut-logo span:nth-child(3) {
          animation-delay: 440ms;
        }

        .vidyut-logo span:nth-child(4) {
          animation-delay: 510ms;
        }

        .vidyut-logo span:nth-child(5) {
          animation-delay: 580ms;
        }

        .vidyut-logo span:nth-child(6) {
          animation-delay: 650ms;
        }

        .logo-line {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          margin-top: 30px;
          animation: lineReveal 900ms ease-out 900ms both;
        }

        .logo-line span {
          width: clamp(35px, 9vw, 130px);
          height: 1px;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(220,170,85,0.75)
            );
        }

        .logo-line span:last-child {
          background:
            linear-gradient(
              90deg,
              rgba(220,170,85,0.75),
              transparent
            );
        }

        .logo-line p {
          margin: 0;
          font-family: "Cinzel", Georgia, serif;
          font-size: clamp(8px, 0.9vw, 13px);
          letter-spacing: 0.38em;
          color: rgba(230,235,255,0.86);
        }

        /* =====================================================
           LOGO ENERGY
        ====================================================== */

        .logo-energy {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          pointer-events: none;
        }

        .energy-one {
          width: min(68vw, 850px);
          height: min(68vw, 850px);
          border: 1px solid rgba(80,150,255,0.14);
          box-shadow:
            0 0 50px rgba(30,100,255,0.07),
            inset 0 0 50px rgba(30,100,255,0.04);
          animation: energySpin 18s linear infinite;
        }

        .energy-two {
          width: min(50vw, 620px);
          height: min(50vw, 620px);
          border: 1px solid rgba(255,120,45,0.14);
          border-left-color: transparent;
          border-right-color: transparent;
          animation: energySpinReverse 11s linear infinite;
        }

        .energy-three {
          width: min(36vw, 450px);
          height: min(36vw, 450px);
          border: 1px dashed rgba(255,205,110,0.16);
          animation: energySpin 8s linear infinite;
        }

        .logo-burst {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 20vw;
          height: 20vw;
          max-width: 300px;
          max-height: 300px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background:
            radial-gradient(
              circle,
              rgba(255,210,120,0.18),
              rgba(60,110,255,0.08) 30%,
              transparent 70%
            );
          filter: blur(8px);
          animation: burstPulse 2.5s ease-in-out infinite;
        }

        .logo-stars {
          position: absolute;
          inset: 0;
        }

        .logo-star {
          position: absolute;
          width: 2px;
          height: 2px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 0 7px rgba(150,190,255,0.9);
          animation: starTwinkle 2.5s ease-in-out infinite;
        }

        /* =====================================================
           OVERLAYS
        ====================================================== */

        .intro-vignette {
          position: absolute;
          inset: 0;
          z-index: 80;
          pointer-events: none;
          background:
            radial-gradient(
              ellipse at center,
              transparent 40%,
              rgba(0,0,0,0.30) 75%,
              rgba(0,0,0,0.82) 100%
            );
        }

        .intro-grain {
          position: absolute;
          inset: -50%;
          z-index: 81;
          pointer-events: none;
          opacity: 0.045;
          background-image:
            url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E");
          animation: grainMove 0.25s steps(2) infinite;
        }

        .intro-scanlines {
          position: absolute;
          inset: 0;
          z-index: 82;
          pointer-events: none;
          opacity: 0.035;
          background:
            repeating-linear-gradient(
              to bottom,
              transparent 0px,
              transparent 3px,
              rgba(255,255,255,0.25) 4px
            );
        }

        .light-beam {
          position: absolute;
          z-index: 7;
          width: 2px;
          height: 160%;
          top: -30%;
          opacity: 0.12;
          filter: blur(2px);
          pointer-events: none;
        }

        .beam-one {
          left: 35%;
          background:
            linear-gradient(
              to bottom,
              transparent,
              rgba(50,130,255,0.8),
              transparent
            );
          transform: rotate(25deg);
          animation: beamMoveOne 7s ease-in-out infinite alternate;
        }

        .beam-two {
          right: 30%;
          background:
            linear-gradient(
              to bottom,
              transparent,
              rgba(255,100,40,0.75),
              transparent
            );
          transform: rotate(-28deg);
          animation: beamMoveTwo 9s ease-in-out infinite alternate;
        }

        /* =====================================================
           BACKGROUND KEYFRAMES
        ====================================================== */

        @keyframes nebulaBlue {
          from {
            transform: translate3d(-3vw, 2vh, 0) scale(1);
          }
          to {
            transform: translate3d(9vw, -5vh, 0) scale(1.18);
          }
        }

        @keyframes nebulaRed {
          from {
            transform: translate3d(4vw, -3vh, 0) scale(1);
          }
          to {
            transform: translate3d(-9vw, 8vh, 0) scale(1.2);
          }
        }

        @keyframes nebulaOrange {
          from {
            transform: translate3d(-5vw, 4vh, 0) scale(1);
          }
          to {
            transform: translate3d(6vw, -6vh, 0) scale(1.15);
          }
        }

        @keyframes nebulaPurple {
          from {
            transform: translate3d(-8vw, 3vh, 0);
          }
          to {
            transform: translate3d(7vw, -7vh, 0);
          }
        }

        @keyframes cloudMoveOne {
          from {
            transform: translate(-5vw, 0) scale(0.9);
          }
          to {
            transform: translate(15vw, -4vh) scale(1.25);
          }
        }

        @keyframes cloudMoveTwo {
          from {
            transform: translate(5vw, 2vh) scale(1);
          }
          to {
            transform: translate(-15vw, -5vh) scale(1.2);
          }
        }

        @keyframes cloudMoveThree {
          from {
            transform: translate(0, 0);
          }
          to {
            transform: translate(7vw, 8vh);
          }
        }

        @keyframes centerPulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(0.85);
            opacity: 0.5;
          }

          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 1;
          }
        }

        @keyframes particleFloat {
          0% {
            transform: translate3d(0, 0, 0) scale(0.5);
            opacity: 0;
          }

          20% {
            opacity: 0.7;
          }

          50% {
            transform:
              translate3d(
                var(--drift-x),
                var(--drift-y),
                0
              )
              scale(1.25);
          }

          80% {
            opacity: 0.35;
          }

          100% {
            transform: translate3d(0, 0, 0) scale(0.5);
            opacity: 0;
          }
        }

        @keyframes cometFly {
          0% {
            opacity: 0;
            transform:
              translate3d(0, 0, 0)
              rotate(var(--comet-rotate))
              scale(0.7);
          }

          10% {
            opacity: 0;
          }

          22% {
            opacity: 0.8;
          }

          45% {
            opacity: 1;
          }

          55% {
            opacity: 0.9;
          }

          78% {
            opacity: 0.45;
          }

          100% {
            opacity: 0;
            transform:
              translate3d(var(--comet-x), var(--comet-y), 0)
              rotate(var(--comet-rotate))
              scale(1.15);
          }
        }

        @keyframes dustFloat {
          0% {
            transform: translate3d(0, 0, 0);
            opacity: 0.1;
          }

          50% {
            transform: translate3d(25px, -45px, 0);
            opacity: 0.75;
          }

          100% {
            transform: translate3d(-15px, 30px, 0);
            opacity: 0.1;
          }
        }

        @keyframes gridMove {
          from {
            transform: translate3d(0, 0, 0);
          }

          to {
            transform: translate3d(100px, 100px, 0);
          }
        }

        @keyframes ringRotate {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }

          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes ringRotateReverse {
          from {
            transform: translate(-50%, -50%) rotate(360deg);
          }

          to {
            transform: translate(-50%, -50%) rotate(0deg);
          }
        }

        @keyframes imageGlow {
          0%, 100% {
            transform: scale(0.9);
            opacity: 0.45;
          }

          50% {
            transform: scale(1.12);
            opacity: 0.8;
          }
        }

        @keyframes sweepAcross {
          from {
            transform: translateX(-55vw);
          }

          to {
            transform: translateX(55vw);
          }
        }

        /* =====================================================
           OTHER IMAGE EFFECTS
        ====================================================== */

        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.72);
          }

          25% {
            opacity: 1;
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes zoomOut {
          from {
            opacity: 0;
            transform: scale(1.28);
          }

          25% {
            opacity: 1;
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(1.03);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideLeft {
          from {
            opacity: 0;
            transform: translateX(18vw) scale(1.04);
          }

          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes slideRight {
          from {
            opacity: 0;
            transform: translateX(-18vw) scale(1.04);
          }

          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(16vh) scale(1.04);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-16vh) scale(1.04);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes rotate3D {
          from {
            opacity: 0;
            transform:
              perspective(900px)
              rotateY(-65deg)
              scale(0.9);
          }

          to {
            opacity: 1;
            transform:
              perspective(900px)
              rotateY(0deg)
              scale(1);
          }
        }

        @keyframes flip3D {
          from {
            opacity: 0;
            transform:
              perspective(900px)
              rotateX(75deg)
              scale(0.86);
          }

          to {
            opacity: 1;
            transform:
              perspective(900px)
              rotateX(0deg)
              scale(1);
          }
        }

        @keyframes diagonalTL {
          from {
            opacity: 0;
            transform:
              translate(-15vw, -12vh)
              rotate(-4deg)
              scale(0.94);
          }

          to {
            opacity: 1;
            transform:
              translate(0, 0)
              rotate(0deg)
              scale(1);
          }
        }

        @keyframes diagonalBR {
          from {
            opacity: 0;
            transform:
              translate(15vw, 12vh)
              rotate(4deg)
              scale(0.94);
          }

          to {
            opacity: 1;
            transform:
              translate(0, 0)
              rotate(0deg)
              scale(1);
          }
        }

        @keyframes blurFocus {
          from {
            opacity: 0;
            filter: blur(18px) saturate(0.7);
            transform: scale(1.04);
          }

          to {
            opacity: 1;
            filter: blur(0) saturate(1.05);
            transform: scale(1);
          }
        }

        @keyframes colorReveal {
          from {
            opacity: 0;
            filter:
              grayscale(1)
              blur(5px)
              brightness(1.5);
          }

          to {
            opacity: 1;
            filter:
              grayscale(0)
              blur(0)
              brightness(1);
          }
        }

        @keyframes flashIn {
          0% {
            opacity: 0;
            filter: brightness(3) blur(5px);
            transform: scale(1.08);
          }

          25% {
            opacity: 1;
            filter: brightness(1.5) blur(0);
          }

          100% {
            opacity: 1;
            filter: brightness(1);
            transform: scale(1);
          }
        }

        @keyframes tiltZoom {
          from {
            opacity: 0;
            transform:
              scale(0.78)
              rotate(-5deg);
          }

          60% {
            opacity: 1;
          }

          to {
            opacity: 1;
            transform:
              scale(1)
              rotate(0deg);
          }
        }

        @keyframes softFocus {
          from {
            opacity: 0;
            filter: blur(10px);
            transform: scale(1.08);
          }

          55% {
            opacity: 1;
            filter: blur(3px);
          }

          to {
            opacity: 1;
            filter: blur(0);
            transform: scale(1);
          }
        }

        /* =====================================================
           LOGO ANIMATION
        ====================================================== */

        @keyframes logoStageIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes logoZoom {
          from {
            opacity: 0;
            transform: scale(0.35);
          }

          35% {
            opacity: 1;
          }

          75% {
            transform: scale(1.08);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes logoSmallIn {
          from {
            opacity: 0;
            transform: translateY(12px);
            letter-spacing: 0.8em;
          }

          to {
            opacity: 1;
            transform: translateY(0);
            letter-spacing: 0.55em;
          }
        }

        @keyframes letterReveal {
          from {
            opacity: 0;
            transform:
              translateY(35px)
              scale(0.4)
              rotateX(70deg);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              scale(1)
              rotateX(0deg);
          }
        }

        @keyframes lineReveal {
          from {
            opacity: 0;
            transform: scaleX(0.2);
          }

          to {
            opacity: 1;
            transform: scaleX(1);
          }
        }

        @keyframes energySpin {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }

          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes energySpinReverse {
          from {
            transform: translate(-50%, -50%) rotate(360deg);
          }

          to {
            transform: translate(-50%, -50%) rotate(0deg);
          }
        }

        @keyframes burstPulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(0.7);
            opacity: 0.35;
          }

          50% {
            transform: translate(-50%, -50%) scale(1.35);
            opacity: 0.8;
          }
        }

        @keyframes starTwinkle {
          0%, 100% {
            opacity: 0.15;
            transform: scale(0.7);
          }

          50% {
            opacity: 1;
            transform: scale(1.8);
          }
        }

        @keyframes grainMove {
          0% {
            transform: translate(0, 0);
          }

          25% {
            transform: translate(3%, -2%);
          }

          50% {
            transform: translate(-2%, 3%);
          }

          75% {
            transform: translate(2%, 2%);
          }

          100% {
            transform: translate(-3%, -3%);
          }
        }

        @keyframes beamMoveOne {
          from {
            transform:
              translateX(-20vw)
              rotate(25deg);
          }

          to {
            transform:
              translateX(25vw)
              rotate(25deg);
          }
        }

        @keyframes beamMoveTwo {
          from {
            transform:
              translateX(15vw)
              rotate(-28deg);
          }

          to {
            transform:
              translateX(-25vw)
              rotate(-28deg);
          }
        }

        /* =====================================================
           MOBILE
        ====================================================== */

        @media (max-width: 768px) {

          .cosmic-grid {
            background-size: 65px 65px;
            opacity: 0.07;
          }

          .ring-one {
            width: 110vw;
            height: 110vw;
          }

          .ring-two {
            width: 140vw;
            height: 140vw;
          }

          .nebula {
            filter: blur(40px);
          }

          .logo-small {
            letter-spacing: 0.35em;
          }

          .logo-line {
            gap: 10px;
            margin-top: 22px;
          }

          .logo-line p {
            letter-spacing: 0.22em;
          }

          .comet {
            width: 100px;
          }

          .comet-tail {
            width: 95px;
          }
        }

        @media (prefers-reduced-motion: reduce) {

          .nebula,
          .space-cloud,
          .particle,
          .comet,
          .dust,
          .cosmic-grid,
          .cosmic-ring,
          .light-beam,
          .logo-energy,
          .logo-burst,
          .logo-star,
          .image-glow,
          .image-sweep {
            animation-duration: 12s !important;
          }
        }

      `}</style>
    </div>
    
  );
  
}
export { VidyutIntro };