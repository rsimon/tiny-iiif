import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

interface ConfirmDeleteDialogProps {

  open: boolean;

  onOpenChange(open: boolean): void;
  
  onConfirm(): void;

}

export const ConfirmDeleteDialog = (props: ConfirmDeleteDialogProps) => {

  return (
    <AlertDialog 
      open={props.open} 
      onOpenChange={props.onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure?
          </AlertDialogTitle>

          <AlertDialogDescription
            className="my-2 leading-relaxed">
            This will delete the manifest only. Your images will remain in the root 
            directory and can be reused in other manifests.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction 
            variant="destructive" onClick={props.onConfirm}>
            Delete Manifest
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};