"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ScrollToTop = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

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
        toggleVisibility();

        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);


    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    if (!isMounted) {
        return null;
    }

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={scrollToTop}
            className={cn(
                "fixed bottom-6 right-24 z-50 rounded-full transition-opacity duration-300",
                isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
        >
            <ArrowUp className="h-4 w-4" />
            <span className="sr-only">Go to top</span>
        </Button>
    );
};

export default ScrollToTop;