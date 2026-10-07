"use client"

import * as React from "react"
import Link from "next/link"
import { Plus, Server, ShieldCheck, ExternalLink, Trash2, Loader2 } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { getRouters, createRouter, deleteRouter } from "@/modules/router/actions"
import type { RouterRecord } from "@/modules/router/types"

export default function SettingsPage() {
  const [routers, setRouters] = React.useState<RouterRecord[]>([])
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Form states for new router connection
  const [sessionName, setSessionName] = React.useState("")
  const [hotspotName, setHotspotName] = React.useState("")
  const [ipAddress, setIpAddress] = React.useState("")
  const [username, setUsername] = React.useState("")
  const [password, setPassword] = React.useState("")

  // Fetch routers on mount
  React.useEffect(() => {
    async function fetchRouters() {
      const result = await getRouters()
      if (result.success) {
        setRouters(result.data)
      }
      setIsLoading(false)
    }
    fetchRouters()
  }, [])

  const handleAddRouter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sessionName || !ipAddress || !username) return

    setIsSubmitting(true)
    const result = await createRouter({
      name: sessionName,
      sessionName,
      ipAddress,
      username,
      password,
      hotspotName: hotspotName || undefined,
    })

    if (result.success) {
      setRouters((prev) => [...prev, result.data])
      setSessionName("")
      setHotspotName("")
      setIpAddress("")
      setUsername("")
      setPassword("")
      setIsOpen(false)
    }
    setIsSubmitting(false)
  }

  const handleDeleteRouter = async (id: string) => {
    const result = await deleteRouter(id)
    if (result.success) {
      setRouters((prev) => prev.filter((r) => r.id !== id))
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Router Sessions & Connections
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your connected MikroTik RouterOS devices and session profiles.
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger
            render={
              <Button className="gap-2">
                <Plus className="size-4" />
                <span>Add Router Session</span>
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md">
            <form onSubmit={handleAddRouter}>
              <DialogHeader>
                <DialogTitle>Add New Router Connection</DialogTitle>
                <DialogDescription>
                  Enter your RouterOS connection parameters to create a new session.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionName">Session Name</Label>
                  <Input
                    id="sessionName"
                    placeholder="e.g. Router-Branch-East"
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hotspotName">Hotspot Server Name</Label>
                  <Input
                    id="hotspotName"
                    placeholder="e.g. East Branch WiFi"
                    value={hotspotName}
                    onChange={(e) => setHotspotName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ipAddress">Router IP Address</Label>
                  <Input
                    id="ipAddress"
                    placeholder="192.168.88.1"
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="routerUsername">RouterOS Username</Label>
                  <Input
                    id="routerUsername"
                    placeholder="admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="routerPassword">RouterOS Password</Label>
                  <Input
                    id="routerPassword"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="size-4 animate-spin mr-2" />}
                  Connect Router
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Routers Table Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Server className="size-5 text-primary" />
                <span>Active Router Connections</span>
              </CardTitle>
              <CardDescription>
                {routers.length} router sessions configured
              </CardDescription>
            </div>
            <Badge variant="outline" className="gap-1 border-emerald-500/30 text-emerald-500">
              <ShieldCheck className="size-3" /> System Ready
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : routers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Server className="size-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No routers connected yet.</p>
              <p className="text-xs mt-1">Click &quot;Add Router Session&quot; to get started.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Session Name</TableHead>
                    <TableHead>Hotspot Name</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Protocol</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {routers.map((router) => (
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
                              {router.name}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{router.hotspotName || "—"}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {router.ipAddress}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        <div>RouterOS {router.rosVersion}</div>
                        <div className="text-[11px] opacity-70">{router.connectionType} · port {router.port}</div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="gap-1 border-emerald-500/30 text-emerald-500 capitalize"
                        >
                          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          registered
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/${router.sessionName}/dashboard`}
                            className={cn(
                              buttonVariants({ variant: "default", size: "sm" }),
                              "gap-1.5"
                            )}
                          >
                            <span>Open Dashboard</span>
                            <ExternalLink className="size-3.5" />
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteRouter(router.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
