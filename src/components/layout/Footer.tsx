'use client';

import { useMemo } from 'react';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import Logo from '@/components/Logo';
import { socialLinks } from '@/lib/data';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';

const WhatsAppIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
);


const iconMap: { [key: string]: React.ElementType } = {
  Facebook: Facebook,
  Instagram: Instagram,
  LinkedIn: Linkedin,
  WhatsApp: WhatsAppIcon,
};

const Footer = () => {
  const firestore = useFirestore();
  const companyInfoRef = useMemo(() => {
    if (!firestore) return null;
    return doc(firestore, 'companyInfo', 'main');
  }, [firestore]);
  const { data: companyInfo } = useDoc(companyInfoRef);

  return (
    <footer className="bg-background/80 backdrop-blur-sm border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-around gap-8 text-center">
          <div className="space-y-4 flex flex-col items-center">
            <Logo className="text-3xl" />
            <p className="text-muted-foreground text-sm max-w-xs">
              {companyInfo?.slogan || 'Smart, Fast, and Affordable Digital Solutions.'}
            </p>
          </div>

          <div className="space-y-4 flex flex-col items-center">
            <h3 className="font-headline text-lg font-medium">Contact Us</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{companyInfo?.address || 'Shop Location, City, India'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <a href={`tel:${companyInfo?.phone}`} className="hover:text-primary transition-colors">
                  {companyInfo?.phone || '+91 9xxxxxxxxx'}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <a href={`mailto:${companyInfo?.email}`} className="hover:text-primary transition-colors">
                  {companyInfo?.email || 'info@jhsmartsolutions.in'}
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4 flex flex-col items-center">
            <h3 className="font-headline text-lg font-medium">Follow Us</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = iconMap[social.name];
                return (
                  <Link key={social.name} href={social.href} target="_blank" rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors">
                    <Icon className="w-6 h-6" />
                    <span className="sr-only">{social.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground space-y-2">
          <p>&copy; {new Date().getFullYear()} {companyInfo?.name || 'JH Smart Solutions'}. All rights reserved.</p>
          <p>
            Designed & Developed by <a href="#" className="font-semibold text-primary hover:underline">{companyInfo?.name || 'JH Smart Solutions'}</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
