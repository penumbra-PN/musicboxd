import Link from "next/link";
import { redirect } from "next/navigation";
import { type Session } from "lucia";

import { getSession } from "@/lib/lucia";
import type { IUser } from "@/lib/models/user";
import EditProfileForm from "@/components/EditProfileForm";

export default async function EditProfilePage() {
  const session: Session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const user = session.user as IUser;

  return (
    <main className="flex min-h-screen w-screen flex-col items-center justify-center">
      <Link href="/profile">Back</Link>
      <h1>Editing {user.username}&#39;s Profile</h1>
      <EditProfileForm id={user.id} username={user.username} bio={user.bio} />
    </main>
  );
}
