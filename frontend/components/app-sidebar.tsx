"use client"

import * as React from "react"
import { Book, Users, FileText, LayoutDashboard } from "lucide-react"
import { SignedIn, UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const data = {
  navMain: [
    {
      title: "Paneles",
      items: [
        {
          title: "Resumen",
          url: "/",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "Inventario",
      items: [
        {
          title: "Libros",
          url: "/libros",
          icon: Book,
        },
        {
          title: "Clientes",
          url: "/clientes",
          icon: Users,
        },
      ],
    },
    {
      title: "Facturación",
      items: [
        {
          title: "Facturas",
          url: "/facturas",
          icon: FileText,
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar
      variant="floating"
      className="max-w-[270px] w-full h-full flex flex-col justify-between bg-gradient-to-b from-background to-muted/20"
      {...props}
    >
      <div>
        <SidebarHeader className="border-b border-border/40">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <div className="flex items-center justify-between gap-3 w-full">
                  <div className="flex flex-col gap-0.5 leading-none max-w-[150px] flex-1">
                    <span
                      className="font-semibold text-base truncate bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
                      title="Gestión de inventario y facturación"
                    >
                      Gestión de inventario y facturación
                    </span>
                    <span className="text-xs text-muted-foreground">v0.1</span>
                  </div>
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu className="gap-3">
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <div className="px-4 py-2">
                    <h3 className="text-sm font-semibold text-muted-foreground/70 uppercase tracking-wider">
                      {item.title}
                    </h3>
                  </div>
                  {item.items?.length ? (
                    <SidebarMenuSub className="ml-0 border-l-0 px-2">
                      {item.items.map((subitem) => (
                        <SidebarMenuSubItem key={subitem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link
                              href={subitem.url}
                              className={cn(
                                "flex items-center gap-2 py-2 px-4 rounded transition-colors text-base",
                                pathname === subitem.url
                                  ? "bg-primary/10 text-primary"
                                  : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                              )}
                            >
                              {subitem.icon && <subitem.icon className="w-5 h-5" />}
                              <span className="truncate">{subitem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </div>
    </Sidebar>
  )
}
