'use client';

import { useMemo, useRef } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Testimonial } from '@/lib/types';
import { Star } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Skeleton } from '../ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";

const Testimonials = () => {
    const backgroundImage = PlaceHolderImages.find(p => p.id === 'testimonials-background');
    const firestore = useFirestore();
    const testimonialsCollection = useMemo(() => {
        if (!firestore) return null;
        return collection(firestore, 'testimonials');
    }, [firestore]);

    const { data: testimonials, isLoading } = useCollection<Testimonial>(testimonialsCollection);
    
    const plugin = useRef(
      Autoplay({ delay: 3000, stopOnInteraction: true, stopOnMouseEnter: true })
    );

  return (
    <section id="testimonials" className="relative w-full py-12 md:py-16 overflow-hidden">
        {backgroundImage && (
            <Image
                src={backgroundImage.imageUrl}
                alt={backgroundImage.description}
                fill
                className="object-cover"
                data-ai-hint={backgroundImage.imageHint}
            />
        )}
        <div className="absolute inset-0 bg-background/90"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-xl md:text-2xl font-headline font-bold">What Our Clients Say</h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto text-sm">
            We are trusted by businesses and individuals. Here's what they think about us.
          </p>
        </div>

         <Carousel
            opts={{
                align: "start",
                loop: true,
            }}
            plugins={[plugin.current]}
            className="w-full max-w-7xl mx-auto"
        >
            <CarouselContent className="-ml-2">
                {isLoading && Array.from({ length: 4 }).map((_, index) => (
                    <CarouselItem key={index} className="basis-1/2 md:basis-1/4 p-1">
                        <div className="h-full">
                            <Card className="h-full shadow-lg bg-card/80 backdrop-blur-sm">
                                <CardContent className="flex flex-col items-center text-center p-1 md:p-2 gap-1 md:gap-2 h-full">
                                    <Skeleton className="w-10 h-10 md:w-12 md:h-12 rounded-full mt-2" />
                                    <div className='flex flex-col items-center gap-2 w-full p-2'>
                                        <Skeleton className="h-3 w-full" />
                                        <Skeleton className="h-3 w-4/5" />
                                    </div>
                                    <div className="flex flex-col items-center w-full mt-auto pb-2">
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-4 w-24 mt-2" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
                {!isLoading && testimonials?.map((testimonial) => (
                    <CarouselItem key={testimonial.id} className="basis-1/2 md:basis-1/4 p-1">
                        <div className='h-full'>
                            <Card className="h-full shadow-lg bg-card/80 backdrop-blur-sm">
                                <CardContent className="flex flex-col items-center text-center p-1 h-full gap-1">
                                {testimonial.clientPhotoUrl && (
                                    <div className="w-10 h-10 md:w-12 md:h-12 relative mt-1 md:mt-2">
                                        <Image
                                        src={testimonial.clientPhotoUrl}
                                        alt={`Photo of ${testimonial.clientName}`}
                                        fill
                                        className="rounded-full object-cover"
                                        data-ai-hint={testimonial.imageHint}
                                        />
                                    </div>
                                )}
                                <p className="text-muted-foreground flex-grow text-[10px] md:text-xs px-1">"{testimonial.message}"</p>
                                <div className="flex flex-col items-center mt-auto pb-1 md:pb-2">
                                    <div className="flex items-center gap-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-3 h-3 md:w-3 md:h-3 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'}`}
                                        />
                                        ))}
                                    </div>
                                    <span className="font-bold font-headline mt-1 md:mt-2 text-xs md:text-sm">{testimonial.clientName}</span>
                                </div>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
             <CarouselPrevious className="hidden lg:flex" />
            <CarouselNext className="hidden lg:flex" />
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonials;
