import { useCallback } from 'react';
import type Uppy from '@uppy/core';
import { useDirectory } from '@/hooks/use-directory';
import { ViewModeToggle } from './toggle-view-mode/view-mode-toggle';
import { UploadButton } from './upload/upload-button';
import { CreateManifestButton } from './create-manifest';
import { DeleteSelectedButton } from './delete-selected';
import { SelectAllButton } from './select-all';
import { NavBreadcrumbs } from './nav-breadcrumbs';
import { useUIState } from '@/hooks/use-ui-state';
import { isManifest, isRootFolder } from '@/types';
import { ManifestActions } from '../manifest-actions';

interface ToolbarProps {

  uppy: Uppy;

}

export const Toolbar = (props: ToolbarProps) => {

  const { images } = useDirectory();

  const currentDirectory = useUIState(state => state.currentDirectory);

  const onUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    files.forEach(file => {
      props.uppy.addFile(file);
    });
  }, [props.uppy]);
  
  return (
    <div className="shrink-0 pl-4 h-16 border-b border-border bg-card flex flex-col md:flex-row justify-between md:items-center gap-1.5 py-1 px-2.5">
      <div className="flex items-center gap-1.5">
        <NavBreadcrumbs />

        {!currentDirectory ? (
          <CreateManifestButton />
        ) : isManifest(currentDirectory) ? (
          <ManifestActions 
            manifest={currentDirectory} />
        ) : null}
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