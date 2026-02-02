import React from "react"
import { useState, useCallback, useRef } from 'react'
import { Upload, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useImageStore } from '@/lib/store_old'
import { useImages, useToast } from "@/lib/hooks";

interface DropZoneProps {

  children: React.ReactNode

  targetFolderId?: string
  
}

export function DropZone({ children, targetFolderId }: DropZoneProps) {
  const { currentFolderId, isDragging, setIsDragging } = useImageStore()
  const { uploadImages } = useImages()
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const dragCounter = useRef(0)
  
  const folderId = targetFolderId || currentFolderId

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current++
    
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragging(true)
    }
  }, [setIsDragging])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current--
    
    if (dragCounter.current === 0) {
      setIsDragging(false)
    }
  }, [setIsDragging])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const processFiles = useCallback(async (files: FileList) => {
    const imageFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    )
    
    if (imageFiles.length === 0) {
      toast({
        title: 'No images selected',
        description: 'Please select image files to upload.',
        variant: 'destructive'
      })
      return
    }

    console.log('uploading');
    
    setIsUploading(true)
    setUploadProgress(0)
    
    try {
      // Use the bulk upload API
      const result = await uploadImages(imageFiles)
      
      setUploadProgress(100)
      
      toast({
        title: 'Upload successful',
        description: `Uploaded ${result.count} image${result.count !== 1 ? 's' : ''}`,
        variant: 'success'
      })
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload images',
        variant: 'destructive'
      })
    } finally {
      // Small delay to show 100% before hiding
      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
      }, 500)
    }
  }, [uploadImages, toast])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current = 0
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    await processFiles(files)
  }, [setIsDragging, processFiles])

  return (
    <div 
      className="relative flex-1 flex flex-col min-h-0"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Main content */}
      <div className={cn(
        'flex-1 flex flex-col min-h-0 transition-all duration-200',
        isDragging && 'blur-sm scale-[0.99]'
      )}>
        {children}
      </div>
      
      {/* Drag overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm border-2 border-dashed border-primary rounded-lg z-50 flex items-center justify-center">
          <div className="text-center p-8 rounded-lg bg-card/90 shadow-lg">
            <div className="size-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
              <Upload className="size-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Drop images to upload</h3>
            <p className="text-sm text-muted-foreground">
              Release to upload to the current folder
            </p>
          </div>
        </div>
      )}
      
      {/* Upload progress overlay */}
      {isUploading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center p-8 rounded-lg bg-card shadow-lg min-w-64">
            <div className="size-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
              <ImageIcon className="size-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-3">Uploading images...</h3>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {uploadProgress === 100 ? 'Processing...' : `${Math.round(uploadProgress)}%`}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}