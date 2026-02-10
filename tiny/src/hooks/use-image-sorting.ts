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

const getDraggedImages = (selectedImageIds: string[], active?: Active): string[] => {
  if (!active) return [];

  if (selectedImageIds.includes(active.id.toString())) {
    return selectedImageIds;
  } else {
    return [active.id.toString()];
  }
}

export const useDraggedImages = () => {
  const { active } = useDndContext();
  const selectedImageIds = useUIState(state => state.selectedImageIds);

  const draggedImages = useMemo(() => (
    getDraggedImages(selectedImageIds, active)
  ), [active, selectedImageIds]);

  return { draggedImages, active };
}

export const useImageSorting = () => {

  const { folders, images, moveImagesToFolder, reorderImagesInFolder } = useDirectory();

  const currentDirectory = useUIState(state => state.currentDirectory);

  const selectedImageIds = useUIState(state => state.selectedImageIds);
  const setSelectedImageIds = useUIState(state => state.setSelectedImageIds);

  const [sortedImages, setSortedImages] = useState(images);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  );

  useEffect(() => {
    setSortedImages(images);
  }, [images]);

  const onDragEnd = useCallback((event: any) => {
    const { active, over } = event;

    const draggedImages = getDraggedImages(selectedImageIds, active);

    if (over.data.current.type === 'folder') {
      const destination = folders.find(m => m.id === over.id);

      const dragged = [...draggedImages]
        .map(id => images.find(i => i.id === id)).filter(Boolean);

      moveImagesToFolder(destination, dragged);
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
    }

    if (selectedImageIds.includes(active?.id))
      setSelectedImageIds([]);
  }, [
    currentDirectory, 
    selectedImageIds,
    sortedImages, 
    moveImagesToFolder, 
    reorderImagesInFolder,
    setSelectedImageIds 
  ]);

  return { sensors, sortedImages, onDragEnd };

}