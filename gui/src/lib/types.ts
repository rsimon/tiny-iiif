export interface ImageFile {
  
  id: string;
  
  name: string;
  
  url: string;
  
  width: number;
  
  height: number;
  
  size: number;
  
  uploadedAt: Date;
  
  folderId: string;

}

export interface Folder {

  id: string;

  name: string;

  parentId: string | null;

  order: number;

}

export type ViewMode = 'grid' | 'table';
