import * as React from "react"
import Link from "next/link"
import { BookOpen, MessageCircle } from "lucide-react"
import { SiGithub } from "@icons-pack/react-simple-icons"

import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { siteConfig } from "@/lib/site-config"
import { cn } from "@/lib/utils"

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-background mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-6">
        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 text-sm font-medium">
          <Link
            href={siteConfig.links.docs}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-2")}
          >
            <BookOpen className="size-4" />
            <span>Docs</span>
          </Link>

          <Link
            href={siteConfig.links.discussions}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-2")}
          >
            <MessageCircle className="size-4" />
            <span>Community</span>
          </Link>

          <Link
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-2")}
          >
            <SiGithub className="size-4" />
            <span>Repository</span>
          </Link>
        </div>

        <Separator className="max-w-xs" />

        {/* Copyright */}
        <div className="text-xs text-muted-foreground text-center space-y-1">
          <p>© {new Date().getFullYear()} {siteConfig.fullName}. All rights reserved.</p>
          <p className="text-[11px] opacity-70">Built with Next.js and Shadcn UI (v{siteConfig.version})</p>
        </div>
      </div>
    </footer>
  )
}
