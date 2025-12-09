"use client"

import {
  IconDots,
  IconFolder,
  IconShare3,
  IconTrash,
  type Icon,
} from "@tabler/icons-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavDocuments({
  items,
}: {
  items: {
    name: string
    url: string
    icon: Icon
  }[]
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden" id="nav-documents-group">
      <SidebarGroupLabel id="nav-documents-group-label">Documents</SidebarGroupLabel>
      <SidebarMenu id="nav-documents-menu">
        {items.map((item) => (
          <SidebarMenuItem key={item.name} id={`nav-documents-menu-item-${item.name.toLowerCase().replace(/\s+/g, '-')}`}>
            <SidebarMenuButton asChild id={`nav-documents-menu-button-${item.name.toLowerCase().replace(/\s+/g, '-')}`}>
              <a href={item.url} id={`nav-documents-link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}>
                <item.icon id={`nav-documents-icon-${item.name.toLowerCase().replace(/\s+/g, '-')}`} />
                <span id={`nav-documents-text-${item.name.toLowerCase().replace(/\s+/g, '-')}`}>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu id={`nav-documents-dropdown-${item.name.toLowerCase().replace(/\s+/g, '-')}`}>
              <DropdownMenuTrigger asChild id={`nav-documents-dropdown-trigger-${item.name.toLowerCase().replace(/\s+/g, '-')}`}>
                <SidebarMenuAction
                  showOnHover
                  className="data-[state=open]:bg-accent rounded-sm"
                  id={`nav-documents-action-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <IconDots id={`nav-documents-dots-icon-${item.name.toLowerCase().replace(/\s+/g, '-')}`} />
                  <span className="sr-only" id={`nav-documents-more-text-${item.name.toLowerCase().replace(/\s+/g, '-')}`}>More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-24 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
                id={`nav-documents-dropdown-content-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <DropdownMenuItem id={`nav-documents-dropdown-item-open-${item.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  <IconFolder id={`nav-documents-dropdown-icon-open-${item.name.toLowerCase().replace(/\s+/g, '-')}`} />
                  <span id={`nav-documents-dropdown-text-open-${item.name.toLowerCase().replace(/\s+/g, '-')}`}>Open</span>
                </DropdownMenuItem>
                <DropdownMenuItem id={`nav-documents-dropdown-item-share-${item.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  <IconShare3 id={`nav-documents-dropdown-icon-share-${item.name.toLowerCase().replace(/\s+/g, '-')}`} />
                  <span id={`nav-documents-dropdown-text-share-${item.name.toLowerCase().replace(/\s+/g, '-')}`}>Share</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator id={`nav-documents-dropdown-separator-${item.name.toLowerCase().replace(/\s+/g, '-')}`} />
                <DropdownMenuItem variant="destructive" id={`nav-documents-dropdown-item-delete-${item.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  <IconTrash id={`nav-documents-dropdown-icon-delete-${item.name.toLowerCase().replace(/\s+/g, '-')}`} />
                  <span id={`nav-documents-dropdown-text-delete-${item.name.toLowerCase().replace(/\s+/g, '-')}`}>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem id="nav-documents-menu-item-more">
          <SidebarMenuButton className="text-sidebar-foreground/70" id="nav-documents-menu-button-more">
            <IconDots className="text-sidebar-foreground/70" id="nav-documents-icon-more" />
            <span id="nav-documents-text-more">More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
