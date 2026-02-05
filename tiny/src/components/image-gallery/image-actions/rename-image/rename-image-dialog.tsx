import { useEffect, useState } from 'react';
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

  useEffect(() => {
    setName(props.image.filename);
  }, [props.open, props.image.filename]);

  const onRename = (e: React.FormEvent) => {
    e.preventDefault();

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
        className="p-5 gap-6 max-w-md sm:max-w-md"
        onPointerDown={e => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Rename Image</DialogTitle>
          <DialogDescription className="sr-only">
            Set a new filename for the image.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onRename} className="grid w-full gap-6">
          <Input 
            value={name} 
            onChange={e => setName(e.target.value)} />

          <DialogFooter>
            <Button 
              type="button"
              variant="ghost" 
              onClick={() => props.onOpenChange(false)}>Cancel</Button>

            <Button 
              type="submit">Rename</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )

}