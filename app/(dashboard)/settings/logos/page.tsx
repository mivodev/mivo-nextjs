"use client"

import * as React from "react"
import { UploadCloud, Hash, Trash2, Check, Copy, Image as ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { getLogos } from "@/modules/settings/actions"
import type { LogoItem } from "@/modules/settings/types"

export default function LogosPage() {
  const [logos, setLogos] = React.useState<LogoItem[]>([])

  React.useEffect(() => {
    async function load() {
      const result = await getLogos()
      if (result.success) setLogos(result.data)
    }
    load()
  }, [])
  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = React.useState<LogoItem | null>(null)
  const [notification, setNotification] = React.useState<string | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    const ext = file.name.split(".").pop()?.toUpperCase() || "PNG"
    const formattedSize = `${(file.size / 1024).toFixed(1)} KB`

    const newLogo: LogoItem = {
      id: `L0${logos.length + 1}`,
      name: file.name,
      path: URL.createObjectURL(file),
      type: ext,
      formattedSize,
    }

    setLogos([...logos, newLogo])
    setNotification(`Successfully uploaded ${file.name}`)
    setTimeout(() => setNotification(null), 3000)
  }

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id)
    setCopiedId(id)
    setNotification(`Logo ID "${id}" copied to clipboard.`)
    setTimeout(() => {
      setCopiedId(null)
      setNotification(null)
    }, 3000)
  }

  const handleDeleteLogo = () => {
    if (!deleteTarget) return
    setLogos(logos.filter((l) => l.id !== deleteTarget.id))
    setDeleteTarget(null)
    setNotification("Logo deleted successfully.")
    setTimeout(() => setNotification(null), 3000)
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Logo Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Upload and manage custom logos for your hotspot vouchers and print templates.
        </p>
      </div>

      {notification && (
        <div className="p-4 rounded-xl text-sm font-medium border bg-emerald-500/10 border-emerald-500/30 text-emerald-500">
          {notification}
        </div>
      )}

      {/* Upload Dropzone Section */}
      <Card className="border-dashed border-2 bg-muted/20 hover:bg-muted/40 transition-colors">
        <CardContent className="p-8">
          <label className="flex flex-col items-center justify-center cursor-pointer space-y-3">
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.svg,.gif"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shadow-xs">
              <UploadCloud className="size-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-semibold text-foreground">
                Upload New Logo
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Drag and drop or click to select image file
              </p>
              <p className="text-[11px] text-muted-foreground/70 mt-1">
                Supports PNG, JPG, SVG, GIF
              </p>
            </div>
          </label>
        </CardContent>
      </Card>

      {/* Gallery Section */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <ImageIcon className="size-5 text-primary" />
          <span>Uploaded Logos ({logos.length})</span>
        </h2>

        {logos.length === 0 ? (
          <div className="text-center py-12 border border-border rounded-xl bg-card">
            <p className="text-sm text-muted-foreground">
              No logos uploaded yet. Upload your first logo above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {logos.map((logo) => (
              <div
                key={logo.id}
                className="group relative rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-all flex flex-col"
              >
                {/* Image Preview Box with Checkered Pattern */}
                <div
                  className="aspect-square flex items-center justify-center p-4 relative"
                  style={{
                    backgroundImage:
                      "linear-gradient(45deg, rgba(0,0,0,0.05) 25%, transparent 25%), linear-gradient(-45deg, rgba(0,0,0,0.05) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.05) 75%), linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.05) 75%)",
                    backgroundSize: "16px 16px",
                    backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
                  }}
                >
                  <img
                    src={logo.path}
                    alt={logo.name}
                    className="max-w-full max-h-full object-contain transition-transform group-hover:scale-105"
                  />

                  {/* Hover Overlay Controls */}
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                    <Badge variant="outline" className="font-mono text-xs font-bold bg-background">
                      {logo.id}
                    </Badge>

                    <div className="flex items-center gap-2">
                      <Button
                        size="icon-sm"
                        variant="secondary"
                        title="Copy ID"
                        onClick={() => handleCopyId(logo.id)}
                      >
                        {copiedId === logo.id ? (
                          <Check className="size-4 text-emerald-500" />
                        ) : (
                          <Hash className="size-4" />
                        )}
                      </Button>

                      <Button
                        size="icon-sm"
                        variant="destructive"
                        title="Delete Logo"
                        onClick={() => setDeleteTarget(logo)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="p-3 border-t border-border bg-muted/20 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-foreground">
                      {logo.id}
                    </span>
                    <Badge variant="outline" className="text-[10px] uppercase">
                      {logo.type}
                    </Badge>
                  </div>
                  <p
                    className="text-xs text-muted-foreground truncate"
                    title={logo.name}
                  >
                    {logo.name}
                  </p>
                  <div className="text-[11px] text-muted-foreground/70">
                    {logo.formattedSize}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Alert */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Logo?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete logo{" "}
              <strong className="text-foreground">{deleteTarget?.name}</strong>{" "}
              ({deleteTarget?.id})?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteLogo}
              className="bg-destructive hover:bg-destructive/90"
            >
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
