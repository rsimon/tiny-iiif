import { SquareCheckBig } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIState } from '@/hooks/use-ui-state';
import type { ImageMetadata } from '@/types';

interface SelectAllButtonProps {

    images: ImageMetadata[];

  }

export const SelectAllButton = (props: SelectAllButtonProps) => {

  const selectedImageIds = useUIState(state => state.selectedImageIds);
  const setSelectedImageIds = useUIState(state => state.setSelectedImageIds);

  const onSelectAll = () => {
    if (selectedImageIds.size === props.images.length)
      setSelectedImageIds([]);
    else 
      setSelectedImageIds(props.images.map(i => i.id));
  }

  return (
    <Button 
      variant="ghost"
      onClick={onSelectAll}>
      <SquareCheckBig className="size-4" />
      Select All
    </Button>
  )

}