import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt = "Write a short real estate marketing message." } = body;

    // Test OpenAI API
    const result = await generateContent(prompt, "gpt-3.5-turbo");

    return NextResponse.json({
      success: true,
      message: "OpenAI API is working correctly!",
      generatedContent: result.content,
      usage: result.usage,
      prompt: prompt,
    });
  } catch (error) {
    console.error("OpenAI test error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        message:
          "OpenAI API test failed. Please check your API key and try again.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "OpenAI Test API - Use POST with a prompt to test the API",
    example: {
      method: "POST",
      body: {
        prompt: "Write a short real estate marketing message.",
      },
    },
  });
}
