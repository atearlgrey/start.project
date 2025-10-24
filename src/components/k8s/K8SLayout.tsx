import React, { useState } from "react";
import { ServiceCard } from "../common/ServiceCard";
import { GlobalConfig } from "../common/GlobalConfig";
import { NetworkEditor } from "../common/NetworkEditor";
import { VolumeEditor } from "../common/VolumeEditor";
import { OutputViewer } from "../common/OutputViewer";
import { PVCEditor } from "./PVC";
import { generateK8SYAML } from "../../utils/generateK8SYAML";
import { mergeGlobalConfig } from "../../utils/mergeGlobalConfig";
import { type Service } from "../../types/Service";

interface Props {
  services: Service[];
}

export const K8SLayout: React.FC<Props> = ({ services }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [serviceValues, setServiceValues] = useState<
    Record<string, Record<string, any>>
  >({});
  const [networks, setNetworks] = useState<string[]>(["default"]);
  const [volumes, setVolumes] = useState<string[]>(["data"]);
  const [pvcs, setPvcs] = useState<string[]>(["app-pvc"]);
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
      const svc = services.find((s) => s.id === id);
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
    });

    const merged = mergeGlobalConfig(yamlServices, global);
    const yaml = generateK8SYAML(merged);

    const pvcYaml = pvcs
      .map(
        (name) => `---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: ${name}
spec:
  accessModes: ["ReadWriteOnce"]
  resources:
    requests:
      storage: 1Gi`
      )
      .join("\n");

    setOutput(`${yaml}\n${pvcYaml}`);
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

  return (
    <div>
      <GlobalConfig
        baseImage={global.baseImage}
        sharedNetwork={global.sharedNetwork}
        volumeDriver={global.volumeDriver}
        onChange={(k, v) => setGlobal((g) => ({ ...g, [k]: v }))}
      />

      <NetworkEditor networks={networks} onChange={setNetworks} />
      <VolumeEditor volumes={volumes} onChange={setVolumes} />
      <PVCEditor pvcs={pvcs} onChange={setPvcs} />

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        {services.map((s) => (
          <ServiceCard
            key={s.id}
            service={s}
            selected={selected.includes(s.id)}
            onToggle={toggleService}
            onChange={handleServiceChange}
            values={serviceValues[s.id] || {}}
          />
        ))}
      </div>

      <div className="text-center mt-8">
        <button
          onClick={handleGenerate}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Generate deployment.yaml
        </button>
      </div>

      <OutputViewer
        output={output}
        onDownload={handleDownload}
        provider="k8s"
      />
    </div>
  );
};
