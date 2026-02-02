import { useEffect, useRef } from 'react';
import OpenSeadragon from 'openseadragon';
import { Fullscreen, Home, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IIIFViewerProps {

  url: string;

}

export const IIIFViewer = (props: IIIFViewerProps) => {

  const elementRef = useRef<HTMLDivElement | null>(null);

  const viewerRef = useRef<OpenSeadragon.Viewer | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    viewerRef.current = OpenSeadragon({
      element: elementRef.current,
      tileSources: props.url,
      showNavigationControl: false,
      // showNavigator: true,
      // navigatorPosition: 'BOTTOM_LEFT',
      maxZoomPixelRatio: 4,
      gestureSettingsMouse: {
        clickToZoom: true,
        dblClickToZoom: true
      }
    });

    return () => {
      viewerRef.current?.destroy();
      viewerRef.current = null
    }
  }, [props.url]);

  const onZoom = (factor: number) => {
    const viewer = viewerRef.current;
    if (viewer) {
      viewer.viewport.zoomBy(factor);
      viewer.viewport.applyConstraints();
    }
  }

  const onHome = () =>
    viewerRef.current?.viewport.goHome();

  const onFullscreen = () =>
    viewerRef.current?.setFullScreen(true);

  return (
    <div className="relative w-full h-full">
      <div ref={elementRef} className="w-full h-full bg-black" />

      <div className="absolute top-2 left-2 flex gap-2 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:text-white bg-slate-950/50 hover:bg-slate-950/60"
          onClick={() => onZoom(2)}>
          <ZoomIn className="size-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:text-white bg-slate-950/50 hover:bg-slate-950/60"
          onClick={() => onZoom(0.5)}>
          <ZoomOut className="size-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:text-white bg-slate-950/50 hover:bg-slate-950/60"
          onClick={onHome}>
          <Home className="size-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:text-white bg-slate-950/50 hover:bg-slate-950/60"
          onClick={onFullscreen}>
          <Fullscreen className="size-5" />
        </Button>
      </div>
    </div>
  )

}