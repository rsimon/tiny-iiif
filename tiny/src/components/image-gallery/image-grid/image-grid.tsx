import { useCallback, useEffect, useMemo, useState } from 'react';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { snapCenterToCursor } from '@dnd-kit/modifiers';
import { toast } from 'sonner';
import { useUIState } from '@/hooks/use-ui-state';
import { useDirectory } from '@/hooks/use-directory';
import { isSubFolder, type ImageMetadata } from '@/types';
import { ImageCard } from './image-card';
import { DragPreview } from './drag-preview';
import { FolderCard } from './folder-card';
import {
  DndContext, 
  DragOverlay,
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors, 
  useDndContext,
  rectIntersection,
  type Active
} from '@dnd-kit/core';

interface SortableImageListProps {

  images: ImageMetadata[];

}

const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  }
}

const useDraggedImages = () => {
  const selectedImageIds = useUIState(state => state.selectedImageIds);

  const getDraggedImages= useCallback((active?: Active): string[] => {
    if (!active) return [];

    if (selectedImageIds.includes(active.id.toString())) {
      return selectedImageIds;
    } else {
      return [active.id.toString()];
    }
  }, [selectedImageIds]);

  return { getDraggedImages };
}

const SortableImageList = (props: SortableImageListProps) => {
  const selectedImageIds = useUIState(state => state.selectedImageIds);
  const setSelectedImage = useUIState(state => state.setSelectedImage);

  const selectedImages = useMemo(() => (
    [...selectedImageIds].map(id => props.images.find(i => i.id === id)).filter(Boolean)
  ), [selectedImageIds, props.images]);

  const { active } = useDndContext();

  const activeImage = props.images.find(i => i.id === active?.id);

  // Can be just the active image, or all selected images
  const { getDraggedImages } = useDraggedImages();

  const draggedImages = useMemo(() => getDraggedImages(active), [getDraggedImages, active]);

  // If the whole selection is "dragged", all selected images are ghosted
  const isGhost = useCallback((image: ImageMetadata) => {
    if (draggedImages.length === 0) return false;
    return draggedImages.includes(image.id) && active?.id !== image.id;
  }, [active, draggedImages]);

  const onDelete = (_imageId: string) => {

  }

  return (
    <SortableContext 
      items={props.images}
      strategy={rectSortingStrategy}>
      {props.images.map(image => (
        <ImageCard
          key={image.id}
          image={image}
          isGhost={isGhost(image)}
          isSelected={selectedImageIds.includes(image.id)}
          onSelect={selected => setSelectedImage(image.id, selected)}
          onDelete={() => onDelete(image.id)} />
      ))}

      {activeImage && (
        <DragOverlay
          modifiers={[snapCenterToCursor]}>
          <DragPreview 
            active={activeImage}
            selected={selectedImages} />
        </DragOverlay>
      )}
    </SortableContext>
  )

}

export const ImageGrid = () => {
  const currentDirectory = useUIState(state => state.currentDirectory);

  const { folders, images, moveImagesToFolder, reorderImagesInFolder } = useDirectory();

  const selectedImageIds = useUIState(state => state.selectedImageIds);
  const setSelectedImageIds = useUIState(state => state.setSelectedImageIds);

  const { getDraggedImages } = useDraggedImages();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  );

  const [sortedImages, setSortedImages] = useState(images);

  useEffect(() => {
    setSortedImages(images);
  }, [images]);

  const onDragEnd = (event: any) => {
    const { active, over } = event;

    const draggedImages = getDraggedImages(active);

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
  }

  return (
    <DndContext
      collisionDetection={rectIntersection}
      measuring={measuring}
      sensors={sensors}
      onDragEnd={onDragEnd}>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {folders.map(folder => (
          <FolderCard 
            key={folder.id} 
            folder={folder} />
        ))}
        
        <SortableImageList
          images={sortedImages} />
      </div>
    </DndContext>
  )

}