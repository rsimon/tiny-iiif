import { useEffect, useMemo, useState } from 'react';
import { arrayMove, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { useUIState } from '@/hooks/use-ui-state';
import { useDirectory } from '@/hooks/use-directory';
import type { ImageMetadata } from '@/types';
import { ImageCard } from './image-card';
import { DragPreview } from './drag-preview';
import { 
  closestCenter,
  DndContext, 
  DragOverlay,
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors, 
  useDndContext
} from '@dnd-kit/core';
import { FolderCard } from './folder-card';


interface SortableImageListProps {

  images: ImageMetadata[];
}

const SortableImageList = (props: SortableImageListProps) => {

  const { selectedImageIds, setSelectedImage } = useUIState();

  const selectedImages = useMemo(() => (
    [...selectedImageIds].map(id => props.images.find(i => i.id === id)).filter(Boolean)
  ), [selectedImageIds, props.images]);

  const { active } = useDndContext();

  const activeImage = props.images.find(i => i.id === active?.id);

  const filteredImages = (activeImage && selectedImages.length > 1)
    ? props.images.filter(i => !selectedImageIds.has(i.id)) 
    : props.images;

  const onDelete = (_imageId: string) => {

  }

  return (
    <SortableContext 
      items={filteredImages} 
      strategy={rectSortingStrategy}>
      {filteredImages.map(image => (
        <ImageCard
          key={image.id}
          image={image}
          isSelected={selectedImageIds.has(image.id)}
          onSelect={selected => setSelectedImage(image.id, selected)}
          onDelete={() => onDelete(image.id)} />
      ))}

      {activeImage && (
        <DragOverlay>
          <DragPreview 
            active={activeImage}
            selected={selectedImages} />
        </DragOverlay>
      )}
    </SortableContext>
  )

}

const measuringConfig = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  }
};

export const ImageGrid = () => {

  const { manifests, images, moveImagesToFolder } = useDirectory();

  const selectedImageIds = useUIState(state => state.selectedImageIds);
  const setSelectedImageIds = useUIState(state => state.setSelectedImageIds);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  );

  // TODO just for testing - dummy dnd sorting!
  const [sortedImages, setSortedImages] = useState(images);

  useEffect(() => {
    setSortedImages(images);
  }, [images.map(i => i.id).join()]);

  const onDragEnd = (event: any) => {
    const { active, over } = event;

    if (over.data.current.type === 'folder') {
      if (selectedImageIds.size === 0) return;

      const destination = manifests.find(m => m.id === over.id);

      const selected = [...selectedImageIds]
        .map(id => images.find(i => i.id === id)).filter(Boolean);

      moveImagesToFolder(destination, selected);
      setSelectedImageIds([]);
    } else if (active.id !== over.id) {
      // Change sorting (dummy implementation!)
      setSortedImages(items => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      measuring={measuringConfig}
      sensors={sensors}
      onDragEnd={onDragEnd}>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {manifests.map(m => (
          <FolderCard 
            key={m.id} 
            folder={m} />
        ))}
        
        <SortableImageList 
          images={sortedImages} />
      </div>
    </DndContext>
  )

}