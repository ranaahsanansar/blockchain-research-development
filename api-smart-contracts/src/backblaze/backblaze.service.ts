import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as B2 from 'backblaze-b2';
@Injectable()
export class BackblazeService {
  private b2Client: B2 = B2;

  constructor() {
    this.b2Client = new B2({
      applicationKeyId: process.env.APPLICATION_KEY_ID,
      applicationKey: process.env.APPLICATION_KEY,
    });
  }

  async authorizeB2() {
    try {
      await this.b2Client.authorize();
      console.log('Backblaze Authorized Succesfully');
    } catch (err) {
      console.log('Backblaze Authorization Erro:', err);
    }
  }

  async uploadFile(bucketId: string, fileName: string, data: Buffer) {
    try {
      const responseB2Url = await this.b2Client.getUploadUrl({
        bucketId: bucketId,
      });
      let uploadUrl = responseB2Url.data.uploadUrl;
      let authorizationToken = responseB2Url.data.authorizationToken;

      const uploadResonse = await this.b2Client.uploadFile({
        uploadUrl: uploadUrl,
        uploadAuthToken: authorizationToken,
        fileName: fileName,
        data: data,
      });
      return uploadResonse;
    } catch (err) {
      console.log('Error Uploading to backblaze', err);
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
