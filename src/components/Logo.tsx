import Link from 'next/link';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
};

const Logo = ({ className }: LogoProps) => {
  return (
    <Link href="#home" className={cn('font-headline font-bold text-lg tracking-tight', className)}>
      JH Smart Solutions
    </Link>
  );
};

export default Logo;
