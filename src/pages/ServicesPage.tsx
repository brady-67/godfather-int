import { ContactCta } from '@/components/home/ContactCta';
import { LiquidWave } from '@/components/ui/LiquidWave';
import { Reveal } from '@/components/ui/Reveal';
import { SERVICE_CATEGORIES } from '@/lib/services-data';

export function ServicesPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-gold-50 via-white to-white">
        <div className="liquid-blob -left-24 top-10 h-96 w-96 bg-gold-200/60" />
        <div className="liquid-blob -right-20 top-0 h-[28rem] w-[28rem] bg-gold-300/40" style={{ animationDelay: '-6s' }} />
        <div className="relative mx-auto max-w-4xl px-5 pb-20 pt-20 text-center sm:px-8 lg:pt-28">
          <Reveal>
            <p className="eyebrow">Our Services</p>
            <h1 className="mt-5 text-5xl font-semibold leading-[1.1] sm:text-6xl">
              Full-service support for <span className="text-gold-shimmer">global business</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-600">
              From travel and immigration to sourcing, logistics, finance and hospitality, we handle the details so you can
              focus on growth.
            </p>
            <nav className="mt-10 flex flex-wrap justify-center gap-3" aria-label="Service groups">
              {SERVICE_CATEGORIES.map((category) => (
                <a
                  key={category.id}
                  href={`#${category.id}`}
                  className="rounded-full border border-ink-200 bg-white px-5 py-2.5 text-sm font-medium text-ink-700 transition hover:border-gold-400 hover:text-ink-900"
                >
                  {category.eyebrow}
                </a>
              ))}
            </nav>
          </Reveal>
        </div>
        <LiquidWave gradientId="services-wave" className="bottom-0 h-20" />
      </section>

      <div className="mx-auto max-w-7xl space-y-28 px-5 py-24 sm:px-8">
        {SERVICE_CATEGORIES.map((category, categoryIndex) => (
          <section key={category.id} id={category.id} className="scroll-mt-28">
            <Reveal className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
              <div>
                <p className="eyebrow">{category.eyebrow}</p>
                <h2 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">{category.title}</h2>
                <p className="mt-5 text-lg leading-relaxed text-ink-600">{category.intro}</p>
              </div>
            </Reveal>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {category.services.map((service, serviceIndex) => {
                const Icon = service.icon;
                return (
                  <Reveal key={service.title} delay={serviceIndex * 60}>
                    <article className="liquid-card group h-full rounded-3xl border border-gold-100 bg-white p-7 shadow-sm">
                      <div className="relative z-10 flex h-full flex-col gap-5">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-50 text-gold-700 ring-1 ring-gold-200 transition group-hover:bg-gold-400 group-hover:text-ink-900">
                          <Icon className="h-6 w-6" />
                        </span>
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold text-ink-900">{service.title}</h3>
                          <p className="text-sm leading-relaxed text-ink-600">{service.description}</p>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
            {categoryIndex < SERVICE_CATEGORIES.length - 1 && <div className="mt-28 h-px bg-gradient-to-r from-transparent via-gold-300 to-transparent" />}
          </section>
        ))}
      </div>

      <ContactCta />
    </div>
  );
}
