
"use client";

import { useMemo, useState, useEffect } from 'react';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

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


const FloatingWhatsApp = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    
    const firestore = useFirestore();
    const companyInfoRef = useMemo(() => {
        if (!firestore) return null;
        return doc(firestore, 'companyInfo', 'main');
    }, [firestore]);
    const { data: companyInfo } = useDoc(companyInfoRef);

    useEffect(() => {
        setIsMounted(true);
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        toggleVisibility(); // Check on mount

        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const phoneNumber = (companyInfo?.phone || "+917972688626").replace(/[\s]/g, '');

    if (!isMounted) {
        return null;
    }

    return (
        <div className={cn(
            "fixed bottom-6 right-6 z-50 transition-opacity duration-300",
            isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
            <Button asChild size="icon" className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white shadow-lg">
                <Link href={`https://wa.me/${phoneNumber}`} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon />
                </Link>
            </Button>
        </div>
    );
};

export default FloatingWhatsApp;
