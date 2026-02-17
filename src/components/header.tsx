"use client"

import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 dark:bg-slate-950">
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Vision Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
      </div>
    </header>
  )
}
