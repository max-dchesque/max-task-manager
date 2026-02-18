"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar com glassmorphism */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header com neon accent */}
        <Header />

        {/* Content Area com suporte a scroll */}
        <main className="flex-1 overflow-auto p-6 md:p-8">
          {/* Container com max-width do Wonder Games */}
          <div className="mx-auto max-w-[1400px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
