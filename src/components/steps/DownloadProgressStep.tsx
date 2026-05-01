import React from "react";
import type { Translation } from "../../types";

interface DownloadProgressStepProps {
  status: string;
  progress: number;
  translation: Translation;
}

export const DownloadProgressStep: React.FC<DownloadProgressStepProps> = ({ status, progress, translation }) => {
  const barWidth = 40;
  const filledWidth = Math.floor((progress / 100) * barWidth);
  const emptyWidth = barWidth - filledWidth;

  return (
    <box style={{ flexDirection: "column", gap: 1, padding: 1, border: true, borderStyle: "rounded", borderColor: "#D97757" }}>
      <text fg="#D97757" style={{ attributes: 1 }}>{status}</text>
      
      <box style={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
        <box style={{ width: barWidth + 2, height: 3, border: true, borderStyle: "single", borderColor: "#333333", paddingX: 1 }}>
          <box style={{ flexDirection: "row", width: barWidth, height: 1 }}>
            <box style={{ width: filledWidth, height: 1, backgroundColor: "#D97757" }} />
            <box style={{ width: emptyWidth, height: 1, backgroundColor: "#333333" }} />
          </box>
        </box>
        <text fg="#D97757" style={{ attributes: 1 }}>{progress.toFixed(1)}%</text>
      </box>

      <text fg="#AAAAAA" style={{ attributes: 2 }}>{translation.processing}...</text>
    </box>
  );
};
