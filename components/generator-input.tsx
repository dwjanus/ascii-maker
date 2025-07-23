"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGeneratorInput } from "@/hooks/use-generator-input";
import { InputType } from "@/types/ascii";
import { Loader2, Upload, Type, ImageIcon, TypeIcon } from "lucide-react";

export function GeneratorInput() {
  const {
    textInput,
    setTextInput,
    imageFile,
    setImageFile,
    canGenerate,
    generateMutation,
    inputType,
    setInputType,
  } = useGeneratorInput();

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    }
  }

  function handleGenerate() {
    if (canGenerate) {
      generateMutation.mutate();
    }
  }

  return (
    <Card className="border-primary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {inputType === "text" ? (
            <TypeIcon className="h-5 w-5" />
          ) : (
            <ImageIcon className="h-5 w-5" />
          )}
          <h2 className="text-lg">Input</h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs
          value={inputType}
          onValueChange={(value) => setInputType(value as InputType)}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Text
            </TabsTrigger>
            <TabsTrigger value="image" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Image
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text-input">Enter your text</Label>
              <Textarea
                id="text-input"
                placeholder="Type something awesome..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="resize-none"
                rows={2}
                autoComplete="off"
              />
            </div>
          </TabsContent>

          <TabsContent value="image" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image-upload">Upload an image</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="h-full border-0 ring-0 flex-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                  <Upload className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </div>
              </div>
              {imageFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {imageFile.name}
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <Button
          onClick={handleGenerate}
          disabled={!canGenerate || generateMutation.isPending}
          className="w-full"
          size="lg"
        >
          {generateMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate ASCII Art"
          )}
        </Button>

        <p className="text-sm text-muted-foreground w-full text-center text-pretty mx-auto">
          All images and text are private and do not get saved or shared.
        </p>
      </CardContent>
    </Card>
  );
}
