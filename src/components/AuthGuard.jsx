'use client';

import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const publicPaths = ['/login', '/signup'];

export default function AuthGuard({ children }) {
  const { user, loading, firebaseEnabled } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isPublic = publicPaths.includes(pathname);

  useEffect(() => {
    // If firebase isn't configured, we shouldn't redirect.
    if (!firebaseEnabled) {
      return;
    }

    if (!loading && !user && !isPublic) {
      router.push('/login');
    }
  }, [loading, user, isPublic, router, firebaseEnabled, pathname]);

  // While checking auth or if we are about to redirect, show a loader.
  if (firebaseEnabled && (loading || (!user && !isPublic))) {
    return (
      <div className="flex h-[calc(100vh-8rem)] w-full items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
