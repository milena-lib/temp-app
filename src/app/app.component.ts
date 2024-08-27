import { Component } from '@angular/core';
import { FfmpegStoreService } from './store/ffmpeg-store.service';
// import {crossOriginIsolation} from 'vite-plugin-cross-origin-isolation';
// import { defineConfig } from "vite";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'temp-app';

  isCompressed = false;

  readonly loadingPercent$ = this.ffmpegService.loadingPercent$;

  constructor(private ffmpegService: FfmpegStoreService) {
    
  }

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const compressedVideo = await this.ffmpegService.compressVideo(file);

      this.isCompressed = compressedVideo ? true : false;
      this.downloadCompressedVideo(compressedVideo);
    }
  }

  downloadCompressedVideo(blob: Blob) {
    console.log("blob: ", blob);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    console.log("downloadCompressedVideo url: ", url);
    a.download = 'compressed-video.mp4';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}