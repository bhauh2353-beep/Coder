'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { LayoutDashboard } from 'lucide-react';

export default function ManagementPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <LayoutDashboard className="w-8 h-8" />
        <h1 className="text-3xl font-bold font-headline">Management</h1>
      </div>
      <p>Welcome to the management page, {user.displayName || user.email}.</p>
      {/* Add your management components and content here */}
    </div>
  );
}
