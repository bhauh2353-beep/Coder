"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { ServiceQuoteModal } from '../ServiceQuoteModal';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { PricingPlan } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";


const Pricing = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('');
    const backgroundImage = PlaceHolderImages.find(p => p.id === 'pricing-background');
    
    const firestore = useFirestore();
    const plansCollection = useMemo(() => {
        if (!firestore) return null;
        return collection(firestore, 'pricingPlans');
    }, [firestore]);

    const { data: pricingPlans, isLoading } = useCollection<PricingPlan>(plansCollection);

    const plugin = useRef(
      Autoplay({ delay: 3000, stopOnInteraction: true, stopOnMouseEnter: true })
    );

    const handleBookNow = (planName: string) => {
        setSelectedPlan(planName);
        setModalOpen(true);
    }
  return (
    <section id="pricing" className="relative w-full py-2 md:py-4 overflow-hidden">
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
          <h2 className="text-3xl md:text-4xl font-headline font-bold">Affordable Pricing</h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Choose a plan that works for you. All our plans are flexible and designed for growth.
          </p>
        </div>
        
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                plugins={[plugin.current]}
                className="w-full max-w-6xl mx-auto"
            >
                <CarouselContent>
                    {isLoading && Array.from({ length: 4 }).map((_, i) => (
                         <CarouselItem key={i} className="basis-1/2 lg:basis-1/4">
                            <div className="p-1">
                                <Card className="flex flex-col shadow-lg bg-card/80 backdrop-blur-sm p-4 h-full">
                                    <Skeleton className="h-5 w-28" />
                                    <Skeleton className="h-3 w-40 mt-2" />
                                    <Skeleton className="h-7 w-20 mt-4" />
                                    <div className="flex-grow mt-4 space-y-2">
                                        <Skeleton className="h-3 w-full" />
                                        <Skeleton className="h-3 w-full" />
                                        <Skeleton className="h-3 w-2/3" />
                                    </div>
                                    <Skeleton className="h-9 w-full mt-4" />
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                    {!isLoading && pricingPlans?.map((plan, index) => (
                        <CarouselItem key={index} className="basis-1/2 lg:basis-1/4">
                            <div className='p-1 h-full'>
                                <Card className="flex flex-col shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-card/80 backdrop-blur-sm h-full">
                                <CardHeader className="p-4">
                                    <CardTitle className='font-headline text-lg'>{plan.name}</CardTitle>
                                    <CardDescription className="text-xs">{plan.description}</CardDescription>
                                    <div className="text-3xl font-bold font-headline pt-2">
                                        {plan.price}
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow p-4">
                                    <ul className="space-y-2">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-green-500" />
                                        <span className='text-muted-foreground text-xs'>{feature}</span>
                                        </li>
                                    ))}
                                    </ul>
                                </CardContent>
                                <CardFooter className="p-4">
                                    <DialogTrigger asChild>
                                        <Button className="w-full" size="sm" onClick={() => handleBookNow(plan.name)}>Book Now</Button>
                                    </DialogTrigger>
                                </CardFooter>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
            {selectedPlan && <ServiceQuoteModal serviceName={selectedPlan} setOpen={setModalOpen}/>}
        </Dialog>
      </div>
    </section>
  );
};

export default Pricing;
