import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useTransformation } from '../context/TransformationContext';

export const Instrument3D = () => {
  const mountRef = useRef(null);
  const {
    transformationProgress,
    activePillars,
    instrumentNeedleKickCount,
    triggerNeedleKick,
  } = useTransformation();

  const progressRef = useRef(transformationProgress);
  progressRef.current = transformationProgress;

  const activePillarsRef = useRef(activePillars);
  activePillarsRef.current = activePillars;

  const kickCountRef = useRef(instrumentNeedleKickCount);
  kickCountRef.current = instrumentNeedleKickCount;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // Instrument Group (Tilts with mouse)
    const instrumentGroup = new THREE.Group();
    scene.add(instrumentGroup);

    // 1. Outer Bezel Ring (Cylinder / Torus)
    const bezelGeo = new THREE.TorusGeometry(2.35, 0.14, 24, 64);
    const bezelMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xb08d57),
      metalness: 0.85,
      roughness: 0.35,
    });
    const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
    instrumentGroup.add(bezelMesh);

    // Inner glowing ring
    const innerRingGeo = new THREE.TorusGeometry(2.18, 0.03, 16, 64);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0xe8793a),
      transparent: true,
      opacity: 0.7,
    });
    const innerRingMesh = new THREE.Mesh(innerRingGeo, innerRingMat);
    instrumentGroup.add(innerRingMesh);

    // 2. Dial Face Plate (Backplate disc)
    const dialFaceGeo = new THREE.CircleGeometry(2.15, 64);
    const dialFaceMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x0e0d0a),
      roughness: 0.9,
      metalness: 0.1,
    });
    const dialFaceMesh = new THREE.Mesh(dialFaceGeo, dialFaceMat);
    dialFaceMesh.position.z = -0.05;
    instrumentGroup.add(dialFaceMesh);

    // 3. Voltmeter Arc Graduation Marks
    const arcGroup = new THREE.Group();
    instrumentGroup.add(arcGroup);

    const tickGeo = new THREE.BoxGeometry(0.04, 0.22, 0.02);
    const tickMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xb08d57) });

    const numTicks = 31;
    for (let i = 0; i < numTicks; i++) {
      const t = i / (numTicks - 1);
      const angle = (t * Math.PI * 0.75) + Math.PI * 0.125; // Arc from bottom-left to bottom-right
      const radius = 1.85;

      const tick = new THREE.Mesh(tickGeo, tickMat);
      tick.position.x = -Math.cos(angle) * radius;
      tick.position.y = Math.sin(angle) * radius - 0.2;
      tick.position.z = 0.02;
      tick.rotation.z = angle - Math.PI / 2;

      // Make major ticks slightly taller
      if (i % 5 === 0) {
        tick.scale.set(1.5, 1.4, 1);
      }
      arcGroup.add(tick);
    }

    // 4. Center Pivot & Physical Needle Assembly
    const pivotHubGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.15, 32);
    pivotHubGeo.rotateX(Math.PI / 2);
    const pivotHubMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x6f5731),
      metalness: 0.9,
      roughness: 0.25,
    });
    const pivotHub = new THREE.Mesh(pivotHubGeo, pivotHubMat);
    pivotHub.position.set(0, -0.4, 0.08);
    instrumentGroup.add(pivotHub);

    // Needle Blade
    const needlePivot = new THREE.Group();
    needlePivot.position.set(0, -0.4, 0.12);
    instrumentGroup.add(needlePivot);

    const needleGeo = new THREE.ConeGeometry(0.045, 1.95, 16);
    needleGeo.translate(0, 0.975, 0); // Origin at base
    const needleMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xe8793a),
      emissive: new THREE.Color(0x873d12),
      roughness: 0.2,
    });
    const needleMesh = new THREE.Mesh(needleGeo, needleMat);
    needlePivot.add(needleMesh);

    // 5. 4 Relay Nodes (Pillars of Change)
    const relayNodes = [];
    const relayPositions = [
      { id: 'tech', angle: Math.PI * 0.8 },
      { id: 'creative', angle: Math.PI * 0.4 },
      { id: 'sustainable', angle: -Math.PI * 0.4 },
      { id: 'cognitive', angle: -Math.PI * 0.8 },
    ];

    const nodeGeo = new THREE.SphereGeometry(0.12, 16, 16);

    relayPositions.forEach((pos) => {
      const nodeMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x6f5731),
        emissive: new THREE.Color(0x000000),
        roughness: 0.4,
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.x = Math.cos(pos.angle) * 2.1;
      nodeMesh.position.y = Math.sin(pos.angle) * 2.1;
      nodeMesh.position.z = 0.08;
      nodeMesh.userData = { id: pos.id };
      instrumentGroup.add(nodeMesh);
      relayNodes.push(nodeMesh);
    });

    // 6. Lighting
    const ambientLight = new THREE.AmbientLight(0xfff8ee, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffe8c2, 1.5);
    dirLight.position.set(3, 4, 5);
    scene.add(dirLight);

    const energyPointLight = new THREE.PointLight(0x3ce6c4, 0, 10);
    energyPointLight.position.set(0, 0, 2);
    scene.add(energyPointLight);

    // Parallax pointer tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      const px = (clientX - rect.left) / rect.width - 0.5;
      const py = (clientY - rect.top) / rect.height - 0.5;
      mouse.targetX = px * 0.28; // Max ~8 degrees
      mouse.targetY = py * 0.28;
    };

    window.addEventListener('mousemove', handlePointerMove);

    // Spring physics for needle kick on interaction
    let needleKickVelocity = 0;
    let needleKickOffset = 0;
    let lastKickCount = kickCountRef.current;

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      const p = progressRef.current;
      const activeSet = activePillarsRef.current;

      // Handle needle kick trigger
      if (kickCountRef.current !== lastKickCount) {
        lastKickCount = kickCountRef.current;
        needleKickVelocity = 1.4;
      }

      // Needle spring physics
      needleKickVelocity += -needleKickOffset * 35 * delta;
      needleKickVelocity *= Math.pow(0.88, delta * 60);
      needleKickOffset += needleKickVelocity * delta;

      // Smooth pointer parallax damping
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      instrumentGroup.rotation.y = mouse.x;
      instrumentGroup.rotation.x = -mouse.y;

      // Base needle angle driven by transformation progress: from -1.1 rad (-63°) to +1.1 rad (+63°)
      const baseNeedleAngle = -1.1 + p * 2.2;
      // Slight natural oscillation + kick offset
      const needleWobble = Math.sin(elapsed * 2.5) * 0.015;
      needlePivot.rotation.z = -(baseNeedleAngle + needleWobble + needleKickOffset);

      // Material Evolution (Vintage Brass -> Future Bioluminescent Current Teal)
      const vintageColor = new THREE.Color(0xb08d57);
      const futureTeal = new THREE.Color(0x3ce6c4);
      const voidColor = new THREE.Color(0x050608);
      const orangeColor = new THREE.Color(0xe8793a);

      // Bezel color transition
      bezelMat.color.lerpColors(vintageColor, futureTeal, p);
      bezelMat.roughness = THREE.MathUtils.lerp(0.35, 0.1, p);
      bezelMat.metalness = THREE.MathUtils.lerp(0.85, 0.3, p);

      // Inner ring glow
      innerRingMat.color.lerpColors(orangeColor, futureTeal, p);
      innerRingMat.opacity = THREE.MathUtils.lerp(0.7, 0.95, p);

      // Needle emissive glow
      needleMat.color.lerpColors(orangeColor, futureTeal, p);
      needleMat.emissive.lerpColors(new THREE.Color(0x873d12), new THREE.Color(0x1a7a68), p);

      // Update Relay Nodes
      relayNodes.forEach((node) => {
        const isActive = activeSet.has(node.userData.id);
        if (isActive) {
          node.material.color.lerp(p > 0.5 ? futureTeal : orangeColor, 0.1);
          node.material.emissive.lerp(p > 0.5 ? futureTeal : orangeColor, 0.1);
          node.scale.setScalar(1.15 + Math.sin(elapsed * 4) * 0.08);
        } else {
          node.material.color.lerp(new THREE.Color(0x3a3020), 0.1);
          node.material.emissive.lerp(new THREE.Color(0x000000), 0.1);
          node.scale.setScalar(1.0);
        }
      });

      // Energy point light
      energyPointLight.intensity = p * 2.5;

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
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
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      bezelGeo.dispose();
      bezelMat.dispose();
      dialFaceGeo.dispose();
      dialFaceMat.dispose();
      tickGeo.dispose();
      tickMat.dispose();
      pivotHubGeo.dispose();
      pivotHubMat.dispose();
      needleGeo.dispose();
      needleMat.dispose();
      nodeGeo.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      onClick={triggerNeedleKick}
      title="Click to kick the instrument needle"
      className="relative w-full h-[360px] sm:h-[440px] md:h-[480px] flex items-center justify-center cursor-pointer select-none"
    >
      {/* Visual interaction badge hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded bg-patina-black/70 border border-brass/30 backdrop-blur-sm text-[10px] font-mono tracking-widest text-brass/80 flex items-center gap-1.5 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-filament-orange animate-ping" />
        <span>CLICK TO LATCH RELAYS // TILT TO PARALLAX</span>
      </div>
    </div>
  );
};
