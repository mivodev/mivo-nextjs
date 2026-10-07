"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, KeyRound, Eye, EyeOff, LogIn, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import { Logo } from "@/components/logo"
import { siteConfig } from "@/lib/site-config"
import { signIn } from "@/lib/auth/auth-client"
import { resolveLoginEmail } from "@/modules/auth/actions"
import { getRouterSessions } from "@/modules/router/actions"

export default function LoginPage() {
  const router = useRouter()
  const [identifier, setIdentifier] = React.useState("admin")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setIsLoading(true)
    const toastId = toast.loading("Verifying credentials...")

    try {
      const emailRes = await resolveLoginEmail(identifier)
      if (!emailRes.success) {
        const error = emailRes.error || "Account not found."
        setErrorMessage(error)
        toast.error(error, { id: toastId })
        setIsLoading(false)
        return
      }

      const res = await signIn.email({
        email: emailRes.data,
        password,
      })

      if (res.error) {
        const error = res.error.message || "Invalid credentials."
        setErrorMessage(error)
        toast.error(error, { id: toastId })
        setIsLoading(false)
        return
      }

      toast.success("Signed in successfully! Redirecting...", { id: toastId })

      const routersResult = await getRouterSessions()
      const sessions = routersResult.success ? routersResult.data : []
      if (sessions.length > 0 && sessions[0].sessionName) {
        router.push(`/${sessions[0].sessionName}/dashboard`)
      } else {
        router.push("/settings")
      }
    } catch (err) {
      const msg = (err as Error).message || "Authentication error."
      setErrorMessage(msg)
      toast.error(msg, { id: toastId })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <Link href="/">
            <div className="size-14 rounded-2xl bg-card border border-border flex items-center justify-center p-2.5 shadow-xs hover:border-foreground/50 transition-colors">
              <Logo className="size-10" width={40} height={40} priority />
            </div>
          </Link>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Welcome back</h1>
        <p className="text-xs text-muted-foreground">Sign in to your {siteConfig.name} dashboard</p>
      </div>

      <Card className="shadow-md">
        <form onSubmit={handleLogin}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Sign In</CardTitle>
            <CardDescription>Enter your username or email and password below.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertDescription className="text-xs">{errorMessage}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="identifier">Username or Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                  id="identifier"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="pl-9"
                  placeholder="admin or email@domain.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
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
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full gap-2" disabled={isLoading || !password}>
              <LogIn className="size-4" />
              <span>{isLoading ? "Signing in..." : "Sign In"}</span>
            </Button>
            <div className="text-center text-xs text-muted-foreground">
              Don&apos;t have an admin account?{" "}
              <Link href="/install" className="font-medium text-foreground hover:underline">
                Run Setup Wizard
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
