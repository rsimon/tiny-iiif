import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useImages } from '@/hooks/use-images';
import { useUIState } from '@/hooks/use-ui-state';
import { Toolbar } from './toolbar';
import { ImageGrid } from './image-grid';
import { ImageTable } from './image-table';
import { IIIFPreview } from './iiif-preview';
import { UploadDropzone, useUppy } from './upload';

export const ImageGallery = () => {

  const { images } = useImages();

  const viewMode = useUIState(state => state.viewMode);
  
  const currentPreview = useUIState(state => state.currentPreview);
  const setCurrentPreview = useUIState(state => state.setCurrentPreview);

  const { isDragOver: isFilesOverTarget, targetRef, uppy } = useUppy();

  return (
    <SidebarProvider className="w-auto overflow-hidden">
      <div className="h-screen grow flex flex-col bg-background">
        <AppHeader />

        <div className="flex-1 flex min-h-0">
          <AppSidebar />

          <SidebarInset>
            <main className="grow flex flex-col min-h-0 bg-muted">  
              <Toolbar 
                images={images}
                uppy={uppy} />

              <UploadDropzone 
                className="grow overflow-hidden"
                targetRef={targetRef}
                showOverlay={isFilesOverTarget}>
                <div className="-top-full h-full p-6 overflow-y-auto">
                  {viewMode === 'grid' ? (
                    <ImageGrid images={images} />
                  ) : (
                    <ImageTable images={images} />
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
    </SidebarProvider>
  )

}