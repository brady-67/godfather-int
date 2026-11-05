import { Globe2, ShieldCheck, Handshake } from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { ContactCta } from '@/components/home/ContactCta';
import { LiquidWave } from '@/components/ui/LiquidWave';
import { Reveal } from '@/components/ui/Reveal';
import { COMPANY } from '@/lib/company';
import { usePageMeta } from '@/hooks/usePageMeta';

const PILLARS = [
  {
    icon: Globe2,
    title: 'Global reach',
    text: 'Clients and partners across six regions, connected through a network built for international trade.',
  },
  {
    icon: Handshake,
    title: 'End-to-end support',
    text: 'From travel and immigration to sourcing, shipping and finance, one team manages the full journey.',
  },
  {
    icon: ShieldCheck,
    title: 'Trusted process',
    text: 'Clear terms, careful quality checks and secure payments at every stage of your engagement.',
  },
];

export function AboutPage() {
  usePageMeta({ title: 'About Us', description: 'Godfather International Trading LLC connects businesses and individuals with goods, services and networks across six regions, with a hub in Nairobi and headquarters in Guangzhou.' });
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-gold-50 via-white to-white">
        <div className="liquid-blob -right-24 top-0 h-[26rem] w-[26rem] bg-gold-200/60" />
        <div className="relative mx-auto max-w-4xl px-5 pb-20 pt-20 text-center sm:px-8 lg:pt-28">
          <Reveal>
            <p className="eyebrow">About Us</p>
            <h1 className="mt-5 text-5xl font-semibold leading-[1.1] sm:text-6xl">
              A trading partner that works <span className="text-gold-shimmer">across borders</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-600">
              {COMPANY.name} connects businesses and individuals with the goods, services and networks they need to operate
              anywhere in the world.
            </p>
          </Reveal>
        </div>
        <LiquidWave gradientId="about-wave" className="bottom-0 h-20" />
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {PILLARS.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <Reveal key={pillar.title} delay={index * 100}>
                <div className="liquid-card h-full rounded-3xl border border-gold-100 bg-white p-8 shadow-sm">
                  <div className="relative z-10 space-y-4">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-400 text-ink-900 shadow-gold">
                      <Icon className="h-7 w-7" />
                    </span>
                    <h2 className="text-2xl font-semibold text-ink-900">{pillar.title}</h2>
                    <p className="leading-relaxed text-ink-600">{pillar.text}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-20 flex flex-col items-center gap-6 rounded-[2.5rem] border border-gold-200 bg-gold-50/60 p-10 text-center sm:p-14">
          <h2 className="text-3xl font-semibold text-ink-900 sm:text-4xl">Talk to our team</h2>
          <p className="max-w-xl text-ink-600">Message us on WhatsApp to discuss your project, shipment or travel needs.</p>
          <a
            href={COMPANY.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full bg-[#25D366] px-7 py-4 text-base font-semibold text-white transition hover:brightness-95"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Chat on WhatsApp
          </a>
        </Reveal>
      </section>

      <ContactCta />
    </div>
  );
}
