import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { listingPrompt, type PropertyData } from "@/lib/prompts";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { propertyData: PropertyData };
    const { propertyData } = body || { propertyData: {} as PropertyData };

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: listingPrompt(propertyData) }],
      max_tokens: 1000,
      temperature: 0.5,
    });

    const text = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result: text });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to generate listing" },
      { status: 500 }
    );
  }
}
