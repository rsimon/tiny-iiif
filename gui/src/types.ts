export interface Directory {

  id: string;

  name: string;

  type: DirectoryType;

}

export interface CurrentDirectory extends Directory {

  breadcrumbs: Directory[];

}

export type DirectoryType = 'manifest' | 'range';

export type ViewMode = 'grid' | 'table';

export interface ImageMetadata {

  id: string;

  filename: string;

  format: ImageFormat;

  width: number;

  height: number;
        
  uploadedAt: string;
        
  fileSize: number;

}

export interface APIListImagesResponse {

  total: number;

  offset: number;

  limit: number;

  images: ImageMetadata[];

}

// Cf.:
// - https://github.com/lovell/sharp/blob/7b4c4762432b14c62676e860c8034b5cd326f464/lib/index.d.ts#L1915-L1940
// - https://cantaloupe-project.github.io/manual/5.0/processors.html
export type ImageFormat = 'jpeg' | 'jpg' | 'jp2' | 'png' | 'tiff' | 'tif' | 'webp';

export interface ManifestMetadata {

  id: string;

  name: string;

}

export interface APIListManifestsResponse {

  total: number;

  offset: number;

  limit: number;

  manifests: ManifestMetadata[];

}

export interface APIListDirectoryResponse {

  total: number;

  offset: number;

  limit: number;

  items: APIListDirectoryResponseItem[];

}

interface APIListDirectoryResponseManifestItem extends ManifestMetadata {

  type: 'manifest'

}

interface APIListDirectoryResponseImageItem extends ImageMetadata {

  type: 'image'

}

export type APIListDirectoryResponseItem = 
  APIListDirectoryResponseManifestItem | APIListDirectoryResponseImageItem;







