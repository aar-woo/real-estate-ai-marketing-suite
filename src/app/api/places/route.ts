import { NextRequest, NextResponse } from "next/server";
import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client({});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location");
    if (!location) {
      return NextResponse.json(
        { error: "Location parameter is required" },
        { status: 400 }
      );
    }

    const radiusParam = searchParams.get("radius");
    const radius = radiusParam ? parseInt(radiusParam) : 5000;

    if (radiusParam && (isNaN(radius) || radius < 100 || radius > 50000)) {
      return NextResponse.json(
        { error: "Radius must be a number between 100 and 50000 meters" },
        { status: 400 }
      );
    }

    const typesParam = searchParams.get("types");
    const types = typesParam
      ? typesParam.split(",")
      : ["restaurant", "park", "tourist_attraction"];

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Google Maps API key not configured" },
        { status: 500 }
      );
    }

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

    const placesPromises = types.map(async (type: string) => {
      const placesResponse = await client.placesNearby({
        params: {
          location: { lat, lng },
          radius,
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
      radius_meters: radius,
      search_types: types,
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
