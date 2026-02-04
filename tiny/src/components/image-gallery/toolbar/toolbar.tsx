import { useCallback } from 'react';
import type Uppy from '@uppy/core';
import { useDirectory } from '@/hooks/use-directory';
import { ViewModeToggle } from './toggle-view-mode/view-mode-toggle';
import { UploadButton } from './button-upload/upload-button';
import { NewManifestButton } from './button-new-manifest';
import { DeleteSelectedButton } from './button-delete-selected/delete-selected-button';
import { SelectAllButton } from './button-select-all';
import { NavBreadcrumbs } from './nav-breadcrumbs';
import { useUIState } from '@/hooks/use-ui-state';
import { isSubDirectory } from '@/types';
import { CopyURLButton } from './button-copy-url';
import { ManifestOptionsButton } from './button-manifest-options';

interface ToolbarProps {

  uppy: Uppy;

}

export const Toolbar = (props: ToolbarProps) => {

  const { images } = useDirectory();

  const currentDirectory = useUIState(state => state.currentDirectory);

  const isRoot = !isSubDirectory(currentDirectory);

  const onUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    files.forEach(file => {
      props.uppy.addFile(file);
    });
  }, [props.uppy]);
  
  return (
    <div className="pl-4 md:h-16 border-b border-border bg-card flex flex-col md:flex-row justify-between md:items-center gap-1.5 py-1 px-2.5">
      <div className="flex items-center gap-1.5">
        <NavBreadcrumbs />

        {isRoot ? (
          <NewManifestButton />
        ) : (
          <ManifestOptionsButton />
        )}
      </div>

      <div className="flex flex-row items-center gap-2 pb-1.5 md:pb-0">
        <DeleteSelectedButton />

        <SelectAllButton 
          images={images} />
          
        <UploadButton 
          onUpload={onUpload} />

        <ViewModeToggle />
      </div>
    </div>
  )

}