import React from 'react';
import { redirect } from "next/navigation";
import { type Session } from "lucia";
import SongsSearch from '@/components/SongsSearch';
import { getSession } from "@/lib/lucia";

export default async function SongsPage(){
  const session: Session = await getSession();

  if (!session) {
    return redirect("/login");
  }

  try{
  return (
    <main className="flex min-h-screen w-screen flex-col items-center justify-start p-8 gap-y-8">
      <h1 className="text-4xl font-bold">Spotify Song Search</h1>
      <p className="text-gray-600">Search for songs using the Spotify API.</p>
      <SongsSearch />
    </main>
    );
  } catch (e){
    console.log(e);
    return <div>An Error Occured.</div>;
  }
};
