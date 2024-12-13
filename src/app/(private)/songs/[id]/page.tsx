import { redirect } from "next/navigation";
import { type Session } from "lucia";
import { getSession } from "@/lib/lucia";
import SongPage from "@/components/SongPage";

export default async function SongDetailPage({ params }: { params: { id: string } }) {
  const session: Session = await getSession();

  if (!session) {
    return redirect("/login");
  }

  return <SongPage id={params.id} session={session} />;
}
