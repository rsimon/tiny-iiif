import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from "@/components/ui/sonner"
import { useUIState } from '@/hooks/use-ui-state';
import { Toolbar } from './toolbar';
import { ImageGrid } from './image-grid';
import { ImageTable } from './image-table';
import { IIIFPreview } from './iiif-preview';
import { UploadDropzone, useUppy } from './upload';
import { useDirectory } from '@/hooks/use-directory';
import { Blocks } from 'lucide-react';

export const ImageGallery = () => {
  const viewMode = useUIState(state => state.viewMode);
  
  const currentPreview = useUIState(state => state.currentPreview);
  const setCurrentPreview = useUIState(state => state.setCurrentPreview);

  const { isEmpty } = useDirectory();

  const { isDragOver: isFilesOverTarget, targetRef, uppy } = useUppy();

  return (
    <SidebarProvider className="w-auto overflow-hidden">
      <TooltipProvider>
        <div className="h-screen grow flex flex-col bg-background">
          <AppHeader />

          <div className="flex-1 flex min-h-0">
            <AppSidebar />

            <SidebarInset>
              <main className="grow flex flex-col min-h-0 bg-muted">  
                <Toaster position="top-center" offset={6} />
                
                <Toolbar uppy={uppy} />

                <UploadDropzone 
                  className="grow overflow-hidden"
                  targetRef={targetRef}
                  showOverlay={isFilesOverTarget}>
                  <div className="-top-full h-full p-4 overflow-y-auto">
                    {isEmpty ? (
                      <div className="h-full w-full flex items-center justify-center">
                        <Blocks
                          className="size-24 -rotate-4 text-slate-500/10" 
                          strokeWidth={1}/>
                      </div>
                    ) : viewMode === 'grid' ? (
                      <ImageGrid />
                    ) : (
                      <ImageTable />
                    )}
                  </div>
                </UploadDropzone>
              </main>
            </SidebarInset>
          </div>
        </div>

        <IIIFPreview
          image={currentPreview} 
          onClose={() => setCurrentPreview(undefined)} />
      </TooltipProvider>
    </SidebarProvider>
  )

}