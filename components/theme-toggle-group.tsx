"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Sun, Moon, Laptop } from "lucide-react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function ThemeToggleGroup() {
  const { theme, setTheme } = useTheme()
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  if (!mounted) {
    return <div className="h-8 w-24 rounded-lg bg-muted animate-pulse" />
  }

  return (
    <ToggleGroup
      value={theme ? [theme] : []}
      onValueChange={(val) => {
        if (Array.isArray(val) && val.length > 0) {
          setTheme(val[val.length - 1])
        }
      }}
      size="sm"
      variant="outline"
      aria-label="Select theme"
    >
      <ToggleGroupItem value="light" aria-label="Light theme" title="Light Theme">
        <Sun className="size-3.5" />
      </ToggleGroupItem>
      <ToggleGroupItem value="dark" aria-label="Dark theme" title="Dark Theme">
        <Moon className="size-3.5" />
      </ToggleGroupItem>
      <ToggleGroupItem value="system" aria-label="System theme" title="System Theme">
        <Laptop className="size-3.5" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
