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
        borderStyle: "rounded",
        borderColor: "#D97757",
      }}
    >
      <text style={{ fg: "#D97757", attributes: 1 }}>
        {" Nixtub - Razael Labs "}
      </text>
      <text style={{ fg: "#AAAAAA", marginTop: 1 }}>
        {translation.description}
      </text>
      <box
        style={{
          flexDirection: "row",
          marginTop: 1,
          gap: 2,
        }}
      >
        <text style={{ fg: "#666666" }}>
          <span>Language: </span>
          <span style={{ fg: "#D97757" }}>{translation.lang_name}</span>
        </text>
        <text style={{ fg: "#666666" }}>
          <span>System: </span>
          <span style={{ fg: "#D97757" }}>{osType}</span>
        </text>
      </box>
    </box>
  );
};
