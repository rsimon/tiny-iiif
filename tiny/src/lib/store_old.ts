import { create } from 'zustand';
import type { ImageFile, Folder, ViewMode } from '../types'

interface ImageStore {

  images: ImageFile[];

  folders: Folder[];

  currentFolderId: string;

  selectedImages: Set<string>;

  viewMode: ViewMode;

  isDragging: boolean;

  draggingImageIds: string[];
  
  isLoadingImages: boolean;

  isLoadingManifests: boolean;
  
  currentPage: number;

  totalPages: number;

  totalImages: number;

  pageLimit: number;
  
  setCurrentFolder: (id: string) => void;

  toggleImageSelection: (id: string) => void;

  selectAllImages: () => void;

  clearSelection: () => void;

  setViewMode: (mode: ViewMode) => void;

  setIsDragging: (isDragging: boolean) => void;

  setDraggingImageIds: (ids: string[]) => void;

  setPage: (page: number) => void;

  setPageLimit: (limit: number) => void;
  
  _setImages: (images: ImageFile[], pagination?: { page: number, totalPages: number, total: number }) => void;

  _setFolders: (folders: Folder[]) => void;

  _setLoadingImages: (loading: boolean) => void;

  _setLoadingManifests: (loading: boolean) => void;

  _removeImageFromState: (id: string) => void;

  _removeImagesFromState: (ids: string[]) => void;

  _updateImageInState: (id: string, updates: Partial<ImageFile>) => void;

  _addFolder: (folder: Folder) => void;

  _removeFolder: (id: string) => void;

  _updateFolder: (id: string, updates: Partial<Folder>) => void;

}

export const useImageStore = create<ImageStore>((set, get) => ({
  images: [],
  folders: [
    { id: 'root', name: 'All Images', parentId: null, order: 0 }
  ],
  currentFolderId: 'root',
  selectedImages: new Set(),
  viewMode: 'grid',
  isDragging: false,
  draggingImageIds: [],
  isLoadingImages: false,
  isLoadingManifests: false,
  currentPage: 1,
  totalPages: 1,
  totalImages: 0,
  pageLimit: 50,
  
  // UI actions
  setCurrentFolder: (id) => set({ currentFolderId: id, selectedImages: new Set() }),
  toggleImageSelection: (id) => set((state) => {
    const newSelection = new Set(state.selectedImages)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    return { selectedImages: newSelection }
  }),
  selectAllImages: () => set((state) => {
    const currentImages = state.images.filter(img => 
      state.currentFolderId === 'root' || img.folderId === state.currentFolderId
    )
    return { selectedImages: new Set(currentImages.map(img => img.id)) }
  }),
  clearSelection: () => set({ selectedImages: new Set() }),
  setViewMode: (viewMode) => set({ viewMode }),
  setIsDragging: (isDragging) => set({ isDragging }),
  setDraggingImageIds: (draggingImageIds) => set({ draggingImageIds }),
  
  // Pagination
  setPage: (page) => set({ currentPage: page }),
  setPageLimit: (limit) => set({ pageLimit: limit, currentPage: 1 }),
  
  // Internal state updates
  _setImages: (images, pagination) => set({ 
    images,
    ...(pagination && {
      currentPage: pagination.page,
      totalPages: pagination.totalPages,
      totalImages: pagination.total
    })
  }),
  _setFolders: (folders) => set({ folders }),
  _setLoadingImages: (loading) => set({ isLoadingImages: loading }),
  _setLoadingManifests: (loading) => set({ isLoadingManifests: loading }),
  _removeImageFromState: (id) => set((state) => ({ 
    images: state.images.filter(img => img.id !== id),
    selectedImages: new Set([...state.selectedImages].filter(imgId => imgId !== id))
  })),
  _removeImagesFromState: (ids) => set((state) => ({
    images: state.images.filter(img => !ids.includes(img.id)),
    selectedImages: new Set()
  })),
  _updateImageInState: (id, updates) => set((state) => ({
    images: state.images.map(img => img.id === id ? { ...img, ...updates } : img)
  })),
  _addFolder: (folder) => set((state) => ({ folders: [...state.folders, folder] })),
  _removeFolder: (id) => set((state) => ({ 
    folders: state.folders.filter(f => f.id !== id),
    images: state.images.filter(img => img.folderId !== id),
    currentFolderId: state.currentFolderId === id ? 'root' : state.currentFolderId
  })),
  _updateFolder: (id, updates) => set((state) => ({
    folders: state.folders.map(f => f.id === id ? { ...f, ...updates } : f)
  })),
}))
