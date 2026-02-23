/********************************/
/** BASE TYPES                 **/
/********************************/

export interface RootFolder {

  type: 'root';

  folders?: ManifestMetadata[];

  images?: ImageMetadata[];

}

export interface ManifestMetadata {

  type: 'manifest';

  id: string;

  name: string;

  ranges?: ManifestRangeMetadata[];

  images?: ImageMetadata[];

}

export interface ManifestRangeMetadata {

  type: 'range';

  id: string;

  name: string;

  manifestId: string;

  breadcrumbs: { id: string, name: string }[];

  ranges?: ManifestRangeMetadata[];

  images?: ImageMetadata[];

}

export type SubFolder = ManifestMetadata | ManifestRangeMetadata;

export type Folder = RootFolder | SubFolder;

export type ViewMode = 'grid' | 'table';

/** Base image metadata included in manifest (via /dir API) **/
export interface ImageMetadata {

  id: string;

  filename: string;

  width: number;

  height: number;

}

/** Extended image metadata available in meta JSON (via /image API) **/
export interface ExtendedImageMetadata extends ImageMetadata {

  format: ImageFormat;

  uploadedAt: string;
        
  fileSize: number;

}

// Cf.:
// - https://github.com/lovell/sharp/blob/7b4c4762432b14c62676e860c8034b5cd326f464/lib/index.d.ts#L1915-L1940
// - https://cantaloupe-project.github.io/manual/5.0/processors.html
export type ImageFormat = 'jpeg' | 'jpg' | 'jp2' | 'png' | 'tiff' | 'tif' | 'webp';

/********************************/
/** API TYPES                  **/
/********************************/

export interface ListDirectoryResponse {

  folder?: string;

  total: number;

  offset: number;

  limit: number;

  items: DirectoryItem[];

  meta: {
    
    totalImages: number;

    totalManifests: number;
    
  }

}

export type DirectoryItem = ManifestMetadata | ManifestRangeMetadata | ImageMetadata;

export const isRootFolder = (item: Folder): item is RootFolder =>
  (item as RootFolder)?.type === 'root';

export const isManifestMetadata = (item: Folder | ImageMetadata): item is ManifestMetadata =>
  (item as ManifestMetadata)?.type === 'manifest';

export const isManifestRangeMetadata = (item: Folder | ImageMetadata): item is ManifestRangeMetadata =>
  (item as ManifestRangeMetadata)?.type === 'range';

export const isSubFolder = (item: Folder | ImageMetadata): item is SubFolder =>
  (item as SubFolder)?.type === 'manifest' || (item as SubFolder)?.type === 'range';

export const isImage = (item: Folder | ImageMetadata): item is ImageMetadata =>
  (!('type' in item) && 'filename' in item && 'width' in item && 'height' in item);







