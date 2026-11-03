import { COMPANY, whatsappLink } from '@/lib/company';

const MESSAGE = `Hello ${COMPANY.name}, I'd like to make an enquiry.`;
const HREF = whatsappLink(MESSAGE);

export function WhatsAppButton() {
  return (
    <a
      href={HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-3 sm:bottom-6 sm:right-6"
    >
      <span className="pointer-events-none hidden translate-x-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink-900 opacity-0 shadow-soft transition duration-200 group-hover:translate-x-0 group-hover:opacity-100 sm:block">
        Chat on WhatsApp
      </span>
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition duration-200 group-hover:scale-110">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30" aria-hidden="true" />
        <svg viewBox="0 0 32 32" className="relative h-8 w-8" fill="currentColor" aria-hidden="true">
          <path d="M16.002 3C8.82 3 3 8.82 3 16c0 2.29.6 4.52 1.73 6.49L3 29l6.71-1.76A12.94 12.94 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16.002 3Zm0 23.7c-2 0-3.95-.54-5.66-1.56l-.4-.24-3.98 1.04 1.06-3.88-.26-.4A10.66 10.66 0 0 1 5.3 16c0-5.9 4.8-10.7 10.7-10.7S26.7 10.1 26.7 16 21.9 26.7 16 26.7Zm5.87-8c-.32-.16-1.9-.94-2.2-1.04-.3-.11-.5-.16-.72.16-.22.32-.83 1.04-1.02 1.26-.19.21-.37.24-.7.08-.32-.16-1.36-.5-2.59-1.6-.96-.85-1.6-1.9-1.79-2.22-.19-.32-.02-.5.14-.66.14-.14.32-.37.48-.56.16-.19.21-.32.32-.54.1-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.38-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66s1.15 3.08 1.31 3.3c.16.21 2.26 3.45 5.48 4.84.77.33 1.37.53 1.83.68.77.24 1.47.21 2.02.13.62-.09 1.9-.78 2.17-1.53.27-.75.27-1.39.19-1.53-.08-.13-.29-.21-.61-.37Z" />
        </svg>
      </span>
    </a>
  );
}
