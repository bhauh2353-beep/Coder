export type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  submissionDate: string;
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
