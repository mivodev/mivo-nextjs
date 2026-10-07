export const siteConfig = {
  name: "Mivo",
  fullName: "Mivo Hotspot Manager",
  description:
    "A modern, lightweight MikroTik Hotspot Manager built for performance and simplicity.",
  version: "0.0.1",
  links: {
    github: "https://github.com/mivodev/mivo-nextjs",
    discussions: "https://github.com/mivodev/mivo-nextjs/discussions",
    docs: "https://mivodev.github.io",
  },
} as const

export type SiteConfig = typeof siteConfig
