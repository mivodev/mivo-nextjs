import * as React from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/auth"
import { isSystemInstalled } from "@/lib/auth/install-guard"

/**
 * Auth route group layout.
 * Ensures system is installed and redirects already-authenticated
 * users to the dashboard/settings.
 */
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const installed = await isSystemInstalled()
  if (!installed) {
    redirect("/install")
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session) {
    redirect("/settings")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
