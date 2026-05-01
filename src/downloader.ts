import { join } from "path";
import { existsSync, writeFileSync, unlinkSync } from "fs";
import { homedir } from "os";
import type { VideoInfo, DownloadOptions } from "./types";

export class Downloader {
  public getOS(): string {
    const platform = process.platform;
    if (platform === "win32") return "Windows";
    if (platform === "darwin") return "Mac";
    if (platform === "linux") {
      if (process.env.ANDROID_ROOT || process.env.TERMUX_VERSION) {
        return "Android";
      }
      return "Linux";
    }
    return platform;
  }

  public getDownloadDir(osType: string): string {
    const home = homedir();
    if (osType === "Windows") {
      return join(home, "Desktop", "NixDownload");
    } else if (osType === "Android") {
      const storagePath = join(home, "storage");
      if (existsSync(storagePath)) {
        try {
          const testFile = "/sdcard/.nixtest";
          writeFileSync(testFile, "test");
          unlinkSync(testFile);
          return "/sdcard/NixDownload";
        } catch (e) {
          // Ignore
        }
        return join(storagePath, "downloads", "NixDownload");
      }
    }
    return join(home, "NixDownload");
  }

  public async extractInfo(url: string): Promise<VideoInfo> {
    const ytDlpPath = this.getOS() === "Android" ? "/data/data/com.termux/files/usr/bin/yt-dlp" : "yt-dlp";
    const proc = Bun.spawn([ytDlpPath, "--dump-json", url], {
      stdout: "pipe",
      stderr: "pipe",
    });

    const text = await new Response(proc.stdout).text();
    const exitCode = await proc.exited;

    if (exitCode !== 0) {
      const error = await new Response(proc.stderr).text();
      throw new Error(`Failed to extract info: ${error}`);
    }

    const data = JSON.parse(text);
    return {
      title: data.title,
      uploader: data.uploader,
      duration: data.duration,
      view_count: data.view_count,
      ext: data.ext,
    };
  }

  public async download(
    url: string,
    options: DownloadOptions,
    onProgress: (percent: number, status: string) => void
  ): Promise<void> {
    const args = [
      "--format",
      options.format,
      "--output",
      options.outputTemplate,
      "--newline",
      "--no-warnings",
      "--progress",
      url,
    ];

    if (options.format === "bestaudio/best") {
      args.push("--extract-audio", "--audio-format", "mp3", "--audio-quality", "192K");
    }

    const ytDlpPath = this.getOS() === "Android" ? "/data/data/com.termux/files/usr/bin/yt-dlp" : "yt-dlp";
    const proc = Bun.spawn([ytDlpPath, ...args], {
      stdout: "pipe",
      stderr: "pipe",
    });

    const reader = proc.stdout.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.includes("[download]")) {
          const match = line.match(/(\d+\.\d+)%/);
          if (match) {
            const percent = parseFloat(match[1]);
            onProgress(percent, "downloading");
          }
        } else if (line.includes("[ExtractAudio]")) {
          onProgress(100, "extracting");
        }
      }
    }

    const exitCode = await proc.exited;
    if (exitCode !== 0) {
      const error = await new Response(proc.stderr).text();
      throw new Error(`Download failed: ${error}`);
    }
  }
}
