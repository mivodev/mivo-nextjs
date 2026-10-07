"use client"

import * as React from "react"
import { Plus, Edit3, Trash2, FileCode, CheckCircle2, Copy, Sparkles, LayoutTemplate } from "lucide-react"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { getVoucherTemplates, createVoucherTemplate, deleteVoucherTemplate } from "@/modules/settings/actions"
import type { VoucherTemplate } from "@/modules/settings/types"

export default function VoucherTemplatesPage() {
  const [templates, setTemplates] =
    React.useState<VoucherTemplate[]>([])

  // Load templates from DB on mount
  React.useEffect(() => {
    async function load() {
      const result = await getVoucherTemplates()
      if (result.success) setTemplates(result.data)
    }
    load()
  }, [])

  // Dialog Editor states (Add & Edit)
  const [isEditorOpen, setIsEditorOpen] = React.useState(false)
  const [editingTemplate, setEditingTemplate] =
    React.useState<VoucherTemplate | null>(null)
  const [templateName, setTemplateName] = React.useState("")
  const [paperSize, setPaperSize] = React.useState("58mm")
  const [templateContent, setTemplateContent] = React.useState("")

  // Delete Alert states
  const [deleteTarget, setDeleteTarget] =
    React.useState<VoucherTemplate | null>(null)

  const handleOpenAddModal = () => {
    setEditingTemplate(null)
    setTemplateName("")
    setPaperSize("58mm")
    setTemplateContent(
      `<div style="font-family: sans-serif; padding: 10px; border: 1px dashed #333; text-align: center;">\n  <h3 style="margin:0;">HOTSPOT VOUCHER</h3>\n  <div style="font-size: 14px; margin: 8px 0;">User: <b>{{username}}</b></div>\n  <div style="font-size: 14px; margin: 8px 0;">Pass: <b>{{password}}</b></div>\n  <div style="font-size: 10px; color: #666;">Price: Rp {{price}}</div>\n</div>`
    )
    setIsEditorOpen(true)
  }

  const handleOpenEditModal = (tpl: VoucherTemplate) => {
    setEditingTemplate(tpl)
    setTemplateName(tpl.name)
    setPaperSize(tpl.paperSize || "58mm")
    setTemplateContent(tpl.content || "")
    setIsEditorOpen(true)
  }

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!templateName) return

    if (editingTemplate) {
      // Update existing
      setTemplates(
        templates.map((t) =>
          t.id === editingTemplate.id
            ? {
                ...t,
                name: templateName,
                paperSize,
                content: templateContent,
              }
            : t
        )
      )
    } else {
      // Create new
      const newTpl: VoucherTemplate = {
        id: `tpl_${Date.now()}`,
        routerId: null,
        sessionName: "global",
        name: templateName,
        isSystem: false,
        paperSize,
        createdAt: new Date(),
        updatedAt: new Date(),
        content: templateContent,
      }
      setTemplates([...templates, newTpl])
    }

    setIsEditorOpen(false)
  }

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return
    setTemplates(templates.filter((t) => t.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Voucher Templates
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage and customize print templates for hotspot vouchers.
          </p>
        </div>

        <Button onClick={handleOpenAddModal} className="gap-2">
          <Plus className="size-4" />
          <span>New Template</span>
        </Button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tpl) => (
          <Card key={tpl.id} className="flex flex-col justify-between overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-base font-semibold text-foreground">
                    {tpl.name}
                  </CardTitle>
                  <CardDescription className="text-xs line-clamp-2 mt-1">
                    {tpl.description || `Format: ${tpl.paperSize || "Custom"}`}
                  </CardDescription>
                </div>
                {tpl.isSystem ? (
                  <Badge variant="outline" className="bg-muted text-xs">
                    System
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-primary/40 text-primary text-xs">
                    Custom
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Preview Box */}
              <div className="aspect-video rounded-lg border border-border bg-card p-3 overflow-hidden relative flex items-center justify-center">
                {tpl.content ? (
                  <div
                    className="w-full h-full text-[11px] overflow-auto select-none pointer-events-none scale-90"
                    dangerouslySetInnerHTML={{
                      __html: tpl.content
                        .replace(/{{username}}/g, "user882")
                        .replace(/{{password}}/g, "99214x")
                        .replace(/{{price}}/g, "5.000")
                        .replace(/{{validity}}/g, "1 Day"),
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center text-muted-foreground text-xs gap-1">
                    <FileCode className="size-6 opacity-40" />
                    <span>No Preview</span>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="flex items-center gap-2 pt-2 border-t border-border">
                {tpl.isSystem ? (
                  <Button variant="outline" size="sm" className="w-full text-xs" disabled>
                    Built-in System Template
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1.5"
                      onClick={() => handleOpenEditModal(tpl)}
                    >
                      <Edit3 className="size-3.5" />
                      <span>Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => setDeleteTarget(tpl)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add / Edit Template Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
          <form onSubmit={handleSaveTemplate} className="flex flex-col flex-1 space-y-4 overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <LayoutTemplate className="size-5 text-primary" />
                <span>
                  {editingTemplate ? "Edit Voucher Template" : "Create New Voucher Template"}
                </span>
              </DialogTitle>
              <DialogDescription>
                Customize HTML/CSS structure for your print template. Use variables like{" "}
                <code className="text-xs font-mono">{`{{username}}`}</code>,{" "}
                <code className="text-xs font-mono">{`{{password}}`}</code>, and{" "}
                <code className="text-xs font-mono">{`{{price}}`}</code>.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="templateName">Template Name</Label>
                <Input
                  id="templateName"
                  placeholder="e.g. VIP Thermal Receipt"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paperSize">Paper Format</Label>
                <Select
                  value={paperSize}
                  onValueChange={(val) => val && setPaperSize(val)}
                >
                  <SelectTrigger id="paperSize">
                    <SelectValue placeholder="Select Paper" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="58mm">58mm Thermal</SelectItem>
                    <SelectItem value="80mm">80mm Thermal</SelectItem>
                    <SelectItem value="A4">A4 Sheet Grid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Editor & Live Preview Split Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-[300px]">
              {/* Code Editor Panel */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="templateContent" className="text-xs font-semibold uppercase text-muted-foreground">
                  HTML/CSS Template Code
                </Label>
                <Textarea
                  id="templateContent"
                  value={templateContent}
                  onChange={(e) => setTemplateContent(e.target.value)}
                  className="flex-1 font-mono text-xs leading-relaxed resize-none p-3"
                  placeholder="Enter HTML template content..."
                />
              </div>

              {/* Real-time Preview Panel */}
              <div className="flex flex-col space-y-2">
                <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center justify-between">
                  <span>Live Preview</span>
                  <Badge variant="outline" className="text-[10px]">
                    Real-Time
                  </Badge>
                </Label>
                <div className="flex-1 rounded-xl border border-border bg-card p-4 overflow-auto flex items-center justify-center">
                  <div
                    className="w-full text-sm"
                    dangerouslySetInnerHTML={{
                      __html: templateContent
                        .replace(/{{username}}/g, "demo_user")
                        .replace(/{{password}}/g, "pass1234")
                        .replace(/{{price}}/g, "10.000")
                        .replace(/{{validity}}/g, "7 Days"),
                    }}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsEditorOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingTemplate ? "Save Changes" : "Create Template"}
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
            <AlertDialogTitle>Delete Voucher Template?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete template{" "}
              <strong className="text-foreground">{deleteTarget?.name}</strong>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
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
