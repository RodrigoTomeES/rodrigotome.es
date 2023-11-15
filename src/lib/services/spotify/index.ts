import { SpotifyErrorNoPlaying, SpotifyService } from './spotify';

const spotifyService = new SpotifyService();

export default spotifyService;
export { SpotifyErrorNoPlaying };
export type { SpotifyResponse } from './types';
