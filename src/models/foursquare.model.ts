export interface FoursquareCategory {
  id: number
  name: string
}

export interface FoursquareLocation {
  formatted_address?: string
}

export interface FoursquareSearchResult {
  fsq_place_id: string
  name: string
}

export interface FoursquarePlaceDetails {
  fsq_id: string
  name: string
  rating?: number
  price?: number
  categories?: FoursquareCategory[]
  location?: FoursquareLocation
  website?: string
  tel?: string
}