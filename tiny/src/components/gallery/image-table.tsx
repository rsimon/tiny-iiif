import { useState } from 'react'
import { MoreVertical, ArrowUpDown } from 'lucide-react'
import { useImageStore } from '@/lib/store_old'
import type { ImageFile } from '@/types'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Input } from '@/components/ui/input'
import { useImages } from '@/lib/hooks'

interface ImageTableProps {
  onEditMetadata: (image: ImageFile) => void
}

type SortField = 'name' | 'size' | 'uploadedAt'
type SortDirection = 'asc' | 'desc'

export function ImageTable({ onEditMetadata }: ImageTableProps) {
  const { 
    images, 
    currentFolderId, 
    selectedImages, 
    toggleImageSelection, 
    selectAllImages,
    clearSelection 
  } = useImageStore();

  const { deleteImage } = useImages();
  
  const [sortField, setSortField] = useState<SortField>('uploadedAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [renameImage, setRenameImage] = useState<ImageFile | null>(null)
  const [newName, setNewName] = useState('')
  
  const filteredImages = images.filter(img => 
    currentFolderId === 'root' || img.folderId === currentFolderId
  )
  
  const sortedImages = [...filteredImages].sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1
    
    switch (sortField) {
      case 'name':
        return a.name.localeCompare(b.name) * direction
      case 'size':
        return (a.width * a.height - b.width * b.height) * direction
      case 'uploadedAt':
        return (new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()) * direction
      default:
        return 0
    }
  })
  
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }
  
  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/images/${id}`, { method: 'DELETE' })
      deleteImage(id)
    } catch (error) {
      console.error('Failed to delete image:', error)
    }
  }
  
  const handleRename = () => {
    if (renameImage && newName.trim() && newName !== renameImage.name) {
      // updateImage(renameImage.id, { name: newName.trim() })
    }
    setShowRenameDialog(false)
    setRenameImage(null)
  }
  
  const openRenameDialog = (image: ImageFile) => {
    setRenameImage(image)
    setNewName(image.name)
    setShowRenameDialog(true)
  }
  
  const allSelected = filteredImages.length > 0 && filteredImages.every(img => selectedImages.has(img.id))
  const someSelected = filteredImages.some(img => selectedImages.has(img.id))
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
    <>
      <div className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={() => {
                    if (allSelected) {
                      clearSelection()
                    } else {
                      selectAllImages()
                    }
                  }}
                  aria-label="Select all"
                  className={someSelected && !allSelected ? 'data-[state=checked]:bg-primary/50' : ''}
                />
              </TableHead>
              <TableHead className="w-16">Preview</TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-1 -ml-3 font-medium"
                  onClick={() => handleSort('name')}
                >
                  Name
                  <ArrowUpDown className="size-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-1 -ml-3 font-medium"
                  onClick={() => handleSort('size')}
                >
                  Size
                  <ArrowUpDown className="size-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-1 -ml-3 font-medium"
                  onClick={() => handleSort('uploadedAt')}
                >
                  Uploaded
                  <ArrowUpDown className="size-3" />
                </Button>
              </TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedImages.map(image => (
              <TableRow 
                key={image.id}
                data-state={selectedImages.has(image.id) ? 'selected' : undefined}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedImages.has(image.id)}
                    onCheckedChange={() => toggleImageSelection(image.id)}
                    aria-label={`Select ${image.name}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="size-10 relative rounded overflow-hidden bg-muted">
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.name}
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{image.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {image.width} x {image.height}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(image.uploadedAt)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openRenameDialog(image)}>
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEditMetadata(image)}>
                        Edit Metadata
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDelete(image.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
    </>
  )
}