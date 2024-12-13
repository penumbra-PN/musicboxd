import { NextResponse } from "next/server";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: '41c08a28808c48cab50a60e9fd3e988c',
  clientSecret: 'd018aec4e9c5483dbc01cc25fc325f7e',
});

const initializeSpotifyToken = async () => {
  const data = await spotifyApi.clientCredentialsGrant();
  spotifyApi.setAccessToken(data.body.access_token);
};

export const GET = async (request: Request) => {
  try {
    const {searchParams} = new URL(request.url);
    const query = searchParams.get("query");

    if(!query){
      return NextResponse.json(
        {error: "Missing 'query paramenter in request"},
        {status:400}
      );
    }

    if (!spotifyApi.getAccessToken()) {
      console.log("Access token missing, initializing...");
      await initializeSpotifyToken();
    }

    const data = await spotifyApi.searchTracks(query);

    const songs = data.body.tracks.items.map((track) => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map((artist) => artist.name),
      album: track.album.name,
      image: track.album.images[0]?.url,
      preview_url: track.preview_url
    }));

    return NextResponse.json({ songs });
  } catch (error) {
    console.error("Error fetching songs:", error);
    return NextResponse.json({ error: "Failed to fetch songs" }, { status: 500 });
  }
};