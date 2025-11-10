'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, setDocumentNonBlocking, deleteDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Settings, PlusCircle, Edit, Trash2 } from 'lucide-react';
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
import type { Service } from '@/lib/types';
import { iconMap, defaultServices } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

const serviceSchema = z.object({
  icon: z.string().min(1, "Icon is required."),
  title: z.string().min(2, "Title is required."),
  description: z.string().min(10, "Description is required."),
  imageUrl: z.string().optional(),
  imageHint: z.string().optional(),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

const ManageServicesPage = () => {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();

  const servicesCollection = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'services');
  }, [firestore]);

  const { data: services, isLoading } = useCollection<Service>(servicesCollection);

  useEffect(() => {
    if (firestore && services?.length === 0 && !isLoading) {
      const populateServices = async () => {
        if (!servicesCollection) return;
        for (const service of defaultServices) {
          const newDocRef = doc(servicesCollection);
          addDocumentNonBlocking(servicesCollection, { ...service, id: newDocRef.id });
        }
      };
      populateServices();
    }
  }, [firestore, services, isLoading, servicesCollection]);
  

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
  });

  const currentImageUrl = watch('imageUrl');

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (isFormDialogOpen) {
      if (editingService) {
        reset(editingService);
      } else {
        reset({ icon: '', title: '', description: '', imageUrl: '', imageHint: '' });
      }
    }
  }, [editingService, reset, isFormDialogOpen]);

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

          // If editing an existing service, save the image immediately
          if (editingService && firestore) {
            const docRef = doc(firestore, 'services', editingService.id);
            setDocumentNonBlocking(docRef, { imageUrl: dataUrl }, { merge: true });
            toast({
              title: "Image Updated",
              description: "The service image has been saved.",
            });
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleEdit = (service: Service) => {
    setEditingService(service);
    setIsFormDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingService(null);
    setIsFormDialogOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setDeletingServiceId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!firestore || !deletingServiceId) return;
    const docRef = doc(firestore, 'services', deletingServiceId);
    deleteDocumentNonBlocking(docRef);
    toast({ title: 'Success', description: 'Service deleted successfully.' });
    setIsDeleteDialogOpen(false);
    setDeletingServiceId(null);
  };

  const onSubmit = (data: ServiceFormValues) => {
    if(!servicesCollection || !firestore) return;

    if (!data.imageUrl) {
        toast({
            variant: "destructive",
            title: "Image Required",
            description: "Please upload an image for the service.",
        });
        return;
    }

    const id = editingService ? editingService.id : doc(servicesCollection).id;
    const docRef = doc(firestore, 'services', id);
    setDocumentNonBlocking(docRef, { ...data, id }, { merge: true });
    
    toast({
        title: "Success",
        description: editingService ? "Service updated successfully." : "Service added successfully."
    });

    setIsFormDialogOpen(false);
    setEditingService(null);
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent className="w-6 h-6 text-primary" /> : null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className='flex items-center gap-4'>
            <Settings className="w-5 h-5" />
            <h1 className="text-lg font-bold font-headline">Manage Services</h1>
        </div>
        <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Service
        </Button>
      </div>
      
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
                <DialogDescription>
                    {editingService ? 'Update the details for your service.' : 'Fill in the details for the new service.'}
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" {...register('title')} />
                    {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="icon">Icon</Label>
                    <Controller
                        name="icon"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an icon" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(iconMap).map(iconName => (
                                        <SelectItem key={iconName} value={iconName}>
                                            <div className="flex items-center gap-2">
                                                {renderIcon(iconName)}
                                                <span>{iconName}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.icon && <p className="text-sm text-destructive">{errors.icon.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" {...register('description')} />
                    {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="imageUrl">Service Image</Label>
                    <div className="flex items-center gap-4">
                      {currentImageUrl && (
                        <Image src={currentImageUrl} alt="Service Image" width={100} height={60} className="rounded-md object-cover border p-1" />
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
                        {isSubmitting ? 'Saving...' : 'Save Service'}
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
              This action cannot be undone. This will permanently delete the service.
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
            <CardTitle className='text-xl'>Your Services</CardTitle>
            <CardDescription className='text-sm'>
                A list of all the services you offer.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Icon</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && Array.from({ length: 6 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-16 w-24 rounded-md" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-6 rounded-full" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                        </TableRow>
                    ))}
                    {!isLoading && services?.map((service) => (
                        <TableRow key={service.id}>
                            <TableCell>
                                {service.imageUrl ? (
                                    <Image src={service.imageUrl} alt={service.title} width={100} height={60} className="rounded-md object-cover" />
                                ) : (
                                    <div className='w-[100px] h-[60px] bg-muted rounded-md' />
                                )}
                            </TableCell>
                            <TableCell>{renderIcon(service.icon)}</TableCell>
                            <TableCell>{service.title}</TableCell>
                            <TableCell>{service.description}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(service)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(service.id)}>
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

export default ManageServicesPage;
    