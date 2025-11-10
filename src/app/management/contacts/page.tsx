'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { Mail } from 'lucide-react';
import { collection } from 'firebase/firestore';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Contact } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ManageContactsPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const contactsCollection = collection(firestore, 'contacts');
  const { data: contacts, isLoading } = useCollection<Contact>(contactsCollection);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Mail className="w-8 h-8" />
        <h1 className="text-3xl font-bold font-headline">Manage Contacts</h1>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Contact Submissions</CardTitle>
            <CardDescription>
            Browse and manage all contact form submissions.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Message</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                        </TableRow>
                    ))}
                    {!isLoading && contacts?.map((contact) => (
                    <TableRow key={contact.id}>
                        <TableCell>{new Date(contact.submissionDate).toLocaleDateString()}</TableCell>
                        <TableCell>{contact.name}</TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell>{contact.phone}</TableCell>
                        <TableCell>{contact.message}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
