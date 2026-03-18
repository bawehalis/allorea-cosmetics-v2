// src/lib/inventory.ts
import { db } from './db'

export interface StockCheckResult {
  productId: string
  name: string
  requested: number
  available: number
  sufficient: boolean
}

export async function checkStock(
  items: Array<{ productId: string; quantity: number }>
): Promise<StockCheckResult[]> {
  const productIds = items.map((i) => i.productId)
  const products = await db.product.findMany({
    where: { id: { in: productIds }, isActive: true },
    select: { id: true, name: true, stock: true },
  })

  return items.map((item) => {
    const product = products.find((p) => p.id === item.productId)
    if (!product) {
      return {
        productId: item.productId,
        name: 'Unknown product',
        requested: item.quantity,
        available: 0,
        sufficient: false,
      }
    }
    return {
      productId: product.id,
      name: product.name,
      requested: item.quantity,
      available: product.stock,
      sufficient: product.stock >= item.quantity,
    }
  })
}

export async function reserveStock(
  items: Array<{ productId: string; quantity: number }>
): Promise<void> {
  await Promise.all(
    items.map((item) =>
      db.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    )
  )
}

export async function releaseStock(
  items: Array<{ productId: string; quantity: number }>
): Promise<void> {
  await Promise.all(
    items.map((item) =>
      db.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      })
    )
  )
}

// BUG 3 FIX: removed db.product.fields.lowStockAt — not valid Prisma API.
// Use a plain numeric threshold instead. Default matches the schema default of 5.
export async function getLowStockProducts(threshold = 5) {
  return db.product.findMany({
    where: { isActive: true, stock: { lte: threshold } },
    select: { id: true, name: true, sku: true, stock: true, lowStockAt: true },
    orderBy: { stock: 'asc' },
  })
}

export async function updateStock(
  productId: string,
  newStock: number
): Promise<void> {
  await db.product.update({
    where: { id: productId },
    data: { stock: Math.max(0, newStock) },
  })
}

export async function bulkUpdateStock(
  updates: Array<{ productId: string; stock: number }>
): Promise<void> {
  await Promise.all(updates.map((u) => updateStock(u.productId, u.stock)))
}
