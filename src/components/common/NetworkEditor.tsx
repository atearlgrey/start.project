import React from "react";
import { TextAreaInput } from "./TextAreaInput";

interface NetworkEditorProps {
  networks: string[];
  onChange: (networks: string[]) => void;
}

/**
 * Global network configuration editor.
 * Used for docker-compose (networks) and k8s (namespaces).
 */
export const NetworkEditor: React.FC<NetworkEditorProps> = ({
  networks,
  onChange,
}) => {
  return (
    <div className="border p-4 rounded bg-white shadow mb-4">
      <h2 className="font-semibold text-lg mb-2">🌐 Networks</h2>
      <TextAreaInput
        label="Network Names"
        value={networks}
        placeholder="e.g. app-net\nbackend-net"
        onChange={onChange}
      />
    </div>
  );
};
