import type { Folder, ImageMetadata, ViewMode } from '@/types';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface UIState {

  currentDirectory?: Folder;
  setCurrentDirectory: (current?: Folder) => void;

  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  currentPage: number;
  setCurrentPage: (page: number) => void;

  pageSize: number;
  setPageSize: (size: number) => void;

  selectedImageIds: string[];
  setSelectedImage: (id: string, selected: boolean) => void;
  setSelectedImageIds: (ids: string[]) => void;

  currentPreview?: ImageMetadata;
  setCurrentPreview: (image?: ImageMetadata) => void;

}

export const useUIState = create<UIState>()(
  persist(
    set => ({
      currentDirectory: undefined, // Root
      setCurrentDirectory: current => set({ currentDirectory: current }),

      viewMode: 'grid',
      setViewMode: mode => set({ viewMode: mode }),

      currentPage: 1,
      setCurrentPage: page => set({ currentPage: page }),

      pageSize: 100,
      setPageSize: size => set({ pageSize: size }),

      selectedImageIds: [],
      setSelectedImage: (id, selected) => set(state => {
        const { selectedImageIds } = state;

        if (selected) {
          return selectedImageIds.includes(id)
            ? { selectedImageIds }
            : { selectedImageIds: [...selectedImageIds, id] };
        } else {
          return { selectedImageIds: selectedImageIds.filter(i => i !== id) };
        }
      }),
      setSelectedImageIds: ids => set({ selectedImageIds: ids }),

      currentPreview: undefined,
      setCurrentPreview: image => set({ currentPreview: image })
    }), {
      name: 'ui-state',
      storage: createJSONStorage(() => sessionStorage),
      partialize: state => ({
        viewMode: state.viewMode
      })
    }
  )
);
