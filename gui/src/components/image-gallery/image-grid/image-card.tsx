import { useMemo, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import type { ImageMetadata } from '@/types';
import { cn } from '@/lib/utils';

interface ImageCardProps {

  image: ImageMetadata;
  
  isSelected: boolean;

  onDelete(): void;

  onSelect(): void;

}

const THUMBNAIL_HEIGHT = 400;
const THUMBNAIL_ASPECT = 4 / 3;
const THUMBNAIL_WIDTH = Math.ceil(THUMBNAIL_HEIGHT * THUMBNAIL_ASPECT);

export const ImageCard = (props: ImageCardProps) => {

  const { filename, width, height, id } = props.image; 

  const [isSelected, setIsSelected] = useState(false);

  const src = useMemo(() => {
    const sourceAspect = width / height;

    let requestWidth: number;
    let requestHeight: number;
    
    if (sourceAspect > THUMBNAIL_ASPECT) {
      requestHeight = THUMBNAIL_HEIGHT;
      requestWidth = Math.ceil(THUMBNAIL_HEIGHT * sourceAspect);
    } else {
      requestWidth = THUMBNAIL_WIDTH;
      requestHeight = Math.ceil(THUMBNAIL_WIDTH / sourceAspect);
    }

    return `http://localhost/iiif/2/${id}/full/${requestWidth},${requestHeight}/0/default.jpg`;
  }, [id, width, height]);

  return (
    <div className="group rounded-lg overflow-hidden image-card-shadow border transition-all duration-200 animate-fade-in cursor-grab active:cursor-grabbing">
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        <img
          src={src}
          alt={filename}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 pointer-events-none" />

        <div className={cn(
          'absolute top-3 left-3 transition-opacity',
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}>
          <Checkbox
            checked={isSelected}
            onCheckedChange={checked => setIsSelected(checked as boolean)}
            className="size-6 border-sky-950/40 rounded-full bg-white/60 data-[state=checked]:bg-green-600 data-[state=checked]:text-green-100 data-[state=checked]:border-green-100" />
        </div>
      </div>

      <div className="px-3 py-4 flex items-center justify-between bg-white">
        <span className="text-sm font-medium text-card-foreground truncate flex-1">
          {filename}
        </span>
      </div>
    </div>
  )

}