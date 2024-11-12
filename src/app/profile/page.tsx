import { redirect } from "next/navigation";

import LogoutButton from "@/components/LogoutButton";
import { getSession } from "@/lib/lucia";

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      {session && (
        <div className="flex flex-col">
          <h1>Home</h1>
          <span>{session.user.username}</span>
          <LogoutButton />
        </div>
      )}
    </div>
  );
}
