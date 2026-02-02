import { useMemo } from 'react';
import type { ImageMetadata } from '@/types';
import { getThumbnailURL } from '@/utils/get-thumbnail-url';
import { ImageCard } from './image-card';

interface DragPreviewProps {

  active: ImageMetadata;

  selected?: ImageMetadata[];

}

const styles = [
  { transform: 'rotate(-8deg) translate(-4px, 6px)', zIndex: 1 },
  { transform: 'rotate(3deg) translate(2px, -2px)', zIndex: 2 },
  { transform: 'rotate(-2deg) translate(1px, 1px)', zIndex: 3 }
];

export const DragPreview = (props: DragPreviewProps) => {

  const { active, selected = [] } = props;

  const images = useMemo(() => 
    [active, ...selected.filter(i => i.id !== active.id)]
  , [active, selected]);

  const head = useMemo(() => [...images].slice(0, styles.length).reverse(), [images]);

  return head.length > 1 ? head.map((image, index) => (
    <div 
      key={image.id}
      className="size-26">
      <img
        src={getThumbnailURL(image, 120, 120)}
        alt={image.filename}
        className={`
          border border-neutral-400/50 absolute top-0 left-0 w-20 h-20 rounded-lg shadow-lg
          flex items-center justify-center text-white text-2xl font-bold
          transition-all duration-300`}
        style={{
          ...styles[index % styles.length],
          transformOrigin: 'center center'
        }} />
    </div>
  )) : (
    <ImageCard
      isDragged
      image={head[0]}
      isSelected={false}
      onSelect={selected => {}}
      onDelete={() => {}} />
  )

}