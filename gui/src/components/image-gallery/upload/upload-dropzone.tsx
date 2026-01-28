import { useEffect, useRef, useState, type ReactNode } from 'react';
import Uppy from '@uppy/core';
import DropTarget from '@uppy/drop-target';
import XHRUpload from '@uppy/xhr-upload';
import { useImages } from '@/hooks/use-images';
import { UploadDropzoneOverlay } from './upload-dropzone-overlay';

interface UploadDropzoneProps {

  children: ReactNode;

  className?: string;

}

export const UploadDropzone = (props: UploadDropzoneProps) => {

  const targetRef = useRef<HTMLDivElement>(null);

  const { refreshImages } = useImages();

  const [ isDragOver, setIsDragOver ] = useState(false);

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

    uppy.on('files-added', files => {
      console.log('Files added:', files);
    });

    // Refreshes the UI after each individual image upload
    uppy.on('upload-success', refreshImages);

    return () => {
      uppy.destroy();
    };
  }, []);

  return (
    <div ref={targetRef} className={props.className}>
      <UploadDropzoneOverlay 
        show={isDragOver}
        className="sticky inset-0 size-full pointer-none">

        {props.children}
      </UploadDropzoneOverlay>
    </div>
  )

}