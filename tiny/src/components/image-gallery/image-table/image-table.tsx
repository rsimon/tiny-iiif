import { ArrowUpDown, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useUIState } from '@/hooks/use-ui-state';
import { useDirectory } from '@/hooks/use-directory';
import { getThumbnailURL } from '@/lib/get-thumbnail-url';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { FolderIcon } from '@/components/shared/folder-icon';

export const ImageTable = () => {

  const { images, folders } = useDirectory();

  const selectedImageIds = useUIState(state => state.selectedImageIds);
  const setSelectedImage = useUIState(state => state.setSelectedImage);

  const onSort = (property: string) => {

  }

  return (
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
            <TableRow 
              key={image.id}
              data-state={selectedImageIds.includes(image.id) ? 'selected' : undefined}
              className="animate-fade-in cursor-grab active:cursor-grabbing">
              <TableCell className="w-10 text-center">
                <Checkbox
                  checked={selectedImageIds.includes(image.id)}
                  onCheckedChange={checked => setSelectedImage(image.id, checked as boolean)}
                  aria-label={`Select ${image.filename}`}
                  className="rounded border bg-muted/30 border-slate-300 size-4.5 data-[state=checked]:bg-green-600 data-[state=checked]:text-green-100 data-[state=checked]:border-green-600" />
              </TableCell>

              <TableCell className="p-3 w-18 flex justify-center">
                <div className="w-12 h-12 rounded shadow-xs overflow-hidden bg-muted">
                  <img
                    src={getThumbnailURL(image, 96, 96)}
                    alt={image.filename}
                    className="w-full h-full object-cover pointer-events-none" />
                </div>
              </TableCell>

              <TableCell className="p-4">{image.filename}</TableCell>

              <TableCell className="text-muted-foreground">
                {image.width.toLocaleString()} × {image.height.toLocaleString()}
              </TableCell>

              <TableCell className="text-muted-foreground">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

}