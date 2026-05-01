import React from "react";
import type { Translation } from "../../types";

interface ResultStepProps {
  type: "success" | "error";
  message?: string;
  translation: Translation;
  onReset: () => void;
}

export const ResultStep: React.FC<ResultStepProps> = ({ type, message, translation, onReset }) => {
  const isSuccess = type === "success";
  const color = isSuccess ? "#00FF00" : "#FF0000";
  const title = isSuccess ? translation.success : "Error";

  return (
    <box style={{ 
      flexDirection: "column", 
      gap: 1, 
      alignItems: "center", 
      padding: 2, 
      border: true, 
      borderStyle: "double", 
      borderColor: color 
    }}>
      <text fg={color} style={{ attributes: 1 }}>{title}</text>
      {message && <text>{message}</text>}
      <text fg="#AAAAAA">Press Ctrl+C to exit</text>
      
      <box style={{ marginTop: 1, width: 30 }}>
        <select
          options={[{ 
            name: isSuccess ? "[ Download another ]" : "[ Try again ]", 
            description: "Return to URL input" 
          }]}
          onSelect={onReset}
          focused={true}
          height={3}
        />
      </box>
    </box>
  );
};
