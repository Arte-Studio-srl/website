'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminAuthGuard from '@/components/AdminAuthGuard';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  backHref?: string;
  backLabel?: string;
  actions?: React.ReactNode;
  showViewLink?: boolean;
}

export default function AdminLayout({ 
  children, 
  title, 
  backHref = '/admin',
  backLabel = '←',
  actions,
  showViewLink = true
}: AdminLayoutProps) {
  const router = useRouter();

  const handleLogout = async () => {
    if (!confirm('Are you sure you want to logout?')) return;

    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-cream">
        {/* Header */}
        <header className="bg-charcoal text-cream border-b-4 border-bronze-500 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3 sm:py-4">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  {backHref && (
                    <Link
                      href={backHref}
                      className="text-bronze-200 hover:text-bronze-100 transition-colors text-sm sm:text-base font-medium"
                    >
                      {backLabel}
                    </Link>
                  )}
                  {showViewLink && (
                    <Link 
                      href="/" 
                      className="text-sm sm:text-base text-bronze-200 hover:text-bronze-100 transition-colors px-3 py-1 rounded-full border border-bronze-500/60 bg-white/5"
                    >
                      Site
                    </Link>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className="text-red-200 hover:text-red-100 transition-colors text-sm sm:text-base font-medium"
                >
                  Logout
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-bronze-200 border border-bronze-500/60 rounded-full bg-white/5">
                    Admin
                  </span>
                  {title && (
                    <h1 className="font-display text-xl sm:text-2xl leading-tight">
                      {title}
                    </h1>
                  )}
                </div>

                {actions && (
                  <div className="flex w-full sm:w-auto flex-wrap items-center gap-2 sm:gap-3 justify-start sm:justify-end">
                    {actions}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </AdminAuthGuard>
  );
}


