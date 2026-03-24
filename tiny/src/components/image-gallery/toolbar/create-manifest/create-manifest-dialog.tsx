import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useManifests } from '@/hooks/use-manifest-metadata';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CreateManifestDialogProps {

  open: boolean;

  onClose(): void;

}

export const CreateManifestDialog = (props: CreateManifestDialogProps) => {

  const [name, setName] = useState('');

  const { createManifest } = useManifests();
  
  useEffect(() => {
    setName('');
  }, [props.open]);
  
  const onOpenChange = (open: boolean) => {
    if (!open) props.onClose();
  }

  const onSave = (e: React.SubmitEvent) => {
    e.preventDefault();
    createManifest(name).then(() => props.onClose());
  }

  return (
    <Dialog open={props.open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Manifest</DialogTitle>
          <DialogDescription>
            Create a new IIIF Manifest
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={onSave}  className="my-4 grid gap-2">
          <Label htmlFor="name">Name</Label>

          <Input
            id="name"
            autoComplete="off"
            value={name}
            onChange={evt => setName(evt.target.value)} />
              
          <DialogFooter>
            <Button 
              type="button"
              variant="ghost"
              onClick={() => props.onClose()}>Cancel</Button>

            <Button 
              type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}