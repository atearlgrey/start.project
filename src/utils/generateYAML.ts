/* eslint-disable @typescript-eslint/no-explicit-any */
// import YAML from "yaml";

// export function generateYAML(version: string, services: Record<string, any>): string {
//   const doc: Record<string, any> = {
//     version,
//     services: {},
//   };

//   for (const [name, cfg] of Object.entries<any>(services)) {
//     const s: Record<string, any> = {
//       image: cfg.image,
//     };

//     // Basic configs
//     if (cfg.container_name) s.container_name = cfg.container_name;
//     if (cfg.build) s.build = cfg.build;
//     if (cfg.command) s.command = cfg.command;
//     if (cfg.ports?.length) s.ports = cfg.ports;
//     if (cfg.volumes?.length) s.volumes = cfg.volumes;
//     if (cfg.environment && Object.keys(cfg.environment).length) s.environment = cfg.environment;
//     if (cfg.env_file) s.env_file = cfg.env_file;
//     if (cfg.restart) s.restart = cfg.restart;
//     if (cfg.hostname) s.hostname = cfg.hostname;
//     if (cfg.working_dir) s.working_dir = cfg.working_dir;

//     // Networking
//     if (cfg.networks?.length) s.networks = cfg.networks;

//     // Dependencies
//     if (cfg.depends_on?.length) s.depends_on = cfg.depends_on;

//     // Deploy (Swarm only)
//     if (cfg.deploy) s.deploy = cfg.deploy;

//     // Healthcheck
//     if (cfg.healthcheck) s.healthcheck = cfg.healthcheck;

//     // Labels
//     if (cfg.labels) s.labels = cfg.labels;

//     // Privileged mode
//     if (cfg.privileged) s.privileged = cfg.privileged;

//     // Extra hosts
//     if (cfg.extra_hosts) s.extra_hosts = cfg.extra_hosts;

//     // Capabilities
//     if (cfg.cap_add) s.cap_add = cfg.cap_add;
//     if (cfg.cap_drop) s.cap_drop = cfg.cap_drop;

//     // Security
//     if (cfg.security_opt) s.security_opt = cfg.security_opt;
//     if (cfg.user) s.user = cfg.user;

//     // Ulimits
//     if (cfg.ulimits) s.ulimits = cfg.ulimits;

//     // DNS
//     if (cfg.dns) s.dns = cfg.dns;
//     if (cfg.dns_search) s.dns_search = cfg.dns_search;

//     // Logging
//     if (cfg.logging) s.logging = cfg.logging;

//     // Entrypoint
//     if (cfg.entrypoint) s.entrypoint = cfg.entrypoint;

//     // Read-only root filesystem
//     if (cfg.read_only) s.read_only = cfg.read_only;

//     // Stop signal
//     if (cfg.stop_signal) s.stop_signal = cfg.stop_signal;

//     doc.services[name] = s;
//   }

//   return YAML.stringify(doc);
// }

// export function generateK8SYAML(services: any): string {
//   const docs: any[] = [];

//   for (const [name, cfg] of Object.entries<any>(services)) {
//     // Deployment
//     docs.push({
//       apiVersion: "apps/v1",
//       kind: "Deployment",
//       metadata: { name },
//       spec: {
//         replicas: 1,
//         selector: { matchLabels: { app: name } },
//         template: {
//           metadata: { labels: { app: name } },
//           spec: {
//             containers: [
//               {
//                 name,
//                 image: cfg.image,
//                 ports: cfg.ports
//                   ? cfg.ports.map((p: string) => ({
//                     containerPort: parseInt(p.split(":")[0]),
//                   }))
//                   : undefined,
//                 env: cfg.environment
//                   ? Object.entries(cfg.environment).map(([k, v]) => ({
//                     name: k,
//                     value: String(v),
//                   }))
//                   : undefined,
//               },
//             ],
//           },
//         },
//       },
//     });

//     // Service
//     docs.push({
//       apiVersion: "v1",
//       kind: "Service",
//       metadata: { name },
//       spec: {
//         selector: { app: name },
//         ports: cfg.ports
//           ? cfg.ports.map((p: string) => {
//             const port = parseInt(p.split(":")[0]);
//             return { port, targetPort: port };
//           })
//           : [{ port: 80, targetPort: 80 }],
//       },
//     });
//   }

//   // Join multiple docs with `---`
//   return docs.map((doc) => YAML.stringify(doc)).join("---\n");
// }


import YAML from "yaml";

/**
 * Sinh docker-compose.yml hoặc stack.yml
 */
export function generateYAML(version: string, services: Record<string, any>, networks?: Record<string, any>, volumes?: Record<string, any>): string {
  console.log("Generating YAML with services:", services);
  console.log("Using version:", version);
  const doc: Record<string, any> = {
    version,
    services,
  };

  if (networks && Object.keys(networks).length > 0) {
    doc.networks = networks;
  }

  if (volumes && Object.keys(volumes).length > 0) {
    doc.volumes = volumes;
  }

  return YAML.stringify(doc);
}
