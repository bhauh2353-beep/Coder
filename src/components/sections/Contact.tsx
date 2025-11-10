"use client";

import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { saveContact } from "@/lib/actions";
import SeoTool from "@/components/SeoTool";

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

  return (
    <section id="contact" className="w-full py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">Get In Touch</h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Have a project in mind? We'd love to hear from you. Fill out the form or contact us directly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="bg-card p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-headline font-semibold mb-6">Send us a Message</h3>
            <form action={formAction} className="space-y-4">
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
            <div className="space-y-4 text-lg">
                <a href="mailto:info@jhsmartsolutions.in" className="flex items-center gap-4 group">
                    <Mail className="w-8 h-8 text-primary"/>
                    <span className="text-muted-foreground group-hover:text-primary transition-colors">info@jhsmartsolutions.in</span>
                </a>
                 <a href="tel:+919000000000" className="flex items-center gap-4 group">
                    <Phone className="w-8 h-8 text-primary"/>
                    <span className="text-muted-foreground group-hover:text-primary transition-colors">+91 9xxxxxxxxx</span>
                </a>
                 <div className="flex items-center gap-4">
                    <MapPin className="w-8 h-8 text-primary"/>
                    <span className="text-muted-foreground">Shop Location, City, India</span>
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
             <div className="mt-12">
               <SeoTool />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
