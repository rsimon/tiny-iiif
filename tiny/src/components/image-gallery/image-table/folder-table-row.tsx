import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import type { SubFolder } from '@/types';

interface FolderTableRowProps {

  folder: SubFolder;

}

export const FolderTableRow = (props: FolderTableRowProps) => {

  return (
    <TableRow 
      className="animate-fade-in cursor-grab active:cursor-grabbing">
      <TableCell />

      <TableCell className="flex justify-center">
        <div className="size-12 p-1 relative">
          <div className="relative size-full perspective-[1000px]">
            <div className="absolute top-0.5 left-0 w-8/12 h-2 bg-[#a1a1a1] rounded-t-[3px]" />
            <div className="absolute top-2 w-full h-8/12 rounded-xs shadow-sm bg-linear-to-b from-[#a1a1a1] to-[#717171]" />
            <div className="absolute bottom-0 z-10 transition-transform duration-200 w-full h-8/12 rounded-[3px] shadow-sm bg-[linear-gradient(#c1c1c1,#b2b2b2)] -rotate-x-20" />
          </div>
        </div>
      </TableCell>

      <TableCell colSpan={2}>
        {props.folder.name}
      </TableCell>

      <TableCell>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  )

}