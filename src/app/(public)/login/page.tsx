import { redirect } from "next/navigation";

import LoginForm from "@/components/LoginForm";
import { getSession } from "@/lib/lucia";

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/profile");
  }

  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center">
      <LoginForm />
    </div>
  );
}
