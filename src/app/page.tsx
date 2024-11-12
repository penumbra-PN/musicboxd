import Link from "next/link";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/lucia";

export default async function HomePage() {
  const session = await getSession();

  if (session) {
    redirect("/profile");
  }

  return (
    <div className="mx-auto flex min-h-screen flex-col">
      <nav className="flex items-center justify-between p-2 text-lg">
        <Link href="/">Musicboxd</Link>
        <div className="flex gap-x-2">
          <Link href="/login">Log In</Link>
          <Link href="/signup">Sign Up</Link>
        </div>
      </nav>
      <main className="flex grow items-center justify-center">
        <h1 className="text-4xl">
          <strong>Musicboxd</strong>
        </h1>
      </main>
    </div>
  );
}
