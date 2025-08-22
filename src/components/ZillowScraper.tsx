"use client";

import { useState } from "react";
import { PropertyData } from "@/lib/prompts";
import { getPriceLevelText, getRatingStars } from "@/lib/placesInfoUtils";

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

interface ScrapeResponse {
  success: boolean;
  data: ZillowData;
  source: string;
  message?: string;
  runId?: string;
}

export default function ZillowScraper() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingListing, setIsGeneratingListing] = useState(false);
  const [result, setResult] = useState<ScrapeResponse | null>(null);
  const [generatedListing, setGeneratedListing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useApify, setUseApify] = useState(true);
  const [placesData, setPlacesData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const endpoint = useApify
        ? "/api/scrape-zillow-apify"
        : "/api/scrape-zillow";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to scrape listing");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateListing = async () => {
    setIsGeneratingListing(true);
    const scrapedPropertyData: PropertyData = {
      address: result?.data.address,
      price: result?.data.price,
      bedrooms: result?.data.beds ? Number(result?.data.beds) : 0,
      bathrooms: result?.data.baths ? Number(result?.data.baths) : 0,
      sqft: result?.data.sqft ? Number(result?.data.sqft) : 0,
      features: result?.data.features,
    };

    const createListingRes = await fetch("/api/generate-listing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyData: scrapedPropertyData }),
    });
    const createListingData = await createListingRes.json();
    setGeneratedListing(createListingData.result);
    setIsGeneratingListing(false);
  };

  const handleGetPlaces = async () => {
    const params = new URLSearchParams({
      location: result?.data.address!,
      radius: "5000",
      types: "restaurant,park,tourist_attraction",
    });

    const placesResponse = await fetch(`/api/places?${params}`);

    const placesData = await placesResponse.json();

    if (!placesResponse.ok) {
      throw new Error(placesData.error || "Failed to fetch places");
    }
    setPlacesData(placesData);

    console.log("placesData: ", placesData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Zillow Listing Scraper</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label htmlFor="url" className="block text-sm font-medium mb-2">
            Zillow Listing URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.zillow.com/homedetails/..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={useApify}
              onChange={(e) => setUseApify(e.target.checked)}
              className="mr-2"
            />
            Use Apify for advanced scraping (requires API token)
          </label>
        </div>

        <button
          type="button"
          disabled={isLoading || !url}
          className="bg-green-600 text-white px-6 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSubmit}
        >
          {isLoading ? "Scraping..." : "Scrape Listing"}
        </button>
        <button
          type="button"
          disabled={!result || isLoading}
          className="bg-blue-600 text-white mx-3 px-6 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleGenerateListing}
        >
          {isGeneratingListing ? "Generating Listing..." : "Generate Listing"}
        </button>
        <button
          type="button"
          // disabled={!result || isLoading}
          className="bg-blue-600 text-white mx-3 px-6 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleGetPlaces}
        >
          Get Places Nearby
        </button>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {generatedListing && (
        <div className="bg-blue-200 mb-4 text-black border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold mb-3">Generated Listing</h3>
          <p>{generatedListing}</p>
        </div>
      )}

      {result && (
        <div className="bg-green-50 text-black border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-green-800">
              Scraped Data
            </h2>
            <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
              {result.source}
            </span>
          </div>

          {result.message && (
            <p className="text-green-700 mb-4">{result.message}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Basic Information</h3>
              <div className="space-y-2">
                <div>
                  <strong>Address:</strong> {result.data.address}
                </div>
                <div>
                  <strong>Price:</strong> {result.data.price}
                </div>
                <div>
                  <strong>Beds:</strong> {result.data.beds}
                </div>
                <div>
                  <strong>Baths:</strong> {result.data.baths}
                </div>
                <div>
                  <strong>Square Feet:</strong> {result.data.sqft}
                </div>
                <div>
                  <strong>Lot Size:</strong> {result.data.lotSize}
                </div>
                <div>
                  <strong>Year Built:</strong> {result.data.yearBuilt}
                </div>
                <div>
                  <strong>Property Type:</strong> {result.data.propertyType}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Additional Details</h3>
              <div className="space-y-2">
                {result.data.zestimate && (
                  <div>
                    <strong>Zestimate:</strong> {result.data.zestimate}
                  </div>
                )}
                {result.data.rentEstimate && (
                  <div>
                    <strong>Rent Estimate:</strong> {result.data.rentEstimate}
                  </div>
                )}
                {result.data.neighborhood && (
                  <div>
                    <strong>Neighborhood:</strong> {result.data.neighborhood}
                  </div>
                )}
                {result.data.schoolDistrict && (
                  <div>
                    <strong>School District:</strong>{" "}
                    {result.data.schoolDistrict}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-3">Description</h3>
            <p className="text-gray-700">{result.data.description}</p>
          </div>

          {result.data.features.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Features</h3>
              <ul className="list-disc list-inside space-y-1">
                {result.data.features.map((feature, index) => (
                  <li key={index} className="text-gray-700">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.data.images.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3">
                Images ({result.data.images.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {result.data.images.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-video bg-gray-100 rounded overflow-hidden"
                  >
                    <img
                      src={image}
                      alt={`Property image ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.runId && (
            <div className="mt-4 text-sm text-gray-500">
              Apify Run ID: {result.runId}
            </div>
          )}
        </div>
      )}

      {placesData && (
        <section>
          <h1 className="font-semibold text-xl mb-3 underline">
            Places Nearby
          </h1>
          <div className="flex flex-row flex-wrap w-full gap-4">
            {Object.entries(placesData.places).map(([placeType, places]: any) =>
              places.map((place: any) => (
                <div
                  key={place.id}
                  className="border border-gray-200 bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
                  style={{ width: "calc(50% - 8px)" }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-800 text-lg">
                      {place.name}
                    </h4>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full capitalize">
                      {placeType}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-2">{place.vicinity}</p>

                  {place.rating && (
                    <div className="flex items-center mb-2">
                      <span className="text-yellow-500 mr-1">
                        {getRatingStars(place.rating)}
                      </span>
                      <span className="text-sm text-gray-600">
                        {place.rating} ({place.user_ratings_total} reviews)
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Price: {getPriceLevelText(place.price_level)}</span>
                    {place.opening_hours !== undefined && (
                      <span
                        className={
                          place.opening_hours
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {place.opening_hours ? "Open" : "Closed"}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">How to use:</h3>
        <ol className="list-decimal list-inside space-y-1 text-blue-700">
          <li>Paste a Zillow listing URL above</li>
          <li>
            Choose whether to use Apify (requires API token) or basic scraping
          </li>
          <li>Click "Scrape Listing" to extract property data</li>
          <li>View the extracted information below</li>
        </ol>

        <div className="mt-4 text-sm text-blue-600">
          <strong>Note:</strong> For production use, consider setting up an
          Apify API token for better data extraction and reliability.
        </div>
      </div>
    </div>
  );
}
