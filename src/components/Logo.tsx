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

  // Always render the container, but conditionally render the content
  // This helps prevent hydration mismatches where the server renders a Skeleton and client renders a Link
  return (
    <div className={cn('font-body font-bold text-2xl tracking-tight flex items-center', className)}>
      {!isMounted || isLoading ? (
         <Skeleton className="h-8 w-48" />
      ) : (
        <Link href="/" className='flex items-center'>
            {companyName}
            <span className="ml-2 h-6 w-1.5 bg-primary blinking-cursor" />
        </Link>
      )}
    </div>
  );
};

export default Logo;
