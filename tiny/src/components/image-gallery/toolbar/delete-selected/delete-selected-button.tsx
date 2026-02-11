import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIState } from '@/hooks/use-ui-state';
import { useImages } from '@/hooks/use-images';

export const DeleteSelectedButton = () => {

  const { deleteImages } = useImages();

  const selected = useUIState(state => state.selectedImageIds);
  const setSelected = useUIState(state => state.setSelectedImageIds);

  const onDelete = () => {
    deleteImages([...selected]);
    setSelected([]);
  }

  return selected.length > 0 ? (
    <Button
      variant="destructive"
      onClick={onDelete}>
      <Trash2 className="size-4" />
      Delete {selected.length} Image{selected.length > 1 && 's'}
    </Button>
  ) : null;
  
}