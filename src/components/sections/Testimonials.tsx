import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { testimonials } from '@/lib/data';
import { Star } from 'lucide-react';

const Testimonials = () => {
  return (
    <section id="testimonials" className="w-full py-20 md:py-32 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">What Our Clients Say</h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            We are trusted by businesses and individuals. Here's what they think about us.
          </p>
        </div>

        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                <div className="p-1">
                  <Card className="h-full shadow-lg">
                    <CardContent className="flex flex-col items-center text-center p-6 gap-4">
                      {testimonial.image && (
                         <Image
                          src={testimonial.image.imageUrl}
                          alt={`Photo of ${testimonial.name}`}
                          width={80}
                          height={80}
                          className="rounded-full"
                          data-ai-hint={testimonial.image.imageHint}
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
                        <span className="font-bold font-headline mt-2">{testimonial.name}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonials;
