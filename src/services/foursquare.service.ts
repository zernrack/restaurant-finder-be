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
      near: params.location,
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
  const id =
    place.id ??
    (place as unknown as { fsq_id?: string; fsq_place_id?: string }).fsq_id ??
    (place as unknown as { fsq_id?: string; fsq_place_id?: string }).fsq_place_id;

  return {
    id: typeof id === "string" ? id : "",
    name: place.name,

    ...(place.location?.formatted_address && {
      address: place.location.formatted_address,
    }),

    ...(category && {
      category,
    }),

    ...(typeof place.rating === "number" && {
      rating: place.rating,
    }),

    ...(typeof place.price === "number" && {
      priceLevel: place.price,
    }),

    ...(typeof place.hours?.open_now === "boolean" && {
      openNow: place.hours.open_now,
    }),

    ...(Array.isArray(place.hours?.display) && {
      hours: place.hours.display.filter((item): item is string => typeof item === "string"),
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
    places.slice(0, 10).map((place) => getPlaceDetails(place.fsq_place_id)),
  );

  return details
    .map(mapPlaceToRestaurant)
    .filter((restaurant) => restaurant.id.length > 0 && restaurant.name.length > 0);
}
