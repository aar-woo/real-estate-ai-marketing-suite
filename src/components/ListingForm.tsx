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
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-center">Listing Generator</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(form).map((key) => (
          <input
            key={key}
            type="text"
            placeholder={key}
            value={form[key as keyof typeof form]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            className="border p-2 w-full"
          />
        ))}
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
