import { redirect } from "next/navigation";

import Header from "@/components/Header";
import SignupForm from "@/components/SignupForm";

import { getSession } from "@/lib/lucia";
import { type IUser } from "@/lib/models/user";

export default async function SignupPage() {
  const session = await getSession();

  if (session) {
    const sessionUser = session.user as IUser;
    return redirect(`/profile/${sessionUser.id}`);
  }

  return (
    <div className="mx-auto flex min-h-screen flex-col bg-spotify-black text-spotify-green">
      <Header />
      <main className="flex grow items-center justify-center">
        <SignupForm />
      </main>
    </div>
  );
}
