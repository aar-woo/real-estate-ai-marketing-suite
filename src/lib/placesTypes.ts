import { Place } from "@googlemaps/google-maps-services-js";

// Extended interface with only the custom fields we need
export interface ExtendedPlace extends Place {
  id: string;
  primary_type: string;
}

export interface PlacesApiResponse {
  success: boolean;
  location: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  places: {
    [key: string]: ExtendedPlace[];
  };
  total_count: number;
  radius_meters: number;
  search_types: string[];
}

export type PlaceType = "restaurant" | "park" | "tourist_attraction" | "school";
