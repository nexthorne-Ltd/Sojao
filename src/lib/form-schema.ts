import * as z from "zod";

export interface ActionResponse<T = unknown> {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof T]?: string[];
  };
  inputs?: T;
}

export const formSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  email: z.string().trim().email("Please enter a valid email address."),
  company: z.string().trim().max(120).optional(),
  employees: z.string().optional(),
  message: z
    .string()
    .trim()
    .min(10, "Please write a few words (at least 10 characters).")
    .max(2000, "Please keep it under 2,000 characters."),
  agree: z.literal(true, { message: "Please accept the Privacy Policy and Terms." }),
});
