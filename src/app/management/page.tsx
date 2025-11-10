'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { LayoutDashboard, Settings, Briefcase, DollarSign, MessageSquare, Mail, Users, Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Contact, Lead } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

const managementSections = [
  {
    title: 'Services',
    description: 'Add, edit, or delete your services.',
    href: '/management/services',
    icon: Settings,
    id: 'services',
  },
  {
    title: 'Projects',
    description: 'Manage your recent work and portfolio.',
    href: '/management/projects',
    icon: Briefcase,
    id: 'projects',
  },
  {
    title: 'Pricing',
    description: 'Update your pricing plans and features.',
    href: '/management/pricing',
    icon: DollarSign,
    id: 'pricing',
  },
  {
    title: 'Testimonials',
    description: 'Curate client testimonials.',
    href: '/management/testimonials',
    icon: MessageSquare,
    id: 'testimonials',
  },
  {
    title: 'Customer Query',
    description: 'View and manage customer queries.',
    href: '/management/customer-query',
    icon: Mail,
    id: 'customer-query',
  },
  {
    title: 'Leads',
    description: 'View and manage service quote requests.',
    href: '/management/leads',
    icon: Users,
    id: 'leads',
  },
   {
    title: 'Company Info',
    description: 'Update your business contact details.',
    href: '/management/company-info',
    icon: Info,
    id: 'company-info',
  },
];

export default function ManagementPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const pendingContactsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'contacts'), where('status', '==', 'Pending'));
  }, [firestore]);

  const { data: pendingContacts } = useCollection<Contact>(pendingContactsQuery);
  const pendingCount = pendingContacts?.length || 0;

  const leadsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'leads'));
  }, [firestore]);

  const { data: leads } = useCollection<Lead>(leadsQuery);
  const leadCount = leads?.length || 0;

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
        <LayoutDashboard className="w-8 h-8" />
        <h1 className="text-2xl font-bold font-headline">Management Dashboard</h1>
      </div>
      <p className="mb-8 text-muted-foreground text-sm">
        Welcome, {user.displayName || user.email}. Manage your website content from here.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {managementSections.map((section) => (
          <Link href={section.href} key={section.title} className="group">
            <Card className="h-full hover:border-primary hover:shadow-lg transition-all">
              <CardHeader className="flex flex-row items-center gap-2 p-3">
                <section.icon className="w-6 h-6 text-primary" />
                <div className='flex-grow'>
                  <CardTitle className="text-sm font-semibold">{section.title}</CardTitle>
                  <CardDescription className='text-xs'>{section.description}</CardDescription>
                </div>
                {section.id === 'customer-query' && pendingCount > 0 && (
                  <Badge className="h-5 w-5 flex items-center justify-center rounded-full p-0 text-xs">
                    {pendingCount}
                  </Badge>
                )}
                 {section.id === 'leads' && leadCount > 0 && (
                  <Badge className="h-5 w-5 flex items-center justify-center rounded-full p-0 text-xs" variant="secondary">
                    {leadCount}
                  </Badge>
                )}
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
