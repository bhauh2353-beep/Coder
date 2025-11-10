'use client';

import { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Service } from '@/lib/types';
import { iconMap } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { ServiceQuoteModal } from '../ServiceQuoteModal';
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

const Services = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState('');
    const backgroundImage = PlaceHolderImages.find(p => p.id === 'services-background');

    const firestore = useFirestore();
    const servicesCollection = useMemo(() => {
        if (!firestore) return null;
        return collection(firestore, 'services');
    }, [firestore]);
    
    const { data: services, isLoading } = useCollection<Service>(servicesCollection);

    const plugin = useRef(
      Autoplay({ delay: 3000, stopOnInteraction: true, stopOnMouseEnter: true })
    );
    
    const handleGetQuote = (serviceTitle: string) => {
        setSelectedService(serviceTitle);
        setModalOpen(true);
    };

    const renderIcon = (iconName: string) => {
        const IconComponent = iconMap[iconName];
        return IconComponent ? <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-primary" /> : null;
    }

  return (
    <section id="services" className="relative w-full py-8 md:py-12 overflow-hidden">
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
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Our Services</h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
                We offer a wide range of digital services to help your business succeed online.
            </p>
            </div>

            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    plugins={[plugin.current]}
                    className="w-full max-w-sm md:max-w-6xl mx-auto"
                >
                    <CarouselContent>
                        {isLoading && Array.from({ length: 6 }).map((_, i) => (
                            <CarouselItem key={i} className="basis-1/3">
                                <div className="p-1 h-full">
                                    <Card className="text-center flex flex-col items-center shadow-lg bg-card/80 backdrop-blur-sm p-2 md:p-6 h-full">
                                        <Skeleton className="w-10 h-10 md:w-16 md:h-16 rounded-full" />
                                        <Skeleton className="h-5 md:h-6 w-20 md:w-32 mt-3 md:mt-4" />
                                        <Skeleton className="h-3 md:h-4 w-24 md:w-48 mt-2" />
                                        <Skeleton className="h-8 md:h-10 w-20 md:w-24 mt-4 md:mt-6" />
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                        {!isLoading && services?.map((service) => (
                            <CarouselItem key={service.id} className="basis-1/3">
                                <div className='p-1 h-full'>
                                    <Card className="text-center flex flex-col items-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-card/80 backdrop-blur-sm h-full p-2 md:p-4">
                                    <CardHeader className="items-center p-2 md:p-4">
                                        <div className="bg-primary/10 p-3 md:p-4 rounded-full">
                                            {renderIcon(service.icon)}
                                        </div>
                                        <CardTitle className="pt-2 md:pt-4 font-headline text-sm md:text-xl">{service.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow p-2 md:p-4">
                                        <CardDescription className="text-xs md:text-sm">{service.description}</CardDescription>
                                    </CardContent>
                                    <CardFooter className="p-2 md:p-4">
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" onClick={() => handleGetQuote(service.title)}>
                                                Get Quote
                                            </Button>
                                        </DialogTrigger>
                                    </CardFooter>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden sm:flex"/>
                    <CarouselNext className="hidden sm:flex"/>
                </Carousel>
                {selectedService && <ServiceQuoteModal serviceName={selectedService} setOpen={setModalOpen}/>}
            </Dialog>
        </div>
    </section>
  );
};

export default Services;
