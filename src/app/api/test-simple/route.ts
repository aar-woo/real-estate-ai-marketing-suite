import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Basic API is working!",
    timestamp: new Date().toISOString(),
    environment: {
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
    },
  });
}
