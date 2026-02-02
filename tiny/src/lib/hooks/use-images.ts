
import { useCallback, useEffect } from 'react';
import { useImageStore } from '../store_old';
import type { ImageFile, ImageMetadata } from '../../types'

const API_BASE = '/api';

export function useImages() {

  const store = useImageStore()
  
  const fetchImages = useCallback(async (page?: number) => {
    const targetPage = page ?? store.currentPage
    store._setLoadingImages(true)
    
    try {
      const response = await fetch(
        `${API_BASE}/images?page=${targetPage}&limit=${store.pageLimit}`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch images')
      }
      
      const data = await response.json()
      
      // Transform API response to ImageFile format
      const images: ImageFile[] = data.images.map((img: ImageMetadata) => ({
        id: img.id,
        name: img.filename,
        url: `http://localhost/iiif/2/${img.id}/full/max/0/default.jpg`, // Cantaloupe IIIF URL
        width: img.width,
        height: img.height,
        size: img.fileSize,
        uploadedAt: new Date(img.uploadedAt),
        folderId: 'root'
      }))
      
      store._setImages(images, {
        page: 1,
        totalPages: 1,
        total: data.total
      })
    } catch (error) {
      console.error('Error fetching images:', error)
    } finally {
      store._setLoadingImages(false)
    }
  }, [store])
  
  // Upload images
  const uploadImages = useCallback(async (files: File[]) => {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    
    try {
      const response = await fetch(`${API_BASE}/images`, {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Failed to upload images')
      }
      
      const data = await response.json()
      
      // Refresh the current page to show new images
      await fetchImages()
      
      return data.uploaded
    } catch (error) {
      console.error('Error uploading images:', error)
      throw error
    }
  }, [fetchImages])
  
  const deleteImage = useCallback(async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/images/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete image')
      }
      
      store._removeImageFromState(id)
    } catch (error) {
      console.error('Error deleting image:', error)
      throw error
    }
  }, [store])
  
  const deleteImages = useCallback(async (ids: string[]) => {
    try {
      const response = await fetch(`${API_BASE}/images`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete images')
      }
      
      const data = await response.json()
      
      // Remove successfully deleted images from state
      const deletedIds = data.deleted.map((d: any) => d.id)
      store._removeImagesFromState(deletedIds)
      
      return data
    } catch (error) {
      console.error('Error deleting images:', error)
      throw error
    }
  }, [store])
  
  const deleteSelectedImages = useCallback(async () => {
    const selectedIds = Array.from(store.selectedImages)
    if (selectedIds.length === 0) return
    
    return deleteImages(selectedIds)
  }, [store.selectedImages, deleteImages])
  
  const goToPage = useCallback(async (page: number) => {
    store.setPage(page)
    await fetchImages(page)
  }, [store, fetchImages])
  
  useEffect(() => {
    fetchImages();
  }, []);
  
  return {
    images: store.images,
    isLoading: store.isLoadingImages,
    currentPage: store.currentPage,
    totalPages: store.totalPages,
    totalImages: store.totalImages,
    pageLimit: store.pageLimit,
    selectedImages: store.selectedImages,
    
    fetchImages,
    uploadImages,
    deleteImage,
    deleteImages,
    deleteSelectedImages,
    goToPage,
    setPageLimit: store.setPageLimit,
    toggleImageSelection: store.toggleImageSelection,
    selectAllImages: store.selectAllImages,
    clearSelection: store.clearSelection,
  }
}