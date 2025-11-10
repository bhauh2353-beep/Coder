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

const serviceSchema = z.object({
  icon: z.string().min(1, "Icon is required."),
  title: z.string().min(2, "Title is required."),
  description: z.string().min(10, "Description is required."),
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
  

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
  });

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (editingService) {
      reset(editingService);
    } else {
      reset({ icon: '', title: '', description: '' });
    }
  }, [editingService, reset]);

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p>Loading...</p>
      </div>
    );
  }
  
  const handleEdit = (service: Service) => {
    setEditingService(service);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingService(null);
    reset({ icon: '', title: '', description: '' });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
      if(confirm('Are you sure you want to delete this service?')) {
        if (!firestore) return;
        const docRef = doc(firestore, 'services', id);
        deleteDocumentNonBlocking(docRef);
        toast({ title: 'Success', description: 'Service deleted successfully.' });
      }
  }

  const onSubmit = (data: ServiceFormValues) => {
    if(!servicesCollection || !firestore) return;
    const id = editingService ? editingService.id : doc(servicesCollection).id;
    const docRef = doc(firestore, 'services', id);
    setDocumentNonBlocking(docRef, { ...data, id }, { merge: true });
    
    toast({
        title: "Success",
        description: editingService ? "Service updated successfully." : "Service added successfully."
    });

    setIsDialogOpen(false);
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
            <Settings className="w-8 h-8" />
            <h1 className="text-3xl font-bold font-headline">Manage Services</h1>
        </div>
        <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Service
        </Button>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                <DialogFooter>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Service'}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
            <CardTitle>Your Services</CardTitle>
            <CardDescription>
                A list of all the services you offer.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Icon</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && Array.from({ length: 6 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-6 w-6 rounded-full" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                        </TableRow>
                    ))}
                    {!isLoading && services?.map((service) => (
                        <TableRow key={service.id}>
                            <TableCell>{renderIcon(service.icon)}</TableCell>
                            <TableCell>{service.title}</TableCell>
                            <TableCell>{service.description}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(service)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(service.id)}>
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
