export {
  default as spotifyService,
  SpotifyErrorAuth,
  SpotifyErrorNoPlaying,
} from './spotify';
export {
  default as flickrService,
  FlickrErrorGetExif,
  FlickrErrorGetPhotos,
} from './flickr';
export { default as telegramService } from './telegram';
export { default as cloudflareService, CloudflareError } from './cloudflare';

export type { SpotifyResponse } from './spotify';
export type { GetAlbumResponse } from './flickr';
