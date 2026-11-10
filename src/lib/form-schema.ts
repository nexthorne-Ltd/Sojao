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
  name: z.string().trim().min(1, "Please enter your name"),
  email: z.email("Please enter a valid email address"),
  company: z.string().optional(),
  employees: z.string().optional(),
  message: z.string().trim().min(1, "Please write a message"),
  agree: z.literal(true, { message: "Please accept the terms to continue" }),
});
