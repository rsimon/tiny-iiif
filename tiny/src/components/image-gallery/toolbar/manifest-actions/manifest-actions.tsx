import { useState } from 'react';
import { Braces, Clipboard, EllipsisVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { Manifest } from '@/types';
import { getManifestURL } from '@/lib/get-manifest-url';
import { EditMetadataDialog } from './edit-metadata-dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

interface ManifestActionsProps {

  manifest: Manifest;

}

export const ManifestActions = (props: ManifestActionsProps) => {

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [metadataDialogOpen, setMetadataDialogOpen] = useState(false);

  const onEditMetadata = () => {
    setDropdownOpen(false);
    setMetadataDialogOpen(true);
  }

  const onCopyToClipboard = async () => {
    try {
      const url = getManifestURL(props.manifest);
      await navigator.clipboard.writeText(url);
      toast.success('Manifest URL copied to clipboard');
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy URL');
    }
  }

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <EllipsisVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onSelect={onEditMetadata}>
            <Braces /> Edit metadata
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onCopyToClipboard}>
            <Clipboard /> Copy URL to clipboard
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditMetadataDialog
        open={metadataDialogOpen}
        onOpenChange={setMetadataDialogOpen} />
    </>
  )

}