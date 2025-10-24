/* eslint-disable @typescript-eslint/no-explicit-any */
import YAML from "yaml";

/**
 * Generate Kubernetes manifests dynamically from service definitions.
 * Supports image, command, environment, ports, volumes, etc.
 */
export function generateK8SYAML(services: Record<string, any>): string {
  let manifests = "";

  for (const [name, svc] of Object.entries<any>(services)) {
    const container: Record<string, any> = {
      name,
      image: svc.image,
    };

    // command
    if (svc.command) {
      container.command = ["/bin/sh", "-c", svc.command];
    }

    // env[]
    if (svc.environment && Object.keys(svc.environment).length > 0) {
      container.env = Object.entries(svc.environment).map(([key, value]) => ({
        name: key,
        value: String(value),
      }));
    }

    // ports
    if (svc.ports && svc.ports.length > 0) {
      container.ports = svc.ports.map((p: string) => {
        const [host, containerPort] = p.split(":");
        return { containerPort: Number(containerPort || host) };
      });
    }

    // volumes
    let volumeMounts: any[] = [];
    if (svc.volumes && svc.volumes.length > 0) {
      volumeMounts = svc.volumes.map((v: string) => {
        const [host, mountPath] = v.split(":");
        return { name: host.replace(/[^\w-]/g, "-"), mountPath };
      });
      container.volumeMounts = volumeMounts;
    }

    // Deployment manifest
    const deployment = {
      apiVersion: "apps/v1",
      kind: "Deployment",
      metadata: { name },
      spec: {
        replicas: 1,
        selector: { matchLabels: { app: name } },
        template: {
          metadata: { labels: { app: name } },
          spec: {
            containers: [container],
            ...(volumeMounts.length > 0 && {
              volumes: volumeMounts.map((v) => ({
                name: v.name,
                persistentVolumeClaim: { claimName: v.name },
              })),
            }),
          },
        },
      },
    };

    // Service manifest
    const servicePorts =
      svc.ports?.map((p: string) => {
        const [host, containerPort] = p.split(":");
        return {
          port: Number(containerPort || host),
          targetPort: Number(containerPort || host),
        };
      }) || [];

    const service =
      servicePorts.length > 0
        ? {
            apiVersion: "v1",
            kind: "Service",
            metadata: { name },
            spec: {
              selector: { app: name },
              ports: servicePorts,
              type: "ClusterIP",
            },
          }
        : null;

    // Append YAML blocks
    manifests += "---\n" + YAML.stringify(deployment);
    if (service) {
      manifests += "---\n" + YAML.stringify(service);
    }
  }

  return manifests.trim();
}
