"use client";

import { useEffect, useRef, useCallback, useMemo } from "react";
import * as THREE from "three";

/* =========================
   ORIGINAL TreasureStage (kept same visuals/logic)
   ========================= */
function TreasureStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const chestRef = useRef<THREE.Group | null>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const prevSizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  const getScaleAndPosition = useCallback((w: number, _h: number) => {
    const isMobile = w < 768;
    const scale = isMobile ? 0.22 : 0.28;
    const y = isMobile ? -1.2 : -2.6;
    return { scale, y };
  }, []);

  const setup = useCallback(async () => {
    if (!canvasRef.current) return null;

    const el = canvasRef.current.parentElement!;
    const width = el.clientWidth;
    const height = el.clientHeight;
    prevSizeRef.current = { w: width, h: height };

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, 13);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });

    const dprCap = width < 480 ? 1.25 : width < 768 ? 1.5 : 2;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, dprCap));
    renderer.setSize(width, height, false);
    renderer.setClearColor(0x000000, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const dir = new THREE.DirectionalLight(0xffffff, 1.25);
    dir.position.set(6, 10, 8);
    scene.add(dir);
    const rim = new THREE.PointLight(0xffd700, 0.6, 30);
    rim.position.set(-6, 4, -4);
    scene.add(rim);

    const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
    const loader = new GLTFLoader();

    await new Promise<void>((resolve) => {
      loader.load(
        "/models/treasure.glb",
        (gltf) => {
          const chest = gltf.scene;
          chest.traverse((child) => {
            if (
              child instanceof THREE.Mesh &&
              child.material instanceof THREE.MeshStandardMaterial
            ) {
              const m = child.material;
              m.metalness = Math.min(0.8, (m.metalness ?? 0.5) * 1.1);
              m.roughness = Math.max(0.15, (m.roughness ?? 0.5) * 0.9);
              m.envMapIntensity = 1.2;
            }
          });
          const { scale, y } = getScaleAndPosition(width, height);
          chest.scale.setScalar(scale);
          chest.position.set(0, y, 0);
          scene.add(chest);
          chestRef.current = chest;
          resolve();
        },
        undefined,
        () => resolve()
      );
    });

    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    startRef.current = null;
    return { renderer, camera };
  }, [getScaleAndPosition]);

  const animate = useCallback((now: number) => {
    if (!sceneRef.current || !rendererRef.current || !cameraRef.current) return;
    if (startRef.current == null) startRef.current = now;
    const t = (now - startRef.current) / 1000;

    if (chestRef.current) {
      chestRef.current.rotation.y = t * 0.25;
      chestRef.current.position.y += Math.sin(t * 1.1) * 0.0025;
    }

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  // Ignore tiny mobile UI-driven resizes (URL bar show/hide)
  const onResize = useCallback(() => {
    if (!rendererRef.current || !cameraRef.current || !chestRef.current || !canvasRef.current)
      return;
    const el = canvasRef.current.parentElement!;
    const w = el.clientWidth;
    const h = el.clientHeight;

    const prev = prevSizeRef.current;
    const deltaW = Math.abs(w - prev.w);
    const deltaH = Math.abs(h - prev.h);

    // Only re-layout if orientation or significant change (>80px) or width changes
    if (deltaW === 0 && deltaH < 80) return;

    prevSizeRef.current = { w, h };
    rendererRef.current.setSize(w, h, false);
    cameraRef.current.aspect = w / h;
    cameraRef.current.updateProjectionMatrix();

    const { scale, y } = getScaleAndPosition(w, h);
    chestRef.current.scale.setScalar(scale);
    chestRef.current.position.set(0, y, 0);
  }, [getScaleAndPosition]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      const data = await setup();
      if (data) rafRef.current = requestAnimationFrame(animate);
    })();

    const handle = () => onResize();
    window.addEventListener("resize", handle, { passive: true });
    // Also listen to orientation changes explicitly
    window.addEventListener("orientationchange", handle, { passive: true });

    return () => {
      mounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handle);
      window.removeEventListener("orientationchange", handle);
      sceneRef.current?.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (mat) (Array.isArray(mat) ? mat : [mat]).forEach((m) => m.dispose());
      });
      rendererRef.current?.dispose();
    };
  }, [setup, animate, onResize]);

  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <canvas
        ref={canvasRef}
        className="w-full h-full pointer-events-none select-none [transform:translateZ(0)]"
      />
    </div>
  );
}

/* =========================
   FIXED Keys & Coins Overlay (same visuals; smarter resize)
   ========================= */
function KeysCoinsOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const prevSizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  // explicit refs to the two system groups
  const keysSystemRef = useRef<THREE.Group | null>(null);
  const coinsSystemRef = useRef<THREE.Group | null>(null);

  type ObjCfg = { radius: number; speed: number; angle: number; height: number };
  type UD = { cfg: ObjCfg; offset: number; speedEff: number };
  type UDObject3D = THREE.Object3D & { userData: UD };

  const keysCfg = useMemo<ObjCfg[]>(
    () => [
      { radius: 5, speed: 0.3, angle: 0.0, height: 1.0 },
      { radius: 5, speed: 0.3, angle: Math.PI / 3, height: 0.5 },
      { radius: 5, speed: 0.3, angle: (2 * Math.PI) / 3, height: 1.5 },
      { radius: 7, speed: 0.2, angle: 0.0, height: 2.0 },
      { radius: 6, speed: 0.25, angle: Math.PI / 6, height: 0.7 },
      { radius: 8, speed: 0.15, angle: Math.PI / 4, height: 2.5 },
      { radius: 7, speed: 0.2, angle: Math.PI, height: 1.8 },
      { radius: 6, speed: 0.25, angle: (7 * Math.PI) / 6, height: 1.0 },
    ],
    []
  );

  const coinsCfg = useMemo<ObjCfg[]>(
    () => [
      { radius: 4.0, speed: 0.4, angle: 0.2, height: 0.5 },
      { radius: 6.0, speed: 0.3, angle: 1.5 * Math.PI, height: -0.2 },
      { radius: 3.5, speed: 0.5, angle: Math.PI / 4, height: 0.8 },
      { radius: 5.0, speed: 0.35, angle: 0.6 * Math.PI, height: 1.2 },
      { radius: 5.5, speed: 0.32, angle: 1.1 * Math.PI, height: 0.3 },
      { radius: 4.2, speed: 0.45, angle: 1.8 * Math.PI, height: 0.7 },
      { radius: 6.2, speed: 0.28, angle: 0.3 * Math.PI, height: -0.5 },
      { radius: 3.8, speed: 0.52, angle: 1.3 * Math.PI, height: 0.9 },
    ],
    []
  );

  const makeGoldMat = useCallback(
    (emissiveIntensity = 0.15) =>
      new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 0.95,
        roughness: 0.05,
        emissive: new THREE.Color(0xffd700),
        emissiveIntensity,
      }),
    []
  );

  const withUserData = useCallback((g: THREE.Object3D, cfg: ObjCfg) => {
    (g as unknown as UDObject3D).userData = {
      cfg,
      offset: Math.random() * Math.PI * 2,
      speedEff: Math.max(0.01, cfg.speed),
    };
  }, []);

  const createKey = useCallback(
    (cfg: ObjCfg) => {
      const g = new THREE.Group();
      withUserData(g, cfg);

      const mat = makeGoldMat(0.15);
      const head = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.12, 16, 32), mat);
      head.position.set(0, 0.8, 0);
      g.add(head);

      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.6, 16), mat);
      g.add(shaft);

      const t1 = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.12, 0.12), mat);
      t1.position.set(0.15, -0.6, 0);
      g.add(t1);

      const t2 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.12), mat);
      t2.position.set(0.15, -0.8, 0);
      g.add(t2);

      g.scale.setScalar(0.35);
      return g;
    },
    [makeGoldMat, withUserData]
  );

  const createCoin = useCallback(
    (cfg: ObjCfg) => {
      const g = new THREE.Group();
      withUserData(g, cfg);

      const mat = makeGoldMat(0.1);
      const mat2 = makeGoldMat(0.15);

      const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.06, 32), mat);
      g.add(coin);

      const detailGeom = new THREE.CylinderGeometry(0.22, 0.22, 0.005, 32);
      [0.033, -0.033].forEach((y) => {
        const d = new THREE.Mesh(detailGeom, mat2);
        d.position.y = y;
        g.add(d);
      });

      const centerGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.002, 24);
      [0.036, -0.036].forEach((y) => {
        const c = new THREE.Mesh(centerGeom, mat2);
        c.position.y = y;
        g.add(c);
      });

      const edge = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.02, 8, 32), mat2);
      edge.rotation.x = Math.PI / 2;
      g.add(edge);

      return g;
    },
    [makeGoldMat, withUserData]
  );

  const setup = useCallback(() => {
    if (!canvasRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    prevSizeRef.current = { w: width, h: height };

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 2, 13);
    camera.lookAt(0, -1, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });

    const dprCap = width < 480 ? 1.25 : width < 768 ? 1.5 : 2;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, dprCap));
    renderer.setSize(width, height, false);
    renderer.setClearColor(0x000000, 0);

    // minimal lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const dir = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(6, 10, 8);
    scene.add(dir);

    // Keys system
    const keysSystem = new THREE.Group();
    keysCfg.forEach((cfg) => keysSystem.add(createKey(cfg)));
    scene.add(keysSystem);
    keysSystemRef.current = keysSystem;

    // Coins system
    const coinsSystem = new THREE.Group();
    coinsCfg.forEach((cfg) => coinsSystem.add(createCoin(cfg)));
    scene.add(coinsSystem);
    coinsSystemRef.current = coinsSystem;

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    startRef.current = null;
  }, [keysCfg, coinsCfg, createKey, createCoin]);

  const animate = useCallback((now: number) => {
    if (!sceneRef.current || !rendererRef.current || !cameraRef.current) return;
    if (startRef.current == null) startRef.current = now;
    const t = (now - startRef.current) / 1000;

    const keysGroup = keysSystemRef.current;
    const coinsGroup = coinsSystemRef.current;

    if (keysGroup) {
      keysGroup.children.forEach((obj, i) => {
        const ud = (obj as unknown as UDObject3D).userData as UD | undefined;
        if (!ud) return;
        const { cfg, offset, speedEff } = ud;
        const tt = t * speedEff + cfg.angle + offset;
        obj.position.set(
          Math.cos(tt) * cfg.radius,
          cfg.height + Math.sin(tt * 2) * 0.3 + Math.sin(t * 2.2 + i) * 0.1,
          Math.sin(tt) * cfg.radius
        );
        obj.rotation.set(Math.sin(tt * 0.8) * 0.3, tt * 1.2, Math.cos(tt * 0.6) * 0.2);
      });
    }

    if (coinsGroup) {
      coinsGroup.children.forEach((obj, i) => {
        const ud = (obj as unknown as UDObject3D).userData as UD | undefined;
        if (!ud) return;
        const { cfg, offset, speedEff } = ud;
        const tt = t * speedEff + cfg.angle + offset;
        obj.position.set(
          Math.cos(tt) * cfg.radius,
          cfg.height + Math.sin(tt * 3) * 0.3 + Math.sin(t * 2.0 + i) * 0.1,
          Math.sin(tt) * cfg.radius
        );
        obj.rotation.set(Math.sin(tt * 0.8) * 0.6, tt * 2.5, Math.cos(tt * 0.6) * 0.2);
      });
    }

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  // Ignore tiny mobile UI-driven resizes; respond to real changes
  const onResize = useCallback(() => {
    if (!rendererRef.current || !cameraRef.current) return;

    const w = window.innerWidth;
    const h = window.innerHeight;

    const prev = prevSizeRef.current;
    const deltaW = Math.abs(w - prev.w);
    const deltaH = Math.abs(h - prev.h);

    // Only react on significant change or width changes
    if (deltaW === 0 && deltaH < 80) return;

    prevSizeRef.current = { w, h };
    rendererRef.current.setSize(w, h, false);
    cameraRef.current.aspect = w / h;
    cameraRef.current.updateProjectionMatrix();
  }, []);

  useEffect(() => {
    setup();
    rafRef.current = requestAnimationFrame(animate);

    const handle = () => onResize();
    window.addEventListener("resize", handle, { passive: true });
    window.addEventListener("orientationchange", handle, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handle);
      window.removeEventListener("orientationchange", handle);
      // dispose
      sceneRef.current?.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (mat) (Array.isArray(mat) ? mat : [mat]).forEach((m) => m.dispose());
      });
      rendererRef.current?.dispose();
    };
  }, [setup, animate, onResize]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      <canvas
        ref={canvasRef}
        className="w-full h-full pointer-events-none select-none [transform:translateZ(0)]"
      />
    </div>
  );
}

/* =========================
   PAGE (same visuals; stable height via svh)
   ========================= */
export default function HomePage() {
  return (
    <div
      className="
        relative
        h-[55svh] sm:h-[65svh] md:h-[70svh] lg:h-[60svh]
        bg-[#98afc7] text-black overflow-hidden
        overscroll-y-contain
        [touch-action:pan-y]
        max-w-full
      "
    >
      {/* Treasure Background (original) */}
      <TreasureStage />

      {/* Keys & Coins overlay on top while scrolling */}
      <KeysCoinsOverlay />

      {/* Top Center Text */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 text-center px-4">
        <div className="backdrop-blur-sm bg-black/20 rounded-2xl border border-white/10 p-6 shadow-2xl">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[0.2em] text-black"
            style={{
              textShadow: `
                0 0 6px #D4AF37,
                0 0 12px #D4AF37,
                0 0 20px #D4AF37
              `,
            }}
          >
            TREASURY
          </h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent mx-auto opacity-60" />
        </div>
      </div>

      {/* Explore Treasures Button */}
      <div className="absolute inset-x-0 bottom-8 sm:bottom-10 md:bottom-12 z-10 flex justify-center px-4">
        <a
          href="/treasures"
          className="
            inline-flex items-center justify-center
            px-6 sm:px-8 py-3 rounded-xl
            uppercase tracking-[0.25em]
            font-semibold
            bg-black/35 backdrop-blur
            border
            transition
            hover:scale-[1.02] active:scale-[0.99]
            focus:outline-none focus-visible:ring-2
          "
          style={{
            borderColor: "rgba(212,175,55,0.55)",
            boxShadow: `
              0 0 0 1px rgba(212,175,55,0.55) inset,
              0 12px 30px -12px rgba(212,175,55,0.45)
            `,
            color: "#fff",
            fontWeight: 700,
            textShadow: `
              0 1px 2px rgba(0,0,0,0.85),
              0 0 6px #D4AF37,
              0 0 12px #D4AF37,
              0 0 18px rgba(212,175,55,0.9)
            `,
            backgroundImage:
              "linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0.3))",
          }}
          aria-label="Explore Treasures"
        >
          Explore Treasures
        </a>
      </div>
    </div>
  );
}
