'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { MessageSquare } from 'lucide-react';

export default function ManageTestimonialsPage() {
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
        <MessageSquare className="w-8 h-8" />
        <h1 className="text-3xl font-bold font-headline">Manage Testimonials</h1>
      </div>
      <p>Here you will be able to manage your testimonials.</p>
    </div>
  );
}
