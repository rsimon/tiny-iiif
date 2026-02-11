import { Blocks } from 'lucide-react';
import { DndContext, pointerWithin } from '@dnd-kit/core';
import { AppHeader } from '@/components/shared/app-header';
import { AppSidebar } from '@/components/shared/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { useDirectory } from '@/hooks/use-directory';
import { measureAlways, useImageSorting } from '@/hooks/use-image-sorting';
import { useUIState } from '@/hooks/use-ui-state';
import { ImageGrid } from './image-grid';
import { ImageTable } from './image-table';
import { IIIFPreview } from './iiif-preview';
import { Toolbar } from './toolbar';
import { UploadDropzone, useUppy } from './upload';

export const ImageGallery = () => {
  const viewMode = useUIState(state => state.viewMode);
  
  const { folders } = useDirectory();

  const currentPreview = useUIState(state => state.currentPreview);
  const setCurrentPreview = useUIState(state => state.setCurrentPreview);

  const { isEmpty } = useDirectory();

  const { isDragOver: isFilesOverTarget, targetRef, uppy } = useUppy();

  const { sensors, sortedImages, onDragStart, onDragEnd, onDragCancel } = useImageSorting();

  return (
    <TooltipProvider>
      <div className="h-screen grow flex flex-col bg-background">
        <AppHeader />

        <div className="flex-1 flex min-h-0 relative">
          <SidebarProvider className="w-full min-h-full">
            <AppSidebar />

            <SidebarInset>
              <main className="grow flex flex-col min-h-0 bg-muted">  
                <Toaster position="bottom-center" />
                
                <Toolbar uppy={uppy} />

                <UploadDropzone 
                  className="grow overflow-hidden"
                  targetRef={targetRef}
                  showOverlay={isFilesOverTarget}>

                  <DndContext
                    collisionDetection={pointerWithin}
                    measuring={measureAlways}
                    sensors={sensors}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onDragCancel={onDragCancel}>
                    <div className="-top-full h-full p-4 overflow-y-auto">
                      {isEmpty ? (
                        <div className="h-full w-full flex items-center justify-center">
                          <Blocks
                            className="size-24 -rotate-4 text-slate-500/10" 
                            strokeWidth={1}/>
                        </div>
                      ) : viewMode === 'grid' ? (
                        <ImageGrid 
                          folders={folders} 
                          images={sortedImages} />
                      ) : (
                        <ImageTable 
                          folders={folders}
                          images={sortedImages} />
                      )}
                    </div>
                  </DndContext>
                </UploadDropzone>
              </main>
            </SidebarInset>
          </SidebarProvider>
        </div>
      </div>

      <IIIFPreview
        image={currentPreview} 
        onClose={() => setCurrentPreview(undefined)} />
    </TooltipProvider>
  )

}