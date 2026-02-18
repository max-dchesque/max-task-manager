"use client"

import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  return (
    <header className="glass flex h-20 items-center justify-between border-b border-border dark:border-dark-border px-6">
      {/* Page Title com Neon Accent */}
      <div className="flex flex-1 items-center gap-4">
        <div className="h-8 w-1 rounded-full bg-neon-400 animate-glow" />
        <h2 className="text-xl font-bold text-gradient-neon">
          Vision Dashboard
        </h2>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        {/* Status Badge */}
        <div className="hidden md:flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 border border-border dark:border-dark-border">
          <div className="h-2 w-2 rounded-full bg-status-online animate-glow" />
          <span className="text-xs font-semibold text-muted-foreground dark:text-dark-muted-foreground">
            SYSTEM ONLINE
          </span>
        </div>

        {/* Theme Toggle com Neon Style */}
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-white/5 border border-border hover:bg-neon-400 hover:border-neon-400 transition-all duration-300 cursor-pointer">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
