## Spotify authentication

The Spotify "currently playing" integration is based on the authorization code flow described in [Getting the Currently Playing Song from Spotify](https://khalilstemmler.com/articles/tutorials/getting-the-currently-playing-song-spotify/) by Khalil Stemmler.

To get the authorization code, open the following URL (replacing `PASTE_HERE` with your client id and redirect URL) and then run `bun run get-refresh-token <code>`:

https://accounts.spotify.com/authorize?client_id=PASTE_HERE&response_type=code&redirect_uri=PASTE_HERE&scope=user-read-private%20user-read-currently-playing

## Telegram alert when the Spotify token expires

1. Create a bot with [@BotFather](https://t.me/BotFather) and copy its token into `TELEGRAM_BOT_TOKEN`.
2. Send any message to the bot, then open `https://api.telegram.org/bot<TOKEN>/getUpdates` and copy `message.chat.id` into `TELEGRAM_CHAT_ID`.
3. When Spotify rejects the refresh token, `/api/spotify` sends one alert every 24h. Regenerate it with `bun run get-refresh-token <code>`, update `SPOTIFY_REFRESH_TOKEN` and redeploy.

## Licence

The codebase of this project is distributed under the [GNU General Public License (GPL) version 3.0](LICENCE). However, it is important to note that certain resources utilized within the project may be subject to different licenses. It is recommended to review the specific licenses associated with each resource to ensure compliance with their respective terms and conditions.
