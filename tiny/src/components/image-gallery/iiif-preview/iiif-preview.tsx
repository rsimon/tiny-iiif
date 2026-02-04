import { useMemo } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getInfoJsonURL } from '@/lib/get-info-json-url';
import type { ImageMetadata } from '@/types';
import { IIIFViewer } from './iiif-viewer';
import { 
  Dialog, 
  DialogClose, 
  DialogContent, 
  DialogDescription, 
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

interface IIIFPreviewProps {

  image?: ImageMetadata;

  onClose(): void;

}

export const IIIFPreview = (props: IIIFPreviewProps) => {

  const url = useMemo(() => (
    props.image ? getInfoJsonURL(props.image) : undefined
  ), [props.image]);

  return (
    <Dialog 
      open={Boolean(props.image)} 
      onOpenChange={props.onClose}>
      <DialogContent 
        showCloseButton={false}
        className="p-0 max-h-11/12 h-full sm:max-w-11/12 rounded-lg overflow-hidden">
        <DialogHeader className="sr-only p-4 border-0">
          <DialogTitle>{props.image?.filename}</DialogTitle>
          <DialogDescription>
            {props.image?.filename} full-screen preview
          </DialogDescription>
        </DialogHeader>

        <div className="h-full w-full">
          {url && (
            <IIIFViewer url={url} />
          )}
        </div>

        <DialogClose 
          asChild
          className="absolute top-2 right-2">
          <Button 
            variant="ghost"
            size="icon"
            className="bg-slate-950/50 hover:bg-slate-950/60 size-10 text-white hover:text-white">
            <X className="size-5" />
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )

}