import { Suspense } from "react";
import { ProductsContent } from "@/components/dashboard/products/products-content";
import { Skeleton } from "@/components/ui/skeleton";
import { getProductsData } from "@/lib/data";

export const revalidate = 60;

export default async function ProductsPage() {
  const data = await getProductsData();

  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <ProductsContent products={data.products} />
    </Suspense>
  );
}

function ProductsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>
      <Skeleton className="h-[600px] rounded-xl" />
    </div>
  );
}
