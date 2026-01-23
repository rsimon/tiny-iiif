import { ChartLine, ChevronDown, ChevronLeft, Images, Library } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  useSidebar
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent } from '../ui/collapsible';
import { CollapsibleTrigger } from '@radix-ui/react-collapsible';
import { cn } from '@/lib/utils';

export const AppSidebar = () => {

  const { toggleSidebar, open } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="sticky">
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
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#">
                <Images />
                <span>Images</span>
              </a>
            </SidebarMenuButton>
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
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )

}