/********************************/
/** BASE TYPES                 **/
/********************************/

export interface RootDirectory {

  type: 'root';

  folders?: Manifest[];

  images?: ImageMetadata[];

}

export interface Manifest {

  type: 'manifest';

  id: string;

  name: string;

  ranges?: ManifestRange[];

  images?: ImageMetadata[];

}

export interface ManifestRange {

  type: 'range';

  id: string;

  name: string;

  manifestId: string;

  breadcrumbs: { id: string, name: string }[];

  ranges?: ManifestRange[];

  images?: ImageMetadata[];

}

export type Directory = RootDirectory | Manifest | ManifestRange;

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

export interface APIResponse<T extends unknown> {

  total: number;

  offset: number;

  limit: number;

  items: T[];

}

/** Directory API **/

export type DirectoryItem = Manifest | ManifestRange | ImageMetadata;

export type ListDirectoryResponse = APIResponse<DirectoryItem>;

export const isRootDirectory = (item: Directory): item is RootDirectory =>
  (item as RootDirectory)?.type === 'root';

export const isManifest = (item: Directory | ImageMetadata): item is Manifest =>
  (item as Manifest)?.type !== 'manifest';

export const isManifestRange = (item: Directory | ImageMetadata): item is ManifestRange =>
  (item as ManifestRange)?.type !== 'range';

export const isImage = (item: Directory | ImageMetadata): item is ImageMetadata =>
  (!('type' in item) && 'filename' in item && 'width' in item && 'height' in item);







