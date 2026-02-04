import { useState } from 'react';
import { EllipsisVertical, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { getManifestURL } from '@/lib/get-manifest-url';
import type { Manifest } from '@/types';
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

interface ManifestActionProps {

  manifest: Manifest;

}

const VIEWERS = {
  'mirador': 'https://projectmirador.org/embed/',
  'theseus': 'https://theseusviewer.org/',
  'uv': 'https://uv-v4.netlify.app/',
  'liiive': 'https://liiive.now/'
};

export const ManifestActions = (props: ManifestActionProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [metadataDialogOpen, setMetadataDialogOpen] = useState(false);

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

  return (
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

        <DropdownMenuItem onClick={onCopyToClipboard}>
          Copy Manifest URL
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={onEditMetadata}>
          Edit Metadata
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive">
          <Trash2 /> Delete manifest
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

}