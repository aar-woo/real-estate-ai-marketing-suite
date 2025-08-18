import { NextRequest, NextResponse } from "next/server";
import {
  formatAddress,
  formatPrice,
  formatPropertyType,
  extractFeatures,
  extractImages,
  extractSchoolDistrict,
} from "@/lib/scraperRegexUtils";

interface ScrapeRequest {
  url: string;
}

interface ZillowData {
  address: string;
  price: string;
  beds: string;
  baths: string;
  sqft: string;
  lotSize: string;
  yearBuilt: string;
  propertyType: string;
  description: string;
  features: string[];
  images: string[];
  zestimate?: string;
  rentEstimate?: string;
  neighborhood?: string;
  schoolDistrict?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ScrapeRequest = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    if (!url.includes("zillow.com")) {
      return NextResponse.json(
        { error: "Only Zillow URLs are supported" },
        { status: 400 }
      );
    }

    const apifyToken = process.env.APIFY_API_TOKEN;

    if (!apifyToken) {
      return NextResponse.json(
        {
          error: "Apify API token required",
          details:
            "Please set APIFY_API_TOKEN environment variable to use this endpoint",
          source: "Apify (no token)",
        },
        { status: 400 }
      );
    }

    return await apifyScraping(url, apifyToken);
  } catch (error) {
    console.error("Error scraping Zillow:", error);
    return NextResponse.json(
      {
        error: "Failed to scrape Zillow listing",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

async function apifyScraping(
  url: string,
  apifyToken: string
): Promise<NextResponse> {
  try {
    const actorId = process.env.APIFY_ZILLOW_ACTOR_ID || "YOUR_ACTOR_ID";
    const apifyUrl = `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${apifyToken}`;

    const runResponse = await fetch(apifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startUrls: [{ url }],
        maxRequestRetries: 3,
        requestTimeoutSecs: 60,
        proxyConfiguration: {
          useApifyProxy: true,
          apifyProxyGroups: ["RESIDENTIAL"],
        },
      }),
    });

    if (!runResponse.ok) {
      throw new Error(`Apify API error: ${runResponse.status}`);
    }

    const runData = await runResponse.json();
    const scrapedData = runData[0];

    const zillowData: ZillowData = {
      address:
        formatAddress(scrapedData.address) ||
        `${scrapedData.streetAddress}, ${scrapedData.city}, ${scrapedData.state} ${scrapedData.zipcode}`,
      price: formatPrice(scrapedData.price),
      beds: scrapedData.bedrooms?.toString() || "Beds not found",
      baths: scrapedData.bathrooms?.toString() || "Baths not found",
      sqft:
        scrapedData.livingArea?.toString() ||
        scrapedData.livingAreaValue?.toString() ||
        "Square footage not found",
      lotSize:
        scrapedData.lotSize?.toString() ||
        scrapedData.lotAreaValue?.toString() ||
        "Lot size not found",
      yearBuilt: scrapedData.yearBuilt?.toString() || "Year built not found",
      propertyType:
        formatPropertyType(scrapedData.homeType) || "Property type not found",
      description: scrapedData.description || "Description not found",
      features: extractFeatures(scrapedData),
      images: extractImages(scrapedData),
      zestimate: formatPrice(scrapedData.zestimate),
      rentEstimate: formatPrice(scrapedData.rentZestimate),
      neighborhood:
        scrapedData.parentRegion?.name ||
        scrapedData.neighborhoodRegion?.name ||
        "Neighborhood not found",
      schoolDistrict: extractSchoolDistrict(scrapedData.schools),
    };

    return NextResponse.json({
      success: true,
      data: zillowData,
      source: "Apify",
    });
  } catch (error) {
    console.error("Apify scraping failed:", error);
    return NextResponse.json(
      {
        error: "Failed to scrape Zillow listing with Apify",
        details: error instanceof Error ? error.message : "Unknown error",
        source: "Apify (failed)",
      },
      { status: 503 }
    );
  }
}
