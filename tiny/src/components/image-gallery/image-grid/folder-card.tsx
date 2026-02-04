import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { isManifest, type SubFolder } from '@/types';
import { useUIState } from '@/hooks/use-ui-state';
import { ManifestActions } from '../manifest-actions';

interface FolderCardProps {

  folder: SubFolder;

}

export const FolderCard = (props: FolderCardProps) => {

  const setCurrentDirectory = useUIState(state => state.setCurrentDirectory);

  const { isOver, setNodeRef } = useDroppable({
    id: props.folder.id,
    data: { type: 'folder' }
  });

  const onEnterFolder = () => setCurrentDirectory(props.folder);

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        'rounded-lg border border-border bg-white',
        isOver ? 'ring-6 ring-slate-500/30' : 'image-card-shadow'
      )}>
      <button 
        className="group w-full relative aspect-4/3 p-1 cursor-pointer"
        onClick={onEnterFolder}>
        <div className="size-full relative rounded-sm bg-muted flex items-center justify-center">
          <div 
            className={cn(
              'relative w-4/12 h-5/12 perspective-[200px]',
              isOver ? 'scale-110' : undefined
            )}>
            <div className="absolute top-0.5 left-0 w-8/12 h-2.5 bg-[#b2b2b2] rounded-t" />
            <div className="absolute top-2.5 w-full h-9/12 rounded shadow-sm bg-[#b2b2b2]" />

            <div className={cn(
              'absolute transition-transform duration-200 bottom-0 w-full h-10/12 origin-bottom rounded shadow-sm bg-[linear-gradient(#c1c1c1,#b2b2b2)] group-hover:-rotate-x-40',
              isOver ? '-rotate-x-40' : '-rotate-x-10'
            )} />
          </div>
        </div>
      </button>

      <div className="p-1 pt-0 pl-3 flex items-center justify-between">
        <span className="text-xs text-slate-950 truncate flex-1">
          {props.folder.name}
        </span>

        {isManifest(props.folder) && (
          <ManifestActions manifest={props.folder} />
        )}
      </div>
    </div>
  )

}