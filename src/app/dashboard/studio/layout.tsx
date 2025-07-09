import type React from "react"

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="h-screen w-full bg-white">{children}</div>
}
