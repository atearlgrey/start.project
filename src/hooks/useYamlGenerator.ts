/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateYAML } from "../utils/generateYAML";
import { generateK8SYAML } from "../utils/generateK8SYAML";
import { type Provider } from "../types/Provider";

/**
 * Hook sinh YAML dựa trên provider (compose/swarm/k8s)
 */
export function useYamlGenerator(provider: Provider) {
  const generate = (version: string, services: Record<string, any>): string => {
    if (provider === "k8s") return generateK8SYAML(services);
    return generateYAML(version, services);
  };

  return { generate };
}
