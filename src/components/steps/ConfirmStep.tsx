import React from "react";
import { InfoTable } from "../InfoTable";
import type { Translation, VideoInfo } from "../../types";

interface ConfirmStepProps {
  videoInfo: VideoInfo;
  translation: Translation;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmStep: React.FC<ConfirmStepProps> = ({ videoInfo, translation, onConfirm, onCancel }) => {
  return (
    <box style={{ flexDirection: "column", gap: 1 }}>
      <InfoTable info={videoInfo} translation={translation} />
      <box style={{ padding: 1, border: true, borderStyle: "double", borderColor: "#FFFF00", flexDirection: "column", gap: 1 }}>
        <text fg="#FFFF00" style={{ attributes: 1 }}>{translation.confirm_download}</text>
        <select
          options={[
            { name: "Yes", description: "Start the download", value: "yes" },
            { name: "No", description: "Go back to format selection", value: "no" }
          ]}
          onSelect={(_index, option) => {
            if (option && option.value === "yes") {
              onConfirm();
            } else {
              onCancel();
            }
          }}
          focused={true}
          height={5}
        />
      </box>
    </box>
  );
};
