"use client"

import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

export function NavUser() {
  const { isMobile } = useSidebar()
  const { data: session, isPending } = authClient.useSession()

  const handleSignOut = async () => {
    await authClient.signOut()
  }

  const handleSignIn = async () => {
    await authClient.signIn.social({
      provider: "github",
    })
  }

  // Show loading state
  if (isPending) {
    return (
      <SidebarMenu id="nav-user-menu-loading">
        <SidebarMenuItem id="nav-user-menu-item-loading">
          <SidebarMenuButton size="lg" disabled id="nav-user-menu-button-loading">
            <div className="h-8 w-8 rounded-lg bg-muted animate-pulse" id="nav-user-loading-avatar" />
            <div className="grid flex-1 text-left text-sm leading-tight" id="nav-user-loading-text-container">
              <div className="h-4 w-24 bg-muted rounded animate-pulse" id="nav-user-loading-text-line-1" />
              <div className="h-3 w-32 bg-muted rounded animate-pulse mt-1" id="nav-user-loading-text-line-2" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  // Show sign in button when not authenticated
  if (!session?.user) {
    return (
      <SidebarMenu id="nav-user-menu-signin">
        <SidebarMenuItem id="nav-user-menu-item-signin">
          <SidebarMenuButton size="lg" asChild id="nav-user-menu-button-signin">
            <Button
              onClick={handleSignIn}
              className="w-full justify-start"
              variant="ghost"
              id="nav-user-button-signin"
            >
              <IconUserCircle className="h-8 w-8" id="nav-user-icon-signin" />
              <span className="text-sm" id="nav-user-text-signin">Sign in with GitHub</span>
            </Button>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  // Show user info when authenticated
  const user = session.user
  const userName = user.name || user.email?.split("@")[0] || "User"
  const userEmail = user.email || ""
  const userAvatar = user.image || ""

  // Generate initials for avatar fallback
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <SidebarMenu id="nav-user-menu-authenticated">
      <SidebarMenuItem id="nav-user-menu-item-authenticated">
        <DropdownMenu id="nav-user-dropdown-menu">
          <DropdownMenuTrigger asChild id="nav-user-dropdown-trigger">
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              id="nav-user-menu-button-authenticated"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale" id="nav-user-avatar-button">
                <AvatarImage src={userAvatar} alt={userName} id="nav-user-avatar-image-button" />
                <AvatarFallback className="rounded-lg" id="nav-user-avatar-fallback-button">{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight" id="nav-user-info-container-button">
                <span className="truncate font-medium" id="nav-user-name-button">{userName}</span>
                {userEmail && (
                  <span className="text-muted-foreground truncate text-xs" id="nav-user-email-button">
                    {userEmail}
                  </span>
                )}
              </div>
              <IconDotsVertical className="ml-auto size-4" id="nav-user-dots-icon-button" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
            id="nav-user-dropdown-content"
          >
            <DropdownMenuLabel className="p-0 font-normal" id="nav-user-dropdown-label">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm" id="nav-user-dropdown-label-container">
                <Avatar className="h-8 w-8 rounded-lg" id="nav-user-avatar-dropdown">
                  <AvatarImage src={userAvatar} alt={userName} id="nav-user-avatar-image-dropdown" />
                  <AvatarFallback className="rounded-lg" id="nav-user-avatar-fallback-dropdown">{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight" id="nav-user-info-container-dropdown">
                  <span className="truncate font-medium" id="nav-user-name-dropdown">{userName}</span>
                  {userEmail && (
                    <span className="text-muted-foreground truncate text-xs" id="nav-user-email-dropdown">
                      {userEmail}
                    </span>
                  )}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator id="nav-user-dropdown-separator-1" />
            <DropdownMenuGroup id="nav-user-dropdown-group">
              <DropdownMenuItem id="nav-user-dropdown-item-account">
                <IconUserCircle id="nav-user-dropdown-icon-account" />
                <span id="nav-user-dropdown-text-account">Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem id="nav-user-dropdown-item-billing">
                <IconCreditCard id="nav-user-dropdown-icon-billing" />
                <span id="nav-user-dropdown-text-billing">Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem id="nav-user-dropdown-item-notifications">
                <IconNotification id="nav-user-dropdown-icon-notifications" />
                <span id="nav-user-dropdown-text-notifications">Notifications</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator id="nav-user-dropdown-separator-2" />
            <DropdownMenuItem onClick={handleSignOut} id="nav-user-dropdown-item-logout">
              <IconLogout id="nav-user-dropdown-icon-logout" />
              <span id="nav-user-dropdown-text-logout">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
