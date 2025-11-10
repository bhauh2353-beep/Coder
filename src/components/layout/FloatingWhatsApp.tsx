"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState, useEffect } from "react";

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
      className="lucide lucide-message-circle"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
);


const FloatingWhatsApp = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);

        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const phoneNumber = "919000000000"; // Replace with your actual number

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
