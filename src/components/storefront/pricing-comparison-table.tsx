"use client";

import { Check, HelpCircle } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const FEATURES_COMPARISON = [
  {
    category: "Storefront",
    features: [
      {
        name: "Unlimited Products",
        description:
          "List as many products as you want without any restrictions.",
        starter: true,
        pro: true,
        business: true,
      },
      {
        name: "Secure Checkout",
        description:
          "Lightning-fast, optimized checkout experience for your customers.",
        starter: true,
        pro: true,
        business: true,
      },
      {
        name: "Custom Themes",
        description:
          "Personalize your storefront with custom colors and layout options.",
        starter: false,
        pro: "Basic",
        business: "Advanced",
      },
      {
        name: "Custom Domain",
        description:
          "Connect your own domain name (e.g., store.yourbrand.com).",
        starter: false,
        pro: true,
        business: true,
      },
      {
        name: "White-label Store",
        description: "Remove all Flik branding for a fully custom experience.",
        starter: false,
        pro: "Basic",
        business: true,
      },
    ],
  },
  {
    category: "Payments & Payouts",
    features: [
      {
        name: "Transaction Fee",
        description:
          "Small percentage fee on each sale to cover platform costs.",
        starter: "7%",
        pro: "5%",
        business: "3%",
      },
      {
        name: "Standard Payouts",
        description: "Regular payout schedule to your connected bank account.",
        starter: true,
        pro: true,
        business: true,
      },
      {
        name: "Flik-Speed™ Payouts",
        description:
          "Get your money in minutes, not days, with instant payouts.",
        starter: false,
        pro: true,
        business: true,
      },
      {
        name: "Multi-currency Support",
        description: "Sell to customers worldwide in over 135+ currencies.",
        starter: true,
        pro: true,
        business: true,
      },
      {
        name: "Tax Handling",
        description:
          "Automatic tax calculation and compliance for global sales.",
        starter: true,
        pro: true,
        business: true,
      },
    ],
  },
  {
    category: "Marketing & Growth",
    features: [
      {
        name: "Discount Codes",
        description: "Create custom percentage or fixed-amount discount codes.",
        starter: true,
        pro: true,
        business: true,
      },
      {
        name: "Affiliate Program",
        description:
          "Let others promote your products in exchange for a commission.",
        starter: false,
        pro: true,
        business: true,
      },
      {
        name: "Email Marketing Tool",
        description:
          "Send automated emails to your customers directly from Flik.",
        starter: false,
        pro: true,
        business: true,
      },
      {
        name: "Upsells & Cross-sells",
        description:
          "Recommend related products to increase your average order value.",
        starter: false,
        pro: true,
        business: true,
      },
      {
        name: "Bundles",
        description: "Group multiple products together for a discounted price.",
        starter: false,
        pro: true,
        business: true,
      },
    ],
  },
  {
    category: "Support & Maintenance",
    features: [
      {
        name: "Email Support",
        description:
          "Get help from our expert support team whenever you need it.",
        starter: "Standard",
        pro: "Priority",
        business: "24/7 Dedicated",
      },
      {
        name: "API Access",
        description:
          "Programmatically interact with your store using our REST API.",
        starter: false,
        pro: false,
        business: true,
      },
      {
        name: "Webhooks",
        description:
          "Real-time notifications for events like new sales or payouts.",
        starter: false,
        pro: false,
        business: true,
      },
      {
        name: "Audit Logs",
        description:
          "Detailed history of all actions performed in your account.",
        starter: false,
        pro: false,
        business: true,
      },
    ],
  },
];

function FeatureValue({ value }: { value: boolean | string }) {
  if (typeof value === "boolean") {
    return value ? (
      <div className="flex justify-center">
        <Check className="size-4 text-primary-violet sm:size-5" />
      </div>
    ) : null;
  }
  return (
    <span className="font-medium text-foreground text-xs sm:text-sm">
      {value}
    </span>
  );
}

export function PricingComparisonTable() {
  return (
    <ScrollArea className="w-full rounded-lg border whitespace-nowrap">
      <div className="w-max min-w-full">
        <Table className="w-full table-fixed border-collapse text-left">
          <TableHeader>
            <TableRow className="border-border border-b-2 hover:bg-transparent">
              <TableHead className="w-[200px] py-6 font-bold text-foreground text-sm sm:w-[280px] sm:py-10 sm:text-xl">
                Features
              </TableHead>
              <TableHead className="w-[80px] py-6 text-center font-bold text-foreground text-sm sm:w-[120px] sm:py-10 sm:text-xl">
                Starter
              </TableHead>
              <TableHead className="w-[80px] py-6 text-center font-bold text-foreground text-sm sm:w-[120px] sm:py-10 sm:text-xl">
                Pro
              </TableHead>
              <TableHead className="w-[80px] py-6 text-center font-bold text-foreground text-sm sm:w-[120px] sm:py-10 sm:text-xl">
                Business
              </TableHead>
            </TableRow>
          </TableHeader>
          {FEATURES_COMPARISON.map((section) => (
            <TableBody key={section.category}>
              <TableRow className="hover:bg-transparent">
                <TableCell
                  className="px-1 py-6 font-bold text-primary-violet text-xs uppercase tracking-[0.15em] sm:px-2 sm:py-16 sm:text-sm sm:tracking-[0.2em]"
                  colSpan={4}
                >
                  {section.category}
                </TableCell>
              </TableRow>
              {section.features.map((feature) => (
                <TableRow
                  className="border-border border-b transition-colors hover:bg-muted/5"
                  key={feature.name}
                >
                  <TableCell className="py-4 pr-2 sm:py-12 sm:pr-6">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="font-semibold text-foreground text-xs sm:text-lg">
                        {feature.name}
                      </span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className="inline-flex cursor-help items-center text-muted-foreground/50 transition-colors hover:text-muted-foreground"
                              type="button"
                            >
                              <HelpCircle className="size-3 sm:size-4" />
                              <span className="sr-only">
                                Explain {feature.name}
                              </span>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent
                            className="max-w-[200px] border bg-popover text-center text-popover-foreground shadow-sm"
                            sideOffset={8}
                          >
                            <p>{feature.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 text-center sm:py-12">
                    <FeatureValue value={feature.starter} />
                  </TableCell>
                  <TableCell className="py-4 text-center sm:py-12">
                    <FeatureValue value={feature.pro} />
                  </TableCell>
                  <TableCell className="py-4 text-center sm:py-12">
                    <FeatureValue value={feature.business} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          ))}
        </Table>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
