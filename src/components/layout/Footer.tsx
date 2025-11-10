
'use client';

import { useMemo, useState, useEffect } from 'react';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import Logo from '@/components/Logo';
import { socialLinks } from '@/lib/data';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '../ui/skeleton';

const WhatsAppIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path
        d="M.052 24l1.688-6.164c-1.041-1.804-1.582-3.856-1.582-5.942 0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12c-2.228 0-4.303-.603-6.132-1.688l-6.326 1.794zm6.55-5.952c1.614.957 3.498 1.46 5.498 1.46 5.514 0 10-4.486 10-10s-4.486-10-10-10-10 4.486-10 10c0 2.14.653 4.145 1.795 5.828l-1.123 4.092 4.23-1.132zM12 4.026c4.394 0 7.974 3.58 7.974 7.974s-3.58 7.974-7.974 7.974c-1.542 0-2.986-.435-4.228-1.21l-.306-.183-3.155.845.86-3.076-.202-.32c-.838-1.326-1.282-2.826-1.282-4.394 0-4.394 3.58-7.974 7.974-7.974zm4.593 9.475c-.217-.11-.472-.218-.727-.327s-.442-.163-.637-.163c-.195 0-.41.02-.606.182-.195.163-.672.672-.826.816-.154.145-.308.163-.462.109-.154-.054-1.01-0.37-1.924-1.187-.714-.627-1.187-1.402-1.32-1.631-.132-.228-.02-.349.098-.462.109-.109.237-.282.356-.426.119-.144.173-.243.254-.405.082-.163.041-.308-.014-.415-.055-.108-.54-.956-1.02-2.093-.468-1.109-.944-1.02-1.282-1.02-.328 0-.693-.054-1.02.04-.328.093-.826.391-1.041.826-.216.435-.348.91-.348 1.396s.217 1.751.48 2.228c.264.476 1.082 1.71 2.656 3.252 2.22 2.147 3.53 2.502 4.164 2.657.633.154 1.13.12 1.542-.04.462-.173.826-.641.935-1.22.108-.578.108-1.087.078-1.195-.03-.108-.182-.172-.39-.282z"
      />
    </svg>
);


const iconMap: { [key: string]: React.ElementType } = {
  Facebook: Facebook,
  Instagram: Instagram,
  LinkedIn: Linkedin,
  WhatsApp: WhatsAppIcon,
};

const Footer = () => {
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


  const slogan = companyInfo?.slogan || 'Smart, Fast, and Affordable Digital Solutions.';
  const companyName = companyInfo?.name || 'JH Smart Solutions';
  const address = companyInfo?.address || 'Shop Location, City, India';
  const phone = companyInfo?.phone || '+91 7972688626';
  const email = companyInfo?.email || 'info@jhsmartsolutions.in';

  return (
    <footer className="bg-background/80 backdrop-blur-sm border-t">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-around gap-8 text-center md:text-left">
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <Logo className="text-3xl px-0" />
             {isLoading || !isMounted ? <Skeleton className='h-5 w-72' /> : <p className="text-muted-foreground text-sm max-w-xs">{slogan}</p>}
          </div>

          <div className="space-y-4 flex flex-col items-center md:items-start">
            <h3 className="font-headline text-lg font-medium">Contact Us</h3>
            {(isLoading || !isMounted) ? (
                <div className="space-y-2">
                    <Skeleton className='h-5 w-64' />
                    <Skeleton className='h-5 w-48' />
                    <Skeleton className='h-5 w-56' />
                </div>
            ) : (
                <ul className="space-y-2 text-sm text-muted-foreground text-center md:text-left">
                <li className="flex items-center gap-2 justify-center md:justify-start">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{address}</span>
                </li>
                <li className="flex items-center gap-2 justify-center md:justify-start">
                    <Phone className="w-4 h-4 text-primary" />
                    <a href={`tel:${phone}`} className="hover:text-primary transition-colors">
                    {phone}
                    </a>
                </li>
                <li className="flex items-center gap-2 justify-center md:justify-start">
                    <Mail className="w-4 h-4 text-primary" />
                    <a href={`mailto:${email}`} className="hover:text-primary transition-colors">
                    {email}
                    </a>
                </li>
                </ul>
            )}
          </div>

          <div className="space-y-4 flex flex-col items-center">
            <h3 className="font-headline text-lg font-medium">Follow Us</h3>
            <div className="flex space-x-2">
              {socialLinks.map((social) => {
                const Icon = iconMap[social.name];
                const href = social.name === 'WhatsApp' && phone
                  ? `https://wa.me/${phone.replace(/[\s]/g, '')}`
                  : social.href;
                return (
                  <Link key={social.name} href={href} target="_blank" rel="noopener noreferrer"
                    className={`p-2 rounded-full transition-transform duration-300 hover:scale-110 text-orange-600`}>
                    <Icon className="w-6 h-6" />
                    <span className="sr-only">{social.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground space-y-2">
            {(isLoading || !isMounted) ? <Skeleton className='h-5 w-64 mx-auto' /> : <p>&copy; {new Date().getFullYear()} {companyName}. All rights reserved.</p>}
            {(isLoading || !isMounted) ? <Skeleton className='h-5 w-80 mx-auto mt-2' /> : <p>
                Designed & Developed by <a href="#" className="font-semibold text-primary hover:underline">{companyName}</a>
            </p>}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
