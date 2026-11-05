import { Link } from 'react-router-dom';
import { ArrowRight, Globe2, MapPin, Package, Ship } from 'lucide-react';
import { LiquidWave } from '@/components/ui/LiquidWave';
import { Reveal } from '@/components/ui/Reveal';
import { COMPANY } from '@/lib/company';
import { GLOBAL_REGIONS } from '@/lib/services-data';

const HERO_PHOTO = '/images/hero.jpg';

const STATS = [
  { icon: Globe2, value: `${GLOBAL_REGIONS.length}`, label: 'Regions Served' },
  { icon: Ship, value: '4', label: 'Service Groups' },
  { icon: Package, value: '6', label: 'Product Categories' },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="liquid-blob -left-32 top-24 h-[30rem] w-[30rem] bg-gold-100" />
        <div className="liquid-blob -right-24 top-0 h-[26rem] w-[26rem] bg-gold-200/60" style={{ animationDelay: '-5s' }} />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-40 pt-14 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:pt-20">
        <div className="lg:col-span-6">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-300 bg-gold-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-gold-800">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold-500" />
              Trade, Sourcing &amp; Logistics
            </span>
            <h1 className="mt-7 text-5xl font-semibold leading-[1.02] text-ink-900 sm:text-6xl xl:text-7xl">
              Trade That <span className="text-gold-shimmer">Reaches Every Continent</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-600">
              We connect you with trusted suppliers and deliver end-to-end logistics, travel and immigration support, and
              quality goods, all managed by one partner wherever your business operates.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/shop"
                className="liquid-fill inline-flex items-center gap-2 rounded-full bg-ink-900 px-8 py-4 text-sm font-semibold text-white shadow-soft transition hover:shadow-gold"
              >
                <span className="relative z-10 inline-flex items-center gap-2">
                  Shop now
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
              <Link
                to="/services"
                className="liquid-fill inline-flex items-center gap-2 rounded-full border border-gold-400 bg-white px-8 py-4 text-sm font-semibold text-ink-900"
              >
                <span className="relative z-10">Explore services</span>
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href="#nairobi-hub"
                className="inline-flex items-center gap-2 rounded-full border border-gold-300 bg-gold-50 px-4 py-2 text-sm font-semibold text-ink-900 transition hover:border-gold-500 hover:bg-gold-100"
              >
                <MapPin className="h-4 w-4 text-gold-700" />
                Visit us: {COMPANY.hub.address}
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={150} className="lg:col-span-6">
          <div className="relative mx-auto w-full max-w-xl">
            <div className="gold-ring animate-spin-slow absolute -inset-4 rounded-[3rem] opacity-60 blur-[2px]" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-ink-900 shadow-gold sm:aspect-[5/4]">
              <img src={HERO_PHOTO} alt="Aerial view of a container port at sunset" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/45 via-transparent to-transparent" />
            </div>

            <div className="absolute -bottom-8 -left-4 flex h-32 w-32 items-center justify-center rounded-full bg-white p-4 shadow-gold animate-float sm:-left-8">
              <img src="/images/logo.webp" alt={`${COMPANY.name} logo`} width={377} height={256} className="h-full w-full object-contain" />
            </div>

            <div className="absolute -right-3 top-8 rounded-2xl border border-gold-200 bg-white/95 px-5 py-4 shadow-gold backdrop-blur sm:-right-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-700">From the shop</p>
              <p className="mt-1 font-display text-xl font-semibold text-ink-900">Quality goods, shipped worldwide</p>
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal delay={200} className="relative mx-auto -mt-28 max-w-5xl px-5 sm:px-8">
        <ul className="grid gap-4 rounded-[2rem] border border-gold-200 bg-white/90 p-4 shadow-gold backdrop-blur-xl sm:grid-cols-3">
          {STATS.map(({ icon: Icon, value, label }) => (
            <li key={label} className="flex items-center gap-4 rounded-2xl px-5 py-4 transition hover:bg-gold-50">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold-400 text-ink-900">
                <Icon className="h-6 w-6" />
              </span>
              <div>
                <p className="font-display text-3xl font-semibold leading-none text-ink-900">{value}</p>
                <p className="mt-1 text-sm text-ink-500">{label}</p>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>

      <LiquidWave gradientId="hero-wave" className="bottom-0 h-40" />
    </section>
  );
}
