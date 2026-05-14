import { routing } from '@/i18n/routing';
import { buttonVariants } from '@/components/ui/ButtonLink';

/** Minimal root not-found for requests outside [locale]. */
export default function RootNotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="text-center">
        <h1 className="font-display text-9xl text-bronze-600">404</h1>
        <p className="text-charcoal/70 mt-4">Page not found</p>
        <a href={`/${routing.defaultLocale}/`} className={buttonVariants({ className: 'mt-6 px-6 py-3 text-base' })}>
          Go to Home
        </a>
      </div>
    </main>
  );
}
