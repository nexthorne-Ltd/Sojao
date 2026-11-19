"use client";

import { Heart, MessageCircle, Moon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Illustrative Comment-to-DM flow. Clearly labelled as an example, the
 * names and messages are made up.
 */
const messages: { from: "bot" | "user"; text: string }[] = [
  { from: "bot", text: "Hey Ayesha! Here’s the link to the new drop 👇 sojao.shop/drop" },
  { from: "bot", text: "Want early access to the next one? Share your email and you’re on the list." },
  { from: "user", text: "ayesha@example.com" },
  { from: "bot", text: "Done ✨ You’re on the list. Anything else I can help with?" },
];

const beats = [
  {
    time: "2:14 AM",
    title: "A follower comments “DROP”",
    text: "On your latest post, while you’re asleep.",
  },
  {
    time: "2:14 AM",
    title: "Sojao sends the link in a DM",
    text: "One private reply, inside Instagram’s rules.",
  },
  {
    time: "2:15 AM",
    title: "The lead is saved",
    text: "Name and email land in your leads list, tagged by post.",
  },
];

export const ChatDemo = () => {
  const reduce = useReducedMotion();
  return (
    <section id="demo" className="pb-28 lg:pb-32">
      <div className="container grid max-w-5xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-brand font-mono text-sm font-medium tracking-wide">
            SEE IT IN ACTION
          </p>
          <h2 className="mt-3 text-3xl tracking-tight text-balance md:text-4xl lg:text-5xl">
            A sale started at 2 AM. You didn&apos;t lift a finger.
          </h2>
          <ol className="mt-10 space-y-6">
            {beats.map((b, i) => (
              <li key={b.title} className="flex gap-4">
                <span className="bg-brand/12 text-brand flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold">
                    {b.title}{" "}
                    <span className="text-muted-foreground ml-1 font-mono text-xs font-normal">
                      {b.time}
                    </span>
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">{b.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* phone mock */}
        <div className="relative mx-auto w-full max-w-sm">
          <div className="bg-brand/20 pointer-events-none absolute -inset-6 rounded-[3rem] blur-3xl" />
          <div className="bg-card relative rounded-[2.5rem] border p-3 shadow-2xl">
            <div className="bg-background overflow-hidden rounded-[2rem] border">
              <div className="flex items-center justify-between border-b px-4 py-3 text-sm">
                <span className="font-semibold">yourbrand</span>
                <span className="text-muted-foreground flex items-center gap-1 text-xs">
                  <Moon className="size-3.5" /> You&apos;re offline
                </span>
              </div>

              {/* the comment */}
              <div className="bg-muted/50 flex items-start gap-3 border-b px-4 py-3">
                <span className="bg-glow size-7 shrink-0 rounded-full" />
                <div className="flex-1 text-sm">
                  <span className="font-semibold">ayesha.styles</span> DROP 🔥
                  <div className="text-muted-foreground mt-1 flex items-center gap-3 text-xs">
                    <span>Comment on your post</span>
                    <Heart className="size-3" />
                    <MessageCircle className="size-3" />
                  </div>
                </div>
              </div>

              {/* the DM */}
              <motion.div
                className="space-y-2 px-4 py-4"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "0px 0px -120px 0px" }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : 0.7, delayChildren: 0.3 } } }}
              >
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    variants={{
                      hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 10, scale: reduce ? 1 : 0.96 },
                      show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35 } },
                    }}
                    className={cn("flex", m.from === "user" ? "justify-end" : "justify-start")}
                  >
                    <p
                      className={cn(
                        "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-snug",
                        m.from === "user"
                          ? "bg-brand rounded-br-md text-white"
                          : "bg-muted rounded-bl-md",
                      )}
                    >
                      {m.text}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
          <p className="text-muted-foreground mt-4 text-center text-xs">
            Example conversation. Names and messages are made up.
          </p>
        </div>
      </div>
    </section>
  );
};
