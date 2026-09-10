import "./global.css";

import { useEffect, useState } from "react";

import image1 from "../../assets/img1.jpeg";
import image2 from "../../assets/img2.jpeg";
import image3 from "../../assets/img3.jpeg";
import image4 from "../../assets/img4.jpeg";
import image5 from "../../assets/img5.jpeg";
import image6 from "../../assets/img6.jpeg";
import image7 from "../../assets/img7.jpeg";
import image8 from "../../assets/img8.jpeg";
import image9 from "../../assets/img9.jpeg";
import image10 from "../../assets/img10.jpeg";
import image11 from "../../assets/img11.jpeg";


/* =========================================================
   IMAGES
========================================================= */

const images = [
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  image7,
  image8,
  image9,
  image10,
  image11,
];


/* =========================================================
   TIMING
   Medium cinematic speed
========================================================= */

const INTRO_TIME = 850;

const IMAGE_TIME = 280;

const MONTAGE_TIME =
  images.length * IMAGE_TIME;

const CONVERGENCE_TIME = 850;

const LOGO_TIME = 2400;

const FINAL_TIME = 100;

const MONTAGE_START =
  INTRO_TIME;

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

  const [paused, setPaused] =
    useState(false);


  /* =======================================================
     TIMER
  ======================================================= */

  useEffect(() => {

    if (paused) return;

    const start =
      Date.now() - time;

    const timer =
      setInterval(() => {

        const current =
          Date.now() - start;

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

    return () =>
      clearInterval(timer);

  }, [
    paused,
    onComplete,
    time,
  ]);


  /* =======================================================
     PHASES
  ======================================================= */

  const intro =
    time < MONTAGE_START;

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
      Math.floor(
        elapsed / IMAGE_TIME
      ) % images.length;

    imageProgress =
      (elapsed % IMAGE_TIME) /
      IMAGE_TIME;
  }

  if (
    convergence ||
    logo ||
    final
  ) {

    const elapsed =
      Math.max(
        0,
        time - MONTAGE_START
      );

    activeImage =
      Math.floor(
        elapsed / IMAGE_TIME
      ) % images.length;
  }


  /* =======================================================
     CONVERGENCE
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
     LOGO
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
     FINAL
  ======================================================= */

  const finalProgress =
    final
      ? Math.min(
          1,
          (time - FINAL_START) /
            1100
        )
      : 0;


  /* =======================================================
     MAIN
  ======================================================= */

  return (

    <main
      className="cinematic"
      onClick={() =>
        setPaused(
          (value) => !value
        )
      }
    >

      {/* GRAIN */}

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
          </div>

        </section>
      )}


      {/* ===================================================
          IMAGE MONTAGE
      =================================================== */}

      {montage && (

        <section className="montage">

          {images.map(
            (image, index) => (

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

            )
          )}

          <div className="blue-grade" />

          <div className="crimson-grade" />

          <div className="cinematic-shadow" />

          <div
            className="cut-flash"
            style={{
              opacity:
                imageProgress > 0.88
                  ? (
                      (imageProgress - 0.88) /
                      0.12
                    ) * 0.45
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
              backgroundImage:
                `url("${images[activeImage]}")`,

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
          VIDYUT LOGO
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
                  (
                    logoProgress -
                    0.45
                  ) / 0.55
                ),
            }}
          >
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


export default VidyutIntro;