import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import {
  neighborhoodGuidePrompt,
  type NeighborhoodGuideData,
} from "@/lib/prompts";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      guideData: NeighborhoodGuideData;
    };
    const { guideData } = body || { guideData: {} as NeighborhoodGuideData };

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: neighborhoodGuidePrompt(guideData) }],
      max_tokens: 1000,
      temperature: 0.5,
    });

    const text = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result: text });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to generate guide" },
      { status: 500 }
    );
  }
}
