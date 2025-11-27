import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export function Boardroom3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 5, 15);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Controls (subtle rotation)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.2;

    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Point Light (golden aura)
    const pointLight = new THREE.PointLight(0xffd700, 2, 100);
    pointLight.position.set(0, 10, 10);
    scene.add(pointLight);

    // Holographic Table (torus)
    const geometry = new THREE.TorusGeometry(5, 0.2, 16, 100);
    const material = new THREE.MeshStandardMaterial({
      color: 0xa96eff,
      emissive: 0x7a1dff,
      emissiveIntensity: 0.7,
      transparent: true,
      opacity: 0.5,
    });
    const table = new THREE.Mesh(geometry, material);
    table.rotation.x = Math.PI / 2;
    scene.add(table);

    // Glyph Rings
    const rings: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.RingGeometry(6 + i * 0.7, 6.3 + i * 0.7, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xff9aff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);
      rings.push(ring);
    }

    // Particle Dust
    const particleCount = 400;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 50;
    }
    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      transparent: true,
      opacity: 0.6,
    });
    const particleSystem = new THREE.Points(particles, particleMat);
    scene.add(particleSystem);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      rings.forEach((r, i) => (r.rotation.z += 0.001 + i * 0.0005));
      particleSystem.rotation.y += 0.0005;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-screen" data-testid="boardroom-3d">
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute top-0 left-0 right-0 pointer-events-none">
        <div className="text-center pt-20 px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-purple-400" style={{
            textShadow: "0 0 20px #7a1dff, 0 0 40px #ff9aff"
          }}>
            UnityPay Boardroom
          </h1>
          <h3 className="text-lg md:text-xl text-purple-300 italic mt-4">
            Witness the AI Superbrain in motion… only the worthy may interact.
          </h3>
          <p className="text-purple-400 italic mt-6">
            Observe… but none may enter. The Superbrain sees all.
          </p>
        </div>
      </div>
    </div>
  );
}
