"use client";

import { useState, useEffect, type FC } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { navLinks } from '@/lib/data';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogIn, LogOut, LayoutDashboard } from 'lucide-react';
import { useUser } from '@/firebase';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getAuth, signOut } from 'firebase/auth';

const Header: FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('#home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isUserLoading } = useUser();

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);

      const sections = navLinks.map(link => {
        const element = document.querySelector(link.href);
        return element;
      }).filter(Boolean);

      let currentSection = '#home';
      for (const section of sections) {
        if (section && window.scrollY >= (section as HTMLElement).offsetTop - 100) {
          currentSection = `#${section.id}`;
        }
      }
      setActiveLink(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({
          behavior: 'smooth'
      });
    }
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

  const AuthContent = () => {
    if (isUserLoading) return null;
    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className='bg-primary text-primary-foreground'>
                  {getInitials(user.displayName || user.email)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
             <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.displayName || user.email}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/management">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Management</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    return (
      <Button asChild variant="outline">
        <Link href="/login">
          <LogIn className="mr-2 h-4 w-4" /> Login
        </Link>
      </Button>
    );
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled ? 'bg-background/80 backdrop-blur-sm border-b' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="relative group">
          <Logo />
          <span className="font-code text-primary absolute -left-4 -top-2 text-lg opacity-20 group-hover:opacity-80 transition-opacity duration-300" style={{ animation: 'float 4s ease-in-out infinite' }}>
            {"</>"}
          </span>
          <span className="font-code text-accent absolute -right-4 -bottom-2 text-lg opacity-20 group-hover:opacity-80 transition-opacity duration-300" style={{ animation: 'float 4s ease-in-out infinite 1s' }}>
            {"()"}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <NavMenu />
          <AuthContent />
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
                             {!user ? (
                              <Link
                                  href="/login"
                                  onClick={(e) => handleLinkClick(e, '/login')}
                                  className='transition-colors hover:text-primary text-foreground/80 flex items-center'
                              >
                                <LogIn className="mr-2 h-5 w-5" /> Login
                              </Link>
                            ) : (
                              <>
                                <Link
                                  href="/management"
                                  onClick={(e) => handleLinkClick(e, '/management')}
                                  className='transition-colors hover:text-primary text-foreground/80 flex items-center'
                                >
                                  <LayoutDashboard className="mr-2 h-5 w-5" /> Management
                                </Link>
                                <button
                                    onClick={() => {
                                      handleSignOut();
                                      setIsMobileMenuOpen(false);
                                    }}
                                    className='transition-colors hover:text-primary text-foreground/80 flex items-center text-lg'
                                >
                                  <LogOut className="mr-2 h-5 w-5" /> Logout
                                </button>
                              </>
                            )}
                        </nav>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
