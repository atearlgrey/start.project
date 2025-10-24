import React, { useState } from "react";
import { ServiceCard } from "../common/ServiceCard";
import { GlobalConfig } from "../common/GlobalConfig";
import { NetworkEditor } from "../common/NetworkEditor";
import { VolumeEditor } from "../common/VolumeEditor";
import { OutputViewer } from "../common/OutputViewer";
import { generateYAML } from "../../utils/generateYAML";
import { mergeGlobalConfig } from "../../utils/mergeGlobalConfig";
import { DeployEditor } from "./DeployEditor";
import { type Service } from "../../types/Service";

interface Props {
  services: Service[];
}

export const SwarmLayout: React.FC<Props> = ({ services }) => {
  const [version] = useState("3.8");
  const [selected, setSelected] = useState<string[]>([]);
  const [serviceValues, setServiceValues] = useState<Record<string, Record<string, any>>>({});
  const [networks, setNetworks] = useState<string[]>(["swarm-net"]);
  const [volumes, setVolumes] = useState<string[]>(["swarm-data"]);
  const [deploy, setDeploy] = useState({ replicas: 1, restartPolicy: "on-failure" });
  const [global, setGlobal] = useState({
    baseImage: "",
    sharedNetwork: "",
    volumeDriver: "local",
  });
  const [output, setOutput] = useState("");

  const toggleService = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleServiceChange = (id: string, key: string, value: any) => {
    setServiceValues((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [key]: value },
    }));
  };

  const handleDownload = () => {
    if (!output) return alert("Generate before download");
    const blob = new Blob([output], { type: "text/yaml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "deployment.yaml";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleGenerate = () => {
    const yamlServices: Record<string, any> = {};

    selected.forEach((id) => {
      const svc = services.find((s) => s.container_name === id);
      if (!svc) return;

      yamlServices[id] = { ...svc, ...serviceValues[id] };

      if (Array.isArray(svc.env)) {
        const envObj: Record<string, string> = {};
        svc.env.forEach((e) => {
          const v = serviceValues[id]?.[e.key] ?? e.default ?? "";
          if (v) envObj[e.key] = v;
        });
        yamlServices[id].environment = envObj;
        delete yamlServices[id].env;
      }

      yamlServices[id].deploy = {
        replicas: deploy.replicas,
        restart_policy: { condition: deploy.restartPolicy },
      };
    });

    const merged = mergeGlobalConfig(yamlServices, global);

    const composeNetworks = networks.reduce((acc, net) => {
      acc[net] = { driver: "overlay" };
      return acc;
    }, {} as Record<string, any>);

    const composeVolumes = volumes.reduce((acc, vol) => {
      acc[vol] = { driver: global.volumeDriver || "local" };
      return acc;
    }, {} as Record<string, any>);

    const yaml = generateYAML(version, merged, composeNetworks, composeVolumes);
    setOutput(yaml);
  };

  return (
    <div>
      <DeployEditor deploy={deploy} onChange={setDeploy} />

      <GlobalConfig
        baseImage={global.baseImage}
        sharedNetwork={global.sharedNetwork}
        volumeDriver={global.volumeDriver}
        onChange={(k, v) => setGlobal((g) => ({ ...g, [k]: v }))}
      />

      <NetworkEditor networks={networks} onChange={setNetworks} />
      <VolumeEditor volumes={volumes} onChange={setVolumes} />

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        {services.map((s) => (
          <ServiceCard
            key={s.container_name}
            service={s}
            selected={selected.includes(s.container_name)}
            onToggle={toggleService}
            onChange={handleServiceChange}
            values={serviceValues[s.container_name] || {}}
          />
        ))}
      </div>

      <div className="text-center mt-8">
        <button
          onClick={handleGenerate}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Generate stack.yml
        </button>
      </div>

      <OutputViewer output={output} onDownload={handleDownload} provider="swarm" />
    </div>
  );
};
