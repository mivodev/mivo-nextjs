"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  href: string
}

const settingsNavItems: NavItem[] = [
  { label: "Routers", href: "/settings" },
  { label: "System", href: "/settings/system" },
  { label: "Templates", href: "/settings/voucher-templates" },
  { label: "Logos", href: "/settings/logos" },
  { label: "API & CORS", href: "/settings/api-cors" },
  { label: "Plugins", href: "/settings/plugins" },
]

export function SettingsSubNav() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/settings") {
      return pathname === "/settings" || pathname === "/settings/"
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="w-full sticky top-[64px] z-40 bg-background/95 backdrop-blur border-b border-border py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {settingsNavItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  buttonVariants({
                    variant: active ? "default" : "ghost",
                    size: "sm",
                  }),
                  "rounded-full text-xs font-medium whitespace-nowrap transition-all"
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
