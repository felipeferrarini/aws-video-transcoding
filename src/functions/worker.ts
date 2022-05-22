import { SQSHandler } from "aws-lambda";
import { SqsPayload } from "../common/types";
import { transcode } from "../services";

export const handler: SQSHandler = async (event, _context) => {
  for (const message of event.Records) {
    const { file, resolution }: SqsPayload = JSON.parse(message.body);

    console.log(`✉️ [Worker] Message: [${resolution.suffix}] ${file.name}`);

    await transcode(file, resolution);
  }
};
