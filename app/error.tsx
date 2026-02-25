'use client';

import { useEffect } from 'react';
import { Link } from '@/i18n/navigation';

const IconArrowClockwise = () => (
  <svg className="w-5 h-5" viewBox="0 0 256 256" fill="currentColor" aria-hidden>
    <path d="M240,56v48a8,8,0,0,1-8,8H184a8,8,0,0,1,0-16h28.7L196,79.3a80,80,0,1,0,1.8,113.1,8,8,0,1,1,11.3,11.3A96,96,0,1,1,195.5,68.5L216,89.3V56a8,8,0,0,1,16,0Z" />
  </svg>
);

const IconHouse = () => (
  <svg className="w-5 h-5" viewBox="0 0 256 256" fill="currentColor" aria-hidden>
    <path d="M219.3,108.7l-80-80a16,16,0,0,0-22.6,0l-80,80A15.9,15.9,0,0,0,32,120v96a8,8,0,0,0,8,8H96a8,8,0,0,0,8-8V160h48v56a8,8,0,0,0,8,8h56a8,8,0,0,0,8-8V120A15.9,15.9,0,0,0,219.3,108.7Z" />
  </svg>
);

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
            <IconArrowClockwise />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-bronze-600 text-bronze-600 hover:bg-bronze-600 hover:text-white transition-all font-display text-lg"
          >
            <IconHouse />
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
