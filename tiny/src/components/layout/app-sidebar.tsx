import { ChartLine, ChevronDown, ChevronLeft, Images, Library, Sparkles } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useDirectory } from '@/hooks/use-directory';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  useSidebar
} from '@/components/ui/sidebar';


export const AppSidebar = () => {

  const { data } = useDirectory();

  const totalImages = data?.meta.totalImages || 0;

  const { toggleSidebar, open } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="sticky h-full">
      <SidebarHeader className="border-b h-16 flex justify-center items-end">
        <Button
          data-sidebar="trigger"
          data-slot="sidebar-trigger"
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={toggleSidebar}>
          <ChevronLeft 
            className={cn(
            'size-4 transition-transform duration-200',
            open ? undefined : 'rotate-180'
            )} />
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="space-y-1.5">
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive>
              <a href="#">
                <Images />
                <span>Images</span>
              </a>
            </SidebarMenuButton>
            {totalImages> 0 && (
              <SidebarMenuBadge>{totalImages}</SidebarMenuBadge>
            )}
          </SidebarMenuItem>

          <Collapsible className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton>
                  <Library />
                  <span>Collections</span>
                  <ChevronDown className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                </SidebarMenuButton>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <SidebarMenuSub>
                  {/* TODO */}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#">
                <ChartLine />
                <span>Traffic Analytics</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#">
                <Sparkles />
                <span>Enrichment</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )

}