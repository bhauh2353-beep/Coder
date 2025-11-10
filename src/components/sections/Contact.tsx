

"use client";

import { useActionState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { saveContact } from "@/lib/actions";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';


const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email."),
  phone: z.string().min(10, "Please enter a valid phone number."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const Contact = () => {
  const { toast } = useToast();
  const [state, formAction] = useActionState(saveContact, { message: "" });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });
  const backgroundImage = PlaceHolderImages.find(p => p.id === 'contact-background');

  const firestore = useFirestore();
  const companyInfoRef = useMemo(() => {
    if (!firestore) return null;
    return doc(firestore, 'companyInfo', 'main');
  }, [firestore]);
  const { data: companyInfo } = useDoc(companyInfoRef);


  useEffect(() => {
    if (state?.message) {
      if (state.errors) {
        toast({
          title: "Error",
          description: "Please check the form for errors.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success!",
          description: state.message,
        });
        reset();
      }
    }
  }, [state, toast, reset]);
  
  const handleFormAction = (formData: FormData) => {
    formAction(formData);
  }

  return (
    <section id="contact" className="relative w-full py-20 md:py-32 overflow-hidden">
        {backgroundImage && (
            <Image
                src={backgroundImage.imageUrl}
                alt={backgroundImage.description}
                fill
                className="object-cover"
                data-ai-hint={backgroundImage.imageHint}
            />
        )}
        <div className="absolute inset-0 bg-background/90"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">Get In Touch</h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Have a project in mind? We'd love to hear from you. Fill out the form or contact us directly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="bg-card/80 backdrop-blur-sm p-8 rounded-lg shadow-md h-full">
            <h3 className="text-2xl font-headline font-semibold mb-6">Send us a Message</h3>
            <form action={handleFormAction} className="space-y-4">
            <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register("name")} />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            </div>
            <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
            </div>
            <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" {...register("phone")} />
                {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>}
            </div>
            <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" {...register("message")} />
                {errors.message && <p className="text-sm text-destructive mt-1">{errors.message.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
            </form>
            </div>

            <div className="space-y-8">
                <div className="bg-card/80 backdrop-blur-sm p-6 rounded-lg shadow-md flex flex-col items-start gap-4 text-base">
                    <h3 className="text-2xl font-headline font-semibold">Contact Details</h3>
                    <div className="flex flex-col space-y-4">
                      <a href={`mailto:${companyInfo?.email}`} className="flex items-center gap-3 group">
                          <Mail className="w-6 h-6 text-primary"/>
                          <span className="text-muted-foreground group-hover:text-primary transition-colors">{companyInfo?.email || 'info@jhsmartsolutions.in'}</span>
                      </a>
                      <a href={`tel:${companyInfo?.phone}`} className="flex items-center gap-3 group">
                          <Phone className="w-6 h-6 text-primary"/>
                          <span className="text-muted-foreground group-hover:text-primary transition-colors">{companyInfo?.phone || '+91 9xxxxxxxxx'}</span>
                      </a>
                      <div className="flex items-start gap-3">
                          <MapPin className="w-6 h-6 text-primary mt-1"/>
                          <span className="text-muted-foreground">{companyInfo?.address || 'Shop Location, City, India'}</span>
                      </div>
                    </div>
                </div>
                <div className="aspect-video w-full rounded-lg overflow-hidden shadow-md">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d121059.04360432833!2d73.79292693952477!3d18.5246035602058!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2e67461101%3A0x828d43bf9d9ee343!2sPune%2C%20Maharashtra%2C%20India!5e0!3m2!1sen!2sus!4v1689578112345!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Map of our location"
                ></iframe>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
