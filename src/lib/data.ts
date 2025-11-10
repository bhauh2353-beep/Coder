import {
  Codepen,
  AppWindow,
  Monitor,
  MessageCircle,
  ShoppingCart,
  Printer,
  Truck,
  Users,
  Smartphone,
  Wallet,
  Star,
  type LucideIcon,
} from 'lucide-react';
import { PlaceHolderImages } from './placeholder-images';
import type { IconMap, Service, Project, PricingPlan, Testimonial } from './types';

export const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#services', label: 'Services' },
  { href: '#projects', label: 'Projects' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#contact', label: 'Contact' },
];

export const highlights = [
    { icon: Truck, text: 'Fast Delivery' },
    { icon: Users, text: 'Local Support' },
    { icon: Smartphone, text: 'Responsive Design' },
    { icon: Wallet, text: 'Affordable Packages' },
];

export const iconMap: IconMap = {
  Codepen,
  AppWindow,
  Monitor,
  MessageCircle,
  ShoppingCart,
  Printer,
  Smartphone,
  Star,
};

export const defaultServices: Omit<Service, 'id'>[] = [
  {
    icon: 'Codepen',
    title: 'Website Development',
    description: 'Creating stunning, high-performance websites tailored to your brand and business goals.',
  },
  {
    icon: 'AppWindow',
    title: 'Android App Development',
    description: 'Building native Android apps that provide seamless user experiences and powerful functionality.',
  },
  {
    icon: 'Monitor',
    title: 'Windows App & Dashboard',
    description: 'Developing custom Windows applications and intuitive data dashboards for your business.',
  },
  {
    icon: 'MessageCircle',
    title: 'WhatsApp Business Setup',
    description: 'Integrating WhatsApp Business API for customer communication, support, and automation.',
  },
  {
    icon: 'ShoppingCart',
    title: 'Online Store Creation',
    description: 'Launching feature-rich e-commerce stores that drive sales and grow your online presence.',
  },
  {
    icon: 'Printer',
    title: 'Digital Document & Printing',
    description: 'Professional design and printing services for all your digital and physical document needs.',
  },
];


export const defaultProjects: Omit<Project, 'id'>[] = [
  {
    category: 'Websites',
    imageUrl: PlaceHolderImages.find(p => p.id === 'project-1')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'project-1')?.imageHint || '',
    title: 'E-commerce Platform',
    description: 'A full-featured online store with a custom CMS and payment gateway integration.',
  },
  {
    category: 'Apps',
    imageUrl: PlaceHolderImages.find(p => p.id === 'project-2')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'project-2')?.imageHint || '',
    title: 'Fitness Tracker App',
    description: 'A mobile app to track workouts, set goals, and monitor progress with social features.',
  },
  {
    category: 'Automation',
    imageUrl: PlaceHolderImages.find(p => p.id === 'project-3')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'project-3')?.imageHint || '',
    title: 'Business Analytics Dashboard',
    description: 'A real-time dashboard for visualizing sales data and customer behavior.',
  },
];

export const defaultPricingPlans: Omit<PricingPlan, 'id'>[] = [
  {
    name: 'Starter Website',
    price: '₹4,999',
    description: 'Perfect for individuals and small businesses to get online.',
    features: ['5 Pages', 'Responsive Design', 'Contact Form', 'Basic SEO'],
  },
  {
    name: 'Business App',
    price: '₹9,999',
    description: 'A custom mobile app to engage your customers.',
    features: ['Android or iOS', 'Push Notifications', 'User Accounts', 'Admin Panel'],
  },
  {
    name: 'Smart Automation',
    price: '₹12,999',
    description: 'Automate your business processes and save time.',
    features: ['Workflow Automation', 'API Integrations', 'Custom Dashboard', 'Dedicated Support'],
  },
];

export const defaultTestimonials: Omit<Testimonial, 'id'>[] = [
  {
    clientPhotoUrl: PlaceHolderImages.find(p => p.id === 'testimonial-1')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'testimonial-1')?.imageHint || '',
    clientName: 'Rohan Sharma',
    rating: 5,
    message: 'JH Smart Solutions delivered a fantastic website for my business. The team was professional, responsive, and the final product exceeded my expectations.',
    submissionDate: new Date().toISOString(),
  },
  {
    clientPhotoUrl: PlaceHolderImages.find(p => p.id === 'testimonial-2')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'testimonial-2')?.imageHint || '',
    clientName: 'Priya Mehta',
    rating: 5,
    message: 'The mobile app they developed is flawless. It has helped us increase customer engagement significantly. Highly recommended!',
     submissionDate: new Date().toISOString(),
  },
  {
    clientPhotoUrl: PlaceHolderImages.find(p => p.id === 'testimonial-3')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'testimonial-3')?.imageHint || '',
    clientName: 'Anil Kumar',
    rating: 4,
    message: 'Great service and support. The automation solution they built has saved us countless hours of manual work. A true game-changer for our operations.',
     submissionDate: new Date().toISOString(),
  },
];

export const socialLinks = [
    { name: 'Facebook', href: '#' },
    { name: 'Instagram', href: '#' },
    { name: 'LinkedIn', href: '#' },
];
