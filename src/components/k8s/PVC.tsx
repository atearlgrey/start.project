import React from "react";
import { TextAreaInput } from "../common/TextAreaInput";

interface PVCEditorProps {
  pvcs: string[];
  onChange: (pvcs: string[]) => void;
}

/**
 * PVC (Persistent Volume Claim) editor for Kubernetes
 */
export const PVCEditor: React.FC<PVCEditorProps> = ({ pvcs, onChange }) => {
  return (
    <div className="border p-4 rounded bg-white shadow mb-4">
      <h2 className="font-semibold text-lg mb-2">💾 Persistent Volume Claims</h2>
      <TextAreaInput
        label="PVC Definitions"
        value={pvcs}
        placeholder="app-data:\n  storageClassName: standard\n  accessModes: [ReadWriteOnce]\n  resources:\n    requests:\n      storage: 1Gi"
        onChange={onChange}
        rows={5}
      />
    </div>
  );
};
