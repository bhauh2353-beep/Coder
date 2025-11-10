'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, setDocumentNonBlocking, deleteDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { MessageSquare, PlusCircle, Edit, Trash2, Star } from 'lucide-react';
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
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Testimonial } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { defaultTestimonials } from '@/lib/data';

const testimonialSchema = z.object({
  clientName: z.string().min(2, "Client name is required."),
  message: z.string().min(10, "Message is required."),
  rating: z.number().min(1).max(5),
  clientPhotoUrl: z.string().url("A valid image URL is required."),
  imageHint: z.string().optional(),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

const ManageTestimonialsPage = () => {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();

  const testimonialsCollection = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'testimonials');
  }, [firestore]);
  
  const { data: testimonials, isLoading } = useCollection<Testimonial>(testimonialsCollection);

  useEffect(() => {
    if (firestore && testimonials?.length === 0 && !isLoading) {
      const populateTestimonials = async () => {
        if (!testimonialsCollection) return;
        for (const testimonial of defaultTestimonials) {
          const newDocRef = doc(testimonialsCollection);
          addDocumentNonBlocking(testimonialsCollection, { ...testimonial, id: newDocRef.id });
        }
      };
      populateTestimonials();
    }
  }, [firestore, testimonials, isLoading, testimonialsCollection]);


  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [deletingTestimonialId, setDeletingTestimonialId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: { rating: 5 }
  });

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);
  
  useEffect(() => {
    if (editingTestimonial) {
      reset(editingTestimonial);
    } else {
      reset({ clientName: '', message: '', rating: 5, clientPhotoUrl: '', imageHint: '' });
    }
  }, [editingTestimonial, reset]);

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setIsFormDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingTestimonial(null);
    reset({ clientName: '', message: '', rating: 5, clientPhotoUrl: '', imageHint: '' });
    setIsFormDialogOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setDeletingTestimonialId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!firestore || !deletingTestimonialId) return;
    const docRef = doc(firestore, 'testimonials', deletingTestimonialId);
    deleteDocumentNonBlocking(docRef);
    toast({ title: 'Success', description: 'Testimonial deleted successfully.' });
    setIsDeleteDialogOpen(false);
    setDeletingTestimonialId(null);
  };

  const onSubmit = (data: TestimonialFormValues) => {
    if (!testimonialsCollection || !firestore) return;
    const id = editingTestimonial ? editingTestimonial.id : doc(testimonialsCollection).id;
    const docRef = doc(firestore, 'testimonials', id);
    const testimonialData = {
        ...data,
        id,
        submissionDate: editingTestimonial?.submissionDate || new Date().toISOString(),
    }
    setDocumentNonBlocking(docRef, testimonialData, { merge: true });
    
    toast({
        title: "Success",
        description: editingTestimonial ? "Testimonial updated successfully." : "Testimonial added successfully."
    });

    setIsFormDialogOpen(false);
    setEditingTestimonial(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className='flex items-center gap-4'>
            <MessageSquare className="w-8 h-8" />
            <h1 className="text-3xl font-bold font-headline">Manage Testimonials</h1>
        </div>
        <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Testimonial
        </Button>
      </div>

      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</DialogTitle>
                <DialogDescription>
                    {editingTestimonial ? 'Update this testimonial.' : 'Fill in the details for the new testimonial.'}
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input id="clientName" {...register('clientName')} />
                    {errors.clientName && <p className="text-sm text-destructive">{errors.clientName.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" {...register('message')} />
                    {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label>Rating</Label>
                    <Controller
                        name="rating"
                        control={control}
                        render={({ field }) => (
                            <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-6 h-6 cursor-pointer ${i < field.value ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'}`}
                                        onClick={() => field.onChange(i + 1)}
                                    />
                                ))}
                            </div>
                        )}
                    />
                     {errors.rating && <p className="text-sm text-destructive">{errors.rating.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="clientPhotoUrl">Client Photo URL</Label>
                    <Input id="clientPhotoUrl" {...register('clientPhotoUrl')} placeholder="https://picsum.photos/seed/4/80/80" />
                     {errors.clientPhotoUrl && <p className="text-sm text-destructive">{errors.clientPhotoUrl.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="imageHint">Image Hint (for AI)</Label>
                    <Input id="imageHint" {...register('imageHint')} placeholder="e.g. smiling person" />
                </div>
                <DialogFooter>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Testimonial'}
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
              This action cannot be undone. This will permanently delete the testimonial.
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
            <CardTitle>Your Testimonials</CardTitle>
            <CardDescription>
                A list of all client testimonials.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Photo</TableHead>
                        <TableHead>Client Name</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-12 w-12 rounded-full" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                        </TableRow>
                    ))}
                    {!isLoading && testimonials?.map((testimonial) => (
                        <TableRow key={testimonial.id}>
                            <TableCell>
                                <Image src={testimonial.clientPhotoUrl} alt={testimonial.clientName} width={48} height={48} className="rounded-full object-cover" />
                            </TableCell>
                            <TableCell>{testimonial.clientName}</TableCell>
                            <TableCell>
                                <div className="flex items-center">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`} />
                                    ))}
                                </div>
                            </TableCell>
                            <TableCell className='max-w-xs truncate'>{testimonial.message}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(testimonial)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(testimonial.id)}>
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

export default ManageTestimonialsPage;
