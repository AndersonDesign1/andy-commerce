import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardShell } from "@/components/shared/dashboard-shell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell
      searchRole="seller"
      sidebar={<DashboardSidebar />}
      title="Dashboard"
    >
      {children}
    </DashboardShell>
  );
}
