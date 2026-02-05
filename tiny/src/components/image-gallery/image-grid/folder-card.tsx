import { useDroppable } from '@dnd-kit/core';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { isManifest, type SubFolder, type ImageMetadata } from '@/types';
import { useUIState } from '@/hooks/use-ui-state';
import { getThumbnailURL } from '@/lib/get-thumbnail-url';
import { ManifestActions } from '../manifest-actions';

interface FolderCardProps {

  folder: SubFolder;

}

const THUMBNAIL_STYLES_DOWN = [
  { transform: 'rotate(-6deg) translate(-8px, 8px)', zIndex: 1 },
  { transform: 'rotate(-3deg) translate(-4px, 2px)', zIndex: 2 },
  { transform: 'rotate(6deg) translate(10px, 6px)', zIndex: 3 }
];

const THUMBNAIL_STYLES_UP = [
  { transform: 'rotate(-14deg) translate(-12px, 3px)', zIndex: 1 },
  { transform: 'rotate(-3deg) translate(-2px, -4px)', zIndex: 2 },
  { transform: 'rotate(16deg) translate(14px, -2px)', zIndex: 3 }
];

export const FolderCard = (props: FolderCardProps) => {

  const setCurrentDirectory = useUIState(state => state.setCurrentDirectory);

  const previewImages = useMemo(() => {
    const images = (props.folder.images as ImageMetadata[] || []);
    return images.slice(0, 3).reverse();
  }, [props.folder.images]);

  const { isOver: isDraggedOver, setNodeRef } = useDroppable({
    id: props.folder.id,
    data: { type: 'folder' }
  });

  const [isHover, setIsHover] = useState(false);

  const onEnterFolder = () => setCurrentDirectory(props.folder);

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        'rounded-lg border border-border bg-white transition-all duration-200 animate-fade-in',
        isDraggedOver ? 'ring-6 ring-slate-500/30' : 'image-card-shadow'
      )}>
      <button 
        className="group w-full relative aspect-4/3 p-1 cursor-pointer"
        onPointerEnter={() => setIsHover(true)}
        onPointerLeave={() => setIsHover(false)}
        onClick={onEnterFolder}>
        <div className="size-full relative rounded-sm bg-muted flex items-center justify-center">
          <div 
            className={cn(
              'relative w-4/12 h-5/12 perspective-[200px]',
              isDraggedOver ? 'scale-110' : undefined
            )}>
            <div className="absolute top-0.5 left-0 w-8/12 h-2.5 bg-[#a1a1a1] rounded-t" />
            <div className="absolute top-2.5 w-full h-9/12 rounded shadow-sm bg-[#a1a1a1]" />

            {previewImages.length > 0 && (
              <div className="absolute inset-0 flex items-center justify-center transition-transform">
                {previewImages.map((image, index) => (
                  <div
                    key={image.id}
                    className="absolute duration-500 size-8/12 -translate-y-1 drop-shadow-[0_0_1px_rgba(0,0,0,0.65)]">
                    <img
                      style={isHover ? {
                        ...THUMBNAIL_STYLES_UP[index % THUMBNAIL_STYLES_UP.length]
                      } : {
                        ...THUMBNAIL_STYLES_DOWN[index % THUMBNAIL_STYLES_DOWN.length]
                      }}
                      src={getThumbnailURL(image, 40, 40)}
                      alt={image.filename}
                      className="origin-center w-full h-full rounded border border-white object-cover transition-all"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className={cn(
              'absolute z-10 border border-neutral-400/30 transition-transform duration-200 bottom-0 w-full h-9/12 origin-bottom rounded shadow-sm bg-[linear-gradient(#c1c1c1,#b2b2b2)] group-hover:-rotate-x-45',
              isDraggedOver ? '-rotate-x-45' : '-rotate-x-18'
            )} />
          </div>
        </div>
      </button>

      <div className="pt-0 p-1 pl-2 flex items-stretch justify-between">
        <div className="pt-0.5 text-xs text-slate-950 flex flex-col truncate flex-1 space-y-0">
          <div className="font-medium">{props.folder.name}</div>

          {(props.folder.images || []).length > 0 ? (
            <div className="text-muted-foreground font-light">
              {props.folder.images.length} Images
            </div>
          ) : (
            <div className="text-muted-foreground/50">
              Empty
            </div>
          )}
        </div>

        {isManifest(props.folder) && (
          <ManifestActions manifest={props.folder} />
        )}
      </div>
    </div>
  )

}