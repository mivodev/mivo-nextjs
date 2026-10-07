import * as React from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/auth"
import { isSystemInstalled } from "@/lib/auth/install-guard"

/**
 * Dashboard route group layout.
 * Enforces server-side authentication and install verification
 * before rendering /settings or /[router-session]/* pages.
 */
export default async function DashboardRouteGroupLayout({
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

  if (!session) {
    redirect("/login")
  }

  return <>{children}</>
}
