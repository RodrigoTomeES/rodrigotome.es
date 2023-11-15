import { FlickrErrorGetExif, FlickrErrorGetPhotos } from './errors';

import type {
  GetAlbumPhoto,
  GetAlbumResponse,
  GetExifResponse,
  GetExifResponseOK,
  GetPhotosResponse,
  GetPhotosResponseOK,
} from './types';

export interface IFlickrService {
  getAlbum: (photosetId: string, userId: string) => Promise<GetAlbumResponse>;
}

export class FlickrService implements IFlickrService {
  private apiKey: string = import.meta.env.FLICKR_API_KEY as string;

  /**
   * Get the list of photos in a set.
   * @see https://www.flickr.com/services/api/flickr.photosets.getPhotos.html
   * @param photosetId The id of the photoset to return the photos for.
   * @param userId The user_id here is the owner of the set passed in photoset_id.
   * @returns A promise that resolves to a GetPhotosResponse object.
   */
  private async getPhotos(
    photosetId: string,
    userId: string,
  ): Promise<GetPhotosResponseOK> {
    try {
      const response = await fetch(
        `https://www.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${this.apiKey}&photoset_id=${photosetId}&user_id=${userId}&extras=date_taken%2C+geo%2C+url_o%2C+original_format%2C+tags&per_page=5&privacy_filter=1&media=photo&format=json&nojsoncallback=1`,
      );

      if (!response.ok)
        throw new Error(
          `Error fetching Flickr getPhotos: ${response.statusText}`,
        );

      const data: GetPhotosResponse = await response.json();

      if (data.stat !== 'ok')
        throw new FlickrErrorGetPhotos(data.message, data.code);

      return data;
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  }

  /**
   * Retrieves a list of EXIF/TIFF/GPS tags for a given photo. The calling user must have permission to view the photo.
   * @see https://www.flickr.com/services/api/flickr.photos.getExif.html
   * @param photoId The id of the photo to fetch information for.
   * @param secret The secret for the photo. If the correct secret is passed then permissions checking is skipped. This enables the 'sharing' of individual photos by passing around the id and secret.
   * @returns A promise that resolves to a GetExifResponse object.
   */
  private async getExif(
    photoId: string,
    secret: string,
  ): Promise<GetExifResponseOK> {
    try {
      const response = await fetch(
        `https://www.flickr.com/services/rest/?method=flickr.photos.getExif&api_key=${this.apiKey}&photo_id=${photoId}&secret=${secret}&format=json&nojsoncallback=1`,
      );

      if (!response.ok)
        throw new Error(
          `Error fetching Flickr getExif of ${photoId}: ${response.statusText}`,
        );

      const data: GetExifResponse = await response.json();

      if (data.stat !== 'ok')
        throw new FlickrErrorGetExif(data.message, data.code);

      return data;
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  }

  public async getAlbum(
    photosetId: string,
    userId: string,
  ): Promise<GetAlbumResponse> {
    try {
      const photos = await this.getPhotos(photosetId, userId);

      return await Promise.all(
        photos.photoset.photo.map(async (photo) => {
          const exif = await this.getExif(photo.id, photo.secret);
          const {
            datetaken,
            geo_is_public,
            height_o,
            latitude,
            longitude,
            originalformat,
            title,
            url_o,
            width_o,
          } = photo;

          return {
            title,
            tags: photo.tags.split(' '),
            date: datetaken,
            url: url_o,
            height: height_o,
            width: width_o,
            format: originalformat,
            ...(geo_is_public === 1 ? { latitude, longitude } : {}),
            camera: exif.photo.camera,
            exif: exif.photo.exif
              .filter(
                (item) =>
                  item.tag === 'FocalLength' ||
                  item.tag === 'FNumber' ||
                  item.tag === 'ISO' ||
                  item.tag === 'ExposureProgram' ||
                  item.tag === 'WhiteBalance' ||
                  item.tag === 'GPSAltitude' ||
                  item.tag === 'FocalLengthIn35mmFormat' ||
                  item.tag === 'ExposureTime',
              )
              .map((item) => ({
                ...item,
                raw: item.raw._content,
                ...(item.clean ? { clean: item.clean._content } : {}),
              })) as GetAlbumPhoto['exif'],
          };
        }),
      );
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  }
}
