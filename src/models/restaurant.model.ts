export interface Restaurant {
  id: string
  name: string
  address?: string
  category?: string
  rating?: number
  priceLevel?: number
  openNow?: boolean
  hours?: string[]
  website?: string
}