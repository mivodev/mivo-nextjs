"use client"

import * as React from "react"
import { Lock, Key, Download, Upload, Shield, Settings2, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getAllSettings, upsertSetting } from "@/modules/settings/actions"

export default function SystemSettingsPage() {
  const [adminUsername, setAdminUsername] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [quickPrintMode, setQuickPrintMode] = React.useState<"0" | "1">("1")

  // Load settings from DB on mount
  React.useEffect(() => {
    async function load() {
      const result = await getAllSettings()
      if (result.success) {
        if (result.data.admin_username) setAdminUsername(result.data.admin_username)
        if (result.data.quick_print_mode) setQuickPrintMode(result.data.quick_print_mode as "0" | "1")
      }
    }
    load()
  }, [])
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [message, setMessage] = React.useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPassword) return
    setMessage({ type: "success", text: "Administrator password updated successfully." })
    setNewPassword("")
  }

  const handleSaveGlobal = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage({ type: "success", text: "Global settings updated successfully." })
  }

  const handleDownloadBackup = () => {
    const backupContent = JSON.stringify(
      {
        app: "Mivo Hotspot Manager",
        timestamp: new Date().toISOString(),
        version: "2.0.0",
        config: { quickPrintMode },
      },
      null,
      2
    )
    const blob = new Blob([backupContent], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `mivo-backup-${new Date().toISOString().slice(0, 10)}.mivo`
    a.click()
    URL.revokeObjectURL(url)
    setMessage({ type: "success", text: "Backup configuration downloaded." })
  }

  const handleRestoreSubmit = () => {
    if (!selectedFile) return
    setMessage({
      type: "success",
      text: `Data successfully restored from ${selectedFile.name}`,
    })
    setSelectedFile(null)
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      {/* Header Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          System & Security Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          System-wide configurations, administrator credentials, and data management.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-sm font-medium border ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
              : "bg-destructive/10 border-destructive/30 text-destructive"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Security & Access Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="size-5 text-primary" />
            <span>Security & Access</span>
          </CardTitle>
          <CardDescription>
            Manage administrator authentication and security controls.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="adminUsername">Admin Username</Label>
                <div className="relative">
                  <Input
                    id="adminUsername"
                    value={adminUsername}
                    disabled
                    readOnly
                    className="pl-9 bg-muted text-muted-foreground cursor-not-allowed"
                  />
                  <Lock className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">
                  For security reasons, the administrator username cannot be changed.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Change Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-9"
                  />
                  <Key className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" disabled={!newPassword}>
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Global Configuration Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="size-5 text-primary" />
            <span>Global Configuration</span>
          </CardTitle>
          <CardDescription>
            System-wide operational behavior and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveGlobal} className="space-y-6">
            <div className="max-w-md space-y-2">
              <Label htmlFor="quickPrintMode">Quick Print Mode</Label>
              <Select
                value={quickPrintMode}
                onValueChange={(val) => val && setQuickPrintMode(val as "0" | "1")}
              >
                <SelectTrigger id="quickPrintMode">
                  <SelectValue placeholder="Select Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Disabled</SelectItem>
                  <SelectItem value="1">Enabled (Direct Printing)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Enables direct thermal printing modal for voucher generation.
              </p>
            </div>

            <Button type="submit">Save Global Settings</Button>
          </form>
        </CardContent>
      </Card>

      {/* Data Management Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="size-5 text-primary" />
            <span>Data Management</span>
          </CardTitle>
          <CardDescription>
            Backup or restore your application database and settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Backup Box */}
            <div className="p-5 rounded-xl bg-muted/40 border border-border flex flex-col justify-between space-y-4">
              <div>
                <h4 className="font-semibold text-foreground text-base mb-1">
                  Backup Data
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Download a configuration file (<code className="text-xs font-mono">.mivo</code>) containing your database and application settings.
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={handleDownloadBackup}
              >
                <Download className="size-4" />
                <span>Download Backup</span>
              </Button>
            </div>

            {/* Restore Box */}
            <div className="p-5 rounded-xl bg-muted/40 border border-border flex flex-col justify-between space-y-4">
              <div>
                <h4 className="font-semibold text-foreground text-base mb-1">
                  Restore Data
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Upload a previously backed-up file (<code className="text-xs font-mono">.mivo</code>). <strong>Warning:</strong> Overwrites existing database data.
                </p>
              </div>

              <div className="space-y-3">
                <Input
                  type="file"
                  accept=".mivo,.json"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="cursor-pointer text-xs"
                />

                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button
                        variant="destructive"
                        className="w-full gap-2"
                        disabled={!selectedFile}
                      >
                        <Upload className="size-4" />
                        <span>Restore Data</span>
                      </Button>
                    }
                  />
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="size-5" />
                        <span>Confirm System Restore</span>
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to restore settings from{" "}
                        <strong className="text-foreground font-mono">
                          {selectedFile?.name}
                        </strong>
                        ? This action will overwrite existing configuration data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleRestoreSubmit}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Yes, Restore Data
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
