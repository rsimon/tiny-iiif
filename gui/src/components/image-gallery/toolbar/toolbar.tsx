import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { SquareCheckBig, Trash2, Upload } from 'lucide-react';
import { useUIState } from '@/hooks/use-ui-state';
import { Separator } from '@/components/ui/separator';
import type { ImageMetadata } from '@/types';
import { ViewToggle } from './view-toggle';

interface ToolbarProps {

  images: ImageMetadata[];

  onClickUpload(): void;

  onClickDelete(): void;

}

export const Toolbar = (props: ToolbarProps) => {

  const viewMode = useUIState(state => state.viewMode);
  const setViewMode = useUIState(state => state.setViewMode);

  const selectedImageIds = useUIState(state => state.selectedImageIds);
  const setSelectedImageIds = useUIState(state => state.setSelectedImageIds);

  const onSelectAll = () => {
    if (selectedImageIds.size === props.images.length)
      setSelectedImageIds([]);
    else 
      setSelectedImageIds(props.images.map(i => i.id));
  }

  return (
    <div className="h-16 border-b border-border bg-card flex items-center justify-between px-2.5">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="mb-px" />

        <nav className="text-slate-700 mr-4 text-sm font">
          All Images
        </nav>

        <Separator orientation="vertical" />

        <Button 
          variant="ghost"
          onClick={props.onClickUpload}>
          <Upload className="size-4" />
          Upload
        </Button>

        <Button 
          variant="ghost"
          onClick={onSelectAll}>
          <SquareCheckBig className="size-4" />
          Select All
        </Button>

        {selectedImageIds.size > 0 && (
          <Button
            variant="destructive"
            onClick={props.onClickDelete}>
            <Trash2 className="size-4" />
            Delete {selectedImageIds.size} Image{selectedImageIds.size > 1 && 's'}
          </Button>
        )}
      </div>

      <ViewToggle 
        viewMode={viewMode} 
        onViewModeChange={setViewMode} />
    </div>
  )

}