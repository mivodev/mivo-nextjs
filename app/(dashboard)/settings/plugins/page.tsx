"use client"

import * as React from "react"
import { Upload, Plug, PackageSearch, Trash2, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
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
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getPlugins } from "@/modules/settings/actions"
import type { PluginItem } from "@/modules/settings/types"

export default function PluginsPage() {
  const [plugins, setPlugins] = React.useState<PluginItem[]>([])

  React.useEffect(() => {
    async function load() {
      const result = await getPlugins()
      if (result.success) setPlugins(result.data)
    }
    load()
  }, [])
  const [isUploadOpen, setIsUploadOpen] = React.useState(false)
  const [pluginFile, setPluginFile] = React.useState<File | null>(null)
  const [deleteTarget, setDeleteTarget] = React.useState<PluginItem | null>(null)
  const [notification, setNotification] = React.useState<string | null>(null)

  const handleUploadPlugin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pluginFile) return

    const newPlugin: PluginItem = {
      id: `plugin-${Date.now()}`,
      name: pluginFile.name.replace(".zip", ""),
      description: "Custom uploaded extension plugin.",
      version: "1.0.0",
      author: "Custom Upload",
      status: "active",
    }

    setPlugins([...plugins, newPlugin])
    setPluginFile(null)
    setIsUploadOpen(false)
    setNotification(`Plugin ${newPlugin.name} installed successfully.`)
    setTimeout(() => setNotification(null), 3000)
  }

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return
    setPlugins(plugins.filter((p) => p.id !== deleteTarget.id))
    setDeleteTarget(null)
    setNotification("Plugin removed successfully.")
    setTimeout(() => setNotification(null), 3000)
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Plugins & Extensions
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage, extend, and integrate custom features with plugins.
          </p>
        </div>

        <Button onClick={() => setIsUploadOpen(true)} className="gap-2">
          <Upload className="size-4" />
          <span>Upload Plugin</span>
        </Button>
      </div>

      {notification && (
        <div className="p-4 rounded-xl text-sm font-medium border bg-emerald-500/10 border-emerald-500/30 text-emerald-500">
          {notification}
        </div>
      )}

      {/* Plugins Table Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Plug className="size-5 text-primary" />
                <span>Installed Plugins</span>
              </CardTitle>
              <CardDescription>
                {plugins.length} plugins currently enabled
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plugin Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plugins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-3 rounded-full bg-muted">
                          <PackageSearch className="size-6 text-muted-foreground" />
                        </div>
                        <span className="font-semibold text-foreground">
                          No plugins installed
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Upload a <code className="text-xs font-mono">.zip</code> package to extend features.
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  plugins.map((plugin) => (
                    <TableRow key={plugin.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                            <Plug className="size-4" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground">
                              {plugin.name}
                            </div>
                            <div className="text-[11px] font-mono text-muted-foreground">
                              {plugin.id}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                        {plugin.description}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {plugin.version}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {plugin.author}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="gap-1 border-emerald-500/30 text-emerald-500 capitalize"
                        >
                          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {plugin.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => setDeleteTarget(plugin)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Upload Modal Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleUploadPlugin}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Upload className="size-5 text-primary" />
                <span>Upload Plugin Package</span>
              </DialogTitle>
              <DialogDescription>
                Select a valid plugin archive (<code className="text-xs font-mono">.zip</code>) to install.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="pluginFile">Plugin Archive File (.zip)</Label>
                <Input
                  id="pluginFile"
                  type="file"
                  accept=".zip"
                  onChange={(e) => setPluginFile(e.target.files?.[0] || null)}
                  required
                  className="cursor-pointer text-xs"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsUploadOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!pluginFile}>
                Install Plugin
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Plugin?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to uninstall plugin{" "}
              <strong className="text-foreground">{deleteTarget?.name}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              Yes, Uninstall
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
