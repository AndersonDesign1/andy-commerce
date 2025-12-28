import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: LucideIcon;
  className?: string;
}

export function MetricCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white p-5",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium text-gray-500 text-sm">{title}</p>
          <p className="mt-2 font-bold text-2xl text-gray-900 tabular-nums">
            {value}
          </p>
          {change && (
            <p
              className={cn(
                "mt-1 text-sm",
                changeType === "positive" && "text-emerald-600",
                changeType === "negative" && "text-red-600",
                changeType === "neutral" && "text-gray-500"
              )}
            >
              {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
            <Icon className="h-5 w-5 text-gray-600" />
          </div>
        )}
      </div>
    </div>
  );
}
