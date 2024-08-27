import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FfmpegStoreService {
  private readonly loadingPercentSubject$ = new BehaviorSubject<number | null>(0);
  readonly loadingPercent$ = this.loadingPercentSubject$.asObservable();

  private ffmpeg = createFFmpeg({ log: true });

  private isLoaded = false;

  constructor() { }

  async loadFFmpeg() {
    if (!this.isLoaded) {
      this.ffmpeg.setProgress(({ ratio }) => {
        console.log(`Percentage: ${Math.round(ratio * 100)}%`);
        const percent = Math.round(ratio * 100);
        this.loadingPercentSubject$.next(percent);
      });
      await this.ffmpeg.load();
      this.isLoaded = true;
    }
  }

  async compressVideo(file: File): Promise<Blob> {
    // debugger;
    await this.loadFFmpeg();

    const fileName = file.name;
    const outputFileName = 'output.mp4';

    // Write the file to the filesystem
    this.ffmpeg.FS('writeFile', fileName, await fetchFile(file));

    // Run the FFmpeg command to compress the video
    await this.ffmpeg.run('-i', fileName, '-vcodec', 'libx264', '-crf', '28', outputFileName);
    // this.ffmpeg.setProgress()
    // Read the compressed file from the filesystem
    const data = this.ffmpeg.FS('readFile', outputFileName);

    // Create a Blob from the data
    const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });

    return videoBlob;
  }
}
