
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
    <section id="projects" className="relative w-full py-8 md:py-12 overflow-hidden">
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
          <h2 className="text-xl md:text-2xl font-headline font-bold">Our Recent Work</h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto text-sm">
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
                <CarouselContent className="-ml-1">
                  {isLoading && Array.from({ length: 4 }).map((_, index) => (
                    <CarouselItem key={index} className="basis-1/2 lg:basis-1/4 p-1">
                       <div className='h-full'>
                        <AnimateOnScroll delay={index * 100} className='h-full'>
                          <Card className="overflow-hidden h-full flex flex-col shadow-lg bg-card/80 backdrop-blur-sm">
                              <div className="aspect-video relative w-full">
                                 <Skeleton className="w-full h-full" />
                              </div>
                            <CardHeader className='p-2'>
                              <Skeleton className="h-5 w-3/4" />
                            </CardHeader>
                            <CardContent className="flex-grow p-2">
                               <Skeleton className="h-3 w-full" />
                               <Skeleton className="h-3 w-2/3 mt-2" />
                            </CardContent>
                            <CardFooter className='p-2'>
                              <Skeleton className="h-8 w-24" />
                            </CardFooter>
                          </Card>
                        </AnimateOnScroll>
                      </div>
                    </CarouselItem>
                  ))}
                  {!isLoading && filteredProjects.map((project, index) => (
                    <CarouselItem key={project.id} className="basis-1/2 lg:basis-1/4 p-1">
                       <div className='h-full'>
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
                            <CardHeader className='p-2'>
                              <CardTitle className="font-headline text-xs">{project.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow p-2">
                              <p className="text-muted-foreground text-[10px] leading-tight">{project.description}</p>
                            </CardContent>
                            <CardFooter className='p-2'>
                              <Button variant="outline" size="sm" className="h-8 text-xs">View Demo</Button>
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
