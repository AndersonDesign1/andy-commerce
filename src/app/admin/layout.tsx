"use client";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { DashboardShell } from "@/components/shared/dashboard-shell";
import { useRequireRole } from "@/hooks/use-auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, hasAccess } = useRequireRole("admin");

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="size-8 animate-spin rounded-full border-4 border-primary-violet/20 border-t-primary-violet" />
          <p className="text-muted-foreground text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return (
    <DashboardShell
      searchRole="admin"
      sidebar={<AdminSidebar />}
      title="Admin Panel"
    >
      {children}
    </DashboardShell>
  );
}
