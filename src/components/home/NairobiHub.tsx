import { Building2, Globe2, MapPin, Navigation } from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { Reveal } from '@/components/ui/Reveal';
import { COMPANY } from '@/lib/company';

export function NairobiHub() {
  const { hub } = COMPANY;

  return (
    <section id="nairobi-hub" className="relative scroll-mt-24 overflow-hidden bg-white py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="liquid-blob -right-32 top-10 h-[28rem] w-[28rem] bg-gold-100" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Visit us in person</p>
          <h2 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
            Our <span className="text-gold-shimmer">Nairobi Hub</span> in Westlands
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-600">
            Meet our team face-to-face at {hub.address}. Come in to discuss sourcing, shipping, travel and
            immigration support.
          </p>
        </Reveal>

        <Reveal delay={100} className="mt-14">
          <div className="grid overflow-hidden rounded-[2.5rem] border border-gold-200 bg-white shadow-gold lg:grid-cols-12">
            <div className="relative flex flex-col justify-between gap-8 bg-ink-900 p-8 text-white sm:p-10 lg:col-span-5">
              <div className="liquid-blob -left-20 -top-24 h-64 w-64 bg-gold-500/30" />
              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full bg-gold-400 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-ink-900">
                  <MapPin className="h-3.5 w-3.5" />
                  Physical location
                </span>

                <h3 className="mt-6 font-display text-4xl font-semibold leading-tight">{hub.building}</h3>
                <p className="mt-2 text-xl text-gold-200">
                  {hub.area}, {hub.city}
                </p>

                <ul className="mt-8 space-y-4 text-sm text-ink-200">
                  <li className="flex items-start gap-3">
                    <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-gold-300" />
                    <span>
                      <span className="block font-semibold text-white">{hub.name}</span>
                      {hub.building}, {hub.area}, {hub.city}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Globe2 className="mt-0.5 h-5 w-5 shrink-0 text-gold-300" />
                    <span>
                      <span className="block font-semibold text-white">Headquarters</span>
                      {COMPANY.headquarters}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <WhatsAppIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold-300" />
                    <a
                      href={COMPANY.whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition hover:text-gold-300"
                    >
                      <span className="block font-semibold text-white">WhatsApp</span>
                      Message us anytime
                    </a>
                  </li>
                </ul>
              </div>

              <div className="relative flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <a
                  href={hub.directionsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gold-400 px-6 py-3.5 text-sm font-semibold text-ink-900 transition hover:bg-gold-300"
                >
                  <Navigation className="h-4 w-4" />
                  Get directions
                </a>
                <a
                  href={hub.mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-gold-300/60 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-gold-300 hover:bg-white/5"
                >
                  <MapPin className="h-4 w-4" />
                  Open in Google Maps
                </a>
              </div>
            </div>

            <div className="relative min-h-[22rem] lg:col-span-7 lg:min-h-[32rem]">
              <iframe
                title={`Map of ${hub.address}`}
                src={hub.mapEmbedSrc}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full bg-ink-900 px-4 py-2 text-xs font-semibold text-white shadow-soft sm:left-6 sm:top-6">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-300" />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-gold-400" />
                </span>
                {hub.name} &middot; {hub.building}, {hub.area}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
