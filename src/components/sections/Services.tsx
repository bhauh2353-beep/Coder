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
        return IconComponent ? <IconComponent className="w-8 h-8 text-primary" /> : null;
    }

  return (
    <section id="services" className="relative w-full py-20 md:py-32 overflow-hidden">
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
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoading && Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="text-center flex flex-col items-center shadow-lg bg-card/80 backdrop-blur-sm p-6">
                        <Skeleton className="w-16 h-16 rounded-full" />
                        <Skeleton className="h-6 w-32 mt-4" />
                        <Skeleton className="h-4 w-48 mt-2" />
                        <Skeleton className="h-10 w-24 mt-6" />
                    </Card>
                ))}
                {!isLoading && services?.map((service) => (
                    <Card key={service.id} className="text-center flex flex-col items-center shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-card/80 backdrop-blur-sm">
                    <CardHeader className="items-center">
                        <div className="bg-primary/10 p-4 rounded-full">
                            {renderIcon(service.icon)}
                        </div>
                        <CardTitle className="pt-4 font-headline">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <CardDescription>{service.description}</CardDescription>
                    </CardContent>
                    <CardFooter>
                        <DialogTrigger asChild>
                            <Button variant="outline" onClick={() => handleGetQuote(service.title)}>
                                Get Quote
                            </Button>
                        </DialogTrigger>
                    </CardFooter>
                    </Card>
                ))}
                </div>
                {selectedService && <ServiceQuoteModal serviceName={selectedService} setOpen={setModalOpen}/>}
            </Dialog>
        </div>
    </section>
  );
};

export default Services;
