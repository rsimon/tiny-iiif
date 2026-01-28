import type { ReactNode, RefObject } from 'react';
import { UploadDropzoneOverlay } from './upload-dropzone-overlay';

interface UploadDropzoneProps {

  children: ReactNode;

  className?: string;

  showOverlay: boolean;

  targetRef: RefObject<HTMLDivElement>;

}

export const UploadDropzone = (props: UploadDropzoneProps) => {

  return (
    <div ref={props.targetRef} className={props.className}>
      <UploadDropzoneOverlay 
        show={props.showOverlay}
        className="sticky inset-0 size-full pointer-none">

        {props.children}
      </UploadDropzoneOverlay>
    </div>
  )

}