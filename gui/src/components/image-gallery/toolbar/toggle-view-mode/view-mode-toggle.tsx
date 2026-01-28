import { LayoutList, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIState } from '@/hooks/use-ui-state';
import { cn } from '@/lib/utils';

export const ViewModeToggle = () => {

  const viewMode = useUIState(state => state.viewMode);
  const setViewMode = useUIState(state => state.setViewMode);

  return (
    <div className="flex items-center border border-border/40 gap-1 bg-muted rounded-lg p-1">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'h-8 w-8 rounded-md',
          viewMode === 'table' ? 'bg-white shadow-sm hover:bg-white' : 'opacity-40'
        )}
        onClick={() => setViewMode('table')}>
        <LayoutList className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'h-8 w-8 rounded-md',
          viewMode === 'grid' ? 'bg-white shadow-sm hover:bg-white' : 'opacity-40'
        )}
        onClick={() => setViewMode('grid')}>
        <Grid3X3 className="h-4 w-4" />
      </Button>
    </div>
  )

}