import { redirect } from "next/navigation";

import LogoutButton from "@/components/LogoutButton";
import { getSession } from "@/lib/lucia";

export default async function Home() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl py-2">
      {session && (
        <div>
          <h1>Home</h1>
          <code>{session.user.username}</code>
          <LogoutButton />
        </div>
      )}
    </main>
  );
}
