import { Dialog } from '@/components/ui/dialog';
import { ManifestEditorContent } from './manifest-editor-content';
import type { Manifest } from '@/types';

interface ManifestEditorProps {

  manifestId: string;

  open: boolean;

  onOpenChange(open: boolean): void;

}

export const ManifestEditor = (props: ManifestEditorProps) => {

  return (
    <Dialog 
      open={props.open} 
      onOpenChange={props.onOpenChange}>

      {props.open && (
        <ManifestEditorContent 
          manifestId={props.manifestId} 
          onClose={() => props.onOpenChange(false)} />
      )}
    </Dialog>
  )

}