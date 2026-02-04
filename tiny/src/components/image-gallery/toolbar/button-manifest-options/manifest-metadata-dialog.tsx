import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';

interface ManifestMetadataDialogProps {

  open: boolean;

  onOpenChange(open: boolean): void;

}

export const ManifestMetadataDialog = (props: ManifestMetadataDialogProps) => {

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit metadata</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <div>
          {/* Dialog content left intentionally blank for now */}
        </div>

        <DialogFooter />
      </DialogContent>
    </Dialog>
  )

}