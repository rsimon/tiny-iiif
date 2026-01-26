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
        'px-4 py-6 flex flex-col items-center',
        isOver ? 'bg-red-500' : undefined
      )}>
      <div className="relative bg-[linear-gradient(#c1c1c1,#b2b2b2)] w-full h-3/4 rounded-md shadow-xs
        before:content-[''] before:absolute before:-top-5 before:left-1.5 before:w-7/12 before:h-5 before:bg-[#b2b2b2]
        before:rounded-t-sm">
      </div>
      <div>My Folder</div>
    </div>
  )

}