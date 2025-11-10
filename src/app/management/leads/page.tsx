
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, deleteDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { Users, MoreVertical, Trash2 } from 'lucide-react';
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
import type { Lead } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function ManageLeadsPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingLeadId, setDeletingLeadId] = useState<string | null>(null);
  
  const leadsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'leads'), orderBy('submissionDate', 'desc'));
  }, [firestore]);

  const { data: leads, isLoading } = useCollection<Lead>(leadsQuery);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);
  
  const handleStatusChange = (leadId: string, newStatus: 'Pending' | 'Resolved') => {
    if (!firestore) return;
    const docRef = doc(firestore, 'leads', leadId);
    setDocumentNonBlocking(docRef, { status: newStatus }, { merge: true });
  };

  const openDeleteDialog = (id: string) => {
    setDeletingLeadId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!firestore || !deletingLeadId) return;
    const docRef = doc(firestore, 'leads', deletingLeadId);
    deleteDocumentNonBlocking(docRef);
    toast({ title: 'Success', description: 'Lead deleted successfully.' });
    setIsDeleteDialogOpen(false);
    setDeletingLeadId(null);
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
       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this lead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className='bg-destructive hover:bg-destructive/90'>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex items-center gap-4 mb-8">
        <Users className="w-8 h-8" />
        <h1 className="text-3xl font-bold font-headline">Manage Leads</h1>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>Lead Submissions</CardTitle>
            <CardDescription>
            Browse and manage all service quote requests.
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
                    <TableHead>Service</TableHead>
                    <TableHead>Message</TableHead>
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
                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                        </TableRow>
                    ))}
                    {!isLoading && leads?.map((lead) => (
                    <TableRow key={lead.id}>
                        <TableCell className="font-medium">{lead.serviceRequestNumber}</TableCell>
                        <TableCell>{new Date(lead.submissionDate).toLocaleDateString()}</TableCell>
                        <TableCell>{lead.name}</TableCell>
                        <TableCell>{lead.email}</TableCell>
                        <TableCell>{lead.phone}</TableCell>
                        <TableCell>{lead.service}</TableCell>
                        <TableCell>{lead.message}</TableCell>
                        <TableCell>
                            <Badge variant={lead.status === 'Resolved' ? 'secondary' : 'default'}>
                                {lead.status}
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
                                <DropdownMenuItem onClick={() => handleStatusChange(lead.id, 'Pending')} disabled={lead.status === 'Pending'}>
                                  Mark as Pending
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(lead.id, 'Resolved')} disabled={lead.status === 'Resolved'}>
                                  Mark as Resolved
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog(lead.id)}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))}
                    {!isLoading && (!leads || leads.length === 0) && (
                        <TableRow>
                            <TableCell colSpan={9} className="text-center text-muted-foreground">
                                No leads found.
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
