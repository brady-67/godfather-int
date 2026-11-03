import { Link } from 'react-router-dom';
import { Globe, MapPin } from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { COMPANY } from '@/lib/company';

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-gold-200 bg-gold-50/60">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-5">
          <img src="/images/image.png" alt={COMPANY.name} className="h-16 w-auto" />
          <p className="max-w-xs text-sm leading-relaxed text-ink-600">
            Global sourcing, logistics, travel and immigration support, and a curated shop of quality goods for
            clients on every continent.
          </p>
        </div>

        <div>
          <h3 className="mb-5 text-lg font-semibold">Explore</h3>
          <ul className="space-y-3 text-sm">
            {[
              { to: '/', label: 'Home' },
              { to: '/services', label: 'Services' },
              { to: '/shop', label: 'Shop' },
              { to: '/track', label: 'Track Order' },
              { to: '/about', label: 'About' },
            ].map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-ink-600 transition hover:text-gold-700">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-5 text-lg font-semibold">Contact</h3>
          <ul className="space-y-4 text-sm text-ink-600">
            <li>
              <a
                href={COMPANY.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 font-semibold text-ink-900 hover:text-gold-700"
              >
                <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                Chat with us on WhatsApp
              </a>
            </li>
            <li>
              <a
                href={COMPANY.hub.mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 transition hover:text-gold-700"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-700" />
                <span>
                  <span className="block font-semibold text-ink-900">{COMPANY.hub.name}</span>
                  {COMPANY.hub.building}, {COMPANY.hub.area}, {COMPANY.hub.city}
                </span>
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Globe className="mt-0.5 h-4 w-4 shrink-0 text-gold-700" />
              <span>
                <span className="block font-semibold text-ink-900">Headquarters</span>
                {COMPANY.headquarters}
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-5 text-lg font-semibold">Payments</h3>
          <p className="mb-4 text-sm text-ink-600">We accept the payment methods our international clients prefer.</p>
          <div className="flex flex-wrap gap-2">
            {['WeChat Pay', 'Alipay', 'PayPal', 'Visa', 'Mastercard', 'Amex'].map((label) => (
              <span
                key={label}
                className="rounded-full border border-gold-300 bg-white px-3 py-1.5 text-xs font-medium text-ink-700"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gold-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            &copy; {COMPANY.foundedYear}&ndash;{new Date().getFullYear()} {COMPANY.name}. All rights reserved.
          </p>
          <p className="font-display text-sm font-semibold text-gold-700">Trade the world with confidence.</p>
        </div>
      </div>
    </footer>
  );
}
