"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Download,
  FileText,
  ImageIcon,
  Check,
  CopyIcon,
  FileTextIcon,
  CheckIcon,
} from "lucide-react";

type AsciiRendererProps = {
  asciiText: string;
  isColor: boolean;
  className?: string;
  fontSize?: number;
  letterSpacing?: number;
};

type ExportStatus = {
  type: "image" | "text" | "clipboard" | null;
  message: string;
  visible: boolean;
};

type ColorData = Array<
  Array<{ char: string; r: number; g: number; b: number }>
>;

export function AsciiRenderer({
  asciiText,
  isColor,
  className,
  fontSize = 1,
  letterSpacing = 1,
}: AsciiRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showFallback, setShowFallback] = useState(false);
  const [containerSize, setContainerSize] = useState({
    width: 600,
    height: 400,
  });
  const [exportStatus, setExportStatus] = useState<ExportStatus>({
    type: null,
    message: "",
    visible: false,
  });
  const [processedText, setProcessedText] = useState("");
  const [colorData, setColorData] = useState<ColorData | null>(null);

  // Process text and extract color data
  useEffect(() => {
    let textToProcess = asciiText;
    let extractedColorData: ColorData | null = null;

    // Check if this is image ASCII with color data
    if (asciiText.startsWith("COLOR_DATA:")) {
      try {
        const lines = asciiText.split("\n");
        const colorDataLine = lines[0];
        const jsonData = colorDataLine.replace("COLOR_DATA:", "");
        extractedColorData = JSON.parse(jsonData);
        textToProcess = lines.slice(1).join("\n");
      } catch (error) {
        textToProcess = asciiText;
      }
    }

    setColorData(extractedColorData);

    // Apply font size and letter spacing transformations
    if (textToProcess && (fontSize !== 1 || letterSpacing !== 1)) {
      const lines = textToProcess.split("\n");
      let transformedLines = lines;

      // Apply letter spacing
      if (letterSpacing !== 1) {
        const extraSpacing = Math.max(0, Math.round((letterSpacing - 1) * 3));
        const spacing = " ".repeat(extraSpacing);
        transformedLines = transformedLines.map((line) =>
          line.split("").join(spacing)
        );
      }

      // Apply font size scaling
      if (fontSize !== 1) {
        if (fontSize > 1) {
          const repeatCount = Math.round(fontSize);
          const scaledLines: string[] = [];

          // Horizontal scaling
          transformedLines = transformedLines.map((line) =>
            line
              .split("")
              .map((char) => char.repeat(Math.round(fontSize)))
              .join("")
          );

          // Vertical scaling
          for (const line of transformedLines) {
            for (let i = 0; i < repeatCount; i++) {
              scaledLines.push(line);
            }
          }
          transformedLines = scaledLines;
        }
      }

      setProcessedText(transformedLines.join("\n"));
    } else {
      setProcessedText(textToProcess);
    }
  }, [asciiText, fontSize, letterSpacing]);

  // Function to show success message
  const showSuccessMessage = useCallback(
    (type: "image" | "text" | "clipboard", message: string) => {
      setExportStatus({ type, message, visible: true });

      // Hide message after 3 seconds
      setTimeout(() => {
        setExportStatus((prev) => ({ ...prev, visible: false }));
      }, 3000);
    },
    []
  );

  // Function to measure container size
  const measureContainer = useCallback(() => {
    if (!containerRef.current) return { width: 600, height: 400 };

    const rect = containerRef.current.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(containerRef.current);

    // Account for padding and borders
    const paddingX =
      Number.parseFloat(computedStyle.paddingLeft) +
      Number.parseFloat(computedStyle.paddingRight);
    const paddingY =
      Number.parseFloat(computedStyle.paddingTop) +
      Number.parseFloat(computedStyle.paddingBottom);
    const borderX =
      Number.parseFloat(computedStyle.borderLeftWidth) +
      Number.parseFloat(computedStyle.borderRightWidth);
    const borderY =
      Number.parseFloat(computedStyle.borderTopWidth) +
      Number.parseFloat(computedStyle.borderBottomWidth);

    // Use full available space with minimal margins
    const availableWidth = Math.max(300, rect.width - paddingX - borderX - 10);
    const availableHeight = Math.max(
      200,
      rect.height - paddingY - borderY - 10
    );

    return {
      width: Math.floor(availableWidth),
      height: Math.floor(availableHeight),
    };
  }, []);

  // Resize observer to detect container size changes
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newSize = measureContainer();
        setContainerSize(newSize);
      }
    });

    resizeObserver.observe(containerRef.current);

    // Initial measurement
    const initialSize = measureContainer();
    setContainerSize(initialSize);

    return () => {
      resizeObserver.disconnect();
    };
  }, [measureContainer]);

  // Canvas rendering effect
  useEffect(() => {
    if (!canvasRef.current || showFallback) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to fill container completely
    canvas.width = containerSize.width;
    canvas.height = containerSize.height;

    // Clear canvas with transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!processedText || processedText.trim() === "") {
      ctx.fillStyle = "#ffffff";
      ctx.font = "14px monospace";
      ctx.textAlign = "center";
      ctx.fillText(
        "No ASCII text to display",
        canvas.width / 2,
        canvas.height / 2
      );
      return;
    }

    const lines = processedText.split("\n").filter((line) => line.length > 0);

    if (lines.length === 0) {
      ctx.fillStyle = "#ffffff";
      ctx.font = "14px monospace";
      ctx.textAlign = "center";
      ctx.fillText("Empty ASCII content", canvas.width / 2, canvas.height / 2);
      return;
    }

    // Calculate optimal text size to fill the container
    const maxLineLength = Math.max(...lines.map((line) => line.length));

    // Use conservative sizing to ensure everything fits
    const availableWidth = canvas.width - 40; // More margin for safety
    const availableHeight = canvas.height - 40; // More margin for safety

    // Calculate text size based on content
    const textSizeWidth = availableWidth / (maxLineLength * 0.6);
    const textSizeHeight = availableHeight / (lines.length * 1.1);

    // Use smaller, more conservative text size
    const textSize = Math.max(Math.min(textSizeWidth, textSizeHeight, 16), 2); // Max 16px, min 2px

    const charWidth = textSize * 0.6;
    const lineHeight = textSize * 1.1;

    // Better centering calculation with proper bounds checking
    const totalWidth = maxLineLength * charWidth;
    const totalHeight = lines.length * lineHeight;

    // Ensure content fits within canvas
    const startX = Math.max(
      20,
      Math.min((canvas.width - totalWidth) / 2, canvas.width - totalWidth - 20)
    );
    const startY = Math.max(
      20,
      Math.min(
        (canvas.height - totalHeight) / 2,
        canvas.height - totalHeight - 20
      )
    );

    // Set font
    ctx.font = `${textSize}px monospace`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    // Render each character
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      for (let j = 0; j < line.length; j++) {
        const char = line[j];

        if (char === " " || char === "") {
          continue;
        }

        const x = startX + j * charWidth;
        const y = startY + i * lineHeight;

        // Check if character would be completely off-screen
        if (
          x < 0 ||
          y < 0 ||
          x + charWidth > canvas.width ||
          y + lineHeight > canvas.height
        ) {
          continue;
        }

        if (isColor) {
          // Check if we have color data for this position (image ASCII)
          if (colorData && colorData[i] && colorData[i][j]) {
            const { r, g, b } = colorData[i][j];
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          } else {
            // Create color variation for text ASCII
            const hue = (i * 10 + j * 5 + char.charCodeAt(0)) % 360;
            ctx.fillStyle = `hsl(${hue}, 70%, 70%)`;
          }
        } else {
          // Use white for non-color mode for better visibility on black background
          ctx.fillStyle = "#ffffff";
        }

        // Render the character
        ctx.fillText(char, x, y);
      }
    }
  }, [processedText, isColor, showFallback, containerSize, colorData]);

  // Export functions
  const downloadAsImage = useCallback(() => {
    if (!canvasRef.current || !processedText) return;

    try {
      // Create a high-resolution canvas for export
      const exportCanvas = document.createElement("canvas");
      const exportCtx = exportCanvas.getContext("2d");
      if (!exportCtx) return;

      // Set high resolution for better quality
      const exportWidth = 1200;
      const exportHeight = 800;
      exportCanvas.width = exportWidth;
      exportCanvas.height = exportHeight;

      // Clear with white background for export
      exportCtx.fillStyle = "#ffffff";
      exportCtx.fillRect(0, 0, exportWidth, exportHeight);

      const lines = processedText.split("\n").filter((line) => line.length > 0);
      if (lines.length === 0) return;

      // Calculate text size for export
      const maxLineLength = Math.max(...lines.map((line) => line.length));
      const availableWidth = exportWidth - 80;
      const availableHeight = exportHeight - 80;

      const textSizeWidth = availableWidth / (maxLineLength * 0.6);
      const textSizeHeight = availableHeight / (lines.length * 1.2);
      const textSize = Math.max(Math.min(textSizeWidth, textSizeHeight, 24), 8);

      const charWidth = textSize * 0.6;
      const lineHeight = textSize * 1.2;

      const totalWidth = maxLineLength * charWidth;
      const totalHeight = lines.length * lineHeight;
      const startX = (exportWidth - totalWidth) / 2;
      const startY = (exportHeight - totalHeight) / 2;

      // Set font for export
      exportCtx.font = `${textSize}px monospace`;
      exportCtx.textAlign = "left";
      exportCtx.textBaseline = "top";

      // Render ASCII art
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        for (let j = 0; j < line.length; j++) {
          const char = line[j];
          if (char === " " || char === "") continue;

          const x = startX + j * charWidth;
          const y = startY + i * lineHeight;

          if (isColor) {
            // Check if we have color data for this position (image ASCII)
            if (colorData && colorData[i] && colorData[i][j]) {
              const { r, g, b } = colorData[i][j];
              exportCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            } else {
              // Create color variation for text ASCII
              const hue = (i * 10 + j * 5 + char.charCodeAt(0)) % 360;
              exportCtx.fillStyle = `hsl(${hue}, 70%, 50%)`;
            }
          } else {
            // Use dark color for export on white background
            exportCtx.fillStyle = "#1f2937";
          }

          exportCtx.fillText(char, x, y);
        }
      }

      // Download the image
      exportCanvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `ascii-art-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // Show success message
        showSuccessMessage("image", "PNG image downloaded successfully!");
      }, "image/png");
    } catch (error) {
      showSuccessMessage("image", "Failed to download image");
    }
  }, [processedText, isColor, showSuccessMessage, colorData]);

  const downloadAsText = useCallback(() => {
    if (!processedText) return;

    try {
      const blob = new Blob([processedText], {
        type: "text/plain;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ascii-art-${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Show success message
      showSuccessMessage("text", "Text file downloaded successfully!");
    } catch (error) {
      showSuccessMessage("text", "Failed to download text file");
    }
  }, [processedText, showSuccessMessage]);

  const copyToClipboard = useCallback(async () => {
    if (!processedText) return;

    try {
      await navigator.clipboard.writeText(processedText);
      showSuccessMessage("clipboard", "ASCII art copied to clipboard!");
    } catch (error) {
      try {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = processedText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        showSuccessMessage("clipboard", "ASCII art copied to clipboard!");
      } catch (fallbackError) {
        showSuccessMessage("clipboard", "Failed to copy to clipboard");
      }
    }
  }, [processedText, showSuccessMessage]);

  return (
    <div ref={containerRef} className={`${className} h-full`}>
      {!showFallback ? (
        <div className="relative w-full h-full">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ display: "block" }}
          />

          {/* Success Message */}
          {exportStatus.visible && (
            <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-2 rounded-md shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
              <CheckIcon className="h-4 w-4" />
              <span className="text-sm font-medium">
                {exportStatus.message}
              </span>
            </div>
          )}

          {/* Export Controls */}
          {processedText && (
            <div className="absolute top-2 right-2 flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={downloadAsImage}
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 bg-white hover:bg-gray-50 border-gray-300 shadow-sm transition-all duration-200 hover:scale-105"
                    >
                      <ImageIcon className="h-4 w-4 text-gray-700" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download as PNG image</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={downloadAsText}
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 bg-white hover:bg-gray-50 border-gray-300 shadow-sm transition-all duration-200 hover:scale-105"
                    >
                      <FileTextIcon className="h-4 w-4 text-gray-700" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download as text file</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={copyToClipboard}
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 bg-white hover:bg-gray-50 border-gray-300 shadow-sm transition-all duration-200 hover:scale-105"
                    >
                      <CopyIcon className="h-4 w-4 text-gray-700" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy to clipboard</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      ) : (
        <div className="relative w-full h-full">
          <div className="w-full h-full bg-gray-900 p-4 overflow-auto border border-gray-600 rounded">
            <pre className="text-white font-mono text-xs leading-tight whitespace-pre">
              {processedText}
            </pre>
          </div>

          {/* Success Message for HTML fallback */}
          {exportStatus.visible && (
            <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-2 rounded-md shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
              <CheckIcon className="h-4 w-4" />
              <span className="text-sm font-medium">
                {exportStatus.message}
              </span>
            </div>
          )}

          {/* Export Controls for HTML fallback */}
          {processedText && (
            <div className="absolute top-2 right-2 flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={downloadAsText}
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 bg-white hover:bg-gray-50 border-gray-300 shadow-sm transition-all duration-200 hover:scale-105"
                    >
                      <FileTextIcon className="h-4 w-4 text-gray-700" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download as text file</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={copyToClipboard}
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 bg-white hover:bg-gray-50 border-gray-300 shadow-sm transition-all duration-200 hover:scale-105"
                    >
                      <CopyIcon className="h-4 w-4 text-gray-700" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy to clipboard</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AsciiRenderer;
