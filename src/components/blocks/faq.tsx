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
        question: "How long does setup take?",
        answer:
          "About 10 minutes. Connect Instagram or WhatsApp, connect your store, and go live. There are no flows to build.",
      },
      {
        question: "Do I need Shopify?",
        answer:
          "No. Sojao works with or without Shopify. If you use Shopify, Sojao can also answer order and delivery questions from your live store data.",
      },
      {
        question: "Which apps does Sojao work on?",
        answer:
          "Instagram, Facebook Messenger and WhatsApp. Sojao answers your customers on all three, day and night.",
      },
    ],
  },
  {
    title: "Pricing and the beta",
    questions: [
      {
        question: "Can I try Sojao for free?",
        answer:
          "Yes. Early brands in our beta get the first 3 months free, then a 50% founding discount.",
      },
      {
        question: "Is there a yearly plan?",
        answer:
          "Yes. Pay yearly and you get 2 months free. WhatsApp marketing message fees from Meta are billed at cost.",
      },
    ],
  },
  {
    title: "How Sojao works",
    questions: [
      {
        question: "How is Sojao different from ManyChat?",
        answer:
          "ManyChat only brings customers in, and you build every flow by hand. Sojao brings them in, sells to them, and looks after them after the sale. It understands your customers by itself, so there is nothing to build.",
      },
      {
        question: "What if Sojao doesn't know an answer?",
        answer:
          "It hands the chat to you. Sojao learns from every reply you send, so it gets better over time.",
      },
      {
        question: "Who is Sojao for?",
        answer:
          "Small Instagram-first brands with 1 to 10 people, mainly in fashion, beauty and accessories. If you answer your own DMs and lose sales at night, Sojao is for you.",
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
