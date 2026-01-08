"use client";

import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { api } from "../../convex/_generated/api";

type Role = "user" | "staff" | "admin";

export function useSession() {
  const [session, setSession] = useState<{
    user: { id: string; name: string; email: string } | null;
    isLoading: boolean;
  }>({ user: null, isLoading: true });

  useEffect(() => {
    authClient.getSession().then((result) => {
      setSession({
        user: result.data?.user ?? null,
        isLoading: false,
      });
    });
  }, []);

  return session;
}

export function useRequireAuth(redirectTo = "/login") {
  const router = useRouter();
  const { user, isLoading } = useSession();

  useEffect(() => {
    if (!(isLoading || user)) {
      router.push(redirectTo);
    }
  }, [isLoading, user, router, redirectTo]);

  return { user, isLoading, isAuthenticated: !!user };
}

export function useRequireRole(
  requiredRole: Role | Role[],
  redirectTo = "/dashboard"
) {
  const router = useRouter();
  const { user, isLoading: sessionLoading } = useSession();
  const roleData = useQuery(api.profiles.getRole);
  const isLoadingRole = roleData === undefined;
  const currentRole = (roleData ?? "user") as Role;

  const allowedRoles = Array.isArray(requiredRole)
    ? requiredRole
    : [requiredRole];

  useEffect(() => {
    if (!(sessionLoading || user)) {
      router.push("/login");
      return;
    }

    if (!(sessionLoading || isLoadingRole) && user) {
      const hasAccess =
        allowedRoles.includes(currentRole) ||
        (allowedRoles.includes("staff") && currentRole === "admin");

      if (!hasAccess) {
        router.push(redirectTo);
      }
    }
  }, [
    sessionLoading,
    isLoadingRole,
    user,
    currentRole,
    allowedRoles,
    router,
    redirectTo,
  ]);

  return {
    user,
    role: currentRole,
    isLoading: sessionLoading || isLoadingRole,
    hasAccess:
      allowedRoles.includes(currentRole) ||
      (allowedRoles.includes("staff") && currentRole === "admin"),
  };
}
