import { spotifyService } from '../src/lib/services';

const args = process.argv;
const providedCode = args.length === 3 && !!args[2] === true;

if (!providedCode) {
  // eslint-disable-next-line no-console
  console.log('Provide the Spotify authorization code.');
  // eslint-disable-next-line no-console
  console.log('Usage example:');
  // eslint-disable-next-line no-console
  console.log('');
  // eslint-disable-next-line no-console
  console.log('npm run get-refresh-token <code>');
  // eslint-disable-next-line no-console
  console.log('');
  process.exit(1);
}

const code = args[2];

async function printRefreshToken() {
  try {
    const { refreshToken } =
      await spotifyService.exchangeCodeForAccessAndRefreshToken(code);
    // eslint-disable-next-line no-console
    console.log('Your very lovely refresh token is: ');
    // eslint-disable-next-line no-console
    console.log('');
    // eslint-disable-next-line no-console
    console.log(`===> ${refreshToken}`);
    // eslint-disable-next-line no-console
    console.log('');
    // eslint-disable-next-line no-console
    console.log(
      "Copy and paste this into the .env file's 'SPOTIFY_REFRESH_TOKEN' section.",
    );
    process.exit(0);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}

printRefreshToken();
