import React from "react";
import { InfoTable } from "../InfoTable";
import type { Translation, VideoInfo } from "../../types";

interface FormatStepProps {
  videoInfo: VideoInfo;
  translation: Translation;
  onSelect: (option: { value: string }) => void;
}

export const FormatStep: React.FC<FormatStepProps> = ({ videoInfo, translation, onSelect }) => {
  const formatOptions = [
    { name: "Best Quality", description: "Highest available quality", value: "best" },
    { name: "MP4 Video", description: "Standard MP4 format", value: "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" },
    { name: "MP3 Audio", description: "Extract audio as MP3", value: "bestaudio/best" },
    { name: "Manual Selection", description: "Let yt-dlp decide", value: "b" },
  ];

  return (
    <box style={{ flexDirection: "column", gap: 1 }}>
      <InfoTable info={videoInfo} translation={translation} />
      <text fg="#D97757" style={{ attributes: 1 }}>{translation.prompt_format}</text>
      <box style={{ border: true, borderStyle: "rounded", borderColor: "#D97757", padding: 1 }}>
        <select
          options={formatOptions}
          onSelect={(_index, option) => onSelect(option as any)}
          focused={true}
          height={10}
        />
      </box>
    </box>
  );
};
