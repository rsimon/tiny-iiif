import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useManifests } from '@/hooks/use-manifests';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface NewManifestDialogProps {

  open: boolean;

  onClose(): void;

}

export const NewManifestDialog = (props: NewManifestDialogProps) => {

  const [name, setName] = useState('');

  const { createManifest } = useManifests();
  
  const onSave = () =>
    createManifest(name).then(() => props.onClose());

  return (
    <Dialog open={props.open} onOpenChange={open => { if (!open) props.onClose() }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Manifest</DialogTitle>
          <DialogDescription>
            Create a new IIIF Manifest
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-4 grid gap-2">
          <Label htmlFor="name">Name</Label>

          <Input
            id="name"
            autoComplete="off"
            value={name}
            onChange={evt => setName(evt.target.value)} />
        </div>
            
        <DialogFooter>
          <Button variant="secondary" onClick={() => props.onClose()}>Cancel</Button>
          <Button onClick={onSave}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}