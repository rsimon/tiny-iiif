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

interface ConfirmActionDialogProps {

  open: boolean;

  title?: string;

  description: string;

  cancelLabel?: string;

  confirmLabel?: string;

  onOpenChange(open: boolean): void;
  
  onConfirm(): void;

}

export const ConfirmActionDialog = (props: ConfirmActionDialogProps) => {

  return (
    <AlertDialog 
      open={props.open} 
      onOpenChange={props.onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {props.title || 'Are you sure?'}
          </AlertDialogTitle>

          <AlertDialogDescription
            className="mt-2 mb-4 leading-relaxed">
            {props.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {props.cancelLabel || 'Cancel'}
          </AlertDialogCancel>

          <AlertDialogAction 
            variant="destructive" onClick={props.onConfirm}>
            {props.confirmLabel || 'Confirm'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
  
}