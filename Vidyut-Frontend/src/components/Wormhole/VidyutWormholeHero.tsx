import { useMemo, useState, useEffect, useRef } from "react";
import { motion, useReducedMotion, type TargetAndTransition, type Transition } from "framer-motion";
import * as THREE from "three";
import Lightfall from "./Lightfall";

import img1 from "../../assets/img1.jpeg";
import img2 from "../../assets/img2.jpeg";
import img3 from "../../assets/img3.jpeg";
import img4 from "../../assets/img4.jpeg";
import img5 from "../../assets/img5.jpeg";
import img6 from "../../assets/img6.jpeg";
import img7 from "../../assets/img7.jpeg";
import img8 from "../../assets/img8.jpeg";
import img9 from "../../assets/img9.jpeg";
import img10 from "../../assets/img10.jpeg";
import img11 from "../../assets/img11.jpeg";

const LOCAL_IMAGES: string[] = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
  img11,
];

type Tier = "smallMobile" | "mobile" | "tablet" | "desktop";
type IntroStage = "intro" | "zoomOut" | "assemble" | "final" | "exit";

interface StreamItem {
  src: string;
  startX: number;
  endX: number;
  startY: number;
  endY: number;
  tilt: number;
  width: number;
  height: number;
  duration: number;
  delay: number;
}

interface TierConfig {
  minCount: number;
  maxCount: number;
  cardWidthMin: number;
  cardWidthVar: number;
  startXMin: number;
  startXVar: number;
  endXMin: number;
  endXVar: number;
  verticalRangeMin: number;
  verticalRangeMax: number;
  laneJitter: number;
  delayStep: number;
}

interface VidyutWormholeHeroProps {
  onComplete?: () => void;
}

function NeuralTunnel() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | undefined;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch (err) {
      console.warn("WebGL context failed:", err);
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000);
    camera.position.z = 2.5;

    const geometry = new THREE.CylinderGeometry(14, 0.6, 50, 48, 48, true);
    geometry.rotateX(Math.PI / 2);

    const material = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color("#123B8C") },
        uColorB: { value: new THREE.Color("#DC143C") },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        varying vec2 vUv;

        float hash(float n) { return fract(sin(n) * 43758.5453123); }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float n = i.x + i.y * 57.0;
          return mix(
            mix(hash(n), hash(n + 1.0), f.x),
            mix(hash(n + 57.0), hash(n + 58.0), f.x),
            f.y
          );
        }

        void main() {
          float angle = vUv.x * 24.0;
          float speed = uTime * 2.2;
          float rays = sin(angle + sin(angle * 0.5)) * 0.5 + 0.5;
          float streak = noise(vec2(angle * 1.5, vUv.y * 10.0 - speed));
          float intensity = clamp(pow(rays * streak, 1.6) * 2.0, 0.0, 2.5);
          float depthFade = smoothstep(0.0, 0.45, vUv.y);
          vec3 baseColor = mix(uColorA, uColorB, clamp(streak, 0.0, 1.0));
          gl_FragColor = vec4(baseColor, intensity * depthFade * 0.85);
        }
      `,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animationFrameId = 0;
    const clock = new THREE.Clock();

    const render = () => {
      const elapsedTime = clock.getElapsedTime();
      material.uniforms.uTime.value = elapsedTime;
      mesh.rotation.z = elapsedTime * 0.08;
      renderer?.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      geometry.dispose();
      material.dispose();
      renderer?.dispose();
      renderer?.forceContextLoss();

      if (renderer?.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

function useStreamData(tier: Tier, viewport: { width: number; height: number }): StreamItem[] {
  return useMemo(() => {
    const area = Math.max(1, viewport.width * viewport.height);
    const areaRatio = Math.min(1.25, Math.max(0.7, area / (390 * 844)));
    const areaFactor = Math.pow(areaRatio, 0.45);

    const config: TierConfig = {
      smallMobile: {
        minCount: 3,
        maxCount: 3,
        cardWidthMin: 124,
        cardWidthVar: 32,
        startXMin: 108,
        startXVar: 28,
        endXMin: 188,
        endXVar: 46,
        verticalRangeMin: 150,
        verticalRangeMax: 190,
        laneJitter: 7,
        delayStep: 0.26,
      },
      mobile: {
        minCount: 3,
        maxCount: 3,
        cardWidthMin: 170,
        cardWidthVar: 54,
        startXMin: 150,
        startXVar: 45,
        endXMin: 250,
        endXVar: 85,
        verticalRangeMin: 220,
        verticalRangeMax: 280,
        laneJitter: 10,
        delayStep: 0.26,
      },
      tablet: {
        minCount: 3,
        maxCount: 4,
        cardWidthMin: 228,
        cardWidthVar: 74,
        startXMin: 220,
        startXVar: 65,
        endXMin: 430,
        endXVar: 160,
        verticalRangeMin: 290,
        verticalRangeMax: 350,
        laneJitter: 14,
        delayStep: 0.25,
      },
      desktop: {
        minCount: 4,
        maxCount: 4,
        cardWidthMin: 292,
        cardWidthVar: 102,
        startXMin: 310,
        startXVar: 95,
        endXMin: 650,
        endXVar: 240,
        verticalRangeMin: 380,
        verticalRangeMax: 520,
        laneJitter: 18,
        delayStep: 0.25,
      },
    }[tier];

    const dynamicCount = Math.min(
      config.maxCount,
      Math.max(config.minCount, Math.round(config.minCount * areaFactor))
    );

    const verticalRange =
      config.verticalRangeMin +
      (config.verticalRangeMax - config.verticalRangeMin) *
        Math.min(1, Math.max(0, areaFactor - 0.7));

    return Array.from({ length: dynamicCount }, (_, i) => {
      const side = i % 2 === 0 ? -1 : 1;
      const src = LOCAL_IMAGES[i % LOCAL_IMAGES.length];
      const laneT = dynamicCount === 1 ? 0.5 : i / (dynamicCount - 1);
      const laneCenter = (laneT - 0.5) * verticalRange;

      const startX = side * (config.startXMin + Math.random() * config.startXVar) * 0.45;
      const endX = side * (config.endXMin + Math.random() * config.endXVar);
      const startY = laneCenter * 0.3 + (Math.random() - 0.5) * config.laneJitter;
      const endY = laneCenter + (Math.random() - 0.5) * config.laneJitter;
      const tilt = side * (6 + Math.random() * 12);
      const width =
        (config.cardWidthMin + Math.random() * config.cardWidthVar) *
        Math.min(1.24, Math.max(1.0, areaFactor));
      const height = width * 1.35;
      const duration = 7.4 + Math.random() * 0.7;
      const delay = i * (duration * config.delayStep);

      return {
        src,
        startX,
        endX,
        startY,
        endY,
        tilt,
        width,
        height,
        duration,
        delay,
      };
    });
  }, [tier, viewport.width, viewport.height]);
}

const PIECE_ROWS = 4;
const PIECE_COLUMNS = 8;
const PIECE_COUNT = PIECE_ROWS * PIECE_COLUMNS;

function LogoFragments({
  stage,
  tier,
  prefersReducedMotion,
}: {
  stage: IntroStage;
  tier: Tier;
  prefersReducedMotion: boolean;
}) {
  const fragments = useMemo(
    () =>
      Array.from({ length: PIECE_COUNT }, (_, index) => {
        const row = Math.floor(index / PIECE_COLUMNS);
        const column = index % PIECE_COLUMNS;

        // 8 directions are used repeatedly so the pieces visibly arrive
        // from every side and every corner of the screen.
        const directions = [
          { x: 0, y: -1 },
          { x: 0.72, y: -0.72 },
          { x: 1, y: 0 },
          { x: 0.72, y: 0.72 },
          { x: 0, y: 1 },
          { x: -0.72, y: 0.72 },
          { x: -1, y: 0 },
          { x: -0.72, y: -0.72 },
        ];

        const direction = directions[index % directions.length];
        const distance = 560 + ((index * 97) % 300);
        const sideOffset = ((index * 43) % 180) - 90;

        const x =
          direction.x * distance +
          (direction.y === 0 ? 0 : sideOffset * 0.75);
        const y =
          direction.y * distance +
          (direction.x === 0 ? 0 : sideOffset * 0.75);

        return {
          index,
          row,
          column,
          x,
          y,
          rotate: -280 + ((index * 73) % 560),
          rotateX: -160 + ((index * 31) % 320),
          rotateY: -180 + ((index * 47) % 360),
          delay: (index % 8) * 0.065 + Math.floor(index / 8) * 0.055,
        };
      }),
    []
  );

  const isAssembling = stage === "assemble";
  const isFinal = stage === "final" || stage === "exit";
  const isVisible = isAssembling || isFinal;

  if (!isVisible) return null;

  // Responsive rectangular logo formation.
  // The 8 x 4 fragment grid is kept, but the final formation is
  // intentionally wider than it is tall so the logo reads as a
  // clean horizontal rectangle on every screen size.
  const logoWidth =
    tier === "smallMobile"
      ? 280
      : tier === "mobile"
        ? 360
        : tier === "tablet"
          ? 500
          : 620;

  const logoHeight =
    tier === "smallMobile"
      ? 165
      : tier === "mobile"
        ? 210
        : tier === "tablet"
          ? 295
          : 365;

  const pieceWidth = logoWidth / PIECE_COLUMNS;
  const pieceHeight = logoHeight / PIECE_ROWS;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: logoWidth,
        height: logoHeight,
        transform: "translate(-50%, -50%)",
        zIndex: 20,
        pointerEvents: "none",
        perspective: 1400,
      }}
    >
      {fragments.map((piece) => {
        const backgroundPositionX = `${-(piece.column * pieceWidth)}px`;
        const backgroundPositionY = `${-(piece.row * pieceHeight)}px`;

        const initial = {
          x: piece.x,
          y: piece.y,
          rotate: piece.rotate,
          rotateX: piece.rotateX,
          rotateY: piece.rotateY,
          scale: 0.42,
          opacity: 0,
        };

        const assembled = {
          x: 0,
          y: 0,
          rotate: 0,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          opacity: 1,
        };

        const transition: Transition = prefersReducedMotion
          ? {
              duration: 0.45,
              delay: piece.delay * 0.2,
              ease: "easeOut",
            }
          : {
              duration: 1.65,
              delay: piece.delay,
              ease: [0.16, 1, 0.3, 1],
            };

        return (
          <motion.div
            key={piece.index}
            initial={initial}
            animate={assembled}
            transition={transition}
            style={{
              position: "absolute",
              left: piece.column * pieceWidth,
              top: piece.row * pieceHeight,
              width: pieceWidth + 1,
              height: pieceHeight + 1,
              overflow: "hidden",
              transformStyle: "preserve-3d",
              backfaceVisibility: "visible",
              backgroundImage: `url("/images/v-logo.jpg")`,
              backgroundRepeat: "no-repeat",
              backgroundSize: `${logoWidth}px ${logoHeight}px`,
              backgroundPosition: `${backgroundPositionX} ${backgroundPositionY}`,
              backgroundColor: "transparent",
              border: "1px solid rgba(120, 180, 255, 0.12)",
              boxSizing: "border-box",
              boxShadow:
                "0 0 12px rgba(47,107,255,0.20), inset 0 0 8px rgba(220,20,60,0.10)",
            }}
          />
        );
      })}

      {/* The complete rectangular logo fades in after all fragments lock together.
          It uses the same width/height as the fragment formation so the final
          image has the exact same rectangular proportions. */}
      <motion.img
        src="/images/v-logo.jpg"
        alt="Vidyut logo"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{
          opacity: isFinal ? 1 : 0,
          scale: isFinal ? 1 : 0.96,
        }}
        transition={{
          duration: prefersReducedMotion ? 0.3 : 0.65,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "fill",
          display: "block",
          pointerEvents: "none",
          filter:
            "drop-shadow(0 0 12px rgba(255,255,255,0.42)) drop-shadow(0 0 30px rgba(47,107,255,0.70)) drop-shadow(0 0 42px rgba(220,20,60,0.30))",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{
          opacity: isFinal ? 1 : 0,
          scale: isFinal ? 1 : 0.94,
        }}
        transition={{
          duration: prefersReducedMotion ? 0.35 : 0.75,
          ease: "easeOut",
        }}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "112%",
          textAlign: "center",
          fontFamily: "'Chakra Petch', sans-serif",
          fontSize:
            tier === "smallMobile"
              ? "0.48rem"
              : tier === "mobile"
                ? "0.55rem"
                : "0.68rem",
          fontWeight: 500,
          letterSpacing: "0.48em",
          color: "rgba(220,235,255,0.94)",
          textShadow:
            "0 0 12px rgba(47,107,255,0.85), 0 0 28px rgba(220,20,60,0.4)",
          paddingLeft: "0.48em",
          whiteSpace: "nowrap",
        }}
      >
        BEYOND BOUNDARIES
      </motion.div>
    </div>
  );
}

export default function VidyutWormholeHero({ onComplete }: VidyutWormholeHeroProps) {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [tier, setTier] = useState<Tier>("desktop");
  const [viewport, setViewport] = useState({ width: 1280, height: 720 });
  const [hasEntered, setHasEntered] = useState(false);
  const [stage, setStage] = useState<IntroStage>("intro");
  const stageTimerRef = useRef<number | null>(null);
  const stageRef = useRef<IntroStage>("intro");
  const triggeredRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const isSmallMobile = tier === "smallMobile";

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setHasEntered(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const checkWidth = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setViewport({ width: w, height: h });

      if (w < 380) setTier("smallMobile");
      else if (w < 640) setTier("mobile");
      else if (w < 1024) setTier("tablet");
      else setTier("desktop");
    };

    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  const streams = useStreamData(tier, viewport);

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  // The animation starts ONLY after the cursor moves.
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (triggeredRef.current || stageRef.current !== "intro") return;

      const previous = lastMouseRef.current;
      const distance = Math.hypot(event.clientX - previous.x, event.clientY - previous.y);
      lastMouseRef.current = { x: event.clientX, y: event.clientY };

      // Ignore the tiny movement generated when the page first appears.
      if (distance < 8) return;

      triggeredRef.current = true;
      setStage("zoomOut");

      stageTimerRef.current = window.setTimeout(() => {
        setStage("assemble");

        stageTimerRef.current = window.setTimeout(() => {
          setStage("final");

          stageTimerRef.current = window.setTimeout(() => {
            setStage("exit");

            stageTimerRef.current = window.setTimeout(() => {
              onComplete?.();
            }, prefersReducedMotion ? 250 : 700);
          }, prefersReducedMotion ? 700 : 2300);
        }, prefersReducedMotion ? 550 : 1700);
      }, prefersReducedMotion ? 350 : 900);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (stageTimerRef.current !== null) {
        window.clearTimeout(stageTimerRef.current);
      }
    };
  }, [onComplete, prefersReducedMotion]);

  const isZoomingOut = stage === "zoomOut";
  const isLogoSequence = stage === "assemble" || stage === "final" || stage === "exit";
  const isExiting = stage === "exit";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100dvh",
        minHeight: "100vh",
        backgroundColor: "#020817",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        padding: isSmallMobile ? "0 0.5rem" : "0 1rem",
        boxSizing: "border-box",
        transition:
          "opacity 850ms cubic-bezier(0.7, 0, 0.3, 1), transform 1100ms cubic-bezier(0.7, 0, 0.3, 1)",
        opacity: isExiting ? 0 : hasEntered ? 1 : 0,
        transform: isZoomingOut
          ? "scale(0.58)"
          : isExiting
            ? "scale(0.78)"
            : hasEntered
              ? "scale(1)"
              : "scale(1.04)",
        transformOrigin: "center center",
      }}
    >
      {/* The same cinematic video language as the countdown page keeps the transition visually connected. */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: isLogoSequence ? 0.34 : 0.12,
          filter: "saturate(0.75) brightness(0.55) contrast(1.08)",
          transform: "scale(1.04)",
          pointerEvents: "none",
          zIndex: 0,
          transition: "opacity 900ms ease",
        }}
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      <NeuralTunnel />

      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          opacity: isLogoSequence ? 0.55 : 1,
          transition: "opacity 900ms ease",
        }}
      >
        <Lightfall
          colors={["#DCEBFF", "#2F6BFF", "#DC143C"]}
          backgroundColor="transparent"
          speed={0.45}
          streakCount={tier === "desktop" ? 2 : 1}
          streakWidth={isSmallMobile ? 0.72 : tier === "mobile" ? 0.8 : 1}
          streakLength={isSmallMobile ? 0.8 : tier === "mobile" ? 0.9 : 1.2}
          density={isSmallMobile ? 0.28 : tier === "mobile" ? 0.35 : 0.6}
          twinkle={0.8}
          glow={1}
          backgroundGlow={0.25}
          zoom={tier === "desktop" ? 3.0 : 2.0}
          opacity={0.7}
          mouseInteraction={tier === "desktop"}
          mouseStrength={0.5}
          mouseRadius={1}
        />
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at center, rgba(18, 59, 140, 0.30) 0%, rgba(3, 7, 18, 0.88) 72%, rgba(1, 4, 12, 1) 100%)",
          zIndex: 2,
        }}
      />

      {/* Image streams: title establishes first, then the images become visible. */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 0,
          height: 0,
          pointerEvents: "none",
          zIndex: 3,
          opacity: isLogoSequence ? 0 : 1,
          transition: "opacity 500ms ease",
        }}
      >
        {streams.map((s, i) => {
          const animate: TargetAndTransition = prefersReducedMotion
            ? { x: s.endX, y: s.endY, scale: 1.06, rotate: s.tilt * 0.4, opacity: 0.7 }
            : {
                x: [s.startX, s.endX],
                y: [s.startY, s.endY],
                scale: [0.34, 0.78, 1.24],
                rotate: [s.tilt * -0.1, s.tilt * 0.18, s.tilt * 0.45],
                opacity: [0, 0.96, 0.96, 0, 0],
              };

          const transition: Transition = prefersReducedMotion
            ? { duration: 0.6 }
            : {
                duration: s.duration,
                delay: s.delay + 1.25,
                repeat: Infinity,
                ease: "linear",
                times: [0, 0.14, 0.36, 0.5, 1],
              };

          return (
            <motion.div
              key={i}
              style={{
                position: "absolute",
                width: `${s.width}px`,
                height: `${s.height}px`,
                left: `-${s.width / 2}px`,
                top: `-${s.height / 2}px`,
                border: "1px solid rgba(220, 20, 60, 0.42)",
                borderRadius: isSmallMobile ? "6px" : tier === "mobile" ? "8px" : "12px",
                boxShadow:
                  "0 12px 30px rgba(0, 0, 0, 0.9), 0 0 20px rgba(18, 59, 140, 0.38)",
                overflow: "hidden",
                backgroundColor: "#030712",
              }}
              initial={{
                x: s.startX,
                y: s.startY,
                scale: 0.34,
                rotate: s.tilt * -0.1,
                opacity: 0,
              }}
              animate={animate}
              transition={transition}
            >
              <img
                src={s.src}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                draggable={false}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Main VIDYUT title. It is visible before the images and disappears during zoom. */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.82 }}
        animate={{
          opacity: isLogoSequence ? 0 : 1,
          scale: isZoomingOut ? 0.88 : 1,
        }}
        transition={{ duration: prefersReducedMotion ? 0.35 : 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "relative",
          zIndex: 10,
          color: "#ffffff",
          fontWeight: 700,
          textAlign: "center",
          letterSpacing: "0.10em",
          lineHeight: 1.1,
          width: "100%",
          maxWidth: isSmallMobile ? "280px" : "1200px",
          fontSize: isSmallMobile ? "clamp(1.35rem, 8.6vw, 2rem)" : "clamp(2rem, 8vw, 5.5rem)",
          textShadow:
            "0 0 20px rgba(255,255,255,0.35), 0 0 50px rgba(18,59,140,0.62), 0 0 85px rgba(220,20,60,0.38)",
          fontFamily: "'Frontage Bulb', sans-serif",
          margin: 0,
          pointerEvents: "none",
        }}
      >
        VIDYUT
      </motion.h1>

      {/* Small instruction: movement is the only trigger. */}
      <motion.div
        animate={{ opacity: stage === "intro" ? 0.72 : 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "absolute",
          zIndex: 11,
          bottom: isSmallMobile ? "8%" : "7%",
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "'Frontage Bulb', sans-serif",
          fontSize: isSmallMobile ? "0.5rem" : "0.68rem",
          letterSpacing: "0.38em",
          color: "rgba(220,235,255,0.82)",
          paddingLeft: "0.38em",
          pointerEvents: "none",
          textShadow: "0 0 16px rgba(47,107,255,0.75)",
        }}
      >
        MOVE TO CONTINUE
      </motion.div>

      {/* Scattered logo fragments assemble after the zoom-out. */}
      <LogoFragments
        stage={stage}
        tier={tier}
        prefersReducedMotion={prefersReducedMotion}
      />

      {/* A soft energy field behind the assembling logo. */}
      <motion.div
        animate={{
          opacity: isLogoSequence ? 1 : 0,
          scale: isLogoSequence ? 1 : 0.65,
        }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: isSmallMobile ? "300px" : "720px",
          height: isSmallMobile ? "300px" : "720px",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(47,107,255,0.24) 0%, rgba(220,20,60,0.12) 28%, rgba(2,8,23,0) 68%)",
          filter: "blur(4px)",
          pointerEvents: "none",
          zIndex: 12,
        }}
      />
    </div>
  );
}
