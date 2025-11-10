'use client';

import { useMemo, useState, useEffect } from 'react';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

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
  const logoUrl = companyInfo?.logoUrl;

  if (!isMounted || isLoading) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Skeleton className="h-10 w-48 rounded-md" />
        <Skeleton className="h-6 w-32" />
      </div>
    );
  }

  return (
    <Link href="/" className={cn('flex items-center gap-2', className)}>
      {logoUrl ? (
        <div className="relative h-12 w-48">
          <Image
            src={logoUrl}
            alt={`${companyName} Logo`}
            fill
            className="object-contain object-left rounded-md"
            priority
          />
        </div>
      ) : null}
      <span className="font-body font-bold text-lg md:text-xl tracking-tight bg-gradient-to-r from-green-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
        {companyName}
      </span>
    </Link>
  );
};

export default Logo;
