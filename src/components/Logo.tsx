'use client';

import { useMemo, useState, useEffect } from 'react';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';

type LogoProps = {
  className?: string;
};

const Logo = ({ className }: LogoProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const firestore = useFirestore();
  
  const companyInfoRef = useMemo(() => {
    // This part runs on both server and client.
    // It's safe as long as firestore is handled correctly in the provider.
    if (!firestore) return null;
    return doc(firestore, 'companyInfo', 'main');
  }, [firestore]);

  // useDoc hook is client-side.
  const { data: companyInfo, isLoading } = useDoc(companyInfoRef);

  // This effect runs only on the client, after the initial render.
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // On the server, isMounted is false, so we render the Skeleton.
  // On the client's initial render, isMounted is also false, so it matches the server.
  if (!isMounted || isLoading) {
    return (
      <Link href="/" className={cn('font-body font-bold text-2xl tracking-tight flex items-center', className)}>
        <Skeleton className="h-8 w-48" />
      </Link>
    );
  }

  // After mounting and loading, the client re-renders with the actual data.
  // This is a safe update and won't cause a hydration error.
  const companyName = companyInfo?.name || 'JH Smart Solutions';

  return (
    <Link href="/" className={cn('font-body font-bold text-2xl tracking-tight flex items-center', className)}>
      {companyName}
      <span className="ml-2 h-6 w-1.5 bg-primary blinking-cursor" />
    </Link>
  );
};

export default Logo;
