import { useUIState } from '@/hooks/use-ui-state';
import { Button } from '@/components/ui/button';
import { isSubDirectory, type Directory, type SubDirectory } from '@/types';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbList, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';

export const NavBreadcrumbs = () => {

  const currentDirectory = useUIState(state => state.currentDirectory);
  const setCurrentDirectory = useUIState(state => state.setCurrentDirectory);

  const goTo = (directory?: SubDirectory) => {
    const breadcrumbs = directory ? directory.breadcrumbs : [];

    const destination = directory ? {
      ...directory,
      breadcrumbs: breadcrumbs.slice(0, breadcrumbs.findIndex(b => b.id === directory.id))
    } : undefined;

    setCurrentDirectory(destination);
  }

  return (
    <Breadcrumb className="mr-1">
      <BreadcrumbList className="flex-nowrap">
        <BreadcrumbItem>
          <Button
            variant="link"
            className="px-0 text-xs md:text-sm"
            onClick={() => goTo()}>
            All Images
          </Button>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        {isSubDirectory(currentDirectory) && (
          <>
            <BreadcrumbSeparator />

            <BreadcrumbItem className="text-xs md:text-sm">
              {currentDirectory.name}
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )

}