'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, setDocumentNonBlocking, deleteDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Briefcase, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Project } from '@/lib/types';
import { defaultProjects } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

const projectSchema = z.object({
  title: z.string().min(2, "Title is required."),
  description: z.string().min(10, "Description is required."),
  category: z.string().min(1, "Category is required."),
  imageUrl: z.string().url("A valid image URL is required."),
  imageHint: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const ManageProjectsPage = () => {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();

  const projectsCollection = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'projects');
  }, [firestore]);

  const { data: projects, isLoading } = useCollection<Project>(projectsCollection);
  
  useEffect(() => {
    if (firestore && projects?.length === 0 && !isLoading) {
      const populateProjects = async () => {
        if (!projectsCollection) return;
        for (const project of defaultProjects) {
          const newDocRef = doc(projectsCollection);
          addDocumentNonBlocking(projectsCollection, { ...project, id: newDocRef.id });
        }
      };
      populateProjects();
    }
  }, [firestore, projects, isLoading, projectsCollection]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
  });

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (editingProject) {
      reset(editingProject);
    } else {
      reset({ title: '', description: '', category: '', imageUrl: '' });
    }
  }, [editingProject, reset]);

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p>Loading...</p>
      </div>
    );
  }
  
  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingProject(null);
    reset({ title: '', description: '', category: '', imageUrl: '' });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
      if(confirm('Are you sure you want to delete this project?')) {
        if (!firestore) return;
        const docRef = doc(firestore, 'projects', id);
        deleteDocumentNonBlocking(docRef);
        toast({ title: 'Success', description: 'Project deleted successfully.' });
      }
  }

  const onSubmit = (data: ProjectFormValues) => {
    if(!projectsCollection || !firestore) return;
    const id = editingProject ? editingProject.id : doc(projectsCollection).id;
    const docRef = doc(firestore, 'projects', id);
    setDocumentNonBlocking(docRef, { ...data, id }, { merge: true });
    
    toast({
        title: "Success",
        description: editingProject ? "Project updated successfully." : "Project added successfully."
    });

    setIsDialogOpen(false);
    setEditingProject(null);
  };
  
  const categories = ['Websites', 'Apps', 'Automation'];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className='flex items-center gap-4'>
            <Briefcase className="w-8 h-8" />
            <h1 className="text-3xl font-bold font-headline">Manage Projects</h1>
        </div>
        <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Project
        </Button>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
                <DialogDescription>
                    {editingProject ? 'Update the details for your project.' : 'Fill in the details for the new project.'}
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" {...register('title')} />
                    {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(cat => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" {...register('description')} />
                    {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input id="imageUrl" {...register('imageUrl')} placeholder="https://picsum.photos/seed/1/600/400" />
                     {errors.imageUrl && <p className="text-sm text-destructive">{errors.imageUrl.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="imageHint">Image Hint (for AI)</Label>
                    <Input id="imageHint" {...register('imageHint')} placeholder="e.g. web design" />
                </div>
                <DialogFooter>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Project'}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
            <CardTitle>Your Projects</CardTitle>
            <CardDescription>
                A list of all your portfolio projects.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-16 w-24 rounded-md" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                        </TableRow>
                    ))}
                    {!isLoading && projects?.map((project) => (
                        <TableRow key={project.id}>
                            <TableCell>
                                <Image src={project.imageUrl} alt={project.title} width={100} height={60} className="rounded-md object-cover" />
                            </TableCell>
                            <TableCell>{project.title}</TableCell>
                            <TableCell>{project.category}</TableCell>
                            <TableCell>{project.description}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(project)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(project.id)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default ManageProjectsPage;

    