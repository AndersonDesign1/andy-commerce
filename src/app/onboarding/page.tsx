import { redirect } from "next/navigation";
import { OnboardingFlow } from "@/components/auth/onboarding-flow";
import { fetchAuthQuery, isAuthenticated } from "@/lib/auth-server";
import { api } from "../../../convex/_generated/api";

export const metadata = {
  title: "Get Started | Flik",
  description:
    "Tell us about yourself so we can personalize your Flik experience.",
};

export default async function OnboardingPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/login?redirect=/onboarding");
  }

  const profile = await fetchAuthQuery(api.profiles.getProfile);

  if (profile?.onboardingCompleted) {
    redirect("/dashboard");
  }

  return <OnboardingFlow />;
}
