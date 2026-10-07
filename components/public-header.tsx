"use client"

import * as React from "react"
import Link from "next/link"
import { Bell, Languages, Menu, Home, Settings, Server } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ThemeToggleGroup } from "@/components/theme-toggle-group"
import { Logo } from "@/components/logo"
import { siteConfig } from "@/lib/site-config"

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand & Desktop Links */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <Logo className="size-7 transition-transform group-hover:scale-105" width={28} height={28} />
              <span className="font-bold text-lg tracking-tight">{siteConfig.name}</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link
                href="/"
                className="text-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <Link
                href="/settings"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Settings
              </Link>
            </nav>
          </div>

          {/* Right side controls (Desktop & Mobile) */}
          <div className="flex items-center gap-3">
            {/* Desktop Control Group */}
            <div className="hidden md:flex items-center gap-2 border border-border bg-card p-1 rounded-xl shadow-xs">
              {/* Notifications */}
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

              {/* Language Switcher */}
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

            {/* Mobile Sheet Navigation */}
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggleGroup />
              <Sheet>
                <SheetTrigger
                  render={
                    <Button variant="outline" size="icon-sm" aria-label="Open navigation menu" />
                  }
                >
                  <Menu className="size-4" />
                </SheetTrigger>
                <SheetContent side="right" className="p-6">
                  <SheetHeader className="p-0 mb-6">
                    <SheetTitle className="flex items-center gap-2.5">
                      <Logo className="size-6" width={24} height={24} />
                      <span>{siteConfig.name} Navigation</span>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-4">
                    <Link
                      href="/"
                      className="flex items-center gap-3 p-2 rounded-lg bg-muted/50 text-foreground font-medium text-sm"
                    >
                      <Home className="size-4" />
                      <span>Home</span>
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors font-medium text-sm"
                    >
                      <Settings className="size-4" />
                      <span>Settings</span>
                    </Link>

                    <div className="mt-6 pt-6 border-t border-border">
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        Quick Links
                      </div>
                      <Link
                        href={siteConfig.links.github}
                        target="_blank"
                        className="flex items-center gap-3 p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors font-medium text-sm"
                      >
                        <Server className="size-4" />
                        <span>Source Code</span>
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
