'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { loginAction } from '@/app/actions/auth';
import { Loader2 } from 'lucide-react';
import Home from '@/app/page';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 text-gray-100">
        <div className="max-w-md w-full bg-surface-glass backdrop-blur-md p-8 rounded-[var(--radius-xl)] shadow-[var(--shadow-card)] border border-border-default">
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

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-brand hover:bg-brand-hover text-white py-2 px-4 rounded-[var(--radius-md)] transition-colors mt-6"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : 'Sign In'}
          </Button>
        </form>
        </div>
      </div>
    </div>
  );
}
