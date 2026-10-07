import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: number
  height?: number
  alt?: string
  priority?: boolean
}

export function Logo({
  className,
  width = 24,
  height = 24,
  alt = "Mivo Logo",
  priority = false,
  ...props
}: LogoProps) {
  return (
    <div className={cn("relative inline-flex items-center justify-center shrink-0", className)} {...props}>
      {/* Light Theme Logo */}
      <Image
        src="/logo-m.svg"
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className="dark:hidden h-full w-auto block object-contain"
      />
      {/* Dark Theme Logo */}
      <Image
        src="/logo-m-dark.svg"
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className="hidden dark:block h-full w-auto object-contain"
      />
    </div>
  )
}
