interface AddressObject {
  streetAddress?: string;
  city?: string;
  state?: string;
  zipcode?: string;
}

export function formatAddress(
  addressObj: AddressObject | string | null | undefined
): string {
  if (!addressObj) return "";
  if (typeof addressObj === "string") return addressObj;
  return `${addressObj.streetAddress || ""}, ${addressObj.city || ""}, ${
    addressObj.state || ""
  } ${addressObj.zipcode || ""}`.trim();
}

export function formatPrice(price: number | string | null | undefined): string {
  if (!price) return "Price not found";
  if (typeof price === "number") return `$${price.toLocaleString()}`;
  if (typeof price === "string")
    return price.startsWith("$") ? price : `$${price}`;
  return "Price not found";
}

export function formatPropertyType(
  homeType: string | null | undefined
): string {
  if (!homeType) return "Property type not found";
  if (typeof homeType === "string") {
    return homeType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  }
  return "Property type not found";
}

interface ScrapedPropertyData {
  bedrooms?: number | string;
  bathrooms?: number | string;
  parkingCapacity?: number | string;
  resoFacts?: {
    appliances?: string[];
    view?: string[];
    cooling?: string[];
  };
}

export function extractFeatures(scrapedData: ScrapedPropertyData): string[] {
  const features: string[] = [];

  // Add basic property features
  if (scrapedData.bedrooms) features.push(`${scrapedData.bedrooms} bedrooms`);
  if (scrapedData.bathrooms)
    features.push(`${scrapedData.bathrooms} bathrooms`);
  if (scrapedData.parkingCapacity)
    features.push(`${scrapedData.parkingCapacity} parking spaces`);

  // Add amenities from resoFacts
  if (scrapedData.resoFacts?.appliances) {
    features.push(...scrapedData.resoFacts.appliances);
  }

  // Add view information
  if (scrapedData.resoFacts?.view) {
    features.push(...scrapedData.resoFacts.view);
  }

  // Add cooling/heating
  if (scrapedData.resoFacts?.cooling) {
    features.push(...scrapedData.resoFacts.cooling);
  }

  return features.length > 0 ? features : ["Features not found"];
}

interface PhotoData {
  url?: string;
  mixedSources?: {
    jpeg?: Array<{ url?: string }>;
  };
}

interface ScrapedImageData {
  responsivePhotos?: PhotoData[];
  originalPhotos?: PhotoData[];
}

export function extractImages(scrapedData: ScrapedImageData): string[] {
  const images: string[] = [];

  // Add responsive photos
  if (scrapedData.responsivePhotos) {
    scrapedData.responsivePhotos.forEach((photo) => {
      if (photo.url) images.push(photo.url);
    });
  }

  // Add original photos
  if (scrapedData.originalPhotos) {
    scrapedData.originalPhotos.forEach((photo) => {
      if (photo.mixedSources?.jpeg?.[0]?.url) {
        images.push(photo.mixedSources.jpeg[0].url);
      }
    });
  }

  return images.length > 0 ? images.slice(0, 5) : ["Images not found"];
}

interface SchoolData {
  name?: string;
}

export function extractSchoolDistrict(
  scrapedData: SchoolData[] | null | undefined
): string {
  if (!scrapedData || !Array.isArray(scrapedData))
    return "School district not found";

  const schools = scrapedData.map((school) => school.name).filter(Boolean);
  return schools.length > 0 ? schools.join(", ") : "School district not found";
}

export function extractNumber(text: string): string {
  if (!text) return "";
  const match = text.match(/(\d+(?:\.\d+)?)/);
  return match ? match[1] : "";
}

export function extractYear(text: string): string {
  if (!text) return "";
  const match = text.match(/(\d{4})/);
  return match ? match[1] : "";
}
