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
  });

  const [result, setResult] = useState("");
  const [placesData, setPlacesData] = useState<PlacesApiResponse | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await handleGetPlaces();

    const payload: NeighborhoodGuideData = {
      address: form.address || "",
      schools: form.schools
        ? form.schools
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      audience: form.audience as "investors" | "sellers" | "buyers" | "renters",
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
  }

  const handleGetPlaces = async () => {
    const params = new URLSearchParams({
      location: form.address,
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
        <button
          className="bg-blue-600 text-white p-2 rounded w-full"
          style={{ backgroundColor: "#007bff" }}
          type="submit"
        >
          Generate Neighborhood Guide
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
