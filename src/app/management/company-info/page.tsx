'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, setDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const companyInfoSchema = z.object({
  address: z.string().min(5, "Address is required."),
  phone: z.string().min(10, "A valid phone number is required."),
  email: z.string().email("A valid email is required."),
});

type CompanyInfoFormValues = z.infer<typeof companyInfoSchema>;

type CompanyInfo = CompanyInfoFormValues & { id: string };

const ManageCompanyInfoPage = () => {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();

  const companyInfoRef = useMemo(() => {
    if (!firestore) return null;
    // Use a fixed document ID for the single source of company info
    return doc(firestore, 'companyInfo', 'main');
  }, [firestore]);

  const { data: companyInfo, isLoading } = useDoc<CompanyInfo>(companyInfoRef);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CompanyInfoFormValues>({
    resolver: zodResolver(companyInfoSchema),
  });

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (companyInfo) {
      reset(companyInfo);
    } else if (!isLoading) {
      // Set default values if no data exists
      const defaultData = {
          address: 'Shop Location, City, India',
          phone: '+91 9000000000',
          email: 'info@jhsmartsolutions.in'
      };
      reset(defaultData);
      // Optionally, save these defaults to Firestore
      if(companyInfoRef){
        setDocumentNonBlocking(companyInfoRef, { id: 'main', ...defaultData }, { merge: true });
      }
    }
  }, [companyInfo, isLoading, reset, companyInfoRef]);

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  const onSubmit = (data: CompanyInfoFormValues) => {
    if(!companyInfoRef) return;
    setDocumentNonBlocking(companyInfoRef, { id: 'main', ...data }, { merge: true });
    
    toast({
        title: "Success",
        description: "Company information updated successfully."
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Info className="w-8 h-8" />
        <h1 className="text-3xl font-bold font-headline">Manage Company Info</h1>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>Your Business Details</CardTitle>
            <CardDescription>
                Update your company's contact information. This will be displayed on your website.
            </CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                 <div className="space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" {...register('address')} />
                        {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" {...register('phone')} />
                        {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" {...register('email')} />
                        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                    </div>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </form>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ManageCompanyInfoPage;
