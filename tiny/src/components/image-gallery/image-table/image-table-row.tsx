import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Checkbox } from '@/components/ui/checkbox';
import { TableCell, TableRow } from '@/components/ui/table';
import { useUIState } from '@/hooks/use-ui-state';
import { getThumbnailURL } from '@/lib/get-thumbnail-url';
import { cn } from '@/lib/utils';
import type { ImageMetadata } from '@/types';
import { ImageActions } from '../image-actions';

interface ImageTableRowProps {

  className?: string;

  image: ImageMetadata;  

  isSelected?: boolean;

  onSelect?(selected: boolean): void;
  
}

export const ImageTableRow = (props: ImageTableRowProps) => {

  const { image } = props;

  const setCurrentPreview = useUIState(state => state.setCurrentPreview);

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
  
  return (
    <TableRow  
      {...listeners} 
      {...attributes}  
      ref={setNodeRef}
      style={style} 
      data-state={props.isSelected ? 'selected' : undefined}
      className={cn(
        'animate-fade-in cursor-grab active:cursor-grabbing',
        isDragging ? 'opacity-0' : undefined,
        props.className
      )}>
      <TableCell className="w-10 text-center">
        <Checkbox
          checked={props.isSelected}
          onCheckedChange={checked => props.onSelect?.(checked as boolean)}
          aria-label={`Select ${image.filename}`}
          className="rounded border bg-muted/30 border-slate-300 size-4.5 data-[state=checked]:bg-green-600 data-[state=checked]:text-green-100 data-[state=checked]:border-green-600" />
      </TableCell>

      <TableCell className="p-3 w-18 flex justify-center">
        <div className="w-12 h-12 rounded shadow-xs overflow-hidden bg-muted">
          <img
            src={getThumbnailURL(image, 96, 96)}
            alt={image.filename}
            className="w-full h-full object-cover pointer-events-none" />
        </div>
      </TableCell>

      <TableCell className="p-4">{image.filename}</TableCell>

      <TableCell className="text-muted-foreground">
        {image.width.toLocaleString()} × {image.height.toLocaleString()}
      </TableCell>

      <TableCell className="text-muted-foreground">
        <ImageActions 
          image={image} 
          onPreview={() => setCurrentPreview(props.image)} />
      </TableCell>
    </TableRow>
  )

}