"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckCircle2, ShieldCheck, Database, Key, UserCheck, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Logo } from "@/components/logo"
import { siteConfig } from "@/lib/site-config"


export default function InstallPage() {
  const router = useRouter()
  const [username, setUsername] = React.useState("admin")
  const [password, setPassword] = React.useState("")
  const [isInstalling, setIsInstalling] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)

  const handleInstall = (e: React.FormEvent) => {
    e.preventDefault()
    setIsInstalling(true)

    // Simulate installation process
    setTimeout(() => {
      setIsInstalling(false)
      setIsSuccess(true)
    }, 1500)
  }

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md space-y-8">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="size-16 rounded-2xl bg-card border border-border flex items-center justify-center p-3 shadow-xs">
              <Logo className="size-12" width={48} height={48} priority />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome to {siteConfig.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            System Installation & Initial Setup
          </p>
        </div>

        {/* Form Card */}
        <Card className="shadow-md">
          {!isSuccess ? (
            <form onSubmit={handleInstall}>
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl">Setup Wizard</CardTitle>
                <CardDescription>
                  Configure your administrator account and database initialization.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* System Check Info */}
                <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 font-medium text-foreground">
                      <Database className="size-4 text-primary" />
                      Database Storage
                    </span>
                    <Badge variant="outline" className="gap-1 text-emerald-500 border-emerald-500/30">
                      <CheckCircle2 className="size-3" /> Writable
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 font-medium text-foreground">
                      <Key className="size-4 text-primary" />
                      Encryption Key
                    </span>
                    <Badge variant="outline" className="gap-1 text-emerald-500 border-emerald-500/30">
                      <CheckCircle2 className="size-3" /> Ready
                    </Badge>
                  </div>
                </div>

                {/* Step Checklist */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3 text-sm">
                    <div className="size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Database Setup</div>
                      <p className="text-xs text-muted-foreground">
                        Tables will be created automatically (SQLite).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm">
                    <div className="size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Security Token</div>
                      <p className="text-xs text-muted-foreground">
                        Secure encryption key generation for stored passwords.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm">
                    <div className="size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      3
                    </div>
                    <div className="w-full space-y-3">
                      <div className="font-medium text-foreground">Admin Credentials</div>

                      <div className="space-y-2">
                        <Label htmlFor="username">Administrator Username</Label>
                        <Input
                          id="username"
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="admin"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Administrator Password</Label>
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
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-2">
                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={isInstalling || !password}
                >
                  {isInstalling ? (
                    <span>Installing System...</span>
                  ) : (
                    <>
                      <span>Install {siteConfig.name}</span>
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          ) : (
            <div className="p-6 space-y-6">
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
