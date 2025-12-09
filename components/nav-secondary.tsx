"use client"

import * as React from "react"
import { type Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: Icon
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props} id="nav-secondary-group">
      <SidebarGroupContent id="nav-secondary-group-content">
        <SidebarMenu id="nav-secondary-menu">
          {items.map((item) => (
            <SidebarMenuItem key={item.title} id={`nav-secondary-menu-item-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
              <SidebarMenuButton asChild id={`nav-secondary-menu-button-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <a href={item.url} id={`nav-secondary-link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  <item.icon id={`nav-secondary-icon-${item.title.toLowerCase().replace(/\s+/g, '-')}`} />
                  <span id={`nav-secondary-text-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
