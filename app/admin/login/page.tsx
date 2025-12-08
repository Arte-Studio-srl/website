'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setCodeSent(true);
        alert('Verification code sent to your email!');
      } else {
        setError(data.error || 'Failed to send code');
      }
    } catch (error) {
      setError('Failed to send code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
        credentials: 'include', // Important: include cookies in the request
      });

      const data = await response.json();

      if (data.success) {
        // Wait a moment for cookie to be set
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Use window.location for a full page reload to ensure cookies are properly set
        window.location.href = '/admin';
      } else {
        setError(data.error || 'Invalid code');
        setLoading(false);
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError('Failed to verify code. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl text-charcoal mb-2">Admin Access</h1>
          <p className="text-charcoal/60">ArteStudio Portfolio Management</p>
        </div>

        {/* Login Card */}
        <div className="bg-white p-8 rounded-lg shadow-xl border-t-4 border-bronze-500">
          {!codeSent ? (
            // Email Form
            <form onSubmit={handleSendCode}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Admin Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your-email@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-bronze-500 focus:border-transparent"
                  disabled={loading}
                />
                <p className="text-xs text-charcoal/60 mt-2">
                  Enter your authorized admin email to receive a verification code
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-bronze-600 hover:bg-bronze-700 text-white py-3 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending Code...' : 'Send Verification Code'}
              </button>
            </form>
          ) : (
            // Code Verification Form
            <form onSubmit={handleVerifyCode}>
              <div className="mb-4">
                <p className="text-sm text-charcoal/70 mb-4">
                  We sent a 6-digit code to <strong>{email}</strong>
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setCodeSent(false);
                    setCode('');
                    setError('');
                  }}
                  className="text-bronze-600 hover:text-bronze-700 text-sm font-medium"
                >
                  ← Change email
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-full px-4 py-3 border border-gray-300 rounded text-center text-2xl tracking-widest font-mono focus:ring-2 focus:ring-bronze-500 focus:border-transparent"
                  disabled={loading}
                  maxLength={6}
                />
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full bg-bronze-600 hover:bg-bronze-700 text-white py-3 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify & Login'}
              </button>

              <button
                type="button"
                onClick={() => handleSendCode({ preventDefault: () => {} } as React.FormEvent)}
                disabled={loading}
                className="w-full mt-3 text-bronze-600 hover:text-bronze-700 text-sm font-medium disabled:opacity-50"
              >
                Resend Code
              </button>
            </form>
          )}
        </div>

        {/* Back to site */}
        <div className="text-center mt-6">
          <Link href="/" className="text-charcoal/60 hover:text-bronze-600 text-sm transition-colors">
            ← Back to Website
          </Link>
        </div>
      </div>
    </div>
  );
}



