import { FlickrService } from './flickr';

const flickrService = new FlickrService();

export default flickrService;
export { FlickrErrorGetExif, FlickrErrorGetPhotos } from './errors';
export type { GetAlbumResponse } from './types';
