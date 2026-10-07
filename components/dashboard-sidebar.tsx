"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter, usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Printer,
  Wifi,
  Activity,
  Shield,
  FileText,
  Network,
  Cpu,
  Settings,
  FileCode,
  BookOpen,
  MessageCircle,
  Cast,
  LogOut,
  ChevronsUpDown,
  PlusCircle,
  Check,
  ChevronDown,
  ExternalLink,
  Power,
  RotateCcw,
} from "lucide-react"
import { SiGithub } from "@icons-pack/react-simple-icons"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Logo } from "@/components/logo"
import { getRouterSessions } from "@/modules/router/actions"
import type { RouterSessionInfo } from "@/modules/router/types"
import { siteConfig } from "@/lib/site-config"

export function DashboardSidebar() {
  const router = useRouter()
  const params = useParams()
  const pathname = usePathname()

  const [routerSessions, setRouterSessions] = React.useState<RouterSessionInfo[]>([])

  React.useEffect(() => {
    async function load() {
      const result = await getRouterSessions()
      if (result.success) setRouterSessions(result.data)
    }
    load()
  }, [])

  const currentSession = (params['router-session'] as string) || routerSessions[0]?.sessionName || "Router-Main"

  // Get active router object
  const activeRouterObj = routerSessions.find((r) => r.sessionName === currentSession) || routerSessions[0]

  // Helper for session initials
  const getInitials = (name: string) => {
    if (!name) return "UN"
    if (name.includes("-")) {
      return name
        .split("-")
        .map((part) => part.substring(0, 1))
        .join("")
        .substring(0, 2)
        .toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      {/* Sidebar Header: Logo & Branding */}
      <SidebarHeader className="border-b border-sidebar-border py-4">
        <div className="flex items-center gap-2.5 px-2">
          <Logo className="size-7 shrink-0" width={28} height={28} />
          <span className="font-bold text-lg tracking-tight text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            {siteConfig.name}
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Session Switcher Card */}
        <SidebarGroup className="py-3">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <SidebarMenuButton
                      size="lg"
                      className="w-full data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border border-sidebar-border bg-sidebar-accent/30"
                    />
                  }
                >
                  <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                    {getInitials(currentSession)}
                  </div>
                  <div className="grid flex-1 text-left text-xs leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="font-semibold truncate text-sidebar-foreground">
                      {currentSession}
                    </span>
                    <span className="text-[10px] text-sidebar-foreground/70 truncate">
                      {activeRouterObj?.hotspotName || activeRouterObj?.ipAddress}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 shrink-0 text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden" />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-60 rounded-xl"
                  align="start"
                  side="bottom"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    Switch Router Session
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {routerSessions.map((r) => (
                    <DropdownMenuItem
                      key={r.id}
                      onClick={() => router.push(`/${r.sessionName}/dashboard`)}
                      className="flex items-center gap-2.5 cursor-pointer py-2"
                    >
                      <div className="size-7 rounded bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground uppercase">
                        {getInitials(r.sessionName)}
                      </div>
                      <div className="flex flex-col flex-1 overflow-hidden">
                        <span
                          className={`text-xs truncate ${
                            currentSession === r.sessionName ? "font-bold text-foreground" : ""
                          }`}
                        >
                          {r.sessionName}
                        </span>
                        <span className="text-[10px] text-muted-foreground truncate">
                          {r.hotspotName || r.ipAddress}
                        </span>
                      </div>
                      {currentSession === r.sessionName && (
                        <Check className="size-4 text-primary ml-auto" />
                      )}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push("/settings")}
                    className="cursor-pointer gap-2 text-primary font-medium"
                  >
                    <PlusCircle className="size-4" />
                    <span>Connect New Router...</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Main Navigation Group */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathname.includes("/dashboard")}
                tooltip="Dashboard"
                render={<Link href={`/${currentSession}/dashboard`} />}
              >
                <LayoutDashboard className="size-4" />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathname.includes("/quick-print")}
                tooltip="Quick Print"
                render={<Link href={`/${currentSession}/quick-print`} />}
              >
                <Printer className="size-4" />
                <span>Quick Print</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Hotspots Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Hotspots</SidebarGroupLabel>
          <SidebarMenu>
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger
                  render={
                    <SidebarMenuButton tooltip="Hotspot">
                      <Wifi className="size-4" />
                      <span>Hotspot</span>
                      <ChevronDown className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  }
                />
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={pathname.includes("/hotspot/users")}
                        render={<Link href={`/${currentSession}/hotspot/users`} />}
                      >
                        <span>Users</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={pathname.includes("/hotspot/profiles")}
                        render={<Link href={`/${currentSession}/hotspot/profiles`} />}
                      >
                        <span>User Profiles</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={pathname.includes("/hotspot/generate")}
                        render={<Link href={`/${currentSession}/hotspot/generate`} />}
                      >
                        <span>Generate</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={pathname.includes("/hotspot/cookies")}
                        render={<Link href={`/${currentSession}/hotspot/cookies`} />}
                      >
                        <span>Cookies</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>

        {/* Status Group */}
        <SidebarGroup>
          <SidebarMenu>
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger
                  render={
                    <SidebarMenuButton tooltip="Status">
                      <Activity className="size-4" />
                      <span>Status</span>
                      <ChevronDown className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  }
                />
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={pathname.includes("/hotspot/active")}
                        render={<Link href={`/${currentSession}/hotspot/active`} />}
                      >
                        <span>Active</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={pathname.includes("/hotspot/hosts")}
                        render={<Link href={`/${currentSession}/hotspot/hosts`} />}
                      >
                        <span>Hosts</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>

        {/* Security Group */}
        <SidebarGroup>
          <SidebarMenu>
            <Collapsible className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger
                  render={
                    <SidebarMenuButton tooltip="Security">
                      <Shield className="size-4" />
                      <span>Security</span>
                      <ChevronDown className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  }
                />
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={pathname.includes("/hotspot/bindings")}
                        render={<Link href={`/${currentSession}/hotspot/bindings`} />}
                      >
                        <span>IP Bindings</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={pathname.includes("/hotspot/walled-garden")}
                        render={<Link href={`/${currentSession}/hotspot/walled-garden`} />}
                      >
                        <span>Walled Garden</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>

        {/* Reports Group */}
        <SidebarGroup>
          <SidebarMenu>
            <Collapsible className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger
                  render={
                    <SidebarMenuButton tooltip="Reports">
                      <FileText className="size-4" />
                      <span>Reports</span>
                      <ChevronDown className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  }
                />
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={pathname.includes("/reports/resume")}
                        render={<Link href={`/${currentSession}/reports/resume`} />}
                      >
                        <span>Resume</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={pathname.includes("/reports/selling")}
                        render={<Link href={`/${currentSession}/reports/selling`} />}
                      >
                        <span>Selling Report</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={pathname.includes("/reports/user-log")}
                        render={<Link href={`/${currentSession}/reports/user-log`} />}
                      >
                        <span>User Log</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>

        {/* Network & System Groups */}
        <SidebarGroup>
          <SidebarMenu>
            <Collapsible className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger
                  render={
                    <SidebarMenuButton tooltip="Network">
                      <Network className="size-4" />
                      <span>Network</span>
                      <ChevronDown className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  }
                />
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={pathname.includes("/network/dhcp")}
                        render={<Link href={`/${currentSession}/network/dhcp`} />}
                      >
                        <span>DHCP Leases</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>

            <Collapsible className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger
                  render={
                    <SidebarMenuButton tooltip="System">
                      <Cpu className="size-4" />
                      <span>System</span>
                      <ChevronDown className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  }
                />
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={pathname.includes("/system/scheduler")}
                        render={<Link href={`/${currentSession}/system/scheduler`} />}
                      >
                        <span>Scheduler</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>

        {/* Systems Separator & Settings */}
        <SidebarGroup>
          <SidebarGroupLabel>Systems</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathname === "/settings"}
                tooltip="Settings"
                render={<Link href="/settings" />}
              >
                <Settings className="size-4" />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathname.includes("/voucher-templates")}
                tooltip="Templates"
                render={<Link href="/settings/voucher-templates" />}
              >
                <FileCode className="size-4" />
                <span>Voucher Templates</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Support Separator & Links */}
        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Documentation"
                render={
                  <Link href={siteConfig.links.docs} target="_blank" rel="noreferrer" />
                }
              >
                <BookOpen className="size-4" />
                <span>Documentation</span>
                <ExternalLink className="size-3 ml-auto opacity-50 group-data-[collapsible=icon]:hidden" />
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Community"
                render={
                  <Link href={siteConfig.links.discussions} target="_blank" rel="noreferrer" />
                }
              >
                <MessageCircle className="size-4" />
                <span>Community</span>
                <ExternalLink className="size-3 ml-auto opacity-50 group-data-[collapsible=icon]:hidden" />
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Repository"
                render={
                  <Link href={siteConfig.links.github} target="_blank" rel="noreferrer" />
                }
              >
                <SiGithub className="size-4" />
                <span>Repository</span>
                <ExternalLink className="size-3 ml-auto opacity-50 group-data-[collapsible=icon]:hidden" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer: Disconnect & Logout */}
      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Disconnect Session"
              render={<Link href="/" />}
              className="text-muted-foreground hover:text-foreground"
            >
              <Cast className="size-4" />
              <span>Disconnect Session</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Logout System"
              render={<Link href="/login" />}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="size-4" />
              <span>Logout System</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
