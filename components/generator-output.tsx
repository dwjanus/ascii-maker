import { useGeneratorInput } from "@/hooks/use-generator-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";
import type { TextStyle } from "@/types/ascii";
import { Switch } from "@/components/ui/switch";
import AsciiRenderer from "@/components/ascii-renderer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CANVAS_FONTS: { value: TextStyle; label: string }[] = [
  { value: "standard", label: "Standard" },
  { value: "big", label: "Big" },
  { value: "banner", label: "Banner" },
  { value: "block", label: "Block" },
  { value: "bubble", label: "Bubble" },
  { value: "digital", label: "Digital" },
  { value: "graffiti", label: "Graffiti" },
  { value: "shadow", label: "Shadow" },
  { value: "slant", label: "Slant" },
];

const switchSizeStyles =
  "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input";

export function GeneratorOutput() {
  const {
    textStyle,
    setTextStyle,
    asciiData,
    isColorMode,
    setIsColorMode,
    fidelity,
    setFidelity,
    generateMutation,
    currentAsciiText,
    fontSize,
    letterSpacing,
    inputType,
  } = useGeneratorInput();

  function handleRegenerateWithSettings() {
    if (asciiData) {
      generateMutation.mutate();
    }
  }

  return (
    <Card className="flex flex-col border-primary">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <h1 className="text-lg">
              Canvas{" "}
              {!asciiData ? "" : asciiData?.type === "image" ? "Image" : "Text"}
            </h1>
          </CardTitle>
          {asciiData && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="color-toggle"
                  className="text-xs text-muted-foreground"
                >
                  Color
                </Label>
                <Switch
                  id="color-toggle"
                  checked={isColorMode}
                  onCheckedChange={setIsColorMode}
                  className={switchSizeStyles}
                />
              </div>

              {asciiData.type === "image" && (
                <div className="flex items-center gap-2 min-w-[120px]">
                  <Label className="text-xs text-muted-foreground whitespace-nowrap">
                    Fidelity
                  </Label>
                  <Slider
                    value={fidelity}
                    onValueChange={setFidelity}
                    max={1}
                    min={0.1}
                    step={0.1}
                    className="w-16"
                  />
                  <span className="text-xs text-muted-foreground w-8">
                    {Math.round(fidelity[0] * 100)}%
                  </span>
                </div>
              )}

              {asciiData.type === "text" && (
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-muted-foreground sr-only">
                    Style
                  </Label>
                  <Select
                    value={textStyle}
                    onValueChange={(value) => setTextStyle(value as TextStyle)}
                  >
                    <SelectTrigger className="h-7 w-24 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-40">
                      {CANVAS_FONTS.slice(0, 10).map((font) => (
                        <SelectItem
                          key={`quick-${font.value}`}
                          value={font.value}
                        >
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button
                onClick={handleRegenerateWithSettings}
                disabled={generateMutation.isPending}
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs bg-transparent"
              >
                {generateMutation.isPending ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  "Apply"
                )}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        {asciiData ? (
          <div className="h-96 rounded-lg border border-card bg-black mx-4 mb-4 overflow-auto">
            <AsciiRenderer
              asciiText={currentAsciiText}
              isColor={isColorMode}
              className="w-full h-full"
              fontSize={fontSize[0]}
              letterSpacing={letterSpacing[0]}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-96 mx-4 mb-4 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/10">
            <div className="text-center space-y-2">
              <div className="text-4xl text-muted-foreground/50">🎨</div>
              <p className="text-muted-foreground">
                Your ASCII art will appear here
              </p>
              <p className="text-sm text-muted-foreground/75">
                {inputType === "text" ? "Enter some text" : "Upload an image"}{" "}
                and click generate
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
