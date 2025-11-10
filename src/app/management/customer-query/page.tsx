'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, setDocumentNonBlocking } from '@/firebase';
import { Mail, MoreVertical } from 'lucide-react';
import { collection, query, doc, orderBy } from 'firebase/firestore';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Contact } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';

export default function ManageCustomerQueryPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const contactsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'contacts'), orderBy('submissionDate', 'desc'));
  }, [firestore]);

  const { data: contacts, isLoading } = useCollection<Contact>(contactsQuery);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleStatusChange = (contactId: string, newStatus: 'Pending' | 'Resolved') => {
    if (!firestore) return;
    const docRef = doc(firestore, 'contacts', contactId);
    setDocumentNonBlocking(docRef, { status: newStatus }, { merge: true });
  };

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
        <h1 className="text-3xl font-bold font-headline">Customer Queries</h1>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Contact Submissions</CardTitle>
            <CardDescription>
            Browse and manage all customer queries from the contact form.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>SRN</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className='min-w-48'>Message</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                        </TableRow>
                    ))}
                    {!isLoading && contacts?.map((contact) => (
                    <TableRow key={contact.id}>
                        <TableCell className="font-medium">{contact.serviceRequestNumber}</TableCell>
                        <TableCell>{new Date(contact.submissionDate).toLocaleDateString()}</TableCell>
                        <TableCell>{contact.name}</TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell>{contact.phone}</TableCell>
                        <TableCell>{contact.message}</TableCell>
                        <TableCell>
                            <Badge variant={contact.status === 'Resolved' ? 'secondary' : 'default'}>
                                {contact.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                           <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleStatusChange(contact.id, 'Pending')} disabled={contact.status === 'Pending'}>
                                  Mark as Pending
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(contact.id, 'Resolved')} disabled={contact.status === 'Resolved'}>
                                  Mark as Resolved
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))}
                     {!isLoading && (!contacts || contacts.length === 0) && (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center text-muted-foreground">
                                No customer queries found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}

    