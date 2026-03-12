export interface FoursquareCategory {
  id: number;
  name: string;
}

export interface FoursquareLocation {
  formatted_address?: string;
}

export interface FoursquareSearchResult {
  fsq_place_id: string;
  name: string;
}

export interface FoursquarePlaceDetails {
  id: string;
  name: string;
  rating?: number;
  price?: number;
  categories?: FoursquareCategory[];
  location?: FoursquareLocation;
  hours?: {
    open_now?: boolean;
    display?: string[];
  };
  website?: string;
  tel?: string;
}
