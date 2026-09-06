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

    const customMaterial = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color("#6b0da1") },
        uColorB: { value: new THREE.Color("#e012be") },
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
          return mix(mix(hash(n), hash(n + 1.0), f.x),
                     mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y);
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

    const mesh = new THREE.Mesh(geometry, customMaterial);
    scene.add(mesh);

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const render = () => {
      const elapsedTime = clock.getElapsedTime();
      customMaterial.uniforms.uTime.value = elapsedTime;
      mesh.rotation.z = elapsedTime * 0.1;

      renderer!.render(scene, camera);
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
      customMaterial.dispose();
      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
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

// Dynamically scale card spread, travel, and bounds based on viewport tier
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
      (config.verticalRangeMax - config.verticalRangeMin) * Math.min(1, Math.max(0, areaFactor - 0.7));

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
      const width = (config.cardWidthMin + Math.random() * config.cardWidthVar) * Math.min(1.24, Math.max(1.0, areaFactor));
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

export default function VidyutWormholeHero({ onComplete }: VidyutWormholeHeroProps) {
  const prefersReducedMotion = useReducedMotion();
  const [tier, setTier] = useState<Tier>("desktop");
  const [viewport, setViewport] = useState({ width: 1280, height: 720 });
  const [isExiting, setIsExiting] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
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
  const streamStartDelay = prefersReducedMotion ? 0 : 0.7;
  const handleContinue = () => {
    if (!onComplete || isExiting) return;
    setIsExiting(true);
    window.setTimeout(() => {
      onComplete();
    }, 450);
  };

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        minHeight: "100vh",
        height: "100dvh", // Supports mobile dynamic viewport height
        backgroundColor: "#05010a",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        padding: isSmallMobile ? "0 0.5rem" : "0 1rem",
        boxSizing: "border-box",
        transition: "opacity 650ms ease, transform 650ms ease",
        opacity: isExiting ? 0 : hasEntered ? 1 : 0,
        transform: isExiting ? "scale(0.98)" : hasEntered ? "scale(1)" : "scale(1.03)",
      }}
    >
      {/* 1. 3D Vortex Background */}
      <NeuralTunnel />

      {/* 2. Responsive Lightfall Layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        <Lightfall
          colors={["#F5D6FF", "#B537F2", "#FF0080"]}
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

      {/* 3. Ambient Center Depth Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at center, rgba(107, 13, 161, 0.25) 0%, rgba(5, 1, 10, 0.85) 75%)",
          zIndex: 2,
        }}
      />

      {/* 4. Responsive Floating Card Streams */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 0,
          height: 0,
          pointerEvents: "none",
          zIndex: 3,
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
                delay: s.delay + streamStartDelay,
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
                border: "1px solid rgba(224, 18, 190, 0.4)",
                borderRadius: isSmallMobile ? "6px" : tier === "mobile" ? "8px" : "12px",
                boxShadow:
                  "0 12px 30px rgba(0, 0, 0, 0.9), 0 0 20px rgba(107, 13, 161, 0.35)",
                overflow: "hidden",
                backgroundColor: "#0d0218",
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
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
                draggable={false}
              />
            </motion.div>
          );
        })}
      </div>

      {/* 5. Responsive Foreground Centerpiece */}
      <h1
        style={{
          position: "relative",
          zIndex: 10,
          color: "#ffffff",
          fontWeight: 700,
          textAlign: "center",
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          width: "100%",
          maxWidth: isSmallMobile ? "280px" : "1200px",
          fontSize: isSmallMobile ? "clamp(1.35rem, 8.6vw, 2rem)" : "clamp(2rem, 8vw, 5.5rem)",
          textShadow:
            "0 0 20px rgba(255, 255, 255, 0.35), 0 0 50px rgba(107, 13, 161, 0.6), 0 0 85px rgba(224, 18, 190, 0.35)",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          margin: 0,
          pointerEvents: "none",
        }}
      >
        Welcome to Vidyut
      </h1>

      {onComplete && (
        <button
          type="button"
          onClick={handleContinue}
          style={{
            position: "absolute",
            zIndex: 12,
            bottom: isSmallMobile ? "1.25rem" : tier === "mobile" ? "2.2rem" : "3rem",
            left: "50%",
            transform: "translateX(-50%)",
            border: "1px solid rgba(245, 214, 255, 0.45)",
            borderRadius: "999px",
            background: "rgba(10, 2, 18, 0.6)",
            color: "#f5d6ff",
            fontSize: isSmallMobile ? "0.62rem" : tier === "mobile" ? "0.72rem" : "0.8rem",
            letterSpacing: "0.24em",
            padding: isSmallMobile ? "0.58rem 0.8rem" : tier === "mobile" ? "0.7rem 1.15rem" : "0.8rem 1.35rem",
            textTransform: "uppercase",
            cursor: isExiting ? "default" : "pointer",
            opacity: isExiting ? 0.6 : 1,
            whiteSpace: "nowrap",
          }}
          disabled={isExiting}
        >
          Enter Main Site
        </button>
      )}
    </div>
  );
}