'use client';

import { useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { Icon } from '@iconify/react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[AppError]', error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="text-center max-w-lg">
        <h1 className="font-display text-6xl text-bronze-600 mb-4">Oops</h1>
        <div className="w-24 h-1 bg-bronze-600 mx-auto mb-6" />
        <h2 className="font-display text-3xl text-charcoal mb-4">Something went wrong</h2>
        <p className="text-charcoal/70 mb-8">
          An unexpected error occurred. Please try again or return to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-bronze-600 text-white hover:bg-bronze-700 transition-all font-display text-lg"
          >
            <Icon icon="ph:arrow-clockwise" className="w-5 h-5" aria-hidden />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-bronze-600 text-bronze-600 hover:bg-bronze-600 hover:text-white transition-all font-display text-lg"
          >
            <Icon icon="ph:house" className="w-5 h-5" aria-hidden />
            Back to Home
          </Link>
        </div>
        {error.digest && (
          <p className="text-xs text-charcoal/40 mt-6">Error ID: {error.digest}</p>
        )}
      </div>
    </main>
  );
}
