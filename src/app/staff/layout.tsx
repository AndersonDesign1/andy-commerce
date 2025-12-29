import { DashboardShell } from "@/components/shared/dashboard-shell";
import { StaffSidebar } from "@/components/staff/staff-sidebar";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell
      searchRole="staff"
      sidebar={<StaffSidebar />}
      title="Staff Panel"
    >
      {children}
    </DashboardShell>
  );
}
