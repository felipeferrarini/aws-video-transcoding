import { S3 } from "aws-sdk";
import { PassThrough } from "stream";

export function uploadFromStream(s3: S3, params: S3.PutObjectRequest) {
  var pass = new PassThrough();

  s3.upload(params, (err: Error, data: S3.ManagedUpload.SendData) => {
    console.log(err, data);
  });

  return pass;
}
