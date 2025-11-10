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
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';

const companyInfoSchema = z.object({
  name: z.string().min(2, "Company Name is required."),
  address: z.string().min(5, "Address is required."),
  phone: z.string().min(10, "A valid phone number is required."),
  email: z.string().email("A valid email is required."),
  slogan: z.string().min(10, "Slogan must be at least 10 characters long."),
  heroText: z.string().min(10, "Hero text must be at least 10 characters long."),
  logoUrl: z.string().optional(),
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
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CompanyInfoFormValues>({
    resolver: zodResolver(companyInfoSchema),
  });
  
  const currentLogoUrl = watch('logoUrl');

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
          name: 'JH Smart Solutions',
          address: 'Shop Location, City, India',
          phone: '+91 7972688626',
          email: 'info@jhsmartsolutions.in',
          slogan: 'Smart, Fast, and Affordable Digital Solutions.',
          heroText: 'We Build Websites & Apps That Grow Your Business.',
          logoUrl: '',
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newLogoUrl = reader.result as string;
        setValue('logoUrl', newLogoUrl);
        // Immediately save the new logo URL to Firestore
        if (companyInfoRef) {
          setDocumentNonBlocking(companyInfoRef, { logoUrl: newLogoUrl }, { merge: true });
          toast({
            title: "Logo Updated",
            description: "Your new company logo has been saved.",
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

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
        <Info className="w-5 h-5" />
        <h1 className="text-lg font-bold font-headline">Manage Company Info</h1>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle className="text-xl">Your Business Details</CardTitle>
            <CardDescription className="text-sm">
                Update your company's name, contact information and slogan. This will be displayed on your website.
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
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-24 w-24 rounded-md" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="logoUrl">Company Logo</Label>
                        <div className='flex items-center gap-4'>
                            {currentLogoUrl && (
                                <Image src={currentLogoUrl} alt="Company Logo" width={80} height={80} className="rounded-md object-contain border p-1" />
                            )}
                            <Input id="logoUrlInput" type="file" accept="image/*" onChange={handleImageUpload} className="max-w-sm" />
                        </div>
                        {errors.logoUrl && <p className="text-sm text-destructive">{errors.logoUrl.message}</p>}
                    </div>

                     <div className="space-y-2">
                        <Label htmlFor="name">Company Name</Label>
                        <Input id="name" {...register('name')} />
                        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                    </div>
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
                    <div className="space-y-2">
                        <Label htmlFor="slogan">Slogan</Label>
                        <Textarea id="slogan" {...register('slogan')} />
                        {errors.slogan && <p className="text-sm text-destructive">{errors.slogan.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="heroText">Hero Headline</Label>
                        <Textarea id="heroText" {...register('heroText')} />
                        {errors.heroText && <p className="text-sm text-destructive">{errors.heroText.message}</p>}
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
