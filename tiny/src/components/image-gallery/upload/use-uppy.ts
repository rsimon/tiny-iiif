import { useEffect, useRef, useState } from 'react';
import Uppy from '@uppy/core';
import DropTarget from '@uppy/drop-target';
import XHRUpload from '@uppy/xhr-upload';
import { useDirectory } from '@/hooks/use-directory';
import { useUIState } from '@/hooks/use-ui-state';
import { isSubFolder } from '@/types';

export const useUppy= () => {

  const targetRef = useRef<HTMLDivElement>(null);

  const currentDirectory = useUIState(state => state.currentDirectory);

  const [ isDragOver, setIsDragOver ] = useState(false);

  const { refreshDirectory } = useDirectory();

  const [ uppy ] = useState<Uppy>(new Uppy({ autoProceed: true }));

  useEffect(() => {
    if (!targetRef.current || !uppy) return;

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

    uppy.on('complete', () => {
      uppy.cancelAll();
      refreshDirectory();
    });

    // TODO error feedback!
    uppy.on('error', e => {
      uppy.cancelAll();
      console.error('Uppy error', e);
    });

    return () => {
      uppy.destroy();
    };
  }, []);

  useEffect(() => {
    const manifest = isSubFolder(currentDirectory) ? currentDirectory.id : undefined;
    uppy.setOptions({
      meta: { manifest }
    });
  }, [currentDirectory]);

  return { uppy, targetRef, isDragOver };

}