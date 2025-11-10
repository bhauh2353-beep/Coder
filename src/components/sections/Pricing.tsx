"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { pricingPlans } from '@/lib/data';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { ServiceQuoteModal } from '../ServiceQuoteModal';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const Pricing = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('');
    const backgroundImage = PlaceHolderImages.find(p => p.id === 'pricing-background');

    const handleBookNow = (planName: string) => {
        setSelectedPlan(planName);
        setModalOpen(true);
    }
  return (
    <section id="pricing" className="relative w-full py-20 md:py-32 overflow-hidden">
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
            {pricingPlans.map((plan, index) => (
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
