export type Product = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  images: string[]
  category: string | null
  inventory: number
  createdAt: string
  updatedAt: string
}

export type CartItem = {
  productId: string
  quantity: number
}

export type MergedCartItem = CartItem & { product?: Product }

export type OrderItem = {
  id: string
  orderId: string
  productId: string
  quantity: number
  price: number
  product: Product
}

export type Order = {
  id: string
  userId: string
  total: number
  status: OrderStatus
  stripePaymentIntentId: string | null
  stripeCheckoutSessionId: string | null
  shippingName: string | null
  shippingPhone: string | null
  shippingAddress: string | null
  shippingCity: string | null
  shippingState: string | null
  shippingZip: string | null
  createdAt: string
  items: OrderItem[]
}

export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pendente',
  PAID: 'Pago',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado'
}

export type User = {
  id: string
  email: string
  name: string | null
  role: 'CUSTOMER' | 'ADMIN'
}

export type Category = {
  name: string
  productCount: number
}

export type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'name_asc'
