import { FieldError } from "react-hook-form";

// Tipos para persistencia local
export type SavedClient = {
  id: string;
  name: string;
  receiverId: string;
  email?: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
};

export type SavedCompany = {
  name: string;
  id: string;
};

export type Article = {
  id: string;
  nameItem: string;
  quantity: string;
  price: string;
};

export type DataForm = {
  companyName: string;
  companyId: string;
  nameReceiver: string;
  receiverId: string;
  emailReceiver: string;
  streetReceiver: string;
  stateReceiver: string;
  cityReceiver: string;
  countryReceiver: string;
  serviceDescription: string;
  articles: Article[];
};

export type Invoice = DataForm & {
  totalAmount: number;
  date: string;
  inVoiceNumber: string;
  logo?: string; // Optional base64 logo
};

export type FormFieldProps = {
  type: string;
  placeholder: string;
  name: ValidFieldNames | string;
  error: FieldError | undefined;
  label?: string;
  valueAsNumber?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  control?: any;
};

export type ValidFieldNames =
  | "companyName"
  | "companyId"
  | "nameReceiver"
  | "receiverId"
  | "emailReceiver"
  | "streetReceiver"
  | "stateReceiver"
  | "cityReceiver"
  | "countryReceiver"
  | "serviceDescription"
  | "nameItem"
  | "quantity"
  | "price";

// Schema de validación con Zod
import { z } from "zod";

export const articleSchema = z.object({
  id: z.string(),
  nameItem: z.string().min(1, "Nombre del artículo requerido"),
  quantity: z.string().min(1, "Cantidad requerida"),
  price: z.string().min(1, "Precio requerido"),
});

export const formValidationSchema = z.object({
  companyName: z.string().min(1, "Nombre de la empresa requerido"),
  companyId: z.string().min(1, "Cédula/RIF de la empresa requerido"),
  nameReceiver: z.string().min(1, "Nombre del receptor requerido"),
  receiverId: z.string().min(1, "Cédula/RIF del receptor requerido"),
  emailReceiver: z.string().optional().or(z.literal("")),
  streetReceiver: z.string().optional().or(z.literal("")),
  stateReceiver: z.string().optional().or(z.literal("")),
  cityReceiver: z.string().optional().or(z.literal("")),
  countryReceiver: z.string().optional().or(z.literal("")),
  serviceDescription: z.string().optional().or(z.literal("")),
  articles: z.array(articleSchema).min(1, "Debe agregar al menos un artículo"),
});

export type FormValidationSchema = z.infer<typeof formValidationSchema>;
