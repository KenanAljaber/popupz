import { S3 } from "aws-sdk";

export default class Credentials {
  static bucket = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  static async uploadCredentials(
    privateUrl,
    maxSizeInBytes,
    publicRead,
    tokenExpiresAt
  ) {
    const expires = tokenExpiresAt || Date.now() + 10 * 60 * 1000;

    const Conditions: Array<any> = [];

    if (maxSizeInBytes) {
      Conditions.push(["content-length-range", 0, maxSizeInBytes]);
    }

    let publicUrl;

    const Fields: any = { key: privateUrl };

    if (publicRead) {
      Fields.acl = "public-read";
      Conditions.push({ acl: "public-read" });
      publicUrl = await this.downloadUrl(privateUrl, publicRead);
    }

    const policy = await this.bucket.createPresignedPost({
      Bucket: process.env.AWS_BUCKET_NAME,
      Fields,
      Expires: tokenExpiresAt,
      Conditions,
    });

    return {
      ...policy,
      publicUrl,
    };
  }

  static async downloadUrl(privateUrl, publicRead) {
    if (publicRead) {
      return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/`;
    }

    const params = {
      Key: privateUrl,
      Bucket: process.env.AWS_BUCKET_NAME,
    };

    return await this.bucket.getSignedUrlPromise("getObject", params);
  }
}
