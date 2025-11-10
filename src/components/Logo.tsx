'use client';

import { useMemo } from 'react';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';

type LogoProps = {
  className?: string;
};

const Logo = ({ className }: LogoProps) => {
  const firestore = useFirestore();
  const companyInfoRef = useMemo(() => {
    if (!firestore) return null;
    return doc(firestore, 'companyInfo', 'main');
  }, [firestore]);
  const { data: companyInfo, isLoading } = useDoc(companyInfoRef);

  const companyName = companyInfo?.name || 'JH Smart Solutions';

  if (isLoading && !companyInfo) {
    return <Skeleton className={cn("h-6 w-40", className)} />;
  }

  return (
    <Link href="/" className={cn('font-headline font-bold text-lg tracking-tight', className)}>
      {companyName}
    </Link>
  );
};

export default Logo;
