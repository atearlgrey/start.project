import React from "react";
import { type Provider } from "../../types/Provider";

interface Props {
  provider: Provider;
  onChange: (value: Provider) => void;
}

/**
 * ProviderSelector — dropdown chọn loại provider: Compose / Swarm / K8S
 */
export const ProviderSelector: React.FC<Props> = ({ provider, onChange }) => {
  return (
    <div className="flex flex-wrap items-center gap-2 justify-center mb-6">
      <label className="font-medium">Provider:</label>
      <select
        value={provider}
        onChange={(e) => onChange(e.target.value as Provider)}
        className="border rounded px-3 py-2"
      >
        <option value="compose">Docker Compose</option>
        <option value="swarm">Docker Swarm</option>
        <option value="k8s">Kubernetes</option>
      </select>
    </div>
  );
};
