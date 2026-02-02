import { useState, useEffect } from 'react'
import type { ImageFile } from '@/types'
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

interface MetadataDialogProps {
  image: ImageFile | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MetadataDialog({ image, open, onOpenChange }: MetadataDialogProps) {
  const { uploadImages } = useImages();
  const [name, setName] = useState('')
  
  useEffect(() => {
    if (image) {
      setName(image.name)
    }
  }, [image])
  
  const handleSave = () => {
    if (image && name.trim()) {
      // uploadImages(image.id);
      onOpenChange(false)
    }
  }

  if (!image) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Image Metadata</DialogTitle>
          <DialogDescription>View and edit image information.</DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4">
          <div className="aspect-video relative rounded-lg overflow-hidden bg-muted">
            <img
              src={image.url || "/placeholder.svg"}
              alt={image.name}
              className="object-contain"
              sizes="(max-width: 500px) 100vw, 500px"
            />
          </div>
          
          <div className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Image name"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-muted-foreground">Dimensions</Label>
                <p className="mt-1">{image.width} x {image.height} px</p>
              </div>
              <div>
                <Label className="text-muted-foreground">File Size</Label>
                <p className="mt-1">{(image.size / 1024).toFixed(1)} KB</p>
              </div>
              <div className="col-span-2">
                <Label className="text-muted-foreground">Uploaded</Label>
                <p className="mt-1">
                  {new Date(image.uploadedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}