export interface SubDirectory {

  id: string;

  name: string;

  type: DirectoryType;

  breadcrumbs: { id: string, name: string }[];

  folders?: SubDirectory[];

  images?: ImageMetadata[];

}

export interface RootDirectory {

  type: 'root';

  folders?: SubDirectory[];

  images?: ImageMetadata[];

}

export const isSubDirectory = (dir: RootDirectory | SubDirectory): dir is SubDirectory =>
  (dir as SubDirectory)?.id !== undefined;

export type Directory = RootDirectory | SubDirectory;

export type DirectoryType = 'manifest' | 'range';

export type ViewMode = 'grid' | 'table';

export interface ImageMetadata {

  id: string;

  filename: string;

  width: number;

  height: number;

}

export interface ExtendedImageMetadata extends ImageMetadata {

  format: ImageFormat;

  uploadedAt: string;
        
  fileSize: number;

}

export interface APIListImagesResponse {

  total: number;

  offset: number;

  limit: number;

  images: ExtendedImageMetadata[];

}

// Cf.:
// - https://github.com/lovell/sharp/blob/7b4c4762432b14c62676e860c8034b5cd326f464/lib/index.d.ts#L1915-L1940
// - https://cantaloupe-project.github.io/manual/5.0/processors.html
export type ImageFormat = 'jpeg' | 'jpg' | 'jp2' | 'png' | 'tiff' | 'tif' | 'webp';

export interface APIListDirectoryResponse {

  total: number;

  offset: number;

  limit: number;

  items: APIListDirectoryResponseItem[];

}

export interface APIListDirectoryResponseImageItem extends ImageMetadata {

  type: 'image'

}

export type APIListDirectoryResponseItem = SubDirectory | APIListDirectoryResponseImageItem;







