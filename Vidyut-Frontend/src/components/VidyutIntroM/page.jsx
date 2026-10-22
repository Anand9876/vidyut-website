import "./global.css";

import { useEffect, useRef, useState } from "react";

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

const COUNT = images.length;


/* =========================================================
   TIMING  (unchanged)
========================================================= */

const INTRO_TIME = 0;   /* no intro scene: starts straight on the photos */

const IMAGE_TIME = 280;

const MONTAGE_TIME =
  COUNT * IMAGE_TIME;

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


function phaseAt(t) {

  if (t < CONVERGENCE_START) return "montage";

  if (t < LOGO_START) return "convergence";

  if (t < FINAL_START) return "logo";

  return "final";
}

function imageAt(t) {

  if (t < MONTAGE_START) return 0;

  return (
    Math.floor(
      (t - MONTAGE_START) /
        IMAGE_TIME
    ) % COUNT
  );
}


/*
   The next scene is mounted (invisible + paused) a moment
   BEFORE it is needed, so its layers are already rasterised
   when the cut happens. No hitch at scene changes.
*/

const PREROLL = 260;

function prerollAt(t) {

  if (
    t >= CONVERGENCE_START - PREROLL &&
    t < CONVERGENCE_START
  ) {
    return "convergence";
  }

  if (
    t >= LOGO_START - PREROLL &&
    t < LOGO_START
  ) {
    return "logo";
  }

  return null;
}


/* =========================================================
   ASSET PREPARATION

   Why the old version stuttered:
   - The photos are huge (often 3000-6000px). Every cut
     forced the browser to decode / upload a giant texture
     in the middle of the animation.
   - A CSS filter was re-applied to a full-screen layer.
   - React re-rendered the whole tree on every frame.

   Now, BEFORE the intro starts, every photo is
     1. loaded + retried if it fails
     2. downscaled to roughly screen size
     3. colour graded once (same saturate/contrast/
        brightness as the old CSS filter) and baked in
     4. decoded, so the first frame is already ready
   The VIDYUT font is also loaded here so the logo never
   flashes a fallback font.
========================================================= */

const MAX_WAIT = 9000;

const RETRIES = 2;

const LOGO_FONT_FAMILY = "Orbitron";

const delay = (ms) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );


function loadImage(src, attempt = 0) {

  return new Promise((resolve) => {

    const img = new Image();

    img.decoding = "async";

    img.onload = () => {

      if (typeof img.decode === "function") {
        img.decode().then(
          () => resolve(img),
          () => resolve(img)
        );
      } else {
        resolve(img);
      }
    };

    img.onerror = () => {

      if (attempt < RETRIES) {
        delay(250 * (attempt + 1)).then(() =>
          resolve(loadImage(src, attempt + 1))
        );
      } else {
        resolve(null);
      }
    };

    img.src = src;
  });
}


/* Same maths as CSS:
   filter: saturate(.9) contrast(1.15) brightness(.75) */

function gradePixels(data) {

  const s = 0.9;
  const c = 1.15;
  const b = 0.75;

  const m0 = 0.213 + 0.787 * s;
  const m1 = 0.715 - 0.715 * s;
  const m2 = 0.072 - 0.072 * s;

  const m3 = 0.213 - 0.213 * s;
  const m4 = 0.715 + 0.285 * s;
  const m5 = 0.072 - 0.072 * s;

  const m6 = 0.213 - 0.213 * s;
  const m7 = 0.715 - 0.715 * s;
  const m8 = 0.072 + 0.928 * s;

  const off = 127.5 - 127.5 * c;

  const clamp = (v) =>
    v < 0 ? 0 : v > 255 ? 255 : v;

  for (let i = 0; i < data.length; i += 4) {

    const r = data[i];
    const g = data[i + 1];
    const bl = data[i + 2];

    const nr = clamp(m0 * r + m1 * g + m2 * bl);
    const ng = clamp(m3 * r + m4 * g + m5 * bl);
    const nb = clamp(m6 * r + m7 * g + m8 * bl);

    data[i] = (nr * c + off) * b;
    data[i + 1] = (ng * c + off) * b;
    data[i + 2] = (nb * c + off) * b;
  }
}


function canvasToUrl(canvas, quality) {

  return new Promise((resolve) => {

    canvas.toBlob(
      (blob) =>
        resolve(
          blob
            ? URL.createObjectURL(blob)
            : null
        ),
      "image/jpeg",
      quality
    );
  });
}


/* keeps decoded bitmaps alive */
const keepAlive = [];

async function buildVariants(src) {

  const img = await loadImage(src);

  if (!img) {
    return { raw: src, graded: src, baked: false };
  }

  try {

    const maxSide = Math.min(
      2000,
      Math.max(
        1100,
        Math.max(
          window.innerWidth,
          window.innerHeight
        ) *
          Math.min(
            window.devicePixelRatio || 1,
            2
          ) *
          1.15
      )
    );

    const scale = Math.min(
      1,
      maxSide /
        Math.max(
          img.naturalWidth,
          img.naturalHeight
        )
    );

    const w = Math.max(
      1,
      Math.round(img.naturalWidth * scale)
    );

    const h = Math.max(
      1,
      Math.round(img.naturalHeight * scale)
    );

    const canvas =
      document.createElement("canvas");

    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    });

    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(img, 0, 0, w, h);

    const rawUrl =
      await canvasToUrl(canvas, 0.92);

    const frame =
      ctx.getImageData(0, 0, w, h);

    gradePixels(frame.data);

    ctx.putImageData(frame, 0, 0);

    const gradedUrl =
      await canvasToUrl(canvas, 0.9);

    if (!rawUrl || !gradedUrl) {
      throw new Error("toBlob failed");
    }

    const [rawImg, gradedImg] =
      await Promise.all([
        loadImage(rawUrl),
        loadImage(gradedUrl),
      ]);

    keepAlive.push(rawImg, gradedImg);

    return {
      raw: rawUrl,
      graded: gradedUrl,
      baked: true,
    };

  } catch (error) {

    /* fallback: original file + CSS filter */

    return {
      raw: src,
      graded: src,
      baked: false,
    };
  }
}


/* Wait until the Google font is registered and loaded */

async function loadLogoFont(timeout = 3500) {

  if (!document.fonts) return;

  const start = performance.now();

  const registered = () => {

    for (const face of document.fonts) {

      if (
        String(face.family).replace(
          /["']/g,
          ""
        ) === LOGO_FONT_FAMILY
      ) {
        return true;
      }
    }

    return false;
  };

  while (
    !registered() &&
    performance.now() - start < timeout
  ) {
    await delay(60);
  }

  try {

    await Promise.race([
      document.fonts.load(
        `900 100px "${LOGO_FONT_FAMILY}"`,
        "VIDYUT"
      ),
      delay(
        Math.max(
          300,
          timeout -
            (performance.now() - start)
        )
      ),
    ]);

  } catch (error) {
    /* ignore, fallback font will be used */
  }
}


let prepared = null;

let preparing = null;

function prepareAssets() {

  if (prepared) {
    return Promise.resolve(prepared);
  }

  if (preparing) {
    return preparing;
  }

  const results = images.map((src) => ({
    raw: src,
    graded: src,
    baked: false,
  }));

  const jobs = images.map((src, index) =>
    buildVariants(src).then((variant) => {

      results[index] = variant;
    })
  );

  const everything = Promise.all([
    ...jobs,
    loadLogoFont(),
  ]).then(() => {
    prepared = results;
    return results;
  });

  /* never hang forever: start with whatever is ready */

  preparing = Promise.race([
    everything,
    delay(MAX_WAIT).then(() => results),
  ]);

  return preparing;
}


/* =========================================================
   VIDYUT INTRO

   Only TWO things trigger React renders now:
   the current phase and the current photo (about 30 times
   in total). All smooth motion is done by CSS animations
   running on the GPU, and the progress bar is moved
   directly through a ref.
========================================================= */

export function VidyutIntro({ onComplete }) {

  const [assets, setAssets] =
    useState(null);

  const [phase, setPhase] =
    useState("montage");

  const [active, setActive] =
    useState(0);

  const [preroll, setPreroll] =
    useState(null);

  const [paused, setPaused] =
    useState(false);

  const timeRef = useRef(0);

  const barRef = useRef(null);

  const completeRef = useRef(onComplete);

  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);


  /* =======================================================
     PREPARE (images + font)
  ======================================================= */

  useEffect(() => {

    let cancelled = false;

    prepareAssets().then((result) => {
      if (!cancelled) setAssets(result);
    });

    return () => {
      cancelled = true;
    };

  }, []);


  /* =======================================================
     TIMER
     Starts only after everything is ready
  ======================================================= */

  useEffect(() => {

    if (!assets || paused) return;

    const base =
      performance.now() - timeRef.current;

    let frame;

    let lastPhase = null;

    let lastImage = null;

    let lastPreroll = null;

    const tick = () => {

      const t = Math.min(
        TOTAL_TIME,
        Math.max(
          0,
          performance.now() - base
        )
      );

      timeRef.current = t;

      if (barRef.current) {
        barRef.current.style.transform =
          `scaleX(${t / TOTAL_TIME})`;
      }

      const nextPhase = phaseAt(t);

      const nextImage = imageAt(t);

      if (nextPhase !== lastPhase) {
        lastPhase = nextPhase;
        setPhase(nextPhase);
      }

      if (nextImage !== lastImage) {
        lastImage = nextImage;
        setActive(nextImage);
      }

      const nextPreroll = prerollAt(t);

      if (nextPreroll !== lastPreroll) {
        lastPreroll = nextPreroll;
        setPreroll(nextPreroll);
      }

      if (t >= TOTAL_TIME) {

        setPaused(true);

        if (completeRef.current) {
          completeRef.current();
        }

        return;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () =>
      cancelAnimationFrame(frame);

  }, [assets, paused]);


  /* =======================================================
     LOADING SCREEN
  ======================================================= */

  /* images still loading: plain black, nothing animated */

  if (!assets) {

    return <main className="cinematic" />;
  }


  const current = assets[active];

  const next =
    assets[(active + 1) % COUNT];

  /* scenes that are live, or pre-rolling */

  const convergenceOn =
    phase === "convergence" ||
    preroll === "convergence";

  const logoOn =
    phase === "logo" ||
    preroll === "logo";

  const convIndex =
    phase === "convergence"
      ? active
      : imageAt(CONVERGENCE_START);

  const logoIndex =
    phase === "logo"
      ? active
      : imageAt(LOGO_START);

  const convCurrent = assets[convIndex];

  const convNext =
    assets[(convIndex + 1) % COUNT];

  const logoCurrent = assets[logoIndex];

  const logoNext =
    assets[(logoIndex + 1) % COUNT];


  /* =======================================================
     MAIN
  ======================================================= */

  return (

    <main
      className={`cinematic ${
        paused ? "is-paused" : ""
      }`}
      onClick={() => {
        if (phase !== "final") {
          setPaused((value) => !value);
        }
      }}
    >

      <div className="vignette" />


      {/* ===================================================
          IMAGE MONTAGE
      =================================================== */}

      {phase === "montage" && (

        <section className="montage">

          {assets.map((asset, index) => (

            <div
              key={index}
              className={[
                "montage-image",
                `movement-${index}`,
                asset.baked ? "is-baked" : "",
                index === active
                  ? "active"
                  : "",
              ].join(" ")}
              style={{
                backgroundImage:
                  `url("${asset.graded}")`,
              }}
            />

          ))}

          <div className="montage-grade" />

          {/* restarts on every cut */}
          <div
            key={active}
            className="cut-flash"
          />

          <div className="cinema-top" />

          <div className="cinema-bottom" />

        </section>
      )}


      {/* ===================================================
          CONVERGENCE
      =================================================== */}

      {convergenceOn && (

        <section
          className={`convergence ${
            phase === "convergence"
              ? ""
              : "scene-preroll"
          }`}
        >

          <div
            className={`convergence-image ${
              convCurrent.baked
                ? "is-baked"
                : ""
            }`}
            style={{
              backgroundImage:
                `url("${convCurrent.graded}")`,
            }}
          />

          <div
            className="second-image"
            style={{
              backgroundImage:
                `url("${convNext.raw}")`,
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
                `url("${convCurrent.raw}")`,
            }}
          />

        </section>
      )}


      {/* ===================================================
          VIDYUT LOGO
      =================================================== */}

      {logoOn && (

        <section
          className={`logo-scene ${
            phase === "logo"
              ? ""
              : "scene-preroll"
          }`}
        >

          <div className="logo-background" />

          <div className="logo-bg-blue" />

          <div className="logo-bg-crimson" />

          <div className="vidyut-mask">

            <div
              className="vidyut-image"
              style={{
                backgroundImage:
                  `url("${logoCurrent.raw}")`,
              }}
            />

            <div
              className="vidyut-image second"
              style={{
                backgroundImage:
                  `url("${logoNext.raw}")`,
              }}
            />

            <div className="vidyut-glow" />

            <div className="vidyut-text">
              VIDYUT
            </div>

            <div className="logo-edge" />

          </div>

        </section>
      )}


      {/* ===================================================
          FINAL
      =================================================== */}

      {phase === "final" && (

        <section className="final">

          <div className="final-blue" />

          <div className="final-crimson" />

          <div
            className="final-image"
            style={{
              backgroundImage:
                `url("${current.raw}")`,
            }}
          />

          <div className="final-sweep" />

        </section>
      )}


      {/* ===================================================
          PROGRESS
      =================================================== */}

      <div className="progress">

        <div ref={barRef} />

      </div>


      {/* ===================================================
          PAUSED
      =================================================== */}

      {paused && phase !== "final" && (

        <div className="paused">
          PAUSED
        </div>

      )}

    </main>
  );
}


export default VidyutIntro;