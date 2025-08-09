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
- Avoid unverifiable claims
- Avoid overused cliches
- U.S. English
`;
}

export type NeighborhoodGuideData = {
  address: string;
  district?: string;
  schools?: string;
  audience?: "investors" | "sellers" | "buyers" | "renters";
  keyPoints?: string[];
  tone?: string;
};

export function guidePrompt(guideData: NeighborhoodGuideData): string {
  const {
    address = "",
    district = "",
    schools = "",
    audience = "buyers",
    keyPoints = [],
    tone = "professional",
  } = guideData || ({} as NeighborhoodGuideData);

  return `You are an expert neighborhood guide writter for ${audience}. Write a ${tone}, factual summary for the following neighborhood:
Address: ${address}
District: ${district}
Schools: ${schools}
Key points to include: ${keyPoints.join(", ")}

Guidelines:
- Highlight unique features and neighborhood appeal
- Avoid unverifiable claims
- Avoid overused cliches
- U.S. English
- Use clear headings, concise paragraphs, and practical tips. End with a brief action-oriented summary.
- Organize in intro + bullet list format.`;
}
