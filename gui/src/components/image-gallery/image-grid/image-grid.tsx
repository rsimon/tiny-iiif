import { 
  DndContext, 
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors } from '@dnd-kit/core';
import { useUIState } from '@/hooks/use-ui-state';
import type { ImageMetadata } from '@/types';
import { ImageCard } from './image-card';
import { FolderCard } from './folder-card';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy
} from "@dnd-kit/sortable";
import { useEffect, useState } from 'react';

interface ImageGridProps {

  images: ImageMetadata[];

}

export const ImageGrid = (props: ImageGridProps) => {

  const { selectedImageIds, setSelectedImage } = useUIState();

  const [sortedImages, setSortedImags] = useState(props.images);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  );

  useEffect(() => {
    setSortedImags(props.images);
  }, [props.images.map(i => i.id).join()]);

  const onDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setSortedImags(items => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const onDelete = (imageId: string) => {

  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      sensors={sensors}
      onDragEnd={onDragEnd}>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        <SortableContext 
          items={sortedImages} 
          strategy={rectSortingStrategy}>
          <FolderCard id="a" />
          <FolderCard id="b" />

          {sortedImages.map(image => (
            <ImageCard
              key={image.id}
              image={image}
              isSelected={selectedImageIds.has(image.id)}
              onSelect={selected => setSelectedImage(image.id, selected)}
              onDelete={() => onDelete(image.id)} />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  )

}