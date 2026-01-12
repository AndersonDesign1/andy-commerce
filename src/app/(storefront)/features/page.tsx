import { FeatureGrid } from "@/components/marketing/feature-grid";
import { FinalCTA } from "@/components/storefront/final-cta";

export const metadata = {
  title: "Features | Flik",
  description:
    "Explore the powerful features that make Flik the fastest way to sell digital products.",
};

export default function FeaturesPage() {
  return (
    <div className="flex flex-col gap-20 pt-24 pb-12 lg:pt-32 lg:pb-20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h1 className="font-bold text-4xl text-foreground tracking-tight sm:text-5xl lg:text-6xl">
          Everything you need to{" "}
          <span className="text-primary-violet">scale fast.</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground lg:text-xl">
          We've built Flik to be the fastest, most intuitive platform for
          digital creators. No bloat. No complex setups. Just the tools you need
          to succeed.
        </p>
      </div>

      <FeatureGrid />

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 border-border border-t pt-20 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-foreground text-xl">
              Custom Domains
            </h3>
            <p className="text-muted-foreground">
              Make Flik your own with custom domain support. Brand your
              storefront exactly how you want it.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-foreground text-xl">
              Advanced SEO
            </h3>
            <p className="text-muted-foreground">
              Built-in SEO optimizations ensure your products are discoverable
              by everyone, everywhere.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-foreground text-xl">
              Automated Taxes
            </h3>
            <p className="text-muted-foreground">
              We handle the complex world of digital VAT and sales tax so you
              don't have to worry about compliance.
            </p>
          </div>
        </div>
      </div>

      <FinalCTA />
    </div>
  );
}
