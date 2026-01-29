import { useCallback } from 'react';
import type Uppy from '@uppy/core';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useDirectory } from '@/hooks/use-directory';
import { ViewModeToggle } from './toggle-view-mode/view-mode-toggle';
import { UploadButton } from './button-upload/upload-button';
import { NewManifestButton } from './button-new-manifest';
import { DeleteSelectedButton } from './button-delete-selected/delete-selected-button';
import { SelectAllButton } from './button-select-all';
import { NavBreadcrumbs } from './nav-breadcrumbs';

interface ToolbarProps {

  uppy: Uppy;

}

export const Toolbar = (props: ToolbarProps) => {

  const { images } = useDirectory();

  const onUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    files.forEach(file => {
      props.uppy.addFile(file);
    });
  }, [props.uppy]);
  
  return (
    <div className="md:h-16 border-b border-border bg-card flex flex-col md:flex-row md:items-center gap-1.5 py-1 px-2.5">
      <div className="flex items-center gap-1.5">
        <SidebarTrigger className="mb-px" />
        <NavBreadcrumbs />
      </div>

      <div className="flex flex-row grow items-center justify-between pb-1.5 md:pb-0">
        <div className="flex items-center gap-2">
          <NewManifestButton />
          <UploadButton 
            onUpload={onUpload} />
          <SelectAllButton 
            images={images} />
          <DeleteSelectedButton />
        </div>
        
        <ViewModeToggle />
      </div>
    </div>
  )

}