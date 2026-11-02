import { useEffect, useId, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  align?: 'center' | 'right';
  children: ReactNode;
}

export function Dialog({ open, onClose, title, align = 'center', children }: DialogProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const panelClass =
    align === 'right'
      ? 'ml-auto h-full w-full max-w-md animate-slide-in-right rounded-none sm:rounded-l-3xl'
      : 'mx-auto my-auto w-full max-w-4xl animate-scale-in rounded-3xl';

  return (
    <div className="fixed inset-0 z-[60] flex">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 animate-fade-in bg-ink-900/50 backdrop-blur-sm"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative flex max-h-full flex-col overflow-hidden bg-white shadow-soft ${panelClass}`}
      >
        <header className="flex items-center justify-between border-b border-ink-100 px-6 py-5">
          <h2 id={titleId} className="text-2xl font-semibold">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-full p-2 text-ink-500 transition hover:bg-gold-50 hover:text-ink-900"
          >
            <X className="h-5 w-5" />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}
