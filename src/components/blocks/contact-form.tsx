"use client";
import { useState } from "react";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formSchema } from "@/lib/form-schema";
import { ApiError, request } from "@/lib/marketing-api";

type Schema = z.infer<typeof formSchema>;

export function ContactForm() {
  const form = useForm<Schema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      employees: undefined,
      message: "",
      agree: false,
    } as unknown as Schema,
  });
  // Saved in the Sojao database; the team reads it in the admin panel (Messages).
  const [isExecuting, setExecuting] = useState(false);
  const [hasSucceeded, setSucceeded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = form.handleSubmit(async (data: Schema) => {
    setExecuting(true);
    setError(null);
    try {
      await request("/contact", { method: "POST", body: { name: data.name, email: data.email, company: data.company || undefined, employees: data.employees || undefined, message: data.message } });
      form.reset();
      setSucceeded(true);
    } catch (e) {
      setError(e instanceof ApiError && e.status === 429 ? "Too many messages. Please try again later." : "Something went wrong. Please check the form and try again.");
    } finally {
      setExecuting(false);
    }
  });

  if (hasSucceeded) {
    return (
      <div className="w-full gap-2 rounded-md border p-2 sm:p-5 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, stiffness: 300, damping: 25 }}
          className="h-full px-3 py-6"
        >
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.3,
              type: "spring",
              stiffness: 500,
              damping: 15,
            }}
            className="mx-auto mb-4 flex w-fit justify-center rounded-full border p-2"
          >
            <Check className="size-8" />
          </motion.div>
          <h2 className="mb-2 text-center text-2xl font-bold text-pretty">
            Thank you, your message is in.
          </h2>
          <p className="text-muted-foreground text-center text-lg text-pretty">
            A real person will get back to you by email.
          </p>
          <div className="mt-6 flex justify-center">
            <Button variant="outline" onClick={() => setSucceeded(false)}>
              Send another message
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-2 space-y-4 rounded-md"
      >
        <FormField
          control={form.control}
          name="name"
          rules={{ required: true }}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Full name * </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  value={field.value}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val);
                  }}
                  placeholder="First and last name"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          rules={{ required: true }}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Email address * </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  value={field.value}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val);
                  }}
                  placeholder="you@yourbrand.com"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company"
          rules={{ required: false }}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Brand name </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  value={field.value}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val);
                  }}
                  placeholder="Your brand name"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          rules={{ required: false }}
          name="employees"
          render={({ field }) => {
            const options = [
              { value: "1", label: "Just me" },
              { value: "2-5", label: "2-5" },
              { value: "6-10", label: "6-10" },
              { value: "10+", label: "More than 10" },
            ];
            return (
              <FormItem className="w-full">
                <FormLabel>Team size </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="e.g. 2-5" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {options.map(({ label, value }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="message"
          rules={{ required: true }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your message * </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Tell us about your brand and your DMs"
                  className="resize-none"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          rules={{ required: true }}
          name="agree"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-y-0 space-x-1">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(v) => field.onChange(v === true)}
                />
              </FormControl>
              <div className="space-y-1 leading-snug">
                <FormLabel className="inline font-normal">
                  I agree to the{" "}
                  <Link href="/privacy" className="underline underline-offset-4">
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link href="/terms" className="underline underline-offset-4">
                    Terms of Service
                  </Link>
                </FormLabel>

                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        {error && (
          <p role="alert" className="text-destructive text-sm">
            {error}
          </p>
        )}
        <div className="flex w-full items-center justify-end pt-3">
          <Button type="submit" className="rounded-lg" disabled={isExecuting}>
            {isExecuting ? "Sending..." : "Send message"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
