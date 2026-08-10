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
        <div className="max-w-md w-full bg-gray-900/90 backdrop-blur-md p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-gray-700">
          <h2 className="text-2xl font-bold text-center mb-6 text-white tracking-wide">Admin Login</h2>
        
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300" htmlFor="password">Secret Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="Enter admin password"
              required
            />
          </div>
          
          {error && (
            <p className="text-red-400 text-sm mt-4 text-center">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors mt-6"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : 'Sign In'}
          </Button>
        </form>
        </div>
      </div>
    </div>
  );
}
