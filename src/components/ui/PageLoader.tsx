export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gold-100 border-t-gold-500" role="status">
        <span className="sr-only">Loading</span>
      </div>
    </div>
  );
}
