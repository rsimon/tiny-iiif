import { ArrowUpDown, MoreVertical } from 'lucide-react';
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { FolderIcon } from '@/components/shared/folder-icon';
import { Button } from '@/components/ui/button';
import { useUIState } from '@/hooks/use-ui-state';
import { useDirectory } from '@/hooks/use-directory';
import { ImageTableRow } from './image-table-row';
import type { ImageMetadata, SubFolder } from '@/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

interface ImageTableProps {

  folders: SubFolder[];

  images: ImageMetadata[];

}

export const ImageTable = (props: ImageTableProps) => {

  const { images, folders } = props;

  const selectedImageIds = useUIState(state => state.selectedImageIds);
  const setSelectedImage = useUIState(state => state.setSelectedImage);

  const onSort = (property: string) => {

  }

  const onDelete = (image: ImageMetadata) => {

  }

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
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground hover:bg-transparent gap-1 -ml-3 font-medium"
                  onClick={() => onSort('filename')}>
                  Name
                  <ArrowUpDown className="size-3" />
                </Button>
              </TableHead>

              <TableHead>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground hover:bg-transparent gap-1 -ml-3 font-medium"
                  onClick={() => onSort('fileSize')}>
                  Dimensions
                  <ArrowUpDown className="size-3" />
                </Button>
              </TableHead>

              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {folders.map(folder => (
              <TableRow 
                key={folder.id}
                className="animate-fade-in cursor-grab active:cursor-grabbing">
                <TableCell />

                <TableCell className="flex justify-center">
                  <FolderIcon />
                </TableCell>

                <TableCell colSpan={2}>
                  {folder.name}
                </TableCell>

                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {images.map(image => (
              <ImageTableRow 
                key={image.id}
                image={image}
                isGhost={false}
                isSelected={selectedImageIds.includes(image.id)}
                onSelect={selected => setSelectedImage(image.id, selected)} />
            ))}
          </TableBody>
        </Table>
      </div>
    </SortableContext>
  )

}