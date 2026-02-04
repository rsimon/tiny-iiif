import { useState } from 'react';
import { EllipsisVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SubDirectory } from '@/types';
import { getManifestURL } from '@/utils/get-manifest-url';
import { ManifestMetadataDialog } from './manifest-metadata-dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

interface ManifestOptionsButtonProps {

  manifest: SubDirectory;

}

export const ManifestOptionsButton = (props: ManifestOptionsButtonProps) => {

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [metadataDialogOpen, setMetadataDialogOpen] = useState(false);

  const onEditMetadata = () => {
    setDropdownOpen(false);
    setMetadataDialogOpen(true);
  }

  const onCopyToClipboard = () => {
    try {
      navigator.clipboard.writeText(getManifestURL(props.manifest));
    } catch (error) {
      console.error('Failed to copy:', error);
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
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={onEditMetadata}>
            Edit metadata
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onCopyToClipboard}>
            Copy URL to clipboard
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ManifestMetadataDialog
        open={metadataDialogOpen}
        onOpenChange={setMetadataDialogOpen} />
    </>
  );
};