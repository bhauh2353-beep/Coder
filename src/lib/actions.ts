
"use server";

import { z } from "zod";
import { getApps, initializeApp, getApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, runTransaction } from 'firebase/firestore';
import { firebaseConfig } from "@/firebase/config";

// Helper function to initialize Firebase on the server
function getFirebaseAdmin() {
  if (!getApps().length) {
    let firebaseApp;
    try {
      firebaseApp = initializeApp();
    } catch (e) {
      if (process.env.NODE_ENV === "production") {
        console.warn('Automatic initialization failed. Falling back to firebase config object.', e);
      }
      firebaseApp = initializeApp(firebaseConfig);
    }
    return { firestore: getFirestore(firebaseApp) };
  }
  return { firestore: getFirestore(getApp()) };
}


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
    const { firestore } = getFirebaseAdmin();
    const leadsCollection = collection(firestore, 'leads');
    const newDocRef = doc(leadsCollection);
    await setDoc(newDocRef, {
        ...validatedFields.data,
        id: newDocRef.id,
        submissionDate: new Date().toISOString(),
    });
    return { message: "Quote request received! We will get back to you shortly." };
  } catch (e) {
    console.error("Error saving lead:", e);
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
    const { firestore } = getFirebaseAdmin();
    
    const serviceRequestNumber = await runTransaction(firestore, async (transaction) => {
        const counterRef = doc(firestore, 'counters', 'contactCounter');
        const counterDoc = await transaction.get(counterRef);

        let newCount = 1;
        if (counterDoc.exists()) {
            newCount = counterDoc.data().current_number + 1;
        }

        transaction.set(counterRef, { current_number: newCount }, { merge: true });

        // Pad the number with leading zeros to a length of 5
        const paddedCount = String(newCount).padStart(5, '0');
        return `SR-${paddedCount}`;
    });

    const contactsCollection = collection(firestore, 'contacts');
    const newDocRef = doc(contactsCollection);
    await setDoc(newDocRef, {
        ...validatedFields.data,
        id: newDocRef.id,
        submissionDate: new Date().toISOString(),
        serviceRequestNumber: serviceRequestNumber,
        status: 'Pending',
    });

    return { message: "Thank you! We'll contact you soon." };
  } catch (e) {
    console.error("Error saving contact:", e);
    return { message: "An error occurred while saving your message." };
  }
}
