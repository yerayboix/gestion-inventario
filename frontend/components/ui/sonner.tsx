"use client"

import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {

  return (
    <Sonner
      className="toaster group"
      position="top-right"
      expand={false}
      richColors
      {...props}
    />
  )
}

export { Toaster }
