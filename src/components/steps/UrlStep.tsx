import React from "react";
import type { Translation } from "../../types";

interface UrlStepProps {
  translation: Translation;
  onSubmit: (url: string) => void;
}

export const UrlStep: React.FC<UrlStepProps> = ({ translation, onSubmit }) => {
  return (
    <box style={{ flexDirection: "column", gap: 1 }}>
      <text fg="#D97757" style={{ attributes: 1 }}>{translation.prompt_url}</text>
      <box style={{ border: true, borderStyle: "rounded", borderColor: "#D97757", width: "100%", height: 3, paddingX: 1 }}>
        <input
          placeholder="https://www.youtube.com/watch?v=..."
          onSubmit={(value: string) => onSubmit(value)}
          focused={true}
        />
      </box>
    </box>
  );
};
