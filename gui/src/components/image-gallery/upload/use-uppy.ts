import { useEffect, useRef, useState } from 'react';
import Uppy from '@uppy/core';
import DropTarget from '@uppy/drop-target';
import XHRUpload from '@uppy/xhr-upload';
import { useImages } from '@/hooks/use-images';

export const useUppy= () => {

  const targetRef = useRef<HTMLDivElement>(null);

  const [ isDragOver, setIsDragOver ] = useState(false);

  const { refreshImages } = useImages();

  const [ uppy, setUppy ] = useState<Uppy>();

  useEffect(() => {
    if (!targetRef.current) return;

    const uppy = new Uppy({
      autoProceed: true
    });

    uppy.use(DropTarget, {
      target: targetRef.current,
      onDragOver: () => setIsDragOver(true),
      onDragLeave: () => setIsDragOver(false),
      onDrop: () => setIsDragOver(false)
    });

    uppy.use(XHRUpload, {
      endpoint: '/api/images',
      formData: true,
      fieldName: 'file',
      limit: 1
    });

    uppy.on('upload-success', refreshImages);

    setUppy(uppy);

    return () => {
      uppy.destroy();
    };
  }, []);

  return { uppy, targetRef, isDragOver };

}