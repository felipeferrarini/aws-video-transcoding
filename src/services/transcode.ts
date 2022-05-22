import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import { S3 } from "aws-sdk";
import ffmpeg from "fluent-ffmpeg";
import { File, Resolution } from "../common/types";
import { uploadFromStream } from "../common/utils";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export const transcode = async (
  { bucket, name }: File,
  resolution: Resolution
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    const s3 = new S3({ apiVersion: "2006-03-01" });

    const originStream = s3
      .getObject({
        Bucket: bucket,
        Key: name,
      })
      .createReadStream();

    const destinationFile = name.replace(".mp4", `_${resolution.suffix}.mp4`);

    const destinationStreamParams = {
      Bucket: process.env.S3_BUCKET_DESTINATION || "",
      Key: destinationFile,
      Metadata: {
        contentType: "video/mp4",
      },
      ContentType: "video/mp4",
    };

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
      .pipe(uploadFromStream(s3, destinationStreamParams), { end: true });
  });
};
