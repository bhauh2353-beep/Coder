'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { DollarSign } from 'lucide-react';

export default function ManagePricingPage() {
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
        <DollarSign className="w-8 h-8" />
        <h1 className="text-3xl font-bold font-headline">Manage Pricing</h1>
      </div>
      <p>Here you will be able to manage your pricing plans.</p>
    </div>
  );
}
