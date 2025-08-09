import { NextRequest, NextResponse } from "next/server";
import { generatePropertyDescription } from "@/lib/openai";
import { createPropertyListingPDF } from "@/lib/pdf";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { propertyDetails, generatePDF = false } = body;

    // Validate required fields
    if (
      !propertyDetails ||
      !propertyDetails.address ||
      !propertyDetails.price
    ) {
      return NextResponse.json(
        { error: "Missing required property details" },
        { status: 400 }
      );
    }

    // Generate property description using OpenAI
    const descriptionResult = await generatePropertyDescription({
      address: propertyDetails.address,
      price: propertyDetails.price,
      bedrooms: propertyDetails.bedrooms || 0,
      bathrooms: propertyDetails.bathrooms || 0,
      sqft: propertyDetails.sqft || 0,
      features: propertyDetails.features || [],
    });

    if (!descriptionResult.content) {
      return NextResponse.json(
        { error: "Failed to generate property description" },
        { status: 500 }
      );
    }

    // Store in Supabase if user is authenticated
    let savedRecord = null;
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("property_listings")
          .insert({
            user_id: user.id,
            address: propertyDetails.address,
            price: propertyDetails.price,
            bedrooms: propertyDetails.bedrooms || 0,
            bathrooms: propertyDetails.bathrooms || 0,
            sqft: propertyDetails.sqft || 0,
            description: descriptionResult.content,
            features: propertyDetails.features || [],
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) {
          console.error("Supabase error:", error);
        } else {
          savedRecord = data;
        }
      }
    } catch (error) {
      console.error("Database error:", error);
    }

    // Generate PDF if requested
    let pdfBuffer = null;
    if (generatePDF) {
      try {
        const pdfData = await createPropertyListingPDF({
          address: propertyDetails.address,
          price: propertyDetails.price,
          bedrooms: propertyDetails.bedrooms || 0,
          bathrooms: propertyDetails.bathrooms || 0,
          sqft: propertyDetails.sqft || 0,
          description: descriptionResult.content,
          features: propertyDetails.features || [],
          agentName: propertyDetails.agentName || "Your Agent",
          agentPhone: propertyDetails.agentPhone || "(555) 123-4567",
          agentEmail: propertyDetails.agentEmail || "agent@example.com",
        });
        pdfBuffer = Buffer.from(pdfData);
      } catch (error) {
        console.error("PDF generation error:", error);
      }
    }

    return NextResponse.json({
      success: true,
      description: descriptionResult.content,
      usage: descriptionResult.usage,
      savedRecord,
      pdfGenerated: !!pdfBuffer,
      pdfBuffer: pdfBuffer ? pdfBuffer.toString("base64") : null,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
