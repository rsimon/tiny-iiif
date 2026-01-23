import { useEffect, useRef } from 'react';
import OpenSeadragon from 'openseadragon';

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
      prefixUrl: 'https://cdn.jsdelivr.net/npm/openseadragon@3.1/build/openseadragon/images/', 
      tileSources: props.url,
      showNavigator: true,
      navigatorPosition: 'BOTTOM_LEFT',
      maxZoomPixelRatio: 2,
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

  return (
    <div ref={elementRef} className="w-full h-full bg-black" />
  )

}