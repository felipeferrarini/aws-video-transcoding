import { Handler } from "aws-lambda";

export const handler: Handler = async (event, _context) => {
  console.log(event);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v1.0! Your function executed successfully!",
      input: event,
    }),
  };
};
