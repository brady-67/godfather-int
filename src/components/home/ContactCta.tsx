import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Phone } from 'lucide-react';
import { LiquidWave } from '@/components/ui/LiquidWave';
import { Reveal } from '@/components/ui/Reveal';
import { COMPANY } from '@/lib/company';

export function ContactCta() {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-ink-900 px-8 py-16 text-center shadow-soft sm:px-16">
            <div className="liquid-blob -left-20 -top-24 h-72 w-72 bg-gold-500/30" />
            <div className="liquid-blob -bottom-24 -right-16 h-80 w-80 bg-gold-400/20" style={{ animationDelay: '-8s' }} />
            <LiquidWave gradientId="cta-wave" className="bottom-0 h-24 opacity-70" />

            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-300">Let us help</p>
              <h2 className="mt-5 text-4xl font-semibold leading-tight text-white sm:text-5xl">
                Ready to Transform Your Business?
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-200">
                Let {COMPANY.name} guide you through the complexities of international commerce. Our expertise, local
                networks, and commitment to excellence ensure your success.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href={COMPANY.phoneHref}
                  className="liquid-fill inline-flex items-center gap-2 rounded-full bg-gold-400 px-7 py-4 text-sm font-semibold text-ink-900"
                >
                  <span className="relative z-10 inline-flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Call {COMPANY.phoneDisplay}
                  </span>
                </a>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 rounded-full border border-gold-300/60 px-7 py-4 text-sm font-semibold text-white transition hover:border-gold-300 hover:bg-white/5"
                >
                  Explore our services
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <a
                href={COMPANY.hub.mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-gold-200 transition hover:text-gold-300"
              >
                <MapPin className="h-4 w-4" />
                Visit us: {COMPANY.hub.name}, {COMPANY.hub.short}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
