import { DashedLine } from "../dashed-line";

import {
  FollowUpMock,
  HandoverMock,
  OrderUpdateMock,
  StoreAnswerMock,
  ThreeToolsGraphic,
} from "@/components/blocks/chat-illustrations";
import { cn } from "@/lib/utils";

type FeatureItem = {
  title: string;
  description: string;
  visual: React.ReactNode;
  className?: string;
};

const topItems: FeatureItem[] = [
  {
    title: "Answers from your real store.",
    description:
      "Price, size, stock, shipping and returns. Sojao answers from your store details, so customers get the right answer.",
    visual: <StoreAnswerMock />,
    className: "flex-1",
  },
  {
    title: "Replace three tools with one.",
    description:
      "No more separate tools for DM marketing, sales and support. One agent, one memory of every customer.",
    visual: <ThreeToolsGraphic />,
    className: "flex-1",
  },
];

const bottomItems: FeatureItem[] = [
  {
    title: "Abandoned DM follow-up.",
    description:
      "Someone asked, then went quiet? Sojao checks back in and brings the sale home.",
    visual: <FollowUpMock />,
  },
  {
    title: "Human handover.",
    description:
      "Not sure? Sojao passes the chat to you, then learns from your reply.",
    visual: <HandoverMock />,
  },
  {
    title: "Order updates.",
    description:
      "Confirmations, delivery updates and “where is my order?” answers.",
    visual: <OrderUpdateMock />,
  },
];

export const ResourceAllocation = () => {
  return (
    <section
      id="resource-allocation"
      className="scroll-mt-24 overflow-hidden pb-28 lg:pb-32"
    >
      <h2 className="container text-center text-3xl tracking-tight text-balance sm:text-4xl md:text-5xl lg:text-6xl">
        Everything your DMs need. Nothing to build.
      </h2>

      <div className="mt-8 md:mt-12 lg:mt-20">
        <DashedLine orientation="horizontal" className="container scale-x-105" />

        {/* Top grid - 2 items */}
        <div className="relative container flex max-md:flex-col">
          {topItems.map((item, i) => (
            <Item key={item.title} item={item} isLast={i === topItems.length - 1} />
          ))}
        </div>
        <DashedLine
          orientation="horizontal"
          className="container max-w-7xl scale-x-110"
        />

        {/* Bottom grid - 3 items */}
        <div className="relative container grid max-w-7xl md:grid-cols-3">
          {bottomItems.map((item, i) => (
            <Item
              key={item.title}
              item={item}
              isLast={i === bottomItems.length - 1}
            />
          ))}
        </div>
      </div>
      <DashedLine
        orientation="horizontal"
        className="container max-w-7xl scale-x-110"
      />
    </section>
  );
};

const Item = ({ item, isLast }: { item: FeatureItem; isLast?: boolean }) => {
  return (
    <div
      className={cn(
        "relative flex flex-col justify-between gap-6 px-0 py-6 md:gap-8 md:px-6 md:py-8",
        item.className,
      )}
    >
      <div className="text-balance">
        <h3 className="inline font-semibold">{item.title} </h3>
        <span className="text-muted-foreground"> {item.description}</span>
      </div>

      <div className="mx-auto w-full max-w-md">{item.visual}</div>

      {!isLast && (
        <>
          <DashedLine
            orientation="vertical"
            className="absolute top-0 right-0 max-md:hidden"
          />
          <DashedLine
            orientation="horizontal"
            className="absolute inset-x-0 bottom-0 md:hidden"
          />
        </>
      )}
    </div>
  );
};
