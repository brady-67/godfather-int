import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { TextField } from '@/components/ui/TextField';
import { useAuth } from '@/contexts/AuthContext';
import { safeNextPath } from '@/lib/navigation';
import { usePageMeta } from '@/hooks/usePageMeta';

const MIN_PASSWORD_LENGTH = 8;

export function RegisterPage() {
  usePageMeta({ title: 'Create an Account', description: 'Create an account to place orders and track your shipments.', noindex: true });
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = safeNextPath(searchParams.get('next'));
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const trimmedEmail = email.trim();
      const { hasSession } = await signUp({ name: name.trim(), email: trimmedEmail, password });
      if (!hasSession) await signIn(trimmedEmail, password);
      navigate(next, { replace: true });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative flex min-h-[calc(100vh-5rem)] items-center overflow-hidden bg-gradient-to-b from-gold-50 via-white to-white px-5 py-20 sm:px-8">
      <div className="liquid-blob -right-24 top-10 h-96 w-96 bg-gold-300/40" />
      <div className="relative mx-auto w-full max-w-md">
        <div className="rounded-[2rem] border border-gold-100 bg-white p-8 shadow-gold sm:p-10">
          <p className="eyebrow">Join us</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-ink-900">Create your account</h1>
          <p className="mt-3 text-ink-500">Save your details, place orders and follow every shipment.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <TextField id="register-name" label="Full name" value={name} onChange={setName} autoComplete="name" required />
            <TextField
              id="register-email"
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              autoComplete="email"
              required
            />
            <TextField
              id="register-password"
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              autoComplete="new-password"
              hint={`At least ${MIN_PASSWORD_LENGTH} characters`}
              required
            />

            {error && (
              <p role="alert" className="rounded-2xl border border-crimson-50 bg-crimson-50 px-4 py-3 text-sm text-crimson-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="liquid-fill flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 px-6 py-3.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              <span className="relative z-10 flex items-center gap-2">
                {submitting ? 'Creating account...' : 'Create account'}
                {!submitting && <ArrowRight className="h-4 w-4" />}
              </span>
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-ink-500">
            Already registered?{' '}
            <Link
              to={`/login${next !== '/account' ? `?next=${encodeURIComponent(next)}` : ''}`}
              className="font-semibold text-gold-700 hover:text-gold-600"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
