import React from "react";

interface EnvField {
  key: string;
  label: string;
  default?: string;
}

interface Service {
  id: string;
  name: string;
  image: string;
  env?: EnvField[];
  ports?: string[];
  volumes?: string[];
  networks?: string[];
  command?: string;
  [key: string]: unknown; // cho phép field mở rộng (entrypoint, labels, depends_on…)
}

interface Props {
  service: Service;
  selected: boolean;
  onToggle: (id: string) => void;
  onChange: (id: string, key: string, value: any) => void;
  values: Record<string, any>;
}

export const ServiceCard: React.FC<Props> = ({
  service,
  selected,
  onToggle,
  onChange,
  values,
}) => {
  // xử lý multiline list (ports, volumes,...)
  const handleListChange = (value: string, key: string) => {
    const parsed = value.split("\n").map((x) => x.trim());
    if(parsed.length === 1 && parsed[0] === "") {
      parsed.pop();
    }
    onChange(service.id, key, parsed);
  };

  return (
    <div className="border rounded-lg p-4 shadow bg-white hover:shadow-md transition">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggle(service.id)}
          className="accent-blue-500"
        />
        <span className="font-semibold text-lg">{service.name}</span>
      </label>

      {selected && (
        <div className="mt-3 space-y-3">
          {/* Dynamic image */}
          {"image" in service && (
            <div>
              <label className="text-sm font-medium">Image</label>
              <input
                type="text"
                value={values.image ?? service.image}
                onChange={(ev) => onChange(service.id, "image", ev.target.value)}
                className="border p-1 w-full text-sm rounded"
              />
            </div>
          )}

          {/* Dynamic command */}
          {"command" in service && (
            <div>
              <label className="text-sm font-medium">Command</label>
              <input
                type="text"
                value={values.command ?? service.command ?? ""}
                onChange={(ev) =>
                  onChange(service.id, "command", ev.target.value)
                }
                placeholder="e.g. mysqld --sql_mode="
                className="border p-1 w-full text-sm rounded"
              />
            </div>
          )}

          {/* Dynamic env */}
          {Array.isArray(service.env) &&
            service.env.map((e) => (
              <div key={e.key}>
                <label className="text-sm">{e.label}</label>
                <input
                  type="text"
                  value={values[e.key] ?? e.default ?? ""}
                  onChange={(ev) =>
                    onChange(service.id, e.key, ev.target.value)
                  }
                  className="border p-1 w-full text-sm rounded"
                />
              </div>
            ))}

          {/* Dynamic ports */}
          {"ports" in service && (
            <div>
              <label className="text-sm font-medium">Ports</label>
              <textarea
                className="border p-1 w-full text-sm rounded"
                rows={3}
                value={(values.ports ?? service.ports ?? []).join("\n")}
                onChange={(ev) =>
                  handleListChange(ev.target.value, "ports")
                }
                placeholder="8080:80"
              />
            </div>
          )}

          {/* Dynamic volumes */}
          {"volumes" in service && (
            <div>
              <label className="text-sm font-medium">Volumes</label>
              <textarea
                className="border p-1 w-full text-sm rounded"
                rows={3}
                value={(values.volumes ?? service.volumes ?? []).join("\n")}
                onChange={(ev) =>
                  handleListChange(ev.target.value, "volumes")
                }
                placeholder="./data:/var/lib/mysql"
              />
            </div>
          )}

          {"networks" in service && (
            <div>
              <label className="text-sm font-medium">Networks</label>
              <input
                type="text"
                className="border p-1 w-full text-sm rounded"
                value={(values.networks ?? service.networks ?? []).join("\n")}
                onChange={(ev) =>
                  handleListChange(ev.target.value, "networks")
                }
                placeholder="app-network"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
