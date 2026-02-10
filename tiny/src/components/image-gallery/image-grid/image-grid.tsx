import { useCallback, useMemo } from 'react';
import { DragOverlay } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { snapCenterToCursor } from '@dnd-kit/modifiers';
import { useDraggedImages } from '@/hooks/use-image-sorting';
import { useUIState } from '@/hooks/use-ui-state';
import type { ImageMetadata, SubFolder } from '@/types';
import { DragPreview } from './drag-preview';
import { FolderCard } from './folder-card';
import { ImageCard } from './image-card';

interface ImageGridProps {

  folders: SubFolder[];

  images: ImageMetadata[];

}

export const ImageGrid = (props: ImageGridProps) => {
  const { folders, images } = props;

  const selectedImageIds = useUIState(state => state.selectedImageIds);
  const setSelectedImage = useUIState(state => state.setSelectedImage);

  const selectedImages = useMemo(() => (
    [...selectedImageIds].map(id => props.images.find(i => i.id === id)).filter(Boolean)
  ), [selectedImageIds, props.images]);

  // Can be just the active image, or all selected images
  const { draggedImages, active } = useDraggedImages();

  const activeImage = props.images.find(i => i.id === active?.id);

  // If the whole selection is "dragged", all selected images are ghosted
  const isGhost = useCallback((image: ImageMetadata) => {
    if (draggedImages.length === 0) return false;
    return draggedImages.includes(image.id) && active?.id !== image.id;
  }, [active, draggedImages]);

  const onDelete = (_imageId: string) => {

  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      <SortableContext 
        items={props.images}
        strategy={rectSortingStrategy}>
        {folders.map(folder => (
          <FolderCard 
            key={folder.id} 
            folder={folder} />
        ))}

        {images.map(image => (
          <ImageCard
            key={image.id}
            image={image}
            isGhost={isGhost(image)}
            isSelected={selectedImageIds.includes(image.id)}
            onSelect={selected => setSelectedImage(image.id, selected)} />
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
    </div>
  )

}