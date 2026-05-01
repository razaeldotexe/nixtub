import React from "react";
import { useKeyboard, useRenderer } from "@opentui/react";
import { Banner } from "./components/Banner";
import { useDownloaderState } from "./hooks/useDownloaderState";

// Steps
import { UrlStep } from "./components/steps/UrlStep";
import { FormatStep } from "./components/steps/FormatStep";
import { ConfirmStep } from "./components/steps/ConfirmStep";
import { DownloadProgressStep } from "./components/steps/DownloadProgressStep";
import { ResultStep } from "./components/steps/ResultStep";

export const App: React.FC = () => {
  const renderer = useRenderer();
  const {
    step,
    setStep,
    videoInfo,
    progress,
    status,
    errorMsg,
    osType,
    translation,
    handleUrlSubmit,
    handleFormatSelect,
    handleStartDownload,
    reset,
  } = useDownloaderState();

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

  return (
    <box style={{ padding: 1, flexDirection: "column", gap: 1, width: "100%", height: "100%" }}>
      <Banner translation={translation} osType={osType} />

      {step === "url" && (
        <UrlStep translation={translation} onSubmit={handleUrlSubmit} />
      )}

      {step === "loading_info" && (
        <box style={{ alignItems: "center", padding: 2, border: true, borderStyle: "round", borderColor: "#FFFF00" }}>
          <text fg="#FFFF00" style={{ attributes: 1 }}>{translation.analyzing}...</text>
        </box>
      )}

      {step === "format" && videoInfo && (
        <FormatStep 
          videoInfo={videoInfo} 
          translation={translation} 
          onSelect={handleFormatSelect} 
        />
      )}

      {step === "confirm" && videoInfo && (
        <ConfirmStep 
          videoInfo={videoInfo} 
          translation={translation} 
          onConfirm={handleStartDownload} 
          onCancel={() => setStep("format")} 
        />
      )}

      {step === "downloading" && (
        <DownloadProgressStep 
          status={status} 
          progress={progress} 
          translation={translation} 
        />
      )}

      {step === "success" && (
        <ResultStep type="success" translation={translation} onReset={reset} />
      )}

      {step === "error" && (
        <ResultStep type="error" message={errorMsg} translation={translation} onReset={reset} />
      )}
    </box>
  );
};
