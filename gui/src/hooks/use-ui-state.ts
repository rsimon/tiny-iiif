import type { Directory, ImageMetadata, ViewMode } from '@/types';
import { create } from 'zustand';

export interface UIState {

  currentDirectory?: Directory;
  setCurrentDirectory: (current?: Directory) => void;

  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  currentPage: number;
  setCurrentPage: (page: number) => void;

  pageSize: number;
  setPageSize: (size: number) => void;

  selectedImageIds: Set<string>;
  setSelectedImage: (id: string, selected: boolean) => void;
  setSelectedImageIds: (ids: string[]) => void;

  currentPreview?: ImageMetadata;
  setCurrentPreview: (image?: ImageMetadata) => void;

}

export const useUIState = create<UIState>((set) => ({

  currentDirectory: undefined, // Root
  setCurrentDirectory: current => set({ currentDirectory: current }),

  viewMode: 'grid',
  setViewMode: mode => set({ viewMode: mode }),

  currentPage: 1,
  setCurrentPage: page => set({ currentPage: page }),

  pageSize: 100,
  setPageSize: size => set({ pageSize: size }),

  selectedImageIds: new Set<string>([]),
  setSelectedImage: (id, selected) => set(state => {
    const newSelectedIds = new Set([...state.selectedImageIds]);

    if (selected)
      newSelectedIds.add(id);
    else
      newSelectedIds.delete(id);
    
    return { selectedImageIds: newSelectedIds };
  }),
  setSelectedImageIds: ids => set({ selectedImageIds: new Set(ids) }),

  currentPreview: undefined,
  setCurrentPreview: image => set({ currentPreview: image })

}));