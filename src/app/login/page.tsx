'use client';

import { useState } from 'react';
import { CTAButton } from '@/components/ui/cta-button';
import { loginAction } from '@/app/actions/auth';
import { Loader2 } from 'lucide-react';
import Home from '@/app/page';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError('');
    
    const result = await loginAction(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Website */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden blur-[2px]">
        <Home />
      </div>

      {/* Overlay & Login Form */}
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-scrim/85">
        <div className="max-w-md w-full bg-surface-glass backdrop-blur-md p-8 rounded-xl shadow-raised border border-border-default">
          <h2 className="text-center mb-6 text-text-primary font-heading tracking-wide">Admin Login</h2>
        
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-text-secondary" htmlFor="password">Secret Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full bg-input-background border border-border-default rounded-[var(--radius-md)] px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand transition-all"
              placeholder="Enter admin password"
              required
            />
          </div>
          
          {error && (
            <p className="text-danger mt-4 text-center">
              {error}
            </p>
          )}

          <CTAButton
            type="submit"
            disabled={loading}
            className="w-full mt-6"
          >
            {loading ? 'Authenticating...' : 'Enter Dashboard'}
          </CTAButton>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setShowReset(!showReset)}
            className="text-text-secondary underline underline-offset-4 hover:text-text-primary transition-colors"
          >
            Forgot password?
          </button>
        </div>

        {showReset && (
          <ol className="mt-4 space-y-2 list-decimal list-inside text-text-secondary text-sm text-left">
            <li>Sign in to Vercel and open the <strong>personal-profile</strong> project.</li>
            <li>Go to <strong>Settings → Environment Variables</strong>.</li>
            <li>Edit <strong>ADMIN_SECRET</strong> (or add it) and enter a new password.</li>
            <li>Open <strong>Deployments</strong>, click <strong>⋯</strong> on the latest one and choose <strong>Redeploy</strong>.</li>
            <li>Log in here with the new password. All old sessions are signed out.</li>
          </ol>
        )}
        </div>
      </div>
    </div>
  );
}
