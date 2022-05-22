import { Handler } from "aws-lambda";
import AWS from "aws-sdk";
import { File, Resolution } from "../common/types";

const sqs = new AWS.SQS({
  apiVersion: "latest",
});

const resolutions: Resolution[] = [
  { suffix: "1080", size: "1920x1080" },
  { suffix: "720", size: "1280x720" },
  { suffix: "360", size: "620x360" },
];

export const handler: Handler = async (event, _context) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  // Get the object from the event and show its content type
  const bucket = event.Records[0].s3.bucket.name;
  const fileName = decodeURIComponent(event.Records[0].s3.object.key);

  const file: File = {
    bucket,
    name: fileName,
  };

  // Send a message into SQS
  await Promise.all(
    resolutions.map((resolution) =>
      sqs
        .sendMessage({
          QueueUrl: process.env.QUEUE_URL || "",
          MessageBody: JSON.stringify({
            file,
            resolution,
          }),
        })
        .promise()
    )
  );
};
