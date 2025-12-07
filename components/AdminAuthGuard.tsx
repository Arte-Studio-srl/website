'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = useCallback(async (cancelledRef: { current: boolean }) => {
    try {
      const response = await fetch('/api/admin/auth/check', {
        credentials: 'include',
        cache: 'no-store'
      });
      const data = await response.json();

      if (cancelledRef.current) return;

      if (data.authenticated) setIsAuthenticated(true);
      else router.push('/admin/login');
    } catch (error) {
      console.error('Auth check failed:', error);
      if (!cancelledRef.current) router.push('/admin/login');
    } finally {
      if (!cancelledRef.current) setIsChecking(false);
    }
  }, [router]);

  useEffect(() => {
    const cancelledRef = { current: false };
    checkAuth(cancelledRef);
    return () => {
      cancelledRef.current = true;
    };
  }, [checkAuth]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-bronze-600 mx-auto mb-4"></div>
          <p className="text-charcoal">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}


