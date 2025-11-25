import cloudinary, {
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';
export function uploads(
  file: string,
  public_id?: string,
  overwrite?: boolean,
  invalidate?: boolean
): Promise<UploadApiResponse | UploadApiErrorResponse | undefined> {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      file,
      { public_id, overwrite, invalidate, resource_type: 'auto' },
      (err: any, result: any) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
}
export function videosUploads(
  file: string,
  public_id?: string,
  overwrite?: boolean,
  invalidate?: boolean
): Promise<UploadApiResponse | UploadApiErrorResponse | undefined> {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      file,
      {
        public_id,
        overwrite,
        invalidate,
        chunk_size: 6000000,
        resource_type: 'video',
      },
      (err: any, result: any) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
}
