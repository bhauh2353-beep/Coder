'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/firebase';
import { LayoutDashboard, Settings, Briefcase, DollarSign, MessageSquare, Mail, Users, Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const managementSections = [
  {
    title: 'Services',
    description: 'Add, edit, or delete your services.',
    href: '/management/services',
    icon: Settings,
  },
  {
    title: 'Projects',
    description: 'Manage your recent work and portfolio.',
    href: '/management/projects',
    icon: Briefcase,
  },
  {
    title: 'Pricing',
    description: 'Update your pricing plans and features.',
    href: '/management/pricing',
    icon: DollarSign,
  },
  {
    title: 'Testimonials',
    description: 'Curate client testimonials.',
    href: '/management/testimonials',
    icon: MessageSquare,
  },
  {
    title: 'Customer Query',
    description: 'View and manage customer queries.',
    href: '/management/customer-query',
    icon: Mail,
  },
  {
    title: 'Leads',
    description: 'View and manage service quote requests.',
    href: '/management/leads',
    icon: Users,
  },
   {
    title: 'Company Info',
    description: 'Update your business contact details.',
    href: '/management/company-info',
    icon: Info,
  },
];

export default function ManagementPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

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
        <h1 className="text-3xl font-bold font-headline">Management Dashboard</h1>
      </div>
      <p className="mb-8 text-muted-foreground">
        Welcome, {user.displayName || user.email}. Manage your website content from here.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {managementSections.map((section) => (
          <Link href={section.href} key={section.title} className="group">
            <Card className="h-full hover:border-primary hover:shadow-lg transition-all">
              <CardHeader className="flex flex-row items-center gap-4">
                <section.icon className="w-8 h-8 text-primary" />
                <div>
                  <CardTitle className="font-headline">{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
