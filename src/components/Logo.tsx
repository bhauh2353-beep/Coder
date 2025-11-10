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
    if (!firestore) return null;
    return doc(firestore, 'companyInfo', 'main');
  }, [firestore]);
  const { data: companyInfo, isLoading } = useDoc(companyInfoRef);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const companyName = companyInfo?.name || 'JH Smart Solutions';

  if (!isMounted || isLoading) {
    return <Skeleton className={cn("h-8 w-48", className)} />;
  }

  return (
    <Link href="/" className={cn('font-body font-bold text-2xl tracking-tight flex items-center', className)}>
      {companyName}
      <span className="ml-2 h-6 w-1.5 bg-primary blinking-cursor" />
    </Link>
  );
};

export default Logo;
