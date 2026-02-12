import { useMemo } from 'react';
import { DragOverlay, useDndContext, type Modifier } from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { getEventCoordinates } from '@dnd-kit/utilities';
import { useUIState } from '@/hooks/use-ui-state';
import type { ImageMetadata, SubFolder } from '@/types';
import { DragPreview } from './drag-preview';
import { FolderTableRow } from './folder-table-row';
import { ImageTableRow } from './image-table-row';
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { PaginationControl } from '../pagination-control';

interface ImageTableProps {

  folders: SubFolder[];

  images: ImageMetadata[];

}

// Modified from https://github.com/clauderic/dnd-kit/blob/e9215e820798459ae036896fce7fd9a6fe855772/packages/modifiers/src/snapCenterToCursor.ts#L4
export const snapVerticalCenterToCursor: Modifier = ({
  activatorEvent,
  draggingNodeRect,
  transform,
}) => {
  if (draggingNodeRect && activatorEvent) {
    const activatorCoordinates = getEventCoordinates(activatorEvent);

    if (!activatorCoordinates)
      return transform;

    const offsetY = activatorCoordinates.y - draggingNodeRect.top;

    return {
      ...transform,
      y: transform.y + offsetY - draggingNodeRect.height / 2,
    }
  }

  return transform;
}

export const ImageTable = (props: ImageTableProps) => {

  const { images, folders } = props;

  const selectedImageIds = useUIState(state => state.selectedImageIds);
  const setSelectedImage = useUIState(state => state.setSelectedImage);

  const { active } = useDndContext();
  const activeImage = useMemo(() => props.images.find(i => i.id === active?.id), [props.images, active]);

  return (
    <SortableContext 
      items={images}
      strategy={rectSortingStrategy}>
      <div className="rounded-lg border border-border overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow 
              className="bg-muted/50 hover:bg-muted/50 animate-fade-in cursor-grab active:cursor-grabbing">
              <TableHead className="w-10" />     

              <TableHead className="w-18" />

              <TableHead>
                Name
              </TableHead>

              <TableHead>
                Dimensions
              </TableHead>

              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {folders.map(folder => (
              <FolderTableRow
                key={folder.id}
                folder={folder} />
            ))}

            {images.map(image => (
              <ImageTableRow 
                key={image.id}
                image={image}
                isSelected={selectedImageIds.includes(image.id)}
                onSelect={selected => setSelectedImage(image.id, selected)} />
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4">
        <PaginationControl 
          className="justify-start" />
      </div>

      {activeImage && (
        <DragOverlay
          modifiers={[snapVerticalCenterToCursor]}>
          <DragPreview active={activeImage} />
        </DragOverlay>
      )}
    </SortableContext>
  )

}