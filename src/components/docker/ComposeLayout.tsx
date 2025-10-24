import React, { useState } from "react";
import { ServiceCard } from "../common/ServiceCard";
import { GlobalConfig } from "../common/GlobalConfig";
import { NetworkEditor } from "../common/NetworkEditor";
import { VolumeEditor } from "../common/VolumeEditor";
import { OutputViewer } from "../common/OutputViewer";
import { generateYAML } from "../../utils/generateYAML";
import { mergeGlobalConfig } from "../../utils/mergeGlobalConfig";
import { type Service } from "../../types/Service";

interface Props {
  services: Service[];
}

export const ComposeLayout: React.FC<Props> = ({ services }) => {
  const [version, setVersion] = useState("3.8");
  const [selected, setSelected] = useState<string[]>([]);
  const [serviceValues, setServiceValues] = useState<
    Record<string, Record<string, any>>
  >({});
  const [networks, setNetworks] = useState<string[]>(["app-net"]);
  const [volumes, setVolumes] = useState<string[]>(["data-volume"]);
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

  const handleGenerate = () => {
    const yamlServices: Record<string, any> = {};

    selected.forEach((id) => {
      const svc = services.find((s) => s.container_name === id);
      if (!svc) return;

      yamlServices[id] = { ...svc, ...serviceValues[id] };

      // convert env[] → environment {}
      if (Array.isArray(svc.env)) {
        const envObj: Record<string, string> = {};
        svc.env.forEach((e) => {
          const v = serviceValues[id]?.[e.key] ?? e.default ?? "";
          if (v) envObj[e.key] = v;
        });
        yamlServices[id].environment = envObj;
        delete yamlServices[id].env;
      }
    });

    const merged = mergeGlobalConfig(yamlServices, global);

    const composeNetworks = networks.reduce((acc, net) => {
      acc[net] = { driver: "bridge" };
      return acc;
    }, {} as Record<string, any>);

    const composeVolumes = volumes.reduce((acc, vol) => {
      acc[vol] = { driver: global.volumeDriver || "local" };
      return acc;
    }, {} as Record<string, any>);

    const yaml = generateYAML(version, merged, composeNetworks, composeVolumes);
    setOutput(yaml);
  };

  const handleDownload = () => {
    if (!output) return alert("Generate before download");
    const blob = new Blob([output], { type: "text/yaml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "docker-compose.yaml";
    a.click();
    URL.revokeObjectURL(a.href);
  };
  
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <label className="font-medium">Compose version:</label>
        <select
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="3.8">3.8</option>
          <option value="3.9">3.9</option>
          <option value="3.10">3.10</option>
        </select>
      </div>

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
          Generate docker-compose.yml
        </button>
      </div>

      <OutputViewer
        output={output}
        onDownload={handleDownload}
        provider="docker"
      />
    </div>
  );
};
