import React from "react";

interface OutputViewerProps {
  output: string;
  onDownload: () => void;
  provider: string;
}

export const OutputViewer: React.FC<OutputViewerProps> = ({
  output,
  onDownload,
  provider,
}) => {
  return (
    <div className="mt-6">
      <div className="flex justify-between mb-2">
        <h2 className="font-semibold text-lg">📄 Output YAML</h2>
        <button
          onClick={onDownload}
          disabled={!output}
          className={`${
            output
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-300 cursor-not-allowed"
          } text-white px-4 py-1 rounded text-sm`}
        >
          {provider === "compose" && "Download docker-compose.yml"}
          {provider === "swarm" && "Download stack.yml"}
          {provider === "k8s" && "Download deployment.yaml"}
        </button>
      </div>

      <textarea
        readOnly
        className="w-full h-72 border p-2 rounded font-mono text-sm bg-gray-50"
        value={output}
      />
    </div>
  );
};
