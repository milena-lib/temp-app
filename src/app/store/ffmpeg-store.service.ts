import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

@Injectable({
  providedIn: 'root'
})
export class FfmpegStoreService {

  private ffmpeg = createFFmpeg({ log: true });
  private isLoaded = false;

  constructor() { }

  async loadFFmpeg() {
    if (!this.isLoaded) {
      await this.ffmpeg.load();
      this.isLoaded = true;
    }
  }

  async compressVideo(file: File): Promise<Blob> {
    debugger;
    await this.loadFFmpeg();

    const fileName = file.name;
    const outputFileName = 'output.mp4';

    // Write the file to the filesystem
    this.ffmpeg.FS('writeFile', fileName, await fetchFile(file));

    // Run the FFmpeg command to compress the video
    await this.ffmpeg.run('-i', fileName, '-vcodec', 'libx264', '-crf', '28', outputFileName);

    // Read the compressed file from the filesystem
    const data = this.ffmpeg.FS('readFile', outputFileName);

    // Create a Blob from the data
    const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });

    return videoBlob;
  }
}
