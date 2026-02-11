import { useMemo } from 'react';
import { useUIState } from '@/hooks/use-ui-state';
import { getDraggedImages } from '@/hooks/use-image-sorting';
import type { ImageMetadata } from '@/types';
import { TableRow } from '@/components/ui/table';
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
    <ImageTableRow image={props.active} />
  )

}