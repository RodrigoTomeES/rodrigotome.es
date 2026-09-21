import { cloudflareService, spotifyService, telegramService } from '@/services';
import { verifyState } from '@/utils/oauthState';
import { SITE_HOST } from '@/utils/site';

import type { APIRoute } from 'astro';

export const prerender = false;

const html = (message: string, status: number) =>
  new Response(
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="robots" content="noindex"><title>Spotify token</title><body style="font-family:system-ui;max-width:32rem;margin:4rem auto;padding:0 1rem"><p>${message}</p></body></html>`,
    {
      status,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    },
  );

export const GET: APIRoute = async ({ url }) => {
  const params = url.searchParams;
  const code = params.get('code');
  const state = params.get('state');

  if (params.get('error') || !code || !state) {
    return html('Spotify authorization was cancelled or is incomplete.', 400);
  }

  if (!(await verifyState(state, spotifyService.getClientSecret()))) {
    return html('Invalid or expired link.', 400);
  }

  const allowedUserId = import.meta.env.SPOTIFY_ALLOWED_USER_ID as string;
  if (!allowedUserId || !cloudflareService.isConfigured()) {
    return html('Automatic token renewal is not configured.', 501);
  }

  try {
    const { accessToken, refreshToken } =
      await spotifyService.exchangeCodeForAccessAndRefreshToken(code);

    // Only accept tokens that belong to the site owner.
    const userId = await spotifyService.getProfileId(accessToken);
    if (userId !== allowedUserId) {
      return html('This Spotify account is not allowed.', 403);
    }

    if (import.meta.env.DEV) {
      return html('Development mode: the token was not persisted.', 200);
    }

    await cloudflareService.updatePagesSecret(
      'SPOTIFY_REFRESH_TOKEN',
      refreshToken,
    );
    await cloudflareService.triggerDeploy();
    await telegramService.sendMessage(
      `✅ ${SITE_HOST}: token de Spotify renovado, redeploy en curso.`,
    );

    return html('Token updated. A new deployment is in progress.', 200);
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'Unknown error';
    await telegramService.sendMessage(
      `❌ ${SITE_HOST}: no se pudo renovar el token de Spotify. ${reason}`,
    );
    return html('Could not renew the token.', 500);
  }
};
