"use server";
import { actionClient } from "./safe-action";

import { formSchema } from "@/lib/form-schema";

/**
 * Contact form handler. Messages are forwarded as JSON to CONTACT_WEBHOOK_URL
 * (e.g. a Zapier, Make, Slack or email-service webhook). If it is not set,
 * the form reports that sending failed instead of pretending it worked.
 */
export const serverAction = actionClient
  .inputSchema(formSchema)
  .action(async ({ parsedInput }) => {
    const webhook = process.env.CONTACT_WEBHOOK_URL;
    if (!webhook) {
      throw new Error("CONTACT_WEBHOOK_URL is not configured");
    }

    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "Sojao AI website contact form",
        name: parsedInput.name,
        email: parsedInput.email,
        company: parsedInput.company ?? "",
        teamSize: parsedInput.employees ?? "",
        message: parsedInput.message,
        sentAt: new Date().toISOString(),
      }),
    });
    if (!res.ok) {
      throw new Error(`Contact webhook responded ${res.status}`);
    }

    return { success: true, message: "Message sent" };
  });
