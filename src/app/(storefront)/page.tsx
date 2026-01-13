import { FeatureGrid } from "@/components/marketing/feature-grid";
import { FAQ } from "@/components/storefront/faq";
import { FinalCTA } from "@/components/storefront/final-cta";
import { Hero } from "@/components/storefront/hero";
import { Testimonials } from "@/components/storefront/testimonials";

export default function StorefrontPage() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <FeatureGrid />
      <Testimonials />
      <FAQ />
      <FinalCTA />
    </div>
  );
}
