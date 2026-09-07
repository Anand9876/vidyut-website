import "./global.css";

import { useEffect, useState } from "react";

const images = [
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2400&q=90",
  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2400&q=90",
  "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=2400&q=90",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=2400&q=90",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=2400&q=90",
  "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=2400&q=90",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2400&q=90",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=2400&q=90",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=2400&q=90",
  "https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=2400&q=90",
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=2400&q=90",
  "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=2400&q=90",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2400&q=90",
  "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=2400&q=90",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=2400&q=90",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=2400&q=90",
];

/* =========================================================
   TIMING
========================================================= */

const INTRO_TIME = 700;

const IMAGE_TIME = 150;

const MONTAGE_TIME = images.length * IMAGE_TIME;

const CONVERGENCE_TIME = 650;

const LOGO_TIME = 2200;

const FINAL_TIME = 1300;

const MONTAGE_START = INTRO_TIME;

const CONVERGENCE_START =
  MONTAGE_START + MONTAGE_TIME;

const LOGO_START =
  CONVERGENCE_START + CONVERGENCE_TIME;

const FINAL_START =
  LOGO_START + LOGO_TIME;

const TOTAL_TIME =
  FINAL_START + FINAL_TIME;


/* =========================================================
   VIDYUT INTRO
========================================================= */

export function VidyutIntro({ onComplete }) {
  const [time, setTime] = useState(0);
  const [paused, setPaused] = useState(false);

  /* =======================================================
     TIMER
  ======================================================= */

  useEffect(() => {
    if (paused) return;

    const start = Date.now() - time;

    const timer = setInterval(() => {
      const current = Date.now() - start;

      if (current >= TOTAL_TIME) {
        setTime(TOTAL_TIME);
        setPaused(true);

        if (onComplete) {
          onComplete();
        }

        return;
      }

      setTime(current);
    }, 16);

    return () => clearInterval(timer);
  }, [paused, onComplete, time]);


  /* =======================================================
     PHASES
  ======================================================= */

  const intro = time < MONTAGE_START;

  const montage =
    time >= MONTAGE_START &&
    time < CONVERGENCE_START;

  const convergence =
    time >= CONVERGENCE_START &&
    time < LOGO_START;

  const logo =
    time >= LOGO_START &&
    time < FINAL_START;

  const final =
    time >= FINAL_START;


  /* =======================================================
     ACTIVE IMAGE
  ======================================================= */

  let activeImage = 0;
  let imageProgress = 0;

  if (montage) {
    const elapsed =
      time - MONTAGE_START;

    activeImage =
      Math.floor(elapsed / IMAGE_TIME) %
      images.length;

    imageProgress =
      (elapsed % IMAGE_TIME) /
      IMAGE_TIME;
  }

  if (convergence || logo || final) {
    const elapsed =
      Math.max(0, time - MONTAGE_START);

    activeImage =
      Math.floor(elapsed / IMAGE_TIME) %
      images.length;
  }


  /* =======================================================
     CONVERGENCE PROGRESS
  ======================================================= */

  const convergenceProgress =
    convergence
      ? Math.min(
          1,
          (time - CONVERGENCE_START) /
            CONVERGENCE_TIME
        )
      : logo || final
      ? 1
      : 0;


  /* =======================================================
     LOGO PROGRESS
  ======================================================= */

  const logoProgress =
    logo
      ? Math.min(
          1,
          (time - LOGO_START) /
            1800
        )
      : final
      ? 1
      : 0;


  /* =======================================================
     FINAL PROGRESS
  ======================================================= */

  const finalProgress =
    final
      ? Math.min(
          1,
          (time - FINAL_START) /
            1000
        )
      : 0;


  /* =======================================================
     SKIP
  ======================================================= */

  const skip = () => {
    setTime(FINAL_START);
    setPaused(true);
  };


  /* =======================================================
     MAIN
  ======================================================= */

  return (
    <main
      className="cinematic"
      onClick={() =>
        setPaused((value) => !value)
      }
    >

      {/* ===================================================
          GRAIN
      =================================================== */}

      <div className="grain" />

      <div className="vignette" />


      {/* ===================================================
          INTRO
      =================================================== */}

      {intro && (
        <section className="intro">

          <div className="intro-blue" />

          <div className="intro-crimson" />

          <div className="intro-line line-one" />

          <div className="intro-line line-two" />

          <div className="intro-core" />

          <div className="intro-text">
            V
          </div>

        </section>
      )}


      {/* ===================================================
          IMAGE MONTAGE
      =================================================== */}

      {montage && (
        <section className="montage">

          {images.map((image, index) => (
            <div
              key={image}
              className={`
                montage-image
                movement-${index}
                ${
                  index === activeImage
                    ? "active"
                    : ""
                }
              `}
              style={{
                backgroundImage:
                  `url("${image}")`,
                "--image-progress":
                  imageProgress,
              }}
            />
          ))}

          <div className="blue-grade" />

          <div className="crimson-grade" />

          <div className="cinematic-shadow" />

          <div
            className="cut-flash"
            style={{
              opacity:
                imageProgress > 0.82
                  ? (imageProgress - 0.82) /
                    0.18 *
                    0.65
                  : 0,
            }}
          />

          <div className="cinema-top" />

          <div className="cinema-bottom" />

        </section>
      )}


      {/* ===================================================
          CONVERGENCE
      =================================================== */}

      {convergence && (
        <section
          className="convergence"
          style={{
            "--convergence":
              convergenceProgress,
          }}
        >

          <div
            className="convergence-image"
            style={{
              backgroundImage:
                `url("${images[activeImage]}")`,
            }}
          />

          <div
            className="second-image"
            style={{
              backgroundImage:
                `url("${
                  images[
                    (activeImage + 1) %
                    images.length
                  ]
                }")`,
            }}
          />

          <div className="image-panel panel-left">
            <div />
          </div>

          <div className="image-panel panel-right">
            <div />
          </div>

          <div className="convergence-light" />

          <div
            className="collapse-image"
            style={{
              transform:
                `scale(${
                  1 -
                  convergenceProgress *
                    0.92
                })`,
              opacity:
                1 -
                convergenceProgress *
                  0.5,
            }}
          />

          <div className="collapse-edge" />

        </section>
      )}


      {/* ===================================================
          LOGO
      =================================================== */}

      {logo && (
        <section
          className="logo-scene"
          style={{
            "--logo-progress":
              logoProgress,
          }}
        >

          <div className="logo-background" />

          <div className="logo-bg-blue" />

          <div className="logo-bg-crimson" />

          <div
            className="vidyut-mask"
            style={{
              opacity:
                logoProgress,
            }}
          >

            <div
              className="vidyut-image"
              style={{
                backgroundImage:
                  `url("${images[activeImage]}")`,
              }}
            />

            <div
              className="vidyut-image second"
              style={{
                backgroundImage:
                  `url("${
                    images[
                      (activeImage + 1) %
                      images.length
                    ]
                  }")`,
              }}
            />

            <div
              className="vidyut-text"
              style={{
                transform:
                  `scale(${
                    0.7 +
                    logoProgress *
                      0.3
                  })`,
                opacity:
                  logoProgress,
              }}
            >
              VIDYUT
            </div>

            <div className="logo-edge" />

          </div>

          <div
            className="logo-sweep"
            style={{
              transform:
                `translateX(${
                  -120 +
                  logoProgress *
                    240
                }%)`,
            }}
          />

          <div
            className="logo-subtitle"
            style={{
              opacity:
                Math.max(
                  0,
                  (logoProgress -
                    0.45) /
                    0.55
                ),
            }}
          >
            ELECTRIFYING INNOVATION
          </div>

        </section>
      )}


      {/* ===================================================
          FINAL
      =================================================== */}

      {final && (
        <section
          className="final"
          style={{
            "--final-progress":
              finalProgress,
          }}
        >

          <div className="final-blue" />

          <div className="final-crimson" />

          <div
            className="final-image"
            style={{
              backgroundImage:
                `url("${images[activeImage]}")`,
            }}
          />

          <div className="final-content">

            <div
              className="final-vidyut"
              style={{
                opacity:
                  finalProgress,
                transform:
                  `scale(${
                    0.92 +
                    finalProgress *
                      0.08
                  })`,
              }}
            >
              VIDYUT
            </div>

            <div
              className="final-line"
              style={{
                transform:
                  `scaleX(${
                    finalProgress
                  })`,
                opacity:
                  finalProgress,
              }}
            />

          </div>

          <div
            className="final-sweep"
            style={{
              transform:
                `translateX(${
                  -120 +
                  finalProgress *
                    240
                }%)`,
            }}
          />

        </section>
      )}


      {/* ===================================================
          SKIP BUTTON
      =================================================== */}

      {!final && (
        <button
          className="skip"
          onClick={(event) => {
            event.stopPropagation();
            skip();
          }}
        >
          SKIP
        </button>
      )}


      {/* ===================================================
          PROGRESS
      =================================================== */}

      <div className="progress">
        <div
          style={{
            width:
              `${Math.min(
                100,
                (time / TOTAL_TIME) *
                  100
              )}%`,
          }}
        />
      </div>


      {/* ===================================================
          PAUSED
      =================================================== */}

      {paused && !final && (
        <div className="paused">
          PAUSED
        </div>
      )}

    </main>
  );
}


/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default VidyutIntro;