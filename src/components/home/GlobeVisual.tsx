import { useEffect, useRef, useState } from 'react';
import {
  AdditiveBlending,
  AmbientLight,
  BackSide,
  Color,
  DirectionalLight,
  Group,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  SRGBColorSpace,
  TextureLoader,
  Vector3,
  WebGLRenderer,
} from 'three';

interface Marker {
  name: string;
  lat: number;
  lon: number;
}

const MARKERS: Marker[] = [
  { name: 'Africa', lat: 5, lon: 20 },
  { name: 'Europe', lat: 50, lon: 10 },
  { name: 'Asia', lat: 35, lon: 100 },
  { name: 'North America', lat: 40, lon: -100 },
  { name: 'South America', lat: -15, lon: -60 },
  { name: 'Australia', lat: -25, lon: 135 },
];

const TILT_DEG = 12;
const START_LON = 20;
const DEGREES_PER_SEC = 9;
const rad = (deg: number) => (deg * Math.PI) / 180;

function latLonToVector(lat: number, lon: number, radius = 1): Vector3 {
  const phi = rad(90 - lat);
  const theta = rad(lon + 180);
  return new Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

export function GlobeVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const markerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch {
      setFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = SRGBColorSpace;

    const scene = new Scene();
    const camera = new PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    const tilt = new Group();
    tilt.rotation.x = rad(TILT_DEG);
    const spin = new Group();
    spin.rotation.y = rad(-START_LON - 90);
    tilt.add(spin);
    scene.add(tilt);

    const loader = new TextureLoader();
    const dayMap = loader.load('/textures/earth-day.jpg');
    dayMap.colorSpace = SRGBColorSpace;
    dayMap.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const bumpMap = loader.load('/textures/earth-bump.jpg');

    const earthGeometry = new SphereGeometry(1, 96, 96);
    const earthMaterial = new MeshPhongMaterial({
      map: dayMap,
      bumpMap,
      bumpScale: 0.03,
      specular: new Color('#443a22'),
      shininess: 8,
    });
    const earth = new Mesh(earthGeometry, earthMaterial);
    spin.add(earth);

    const atmosphereGeometry = new SphereGeometry(1.14, 64, 64);
    const atmosphereMaterial = new ShaderMaterial({
      transparent: true,
      side: BackSide,
      blending: AdditiveBlending,
      depthWrite: false,
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
          gl_FragColor = vec4(1.0, 0.82, 0.42, 1.0) * intensity;
        }
      `,
    });
    const atmosphere = new Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    scene.add(new AmbientLight(0xffffff, 0.75));
    const sun = new DirectionalLight(0xfff3d6, 2.1);
    sun.position.set(-3, 2, 5);
    scene.add(sun);

    const markerVectors = MARKERS.map((marker) => latLonToVector(marker.lat, marker.lon, 1.005));

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let visible = true;
    let frame = 0;
    let last = performance.now();

    const resize = () => {
      const size = container.clientWidth;
      renderer.setSize(size, size, false);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) last = performance.now();
    });
    observer.observe(container);

    const world = new Vector3();
    const normal = new Vector3();
    const toCamera = new Vector3();

    const render = (now: number) => {
      frame = requestAnimationFrame(render);
      if (!visible) return;
      const elapsed = (now - last) / 1000;
      last = now;
      if (!reduceMotion) spin.rotation.y += rad(DEGREES_PER_SEC) * elapsed;

      tilt.updateMatrixWorld(true);
      renderer.render(scene, camera);

      markerVectors.forEach((vector, index) => {
        const el = markerRefs.current[index];
        if (!el) return;
        world.copy(vector).applyMatrix4(spin.matrixWorld);
        normal.copy(world).normalize();
        toCamera.copy(camera.position).sub(world).normalize();
        const facing = normal.dot(toCamera);
        const projected = world.clone().project(camera);
        el.style.left = `${(projected.x * 0.5 + 0.5) * 100}%`;
        el.style.top = `${(-projected.y * 0.5 + 0.5) * 100}%`;
        el.style.opacity = facing > 0.12 ? '1' : '0';
      });
    };
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      earthGeometry.dispose();
      earthMaterial.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      dayMap.dispose();
      bumpMap.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative aspect-square w-full max-w-md sm:max-w-lg">
      <div className="absolute -inset-10 rounded-full bg-gold-300/30 blur-3xl" />
      {failed ? (
        <div
          className="absolute inset-[9%] rounded-full shadow-gold"
          style={{ background: 'url(/textures/earth-day.jpg) 55% 50% / 300% 100%' }}
        />
      ) : (
        <>
          <canvas ref={canvasRef} className="relative h-full w-full" aria-hidden="true" />
          {MARKERS.map((marker, index) => (
            <div
              key={marker.name}
              ref={(el) => {
                markerRefs.current[index] = el;
              }}
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300"
            >
              <span className="relative flex h-3.5 w-3.5 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80" />
                <span className="relative h-3 w-3 rounded-full bg-white ring-2 ring-ink-900/70" />
              </span>
              <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink-900 px-3 py-1 text-xs font-semibold text-white shadow-soft">
                {marker.name}
              </span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
