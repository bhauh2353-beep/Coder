'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { highlights } from '@/lib/data';
import { Card } from '../ui/card';

const Hero = () => {
  const handleScrollLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative w-full pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-violet-600 to-accent opacity-80"></div>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
      <div className="absolute inset-0" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}}></div>
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-headline font-bold text-foreground leading-tight">
          We Build Websites & Apps That Grow Your Business.
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Smart, Fast, and Affordable Digital Solutions.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="#contact" onClick={(e) => handleScrollLink(e, '#contact')}>Get a Free Quote</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
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
