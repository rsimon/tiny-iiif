import { Grid, List, Trash2, Upload, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useImageStore } from '@/lib/store_old'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '../ui/sidebar';

interface ToolbarProps {
  isUploading: boolean;
  hasSelection: boolean;
  onUploadClick: () => void
  onBulkDelete: () => void
}

export function Toolbar({ onUploadClick, onBulkDelete }: ToolbarProps) {
  const { viewMode, setViewMode, selectedImages, currentFolderId, folders } = useImageStore()
  
  const currentFolder = folders.find(f => f.id === currentFolderId)
  const parentFolder = currentFolder?.parentId 
    ? folders.find(f => f.id === currentFolder.parentId)
    : null
  
  const getBreadcrumbs = () => {
    const breadcrumbs: { id: string; name: string }[] = []
    
    if (currentFolderId === 'root') {
      return [{ id: 'root', name: 'All Images' }]
    }
    
    breadcrumbs.unshift({ id: currentFolderId, name: currentFolder?.name || '' })
    
    if (parentFolder && parentFolder.id !== 'root') {
      breadcrumbs.unshift({ id: parentFolder.id, name: parentFolder.name })
    }
    
    breadcrumbs.unshift({ id: 'root', name: 'All Images' })
    
    return breadcrumbs
  }
  
  const breadcrumbs = getBreadcrumbs()
  const hasSelection = selectedImages.size > 0

  return (
    <div className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />

        <nav className="flex items-center gap-1 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.id} className="flex items-center gap-1">
              {index > 0 && <ChevronRight className="size-4 text-muted-foreground" />}
              <span className={cn(
                index === breadcrumbs.length - 1 
                  ? 'font-medium text-foreground' 
                  : 'text-muted-foreground'
              )}>
                {crumb.name}
              </span>
            </span>
          ))}
        </nav>
      </div>
      
      <div className="flex items-center gap-2">
        {hasSelection && (
          <Button 
            variant="destructive" 
            size="sm"
            className="gap-2"
            onClick={onBulkDelete}
          >
            <Trash2 className="size-4" />
            Delete {selectedImages.size} selected
          </Button>
        )}
        
        <Button 
          variant="default" 
          size="sm"
          className="gap-2"
          onClick={onUploadClick}
        >
          <Upload className="size-4" />
          Upload
        </Button>
        
        <div className="border-l border-border h-6 mx-2" />
        
        <div className="flex rounded-md border border-border overflow-hidden">
          <Button
            variant="ghost"
            size="icon-sm"
            className={cn(
              'rounded-none border-0',
              viewMode === 'grid' && 'bg-muted'
            )}
            onClick={() => setViewMode('grid')}
          >
            <Grid className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className={cn(
              'rounded-none border-0',
              viewMode === 'table' && 'bg-muted'
            )}
            onClick={() => setViewMode('table')}
          >
            <List className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}