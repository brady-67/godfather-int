import { lazy, Suspense } from 'react';
import { Reveal } from '@/components/ui/Reveal';
import { GLOBAL_REGIONS } from '@/lib/services-data';

const GlobeVisual = lazy(() => import('@/components/home/GlobeVisual').then((m) => ({ default: m.GlobeVisual })));

export function GlobalCoverage() {
  return (
    <section className="relative overflow-hidden bg-gold-50/50 py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Global Coverage</p>
          <h2 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
            Serving clients on <span className="text-gold-shimmer">every continent</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-600">
            Wherever your business grows, our network follows. From sourcing hubs to final delivery, we support clients
            across seven regions of the world.
          </p>
        </Reveal>

        <Reveal delay={100} className="mt-16 flex justify-center">
          <Suspense fallback={<div className="aspect-square w-full max-w-md sm:max-w-lg" />}>
            <GlobeVisual />
          </Suspense>
        </Reveal>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {GLOBAL_REGIONS.map((region, index) => {
            const Icon = region.icon;
            return (
              <Reveal key={region.name} delay={index * 60}>
                <div className="liquid-card h-full rounded-3xl border border-gold-100 bg-white p-6 shadow-sm">
                  <div className="relative z-10 flex h-full flex-col gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-50 text-gold-700 ring-1 ring-gold-200">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="text-2xl font-semibold text-ink-900">{region.name}</h3>
                    <p className="text-sm leading-relaxed text-ink-600">{region.note}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      <div className="mt-20 overflow-hidden border-y border-gold-200 bg-white py-5">
        <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
          {[...GLOBAL_REGIONS, ...GLOBAL_REGIONS].map((region, index) => (
            <span key={`${region.name}-${index}`} className="flex items-center gap-10">
              <span className="font-display text-3xl font-semibold text-ink-800">{region.name}</span>
              <span className="h-2 w-2 rotate-45 bg-gold-400" aria-hidden="true" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
