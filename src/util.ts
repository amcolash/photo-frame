import { PORT } from './types';

export const SERVER = `${window.location.protocol}//${window.location.hostname}:${PORT}`;

export function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

// From https://stackoverflow.com/a/2450976/2303432
export function shuffle(array: any[]) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
}
