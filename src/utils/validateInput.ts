/**
 * Validate port hoặc volume line input
 */
export function validatePort(line: string): boolean {
  return /^\\d{1,5}:\\d{1,5}$/.test(line.trim());
}

export function validateVolume(line: string): boolean {
  return /^[^:]+:[^:]+$/.test(line.trim());
}
