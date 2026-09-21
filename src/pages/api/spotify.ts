import {
  SpotifyErrorAuth,
  SpotifyErrorNoPlaying,
  spotifyService,
  telegramService,
} from '@/services';
import { createState } from '@/utils/oauthState';

import type { SpotifyResponse } from '@/services';

export const prerender = false;

const ALERT_CACHE_KEY = 'https://rodrigotome.es/__alerts/spotify-auth';
const ALERT_TTL_SECONDS = 60 * 60 * 24;

/**
 * Notifies via Telegram at most once every 24h (per Cloudflare location)
 * so a dead token doesn't send one message per page visit.
 */
async function notifyTokenExpired(reason: string) {
  if (!telegramService.isConfigured()) return;

  const cache =
    typeof caches === 'undefined'
      ? undefined
      : (caches as unknown as { default?: Cache }).default;

  if (cache && (await cache.match(ALERT_CACHE_KEY))) return;

  const state = await createState(spotifyService.getClientSecret());
  const sent = await telegramService.sendMessage(
    [
      '⚠️ rodrigotome.es: el token de Spotify ha caducado.',
      `Motivo: ${reason}`,
      '',
      'Inicia sesión para renovarlo (el enlace caduca en 24 h):',
      spotifyService.getAuthorizeUrl(state),
    ].join('\n'),
  );

  if (sent && cache) {
    await cache.put(
      ALERT_CACHE_KEY,
      new Response('sent', {
        headers: { 'Cache-Control': `max-age=${ALERT_TTL_SECONDS}` },
      }),
    );
  }
}

export async function GET() {
  try {
    const transform = (data: SpotifyResponse) => ({
      artist: data.item.artists[0].name,
      song: data.item.name,
      cover: data.item.album.images[0].url,
      isPlaying: data.is_playing,
      songUrl: data.item.external_urls.spotify,
      progress: data.progress_ms,
      duration: data.item.duration_ms,
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

    if (error instanceof SpotifyErrorAuth) {
      await notifyTokenExpired(error.message);
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
