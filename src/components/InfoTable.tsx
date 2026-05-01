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
        borderStyle: "single",
        padding: 1,
        flexDirection: "column",
        gap: 0,
      }}
      title={translation.table_title}
    >
      <box style={{ flexDirection: "row" }}>
        <text style={{ width: 15, fg: "#888888" }}>{translation.table_uploader}: </text>
        <text style={{ fg: "#FFFFFF" }}>{info.uploader}</text>
      </box>
      <box style={{ flexDirection: "row" }}>
        <text style={{ width: 15, fg: "#888888" }}>{translation.table_duration}: </text>
        <text style={{ fg: "#FFFFFF" }}>{formatDuration(info.duration)}</text>
      </box>
      <box style={{ flexDirection: "row" }}>
        <text style={{ width: 15, fg: "#888888" }}>{translation.table_views}: </text>
        <text style={{ fg: "#FFFFFF" }}>{info.view_count.toLocaleString()}</text>
      </box>
      <box style={{ flexDirection: "row", marginTop: 1 }}>
        <text style={{ fg: "#D97757", attributes: 1 }}>{info.title}</text>
      </box>
    </box>
  );
};
