import { useEffect } from 'react';
import { COMPANY } from '@/lib/company';

interface PageMeta {
  /** Short page name, e.g. "Services". Leave out for the home page. */
  title?: string;
  description: string;
  /** Keep private pages (sign-in, checkout, account, admin) out of search results. */
  noindex?: boolean;
}

const HOME_TITLE = `${COMPANY.name} | Sourcing, Logistics, Travel & Shop`;

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function usePageMeta({ title, description, noindex = false }: PageMeta) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${COMPANY.name}` : HOME_TITLE;
    document.title = fullTitle;
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[name="robots"]', 'name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
  }, [title, description, noindex]);
}
