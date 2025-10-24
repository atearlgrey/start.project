import React from "react";
import { TextAreaInput } from "./TextAreaInput";

interface VolumeEditorProps {
  volumes: string[];
  onChange: (volumes: string[]) => void;
}

/**
 * Global volume configuration editor.
 * Used for docker-compose or K8S (PVC templates).
 */
export const VolumeEditor: React.FC<VolumeEditorProps> = ({
  volumes,
  onChange,
}) => {
  return (
    <div className="border p-4 rounded bg-white shadow mb-4">
      <h2 className="font-semibold text-lg mb-2">💾 Volumes</h2>
      <TextAreaInput
        label="Volume Definitions"
        value={volumes}
        placeholder="./data:/var/lib/mysql\n./logs:/app/logs"
        onChange={onChange}
      />
    </div>
  );
};
