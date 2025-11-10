"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { projects } from '@/lib/data';
import AnimateOnScroll from '../AnimateOnScroll';

const Projects = () => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="w-full py-20 md:py-32 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">Our Recent Work</h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Take a look at some of the projects we're proud of.
          </p>
        </div>

        <Tabs defaultValue="All" className="w-full" onValueChange={setFilter}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            {categories.map(category => (
                <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={filter}>
            <div className="grid md:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <AnimateOnScroll key={index} delay={index * 100}>
                  <Card className="overflow-hidden h-full flex flex-col shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
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
