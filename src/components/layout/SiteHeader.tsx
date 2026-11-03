import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, Phone, ShieldCheck, ShoppingBag, User, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { COMPANY } from '@/lib/company';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'Services', end: false },
  { to: '/shop', label: 'Shop', end: false },
  { to: '/track', label: 'Track Order', end: false },
  { to: '/about', label: 'About', end: false },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { isAdmin } = useIsAdmin();
  const { itemCount, openCart } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-gold-100 bg-white/90 shadow-soft backdrop-blur-xl'
          : 'border-b border-transparent bg-white/0'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link to="/" className="group flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3" aria-label={COMPANY.name}>
          <img
            src="/images/image.png"
            alt=""
            className="h-12 w-auto shrink-0 transition duration-500 group-hover:scale-105"
          />
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl font-semibold uppercase tracking-[0.1em] text-ink-900 sm:text-2xl">
              Godfather
            </span>
            <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.16em] text-gold-700 sm:text-[10px] sm:tracking-[0.2em]">
              International Trading LLC
            </span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `group relative py-2 text-sm font-medium tracking-wide transition ${
                  isActive ? 'text-ink-900' : 'text-ink-500 hover:text-ink-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    className={`absolute inset-x-0 -bottom-0.5 h-0.5 origin-left rounded-full bg-gradient-to-r from-gold-300 to-gold-600 transition-transform duration-500 ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={COMPANY.phoneHref}
            className="hidden items-center gap-2 rounded-full border border-gold-200 bg-gold-50 px-4 py-2 text-sm font-semibold text-ink-800 transition hover:border-gold-400 hover:bg-gold-100 xl:flex"
          >
            <Phone className="h-4 w-4 text-gold-700" />
            {COMPANY.phoneDisplay}
          </a>

          {isAdmin && (
            <Link
              to="/admin"
              aria-label="Admin dashboard"
              className="rounded-full p-2.5 text-gold-700 transition hover:bg-gold-50 hover:text-ink-900"
            >
              <ShieldCheck className="h-5 w-5" />
            </Link>
          )}

          <Link
            to={user ? '/account' : '/login'}
            aria-label={user ? 'My account' : 'Sign in'}
            className="rounded-full p-2.5 text-ink-700 transition hover:bg-gold-50 hover:text-ink-900"
          >
            <User className="h-5 w-5" />
          </Link>

          <button
            type="button"
            onClick={openCart}
            aria-label={`Open cart, ${itemCount} items`}
            className="relative rounded-full p-2.5 text-ink-700 transition hover:bg-gold-50 hover:text-ink-900"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 animate-scale-in items-center justify-center rounded-full bg-gold-400 px-1 text-[11px] font-semibold text-ink-900 shadow-gold">
                {itemCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="rounded-full p-2.5 text-ink-800 transition hover:bg-gold-50 lg:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden border-t border-gold-100 bg-white/95 backdrop-blur-xl transition-all duration-500 lg:hidden ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 border-transparent opacity-0'
        }`}
      >
        <nav aria-label="Mobile" className="flex flex-col gap-1 px-5 py-4">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-xl px-4 py-3 text-base font-medium transition ${
                  isActive ? 'bg-gold-50 text-ink-900' : 'text-ink-600 hover:bg-gold-50/60 hover:text-ink-900'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <a
            href={COMPANY.phoneHref}
            className="mt-2 flex items-center gap-2 rounded-xl bg-ink-900 px-4 py-3 text-base font-semibold text-white"
          >
            <Phone className="h-4 w-4 text-gold-300" />
            {COMPANY.phoneDisplay}
          </a>
        </nav>
      </div>
    </header>
  );
}
