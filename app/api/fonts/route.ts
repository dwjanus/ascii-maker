import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Return our supported fonts
    const fontList = [
      "standard",
      "big",
      "small",
      "banner",
      "block",
      "bubble",
      "digital",
      "graffiti",
      "shadow",
      "slant",
      "3d",
      "broadway",
      "colossal",
      "doom",
      "gothic",
      "isometric1",
      "larry3d",
      "ogre",
      "roman",
      "starwars",
    ]

    const fonts = fontList.map((font: string) => ({
      name: font.toLowerCase(),
      displayName: font.charAt(0).toUpperCase() + font.slice(1).replace(/[-_]/g, " "),
    }))

    return NextResponse.json({ success: true, fonts })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to load fonts",
      },
      { status: 500 },
    )
  }
}
