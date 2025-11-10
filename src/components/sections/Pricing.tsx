"use client";

import { useState, useMemo } from 'react';
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

    const handleBookNow = (planName: string) => {
        setSelectedPlan(planName);
        setModalOpen(true);
    }
  return (
    <section id="pricing" className="relative w-full py-8 md:py-12 overflow-hidden">
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
            <div className="grid md:grid-cols-3 gap-8">
            {isLoading && Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="flex flex-col shadow-lg bg-card/80 backdrop-blur-sm p-6">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48 mt-2" />
                    <Skeleton className="h-8 w-24 mt-4" />
                    <div className="flex-grow mt-6 space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                    <Skeleton className="h-10 w-full mt-6" />
                </Card>
            ))}
            {!isLoading && pricingPlans?.map((plan, index) => (
                <Card key={index} className="flex flex-col shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className='font-headline'>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="text-4xl font-bold font-headline pt-4">
                        {plan.price}
                    </div>
                </CardHeader>
                <CardContent className="flex-grow">
                    <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className='text-muted-foreground'>{feature}</span>
                        </li>
                    ))}
                    </ul>
                </CardContent>
                <CardFooter>
                    <DialogTrigger asChild>
                        <Button className="w-full" onClick={() => handleBookNow(plan.name)}>Book Now</Button>
                    </DialogTrigger>
                </CardFooter>
                </Card>
            ))}
            </div>
            {selectedPlan && <ServiceQuoteModal serviceName={selectedPlan} setOpen={setModalOpen}/>}
        </Dialog>
      </div>
    </section>
  );
};

export default Pricing;
