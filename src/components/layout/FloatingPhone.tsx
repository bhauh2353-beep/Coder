"use client";

import { useMemo, useState, useEffect } from 'react';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Phone } from "lucide-react";

const FloatingPhone = () => {
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

    const phoneNumber = companyInfo?.phone || "919000000000";

    if (!isMounted) {
        return null;
    }

    return (
        <div className={cn(
            "fixed bottom-24 right-6 z-50 transition-opacity duration-300",
            isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
            <Button asChild size="icon" className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg">
                <Link href={`tel:${phoneNumber}`}>
                    <Phone />
                </Link>
            </Button>
        </div>
    );
};

export default FloatingPhone;
