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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  imageUrl: z.string().optional(),
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

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);


  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
  });

  const currentImageUrl = watch('imageUrl');

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (isFormDialogOpen) {
      if (editingProject) {
        reset(editingProject);
      } else {
        reset({ title: '', description: '', category: '', imageUrl: '', imageHint: '' });
      }
    }
  }, [editingProject, reset, isFormDialogOpen]);

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 600;
          const MAX_HEIGHT = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg');
          setValue('imageUrl', dataUrl, { shouldValidate: true });

          // If editing an existing project, save the image immediately
          if (editingProject && firestore) {
            const docRef = doc(firestore, 'projects', editingProject.id);
            setDocumentNonBlocking(docRef, { imageUrl: dataUrl }, { merge: true });
            toast({
              title: "Image Updated",
              description: "The project image has been saved.",
            });
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsFormDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingProject(null);
    setIsFormDialogOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setDeletingProjectId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!firestore || !deletingProjectId) return;
    const docRef = doc(firestore, 'projects', deletingProjectId);
    deleteDocumentNonBlocking(docRef);
    toast({ title: 'Success', description: 'Project deleted successfully.' });
    setIsDeleteDialogOpen(false);
    setDeletingProjectId(null);
  };

  const onSubmit = (data: ProjectFormValues) => {
    if(!projectsCollection || !firestore) return;
    
    if (!data.imageUrl) {
        toast({
            variant: "destructive",
            title: "Image Required",
            description: "Please upload an image for the project.",
        });
        return;
    }

    const id = editingProject ? editingProject.id : doc(projectsCollection).id;
    const docRef = doc(firestore, 'projects', id);
    setDocumentNonBlocking(docRef, { ...data, id }, { merge: true });
    
    toast({
        title: "Success",
        description: editingProject ? "Project updated successfully." : "Project added successfully."
    });

    setIsFormDialogOpen(false);
    setEditingProject(null);
  };
  
  const categories = ['Websites', 'Apps', 'Automation'];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className='flex items-center gap-4'>
            <Briefcase className="w-5 h-5" />
            <h1 className="text-lg font-bold font-headline">Manage Projects</h1>
        </div>
        <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Project
        </Button>
      </div>
      
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
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
                    <Label htmlFor="imageUrl">Project Image</Label>
                    <div className="flex items-center gap-4">
                      {currentImageUrl && (
                        <Image src={currentImageUrl} alt="Project Image" width={100} height={60} className="rounded-md object-cover border p-1" />
                      )}
                      <Input id="imageUrlInput" type="file" accept="image/*" onChange={handleImageUpload} className="max-w-sm" />
                    </div>
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
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


      <Card>
        <CardHeader>
            <CardTitle className='text-xl'>Your Projects</CardTitle>
            <CardDescription className='text-sm'>
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
                                <Image src={project.imageUrl || 'https://placehold.co/100x60'} alt={project.title} width={100} height={60} className="rounded-md object-cover" />
                            </TableCell>
                            <TableCell>{project.title}</TableCell>
                            <TableCell>{project.category}</TableCell>
                            <TableCell>{project.description}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(project)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(project.id)}>
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
