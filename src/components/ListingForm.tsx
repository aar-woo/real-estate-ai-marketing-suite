"use client";

import { useState } from "react";
import type { PropertyData } from "@/lib/prompts";

export default function ListingForm() {
  // Keep form state as strings for inputs; convert to PropertyData on submit
  const [form, setForm] = useState({
    address: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    sqft: "",
    features: "",
    tone: "",
  });

  const [result, setResult] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload: PropertyData = {
      address: form.address || undefined,
      price: form.price || undefined,
      bedrooms: form.bedrooms ? Number(form.bedrooms) : 0,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : 0,
      sqft: form.sqft ? Number(form.sqft) : 0,
      features: form.features
        ? form.features
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      tone: form.tone || undefined,
    };

    const res = await fetch("/api/generate-listing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyData: payload }),
    });
    const data = await res.json();
    setResult(data.result);
  }

  return (
    <div className="mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Listing Generator</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="listing-address"
            className="inline-block text-sm font-medium text-white mb-1"
          >
            Address
          </label>
          <input
            id="listing-address"
            type="text"
            placeholder="Enter property address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label
            htmlFor="listing-price"
            className="inline-block text-sm font-medium text-white mb-1"
          >
            Price
          </label>
          <input
            id="listing-price"
            type="text"
            placeholder="Enter property price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label
            htmlFor="listing-bedrooms"
            className="inline-block text-sm font-medium text-white mb-1"
          >
            Bedrooms
          </label>
          <input
            id="listing-bedrooms"
            type="number"
            placeholder="Number of bedrooms"
            value={form.bedrooms}
            onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label
            htmlFor="listing-bathrooms"
            className="inline-block text-sm font-medium text-white mb-1"
          >
            Bathrooms
          </label>
          <input
            id="listing-bathrooms"
            type="number"
            placeholder="Number of bathrooms"
            value={form.bathrooms}
            onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label
            htmlFor="listing-sqft"
            className="inline-block text-sm font-medium text-white mb-1"
          >
            Square Feet
          </label>
          <input
            id="listing-sqft"
            type="number"
            placeholder="Property square footage"
            value={form.sqft}
            onChange={(e) => setForm({ ...form, sqft: e.target.value })}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label
            htmlFor="listing-features"
            className="inline-block text-sm font-medium text-white mb-1"
          >
            Features (comma-separated)
          </label>
          <input
            id="listing-features"
            type="text"
            placeholder="Pool, garage, updated kitchen, etc."
            value={form.features}
            onChange={(e) => setForm({ ...form, features: e.target.value })}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label
            htmlFor="listing-tone"
            className="inline-block text-sm font-medium text-white mb-1"
          >
            Tone
          </label>
          <input
            id="listing-tone"
            type="text"
            placeholder="professional, friendly, etc."
            value={form.tone}
            onChange={(e) => setForm({ ...form, tone: e.target.value })}
            className="border p-2 w-full"
          />
        </div>
        <button
          className="bg-blue-600 text-white p-2 rounded w-full"
          style={{ backgroundColor: "#007bff" }}
          type="submit"
        >
          Generate Listing
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 border rounded">
          <h3 className="font-bold">Generated Listing:</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}
