import { useCallback, useEffect, useMemo, useState } from 'react';
import { MeasuringStrategy, PointerSensor, useDndContext, useSensor, useSensors } from '@dnd-kit/core';
import type { Active } from '@dnd-kit/core';
import { toast } from 'sonner';
import { useUIState } from './use-ui-state';
import { useDirectory } from './use-directory';
import { isSubFolder } from '@/types';

export const measureAlways = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  }
}

const getDraggedImages = (selectedImageIds: string[], active?: string): string[] => {
  if (!active) return [];

  if (selectedImageIds.includes(active)) {
    return selectedImageIds;
  } else {
    return [active];
  }
}

export const useImageSorting = () => {

  const { folders, images, moveImagesToFolder, reorderImagesInFolder } = useDirectory();

  const currentDirectory = useUIState(state => state.currentDirectory);

  const selectedImageIds = useUIState(state => state.selectedImageIds);
  const setSelectedImageIds = useUIState(state => state.setSelectedImageIds);

  const [active, setActive] = useState<string | null>(null);

  const [sortedImages, setSortedImages] = useState(images);

  const draggedImages = useMemo(() => {
    if (active === null) return [];
    return getDraggedImages(selectedImageIds, active)
  }, [selectedImageIds, active])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  );

  const filteredImages = useMemo(() => {
    if (draggedImages.length === 0) return sortedImages;
    return sortedImages.filter(i => !draggedImages.includes(i.id) || i.id === active);
  }, [sortedImages, draggedImages, active])

  useEffect(() => {
    setSortedImages(images);
  }, [images]);

  const onDragStart = useCallback((event: any) => {
    setActive(event.active?.id || null);
  }, []);

  const onDragCancel = useCallback((event: any) => {
    setActive(null);
  }, []);

  const onDragEnd = useCallback((event: any) => {
    setActive(null);

    const { active, over } = event;

    if (over.data.current.type === 'folder') {
      const destination = folders.find(m => m.id === over.id);

      const dragged = [...draggedImages]
        .map(id => images.find(i => i.id === id)).filter(Boolean);

      moveImagesToFolder(destination, dragged);

      if (selectedImageIds.includes(active?.id))
        setSelectedImageIds([]);
    } else if (active.id !== over.id) {
      // Store previous state for rollback
      const previousSortedImages = [...sortedImages];

      const movedImages = draggedImages.map(id => sortedImages.find(i => i.id === id)).filter(Boolean);
      const remainingImages = sortedImages.filter(i => !draggedImages.includes(i.id));
      const shouldInsertAt = remainingImages.findIndex(i => i.id === over.id);

      const activeIndex = sortedImages.findIndex(i => i.id === active.id);
      const overIndex = sortedImages.findIndex(i => i.id === over.id);

      const insertAt =
          activeIndex < overIndex
            ? shouldInsertAt + 1
            : shouldInsertAt;

      const newSortedImages = [
        ...remainingImages.slice(0, insertAt),
        ...movedImages,
        ...remainingImages.slice(insertAt),
      ];

      setSortedImages(newSortedImages);

      if (isSubFolder(currentDirectory))
        reorderImagesInFolder(currentDirectory.id, movedImages.map(i => i.id), insertAt)
          .then(() => {
            toast.success('Images reordered successfully');
          })
          .catch((error) => {
            // Rollback on failure
            setSortedImages(previousSortedImages);
            toast.error('Failed to reorder images');
            console.error('Reorder failed:', error);
          });

      if (selectedImageIds.includes(active?.id))
        setSelectedImageIds([]); 
    }
  }, [
    currentDirectory, 
    draggedImages,
    selectedImageIds,
    sortedImages, 
    moveImagesToFolder, 
    reorderImagesInFolder,
    setSelectedImageIds 
  ]);

  return { 
    sensors, 
    sortedImages: filteredImages, 
    onDragCancel,
    onDragEnd,
    onDragStart, 
  };

}