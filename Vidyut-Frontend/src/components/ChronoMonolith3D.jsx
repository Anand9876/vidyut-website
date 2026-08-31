import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useTransformation } from '../context/TransformationContext';
import { sound } from '../audio/SoundEngine';

export const ChronoMonolith3D = () => {
  const mountRef = useRef(null);
  const { transformationProgress } = useTransformation();
  const progressRef = useRef(transformationProgress);
  progressRef.current = transformationProgress;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 440;
    const height = container.clientHeight || 440;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    const clockMasterGroup = new THREE.Group();
    scene.add(clockMasterGroup);

    // 1. Outer Astrolabe / Chrono Ring (Terracotta / Antique Gold Trim)
    const outerRingGeo = new THREE.TorusGeometry(2.35, 0.06, 24, 80);
    const outerRingMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xe85034),
      metalness: 0.75,
      roughness: 0.25,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    clockMasterGroup.add(outerRing);

    // 2. Middle Gyroscopic Orbital Ring (Prussian Blue & Electric Cyan Accents)
    const middleRingGeo = new THREE.TorusGeometry(1.85, 0.04, 16, 64);
    const middleRingMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x1d3864),
      metalness: 0.85,
      roughness: 0.2,
    });
    const middleRing = new THREE.Mesh(middleRingGeo, middleRingMat);
    middleRing.rotation.x = Math.PI * 0.25;
    clockMasterGroup.add(middleRing);

    // 3. Inner Time-Track Ring with Clock Ticks
    const innerRingGeo = new THREE.TorusGeometry(1.35, 0.03, 16, 64);
    const innerRingMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xfbf5e6),
      metalness: 0.3,
      roughness: 0.3,
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    clockMasterGroup.add(innerRing);

    // Fine Tick Marks around the Inner Ring
    const ticksGroup = new THREE.Group();
    clockMasterGroup.add(ticksGroup);
    const tickGeo = new THREE.BoxGeometry(0.02, 0.12, 0.02);
    const tickMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xfbf5e6) });

    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const tick = new THREE.Mesh(tickGeo, tickMat);
      tick.position.x = Math.cos(angle) * 1.35;
      tick.position.y = Math.sin(angle) * 1.35;
      tick.rotation.z = angle + Math.PI / 2;
      if (i % 6 === 0) {
        tick.scale.set(1.8, 1.8, 1);
      }
      ticksGroup.add(tick);
    }

    // 4. Center Geometric Crystal Core (Icosahedron time-prism)
    const crystalGeo = new THREE.IcosahedronGeometry(0.65, 0);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x3ce6c4),
      emissive: new THREE.Color(0x1a7a68),
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.6,
      ior: 1.5,
      transparent: true,
      opacity: 0.9,
      wireframe: false,
    });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    clockMasterGroup.add(crystalMesh);

    // Delicate wireframe cage around crystal
    const wireGeo = new THREE.IcosahedronGeometry(0.82, 0);
    const wireMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0xe85034),
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    clockMasterGroup.add(wireMesh);

    // 5. Orbiting Chrono Satellite Beads (4 nodes)
    const satellites = [];
    const satGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const satMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xfbf5e6),
      emissive: new THREE.Color(0xe85034),
      metalness: 0.9,
      roughness: 0.1,
    });

    for (let i = 0; i < 3; i++) {
      const sat = new THREE.Mesh(satGeo, satMat);
      clockMasterGroup.add(sat);
      satellites.push({ mesh: sat, speed: 0.8 + i * 0.4, radius: 1.85, offset: (i * Math.PI * 2) / 3 });
    }

    // 6. Lights
    const ambientLight = new THREE.AmbientLight(0xfbf5e6, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffedd5, 1.8);
    dirLight1.position.set(4, 5, 6);
    scene.add(dirLight1);

    const cyanLight = new THREE.PointLight(0x3ce6c4, 1.5, 8);
    cyanLight.position.set(0, 0, 1);
    scene.add(cyanLight);

    const terracottaLight = new THREE.PointLight(0xe85034, 1.2, 8);
    terracottaLight.position.set(0, 0, -2);
    scene.add(terracottaLight);

    // Smooth Mouse Parallax tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      const px = (clientX - rect.left) / rect.width - 0.5;
      const py = (clientY - rect.top) / rect.height - 0.5;
      mouse.targetX = px * 0.35;
      mouse.targetY = py * 0.35;
    };

    window.addEventListener('mousemove', handlePointerMove);

    // Interactive Click impulse
    let pulseScale = 1;
    const handleClick = () => {
      sound.playNeedleKick();
      sound.playEnergySurge();
      pulseScale = 1.15;
    };

    container.addEventListener('click', handleClick);

    // Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Damped mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      clockMasterGroup.rotation.y = mouse.x;
      clockMasterGroup.rotation.x = -mouse.y;

      // Pulse spring back
      pulseScale += (1.0 - pulseScale) * 0.08;
      clockMasterGroup.scale.setScalar(pulseScale);

      // Gyroscopic differential rotations
      outerRing.rotation.z = elapsed * 0.15;
      middleRing.rotation.y = elapsed * 0.25;
      middleRing.rotation.x = Math.PI * 0.25 + Math.sin(elapsed * 0.5) * 0.15;
      innerRing.rotation.z = -elapsed * 0.2;
      ticksGroup.rotation.z = -elapsed * 0.2;

      // Crystal core spin
      crystalMesh.rotation.x = elapsed * 0.4;
      crystalMesh.rotation.y = elapsed * 0.6;
      wireMesh.rotation.x = -elapsed * 0.3;
      wireMesh.rotation.y = -elapsed * 0.5;

      // Orbiting Satellites
      satellites.forEach((sat) => {
        const theta = elapsed * sat.speed + sat.offset;
        sat.mesh.position.x = Math.cos(theta) * sat.radius;
        sat.mesh.position.y = Math.sin(theta) * Math.cos(elapsed * 0.3) * sat.radius;
        sat.mesh.position.z = Math.sin(theta) * Math.sin(elapsed * 0.3) * sat.radius;
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      outerRingGeo.dispose();
      middleRingGeo.dispose();
      innerRingGeo.dispose();
      crystalGeo.dispose();
      wireGeo.dispose();
      satGeo.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="relative w-full h-[320px] sm:h-[380px] md:h-[420px] flex items-center justify-center cursor-pointer select-none"
      title="Interactive 3D Chrono-Mechanism — Click to oscillate"
    >
      <div className="absolute bottom-2 px-3 py-1 rounded-full bg-ink-navy/80 border border-terracotta/30 text-[10px] font-mono tracking-widest text-stamp-cream/70 flex items-center gap-2 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-ping" />
        <span>CHRONO-MONOLITH • GYROSCOPIC CORE</span>
      </div>
    </div>
  );
};
