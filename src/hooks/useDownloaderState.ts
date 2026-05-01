import { useState, useCallback, useMemo } from "react";
import { Downloader } from "../downloader";
import { I18nService } from "../i18n";
import type { Translation, VideoInfo } from "../types";
import { join } from "path";

export type Step = "url" | "loading_info" | "format" | "confirm" | "downloading" | "success" | "error";

export const useDownloaderState = () => {
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

  const handleFormatSelect = useCallback((option: { value: string }) => {
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

  const reset = useCallback(() => {
    setStep("url");
    setUrl("");
    setVideoInfo(null);
    setProgress(0);
    setErrorMsg("");
  }, []);

  return {
    step,
    setStep,
    url,
    videoInfo,
    format,
    progress,
    status,
    errorMsg,
    osType,
    translation,
    handleUrlSubmit,
    handleFormatSelect,
    handleStartDownload,
    reset,
  };
};
