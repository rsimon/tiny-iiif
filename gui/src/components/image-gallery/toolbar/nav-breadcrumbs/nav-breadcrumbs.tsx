import { useUIState } from '@/hooks/use-ui-state';
import { Button } from '@/components/ui/button';
import type { Directory } from '@/types';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';

export const NavBreadcrumbs = () => {

  const currentDirectory = useUIState(state => state.currentDirectory);
  const setCurrentDirectory = useUIState(state => state.setCurrentDirectory);

  console.log('current', currentDirectory);

  const onGoTo = (directory: Directory) => {
    const { breadcrumbs } = currentDirectory;

    const destination = {
      ...directory,
      breadcrumbs: breadcrumbs.slice(0, breadcrumbs.indexOf(directory))
    };

    console.log('go to', destination);

    setCurrentDirectory(destination);
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">All Images</BreadcrumbLink>
        </BreadcrumbItem>

        {currentDirectory?.breadcrumbs.map(dir => (
          <>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <Button
                variant="ghost"
                onClick={() => onGoTo(dir)}>
                {dir.name}
              </Button>
            </BreadcrumbItem>
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )

}