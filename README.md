## Spotify authentication

The Spotify "currently playing" integration is based on the authorization code flow described in [Getting the Currently Playing Song from Spotify](https://khalilstemmler.com/articles/tutorials/getting-the-currently-playing-song-spotify/) by Khalil Stemmler.

To get the authorization code, open the following URL (replacing `PASTE_HERE` with your client id and redirect URL) and then run `bun run get-refresh-token <code>`:

https://accounts.spotify.com/authorize?client_id=PASTE_HERE&response_type=code&redirect_uri=PASTE_HERE&scope=user-read-private%20user-read-currently-playing

## Telegram alert when the Spotify token expires

1. Create a bot with [@BotFather](https://t.me/BotFather) and copy its token into `TELEGRAM_BOT_TOKEN`.
2. Send any message to the bot, then open `https://api.telegram.org/bot<TOKEN>/getUpdates` and copy `message.chat.id` into `TELEGRAM_CHAT_ID`.
3. Alerts are only sent in production; they are disabled in development (`bun run dev`).
4. When Spotify rejects the refresh token, `/api/spotify` sends one alert every 24h with a Spotify login link. You can renew the token automatically (below) or manually with `bun run get-refresh-token <code>`, updating `SPOTIFY_REFRESH_TOKEN` and redeploying.

## Automatic Spotify token renewal

The login link from the Telegram alert redirects to `/api/spotify/callback`, which checks the signed `state` (valid for 24h), verifies that the authorized Spotify account is yours, stores the new refresh token in the Cloudflare Pages project and triggers a redeploy.

Setup:

1. In the Spotify dashboard, add `https://<your-domain>/api/spotify/callback` as a Redirect URI and set it as `SPOTIFY_REDIRECT_URL`.
2. Set `SPOTIFY_ALLOWED_USER_ID` to your Spotify user id (`id` field of `GET https://api.spotify.com/v1/me`). Tokens from any other account are rejected.
3. Create a Cloudflare API token with only the **Cloudflare Pages: Edit** permission and set `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_PAGES_PROJECT`.
4. Create a deploy hook (Pages → Settings → Builds → Deploy hooks) and set `CLOUDFLARE_DEPLOY_HOOK_URL`.

The new token is active after the redeploy finishes (about 1-2 minutes).

## Licence

The codebase of this project is distributed under the [GNU General Public License (GPL) version 3.0](LICENCE). However, it is important to note that certain resources utilized within the project may be subject to different licenses. It is recommended to review the specific licenses associated with each resource to ensure compliance with their respective terms and conditions.
