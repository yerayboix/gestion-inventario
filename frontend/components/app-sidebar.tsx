"use client"

import * as React from "react"
import { GalleryVerticalEnd, Book, Users, FileText } from "lucide-react"
import { SignedIn, UserButton } from "@clerk/nextjs"

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

const DEFAULT_PARENT_ICON = Book

const data = {
  navMain: [
    {
      title: "Resumen",
      url: "#",
      icon: GalleryVerticalEnd,
    },
    {
      title: "Inventario",
      items: [
        {
          title: "Libros",
          url: "#",
          icon: Book,
        },
        {
          title: "Clientes",
          url: "#",
          icon: Users,
        },
      ],
    },
    {
      title: "Facturación",
      items: [
        {
          title: "Facturas",
          url: "#",
          icon: FileText,
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      variant="floating"
      className="max-w-[270px] w-full h-full flex flex-col justify-between"
      {...props}
    >
      <div>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <div className="flex items-center justify-between gap-3 w-full">
                  <div className="flex flex-col gap-0.5 leading-none max-w-[150px] flex-1">
                    <span
                      className="font-semibold text-base truncate"
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
              {data.navMain.map((item) => {
                const Icon = item.icon || (item.title !== "Resumen" ? DEFAULT_PARENT_ICON : undefined)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a
                        href={item.url}
                        className="font-semibold flex items-center gap-3 py-3 px-4 rounded-lg text-base hover:bg-muted transition-colors"
                      >
                        {Icon && <Icon className="w-6 h-6 text-primary" />}
                        <span className="truncate">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                    {item.items?.length ? (
                      <SidebarMenuSub className="ml-0 border-l-0 px-2">
                        {item.items.map((subitem) => (
                          <SidebarMenuSubItem key={subitem.title}>
                            <SidebarMenuSubButton asChild>
                              <a
                                href={subitem.url}
                                className="flex items-center gap-2 py-2 px-4 rounded hover:bg-accent transition-colors text-base"
                              >
                                {subitem.icon && <subitem.icon className="w-5 h-5 text-muted-foreground" />}
                                <span className="truncate">{subitem.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    ) : null}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </div>
    </Sidebar>
  )
}
