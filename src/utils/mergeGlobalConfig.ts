/**
 * Merge global config (baseImage, sharedNetwork, volumeDriver) vào từng service
 */
export function mergeGlobalConfig(
  services: Record<string, any>,
  global: { baseImage?: string; sharedNetwork?: string; volumeDriver?: string }
) {
  const merged: Record<string, any> = {};
  for (const [id, svc] of Object.entries<any>(services)) {
    merged[id] = {
      ...svc,
      image: global.baseImage ? `${global.baseImage}${svc.image}` : svc.image,
      networks: svc.networks || (global.sharedNetwork ? [global.sharedNetwork] : undefined),
    };
  }
  return merged;
}
