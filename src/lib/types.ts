import type { LucideIcon } from "lucide-react";

export type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  submissionDate: string;
  serviceRequestNumber: string;
  status: 'Pending' | 'Resolved';
};

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
  message?: string;
  submissionDate: string;
};

export type Service = {
    id: string;
    icon: string;
    title: string;
    description: string;
}

export type Project = {
    id:string;
    title: string;
    description: string;
    category: string;
    imageUrl: string;
    imageHint: string;
}

export type PricingPlan = {
    id: string;
    name: string;
    price: string;
    description: string;
    features: string[];
}

export type Testimonial = {
    id: string;
    clientName: string;
    clientPhotoUrl: string;
    imageHint?: string;
    rating: number;
    message: string;
    submissionDate: string;
}

export type CompanyInfo = {
    id: string;
    address: string;
    phone: string;
    email: string;
    slogan: string;
};


export type IconMap = { [key: string]: LucideIcon };

export type SocialLink = {
    name: string;
    href: string;
    colorClass: string;
}
    

    
