import React from 'react';
import { redirect } from "next/navigation";
import { type Session } from "lucia";
import SongsSearch from '@/components/SongsSearch';
import { getSession } from "@/lib/lucia";
import Link from "next/link";

export default async function SongsPage(){
  const session: Session = await getSession();

  if (!session) {
    return redirect("/login");
  }

  try{
  return (
    <main className="flex min-h-screen w-screen flex-col items-center justify-start p-8 gap-y-8 bg-spotify-black text-spotify-white">
      <Link className="absolute top-0 left-0 p-4 hover:underline hover:text-spotify-green" href="/home">Back</Link>
      <h1 className="text-4xl text-spotify-green font-bold">Spotify Song Search</h1>
      <p className="">Search for songs using the Spotify API.</p>
      <SongsSearch />
    </main>
    );
  } catch (e){
    console.log(e);
    return <div>An Error Occured.</div>;
  }
};
