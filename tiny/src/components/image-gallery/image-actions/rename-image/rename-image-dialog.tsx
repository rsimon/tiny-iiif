import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ImageMetadata } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { useImages } from '@/hooks/use-images';

interface RenameImageDialogProps {

  image: ImageMetadata;

  open: boolean;

  onOpenChange(open: boolean): void;

}

export const RenameImageDialog = (props: RenameImageDialogProps) => {

  const [name, setName] = useState(props.image.filename || '');

  const { renameImageAsync } = useImages();

  const onRename = () => {
    if (!name) {
      toast.error('Name cannot be empty');
      return;
    }

    if (name === props.image.filename) {
      return;
    }

    renameImageAsync(props.image.id, name).then(() => {
      props.onOpenChange(false);
      toast.success('Image renamed successfully');
    }).catch(() => {
      toast.error('Failed to rename image');
    });

    props.onOpenChange(false);
  }

  return (
    <Dialog 
      open={props.open} 
      onOpenChange={props.onOpenChange}>
      
      <DialogContent 
        className="p-5 gap-6 max-w-md sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rename Image</DialogTitle>
          <DialogDescription className="sr-only">
            Set a new filename for the image.
          </DialogDescription>
        </DialogHeader>

        <Input 
          value={name} 
          onChange={e => setName(e.target.value)} />

        <DialogFooter>
          <Button 
            variant="ghost" 
            onClick={() => props.onOpenChange(false)}>Cancel</Button>

          <Button onClick={onRename}>Rename</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

}