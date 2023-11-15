// GetPhotosResponse
export type GetPhotosResponse = GetPhotosResponseOK | GetPhotosResponseFail;

export type GetPhotosResponseOK = {
  photoset: GetPhotosPhotoset;
  stat: 'ok';
};

export type GetPhotosResponseFail = {
  stat: 'fail';
  code: number;
  message: string;
};

export type GetPhotosPhotoset = {
  id: string;
  primary: string;
  owner: string;
  ownername: string;
  photo: GetPhotosPhoto[];
  page: number;
  per_page: string;
  perpage: string;
  pages: number;
  title: string;
  total: number;
};

export type GetPhotosPhoto = {
  id: string;
  secret: string;
  server: string;
  farm: number;
  title: string;
  isprimary: string;
  ispublic: number;
  isfriend: number;
  isfamily: number;
  datetaken: Date;
  datetakengranularity: number;
  datetakenunknown: string;
  tags: string;
  originalsecret: string;
  originalformat: string;
  latitude: string;
  longitude: string;
  accuracy: string;
  context: number;
  place_id: string;
  woeid: string;
  geo_is_public: number;
  geo_is_contact: number;
  geo_is_friend: number;
  geo_is_family: number;
  url_o: string;
  height_o: number;
  width_o: number;
};

// GetExifResponse
export type GetExifResponse = GetExifResponseOK | GetExifResponseFail;

export type GetExifResponseOK = {
  photo: GetExifPhoto;
  stat: 'ok';
};

export type GetExifResponseFail = {
  stat: 'fail';
  code: number;
  message: string;
};

export type GetExifPhoto = {
  id: string;
  secret: string;
  server: string;
  farm: number;
  camera: string;
  exif: GetExifExif[];
};

export type GetExifExif = {
  tagspace: GetExifTagspace;
  tagspaceid: number;
  tag: GetExifExiftTag;
  label: string;
  raw: GetExifClean;
  clean?: GetExifClean;
};

export type GetExifExiftTag =
  | 'JFIFVersion'
  | 'ResolutionUnit'
  | 'XResolution'
  | 'YResolution'
  | 'BitsPerSample'
  | 'Make'
  | 'Model'
  | 'Orientation'
  | 'ResolutionUnit'
  | 'Software'
  | 'ModifyDate'
  | 'YCbCrPositioning'
  | 'ExposureTime'
  | 'FNumber'
  | 'ExposureProgram'
  | 'ISO'
  | 'ExifVersion'
  | 'DateTimeOriginal'
  | 'CreateDate'
  | 'ComponentsConfiguration'
  | 'CompressedBitsPerPixel'
  | 'BrightnessValue'
  | 'ExposureCompensation'
  | 'MaxApertureValue'
  | 'MeteringMode'
  | 'LightSource'
  | 'Flash'
  | 'FocalLength'
  | 'SubSecTime'
  | 'SubSecTimeOriginal'
  | 'SubSecTimeDigitized'
  | 'FlashpixVersion'
  | 'ColorSpace'
  | 'SensingMethod'
  | 'FileSource'
  | 'SceneType'
  | 'CustomRendered'
  | 'ExposureMode'
  | 'WhiteBalance'
  | 'DigitalZoomRatio'
  | 'FocalLengthIn35mmFormat'
  | 'SceneCaptureType'
  | 'GainControl'
  | 'Contrast'
  | 'Saturation'
  | 'Sharpness'
  | 'SubjectDistanceRange'
  | 'InteropIndex'
  | 'InteropVersion'
  | 'GPSVersionID'
  | 'GPSLatitudeRef'
  | 'GPSLatitude'
  | 'GPSLongitudeRef'
  | 'GPSLongitude'
  | 'GPSAltitudeRef'
  | 'GPSAltitude'
  | 'GPSTimeStamp'
  | 'GPSProcessingMethod'
  | 'GPSDateStamp';

export type GetExifClean = {
  _content: string;
};

export enum GetExifTagspace {
  ExifIFD = 'ExifIFD',
  Gps = 'GPS',
  Ifd0 = 'IFD0',
  InteropIFD = 'InteropIFD',
  Jfif = 'JFIF',
}

// GetAlbumResponse
export type GetAlbumResponse = Array<GetAlbumPhoto>;

export type GetAlbumPhoto = {
  title: string;
  tags: string[];
  date: Date;
  latitude?: string;
  longitude?: string;
  url: string;
  height: number;
  width: number;
  format: string;
  camera: string;
  exif: Array<
    Omit<GetExifExif, 'tag' | 'raw' | 'clean'> & {
      tag:
        | 'FocalLength'
        | 'FNumber'
        | 'ISO'
        | 'ExposureProgram'
        | 'WhiteBalance'
        | 'GPSAltitude'
        | 'FocalLengthIn35mmFormat'
        | 'ExposureTime';
      raw: string;
      clean?: string;
    }
  >;
};
