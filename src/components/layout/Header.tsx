"use client";

import { useState, useEffect, type FC } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { navLinks } from '@/lib/data';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

const Header: FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('#home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);

      const sections = navLinks.map(link => document.querySelector(link.href));
      let currentSection = '#home';
      for (const section of sections) {
        if (section && window.scrollY >= section.offsetTop - 100) {
          currentSection = `#${section.id}`;
        }
      }
      setActiveLink(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({
        behavior: 'smooth'
    });
    // Close mobile menu on link click
    if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
    }
  };

  const NavMenu = ({ className }: { className?: string }) => (
    <nav className={cn('items-center space-x-6 text-sm font-medium', className)}>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={(e) => handleLinkClick(e, link.href)}
          className={cn(
            'transition-colors hover:text-primary',
            activeLink === link.href ? 'text-primary' : 'text-foreground/60',
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled ? 'bg-background/80 backdrop-blur-sm border-b' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo />

        <div className="hidden md:flex items-center gap-6">
          <NavMenu />
          <Button asChild>
            <Link href="#contact" onClick={(e) => handleLinkClick(e, '#contact')}>Get a Free Quote</Link>
          </Button>
        </div>

        <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full max-w-xs">
                    <div className="p-4 h-full flex flex-col">
                        <Logo />
                        <nav className="flex flex-col space-y-6 text-lg mt-10">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={(e) => handleLinkClick(e, link.href)}
                                    className={cn(
                                        'transition-colors hover:text-primary',
                                        activeLink === link.href ? 'text-primary' : 'text-foreground/80',
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                         <Button asChild className="mt-auto">
                            <Link href="#contact" onClick={(e) => handleLinkClick(e, '#contact')}>Get a Free Quote</Link>
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
