import { useMemo } from 'react';
import { DragOverlay, useDndContext } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { snapCenterToCursor } from '@dnd-kit/modifiers';
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

  const { active } = useDndContext();
  const activeImage = useMemo(() => props.images.find(i => i.id === active?.id), [props.images, active]);

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
            isSelected={selectedImageIds.includes(image.id)}
            onSelect={selected => setSelectedImage(image.id, selected)} />
        ))}

        {activeImage && (
          <DragOverlay
            modifiers={[snapCenterToCursor]}>
            <DragPreview active={activeImage} />
          </DragOverlay>
        )}
      </SortableContext>
    </div>
  )

}