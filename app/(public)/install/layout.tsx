import * as React from "react"
import { redirect } from "next/navigation"
import { isSystemInstalled } from "@/lib/auth/install-guard"

/**
 * Install route layout.
 * Prevents access to the installation wizard if the system
 * has already been installed.
 */
export default async function InstallLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const installed = await isSystemInstalled()
  if (installed) {
    redirect("/login")
  }

  return <>{children}</>
}
