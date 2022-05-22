import { createReadStream, createWriteStream } from "node:fs";
import { Resolution } from "./common/types";
import { transcode } from "./services";

const main = async () => {
  const resolution: Resolution = {
    suffix: "720",
    size: "1280x720",
  };

  const inputStream = createReadStream("./src/video-test.mkv");
  const outputStream = createWriteStream("./src/video-test-decoded.mp4");

  await transcode(resolution, inputStream, outputStream);
};

main();
