'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, setDocumentNonBlocking, deleteDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { DollarSign, PlusCircle, Edit, Trash2 } from 'lucide-react';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { PricingPlan } from '@/lib/types';
import { defaultPricingPlans } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const pricingPlanSchema = z.object({
  name: z.string().min(2, "Name is required."),
  price: z.string().min(1, "Price is required."),
  description: z.string().min(10, "Description is required."),
  features: z.string().min(1, "At least one feature is required."),
});

type PricingPlanFormValues = z.infer<typeof pricingPlanSchema>;

const ManagePricingPage = () => {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();

  const plansCollection = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'pricingPlans');
  }, [firestore]);

  const { data: plans, isLoading } = useCollection<PricingPlan>(plansCollection);

  useEffect(() => {
    if (firestore && plans?.length === 0 && !isLoading) {
      const populatePlans = async () => {
        if (!plansCollection) return;
        for (const plan of defaultPricingPlans) {
            const newDocRef = doc(plansCollection);
            addDocumentNonBlocking(plansCollection, { ...plan, id: newDocRef.id, features: (plan.features || [])  });
        }
      };
      populatePlans();
    }
  }, [firestore, plans, isLoading, plansCollection]);
  

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PricingPlanFormValues>({
    resolver: zodResolver(pricingPlanSchema),
  });

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (editingPlan) {
      reset({
        ...editingPlan,
        features: editingPlan.features.join(', '),
      });
    } else {
      reset({ name: '', price: '', description: '', features: '' });
    }
  }, [editingPlan, reset]);

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p>Loading...</p>
      </div>
    );
  }
  
  const handleEdit = (plan: PricingPlan) => {
    setEditingPlan(plan);
    setIsFormDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingPlan(null);
    reset({ name: '', price: '', description: '', features: '' });
    setIsFormDialogOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setDeletingPlanId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!firestore || !deletingPlanId) return;
    const docRef = doc(firestore, 'pricingPlans', deletingPlanId);
    deleteDocumentNonBlocking(docRef);
    toast({ title: 'Success', description: 'Pricing plan deleted successfully.' });
    setIsDeleteDialogOpen(false);
    setDeletingPlanId(null);
  };

  const onSubmit = (data: PricingPlanFormValues) => {
    if(!plansCollection || !firestore) return;
    const id = editingPlan ? editingPlan.id : doc(plansCollection).id;
    const docRef = doc(firestore, 'pricingPlans', id);
    const planData = {
        ...data,
        id,
        features: data.features.split(',').map(f => f.trim()),
    }
    setDocumentNonBlocking(docRef, planData, { merge: true });
    
    toast({
        title: "Success",
        description: editingPlan ? "Plan updated successfully." : "Plan added successfully."
    });

    setIsFormDialogOpen(false);
    setEditingPlan(null);
  };
  

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className='flex items-center gap-4'>
            <DollarSign className="w-5 h-5" />
            <h1 className="text-lg font-bold font-headline">Manage Pricing</h1>
        </div>
        <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Plan
        </Button>
      </div>
      
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{editingPlan ? 'Edit Plan' : 'Add New Plan'}</DialogTitle>
                <DialogDescription>
                    {editingPlan ? 'Update the details for this pricing plan.' : 'Fill in the details for the new plan.'}
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Plan Name</Label>
                    <Input id="name" {...register('name')} />
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" {...register('price')} placeholder="e.g. ₹4,999" />
                    {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" {...register('description')} />
                    {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="features">Features (comma-separated)</Label>
                    <Textarea id="features" {...register('features')} placeholder="e.g. 5 Pages, Responsive Design, Contact Form" />
                     {errors.features && <p className="text-sm text-destructive">{errors.features.message}</p>}
                </div>
                <DialogFooter>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Plan'}
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
              This action cannot be undone. This will permanently delete the pricing plan.
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
            <CardTitle className='text-xl'>Your Pricing Plans</CardTitle>
            <CardDescription className='text-sm'>
                A list of all your pricing plans.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Features</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                        </TableRow>
                    ))}
                    {!isLoading && plans?.map((plan) => (
                        <TableRow key={plan.id}>
                            <TableCell>{plan.name}</TableCell>
                            <TableCell>{plan.price}</TableCell>
                            <TableCell>{plan.description}</TableCell>
                            <TableCell>{plan.features.join(', ')}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(plan)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(plan.id)}>
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

export default ManagePricingPage;
