import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Home, SquareCheckBig, Upload } from 'lucide-react';
import { ViewToggle } from './view-toggle';
import { useUIState } from '@/hooks/use-ui-state';
import { Separator } from '@/components/ui/separator';

interface ToolbarProps {

  onClickUpload(): void;

  onClickDelete(): void;

}

export const Toolbar = (props: ToolbarProps) => {

  const viewMode = useUIState(state => state.viewMode);
  const setViewMode = useUIState(state => state.setViewMode);

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
          size="sm"
          className="h-9"
          onClick={props.onClickUpload}>
          <Upload className="size-4" />
          Upload
        </Button>

        <Button 
          variant="ghost" 
          size="sm"
          className="h-9"
          onClick={props.onClickUpload}>
          <SquareCheckBig className="size-4" />
          Select All
        </Button>
      </div>

      <ViewToggle 
        viewMode={viewMode} 
        onViewModeChange={setViewMode} />
    </div>
  )

}