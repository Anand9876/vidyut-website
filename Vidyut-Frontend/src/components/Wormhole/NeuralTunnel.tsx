import { useEffect, useRef } from "react";
import * as THREE from "three";

interface NeuralTunnelProps {
  wireframeColor?: THREE.ColorRepresentation;
  speed?: number;
}

export default function NeuralTunnel({
  wireframeColor = 0x00d2ff,
  speed = 0.0006,
}: NeuralTunnelProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create curved spline path
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < 40; i++) {
      points.push(
        new THREE.Vector3(
          Math.sin(i * 0.25) * 6,
          Math.cos(i * 0.35) * 6,
          i * 10
        )
      );
    }
    const path = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(path, 160, 3.2, 16, false);

    const material = new THREE.MeshBasicMaterial({
      color: wireframeColor,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });

    const tunnel = new THREE.Mesh(geometry, material);
    scene.add(tunnel);

    let progress = 0;
    let animationFrameId: number;

    const render = () => {
      progress += speed;
      if (progress > 0.85) progress = 0;

      const p1 = path.getPointAt(progress);
      const p2 = path.getPointAt(Math.min(progress + 0.015, 1));

      camera.position.copy(p1);
      camera.lookAt(p2);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [wireframeColor, speed]);

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