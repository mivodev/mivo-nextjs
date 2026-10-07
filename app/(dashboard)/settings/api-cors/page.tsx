"use client"

import * as React from "react"
import { Plus, Edit2, Trash2, Shield, Globe } from "lucide-react"

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
import { Checkbox } from "@/components/ui/checkbox"
import { getCorsRules } from "@/modules/settings/actions"
import type { CorsRule } from "@/modules/settings/types"

const AVAILABLE_METHODS = ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"]

export default function ApiCorsPage() {
  const [rules, setRules] = React.useState<CorsRule[]>([])

  React.useEffect(() => {
    async function load() {
      const result = await getCorsRules()
      if (result.success) setRules(result.data)
    }
    load()
  }, [])

  // Modal Dialog states (Add & Edit)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingRule, setEditingRule] = React.useState<CorsRule | null>(null)
  const [origin, setOrigin] = React.useState("")
  const [selectedMethods, setSelectedMethods] = React.useState<string[]>([
    "GET",
    "POST",
  ])
  const [headers, setHeaders] = React.useState("Content-Type, Authorization")
  const [maxAge, setMaxAge] = React.useState(3600)

  // Delete Target state
  const [deleteTarget, setDeleteTarget] = React.useState<CorsRule | null>(null)

  const handleOpenAddModal = () => {
    setEditingRule(null)
    setOrigin("")
    setSelectedMethods(["GET", "POST"])
    setHeaders("Content-Type, Authorization")
    setMaxAge(3600)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (rule: CorsRule) => {
    setEditingRule(rule)
    setOrigin(rule.origin)
    setSelectedMethods(rule.methods)
    setHeaders(rule.headers)
    setMaxAge(rule.maxAge)
    setIsModalOpen(true)
  }

  const handleToggleMethod = (method: string) => {
    if (selectedMethods.includes(method)) {
      setSelectedMethods(selectedMethods.filter((m) => m !== method))
    } else {
      setSelectedMethods([...selectedMethods, method])
    }
  }

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault()
    if (!origin) return

    if (editingRule) {
      setRules(
        rules.map((r) =>
          r.id === editingRule.id
            ? {
                ...r,
                origin,
                methods: selectedMethods,
                headers,
                maxAge,
              }
            : r
        )
      )
    } else {
      const newRule: CorsRule = {
        id: `c_${Date.now()}`,
        origin,
        methods: selectedMethods,
        headers: headers || "*",
        maxAge: maxAge || 3600,
      }
      setRules([...rules, newRule])
    }

    setIsModalOpen(false)
  }

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return
    setRules(rules.filter((r) => r.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            API CORS Configuration
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage Cross-Origin Resource Sharing (CORS) security rules for external API access.
          </p>
        </div>

        <Button onClick={handleOpenAddModal} className="gap-2">
          <Plus className="size-4" />
          <span>Add CORS Rule</span>
        </Button>
      </div>

      {/* Rules Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Globe className="size-5 text-primary" />
                <span>Active CORS Rules</span>
              </CardTitle>
              <CardDescription>
                {rules.length} domain origins configured
              </CardDescription>
            </div>
            <Badge variant="outline" className="gap-1 border-emerald-500/30 text-emerald-500">
              <Shield className="size-3" /> Security Active
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Origin Domain</TableHead>
                  <TableHead>Allowed Methods</TableHead>
                  <TableHead>Allowed Headers</TableHead>
                  <TableHead>Max Age</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No CORS rules configured yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  rules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-mono text-xs font-semibold text-foreground">
                        {rule.origin}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {rule.methods.map((method) => (
                            <Badge
                              key={method}
                              variant="secondary"
                              className="text-[10px] font-mono"
                            >
                              {method}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                        {rule.headers}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground font-mono">
                        {rule.maxAge}s
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleOpenEditModal(rule)}
                          >
                            <Edit2 className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => setDeleteTarget(rule)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleSaveRule} className="space-y-4">
            <DialogHeader>
              <DialogTitle>
                {editingRule ? "Edit CORS Rule" : "Add CORS Rule"}
              </DialogTitle>
              <DialogDescription>
                Configure allowed origins, HTTP methods, and headers for client API calls.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="origin">Allowed Origin Domain</Label>
                <Input
                  id="origin"
                  placeholder="https://example.com or *"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  required
                />
                <p className="text-[11px] text-amber-500 font-medium">
                  Use * to allow all origins (not recommended for production).
                </p>
              </div>

              <div className="space-y-2">
                <Label>Allowed HTTP Methods</Label>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {AVAILABLE_METHODS.map((method) => {
                    const isChecked = selectedMethods.includes(method)
                    return (
                      <label
                        key={method}
                        className="flex items-center gap-2 p-2 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 cursor-pointer text-xs font-mono font-medium"
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => handleToggleMethod(method)}
                        />
                        <span>{method}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="headers">Allowed Headers</Label>
                <Input
                  id="headers"
                  placeholder="Content-Type, Authorization, *"
                  value={headers}
                  onChange={(e) => setHeaders(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxAge">Max Age (seconds)</Label>
                <Input
                  id="maxAge"
                  type="number"
                  value={maxAge}
                  onChange={(e) => setMaxAge(Number(e.target.value))}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingRule ? "Save Changes" : "Create Rule"}
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
            <AlertDialogTitle>Delete CORS Rule?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete CORS rule for origin{" "}
              <strong className="text-foreground font-mono">{deleteTarget?.origin}</strong>?
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
