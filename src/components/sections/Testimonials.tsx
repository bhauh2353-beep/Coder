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
          <h2 className="text-3xl md:text-4xl font-headline font-bold">What Our Clients Say</h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
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
            <CarouselContent>
                {isLoading && Array.from({ length: 4 }).map((_, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
                        <div className="p-1 h-full">
                            <Card className="h-full shadow-lg bg-card/80 backdrop-blur-sm">
                                <CardContent className="flex flex-col items-center text-center p-6 gap-4">
                                    <Skeleton className="w-20 h-20 rounded-full" />
                                    <div className='flex flex-col items-center gap-2 w-full'>
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-4/5" />
                                    </div>
                                    <div className="flex flex-col items-center w-full">
                                        <Skeleton className="h-5 w-24" />
                                        <Skeleton className="h-4 w-32 mt-2" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
                {!isLoading && testimonials?.map((testimonial) => (
                    <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/4">
                        <div className='p-1 h-full'>
                            <Card className="h-full shadow-lg bg-card/80 backdrop-blur-sm">
                                <CardContent className="flex flex-col items-center text-center p-6 gap-4 h-full">
                                {testimonial.clientPhotoUrl && (
                                    <Image
                                    src={testimonial.clientPhotoUrl}
                                    alt={`Photo of ${testimonial.clientName}`}
                                    width={80}
                                    height={80}
                                    className="rounded-full"
                                    data-ai-hint={testimonial.imageHint}
                                    />
                                )}
                                <p className="text-muted-foreground flex-grow">"{testimonial.message}"</p>
                                <div className="flex flex-col items-center">
                                    <div className="flex items-center gap-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'}`}
                                        />
                                        ))}
                                    </div>
                                    <span className="font-bold font-headline mt-2">{testimonial.clientName}</span>
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
