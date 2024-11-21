import Link from "next/link";
import { redirect } from "next/navigation";
import { type Session } from "lucia";

import { getSession } from "@/lib/lucia";
import { type IUser } from "@/lib/models/user";
import EditProfileForm from "@/components/EditProfileForm";

export default async function EditProfilePage() {
  const session: Session = await getSession();

  if (!session) {
    return redirect("/login");
  }

  const sessionUser = session.user as IUser;

  return (
    <main className="flex min-h-screen w-screen flex-col items-center justify-center gap-y-4">
      <Link href={`/profile/${sessionUser.id}`}>Back</Link>
      <EditProfileForm username={sessionUser.username} bio={sessionUser.bio} />
    </main>
  );
}
