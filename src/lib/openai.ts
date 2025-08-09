import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export default openai;

// Helper function for GPT calls
export const generateContent = async (
  prompt: string,
  model: string = "gpt-4o-mini"
) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant for real estate marketing content creation.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    return {
      content: completion.choices[0]?.message?.content || "",
      usage: completion.usage,
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw error;
  }
};

// Specialized functions for real estate content
export const generatePropertyDescription = async (propertyDetails: {
  address: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  features: string[];
}) => {
  const prompt = `Create an engaging property description for a real estate listing with the following details:
  
  Address: ${propertyDetails.address}
  Price: ${propertyDetails.price}
  Bedrooms: ${propertyDetails.bedrooms}
  Bathrooms: ${propertyDetails.bathrooms}
  Square Footage: ${propertyDetails.sqft}
  Features: ${propertyDetails.features.join(", ")}
  
  Write a compelling, professional description that highlights the property's best features and appeals to potential buyers.`;

  return generateContent(prompt);
};

export const generateMarketingEmail = async (recipientInfo: {
  name: string;
  propertyType: string;
  location: string;
}) => {
  const prompt = `Create a personalized real estate marketing email for:
  
  Recipient: ${recipientInfo.name}
  Property Type: ${recipientInfo.propertyType}
  Location: ${recipientInfo.location}
  
  Make it professional, engaging, and include a call-to-action.`;

  return generateContent(prompt);
};
