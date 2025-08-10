"use client";

import { useState } from "react";
import type { NeighborhoodGuideData } from "@/lib/prompts";

export default function NeighborhoodGuideForm() {
  // Keep form state as strings for inputs; convert to NeighborhoodGuideData on submit
  const [form, setForm] = useState({
    address: "",
    district: "",
    schools: "",
    audience: "buyers",
    keyPoints: "",
    tone: "professional",
  });

  const [result, setResult] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload: NeighborhoodGuideData = {
      address: form.address || "",
      district: form.district || undefined,
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
    };

    const res = await fetch("/api/generate-neighborhood-guide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guideData: payload }),
    });
    const data = await res.json();
    setResult(data.result);
  }

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
          placeholder="District"
          value={form.district}
          onChange={(e) => setForm({ ...form, district: e.target.value })}
          className="border p-2 w-full"
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
          placeholder="Key Points (comma-separated)"
          value={form.keyPoints}
          onChange={(e) => setForm({ ...form, keyPoints: e.target.value })}
          className="border p-2 w-full"
        />
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

      {result && (
        <div className="mt-6 p-4 border rounded">
          <h3 className="font-bold">Generated Guide:</h3>
          <div className="whitespace-pre-wrap">{result}</div>
        </div>
      )}
    </div>
  );
}
