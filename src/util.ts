import { PORT } from 'types';

export const SERVER = `${window.location.protocol}//${window.location.hostname}:${PORT}`;

export function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}
