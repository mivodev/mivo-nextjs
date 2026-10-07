import * as React from "react"
import Link from "next/link"
import { Server, ArrowRight, ShieldCheck } from "lucide-react"
import { SiGithub } from "@icons-pack/react-simple-icons"

import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Kbd } from "@/components/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Logo } from "@/components/logo"
import { siteConfig } from "@/lib/site-config"
import { cn } from "@/lib/utils"

interface RouterItem {
  id: string
  sessionName: string
  hotspotName: string
  ipAddress: string
  status: "online" | "offline"
}

const mockQuickRouters: RouterItem[] = [
  {
    id: "r1",
    sessionName: "Router-Main",
    hotspotName: "Central Hotspot",
    ipAddress: "192.168.88.1",
    status: "online",
  },
  {
    id: "r2",
    sessionName: "Branch-North",
    hotspotName: "North Zone WiFi",
    ipAddress: "10.10.0.1",
    status: "online",
  },
]

export default function HomePage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 md:py-16 px-4 sm:px-6 text-center space-y-12">
      {/* Hero Section */}
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="size-20 rounded-2xl bg-card border border-border flex items-center justify-center p-3 shadow-xs">
            <Logo className="size-14" width={56} height={56} priority />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-foreground">
          {siteConfig.fullName}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {siteConfig.description}
        </p>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto text-left">
        <Link href="/settings" className="group block">
          <Card className="h-full transition-all duration-200 hover:border-foreground/50 hover:shadow-md">
            <CardHeader>
              <div className="size-10 rounded-lg bg-muted flex items-center justify-center mb-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Server className="size-5" />
              </div>
              <CardTitle className="flex items-center gap-2">
                <span>Manage Routers</span>
                <ArrowRight className="size-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </CardTitle>
              <CardDescription>
                Configure RouterOS connections and view active device status.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link
          href={siteConfig.links.github}
          target="_blank"
          rel="noreferrer"
          className="group block"
        >
          <Card className="h-full transition-all duration-200 hover:border-foreground/50 hover:shadow-md">
            <CardHeader>
              <div className="size-10 rounded-lg bg-muted flex items-center justify-center mb-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <SiGithub className="size-5" />
              </div>
              <CardTitle className="flex items-center gap-2">
                <span>Source Code</span>
                <ArrowRight className="size-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </CardTitle>
              <CardDescription>
                View the official project repository, report issues, and contribute.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* Quick Access Routers Table */}
      {mockQuickRouters.length > 0 && (
        <div className="text-left max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Quick Access
            </h2>
            <Badge variant="outline" className="gap-1">
              <ShieldCheck className="size-3 text-emerald-500" />
              <span>{mockQuickRouters.length} Routers Connected</span>
            </Badge>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session Name</TableHead>
                  <TableHead>Hotspot Name</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockQuickRouters.map((router) => (
                  <TableRow key={router.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-md bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground uppercase">
                          {router.sessionName.substring(0, 2)}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">
                            {router.sessionName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ID: {router.id}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">
                      {router.hotspotName}
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground text-xs">
                      {router.ipAddress}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/${router.sessionName}/dashboard`}
                        className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
                      >
                        Open
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Hotkey Hint */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground font-mono pt-4">
        <span>Press</span>
        <Tooltip>
          <TooltipTrigger render={<Kbd className="cursor-pointer">d</Kbd>} />
          <TooltipContent>
            <p>Global keyboard shortcut to switch theme</p>
          </TooltipContent>
        </Tooltip>
        <span>to toggle dark mode</span>
      </div>
    </div>
  )
}
