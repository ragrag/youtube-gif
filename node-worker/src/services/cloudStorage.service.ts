import { Storage } from '@google-cloud/storage';
import * as _ from 'lodash';
import { Service } from 'typedi';

@Service()
class CloudStorageService {
  private storage;
  private BUCKET_NAME;
  constructor() {
    const privateKey = _.replace(process.env.GCS_PRIVATE_KEY, new RegExp('\\\\n', 'g'), '\n');
    this.BUCKET_NAME = 'this-or-that';
    this.storage = new Storage({
      projectId: process.env.GCS_PROJECT_ID,
      credentials: {
        private_key: privateKey,
        client_email: process.env.GCS_CLIENT_EMAIL,
      },
    });
  }

  async uploadGif(gifImage: Buffer, uploadName: string) {
    try {
      const bucket = await this.storage.bucket(this.BUCKET_NAME);
      uploadName = `ytgif/${uploadName}`;
      const file = bucket.file(uploadName);
      await file.save(gifImage, {
        metadata: { contentType: 'image/gif' },
        public: true,
        validation: 'md5',
      });
      return `https://storage.googleapis.com/${this.BUCKET_NAME}/${uploadName}`;
    } catch (err) {
      throw new Error('Something went wrong while uploading image');
    }
  }
}

export default CloudStorageService;
