"use client";

import { generateImageAscii, generateTextAscii } from "@/lib/ascii-generator";
import { AsciiArtData, InputType, TextStyle } from "@/types/ascii";
import { useMutation } from "@tanstack/react-query";
import { useState, createContext, ReactNode, useContext } from "react";

type CreateInputContext = {
  inputType: "text" | "image";
  setInputType: (type: InputType) => void;
  textInput: string;
  setTextInput: (text: string) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  asciiData: AsciiArtData | null;
  setAsciiData: (data: AsciiArtData | null) => void;
  isColorMode: boolean;
  setIsColorMode: (mode: boolean) => void;
  fidelity: number[];
  setFidelity: (fidelity: number[]) => void;
  textStyle: TextStyle;
  setTextStyle: (textStyle: TextStyle) => void;
  fontSize: number[];
  setFontSize: (size: number[]) => void;
  letterSpacing: number[];
  setLetterSpacing: (spacing: number[]) => void;
  canGenerate: boolean;
  currentAsciiText: string;
};

export const InputContext = createContext<CreateInputContext>({
  inputType: "text",
  setInputType: () => {},
  textInput: "",
  setTextInput: () => {},
  imageFile: null,
  setImageFile: () => {},
  asciiData: null,
  setAsciiData: () => {},
  isColorMode: true,
  setIsColorMode: () => {},
  fidelity: [0.7],
  setFidelity: () => {},
  textStyle: "standard",
  setTextStyle: () => {},
  fontSize: [1],
  setFontSize: () => {},
  letterSpacing: [1],
  setLetterSpacing: () => {},
  canGenerate: false,
  currentAsciiText: "",
});

export function InputProvider({ children }: { children: ReactNode }) {
  const [inputType, setInputType] = useState<InputType>("text");
  const [textInput, setTextInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [asciiData, setAsciiData] = useState<AsciiArtData | null>(null);
  const [isColorMode, setIsColorMode] = useState(true);
  const [fidelity, setFidelity] = useState([0.7]);
  const [textStyle, setTextStyle] = useState<TextStyle>("standard");
  const [fontSize, setFontSize] = useState([1]);
  const [letterSpacing, setLetterSpacing] = useState([1]);

  const canGenerate = !!(
    (inputType === "text" && textInput.trim()) ||
    (inputType === "image" && imageFile)
  );

  const currentAsciiText = asciiData
    ? isColorMode
      ? asciiData.colorVersion
      : asciiData.grayscaleVersion
    : "";

  return (
    <InputContext.Provider
      value={{
        inputType,
        setInputType,
        textInput,
        setTextInput,
        imageFile,
        setImageFile,
        asciiData,
        setAsciiData,
        isColorMode,
        setIsColorMode,
        fidelity,
        setFidelity,
        textStyle,
        setTextStyle,
        fontSize,
        setFontSize,
        letterSpacing,
        setLetterSpacing,
        canGenerate,
        currentAsciiText,
      }}
    >
      {children}
    </InputContext.Provider>
  );
}

export function useGeneratorInput() {
  const context = useContext(InputContext);
  if (context === undefined) {
    ("useGeneratorInput must be used within InputProvider");
  }

  const generateMutation = useMutation({
    mutationFn: async () => {
      if (context.inputType === "text" && context.textInput.trim()) {
        return generateTextAscii(
          context.textInput.trim(),
          context.textStyle,
          context.fontSize[0],
          context.letterSpacing[0]
        );
      } else if (context.inputType === "image" && context.imageFile) {
        return generateImageAscii(context.imageFile, context.fidelity[0]);
      }
      throw new Error("Invalid input");
    },
    onSuccess: (result) => {
      if (result) {
        const newAsciiData: AsciiArtData = {
          id: Date.now().toString(),
          type: context.inputType,
          colorVersion: result.color,
          grayscaleVersion: result.grayscale,
          originalInput:
            context.inputType === "text"
              ? context.textInput
              : context.imageFile!,
          settings: {
            isColor: context.isColorMode,
            fidelity:
              context.inputType === "image" ? context.fidelity[0] : undefined,
            textStyle:
              context.inputType === "text" ? context.textStyle : undefined,
            fontSize:
              context.inputType === "text" ? context.fontSize[0] : undefined,
            letterSpacing:
              context.inputType === "text"
                ? context.letterSpacing[0]
                : undefined,
          },
        };
        context.setAsciiData(newAsciiData);
      }
    },
  });

  return { ...context, generateMutation };
}
