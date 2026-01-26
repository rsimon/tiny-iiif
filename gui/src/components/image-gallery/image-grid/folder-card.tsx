import { cn } from '@/lib/utils';
import { useDroppable } from '@dnd-kit/core';

interface FolderCardProps {

  id: string;

}

export const FolderCard = (props: FolderCardProps) => {

  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
    data: { type: 'folder', id: props.id }
  });

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        'px-4 py-6 flex flex-col items-center perspective-[1000px]',
        isOver ? undefined: 'rotate-x-18 translate-y-1 shadow-lg'// : undefined
      )}>
      <div className="origin-bottom -rotate-x-30 translate-y-1 mt-2 relative bg-[linear-gradient(#c1c1c1,#b2b2b2)] w-full h-10/12 rounded-md shadow-xs
        before:content-[''] before:absolute before:-top-6 before:left-1.5 before:w-2/3 before:h-6 before:bg-[#b2b2b2]
        before:rounded-t-md">
      </div>

      <div className="mt-2 text-xs font-medium text-slate-950 truncate flex-1">
        My Folder
      </div>
    </div>
  )

}