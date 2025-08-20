import { NextRequest, NextResponse } from "next/server";
import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client({});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location");
    const radius = searchParams.get("radius");
    const types = searchParams.get("types");

    if (!location) {
      return NextResponse.json(
        {
          error:
            "Location is required (can be address, zip code, or neighborhood)",
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Google Maps API key not configured" },
        { status: 500 }
      );
    }

    const searchRadius = radius ? parseInt(radius) : 5000;
    const searchTypes = types
      ? types.split(",")
      : ["restaurant", "park", "tourist_attraction"];

    const geocodeResponse = await client.geocode({
      params: {
        address: location,
        key: apiKey,
      },
    });

    if (
      !geocodeResponse.data.results ||
      geocodeResponse.data.results.length === 0
    ) {
      return NextResponse.json(
        { error: "Location not found" },
        { status: 404 }
      );
    }

    const { lat, lng } = geocodeResponse.data.results[0].geometry.location;

    const placesPromises = searchTypes.map(async (type: string) => {
      const placesResponse = await client.placesNearby({
        params: {
          location: { lat, lng },
          radius: searchRadius,
          type,
          key: apiKey,
        },
      });

      return {
        type,
        places: placesResponse.data.results || [],
      };
    });

    const placesResults = await Promise.all(placesPromises);

    const allPlaces = placesResults.flatMap(({ type, places }) =>
      places.map((place: any) => ({
        id: place.place_id,
        name: place.name,
        type,
        rating: place.rating,
        user_ratings_total: place.user_ratings_total,
        vicinity: place.vicinity,
        geometry: place.geometry,
        photos: place.photos?.slice(0, 3).map((photo: any) => ({
          photo_reference: photo.photo_reference,
          height: photo.height,
          width: photo.width,
        })),
        price_level: place.price_level,
        opening_hours: place.opening_hours?.open_now,
        types: place.types,
      }))
    );

    const sortedPlaces = allPlaces
      .filter((place) => place.rating)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      location: {
        address: geocodeResponse.data.results[0].formatted_address,
        coordinates: { lat, lng },
      },
      places: sortedPlaces,
      total_count: allPlaces.length,
      radius_meters: searchRadius,
      search_types: searchTypes,
    });
  } catch (error) {
    console.error("Error fetching places:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch places",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
