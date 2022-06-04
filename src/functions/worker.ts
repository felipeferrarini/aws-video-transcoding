import { SQSHandler } from "aws-lambda";
import { S3 } from "aws-sdk";
import { SqsPayload } from "../common/types";
import { uploadFromStream } from "../common/utils";
import { transcode } from "../services";

const s3 = new S3({ apiVersion: "2006-03-01" });

export const handler: SQSHandler = async (event, _context) => {
  try {
    const { file, resolution }: SqsPayload = JSON.parse(event.Records[0].body);

    console.log(`✉️ [Worker] Message: [${resolution.suffix}] ${file.name}`);

    const originFile = s3.getObject({
      Bucket: file.bucket,
      Key: file.name,
    });
    const destinationFile = file.name.replace(
      ".mkv",
      `_${resolution.suffix}.mp4`
    );

    const originStream = originFile.createReadStream();
    const destinationStream = uploadFromStream(s3, {
      Bucket: process.env.S3_BUCKET_DESTINATION || "",
      Key: destinationFile,

      ContentType: "video/mp4",
    });

    await transcode(resolution, originStream, destinationStream);
  } catch (error) {
    console.log(`Error:`, error);
  }
};
