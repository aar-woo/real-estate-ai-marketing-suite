import { NextRequest, NextResponse } from "next/server";
import { Client } from "@googlemaps/google-maps-services-js";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        { error: "Photo reference parameter is required" },
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

    const client = new Client({});

    const photoResponse = await client.placePhoto({
      params: {
        photoreference: reference,
        key: apiKey,
        maxwidth: 400,
      },
      responseType: "arraybuffer",
    });

    if (photoResponse.status !== 200) {
      return NextResponse.json(
        { error: "Failed to fetch photo from Google Places API" },
        { status: photoResponse.status }
      );
    }

    const base64 = Buffer.from(photoResponse.data).toString("base64");

    const contentType = "image/jpeg";

    return NextResponse.json({
      success: true,
      photo: {
        base64: base64,
        contentType: contentType,
        width: undefined,
        height: undefined,
      },
    });
  } catch (error) {
    console.error("Error fetching place photo:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch place photo",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
