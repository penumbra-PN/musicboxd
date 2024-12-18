import Link from "next/link";
import { redirect } from "next/navigation";

import { type Session } from "lucia";

import CreatePostForm from "@/components/CreatePostForm";

import { getSession } from "@/lib/lucia";

export default async function CreatePostPage() {
  const session: Session = await getSession();

  if (!session) {
    return redirect("/login");
  }

  return (
    <main className="flex min-h-screen w-screen flex-col items-center justify-center gap-y-4 bg-spotify-black text-spotify-white">
      <Link href={`/posts`} className="fixed top-0 left-0 mt-5 p-2 ml-4 hover:text-spotify-green hover:underline">
        Back
      </Link>

      <CreatePostForm />
    </main>
  );
}
