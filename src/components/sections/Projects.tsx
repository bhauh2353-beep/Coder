"use client";

import { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnimateOnScroll from '../AnimateOnScroll';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Project } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";


const Projects = () => {
  const [filter, setFilter] = useState('All');
  const backgroundImage = PlaceHolderImages.find(p => p.id === 'projects-background');

  const firestore = useFirestore();
  const projectsCollection = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'projects');
  }, [firestore]);

  const { data: projects, isLoading } = useCollection<Project>(projectsCollection);
  
  const plugin = useRef(
      Autoplay({ delay: 3000, stopOnInteraction: true, stopOnMouseEnter: true })
    );

  const categories = useMemo(() => {
    if (!projects) return ['All', 'Websites', 'Apps', 'Automation'];
    const uniqueCategories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];
    // Ensure default categories are present if there are no projects yet
    if (uniqueCategories.length === 1) return ['All', 'Websites', 'Apps', 'Automation'];
    return uniqueCategories;
  }, [projects]);
  
  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (filter === 'All') return projects;
    return projects.filter(p => p.category === filter);
  }, [projects, filter]);


  return (
    <section id="projects" className="relative w-full py-2 md:py-4 overflow-hidden">
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
          <h2 className="text-3xl md:text-4xl font-headline font-bold">Our Recent Work</h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Take a look at some of the projects we're proud of.
          </p>
        </div>

        <Tabs defaultValue="All" className="w-full" onValueChange={setFilter}>
          <div className="flex justify-center mb-8">
            <TabsList className="bg-background/50 backdrop-blur-sm">
              {categories.map(category => (
                  <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
              ))}
            </TabsList>
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
                    <CarouselItem key={index} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                       <div className='p-1 h-full'>
                        <AnimateOnScroll delay={index * 100} className='h-full'>
                          <Card className="overflow-hidden h-full flex flex-col shadow-lg bg-card/80 backdrop-blur-sm">
                              <div className="aspect-video relative w-full">
                                 <Skeleton className="w-full h-full" />
                              </div>
                            <CardHeader>
                              <Skeleton className="h-6 w-3/4" />
                            </CardHeader>
                            <CardContent className="flex-grow">
                               <Skeleton className="h-4 w-full" />
                               <Skeleton className="h-4 w-2/3 mt-2" />
                            </CardContent>
                            <CardFooter>
                              <Skeleton className="h-10 w-28" />
                            </CardFooter>
                          </Card>
                        </AnimateOnScroll>
                      </div>
                    </CarouselItem>
                  ))}
                  {!isLoading && filteredProjects.map((project, index) => (
                    <CarouselItem key={project.id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                       <div className='p-1 h-full'>
                        <AnimateOnScroll delay={index * 100} className='h-full'>
                          <Card className="overflow-hidden h-full flex flex-col shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-card/80 backdrop-blur-sm">
                            {project.imageUrl && (
                              <div className="aspect-video relative w-full">
                                 <Image
                                  src={project.imageUrl}
                                  alt={project.title}
                                  fill
                                  className="object-cover"
                                  data-ai-hint={project.imageHint}
                                />
                              </div>
                            )}
                            <CardHeader>
                              <CardTitle className="font-headline">{project.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow">
                              <p className="text-muted-foreground text-sm">{project.description}</p>
                            </CardContent>
                            <CardFooter>
                              <Button variant="outline">View Demo</Button>
                            </CardFooter>
                          </Card>
                        </AnimateOnScroll>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className='hidden md:flex' />
                <CarouselNext className='hidden md:flex' />
            </Carousel>
        </Tabs>
      </div>
    </section>
  );
};

export default Projects;
