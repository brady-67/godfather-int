import { Link } from 'react-router-dom';
import { ArrowUpRight, Banknote, Compass, Plane, Ship, type LucideIcon } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { SERVICE_CATEGORIES } from '@/lib/services-data';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'travel-immigration': Plane,
  'supply-chain': Ship,
  'business-financial': Banknote,
  'experience-hospitality': Compass,
};

export function ServicesPreview() {
  return (
    <section className="relative overflow-hidden bg-ink-900 py-24 text-white">
      <div className="liquid-blob -right-32 top-0 h-[28rem] w-[28rem] bg-gold-500/20" />
      <div className="liquid-blob -left-24 bottom-0 h-96 w-96 bg-ocean-500/20" style={{ animationDelay: '-7s' }} />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-300">Our Services</p>
          <h2 className="mt-5 text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Everything your international operations need
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-200">
            Travel, sourcing, logistics, legal and financial support, and hospitality, delivered by one trusted partner.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICE_CATEGORIES.map((category, index) => {
            const Icon = CATEGORY_ICONS[category.id];
            return (
              <Reveal key={category.id} delay={index * 90}>
                <Link
                  to={`/services#${category.id}`}
                  className="group relative flex h-full flex-col gap-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur transition duration-500 hover:-translate-y-1 hover:border-gold-400/60 hover:bg-white/[0.08]"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-400/15 text-gold-300 ring-1 ring-gold-400/40 transition group-hover:bg-gold-400 group-hover:text-ink-900">
                    <Icon className="h-7 w-7" />
                  </span>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-semibold text-white">{category.eyebrow}</h3>
                    <p className="text-sm leading-relaxed text-ink-200">
                      {category.services.length} service{category.services.length > 1 ? 's' : ''} tailored to your
                      business.
                    </p>
                  </div>
                  <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-gold-300">
                    Explore
                    <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
