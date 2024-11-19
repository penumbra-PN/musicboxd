import { redirect } from "next/navigation";

import SignupForm from "@/components/SignupForm";
import { getSession } from "@/lib/lucia";

export default async function SignupPage() {
  const session = await getSession();

  if (session) {
    redirect("/profile");
  }

  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center">
      <SignupForm />
    </div>
  );
}
