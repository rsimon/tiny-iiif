import { useEffect, useRef } from 'react';
import Uppy from '@uppy/core';
import DropTarget from '@uppy/drop-target';
import { cn } from '@/lib/utils';

interface UploadDropzoneProps {

  children: React.ReactNode;

  className?: string;

}

export const UploadDropzone = (props: UploadDropzoneProps) => {

  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!targetRef.current) return;

    const uppy = new Uppy();

    uppy.use(DropTarget, {
      target: targetRef.current,
    });

    return () => {
      uppy.destroy();
    };
  }, []);

  return (
    <div>
      {props.children}
    </div>
  )

}