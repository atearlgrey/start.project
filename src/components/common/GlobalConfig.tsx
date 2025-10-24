import React from "react";

interface GlobalConfigProps {
  baseImage: string;
  sharedNetwork: string;
  volumeDriver: string;
  onChange: (key: string, value: string) => void;
}

export const GlobalConfig: React.FC<GlobalConfigProps> = ({
  baseImage,
  sharedNetwork,
  volumeDriver,
  onChange,
}) => {
  return (
    <div className="border p-4 rounded bg-white shadow mb-6">
      <h2 className="font-semibold text-lg mb-3">🌍 Global Configuration</h2>

      <div className="space-y-2">
        <div>
          <label className="text-sm font-medium">Base Image Prefix</label>
          <input
            type="text"
            className="border p-1 w-full rounded text-sm"
            value={baseImage}
            onChange={(e) => onChange("baseImage", e.target.value)}
            placeholder="e.g. registry.gitlab.com/project/"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Shared Network Name</label>
          <input
            type="text"
            className="border p-1 w-full rounded text-sm"
            value={sharedNetwork}
            onChange={(e) => onChange("sharedNetwork", e.target.value)}
            placeholder="e.g. app-net"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Default Volume Driver</label>
          <input
            type="text"
            className="border p-1 w-full rounded text-sm"
            value={volumeDriver}
            onChange={(e) => onChange("volumeDriver", e.target.value)}
            placeholder="e.g. local"
          />
        </div>
      </div>
    </div>
  );
};
