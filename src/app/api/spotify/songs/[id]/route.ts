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

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Song ID is required" }, { status: 400 });
  }

  try {
    if (!spotifyApi.getAccessToken()) {
      await initializeSpotifyToken();
    }

    const track = await spotifyApi.getTrack(id, {market: 'US'});

    const song = {
      id: track.body.id,
      name: track.body.name,
      artists: track.body.artists.map((artist) => artist.name),
      album: track.body.album.name,
      image: track.body.album.images[0]?.url || null,
      release_date: track.body.album.release_date,
      duration: track.body.duration_ms,
      preview_url: track.body.preview_url || null,
    };

    return NextResponse.json({ song });
  } catch (error) {
    console.error("Error fetching song details:", error);
    return NextResponse.json(
      { error: "Failed to fetch song details" },
      { status: 500 }
    );
  }
};
