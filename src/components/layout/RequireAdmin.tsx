import type { ReactNode } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { PageLoader } from '@/components/ui/PageLoader';
import { useAuth } from '@/contexts/AuthContext';
import { useIsAdmin } from '@/hooks/useIsAdmin';

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading } = useIsAdmin();
  const location = useLocation();

  if (authLoading || loading) return <PageLoader />;

  if (!user) {
    const next = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  if (!isAdmin) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center px-5 py-24">
        <div className="max-w-md rounded-[2rem] border border-gold-100 bg-white p-10 text-center shadow-gold">
          <ShieldAlert className="mx-auto h-10 w-10 text-gold-700" />
          <h1 className="mt-5 text-3xl font-semibold text-ink-900">Admins only</h1>
          <p className="mt-3 text-ink-500">This account does not have access to the admin dashboard.</p>
          <Link
            to="/"
            className="mt-8 inline-flex rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink-800"
          >
            Back to home
          </Link>
        </div>
      </section>
    );
  }

  return children;
}
