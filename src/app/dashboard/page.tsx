import { Suspense } from "react";
import { DashboardContent } from "@/components/dashboard/overview/dashboard-content";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardData } from "@/lib/data";

// ISR: revalidate every 60 seconds
export const revalidate = 60;

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent data={data} />
    </Suspense>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {["metric-1", "metric-2", "metric-3", "metric-4"].map((key) => (
          <Skeleton className="h-28 rounded-xl" key={key} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Skeleton className="h-80 rounded-xl lg:col-span-2" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
      <Skeleton className="h-96 rounded-xl" />
    </div>
  );
}
