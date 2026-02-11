import { useMemo } from 'react';
import { useUIState } from '@/hooks/use-ui-state';
import { getDraggedImages } from '@/hooks/use-image-sorting';
import type { ImageMetadata } from '@/types';
import { ImageTableRow } from './image-table-row';

interface DragPreviewProps {

  active: ImageMetadata;

}

export const DragPreview = (props: DragPreviewProps) => {

  const selectedImageIds = useUIState(state => state.selectedImageIds);

  const totalDragged = useMemo(() => (
    getDraggedImages(selectedImageIds, props.active.id).length
  ), [selectedImageIds, props.active.id]);

  return (
    <div className="w-full relative scale-80 rotate-1 opacity-70 drop-shadow-lg">
      <div className="relative border border-gray-300 overflow-hidden bg-white rounded-md z-30">
        <table className="w-full">
          <tbody>
            <ImageTableRow 
              className="bg-transparent hover:bg-transparent"
              image={props.active} />
          </tbody>
        </table>
      </div>
      
      {totalDragged > 1 && (
        <div className="absolute z-20 h-full w-full bg-gray-200 top-1.75 left-1.5 rounded-md border border-gray-300 origin-bottom-left scale-[98%]" />
      )}

      {totalDragged > 2 && (
        <div className="absolute z-10 h-full w-full bg-gray-200 top-3.25 left-3 rounded-md border border-gray-300 origin-bottom-left scale-[96%]" />
      )}
    </div>
  )

}