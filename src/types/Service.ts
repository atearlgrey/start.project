export interface EnvField {
  key: string;
  label: string;
  default?: string;
}

export interface Service {
  container_name: string;
  image: string;
  env?: EnvField[];
  ports?: string[];
  volumes?: string[];
  depends_on?: string[];
}
