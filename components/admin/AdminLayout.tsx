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
      <div className="min-h-screen bg-cream font-sans selection:bg-bronze-200 selection:text-charcoal">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md text-charcoal border-b border-bronze-200/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  {backHref && (
                    <Link
                      href={backHref}
                      className="text-charcoal/50 hover:text-bronze-600 transition-colors text-sm font-medium tracking-wide uppercase"
                    >
                      {backLabel}
                    </Link>
                  )}
                  {showViewLink && (
                    <Link 
                      href="/" 
                      className="text-xs font-medium tracking-widest uppercase text-charcoal/60 hover:text-bronze-600 transition-colors px-3 py-1 rounded-full border border-gray-200 hover:border-bronze-200"
                    >
                      Live Site
                    </Link>
                  )}
                </div>
                
                <div className="h-4 w-px bg-gray-200 hidden md:block"></div>

                <div className="flex items-baseline gap-3">
                  <span className="text-xs font-bold tracking-widest uppercase text-bronze-600">
                    Admin
                  </span>
                  {title && (
                    <h1 className="font-display text-xl sm:text-2xl text-charcoal leading-none">
                      {title}
                    </h1>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6">
                {actions && (
                  <div className="flex items-center gap-3">
                    {actions}
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="text-xs font-medium tracking-widest uppercase text-charcoal/50 hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>

            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          {children}
        </main>
      </div>
    </AdminAuthGuard>
  );
}



