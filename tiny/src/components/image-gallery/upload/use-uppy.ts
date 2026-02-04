import { useEffect, useRef, useState } from 'react';
import Uppy from '@uppy/core';
import DropTarget from '@uppy/drop-target';
import XHRUpload from '@uppy/xhr-upload';
import { useDirectory } from '@/hooks/use-directory';
import { useUIState } from '@/hooks/use-ui-state';
import { isManifest, isRootFolder, isSubFolder } from '@/types';

export const useUppy= () => {

  const targetRef = useRef<HTMLDivElement>(null);

  const currentDirectory = useUIState(state => state.currentDirectory);

  const [ isDragOver, setIsDragOver ] = useState(false);

  const { refreshDirectory } = useDirectory();

  const [ uppy, setUppy ] = useState<Uppy>();

  useEffect(() => {
    if (!targetRef.current) return;

    const manifest = isSubFolder(currentDirectory) ? currentDirectory.id : undefined;

    const uppy = new Uppy({
      autoProceed: true,
      meta: {
        manifest
      }
    });

    uppy.use(DropTarget, {
      target: targetRef.current,
      onDragOver: () => setIsDragOver(true),
      onDragLeave: () => setIsDragOver(false),
      onDrop: () => setIsDragOver(false)
    });

    uppy.use(XHRUpload, {
      endpoint: '/tiny/api/images',
      formData: true,
      fieldName: 'file',
      limit: 1
    });

    uppy.on('upload-success', refreshDirectory);

    // TODO error feedback!

    setUppy(uppy);

    return () => {
      uppy.destroy();
    };
  }, [currentDirectory]);

  return { uppy, targetRef, isDragOver };

}