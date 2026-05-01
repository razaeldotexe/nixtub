import React from "react";
import type { Translation } from "../types";

interface BannerProps {
  translation: Translation;
  osType: string;
}

export const Banner: React.FC<BannerProps> = ({ translation, osType }) => {
  return (
    <box
      style={{
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        padding: 1,
        border: true,
        borderStyle: "double",
        borderColor: "#D97757",
      }}
    >
      <box style={{ flexDirection: "row", gap: 1 }}>
        <text style={{ fg: "#D97757", attributes: 1 }}>
          {"◆"}
        </text>
        <text style={{ fg: "#D97757", attributes: 1 }}>
          {" NIXTUB CLI "}
        </text>
        <text style={{ fg: "#D97757", attributes: 1 }}>
          {"◆"}
        </text>
      </box>
      
      <text style={{ fg: "#AAAAAA", marginTop: 1, attributes: 2 }}>
        {translation.description}
      </text>

      <box
        style={{
          flexDirection: "row",
          marginTop: 1,
          gap: 3,
          padding: { left: 2, right: 2 },
          border: true,
          borderStyle: "single",
          borderColor: "#333333"
        }}
      >
        <box style={{ flexDirection: "row", gap: 1 }}>
          <text fg="#666666">LOCALE:</text>
          <text fg="#D97757" style={{ attributes: 1 }}>{translation.lang_name.toUpperCase()}</text>
        </box>
        <box style={{ flexDirection: "row", gap: 1 }}>
          <text fg="#666666">PLATFORM:</text>
          <text fg="#D97757" style={{ attributes: 1 }}>{osType.toUpperCase()}</text>
        </box>
        <box style={{ flexDirection: "row", gap: 1 }}>
          <text fg="#666666">ENGINE:</text>
          <text fg="#D97757" style={{ attributes: 1 }}>YT-DLP</text>
        </box>
      </box>
    </box>
  );
};
