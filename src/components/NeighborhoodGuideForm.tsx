"use client";

import { useState } from "react";
import PlaceCard from "./PlaceCard";
import type { NeighborhoodGuideData } from "@/lib/prompts";
import { ExtendedPlace, PlacesApiResponse } from "@/lib/placesTypes";

export default function NeighborhoodGuideForm() {
  const [form, setForm] = useState({
    address: "",
    schools: "",
    audience: "buyers",
    keyPoints: "",
    tone: "professional",
    radius: 5000,
  });

  const [result, setResult] = useState("");
  const [placesData, setPlacesData] = useState<PlacesApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      await handleGetPlaces();

      const payload: NeighborhoodGuideData = {
        address: form.address || "",
        schools: form.schools
          ? form.schools
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        audience: form.audience as
          | "investors"
          | "sellers"
          | "buyers"
          | "renters",
        keyPoints: form.keyPoints
          ? form.keyPoints
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        tone: form.tone || undefined,
        places: {
          restaurant: placesData?.places?.restaurant || [],
          park: placesData?.places?.park || [],
          tourist_attraction: placesData?.places?.tourist_attraction || [],
        },
      };

      const res = await fetch("/api/generate-neighborhood-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guideData: payload }),
      });
      const data = await res.json();
      setResult(data.result);
    } catch (error) {
      console.error("Error generating neighborhood guide:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleGetPlaces = async () => {
    const params = new URLSearchParams({
      location: form.address,
      radius: form.radius.toString(),
      types: "restaurant,park,tourist_attraction",
    });

    const placesResponse = await fetch(`/api/places?${params}`);

    const placesData = await placesResponse.json();

    if (!placesResponse.ok) {
      throw new Error(placesData.error || "Failed to fetch places");
    }
    setPlacesData(placesData);
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-center">
        Neighborhood Guide Generator
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          placeholder="Schools"
          value={form.schools}
          onChange={(e) => setForm({ ...form, schools: e.target.value })}
          className="border p-2 w-full"
        />
        <select
          value={form.audience}
          onChange={(e) => setForm({ ...form, audience: e.target.value })}
          className="border p-2 w-full"
        >
          <option value="buyers">Buyers</option>
          <option value="sellers">Sellers</option>
          <option value="investors">Investors</option>
          <option value="renters">Renters</option>
        </select>
        <input
          type="text"
          placeholder="Tone (professional, friendly, etc.)"
          value={form.tone}
          onChange={(e) => setForm({ ...form, tone: e.target.value })}
          className="border p-2 w-full"
        />
        <div>
          <label className="block text-sm font-medium mb-2">
            Search Radius (meters)
          </label>
          <select
            value={form.radius}
            onChange={(e) =>
              setForm({ ...form, radius: Number(e.target.value) })
            }
            className="w-full px-3 py-2 border border-gray-300 d rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={1000}>1 km</option>
            <option value={5000}>5 km</option>
            <option value={10000}>10 km</option>
            <option value={25000}>25 km</option>
            <option value={50000}>50 km</option>
          </select>
        </div>
        <button
          className="bg-blue-600 text-white p-2 rounded w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "#007bff" }}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Generating...
            </>
          ) : (
            "Generate Neighborhood Guide"
          )}
        </button>
      </form>

      {result && placesData && (
        <div className="mt-6 p-4 border rounded">
          <h3 className="font-bold">Generated Guide:</h3>
          <div className="whitespace-pre-wrap">{result}</div>
          <section>
            <h2 className="text-lg font-bold underline my-2">
              Places In the Neighborhood
            </h2>
            <div className="flex flex-row flex-wrap gap-4">
              {Object.entries(placesData.places).map(
                ([placeType, places]: [string, ExtendedPlace[]]) =>
                  places.map((place: ExtendedPlace) => (
                    <PlaceCard key={place.id} place={place} showPhoto={true} />
                  ))
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
