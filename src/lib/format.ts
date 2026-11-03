export function formatPrice(cents: number, currency = 'USD', showCode = true): string {
  const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cents / 100);
  return showCode && currency === 'USD' ? `${formatted} USD` : formatted;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
