import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useImages } from '@/lib/hooks'

interface NewManifestDialogProps {

  open: boolean;

  onClose(): void;

}

export const NewManifestDialog = (props: NewManifestDialogProps) => {

  const [name, setName] = useState('');
  
  const onSave = () => {
    
  }

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
            value={name}
            onChange={evt => setName(evt.target.value)}
          />
        </div>
            
        <DialogFooter>
          <Button variant="secondary" onClick={() => props.onClose()}>Cancel</Button>
          <Button onClick={onSave}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}