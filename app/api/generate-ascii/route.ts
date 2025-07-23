import { type NextRequest, NextResponse } from "next/server";
import type { TextStyle } from "@/types/ascii";
import { STANDARD_FONT } from "@/fonts/standard";
import { BUBBLE_FONT } from "@/fonts/bubble";
import { BLOCK_FONT } from "@/fonts/block";
import { SHADOW_FONT } from "@/fonts/shadow";
import { SMALL_FONT } from "@/fonts/small";
import { BANNER_FONT } from "@/fonts/banner";
import { DIGITAL_FONT } from "@/fonts/digital";
import { GRAFFITI_FONT } from "@/fonts/graffiti";
import { BIG_FONT } from "@/fonts/big";
import { SLANT_FONT } from "@/fonts/slant";

// Font mapping to our local font definitions
const FONT_DEFINITIONS: Record<TextStyle, Record<string, string[]>> = {
  standard: STANDARD_FONT,
  bubble: BUBBLE_FONT,
  block: BLOCK_FONT,
  shadow: SHADOW_FONT,
  slant: SLANT_FONT,
  big: BIG_FONT,
  small: SMALL_FONT,
  banner: BANNER_FONT,
  digital: DIGITAL_FONT,
  graffiti: GRAFFITI_FONT,
};

export async function POST(request: NextRequest) {
  try {
    const { text, font, fontSize, letterSpacing } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid text input" },
        { status: 400 }
      );
    }

    const fontStyle = font as TextStyle;
    const fontDefinition = FONT_DEFINITIONS[fontStyle];

    let result: string;

    if (fontDefinition && Object.keys(fontDefinition).length > 0) {
      // Use our font definitions (both local and generated)
      result = generateWithLocalFont(text, fontDefinition);
    } else {
      // Fallback
      result = text;
    }

    return NextResponse.json({ success: true, ascii: result });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate ASCII art",
      },
      { status: 500 }
    );
  }
}

function generateWithLocalFont(
  text: string,
  fontDefinition: Record<string, string[]>
): string {
  const lines = text.split("\n");
  const resultLines: string[] = [];

  for (const line of lines) {
    if (line.trim() === "") {
      resultLines.push("");
      continue;
    }

    // Get the height of the font (number of rows)
    const sampleChar =
      fontDefinition["A"] || fontDefinition[Object.keys(fontDefinition)[0]];
    const fontHeight = sampleChar ? sampleChar.length : 6;

    // Create arrays for each row of the ASCII art
    const asciiRows: string[] = new Array(fontHeight).fill("");

    // Process each character in the line
    for (let i = 0; i < line.length; i++) {
      const char = line[i].toUpperCase();
      const charPattern = fontDefinition[char] || fontDefinition[" "] || [];

      // Add each row of the character to the corresponding ASCII row
      for (let row = 0; row < fontHeight; row++) {
        const charRow = charPattern[row] || " ".repeat(6);
        asciiRows[row] += charRow;

        // Add spacing between characters (except for the last character)
        if (i < line.length - 1) {
          asciiRows[row] += " ";
        }
      }
    }

    // Add all rows of this line to the result
    resultLines.push(...asciiRows);
  }

  return resultLines.join("\n");
}
