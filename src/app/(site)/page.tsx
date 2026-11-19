import { Background } from "@/components/background";
import { AutomationTicker } from "@/components/blocks/automation-ticker";
import { ChatDemo } from "@/components/blocks/chat-demo";
import { Comparison } from "@/components/blocks/comparison";
import { FAQ } from "@/components/blocks/faq";
import { Features } from "@/components/blocks/features";
import { GlobalStats } from "@/components/blocks/global-stats";
import { Hero } from "@/components/blocks/hero";
import { HowItWorks } from "@/components/blocks/how-it-works";
import { Logos } from "@/components/blocks/logos";
import { Pricing } from "@/components/blocks/pricing";
import { ResourceAllocation } from "@/components/blocks/resource-allocation";
import { Trust } from "@/components/blocks/trust";
import { Reveal } from "@/components/reveal";

// Testimonials are parked in components/_later until we have real,
// approved quotes from beta brands.
export default function Home() {
  return (
    <>
      <Background className="via-muted to-muted/80">
        <Hero />
        <AutomationTicker />
        <Reveal><Logos /></Reveal>
        <Reveal><HowItWorks /></Reveal>
        <Reveal><ChatDemo /></Reveal>
        <Reveal><Features /></Reveal>
        <Reveal><ResourceAllocation /></Reveal>
        <Reveal><Comparison /></Reveal>
      </Background>
      <Reveal><GlobalStats /></Reveal>
      <Background variant="bottom">
        <Reveal><Trust /></Reveal>
        <Reveal><Pricing /></Reveal>
        <Reveal><FAQ /></Reveal>
      </Background>
    </>
  );
}
