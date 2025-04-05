export type PhotoData = { url: string; width: number; height: number; date?: string };
export type PhotoIndex = { previous: PhotoData; current: PhotoData; next: PhotoData; index: number; total: number };

export type ServerStatus = {
  serverTime: string;
  clientTime: string;
  port: number;
  numPhotos: number;
  resizeProgress?: number;
};

export const PORT = 8500;
