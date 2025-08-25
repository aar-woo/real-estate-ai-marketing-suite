import { NextRequest, NextResponse } from "next/server";
import { Client, Place } from "@googlemaps/google-maps-services-js";
import { ExtendedPlace, PlaceType } from "@/lib/placesTypes";

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

    const placesMap = new Map<string, ExtendedPlace>();
    const typeCounts: { [key in PlaceType]: number } = {
      restaurant: 0,
      park: 0,
      tourist_attraction: 0,
    } as { [key in PlaceType]: number };

    placesResults.forEach(({ type, places }) => {
      const ratingSortedPlaces = places.sort(
        (a, b) => (b.rating || 0) - (a.rating || 0)
      );

      ratingSortedPlaces.forEach((place: Place) => {
        if (!place.place_id || !place.types) {
          return;
        }

        const primaryType =
          place.types.find((t: string) => types.includes(t)) || type;

        // TODO: Remove the places limit of 2 and use the full list of places in prod
        if (
          typeCounts[primaryType as PlaceType] < 2 &&
          !placesMap.has(place.place_id)
        ) {
          const extendedPlace: ExtendedPlace = {
            ...place,
            id: place.place_id,
            primary_type: primaryType,
          };

          placesMap.set(place.place_id, extendedPlace);
          typeCounts[primaryType as PlaceType]++;
        }
      });
    });

    const allFilteredPlaces = Array.from(placesMap.values());

    const placesByType: { [key in PlaceType]: ExtendedPlace[] } = {} as {
      [key in PlaceType]: ExtendedPlace[];
    };
    allFilteredPlaces.forEach((place) => {
      const primaryType = place.primary_type as PlaceType;
      if (!placesByType[primaryType]) {
        placesByType[primaryType] = [];
      }
      placesByType[primaryType].push(place);
    });

    return NextResponse.json({
      success: true,
      location: {
        address: geocodeResponse.data.results[0].formatted_address,
        coordinates: { lat, lng },
      },
      places: placesByType,
      total_count: allFilteredPlaces.length,
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
