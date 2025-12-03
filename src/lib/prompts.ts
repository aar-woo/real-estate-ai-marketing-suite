import { ExtendedPlace } from "./placesTypes";

export type PropertyData = {
  address?: string;
  price?: string;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  features?: string[];
  style?: string;
  tone?: string;
};

export function listingPrompt(propertyData: PropertyData): string {
  const {
    address = "",
    price = "",
    bedrooms = 0,
    bathrooms = 0,
    sqft = 0,
    features = [],
    tone = "professional",
  } = propertyData || {};

  return `You are an expert real estate copywriter. Write a compelling ${tone} home listing for the following property:

Address: ${address}
Price: ${price}
Bedrooms: ${bedrooms}
Bathrooms: ${bathrooms}
Square Footage: ${sqft}
Key Features: ${features.join(", ")}

Guidelines:
- 2-3 short paragraphs
- Highlight unique features and neighborhood appeal
- Clear call-to-action to schedule a showing
- Create an SEO optimized title
- Avoid unverifiable claims
- Avoid overused cliches
- U.S. English
`;
}

export type NeighborhoodGuideData = {
  address: string;
  district?: string;
  schools?: string[];
  audience?: "investors" | "sellers" | "buyers" | "renters";
  places?: {
    restaurant?: ExtendedPlace[];
    park?: ExtendedPlace[];
    tourist_attraction?: ExtendedPlace[];
  };
  keyPoints?: string[];
  tone?: string;
};

// TODO: Remove the slice(0, 2) and use the full list of places in prod - temporary limit for api call limit
export function neighborhoodGuidePrompt(
  guideData: NeighborhoodGuideData
): string {
  const {
    address = "",
    district = "",
    schools = [],
    audience = "buyers",
    places = {
      restaurant: [],
      park: [],
      tourist_attraction: [],
    },
    keyPoints = [],
    tone = "professional",
  } = guideData || ({} as NeighborhoodGuideData);

  return `You are an expert neighborhood guide writter for ${audience}. Write a ${tone}, factual summary for the following neighborhood:
Address: ${address}
District: ${district}
Schools: ${schools.join(", ")}
Restaurants: ${places?.restaurant
    ?.slice(0, 2)
    .map((r) => r.name)
    .join(", ")}
Parks: ${places?.park
    ?.slice(0, 2)
    .map((p) => p.name)
    .join(", ")}
Tourist Attractions: ${places?.tourist_attraction
    ?.slice(0, 2)
    .map((t) => t.name)
    .join(", ")}
Key points to include: ${keyPoints.join(", ")}

Guidelines:
- Highlight unique features and neighborhood appeal
- Avoid unverifiable claims
- Avoid overused cliches
- U.S. English
- Use clear headings, concise paragraphs, and practical tips. End with a brief action-oriented summary.
- Organize in intro + bullet list format.`;
}
