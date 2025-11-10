
'use client';

import { useMemo, useState, useEffect } from 'react';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import Logo from '@/components/Logo';
import { socialLinks } from '@/lib/data';
import { Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '../ui/skeleton';

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.04c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm2.24 10.38h-1.67v5.58h-2.19v-5.58h-1.12v-1.97h1.12v-1.34c0-1.1.52-2.73 2.73-2.73h1.5v1.97h-.92c-.39 0-.47.18-.47.46v1.64h1.4l-.17 1.97z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.02c-2.85 0-3.2.01-4.32.06-1.12.05-1.89.23-2.55.49-.67.27-1.22.63-1.78 1.19-.56.56-.92 1.11-1.19 1.78-.26.66-.44 1.43-.49 2.55-.05 1.12-.06 1.47-.06 4.32s.01 3.2.06 4.32c.05 1.12.23 1.89.49 2.55.27.67.63 1.22 1.19 1.78.56.56 1.11.92 1.78 1.19.66.26 1.43.44 2.55.49 1.12.05 1.47.06 4.32.06s3.2-.01 4.32-.06c1.12-.05 1.89-.23 2.55-.49.67-.27 1.22-.63 1.78-1.19.56-.56.92-1.11 1.19-1.78.26-.66.44-1.43.49-2.55.05-1.12.06-1.47.06-4.32s-.01-3.2-.06-4.32c-.05-1.12-.23-1.89-.49-2.55-.27-.67-.63-1.22-1.19-1.78-.56-.56-1.11-.92-1.78-1.19-.66-.26-1.43-.44-2.55-.49-1.12-.05-1.47-.06-4.32-.06zm0 1.8c2.81 0 3.16.01 4.25.06 1.01.05 1.58.21 1.96.36.46.18.79.43 1.14.78.35.35.6.68.78 1.14.15.38.31.95.36 1.96.05 1.09.06 1.44.06 4.25s-.01 3.16-.06 4.25c-.05 1.01-.21 1.58-.36 1.96-.18.46-.43.79-.78 1.14-.35.35-.68.6-1.14.78-.38.15-.95.31-1.96.36-1.09.05-1.44.06-4.25.06s-3.16-.01-4.25-.06c-1.01-.05-1.58-.21-1.96-.36-.46-.18-.79-.43-1.14-.78-.35-.35-.6-.68-.78-1.14-.15-.38-.31-.95-.36-1.96-.05-1.09-.06-1.44-.06-4.25s.01-3.16.06-4.25c.05-1.01.21-1.58.36-1.96.18-.46.43-.79.78-1.14.35-.35.68-.6 1.14-.78.38-.15.95-.31 1.96-.36 1.09-.05 1.44-.06 4.25-.06zm0 4.19c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6.4c-1.33 0-2.4-1.07-2.4-2.4s1.07-2.4 2.4-2.4 2.4 1.07 2.4 2.4-1.07 2.4-2.4 2.4zm3.08-6.84c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.04c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zM8.5 18.5h-2v-7h2v7zm-1-8.22c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25zM18.5 18.5h-2v-3.5c0-.84-.02-1.92-.82-1.92s-.95.91-.95 1.86v3.56h-2v-7h1.92v.88h.03c.27-.51.92-1.05 1.82-1.05 1.95 0 2.31 1.28 2.31 2.94v4.23z"/>
  </svg>
);

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
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
  LinkedIn: LinkedinIcon,
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
