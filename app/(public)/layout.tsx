import * as React from "react"
import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <PublicHeader />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        {children}
      </main>
      <PublicFooter />
    </div>
  )
}
