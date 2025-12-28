import { Suspense } from "react";
import { PayoutsContent } from "@/components/dashboard/payouts/payouts-content";
import { Skeleton } from "@/components/ui/skeleton";
import { getPayoutsData } from "@/lib/data";

export const revalidate = 60;

export default async function PayoutsPage() {
  const data = await getPayoutsData();

  return (
    <Suspense fallback={<PayoutsSkeleton />}>
      <PayoutsContent data={data} />
    </Suspense>
  );
}

function PayoutsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {["metric-1", "metric-2", "metric-3", "metric-4"].map((key) => (
          <Skeleton className="h-28 rounded-xl" key={key} />
        ))}
      </div>
      <Skeleton className="h-96 rounded-xl" />
    </div>
  );
}
