import { Home } from 'lucide-react';
import { useUIState } from '@/hooks/use-ui-state';
import { Button } from '@/components/ui/button';
import { isManifestRange, isSubFolder, type SubFolder } from '@/types';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbList, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';

export const NavBreadcrumbs = () => {

  const currentDirectory = useUIState(state => state.currentDirectory);
  const setCurrentDirectory = useUIState(state => state.setCurrentDirectory);

  const goTo = (folder?: SubFolder) => {
    const breadcrumbs = isManifestRange(folder) ? folder.breadcrumbs : [];

    const destination = folder ? {
      ...folder,
      breadcrumbs: breadcrumbs.slice(0, breadcrumbs.findIndex(b => b.id === folder.id))
    } : undefined;

    setCurrentDirectory(destination);
  }

  return (
    <Breadcrumb className="mr-1">
      <BreadcrumbList className="flex-nowrap">
        <BreadcrumbItem>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => goTo()}>
            <Home />
          </Button>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        {isSubFolder(currentDirectory) && (
          <BreadcrumbItem className="text-xs text-foreground font-medium tracking-wide md:text-sm">
            {currentDirectory.name}
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )

}