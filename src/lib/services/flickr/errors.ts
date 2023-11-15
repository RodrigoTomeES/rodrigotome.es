export class FlickrAPIError extends Error {
  error: number;

  constructor(message: string, error: number) {
    super(message);
    this.name = 'FlickrAPIError';
    this.error = error;
  }
}

export class FlickrErrorGetPhotos extends FlickrAPIError {
  constructor(message: string, error: number) {
    super(message, error);
    this.name = 'FlickrErrorGetPhotos';
  }
}

export class FlickrErrorGetExif extends FlickrAPIError {
  constructor(message: string, error: number) {
    super(message, error);
    this.name = 'FlickrErrorGetPhotos';
  }
}
