import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useKeyboard, useRenderer } from "@opentui/react";
import { I18nService } from "./i18n";
import { Downloader } from "./downloader";
import { Banner } from "./components/Banner";
import { InfoTable } from "./components/InfoTable";
import type { Translation, VideoInfo } from "./types";
import { join } from "path";

type Step = "url" | "loading_info" | "format" | "confirm" | "downloading" | "success" | "error";

export const App: React.FC = () => {
  const renderer = useRenderer();
  const downloader = useMemo(() => new Downloader(), []);
  const i18n = useMemo(() => new I18nService(), []);

  const [step, setStep] = useState<Step>("url");
  const [url, setUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [format, setFormat] = useState("best");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const osType = useMemo(() => downloader.getOS(), [downloader]);
  const langCode = useMemo(() => i18n.detectLanguage(process.argv), [i18n]);
  const translation = useMemo(() => i18n.getTranslation(langCode), [i18n, langCode]);

  useKeyboard((key) => {
    if (key.ctrl && key.name === "c") {
      renderer.destroy();
      process.exit(0);
    }

    if (step === "confirm") {
      if (key.name === "y") {
        handleStartDownload();
      } else if (key.name === "n") {
        setStep("format");
      }
    }
  });

  const handleUrlSubmit = useCallback(async (value: string) => {
    if (!value) return;
    setUrl(value);
    setStep("loading_info");
    try {
      const info = await downloader.extractInfo(value);
      setVideoInfo(info);
      setStep("format");
    } catch (e: any) {
      setErrorMsg(e.message || translation.error_fail_info);
      setStep("error");
    }
  }, [downloader, translation]);

  const handleFormatSelect = useCallback((index: number, option: any) => {
    setFormat(option.value);
    setStep("confirm");
  }, []);

  const handleStartDownload = useCallback(async () => {
    if (!videoInfo || !url) return;
    setStep("downloading");
    setProgress(0);
    setStatus(translation.status_downloading);

    const downloadDir = downloader.getDownloadDir(osType);
    const outputTemplate = join(downloadDir, "%(title)s.%(ext)s");

    try {
      await downloader.download(
        url,
        { format, outputTemplate },
        (percent, currentStatus) => {
          setProgress(percent);
          if (currentStatus === "extracting") {
            setStatus(translation.status_finishing);
          }
        }
      );
      setStep("success");
    } catch (e: any) {
      setErrorMsg(e.message || "Download failed");
      setStep("error");
    }
  }, [url, videoInfo, format, downloader, osType, translation]);

  const formatOptions = [
    { name: "Best Quality", description: "Highest available quality", value: "best" },
    { name: "MP4 Video", description: "Standard MP4 format", value: "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" },
    { name: "MP3 Audio", description: "Extract audio as MP3", value: "bestaudio/best" },
    { name: "Manual Selection", description: "Let yt-dlp decide", value: "b" },
  ];

  return (
    <box style={{ padding: 1, flexDirection: "column", gap: 1, width: "100%", height: "100%" }}>
      <Banner translation={translation} osType={osType} />

      {step === "url" && (
        <box style={{ flexDirection: "column", gap: 1 }}>
          <text fg="#D97757">{translation.prompt_url}</text>
          <box style={{ border: true, borderStyle: "single", width: "100%", height: 3 }}>
            <input
              placeholder="https://www.youtube.com/watch?v=..."
              onSubmit={handleUrlSubmit}
              focused={true}
            />
          </box>
        </box>
      )}

      {step === "loading_info" && (
        <box style={{ alignItems: "center", padding: 2 }}>
          <text fg="#FFFF00">{translation.analyzing}</text>
        </box>
      )}

      {step === "format" && videoInfo && (
        <box style={{ flexDirection: "column", gap: 1 }}>
          <InfoTable info={videoInfo} translation={translation} />
          <text fg="#D97757">{translation.prompt_format}</text>
          <select
            options={formatOptions}
            onSelect={handleFormatSelect}
            focused={true}
            height={10}
          />
        </box>
      )}

      {step === "confirm" && videoInfo && (
        <box style={{ flexDirection: "column", gap: 1 }}>
          <InfoTable info={videoInfo} translation={translation} />
          <box style={{ padding: 1, border: true, borderColor: "#FFFF00" }}>
            <text>
              <span style={{ fg: "#FFFF00", attributes: 1 }}>{translation.confirm_download}</span>
              <span> (Y/n)</span>
            </text>
          </box>
        </box>
      )}

      {step === "downloading" && (
        <box style={{ flexDirection: "column", gap: 1 }}>
          <text fg="#D97757">{status}</text>
          <box style={{ width: "100%", height: 1, backgroundColor: "#333333" }}>
            <box
              style={{
                width: `${progress}%`,
                height: 1,
                backgroundColor: "#D97757",
              }}
            />
          </box>
          <text style={{ textAlign: "right" }}>{progress.toFixed(1)}%</text>
        </box>
      )}

      {step === "success" && (
        <box style={{ flexDirection: "column", gap: 1, alignItems: "center", padding: 2 }}>
          <text fg="#00FF00" style={{ attributes: 1 }}>{translation.success}</text>
          <text fg="#AAAAAA">Press Ctrl+C to exit</text>
          <box style={{ marginTop: 1 }}>
             <text fg="#D97757" onClick={() => setStep("url")}>[ Download another ]</text>
          </box>
        </box>
      )}

      {step === "error" && (
        <box style={{ flexDirection: "column", gap: 1, padding: 1, border: true, borderColor: "#FF0000" }}>
          <text fg="#FF0000" style={{ attributes: 1 }}>Error</text>
          <text>{errorMsg}</text>
          <text fg="#D97757" onClick={() => setStep("url")} style={{ marginTop: 1 }}>[ Try again ]</text>
        </box>
      )}
    </box>
  );
};
