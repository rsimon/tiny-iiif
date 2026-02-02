import React from 'react';
import { useState } from 'react'
import { MoreVertical, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useImageStore } from '@/lib/store_old'
import type { ImageFile } from '@/types'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input';
import { useDragAndDrop, useImages } from '@/lib/hooks';
import { IIIFPreview } from './iiif-preview';

interface ImageCardProps {
  image: ImageFile
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
  onEditMetadata: () => void
  onDragStart: (e: React.DragEvent, imageId: string) => void
  onDragEnd: () => void
  isDragging: boolean
}

function ImageCard({ image, isSelected, onSelect, onDelete, onEditMetadata, onDragStart, onDragEnd, isDragging }: ImageCardProps) {
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [newName, setNewName] = useState(image.name)
  const [showPreview, setShowPreview] = useState(false)
  
  const handleRename = () => {
    if (newName.trim() && newName !== image.name) {

    }
    setShowRenameDialog(false)
  }

  return (
    <>
      <div 
        className={cn(
          'group relative bg-card rounded-lg overflow-hidden border transition-all cursor-pointer',
          isSelected ? 'ring-2 ring-primary border-primary' : 'border-border hover:border-primary/50',
          isDragging && 'opacity-50 scale-95'
        )}
        onClick={onSelect}
        draggable
        onDragStart={(e) => onDragStart(e, image.id)}
        onDragEnd={onDragEnd}
      >
        <div className="aspect-4/3 relative bg-muted">
          <img
            src={image.url || "/placeholder.svg"}
            alt={image.name}
            className="object-cover w-full h-full"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            onClick={(e) => {
              e.stopPropagation()
              setShowPreview(true)
            }}
          />
          
          {/* Selection checkbox */}
          <div 
            className={cn(
              'absolute top-2 left-2 size-5 rounded border-2 flex items-center justify-center transition-all',
              isSelected 
                ? 'bg-primary border-primary text-primary-foreground' 
                : 'bg-white/80 border-white/80 opacity-0 group-hover:opacity-100'
            )}
          >
            {isSelected && <Check className="size-3" />}
          </div>
        </div>
        
        <div className="p-2 flex items-center justify-between">
          <span className="text-sm truncate flex-1">{image.name}</span>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon-sm" className="size-7 opacity-0 group-hover:opacity-100">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {
                setNewName(image.name)
                setShowRenameDialog(true)
              }}>
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEditMetadata}>
                Edit Metadata
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive"
                onClick={onDelete}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename image</DialogTitle>
            <DialogDescription>Enter a new name for this image.</DialogDescription>
          </DialogHeader>
          <Input 
            value={newName} 
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Image name"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenameDialog(false)}>Cancel</Button>
            <Button onClick={handleRename}>Rename</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <IIIFPreview
        image={image}
        open={showPreview}
        onOpenChange={setShowPreview}
      />
    </>
  )
}

interface ImageGridProps {
  onEditMetadata: (image: ImageFile) => void
}

export function ImageGrid({ onEditMetadata }: ImageGridProps) {
  const { 
    images, 
    currentFolderId, 
    selectedImages, 
    toggleImageSelection,
    setDraggingImageIds 
  } = useImageStore();

  const { deleteImage } = useImages();

  const { draggingImageIds } = useDragAndDrop();
  
  const handleDragStart = (e: React.DragEvent, imageId: string) => {
    // If the dragged image is selected, drag all selected images
    // Otherwise, just drag the single image
    const imagesToDrag = selectedImages.has(imageId) 
      ? Array.from(selectedImages) 
      : [imageId]
    
    setDraggingImageIds(imagesToDrag)
    
    // Set drag data for the sidebar to read
    e.dataTransfer.setData('application/x-image-ids', JSON.stringify(imagesToDrag))
    e.dataTransfer.effectAllowed = 'move'
    
    // Create a custom drag image showing the count
    if (imagesToDrag.length > 1) {
      const dragPreview = document.createElement('div')
      dragPreview.className = 'bg-primary text-primary-foreground px-3 py-2 rounded-lg text-sm font-medium shadow-lg'
      dragPreview.textContent = `${imagesToDrag.length} images`
      dragPreview.style.position = 'absolute'
      dragPreview.style.top = '-1000px'
      document.body.appendChild(dragPreview)
      e.dataTransfer.setDragImage(dragPreview, 0, 0)
      setTimeout(() => document.body.removeChild(dragPreview), 0)
    }
  }
  
  const handleDragEnd = () => {
    setDraggingImageIds([])
  }
  
  const filteredImages = images.filter(img => 
    currentFolderId === 'root' || img.folderId === currentFolderId
  )
  
  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/images/${id}`, { method: 'DELETE' })
      deleteImage(id)
    } catch (error) {
      console.error('Failed to delete image:', error)
    }
  }

  if (filteredImages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p className="text-lg">No images yet</p>
          <p className="text-sm">Drop images here to upload</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
      {filteredImages.map(image => (
        <ImageCard
          key={image.id}
          image={image}
          isSelected={selectedImages.has(image.id)}
          onSelect={() => toggleImageSelection(image.id)}
          onDelete={() => handleDelete(image.id)}
          onEditMetadata={() => onEditMetadata(image)}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          isDragging={draggingImageIds.includes(image.id)}
        />
      ))}
    </div>
  )
}
