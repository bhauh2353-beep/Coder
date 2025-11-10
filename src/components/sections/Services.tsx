'use client';

import { useState, useMemo } from 'react';
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
    
    const handleGetQuote = (serviceTitle: string) => {
        setSelectedService(serviceTitle);
        setModalOpen(true);
    };

    const renderIcon = (iconName: string) => {
        const IconComponent = iconMap[iconName];
        return IconComponent ? <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-primary" /> : null;
    }

  return (
    <section id="services" className="relative w-full py-12 md:py-16 overflow-hidden">
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
        <div className="px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-headline font-bold">Our Services</h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto text-sm md:text-base">
                We offer a wide range of digital services to help your business succeed online.
            </p>
            </div>

            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {isLoading && Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-full">
                            <Card className="text-center flex flex-col items-center shadow-lg bg-card/80 backdrop-blur-sm p-2 md:p-4 h-full overflow-hidden">
                                <div className="aspect-video relative w-full">
                                    <Skeleton className="w-full h-full" />
                                </div>
                                <Skeleton className="h-5 md:h-6 w-20 md:w-32 mt-3 md:mt-4" />
                                <div className='flex-grow mt-2 space-y-2'>
                                    <Skeleton className="h-3 md:h-4 w-full" />
                                    <Skeleton className="h-3 md:h-4 w-5/6" />
                                </div>
                                <Skeleton className="h-8 md:h-9 w-20 md:w-24 mt-4 md:mt-6" />
                            </Card>
                        </div>
                    ))}
                    {!isLoading && services?.map((service) => (
                        <div key={service.id} className='h-full'>
                            <Card className="text-center flex flex-col items-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-card/80 backdrop-blur-sm h-full overflow-hidden">
                            {service.imageUrl && (
                              <div className="aspect-video relative w-full">
                                 <Image
                                  src={service.imageUrl}
                                  alt={service.title}
                                  fill
                                  className="object-cover"
                                  data-ai-hint={service.imageHint}
                                />
                              </div>
                            )}
                            <CardHeader className="items-center p-2">
                                <CardTitle className="pt-2 font-headline text-sm md:text-base">{service.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow p-2">
                                <CardDescription className="text-xs">{service.description}</CardDescription>
                            </CardContent>
                            <CardFooter className="p-2 mt-auto">
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" onClick={() => handleGetQuote(service.title)}>
                                        Get Quote
                                    </Button>
                                </DialogTrigger>
                            </CardFooter>
                            </Card>
                        </div>
                    ))}
                </div>
                {selectedService && <ServiceQuoteModal serviceName={selectedService} setOpen={setModalOpen}/>}
            </Dialog>
        </div>
    </section>
  );
};

export default Services;
