"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"

interface PageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
  actions?: React.ReactNode
}

export function PageHeader({ title, description, children, actions }: PageHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="w-px h-4 bg-gray-300"></div>
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
      {(children || actions) && (
        <div className="flex items-center justify-between gap-2">
          {children && (
            <div className="flex-1">
              {children}
            </div>
          )}
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      )}
    </div>
  )
} 