import {
  SpotifyErrorAuth,
  SpotifyErrorNoPlaying,
  SpotifyService,
} from './spotify';

const spotifyService = new SpotifyService();

export default spotifyService;
export { SpotifyErrorAuth, SpotifyErrorNoPlaying };
export type { SpotifyResponse } from './types';
