import { useState } from 'react';
import { EllipsisVertical, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ConfirmActionDialog } from '@/components/shared/confirm-action-dialog';
import { useManifests } from '@/hooks/use-manifests';
import { useUIState } from '@/hooks/use-ui-state';
import { getManifestURL } from '@/lib/get-manifest-url';
import type { Manifest } from '@/types';
import { ManifestEditor } from './manifest-editor';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuPortal, 
  DropdownMenuSeparator, 
  DropdownMenuSub, 
  DropdownMenuSubContent, 
  DropdownMenuSubTrigger, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface ManifestActionsProps {

  manifest: Manifest;

}

const VIEWERS = {
  'mirador': 'https://projectmirador.org/embed/',
  'theseus': 'https://theseusviewer.org/',
  'uv': 'https://uv-v4.netlify.app/',
  'liiive': 'https://liiive.now/'
};

export const ManifestActions = (props: ManifestActionsProps) => {
  const setCurrentDirectory = useUIState(state => state.setCurrentDirectory);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [metadataDialogOpen, setMetadataDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { deleteManifest } = useManifests();

  const onPreview = (viewer: string) => {
    const url =
      `${VIEWERS[viewer]}?iiif-content=${encodeURIComponent(getManifestURL(props.manifest))}`;
    window.open(url, '_blank').focus();
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

  const onEditMetadata = () => {
    setDropdownOpen(false);
    setMetadataDialogOpen(true);
  }

  const onDelete = () => {
    setDropdownOpen(false);
    setDeleteDialogOpen(true);
  }

  const onConfirmDelete = () => {
    deleteManifest(props.manifest.id).then(() => {
      setCurrentDirectory();
      setDeleteDialogOpen(false);
    });
  }

  return (
    <>
      <DropdownMenu 
        open={dropdownOpen} 
        onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground">
            <EllipsisVertical className="size-3.5" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent 
          align="start"
          sideOffset={0}>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              Preview
            </DropdownMenuSubTrigger>

            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onSelect={() => onPreview('mirador')}>
                  Mirador
                </DropdownMenuItem>

                <DropdownMenuItem onSelect={() => onPreview('theseus')}>
                  Theseus
                </DropdownMenuItem>

                <DropdownMenuItem onSelect={() => onPreview('uv')}>
                  Universal Viewer
                </DropdownMenuItem>

                <DropdownMenuItem onSelect={() => onPreview('liiive')}>
                  liiive.now
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuItem onSelect={onEditMetadata}>
            Manifest Editor
          </DropdownMenuItem>

          <DropdownMenuItem onClick={onCopyToClipboard}>
            Copy Manifest URL
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />

          <DropdownMenuItem 
            variant="destructive"
            onSelect={onDelete}>
            <Trash2 /> Delete Manifest
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmActionDialog
        open={deleteDialogOpen}
        description="This will delete the manifest only. Your images will remain in the root directory and can be reused in other manifests."
        confirmLabel="Delete Manifest"
        onOpenChange={setDeleteDialogOpen}
        onConfirm={onConfirmDelete} />

      <ManifestEditor 
        open={metadataDialogOpen} 
        onOpenChange={setMetadataDialogOpen} />
    </>
  )

}