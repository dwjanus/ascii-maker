"use client"

import { useState, useEffect, useCallback } from "react"

export interface FontInfo {
  name: string
  displayName: string
}

export const useAsciiFont = () => {
  const [availableFonts, setAvailableFonts] = useState<FontInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize and get available fonts from server
  useEffect(() => {
    const initializeFonts = async () => {
      try {
        setIsLoading(true)

        const response = await fetch("/api/fonts")
        const data = await response.json()

        if (data.success) {
          setAvailableFonts(data.fonts)
        } else {
          throw new Error(data.error || "Failed to load fonts")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to initialize fonts")

        // Fallback to basic font list
        const fallbackFonts: FontInfo[] = [
          { name: "standard", displayName: "Standard" },
          { name: "big", displayName: "Big" },
          { name: "small", displayName: "Small" },
          { name: "banner", displayName: "Banner" },
          { name: "block", displayName: "Block" },
          { name: "bubble", displayName: "Bubble" },
          { name: "digital", displayName: "Digital" },
          { name: "graffiti", displayName: "Graffiti" },
          { name: "shadow", displayName: "Shadow" },
          { name: "slant", displayName: "Slant" },
        ]
        setAvailableFonts(fallbackFonts)
      } finally {
        setIsLoading(false)
      }
    }

    initializeFonts()
  }, [])

  // Generate ASCII art via server
  const generateAsciiArt = useCallback(async (text: string, fontName = "standard"): Promise<string> => {
    try {
      const response = await fetch("/api/generate-ascii", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          font: fontName,
        }),
      })

      const data = await response.json()

      if (data.success) {
        return data.ascii
      } else {
        throw new Error(data.error || "Failed to generate ASCII art")
      }
    } catch (error) {
      return text // Fallback to original text
    }
  }, [])

  return {
    availableFonts,
    generateAsciiArt,
    isLoading,
    error,
  }
}
