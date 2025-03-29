import { PORT } from 'types';

export const SERVER = `${window.location.protocol}//${window.location.hostname}:${PORT}`;

// Mod function to handle negative numbers
export function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}
