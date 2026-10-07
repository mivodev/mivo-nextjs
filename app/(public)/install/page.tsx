"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  CheckCircle2,
  ShieldCheck,
  Database,
  Key,
  UserCheck,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Copy,
  Lock,
} from "lucide-react"

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

function generateRandomSecret(): string {
  if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
    const bytes = new Uint8Array(32)
    window.crypto.getRandomValues(bytes)
    return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")
  }
  return "mivo_" + Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export default function InstallPage() {
  const router = useRouter()
  const [username, setUsername] = React.useState("admin")
  const [email, setEmail] = React.useState("admin@mivo.local")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [secret, setSecret] = React.useState("")
  const [showSecret, setShowSecret] = React.useState(false)
  const [isInstalling, setIsInstalling] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [isSuccess, setIsSuccess] = React.useState(false)

  React.useEffect(() => {
    setSecret(generateRandomSecret())
  }, [])

  const handleRegenerateSecret = () => {
    const newSecret = generateRandomSecret()
    setSecret(newSecret)
    toast.info("Generated a new encryption secret key.")
  }

  const handleCopySecret = async () => {
    if (!secret) return
    await navigator.clipboard.writeText(secret)
    toast.success("Secret key copied to clipboard.")
  }

  const handleInstall = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setIsInstalling(true)
    const toastId = toast.loading("Initializing database and setting up system...")

    try {
      const res = await runSystemInstall({ username, email, password, secret })
      if (!res.success) {
        const error = res.error || "Installation failed. Please try again."
        setErrorMessage(error)
        toast.error(error, { id: toastId })
        setIsInstalling(false)
        return
      }
      toast.success("MIVO successfully installed!", { id: toastId })
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
    <div className="flex-1 flex items-center justify-center py-4 sm:py-8">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="size-14 rounded-2xl bg-card border border-border flex items-center justify-center p-2.5 shadow-xs">
              <Logo className="size-10" width={40} height={40} priority />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome to {siteConfig.name}
          </h1>
          <p className="text-xs text-muted-foreground">System Installation & Initial Setup Wizard</p>
        </div>

        <Card className="shadow-lg border-border/70 overflow-hidden pt-0 pb-0 gap-0">
          {!isSuccess ? (
            <form onSubmit={handleInstall} className="flex flex-col">
              <CardHeader className="px-6 pt-6 pb-4 space-y-1.5 border-b border-border/40">
                <CardTitle className="text-xl">Setup Wizard</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Configure your administrator credentials, encryption keys, and initialize the database.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 space-y-5">
                {errorMessage && (
                  <Alert variant="destructive">
                    <AlertCircle className="size-4" />
                    <AlertTitle>Setup Error</AlertTitle>
                    <AlertDescription className="text-xs">{errorMessage}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-2 gap-3 rounded-xl border border-border/70 bg-muted/30 p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-medium text-foreground">
                      <Database className="size-3.5 text-primary" /> SQLite DB
                    </span>
                    <Badge variant="outline" className="text-[10px] text-emerald-500 border-emerald-500/30 py-0">
                      <CheckCircle2 className="size-3 mr-0.5" /> Ready
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-medium text-foreground">
                      <Key className="size-3.5 text-primary" /> Auth Secret
                    </span>
                    <Badge variant="outline" className="text-[10px] text-emerald-500 border-emerald-500/30 py-0">
                      <CheckCircle2 className="size-3 mr-0.5" /> Ready
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Auth Secret Section */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="secret" className="text-xs font-semibold flex items-center gap-1.5">
                        <Lock className="size-3 text-muted-foreground" />
                        Auth Secret Key
                      </Label>
                      <span className="text-[11px] text-muted-foreground">32-byte Cryptographic Secret</span>
                    </div>
                    <div className="relative flex items-center">
                      <Input
                        id="secret"
                        type={showSecret ? "text" : "password"}
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                        className="font-mono text-xs pr-24 tracking-wider"
                        required
                      />
                      <div className="absolute right-1 flex items-center gap-0.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-7 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowSecret(!showSecret)}
                          title={showSecret ? "Hide secret" : "Show secret"}
                        >
                          {showSecret ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-7 text-muted-foreground hover:text-foreground"
                          onClick={handleCopySecret}
                          title="Copy to clipboard"
                        >
                          <Copy className="size-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-7 text-muted-foreground hover:text-foreground"
                          onClick={handleRegenerateSecret}
                          title="Regenerate secret"
                        >
                          <RefreshCw className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Credentials Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="username" className="text-xs">Admin Username</Label>
                      <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs">Admin Email</Label>
                      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-xs">Admin Password (min. 8 characters)</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        minLength={8}
                        className="pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="border-t border-border/50 bg-muted/20 px-6 py-4 flex items-center justify-center">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-11 text-sm font-semibold gap-2 shadow-xs"
                  disabled={isInstalling || !password || !secret}
                >
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
            <div className="p-6 sm:p-8 space-y-5">
              <Alert className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="size-5" />
                <AlertTitle className="font-bold text-sm">Installation Complete!</AlertTitle>
                <AlertDescription className="text-xs mt-1">
                  {siteConfig.name} has been successfully installed. You can now sign in using your admin credentials.
                </AlertDescription>
              </Alert>

              <Button className="w-full gap-2 shadow-xs" onClick={() => router.push("/login")}>
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
