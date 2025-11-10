"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { saveLead } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const quoteSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  service: z.string(),
  message: z.string().optional(),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

interface ServiceQuoteModalProps {
  serviceName: string;
  setOpen: (open: boolean) => void;
}

export function ServiceQuoteModal({ serviceName, setOpen }: ServiceQuoteModalProps) {
  const { toast } = useToast();
  const [state, formAction] = useFormState(saveLead, { message: "" });
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: { service: serviceName, name: '', email: '', phone: '', message: '' },
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
        setOpen(false);
      }
    }
  }, [state, toast, reset, setOpen]);

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Get a Quote</DialogTitle>
        <DialogDescription>
          Request a quote for <span className="font-bold text-primary">{serviceName}</span>.
          Fill out the form below and we'll get back to you.
        </DialogDescription>
      </DialogHeader>
      <form action={formAction} >
        <div className="grid gap-4 py-4">
          <input type="hidden" {...register("service")} value={serviceName} />
          
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input id="phone" type="tel" {...register("phone")} />
          </div>

          <div className="space-y-1">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea id="message" {...register("message")} />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Request Quote"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
