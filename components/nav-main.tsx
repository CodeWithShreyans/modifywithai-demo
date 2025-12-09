"use client"

import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  return (
    <SidebarGroup id="nav-main-group">
      <SidebarGroupContent className="flex flex-col gap-2" id="nav-main-group-content">
        <SidebarMenu id="nav-main-menu-quick-create">
          <SidebarMenuItem className="flex items-center gap-2" id="nav-main-menu-item-quick-create">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
              id="nav-main-menu-button-quick-create"
            >
              <IconCirclePlusFilled id="nav-main-icon-quick-create" />
              <span id="nav-main-text-quick-create">Quick Create</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
              id="nav-main-button-inbox"
            >
              <IconMail id="nav-main-icon-inbox" />
              <span className="sr-only" id="nav-main-text-inbox-sr">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu id="nav-main-menu-items">
          {items.map((item) => (
            <SidebarMenuItem key={item.title} id={`nav-main-menu-item-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
              <SidebarMenuButton tooltip={item.title} id={`nav-main-menu-button-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                {item.icon && <item.icon id={`nav-main-icon-${item.title.toLowerCase().replace(/\s+/g, '-')}`} />}
                <span id={`nav-main-text-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
