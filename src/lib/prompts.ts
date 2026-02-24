import { ExtendedPlace } from "./placesTypes";

export type BrandingData = {
  agentName?: string;
  brokerage?: string;
  phone?: string;
};

export type SocialMediaPost = {
  caption: string;
  hashtags: string;
  cta: string;
};

export type SocialMediaResult = {
  instagram: [SocialMediaPost, SocialMediaPost];
  tiktok: [SocialMediaPost, SocialMediaPost];
};

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

export function socialMediaPrompt(
  propertyData: PropertyData,
  branding: BrandingData
): string {
  const {
    address = "",
    price = "",
    bedrooms = 0,
    bathrooms = 0,
    sqft = 0,
    features = [],
  } = propertyData || {};

  const { agentName = "", brokerage = "", phone = "" } = branding || {};

  const topFeatures = features.slice(0, 5).join(", ");

  return `You are a real estate social media expert. Generate content for this listing.

Property: ${address}, ${price}, ${bedrooms}bd/${bathrooms}ba, ${sqft}sqft
Features: ${topFeatures}
Agent: ${agentName} | ${brokerage} | ${phone}

Return ONLY valid JSON with no markdown or extra text:
{
  "instagram": [
    { "caption": "150-200 chars, visual/lifestyle focus", "hashtags": "8-10 hashtags as a single string", "cta": "short action phrase" },
    { "caption": "...", "hashtags": "...", "cta": "..." }
  ],
  "tiktok": [
    { "caption": "100-150 chars, hook-first, trendy and conversational", "hashtags": "5-7 hashtags as a single string", "cta": "short action phrase" },
    { "caption": "...", "hashtags": "...", "cta": "..." }
  ]
}

Rules:
- Weave agent name and brokerage naturally into captions or CTA
- No unverifiable claims
- U.S. English`;
}
