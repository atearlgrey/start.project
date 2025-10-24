import React from "react";

interface DeployConfig {
  replicas: number;
  restartPolicy: string;
}

interface DeployEditorProps {
  deploy: DeployConfig;
  onChange: (newConfig: DeployConfig) => void;
}

/**
 * Swarm deploy config editor (replicas, restart_policy)
 */
export const DeployEditor: React.FC<DeployEditorProps> = ({ deploy, onChange }) => {
  return (
    <div className="border p-4 rounded bg-white shadow mb-4">
      <h2 className="font-semibold text-lg mb-2">⚙️ Deploy Settings</h2>

      <div className="space-y-2">
        <div>
          <label className="text-sm font-medium">Replicas</label>
          <input
            type="number"
            min={1}
            value={deploy.replicas}
            onChange={(e) => onChange({ ...deploy, replicas: Number(e.target.value) })}
            className="border p-1 rounded text-sm w-full"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Restart Policy</label>
          <select
            value={deploy.restartPolicy}
            onChange={(e) => onChange({ ...deploy, restartPolicy: e.target.value })}
            className="border p-1 rounded text-sm w-full"
          >
            <option value="any">any</option>
            <option value="on-failure">on-failure</option>
            <option value="none">none</option>
          </select>
        </div>
      </div>
    </div>
  );
};
