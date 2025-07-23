"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type FigletFont, useFiglet } from "react-hook-figlet";
import { GeneratorInput } from "@/components/generator-input";
import { GeneratorOutput } from "@/components/generator-output";
import { useGeneratorInput } from "@/hooks/use-generator-input";
import { Header } from "@/components/header";
import FigletSelect from "@/components/figlet-select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useCopyToClipboard } from "@uidotdev/usehooks";

export default function AsciiGeneratorPage() {
  const { textInput, asciiData } = useGeneratorInput();
  const [figletFont, _setFigletFont] = useState<string>("Standard");
  const [figletText, setSourceText, setFigletFont] = useFiglet(
    figletFont as FigletFont
  );
  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const [hasCopiedText, setHasCopiedText] = useState(Boolean(copiedText));

  useEffect(() => {
    if (!asciiData || textInput.length === 0 || asciiData?.type !== "text")
      return;

    setFigletFont(figletFont as FigletFont);
    setSourceText(textInput);
  }, [asciiData, figletFont]);

  useEffect(() => {
    if (!hasCopiedText) return;
    const timeout = setTimeout(() => {
      setHasCopiedText(false);
    }, 4000);

    return () => clearTimeout(timeout);
  }, [hasCopiedText]);

  return (
    <div className="min-h-screen max-w-screen overflow-x-hidden bg-gradient-to-br from-background to-black p-4">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="text-center space-y-4 py-6">
          <Header />
        </div>

        <div className="grid gap-4 lg:grid-cols-2 max-w-screen-2xl">
          <GeneratorInput />

          <div className="space-y-3">
            <GeneratorOutput />
          </div>
        </div>

        <TooltipProvider>
          {asciiData?.type === "text" && (
            <div className="w-full max-w-screen">
              <Card>
                <CardHeader className="pt-3 px-4 w-full flex flex-row items-center justify-between gap-4">
                  <CardTitle>Figlet Fonts</CardTitle>
                  <div className="flex flex-row items-center gap-4">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => {
                            copyToClipboard(figletText);
                            setHasCopiedText(true);
                          }}
                          size="sm"
                          variant="ghost"
                          className="flex items-center justify-center hover:opacity-80 shadow-sm transition-all duration-200 hover:scale-105"
                        >
                          {hasCopiedText ? "Copied " : "Copy "}
                          <CheckIcon
                            aria-hidden={!hasCopiedText}
                            className="h-5 w-5 text-green-500 aria-hidden:opacity-0 aria-hidden:hidden transition-all duration-200"
                          />
                          <CopyIcon
                            aria-hidden={hasCopiedText}
                            className="h-5 w-5 text-foreground aria-hidden:opacity-0  aria-hidden:hidden transition-all duration-200"
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy to clipboard</p>
                      </TooltipContent>
                    </Tooltip>
                    <FigletSelect
                      value={figletFont}
                      onChange={(value) => _setFigletFont(value)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="w-full min-h-56 flex flex-col items-center justify-center overflow-x-hidden">
                  <pre>{figletText}</pre>
                </CardContent>
              </Card>
            </div>
          )}
        </TooltipProvider>
      </div>
    </div>
  );
}
