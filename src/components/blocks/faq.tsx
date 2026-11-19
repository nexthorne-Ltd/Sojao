import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const categories = [
  {
    title: "Getting started",
    questions: [
      {
        question: "What can Sojao do today?",
        answer:
          "Marketing. Sojao runs Comment-to-DM, story reply, mention and keyword automations, captures leads in the chat, and sends broadcasts and drip messages to your tags and segments. Sales and Support are coming soon.",
      },
      {
        question: "How do I set it up?",
        answer:
          "Connect Instagram or Messenger, tell Sojao about your brand and tone of voice, and turn on a ready-made automation.",
      },
      {
        question: "Which apps does Sojao work on?",
        answer:
          "Instagram and Facebook Messenger. WhatsApp is coming soon.",
      },
    ],
  },
  {
    title: "Pricing and the beta",
    questions: [
      {
        question: "Is Sojao free?",
        answer:
          "Yes. Sojao is free during the beta and nothing is charged. Pricing is coming soon.",
      },
      {
        question: "Do I need a card to join the beta?",
        answer: "No.",
      },
    ],
  },
  {
    title: "How Sojao works",
    questions: [
      {
        question: "Does Sojao follow Instagram's rules?",
        answer:
          "Yes. Sojao sends one private reply per comment within 7 days, only sends promos to people who messaged you in the last 24 hours, stays within Instagram's sending limits, and stops marketing messages when someone writes “stop”.",
      },
      {
        question: "What happens to my customers' messages?",
        answer:
          "Sojao reads and replies to messages and comments only on your behalf, to run your automations. See our Privacy Policy for the details.",
      },
      {
        question: "Who is Sojao for?",
        answer:
          "Small Instagram-first brands, mainly in fashion, beauty and accessories, where the owner answers the DMs and loses leads at night.",
      },
    ],
  },
];

export const FAQ = ({
  headerTag = "h2",
  className,
  className2,
}: {
  headerTag?: "h1" | "h2";
  className?: string;
  className2?: string;
}) => {
  return (
    <section className={cn("py-28 lg:py-32", className)}>
      <div className="container max-w-5xl">
        <div className={cn("mx-auto grid gap-16 lg:grid-cols-2", className2)}>
          <div className="space-y-4">
            {headerTag === "h1" ? (
              <h1 className="text-2xl tracking-tight md:text-4xl lg:text-5xl">
                Questions? We've got answers.
              </h1>
            ) : (
              <h2 className="text-2xl tracking-tight md:text-4xl lg:text-5xl">
                Questions? We've got answers.
              </h2>
            )}
            <p className="text-muted-foreground max-w-md leading-snug lg:mx-auto">
              Can't find what you need?{" "}
              <Link href="/contact" className="underline underline-offset-4">
                Talk to us
              </Link>
              . We're happy to help.
            </p>
          </div>

          <div className="grid gap-6 text-start">
            {categories.map((category, categoryIndex) => (
              <div key={category.title} className="">
                <h3 className="text-muted-foreground border-b py-4">
                  {category.title}
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((item, i) => (
                    <AccordionItem key={i} value={`${categoryIndex}-${i}`}>
                      <AccordionTrigger>{item.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
