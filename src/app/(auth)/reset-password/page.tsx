import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata = {
  title: "Reset Password | Flik",
  description: "Set a new password for your Flik account.",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
