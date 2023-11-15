import { SpotifyErrorNoPlaying, spotifyService } from '@/services';

import type { SpotifyResponse } from '@/services';

export const prerender = false;

export async function GET() {
  try {
    const transform = (data: SpotifyResponse) => ({
      artist: data.item.artists[0].name,
      song: data.item.name,
      album: data.item.album.name,
      cover: data.item.album.images[0].url,
      isPlaying: data.is_playing,
    });

    return new Response(
      JSON.stringify(transform(await spotifyService.getCurrentlyPlayingSong())),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    if (error instanceof SpotifyErrorNoPlaying) {
      return new Response(JSON.stringify({ isPlaying: false }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(error), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
