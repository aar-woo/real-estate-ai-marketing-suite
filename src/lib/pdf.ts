import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import type { NeighborhoodGuideData } from "./prompts";
function sanitizeTextForPDF(text: string): string {
  if (!text) return "";

  return text
    .replace(/[\u2018\u2019\u02BB]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2026]/g, "...")
    .replace(/[\u2022\u2023\u25E6\u2043]/g, "*")
    .replace(/[\u2605\u2606]/g, "*")
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, "");
}

export interface PropertyListing {
  address: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  description: string;
  features: string[];
  agentName: string;
  agentPhone: string;
  agentEmail: string;
}

export const createPropertyListingPDF = async (
  property: PropertyListing
): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]);
  const { width, height } = page.getSize();

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const primaryColor = rgb(0.2, 0.4, 0.8);
  const textColor = rgb(0.1, 0.1, 0.1);
  const lightGray = rgb(0.9, 0.9, 0.9);

  page.drawText("PROPERTY LISTING", {
    x: 50,
    y: height - 50,
    size: 24,
    font: helveticaBold,
    color: primaryColor,
  });

  let yPosition = height - 100;

  page.drawText("Address:", {
    x: 50,
    y: yPosition,
    size: 12,
    font: helveticaBold,
    color: textColor,
  });
  page.drawText(sanitizeTextForPDF(property.address), {
    x: 120,
    y: yPosition,
    size: 12,
    font: helveticaFont,
    color: textColor,
  });
  yPosition -= 25;

  page.drawText("Price:", {
    x: 50,
    y: yPosition,
    size: 12,
    font: helveticaBold,
    color: textColor,
  });
  page.drawText(sanitizeTextForPDF(property.price), {
    x: 120,
    y: yPosition,
    size: 12,
    font: helveticaFont,
    color: textColor,
  });
  yPosition -= 25;

  page.drawText("Bedrooms:", {
    x: 50,
    y: yPosition,
    size: 12,
    font: helveticaBold,
    color: textColor,
  });
  page.drawText(property.bedrooms.toString(), {
    x: 120,
    y: yPosition,
    size: 12,
    font: helveticaFont,
    color: textColor,
  });
  yPosition -= 20;

  page.drawText("Bathrooms:", {
    x: 50,
    y: yPosition,
    size: 12,
    font: helveticaBold,
    color: textColor,
  });
  page.drawText(property.bathrooms.toString(), {
    x: 120,
    y: yPosition,
    size: 12,
    font: helveticaFont,
    color: textColor,
  });
  yPosition -= 20;

  page.drawText("Square Feet:", {
    x: 50,
    y: yPosition,
    size: 12,
    font: helveticaBold,
    color: textColor,
  });
  page.drawText(property.sqft.toString(), {
    x: 120,
    y: yPosition,
    size: 12,
    font: helveticaFont,
    color: textColor,
  });
  yPosition -= 40;

  page.drawText("Description:", {
    x: 50,
    y: yPosition,
    size: 14,
    font: helveticaBold,
    color: primaryColor,
  });
  yPosition -= 25;

  const maxWidth = width - 100;
  const sanitizedDescription = sanitizeTextForPDF(property.description);
  const words = sanitizedDescription.split(" ");
  let currentLine = "";
  const lines: string[] = [];

  for (const word of words) {
    const testLine = currentLine + (currentLine ? " " : "") + word;
    const textWidth = helveticaFont.widthOfTextAtSize(testLine, 11);

    if (textWidth > maxWidth) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }

  for (const line of lines) {
    if (yPosition < 100) break;
    page.drawText(line, {
      x: 50,
      y: yPosition,
      size: 11,
      font: helveticaFont,
      color: textColor,
    });
    yPosition -= 15;
  }

  yPosition -= 20;

  if (property.features.length > 0) {
    page.drawText("Features:", {
      x: 50,
      y: yPosition,
      size: 14,
      font: helveticaBold,
      color: primaryColor,
    });
    yPosition -= 25;

    for (const feature of property.features) {
      if (yPosition < 100) break;
      page.drawText(sanitizeTextForPDF(`* ${feature}`), {
        x: 50,
        y: yPosition,
        size: 11,
        font: helveticaFont,
        color: textColor,
      });
      yPosition -= 15;
    }
  }

  yPosition -= 30;
  page.drawText("Contact Information:", {
    x: 50,
    y: yPosition,
    size: 14,
    font: helveticaBold,
    color: primaryColor,
  });
  yPosition -= 25;

  page.drawText(sanitizeTextForPDF(`Agent: ${property.agentName}`), {
    x: 50,
    y: yPosition,
    size: 11,
    font: helveticaFont,
    color: textColor,
  });
  yPosition -= 15;

  page.drawText(sanitizeTextForPDF(`Phone: ${property.agentPhone}`), {
    x: 50,
    y: yPosition,
    size: 11,
    font: helveticaFont,
    color: textColor,
  });
  yPosition -= 15;

  page.drawText(sanitizeTextForPDF(`Email: ${property.agentEmail}`), {
    x: 50,
    y: yPosition,
    size: 11,
    font: helveticaFont,
    color: textColor,
  });

  page.drawText("Generated by Real Estate AI Marketing Suite", {
    x: 50,
    y: 30,
    size: 8,
    font: helveticaFont,
    color: lightGray,
  });

  return await pdfDoc.save();
};

export const createMarketingFlyerPDF = async (
  property: PropertyListing
): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]);
  const { width, height } = page.getSize();

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const primaryColor = rgb(0.2, 0.4, 0.8);
  const textColor = rgb(0.1, 0.1, 0.1);

  page.drawText("FOR SALE", {
    x: width / 2 - 60,
    y: height - 80,
    size: 32,
    font: helveticaBold,
    color: primaryColor,
  });

  page.drawText(sanitizeTextForPDF(property.price), {
    x: width / 2 - 80,
    y: height - 130,
    size: 28,
    font: helveticaBold,
    color: textColor,
  });

  page.drawText(sanitizeTextForPDF(property.address), {
    x: 50,
    y: height - 180,
    size: 16,
    font: helveticaFont,
    color: textColor,
  });

  let yPosition = height - 220;
  page.drawText(
    sanitizeTextForPDF(
      `${property.bedrooms} Beds * ${property.bathrooms} Baths * ${property.sqft} Sq Ft`
    ),
    {
      x: 50,
      y: yPosition,
      size: 14,
      font: helveticaBold,
      color: primaryColor,
    }
  );

  yPosition -= 40;
  page.drawText("Call Today!", {
    x: 50,
    y: yPosition,
    size: 18,
    font: helveticaBold,
    color: primaryColor,
  });

  yPosition -= 25;
  page.drawText(sanitizeTextForPDF(property.agentPhone), {
    x: 50,
    y: yPosition,
    size: 16,
    font: helveticaFont,
    color: textColor,
  });

  return await pdfDoc.save();
};

type NeighborhoodGuidePdfInput = Partial<NeighborhoodGuideData> & {
  images?: string[];
};

export const createNeighborhoodGuidePDF = async (
  guide: NeighborhoodGuidePdfInput = {}
): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.create();
  const pageSize: [number, number] = [612, 792];
  let page = pdfDoc.addPage(pageSize);
  const { width, height } = page.getSize();

  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const primaryColor = rgb(0.2, 0.4, 0.8);
  const textColor = rgb(0.1, 0.1, 0.1);
  const subtle = rgb(0.6, 0.6, 0.6);

  const margin = 50;
  let y = height - margin;

  const ensureSpace = (needed: number) => {
    if (y - needed < margin + 40) {
      page = pdfDoc.addPage(pageSize);
      y = height - margin;
    }
  };

  const drawHeading = (text: string, size = 16) => {
    ensureSpace(size + 14);
    page.drawText(sanitizeTextForPDF(text), {
      x: margin,
      y,
      size,
      font: helveticaBold,
      color: primaryColor,
    });
    y -= size + 8;
  };

  const drawLabelValue = (label: string, value: string, size = 11) => {
    if (!value) return;
    ensureSpace(size + 6);
    page.drawText(sanitizeTextForPDF(`${label}:`), {
      x: margin,
      y,
      size,
      font: helveticaBold,
      color: textColor,
    });
    page.drawText(sanitizeTextForPDF(value), {
      x: margin + 70,
      y,
      size,
      font: helvetica,
      color: textColor,
    });
    y -= size + 6;
  };

  const wrapAndDraw = (
    text: string,
    size = 11,
    maxWidth = width - margin * 2
  ) => {
    if (!text?.trim()) return;
    const sanitized = sanitizeTextForPDF(text);
    const words = sanitized.split(/\s+/);
    let current = "";
    const lines: string[] = [];
    for (const w of words) {
      const candidate = current ? `${current} ${w}` : w;
      const candidateWidth = helvetica.widthOfTextAtSize(candidate, size);
      if (candidateWidth > maxWidth) {
        if (current) lines.push(current);
        current = w;
      } else {
        current = candidate;
      }
    }
    if (current) lines.push(current);

    for (const line of lines) {
      ensureSpace(size + 4);
      page.drawText(line, {
        x: margin,
        y,
        size,
        font: helvetica,
        color: textColor,
      });
      y -= size + 4;
    }
  };

  const drawBullets = (items: string[], size = 11) => {
    for (const item of items) {
      ensureSpace(size + 4);
      page.drawText(sanitizeTextForPDF(`* ${item}`), {
        x: margin,
        y,
        size,
        font: helvetica,
        color: textColor,
      });
      y -= size + 4;
    }
  };

  page.drawText("Neighborhood Guide", {
    x: margin,
    y,
    size: 24,
    font: helveticaBold,
    color: primaryColor,
  });
  y -= 30;

  const address = guide.address || "";
  const district = guide.district || "";
  if (address) {
    wrapAndDraw(address, 14);
    y -= 4;
  }
  if (district) {
    page.drawText(sanitizeTextForPDF(district), {
      x: margin,
      y,
      size: 12,
      font: helvetica,
      color: subtle,
    });
    y -= 18;
  }

  const imageUrls = (guide.images || []).slice(0, 3);
  if (imageUrls.length > 0) {
    ensureSpace(180);
    const gap = 8;
    const maxBlockWidth = width - margin * 2;

    const embedded = await Promise.all(
      imageUrls.map(async (u) => {
        try {
          const res = await fetch(u);
          const contentType = res.headers.get("content-type") || "";
          const buffer = await res.arrayBuffer();
          if (contentType.includes("jpeg") || contentType.includes("jpg")) {
            return await pdfDoc.embedJpg(buffer);
          }
          return await pdfDoc.embedPng(buffer);
        } catch {
          return null;
        }
      })
    );

    const validImages = embedded.filter(Boolean) as Array<
      ReturnType<typeof pdfDoc.embedPng> extends Promise<infer T> ? T : never
    >;

    if (validImages.length > 0) {
      const cols = Math.min(3, validImages.length);
      const columnWidth = (maxBlockWidth - gap * (cols - 1)) / cols;
      const targetHeight = 140;

      let x = margin;
      let rowHeight = 0;
      for (let i = 0; i < validImages.length; i++) {
        const img = validImages[i];
        const dims = img.scale(1);
        const scale = Math.min(
          columnWidth / dims.width,
          targetHeight / dims.height
        );
        const drawWidth = dims.width * scale;
        const drawHeight = dims.height * scale;

        page.drawImage(img, {
          x,
          y: y - drawHeight,
          width: drawWidth,
          height: drawHeight,
        });

        x += columnWidth + gap;
        rowHeight = Math.max(rowHeight, drawHeight);

        const isRowEnd = (i + 1) % cols === 0;
        if (isRowEnd) {
          y -= rowHeight + 10;
          x = margin;
          rowHeight = 0;
          ensureSpace(160);
        }
      }

      if (rowHeight > 0) {
        y -= rowHeight + 14;
      }
    }
  }

  if (guide.audience || guide.tone) {
    drawHeading("Overview");
    if (guide.audience) {
      drawLabelValue("Audience", String(guide.audience));
    }
    if (guide.tone) {
      drawLabelValue("Tone", guide.tone);
    }
    y -= 6;
  }

  if (guide.schools?.length) {
    drawHeading("Schools");
    drawBullets(guide.schools);
    y -= 8;
  }

  if (guide.places) {
    const {
      restaurant = [],
      park = [],
      tourist_attraction = [],
    } = guide.places;
    if (restaurant.length) {
      drawHeading("Restaurants");
      drawBullets(
        restaurant.map((r) => {
          const rating = r.rating ? ` — ${r.rating}*` : "";
          const vicinity = r.vicinity ? ` — ${r.vicinity}` : "";
          return `${r.name || "Restaurant"}${rating}${vicinity}`;
        })
      );
      y -= 8;
    }
    if (park.length) {
      drawHeading("Parks");
      drawBullets(
        park.map((p) => {
          const vicinity = p.vicinity ? ` — ${p.vicinity}` : "";
          return `${p.name || "Park"}${vicinity}`;
        })
      );
      y -= 8;
    }
    if (tourist_attraction.length) {
      drawHeading("Attractions");
      drawBullets(
        tourist_attraction.map((t) => {
          const vicinity = t.vicinity ? ` — ${t.vicinity}` : "";
          return `${t.name || "Attraction"}${vicinity}`;
        })
      );
      y -= 8;
    }
  }

  if (guide.keyPoints?.length) {
    drawHeading("Key Points");
    drawBullets(guide.keyPoints);
    y -= 8;
  }

  ensureSpace(20);
  page.drawText("Generated by Real Estate AI Marketing Suite", {
    x: margin,
    y: margin - 10,
    size: 8,
    font: helvetica,
    color: subtle,
  });

  return await pdfDoc.save();
};
