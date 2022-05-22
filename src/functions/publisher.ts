import { Handler } from "aws-lambda";
import AWS from "aws-sdk";

const sqs = new AWS.SQS({
  apiVersion: "latest",
  region: process.env.AWS_REGION,
});

export const handler: Handler = async (event, _context) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  // Get the object from the event and show its content type
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(event.Records[0].s3.object.key);
  const params = {
    Bucket: bucket,
    Key: key,
  };

  // Send a message into SQS
  await sqs
    .sendMessage({
      QueueUrl: process.env.QUEUE_URL || "",
      MessageBody: JSON.stringify(params),
    })
    .promise();
};
