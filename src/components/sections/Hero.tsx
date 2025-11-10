'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { highlights } from '@/lib/data';
import { Card } from '../ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Typewriter from '../Typewriter';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';

const Hero = () => {
  const handleScrollLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-background');
  
  const firestore = useFirestore();
  const companyInfoRef = useMemo(() => {
    if (!firestore) return null;
    return doc(firestore, 'companyInfo', 'main');
  }, [firestore]);
  const { data: companyInfo, isLoading: isCompanyInfoLoading } = useDoc(companyInfoRef);

  const heroText = companyInfo?.heroText || 'We Build Websites & Apps That Grow Your Business.';
  const slogan = companyInfo?.slogan || 'Smart, Fast, and Affordable Digital Solutions.';

  return (
    <section id="home" className="relative w-full pt-20 pb-8 md:pt-24 md:pb-12 overflow-hidden">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          data-ai-hint={heroImage.imageHint}
          priority
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="min-h-[140px] md:min-h-[150px]">
          {isCompanyInfoLoading ? (
            <>
              <Skeleton className="h-12 w-3/4 mx-auto" />
              <Skeleton className="h-12 w-2/3 mx-auto mt-4" />
            </>
          ) : (
             <Typewriter
              text={heroText}
              className="text-4xl md:text-6xl font-headline font-bold text-foreground leading-tight"
            />
          )}
        </div>
        <div className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          {isCompanyInfoLoading ? <Skeleton className="h-6 w-1/2 mx-auto" /> : slogan}
        </div>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="#contact" onClick={(e) => handleScrollLink(e, '#contact')}>Get a Free Quote</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="bg-background/50 hover:bg-background/80">
            <Link href="#projects" onClick={(e) => handleScrollLink(e, '#projects')}>View Our Projects</Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10 mt-16 md:mt-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {highlights.map((highlight, index) => (
            <Card key={index} className="p-4 bg-card/70 backdrop-blur-lg border border-border/20 shadow-lg">
              <div className="flex flex-col items-center justify-center text-center gap-2">
                <highlight.icon className="w-8 h-8 text-primary" />
                <span className="font-semibold text-sm md:text-base">{highlight.text}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
