import React from "react";
import type { VideoInfo, Translation } from "../types";

interface InfoTableProps {
  info: VideoInfo;
  translation: Translation;
}

const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s]
    .map((v) => v.toString().padStart(2, "0"))
    .filter((v, i) => v !== "00" || i > 0)
    .join(":");
};

export const InfoTable: React.FC<InfoTableProps> = ({ info, translation }) => {
  return (
    <box
      style={{
        width: "100%",
        border: true,
        borderStyle: "round",
        borderColor: "#666666",
        padding: 1,
        flexDirection: "column",
        gap: 0,
      }}
    >
      <text style={{ fg: "#D97757", attributes: 1, marginBottom: 1 }}>
        {` ${info.title} `}
      </text>
      
      <box style={{ flexDirection: "row", border: { top: true }, borderColor: "#333333", paddingTop: 1 }}>
        <box style={{ width: "33%", flexDirection: "column", alignItems: "center" }}>
          <text fg="#888888" style={{ attributes: 2 }}>{translation.table_uploader.toUpperCase()}</text>
          <text fg="#FFFFFF">{info.uploader}</text>
        </box>
        <box style={{ width: "33%", flexDirection: "column", alignItems: "center", border: { left: true, right: true }, borderColor: "#333333" }}>
          <text fg="#888888" style={{ attributes: 2 }}>{translation.table_duration.toUpperCase()}</text>
          <text fg="#FFFFFF">{formatDuration(info.duration)}</text>
        </box>
        <box style={{ width: "33%", flexDirection: "column", alignItems: "center" }}>
          <text fg="#888888" style={{ attributes: 2 }}>{translation.table_views.toUpperCase()}</text>
          <text fg="#FFFFFF">{info.view_count.toLocaleString()}</text>
        </box>
      </box>
    </box>
  );
};
