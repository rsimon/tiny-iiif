import { useMemo } from 'react';
import type { ImageMetadata } from '@/types';
import { getThumbnailURL } from '@/lib/get-thumbnail-url';
import { ImageCard } from './image-card';
import { useUIState } from '@/hooks/use-ui-state';
import { getDraggedImages } from '@/hooks/use-image-sorting';
import { useDirectory } from '@/hooks/use-directory';

interface DragPreviewProps {

  active: ImageMetadata;

}

const styles = [
  { transform: 'rotate(-8deg) translate(-4px, 6px)', zIndex: 1 },
  { transform: 'rotate(3deg) translate(2px, -2px)', zIndex: 2 },
  { transform: 'rotate(-2deg) translate(1px, 1px)', zIndex: 3 }
];

export const DragPreview = (props: DragPreviewProps) => {

  const { images } = useDirectory();

  const selectedImageIds = useUIState(state => state.selectedImageIds);

  const dragged = useMemo(() => {
    const draggedIds = getDraggedImages(selectedImageIds, props.active.id);
    return draggedIds.slice(0, styles.length)
      .reverse()
      .map(id => images.find(i => i.id === id))
      .filter(Boolean)
  }, [selectedImageIds, props.active.id, images]);

  return dragged.length > 1 ? (
    <div className="size-20">
      {dragged.map((image, index) => (
        <div 
          key={image.id}>
          <img
            src={getThumbnailURL(image, 120, 120)}
            alt={image.filename}
            className={`
              origin-center border border-neutral-400/50 absolute top-0 left-0 w-20 h-20 rounded-lg shadow-lg
              flex items-center justify-center text-white text-2xl font-bold
              transition-all duration-300`}
            style={{
              ...styles[index % styles.length]
            }} />
        </div>
      ))}
    </div>
  ) : (
    <ImageCard image={dragged[0]} />
  )

}