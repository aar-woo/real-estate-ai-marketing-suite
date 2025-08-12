import { NextRequest, NextResponse } from "next/server";

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
}

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
];

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

    const result = await tryMultipleScrapingMethods(url);

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
        source: "Basic scraping with enhanced methods",
        message:
          "Data extracted successfully using enhanced scraping techniques",
      });
    } else {
      return NextResponse.json(
        {
          error: "Failed to scrape Zillow listing",
          details:
            "All scraping methods failed. Zillow may be blocking access. Consider using Apify for production.",
          source: "Basic scraping (failed)",
        },
        { status: 503 }
      );
    }
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

async function tryMultipleScrapingMethods(
  url: string
): Promise<{ success: boolean; data?: ZillowData }> {
  for (const userAgent of USER_AGENTS) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": userAgent,
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Accept-Encoding": "gzip, deflate, br",
          DNT: "1",
          Connection: "keep-alive",
          "Upgrade-Insecure-Requests": "1",
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "none",
          "Cache-Control": "max-age=0",
        },
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        const html = await response.text();
        const data = extractDataFromHTML(html);
        if (data.address !== "Address not found") {
          return { success: true, data };
        }
      }
    } catch (error) {
      console.log(
        `Method 1 failed with user agent ${userAgent.substring(0, 50)}...`
      );
      continue;
    }
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (response.ok) {
      const html = await response.text();
      const data = extractDataFromHTML(html);
      if (data.address !== "Address not found") {
        return { success: true, data };
      }
    }
  } catch (error) {
    console.log("Method 2 failed");
  }

  return { success: false };
}

function extractDataFromHTML(html: string): ZillowData {
  return {
    address: extractAddress(html),
    price: extractPrice(html),
    beds: extractBeds(html),
    baths: extractBaths(html),
    sqft: extractSqft(html),
    lotSize: extractLotSize(html),
    yearBuilt: extractYearBuilt(html),
    propertyType: extractPropertyType(html),
    description: extractDescription(html),
    features: extractFeatures(html),
    images: extractImages(html),
  };
}

function extractAddress(html: string): string {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/);
  return match ? match[1].replace(/ \| Zillow$/, "") : "Address not found";
}

function extractPrice(html: string): string {
  const match = html.match(/\$([0-9,]+)/);
  return match ? `$${match[1]}` : "Price not found";
}

function extractBeds(html: string): string {
  const match = html.match(/(\d+)\s*beds?/i);
  return match ? match[1] : "Beds not found";
}

function extractBaths(html: string): string {
  const match = html.match(/(\d+(?:\.\d+)?)\s*baths?/i);
  return match ? match[1] : "Baths not found";
}

function extractSqft(html: string): string {
  const match = html.match(/(\d{1,3}(?:,\d{3})*)\s*sq\s*ft/i);
  return match ? match[1] : "Square footage not found";
}

function extractLotSize(html: string): string {
  const match = html.match(/(\d{1,3}(?:,\d{3})*)\s*sq\s*ft\s*lot/i);
  return match ? match[1] : "Lot size not found";
}

function extractYearBuilt(html: string): string {
  const match = html.match(/Built in (\d{4})/i);
  return match ? match[1] : "Year built not found";
}

function extractPropertyType(html: string): string {
  const match = html.match(/(SingleFamily|Condo|Townhouse|MultiFamily)/i);
  return match ? match[1] : "Property type not found";
}

function extractDescription(html: string): string {
  const match = html.match(/This ([^.]+)\./);
  return match ? `This ${match[1]}.` : "Description not found";
}

function extractFeatures(html: string): string[] {
  const features: string[] = [];
  const featureMatches = html.match(
    /(\d+)\s*(bedrooms?|bathrooms?|parking spaces?)/gi
  );
  if (featureMatches) {
    features.push(...featureMatches);
  }
  return features.length > 0 ? features : ["Features not found"];
}

function extractImages(html: string): string[] {
  const imageMatches = html.match(
    /https:\/\/[^"]*\.(?:jpg|jpeg|png|webp)[^"]*/g
  );
  return imageMatches ? imageMatches.slice(0, 5) : ["Images not found"];
}
