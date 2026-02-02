import { useEffect, useRef } from 'react'
import OpenSeadragon from 'openseadragon'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { ImageFile } from '@/types'

interface IIIFViewerProps {
  infoJsonUrl: string
}

function iiifInfoFromImageUrl(url: string) {
  // remove everything from `/full` onward
  const base = url.split('/full')[0]
  return `${base}/info.json`
}

function IIIFViewer({ infoJsonUrl }: IIIFViewerProps) {
  const viewerRef = useRef<HTMLDivElement | null>(null)
  const osdRef = useRef<OpenSeadragon.Viewer | null>(null)

  useEffect(() => {
    if (!viewerRef.current) return

    osdRef.current = OpenSeadragon({
      element: viewerRef.current,
      prefixUrl: 'https://cdn.jsdelivr.net/npm/openseadragon@3.1/build/openseadragon/images/', 
      tileSources: infoJsonUrl,
      showNavigator: true,
      maxZoomPixelRatio: 2,
      gestureSettingsMouse: {
        clickToZoom: true,
        dblClickToZoom: true,
      },
    })

    return () => {
      osdRef.current?.destroy()
      osdRef.current = null
    }
  }, [infoJsonUrl])

  return <div ref={viewerRef} className="w-full h-full bg-black" />
}

interface ImagePreviewDialogProps {
  image: ImageFile | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function IIIFPreview({
  image,
  open,
  onOpenChange,
}: ImagePreviewDialogProps) {
  if (!image?.url) return null

  const infoJsonUrl = iiifInfoFromImageUrl(image.url)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-h-9/12 h-full rounded-lg overflow-hidden">
        <DialogHeader className="sr-only p-4 border-0">
          <DialogTitle>{image.name}</DialogTitle>
        </DialogHeader>

        <div className="h-full w-full">
          <IIIFViewer infoJsonUrl={infoJsonUrl} />
        </div>
      </DialogContent>
    </Dialog>
  )
}