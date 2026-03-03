import { Dialog } from '@/components/ui/dialog';
import { ManifestEditorContent } from './manifest-editor-content';

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
          manifestId={props. manifestId} />
      )}
    </Dialog>
  )

}