import { useEffect, useState } from "react";
import { ComposeLayout } from "./components/docker/ComposeLayout";
import { SwarmLayout } from "./components/dockerSwarm/SwarmLayout";
import { K8SLayout } from "./components/k8s/K8SLayout";
import { ProviderSelector } from "./components/shared/ProviderSelector";
import { type Provider } from "./types/Provider";
import { type Service } from "./types/Service";

export default function App() {
  const [provider, setProvider] = useState<Provider>("compose");
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}/services.json`)
      .then((r) => r.json())
      .then(setServices);

    const saved = localStorage.getItem("appProvider");
    if (saved) setProvider(saved as Provider);
  }, []);

  useEffect(() => {
    localStorage.setItem("appProvider", provider);
  }, [provider]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">🧱 Compose Start</h1>

      {/* Provider selector */}
      <ProviderSelector provider={provider} onChange={setProvider} />

      {/* Dynamic layouts */}
      {provider === "compose" && <ComposeLayout services={services} />}
      {provider === "swarm" && <SwarmLayout services={services} />}
      {provider === "k8s" && <K8SLayout services={services} />}
    </div>
  );
}
