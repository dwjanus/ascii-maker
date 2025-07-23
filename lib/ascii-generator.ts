import type { TextStyle } from "@/types/ascii"

// Updated ASCII character set with more varied density
const ASCII_CHARS = "Ñ@#W$9876543210?!abc;:+=-,._ "

export async function generateTextAscii(
  text: string,
  style: TextStyle,
  fontSize = 1,
  letterSpacing = 1,
): Promise<{ color: string; grayscale: string }> {
  try {
    // Call our server-side API route
    const response = await fetch("/api/generate-ascii", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text.trim(),
        font: style,
        fontSize,
        letterSpacing,
      }),
    })

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`)
    }

    const result = await response.json()

    if (result.success) {
      return {
        color: result.ascii,
        grayscale: result.ascii,
      }
    } else {
      throw new Error(result.error || "Failed to generate ASCII art")
    }
  } catch (error) {
    // Fallback to basic client-side generation
    const lines = text.split("\n")
    const result = lines
      .map((line) => {
        if (line.trim() === "") return ""

        // Simple fallback based on style
        switch (style) {
          case "big":
            return line
              .split("")
              .map((char) => {
                if (char === " ") return "   "
                return `██${char}██`
              })
              .join(" ")
          case "small":
            return line
          case "banner":
            return line
              .split("")
              .map((char) => `#${char}#`)
              .join("")
          default:
            return line
              .split("")
              .map((char) => {
                if (char === " ") return "  "
                return `█${char}`
              })
              .join(" ")
        }
      })
      .join("\n")

    return { color: result, grayscale: result }
  }
}

export async function generateImageAscii(file: File, fidelity: number): Promise<{ color: string; grayscale: string }> {
  // Simulate async processing
  await new Promise((resolve) => setTimeout(resolve, 3000))

  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!

      const width = Math.floor(100 * fidelity)
      const height = Math.floor((img.height / img.width) * width * 0.5)

      canvas.width = width
      canvas.height = height

      ctx.drawImage(img, 0, 0, width, height)
      const imageData = ctx.getImageData(0, 0, width, height)

      let grayscaleArt = ""
      const colorData: Array<Array<{ char: string; r: number; g: number; b: number }>> = []

      for (let y = 0; y < height; y++) {
        const colorRow: Array<{ char: string; r: number; g: number; b: number }> = []

        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4
          const r = imageData.data[i]
          const g = imageData.data[i + 1]
          const b = imageData.data[i + 2]
          const alpha = imageData.data[i + 3] // Get alpha channel

          // Check if pixel is transparent or nearly transparent
          if (alpha < 128) {
            // Transparent pixel - use space
            grayscaleArt += " "
            colorRow.push({ char: " ", r: 0, g: 0, b: 0 })
          } else {
            // Opaque pixel - calculate brightness and map to character
            const brightness = (r + g + b) / 3

            // Map brightness to character index (darker = denser characters)
            const charIndex = Math.floor((brightness / 255) * (ASCII_CHARS.length - 1))
            const char = ASCII_CHARS[charIndex]

            // For grayscale version
            grayscaleArt += char

            // Store color data separately
            colorRow.push({ char, r, g, b })
          }
        }

        grayscaleArt += "\n"
        colorData.push(colorRow)
      }

      // Create color version by encoding color data as JSON in a special format
      const colorArt = `COLOR_DATA:${JSON.stringify(colorData)}\n${grayscaleArt}`

      resolve({
        color: colorArt,
        grayscale: grayscaleArt,
      })
    }

    img.src = URL.createObjectURL(file)
  })
}
