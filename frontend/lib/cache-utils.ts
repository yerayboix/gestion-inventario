import { revalidateTag, revalidatePath } from 'next/cache'

// Funciones simples para invalidar caché
export async function invalidateFacturasCache() {
  await revalidateTag('facturas')
  await revalidateTag('factura')
  await revalidatePath('/facturas')
}

export async function invalidateLibrosCache() {
  await revalidateTag('libros')
  await revalidatePath('/libros')
}

export async function invalidateEmpresaCache() {
  await revalidateTag('empresa')
  await revalidatePath('/configuracion')
}

export async function invalidateLineasFacturaCache() {
  await revalidateTag('lineas-factura')
  await revalidateTag('linea-factura')
} 