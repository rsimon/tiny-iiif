import { useEffect, useMemo, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { getThumbnailURL } from '@/lib/get-thumbnail-url';
import { useUIState } from '@/hooks/use-ui-state';
import type { ImageMetadata } from '@/types';
import { ImageActions } from '../image-actions';

interface ImageCardProps {

  image: ImageMetadata;

  isSelected?: boolean;

  onSelect?(selected: boolean): void;

}

const THUMBNAIL_HEIGHT = 400;
const THUMBNAIL_WIDTH = Math.ceil(THUMBNAIL_HEIGHT * 4 / 3);

export const ImageCard = (props: ImageCardProps) => {
  // Keep track of mounting - this way we can keep the mount animation 
  // when toggling between table and grid view, but have NO animation
  // on drag-and-drop grid sorting.
  const isInitialMount = useRef(true);
  
  useEffect(() => {
    if (isInitialMount.current)
      isInitialMount.current = false;
  }, [])

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: props.image.id,
    data: { type: 'image' }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const setCurrentPreview = useUIState(state => state.setCurrentPreview);

  const src = useMemo(() => (
    getThumbnailURL(props.image, THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT)
  ), [props.image]);

  const onOpenPreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPreview(props.image);
  }

  return (
    <div
      {...listeners} 
      {...attributes}  
      ref={setNodeRef}     
      style={style} 
      className={cn(
        'group rounded-lg bg-white image-card-shadow border border-border cursor-grab active:cursor-grabbing',
        isDragging ? 'opacity-0' : undefined,
        'transition-all duration-200 animate-fade-in'
      )}>
      <div 
        className="relative aspect-4/3 p-1"
        onClick={onOpenPreview}>
        <div className="w-full h-full relative overflow-hidden rounded-sm">
          <img
            src={src}
            alt={props.image.filename}
            className="w-full h-full rounded-sm object-cover transition-transform duration-250 group-hover:scale-105 pointer-events-none" />
        </div>

        <div className={cn(
          'absolute top-2 left-2 opacity-0',
          isDragging ? undefined : props.isSelected ? 'opacity-100' : 'group-hover:opacity-100'
        )}>
          <Checkbox
            checked={props.isSelected}
            onClick={e => e.stopPropagation()}
            onCheckedChange={checked => props.onSelect?.(checked as boolean)}
            className="size-5.5 border-sky-950/40 rounded-full bg-white/60 data-[state=checked]:bg-sky-900 data-[state=checked]:text-sky-100 data-[state=checked]:border-sky-100" />
        </div>
      </div>

      <div className="p-1 pt-0 pl-3 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-950 truncate flex-1">
          {props.image.filename}
        </span>

        <ImageActions 
          image={props.image} 
          onPreview={() => setCurrentPreview(props.image)} />
      </div>
    </div>
  )

}