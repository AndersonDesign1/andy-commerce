"use client";

import { LockKeyhole } from "lucide-react";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { DashboardShell } from "@/components/shared/dashboard-shell";
import { Button } from "@/components/ui/button";
import { useRequireRole } from "@/hooks/use-auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, hasAccess, user } = useRequireRole("admin");

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
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
        <div className="flex size-16 items-center justify-center rounded-full bg-muted">
          <LockKeyhole className="size-8 text-muted-foreground" />
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="font-semibold text-2xl text-foreground">
            {user ? "Access Denied" : "Login Required"}
          </h1>
          <p className="max-w-sm text-muted-foreground text-sm">
            {user
              ? "You don't have permission to access the admin panel. Please contact an administrator."
              : "Please sign in to access the admin panel."}
          </p>
        </div>
        <div className="flex gap-3">
          {user ? (
            <Button asChild variant="outline">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="outline">
                <Link href="/">Go Home</Link>
              </Button>
              <Button
                asChild
                className="bg-primary-violet text-white hover:bg-primary-violet-700"
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    );
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
