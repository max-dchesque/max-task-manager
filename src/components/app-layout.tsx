"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto bg-slate-50 p-6 dark:bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  )
}
