"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Network, Kanban, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/agents", label: "Agent Tree", icon: Network },
  { href: "/kanban", label: "Kanban Board", icon: Kanban },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-72 flex-col bg-card dark:bg-dark-card border-r border-border dark:border-dark-border">
      {/* Logo Section */}
      <div className="flex h-20 items-center border-b border-border dark:border-dark-border px-6">
        <div className="flex items-center gap-3">
          {/* Logo Icon com Neon Glow */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neon-400 animate-glow">
            <Zap className="h-6 w-6 text-neon-950" />
          </div>

          {/* Logo Text */}
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-foreground dark:text-dark-foreground">
              MAX Task Manager
            </h1>
            <span className="text-xs text-neon-400 font-semibold tracking-wide">
              V2.0
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300",
                isActive
                  ? "bg-neon-400 text-neon-950 shadow-neon font-semibold"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground dark:hover:bg-white/10 dark:hover:text-dark-foreground"
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={2} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer com Version */}
      <div className="border-t border-border dark:border-dark-border p-6">
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground dark:text-dark-muted-foreground">
            Powered by Wonder Games Design
          </p>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-neon-400 animate-glow" />
            <span className="text-xs font-semibold text-neon-400">
              Vision Dashboard
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
