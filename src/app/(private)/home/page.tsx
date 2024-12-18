import Link from "next/link";
import { redirect } from "next/navigation";

import type { Session } from "lucia";

import { getSession } from "@/lib/lucia";
import Song, { type ISong } from "@/lib/models/song";
import User, { type IUser } from "@/lib/models/user";

export default async function HomePage() {
  const session: Session = await getSession();

  if (!session) {
    return redirect("/login");
  }

  const sessionUser = session.user as IUser;

  const songs = (await Song.find().exec()) as ISong[];
  const popularSongs = songs.sort((a, b) => b.reviews.length - a.reviews.length).slice(0, 20);

  const recentlyListened = (await Promise.all(
    sessionUser.recently_listened.map(async (song_id) => {
      return (await Song.findById(song_id).exec()) as ISong;
    }),
  )) as ISong[];

  const friends = (await Promise.all(
    sessionUser.friends.map(async (id) => {
      return (await User.findById(id).exec()) as IUser;
    }),
  )) as IUser[];

  return (
    <main className="flex min-h-screen w-screen flex-col bg-spotify-black text-spotify-white">
      <nav className="w-screen h-fit p-4 flex justify-between shadow-md">
        <Link className="hover:underline hover:text-spotify-green text-xl" href={`/profile/${sessionUser.id}`}>
          Go to Profile
        </Link>
        <div className="flex gap-x-5 pr-4">
          <Link className="hover:underline hover:text-spotify-green text-xl" href="/songs">
            Search Songs
          </Link>
          <Link className="hover:underline hover:text-spotify-green text-xl" href="/posts">
            Search Posts
          </Link>
        </div>
      </nav>
      <div className="flex min-h-screen w-screen">
        <div className="grow flex flex-col p-4 border-solid border-r border-black items-center">
          <h2 className="text-2xl text-spotify-green underline">
            <strong>Popular Songs</strong>
          </h2>
          <ul className="flex flex-col w-full">
            {popularSongs.map((song) => {
              return (
                <li className="p-2 w-full" key={song.id}>
                  <a className="text-lg hover:text-spotify-green hover:underline" href={`/songs/${song.spotify_id}`}>
                    {song.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="grow flex flex-col p-4 border-solid border-r border-black items-center">
          <h2 className="text-2xl text-spotify-green underline">
            <strong>Recently Listened</strong>
          </h2>
          <ul className="flex flex-col w-full">
            {recentlyListened.map((song) => {
              return (
                <li className="p-2 w-full" key={song.id}>
                  <a className="text-lg hover:text-spotify-green hover:underline" href={`/songs/${song.spotify_id}`}>
                    {song.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="grow flex flex-col p-4 items-center">
          <h2 className="text-2xl text-spotify-green underline">
            <strong>Friend Activities</strong>
          </h2>
          <ul className="flex flex-col w-full">
            {await Promise.all(
              friends.map(async (friend) => {
                const recentlyListened = (await Promise.all(
                  friend.recently_listened.map(async (song_id) => {
                    return (await Song.findById(song_id).exec()) as ISong;
                  }),
                )) as ISong[];

                if (recentlyListened.length <= 0) {
                  return null;
                }

                return (
                  <li className="p-2 w-full" key={friend.id}>
                    <p className="text-xl underline">{friend.username}</p>
                    <ul className="flex flex-col w-full">
                      {recentlyListened.map((song) => {
                        return (
                          <li className="p-2 w-full" key={song.id}>
                            <a className="text-lg" href={`/songs/${song.spotify_id}`}>
                              {song.name}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              }),
            )}
          </ul>
        </div>
      </div>
    </main>
  );
}
