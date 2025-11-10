"use server";

import { z } from "zod";
import { getSdks, addDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase";
import { collection, doc } from "firebase/firestore";

const leadSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  phone: z.string().optional(),
  service: z.string(),
  message: z.string().optional(),
});

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number."}),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export async function saveLead(prevState: any, formData: FormData) {
  const validatedFields = leadSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    service: formData.get("service"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation Error.",
    };
  }

  try {
    const { firestore } = getSdks();
    const leadsCollection = collection(firestore, 'leads');
    const newDocRef = doc(leadsCollection);
    await setDocumentNonBlocking(newDocRef, {
        ...validatedFields.data,
        id: newDocRef.id,
        submissionDate: new Date().toISOString(),
    }, {});
    return { message: "Quote request received! We will get back to you shortly." };
  } catch (e) {
    return { message: "An error occurred while saving the lead." };
  }
}

export async function saveContact(prevState: any, formData: FormData) {
  const validatedFields = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation Error.",
    };
  }

  try {
    const { firestore } = getSdks();
    const contactsCollection = collection(firestore, 'contacts');
    const newDocRef = doc(contactsCollection);
    await setDocumentNonBlocking(newDocRef, {
        ...validatedFields.data,
        id: newDocRef.id,
        submissionDate: new Date().toISOString(),
    }, {});
    return { message: "Thank you! We'll contact you soon." };
  } catch (e) {
    return { message: "An error occurred while saving your message." };
  }
}
