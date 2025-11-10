"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { projects } from '@/lib/data';
import AnimateOnScroll from '../AnimateOnScroll';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const Projects = () => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];
  const backgroundImage = PlaceHolderImages.find(p => p.id === 'projects-background');

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="relative w-full py-20 md:py-32 overflow-hidden">
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
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8 bg-background/50 backdrop-blur-sm">
            {categories.map(category => (
                <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={filter}>
            <div className="grid md:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <AnimateOnScroll key={index} delay={index * 100}>
                  <Card className="overflow-hidden h-full flex flex-col shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-card/80 backdrop-blur-sm">
                    {project.image && (
                      <div className="aspect-video relative w-full">
                         <Image
                          src={project.image.imageUrl}
                          alt={project.title}
                          fill
                          className="object-cover"
                          data-ai-hint={project.image.imageHint}
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
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Projects;
