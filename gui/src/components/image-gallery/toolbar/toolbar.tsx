import { useCallback } from 'react';
import type Uppy from '@uppy/core';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { ImageMetadata } from '@/types';
import { ViewModeToggle } from './toggle-view-mode/view-mode-toggle';
import { UploadButton } from './button-upload/upload-button';
import { NewManifestButton } from './button-new-manifest';
import { DeleteSelectedButton } from './button-delete-selected/delete-selected-button';
import { SelectAllButton } from './button-select-all';

interface ToolbarProps {

  images: ImageMetadata[];

  uppy: Uppy;

}

export const Toolbar = (props: ToolbarProps) => {

  const onUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    files.forEach(file => {
      props.uppy.addFile(file);
    });
  }, [props.uppy]);
  
  return (
    <div className="h-16 border-b border-border bg-card flex items-center justify-between px-2.5">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="mb-px" />

        <nav className="text-slate-700 mr-8 text-sm font">
          All Images
        </nav>

        <NewManifestButton />

        <UploadButton 
          onUpload={onUpload} />

        <SelectAllButton 
          images={props.images} />

        <DeleteSelectedButton />
      </div>

      <ViewModeToggle />
    </div>
  )

}