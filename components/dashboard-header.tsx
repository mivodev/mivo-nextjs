"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, usePathname, useRouter } from "next/navigation"
import { Bell, Languages, LogOut, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggleGroup } from "@/components/theme-toggle-group"
import { siteConfig } from "@/lib/site-config"

export function DashboardHeader() {
  const router = useRouter()
  const params = useParams()
  const pathname = usePathname()

  const currentSession = (params.session as string) || "Router-Main"

  // Determine current page name for breadcrumb
  let pageTitle = "Dashboard"
  if (pathname.includes("/settings")) pageTitle = "Settings"
  else if (pathname.includes("/quick-print")) pageTitle = "Quick Print"
  else if (pathname.includes("/hotspot/users")) pageTitle = "Hotspot Users"
  else if (pathname.includes("/hotspot/profiles")) pageTitle = "User Profiles"
  else if (pathname.includes("/hotspot/generate")) pageTitle = "Generate Vouchers"
  else if (pathname.includes("/hotspot/active")) pageTitle = "Active Sessions"

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Left: Sidebar Trigger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />

        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>
                {siteConfig.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {pathname !== "/settings" && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink render={<Link href={`/${currentSession}/dashboard`} />}>
                    {currentSession}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            <BreadcrumbItem>
              <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-1 sm:gap-2 border border-border bg-card p-1 rounded-xl shadow-xs">
          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon-sm" title="Notifications" />
              }
            >
              <Bell className="size-4" />
              <span className="sr-only">Notifications</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-4 text-center text-xs text-muted-foreground">
                No new notifications
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Language Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon-sm" title="Change Language" />
              }
            >
              <Languages className="size-4" />
              <span className="sr-only">Change Language</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Select Language</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span>English (US)</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Bahasa Indonesia</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle Group */}
          <ThemeToggleGroup />
        </div>

        {/* User Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="icon-sm"
                className="rounded-full size-8"
                title="Admin Profile"
              />
            }
          >
            <User className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-xs font-bold leading-none">Administrator</p>
                <p className="text-[11px] leading-none text-muted-foreground">
                  admin@mivo.local
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <span>System Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push("/login")}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className="size-3.5 mr-2" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
