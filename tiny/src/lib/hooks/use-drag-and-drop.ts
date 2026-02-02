
import { useCallback } from 'react'
import { useImageStore } from '../store_old'

export function useDragAndDrop() {
  
  const store = useImageStore()
  
  const startDragging = useCallback((imageIds: string[]) => {
    store.setIsDragging(true)
    store.setDraggingImageIds(imageIds)
  }, [store])
  
  const stopDragging = useCallback(() => {
    store.setIsDragging(false)
    store.setDraggingImageIds([])
  }, [store])
  
  const moveImagesToFolder = useCallback(async (imageIds: string[], folderId: string) => {
    // TODO: This will need to update the manifest file
    // For now, just update local state
    store.images.forEach(img => {
      if (imageIds.includes(img.id)) {
        store._updateImageInState(img.id, { folderId })
      }
    })
    
    store.clearSelection()
    stopDragging()
  }, [store, stopDragging])
  
  return {
    isDragging: store.isDragging,
    draggingImageIds: store.draggingImageIds,
    startDragging,
    stopDragging,
    moveImagesToFolder,
  }
}