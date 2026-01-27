import { useEffect, useRef, type ReactNode } from 'react';
import Uppy from '@uppy/core';
import DropTarget from '@uppy/drop-target';

interface UploadDropzoneProps {

  children: ReactNode;

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
    <div className={props.className}>
      <div className="absolute size-full z-10 p-3 pointer-events-none">
        <div className="size-full rounded-xl backdrop-blur
          border border-blue-300 bg-blue-300/20" />
      </div>
      {props.children}
    </div>
  )

}