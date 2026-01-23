import { LayoutList, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ViewMode } from '@/types';

interface ViewToggleProps {

  viewMode: ViewMode;

  onViewModeChange: (mode: ViewMode) => void;

}

export const ViewToggle = (props: ViewToggleProps) => {

  return (
    <div className="flex items-center border border-border/40 gap-1 bg-muted rounded-lg p-1">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'h-8 w-8 rounded-md',
          props.viewMode === 'table' ? 'bg-white shadow-sm hover:bg-white' : 'opacity-40'
        )}
        onClick={() => props.onViewModeChange('table')}>
        <LayoutList className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'h-8 w-8 rounded-md',
          props.viewMode === 'grid' ? 'bg-white shadow-sm hover:bg-white' : 'opacity-40'
        )}
        onClick={() => props.onViewModeChange('grid')}>
        <Grid3X3 className="h-4 w-4" />
      </Button>
    </div>
  )

}