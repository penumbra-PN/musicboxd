import Link from "next/link";
import { redirect } from "next/navigation";

import { type Session } from "lucia";

import EditProfileForm from "@/components/EditProfileForm";

import { getSession } from "@/lib/lucia";
import { type IUser } from "@/lib/models/user";

export default async function EditProfilePage() {
  const session: Session = await getSession();

  if (!session) {
    return redirect("/login");
  }

  const sessionUser = session.user as IUser;

  return (
    <main className="flex min-h-screen w-screen flex-col items-center justify-center gap-y-4 bg-spotify-black text-spotify-white">
      <Link href={`/profile/${sessionUser.id}`} className="absolute top-0 left-0 p-4 hover:text-spotify-green hover:underline">Back</Link>
      <EditProfileForm username={sessionUser.username} bio={sessionUser.bio} />
    </main>
  );
}
