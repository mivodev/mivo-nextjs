"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, KeyRound, Eye, EyeOff, LogIn } from "lucide-react"

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
import { Logo } from "@/components/logo"
import { siteConfig } from "@/lib/site-config"
import { getRouterSessions } from "@/modules/router/actions"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = React.useState("admin")
  const [password, setPassword] = React.useState("password123")
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate authentication delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)

    const routersResult = await getRouterSessions()
    const sessions = routersResult.success ? routersResult.data : []
    const defaultSession = sessions[0]?.sessionName || "Router-Main"
    router.push(`/${defaultSession}/dashboard`)
  }

  return (
    <div className="w-full space-y-6">
      {/* Header Branding */}
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <Link href="/">
            <div className="size-16 rounded-2xl bg-card border border-border flex items-center justify-center p-3 shadow-xs hover:border-foreground/50 transition-colors">
              <Logo className="size-12" width={48} height={48} priority />
            </div>
          </Link>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your {siteConfig.name} management dashboard
        </p>
      </div>

      {/* Form Card */}
      <Card className="shadow-md">
        <form onSubmit={handleLogin}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials below to access connected routers.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <User className="size-4" />
                </div>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-9"
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <KeyRound className="size-4" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-9"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full gap-2" disabled={isLoading}>
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <LogIn className="size-4" />
                  <span>Sign In</span>
                </>
              )}
            </Button>

            <div className="text-center text-xs text-muted-foreground">
              Don&apos;t have an admin account?{" "}
              <Link
                href="/install"
                className="font-medium text-foreground hover:underline"
              >
                Run Setup Wizard
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
