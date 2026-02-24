import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import {
  socialMediaPrompt,
  type PropertyData,
  type BrandingData,
  type SocialMediaResult,
} from "@/lib/prompts";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      propertyData: PropertyData;
      branding: BrandingData;
    };
    const { propertyData, branding } = body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: socialMediaPrompt(propertyData, branding) },
      ],
      max_tokens: 800,
      temperature: 0.5,
    });

    const raw = completion.choices[0]?.message?.content || "";

    let result: SocialMediaResult;
    try {
      result = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse social media content from AI response" },
        { status: 500 }
      );
    }

    return NextResponse.json({ result });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to generate social media content" },
      { status: 500 }
    );
  }
}
