import { useEffect, useState } from 'react';

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
  { name: 'Antarctica & Arctic', lat: -78, lon: 0 },
];

const TILT_LAT = 12;
const RADIUS = 48;
const DEGREES_PER_MS = 0.009;
const GRATICULE_STEP = 3;

interface Point {
  x: number;
  y: number;
  visible: boolean;
}

const rad = (deg: number) => (deg * Math.PI) / 180;

function project(lat: number, lon: number, centerLon: number): Point {
  const phi = rad(lat);
  const lambda = rad(lon - centerLon);
  const phi0 = rad(TILT_LAT);
  const x = Math.cos(phi) * Math.sin(lambda);
  const y = Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * Math.cos(phi) * Math.cos(lambda);
  const z = Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * Math.cos(phi) * Math.cos(lambda);
  return { x, y, visible: z >= 0 };
}

function buildPath(points: Point[]): string {
  let path = '';
  let drawing = false;
  for (const point of points) {
    if (!point.visible) {
      drawing = false;
      continue;
    }
    const px = (50 + RADIUS * point.x).toFixed(2);
    const py = (50 - RADIUS * point.y).toFixed(2);
    path += `${drawing ? 'L' : 'M'}${px} ${py} `;
    drawing = true;
  }
  return path;
}

function buildGraticule(centerLon: number): string {
  const meridians = [];
  for (let lon = -180; lon < 180; lon += 30) {
    const points: Point[] = [];
    for (let lat = -90; lat <= 90; lat += GRATICULE_STEP) points.push(project(lat, lon, centerLon));
    meridians.push(buildPath(points));
  }
  const parallels = [];
  for (let lat = -60; lat <= 60; lat += 30) {
    const points: Point[] = [];
    for (let lon = -180; lon <= 180; lon += GRATICULE_STEP) points.push(project(lat, lon, centerLon));
    parallels.push(buildPath(points));
  }
  return [...meridians, ...parallels].join(' ');
}

export function GlobeVisual() {
  const [centerLon, setCenterLon] = useState(20);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const elapsed = now - last;
      last = now;
      setCenterLon((lon) => (lon + elapsed * DEGREES_PER_MS) % 360);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const graticule = buildGraticule(centerLon);

  return (
    <div className="relative aspect-square w-full max-w-md sm:max-w-lg">
      <div className="absolute -inset-10 rounded-full bg-gold-300/30 blur-3xl" />
      <div
        className="relative h-full w-full overflow-hidden rounded-full shadow-gold"
        style={{
          background:
            'radial-gradient(circle at 32% 28%, #fffbeb 0%, #f5d78a 22%, #d4a72c 55%, #8a6119 88%, #5c3f10 100%)',
        }}
      >
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <path d={graticule} fill="none" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="0.18" />
        </svg>
        <div
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{ background: 'radial-gradient(circle at 50% 50%, transparent 60%, rgba(92,63,16,0.45) 100%)' }}
        />
      </div>

      {MARKERS.map((marker) => {
        const point = project(marker.lat, marker.lon, centerLon);
        return (
          <div
            key={marker.name}
            className={`absolute -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${
              point.visible ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            style={{ left: `${50 + RADIUS * point.x}%`, top: `${50 - RADIUS * point.y}%` }}
          >
            <span className="relative flex h-3.5 w-3.5 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80" />
              <span className="relative h-3 w-3 rounded-full bg-white ring-2 ring-ink-900/70" />
            </span>
            <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink-900 px-3 py-1 text-xs font-semibold text-white shadow-soft">
              {marker.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
