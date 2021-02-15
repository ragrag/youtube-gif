import Container, { Service } from 'typedi';
import JobsService from './jobs.service';
import ytdl from 'ytdl-core';
import { Readable } from 'stream';
import { Job } from '../entities/jobs.entity';
import { createFFmpeg, fetchFile, FFmpeg } from '@ffmpeg/ffmpeg';
import fs from 'fs';
import cliProgress from 'cli-progress';
import CloudStorageService from './cloudStorage.service';
import GifConversion from '../common/interfaces/GifConversion';
import YoutubeDownload from '../common/interfaces/YoutubeDownload';

const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

@Service()
export default class ConversionService {
  private ffmpeg: FFmpeg = null;

  constructor(private jobService = new JobsService()) {}

  public async initializeService() {
    try {
      this.ffmpeg = createFFmpeg({
        log: false,
        progress: p => {
          progressBar.update(Math.floor(p.ratio * 100));
        },
      });
      await this.ffmpeg.load();
    } catch (err) {
      console.error(err);
    }
  }

  private async downloadVideo({ youtubeId, youtubeUrl }: YoutubeDownload): Promise<{ video: Readable; formatExtension: string }> {
    try {
      const info = await ytdl.getInfo(youtubeId);
      if (Number(info?.videoDetails?.lengthSeconds) > 480) throw Error('Youtube Video Too Long');
      const format: ytdl.videoFormat = info.formats[0];
      if (!format) throw new Error('No matching format found');
      const video = ytdl(youtubeUrl, {
        format,
      });
      return { video, formatExtension: format.container };
    } catch (err) {
      throw err;
    }
  }

  private async convertToGIF({ startTime, endTime, srcFileName, destFileName, formatExtension }: GifConversion) {
    try {
      console.info('Converting Video to GIF');
      this.ffmpeg.FS('writeFile', `temp.${formatExtension}`, await fetchFile(srcFileName));
      progressBar.start(100, 0);
      await this.ffmpeg.run(
        '-i',
        `temp.${formatExtension}`,
        '-vcodec',
        'gif',
        '-ss',
        `${startTime}`,
        '-t',
        `${endTime - startTime}`,
        '-vf',
        'fps=10',
        `temp.gif`,
      );
      progressBar.stop();
      await fs.promises.writeFile(destFileName, this.ffmpeg.FS('readFile', 'temp.gif'));
      console.info('Converted video to gif');
    } catch (err) {
      throw err;
    }
  }

  private async uploadGifToCloudStorage(destFileName, uploadName): Promise<string> {
    try {
      console.info('Uploading gif to cloud storage');
      const gifImage = await fs.promises.readFile(destFileName);
      const cloudStorageInstance = Container.get(CloudStorageService);
      const gifUrl = await cloudStorageInstance.uploadGif(gifImage, `gifs/${uploadName}`);
      return gifUrl;
    } catch (err) {
      throw err;
    }
  }

  public async beginConversion(job: Job, { onSuccess, onError }: { onSuccess: () => void; onError: () => void }) {
    try {
      await this.jobService.updateJobById(job.id as any, { status: 'processing' });
      console.info('Started Processing Job :', job.id);

      const { video, formatExtension } = await this.downloadVideo({
        youtubeId: job.youtubeId,
        youtubeUrl: job.youtubeUrl,
      });

      const srcFileName = `./src/media/temp.${formatExtension}`;
      const destFileName = `./src/media/temp.gif`;

      video.on('progress', (chunkLength, downloaded, total) => {
        let percent: any = downloaded / total;
        percent = percent * 100;
        progressBar.update(percent);
      });

      video.pipe(
        fs
          .createWriteStream(srcFileName)
          .on('open', () => {
            console.log('Downloading Video');
            progressBar.start(100, 0);
          })
          .on('finish', async () => {
            progressBar.stop();
            console.info('Downloaded video for job ', job.id);

            await this.convertToGIF({
              startTime: job.startTime,
              endTime: job.endTime,
              srcFileName,
              destFileName,
              formatExtension,
            });

            const gifUrl = await this.uploadGifToCloudStorage(destFileName, job.id);

            await this.jobService.updateJobById(job.id as any, { status: 'done', gifUrl });
            console.info(`Finished job ${job.id}, gif at ${gifUrl}`);
            onSuccess();
          })
          .on('error', async () => {
            progressBar.stop();
            console.error('Failed to process job', job.id);
            await this.jobService.updateJobById(job.id as any, { status: 'error' });
            onError();
          }),
      );
    } catch (err) {
      await this.jobService.updateJobById(job.id as any, { status: 'error' });
      onError();
      throw err;
    }
  }
}
