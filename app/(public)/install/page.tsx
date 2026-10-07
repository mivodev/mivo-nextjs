"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, ShieldCheck, Database, Key, UserCheck, ArrowRight, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Logo } from "@/components/logo"
import { toast } from "sonner"
import { siteConfig } from "@/lib/site-config"
import { runSystemInstall } from "@/modules/install/actions"

export default function InstallPage() {
  const router = useRouter()
  const [username, setUsername] = React.useState("admin")
  const [email, setEmail] = React.useState("admin@mivo.local")
  const [password, setPassword] = React.useState("")
  const [isInstalling, setIsInstalling] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [isSuccess, setIsSuccess] = React.useState(false)

  const handleInstall = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setIsInstalling(true)
    const toastId = toast.loading("Initializing database and administrator account...")

    try {
      const res = await runSystemInstall({ username, email, password })
      if (!res.success) {
        const error = res.error || "Installation failed. Please try again."
        setErrorMessage(error)
        toast.error(error, { id: toastId })
        setIsInstalling(false)
        return
      }
      toast.success("Installation completed successfully!", { id: toastId })
      setIsSuccess(true)
    } catch (err) {
      const msg = (err as Error).message || "An unexpected error occurred."
      setErrorMessage(msg)
      toast.error(msg, { id: toastId })
    } finally {
      setIsInstalling(false)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="size-14 rounded-2xl bg-card border border-border flex items-center justify-center p-2.5 shadow-xs">
              <Logo className="size-10" width={40} height={40} priority />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome to {siteConfig.name}
          </h1>
          <p className="text-xs text-muted-foreground">System Installation & Initial Setup</p>
        </div>

        <Card className="shadow-md">
          {!isSuccess ? (
            <form onSubmit={handleInstall}>
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl">Setup Wizard</CardTitle>
                <CardDescription>
                  Configure your administrator credentials and initialize the database.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {errorMessage && (
                  <Alert variant="destructive">
                    <AlertCircle className="size-4" />
                    <AlertTitle>Setup Error</AlertTitle>
                    <AlertDescription className="text-xs">{errorMessage}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 font-medium text-foreground">
                      <Database className="size-4 text-primary" /> SQLite Database
                    </span>
                    <Badge variant="outline" className="gap-1 text-emerald-500 border-emerald-500/30">
                      <CheckCircle2 className="size-3" /> Ready
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 font-medium text-foreground">
                      <Key className="size-4 text-primary" /> Encryption & Auth
                    </span>
                    <Badge variant="outline" className="gap-1 text-emerald-500 border-emerald-500/30">
                      <CheckCircle2 className="size-3" /> Ready
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="username">Admin Username</Label>
                    <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Admin Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="password">Admin Password (min. 8 chars)</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      minLength={8}
                      required
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-2">
                <Button type="submit" className="w-full gap-2" disabled={isInstalling || !password}>
                  {isInstalling ? "Installing System..." : (
                    <>
                      <span>Install {siteConfig.name}</span>
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          ) : (
            <div className="p-6 space-y-4">
              <Alert className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="size-5" />
                <AlertTitle className="font-bold">Installation Complete!</AlertTitle>
                <AlertDescription className="text-xs">
                  {siteConfig.name} has been successfully installed. You can now sign in using your admin account.
                </AlertDescription>
              </Alert>

              <Button className="w-full gap-2" onClick={() => router.push("/login")}>
                <span>Go to Login</span>
                <UserCheck className="size-4" />
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
