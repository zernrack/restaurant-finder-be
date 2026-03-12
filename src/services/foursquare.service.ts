import { foursquareClient } from "../utils/foursquareClient.js";
import type { SearchParams } from "../schemas/search.schema.js";
import type {
  FoursquareSearchResult,
  FoursquarePlaceDetails,
} from "../models/foursquare.model.js";

import type { Restaurant } from "../models/restaurant.model.js";

/* Search places */
async function searchPlaces(
  params: SearchParams,
): Promise<FoursquareSearchResult[]> {
  const response = await foursquareClient.get("/search", {
    params: {
      query: params.query,
      near: params.near,
      price: params.price,
      open_now: params.open_now,
      limit: 10,
    },
  });

  return response.data.results;
}

/* Get place details */
async function getPlaceDetails(fsqId: string): Promise<FoursquarePlaceDetails> {
  const response = await foursquareClient.get(`/${fsqId}`);

  return response.data;
}

/* Map response → restaurant */
function mapPlaceToRestaurant(place: FoursquarePlaceDetails): Restaurant {
  const category = place.categories?.[0]?.name;

  return {
    id: place.id,
    name: place.name,

    ...(place.location?.formatted_address && {
      address: place.location.formatted_address,
    }),

    ...(category && {
      category,
    }),

    ...(place.rating !== undefined && {
      rating: place.rating,
    }),

    ...(place.price !== undefined && {
      priceLevel: place.price,
    }),

    ...(place.hours?.open_now !== undefined && {
      openNow: place.hours.open_now,
    }),

    ...(place.hours?.display && {
      hours: place.hours.display,
    }),

    ...(place.website && {
      website: place.website,
    }),
  };
}

/* Main function used by controller */
export async function searchRestaurants(
  params: SearchParams,
): Promise<Restaurant[]> {
  const places = await searchPlaces(params);

  const details = await Promise.all(
    places.slice(0, 5).map((place) => getPlaceDetails(place.fsq_place_id)),
  );

  return details.map(mapPlaceToRestaurant);
}
