export type PhotoData = { url: string; width: number; height: number };
export type ServerStatus = { serverTime: number; port: number; numPhotos: number };
export type PhotoIndex = { previous: PhotoData; current: PhotoData; next: PhotoData; total: number };

export const PORT = 8500;
