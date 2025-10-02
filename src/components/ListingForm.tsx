"use client";

import { useState } from "react";
import type { PropertyData } from "@/lib/prompts";
import { getParsedAddress, validAddress } from "@/lib/addressUtils";

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
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validAddress(form.address)) {
      throw new Error(
        "Invalid address, please enter a valid address in the format of '123 Main St, City, State, Zip'"
      );
    }

    setIsLoading(true);

    try {
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
    } catch (error) {
      console.error("Error generating listing:", error);
    } finally {
      setIsLoading(false);
    }
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
            required
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
            "Generate Listing"
          )}
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
