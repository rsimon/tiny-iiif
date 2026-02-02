import React from 'react';
import { useState, useRef, useCallback } from 'react';
import { useImageStore } from '@/lib/store_old';
import type { ImageFile } from '@/types';
import { AppHeader } from '../layout/app-header';
import { Toolbar } from './toolbar';
import { ImageGrid } from './image-grid'
import { ImageTable } from './image-table'
import { DropZone } from './drop-zone'
import { MetadataDialog } from './metadata-dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useImages, useToast } from '@/lib/hooks';
import { SidebarInset, SidebarProvider } from '../ui/sidebar';
import { AppSidebar } from '../layout/app-sidebar';

export function Gallery() {
  const { viewMode, selectedImages } = useImageStore();
  const { deleteSelectedImages, uploadImages } = useImages();
  const [metadataImage, setMetadataImage] = useState<ImageFile | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast();
  
  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])
  
  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    const imageFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    )
    
    if (imageFiles.length === 0) {
      toast?.({
        title: "No images selected",
        description: "Please select image files to upload.",
        variant: "destructive"
      })
      return
    }
    
    setIsUploading(true)
    
    try {
      const result = await uploadImages(imageFiles)
      
      toast?.({
        title: "Upload successful",
        description: `Uploaded ${result.count} image${result.count !== 1 ? 's' : ''}`,
      })
    } catch (error) {
      toast?.({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload images",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }, [uploadImages, toast])
  
  const handleBulkDelete = useCallback(() => {
    if (selectedImages.size === 0) return
    setShowDeleteDialog(true)
  }, [selectedImages])
  
  const confirmBulkDelete = useCallback(async () => {
    try {
      const result = await deleteSelectedImages()
      
      toast?.({
        title: "Images deleted",
        description: `Deleted ${result?.deletedCount || 0} image${result?.deletedCount !== 1 ? 's' : ''}`,
      })
    } catch (error) {
      toast?.({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Failed to delete images",
        variant: "destructive"
      })
    } finally {
      setShowDeleteDialog(false)
    }
  }, [deleteSelectedImages, toast])

  return (
    <SidebarProvider className="w-auto">
      <div className="h-screen grow flex flex-col bg-background">
        <AppHeader />
        
        <div className="flex-1 flex min-h-0">
          <AppSidebar />

          <SidebarInset>
            <main className="grow flex flex-col min-h-0 bg-muted">            
              <Toolbar 
                onUploadClick={handleUploadClick}
                onBulkDelete={handleBulkDelete}
                isUploading={isUploading}
                hasSelection={selectedImages.size > 0}
              />
              
              <DropZone>
                {viewMode === 'grid' ? (
                  <ImageGrid onEditMetadata={setMetadataImage} />
                ) : (
                  <ImageTable onEditMetadata={setMetadataImage} />
                )}
              </DropZone>
            </main>
          </SidebarInset>
        </div>
        
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
          disabled={isUploading}
        />
        
        {/* Metadata dialog */}
        <MetadataDialog
          image={metadataImage}
          open={!!metadataImage}
          onOpenChange={(open) => !open && setMetadataImage(null)}
        />
        
        {/* Bulk delete confirmation */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {selectedImages.size} images?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the selected images. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmBulkDelete}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </SidebarProvider>
  )
}