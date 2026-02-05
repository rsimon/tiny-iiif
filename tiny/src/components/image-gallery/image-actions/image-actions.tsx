import { useState } from 'react';
import { EllipsisVertical, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ConfirmActionDialog } from '@/components/shared/confirm-action-dialog';
import { useImages } from '@/hooks/use-images';
import { getInfoJsonURL } from '@/lib/get-info-json-url';
import type { ImageMetadata } from '@/types';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface ImageActionsProps {

  image: ImageMetadata;

  onPreview(): void;

}

export const ImageActions = (props: ImageActionsProps) => {

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { deleteImagesAsync } = useImages();

  const onCopyToClipboard = async () => {
    try {
      const url = getInfoJsonURL(props.image);
      await navigator.clipboard.writeText(url);
      toast.success('Image info.json URL copied to clipboard');
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy URL');
    }
  }

  const onDelete = () => {
    setDropdownOpen(false);
    setDeleteDialogOpen(true);
  }

  const onConfirmDelete = () => {
    deleteImagesAsync([props.image.id]).then(() => {
      setDeleteDialogOpen(false);
      toast.success('Image deleted successfully');
    }).catch(() => {
      toast.error('Failed to delete image');
    })
  }

  return (
    <>
      <DropdownMenu 
        open={dropdownOpen} 
        onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <EllipsisVertical className="size-3.5" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent 
          align="start"
          sideOffset={0}>
          <DropdownMenuItem onClick={props.onPreview}>
            Preview
          </DropdownMenuItem>

          <DropdownMenuItem onClick={onCopyToClipboard}>
            Copy Image URL
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />

          <DropdownMenuItem 
            variant="destructive"
            onSelect={onDelete}>
            <Trash2 /> Delete Image
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmActionDialog
        open={deleteDialogOpen}
        description="The image will be permanently deleted from the server. This action cannot be undone."
        confirmLabel="Delete Image"
        onOpenChange={setDeleteDialogOpen}
        onConfirm={onConfirmDelete} />
    </>
  )

}