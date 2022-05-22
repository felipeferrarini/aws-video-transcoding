import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";
import { Readable, Writable } from "stream";
import { Resolution } from "../common/types";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export const transcode = async (
  resolution: Resolution,
  originStream: Readable,
  destinationStream: Writable
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    ffmpeg(originStream)
      .withOutputOption("-f mp4")
      .withOutputOption("-preset superfast")
      .withOutputOption("-movflags frag_keyframe+empty_moov")
      .withOutputOption("-max_muxing_queue_size 9999")
      .withVideoCodec("libx264")
      .withSize(resolution.size)
      .withAspectRatio("16:9")
      .on("start", (cmdLine) => {
        console.log(`[${resolution.suffix}] Started FFMpeg`, cmdLine);
      })
      .on("end", () => {
        console.log(`[${resolution.suffix}] Sucess!.`);

        resolve();
      })
      .on("error", (err: Error, stdout, stderr) => {
        console.log(`[${resolution.suffix}] Error:`, err.message);
        console.error("stdout:", stdout);
        console.error("stderr:", stderr);

        reject();
      })
      .pipe(destinationStream, { end: true });
  });
};
