"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import {
  createStaggerContainer,
  DURATION,
  EASING,
  ENTRANCE_VARIANTS,
  STAGGERS,
} from "@/lib/design-system";

const CATEGORIES = [
  {
    slug: "templates",
    name: "Templates",
    description: "Website and app templates",
    count: 234,
    icon: "📄",
  },
  {
    slug: "ui-kits",
    name: "UI Kits",
    description: "Design systems and component libraries",
    count: 156,
    icon: "🎨",
  },
  {
    slug: "icons",
    name: "Icons",
    description: "Icon packs and sets",
    count: 89,
    icon: "✨",
  },
  {
    slug: "fonts",
    name: "Fonts",
    description: "Typography and font families",
    count: 67,
    icon: "🔤",
  },
  {
    slug: "illustrations",
    name: "Illustrations",
    description: "Vector illustrations and graphics",
    count: 123,
    icon: "🖼️",
  },
  {
    slug: "photos",
    name: "Photos",
    description: "Stock photos and images",
    count: 456,
    icon: "📷",
  },
  {
    slug: "courses",
    name: "Courses",
    description: "Video courses and tutorials",
    count: 45,
    icon: "🎓",
  },
  {
    slug: "ebooks",
    name: "eBooks",
    description: "Digital books and guides",
    count: 78,
    icon: "📚",
  },
];

export default function CategoriesPage() {
  const { ref: headerRef, isInView: headerInView } = useScrollReveal({
    threshold: 0.3,
  });
  const { ref: gridRef, isInView: gridInView } = useScrollReveal({
    threshold: 0.1,
  });

  return (
    <section className="relative w-full overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-0 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary-violet-100/40 to-transparent blur-3xl"
          initial={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: DURATION.hero, ease: EASING.outExpo }}
        />
      </div>

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          animate={headerInView ? "visible" : "hidden"}
          className="mb-16 text-center"
          initial="hidden"
          ref={headerRef}
          variants={createStaggerContainer(STAGGERS.section, 0)}
        >
          <motion.span
            className="mb-4 inline-block rounded-full border border-border bg-card px-3 py-1 font-medium text-muted-foreground text-sm"
            variants={ENTRANCE_VARIANTS.slideDown}
          >
            Explore Categories
          </motion.span>
          <motion.h1
            className="mb-4 font-bold text-4xl text-foreground tracking-tight"
            variants={ENTRANCE_VARIANTS.slideUp}
          >
            Browse Categories
          </motion.h1>
          <motion.p
            className="mx-auto max-w-xl text-lg text-muted-foreground"
            variants={ENTRANCE_VARIANTS.fade}
          >
            Discover thousands of digital products from talented creators around
            the world.
          </motion.p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          animate={gridInView ? "visible" : "hidden"}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          ref={gridRef}
          variants={createStaggerContainer(STAGGERS.default, 0)}
        >
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category.slug}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: DURATION.entrance,
                    ease: EASING.outExpo,
                    delay: index * STAGGERS.fast,
                  },
                },
              }}
            >
              <Link
                className="group block h-full rounded-2xl border border-border bg-card p-6 transition-all hover:bg-primary-violet-50 dark:hover:bg-primary-violet-50/10"
                href={`/categories/${category.slug}`}
              >
                <div aria-hidden="true" className="mb-4 text-4xl">
                  {category.icon}
                </div>
                <h2 className="mb-1 font-semibold text-foreground text-lg group-hover:text-primary-violet">
                  {category.name}
                </h2>
                <p className="mb-4 text-muted-foreground text-sm">
                  {category.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    {category.count} products
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary-violet" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
