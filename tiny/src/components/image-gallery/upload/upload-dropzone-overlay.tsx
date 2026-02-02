import type { ReactNode } from 'react';

interface UploadDropzoneOverlayProps {

  children: ReactNode;

  className?: string;

  show: boolean;

}

export const UploadDropzoneOverlay = (props: UploadDropzoneOverlayProps) => {

  return (
    <div className={props.className}>
      {props.show && (
        <div className="absolute size-full z-10 p-3 pointer-events-none">
          <div className="size-full rounded-xl backdrop-blur
            border border-blue-300 bg-blue-300/20" />
        </div>
      )}
      
      {props.children}
    </div>
  )

}