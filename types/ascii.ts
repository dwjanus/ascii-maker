export type InputType = "text" | "image";

export type TextStyle =
  | "standard"
  | "bubble"
  | "block"
  | "shadow"
  | "slant"
  | "big"
  | "small"
  | "banner"
  | "digital"
  | "graffiti";

export type AsciiArtData = {
  id: string;
  type: InputType;
  colorVersion: string;
  grayscaleVersion: string;
  originalInput: string | File;
  settings: {
    isColor: boolean;
    fidelity?: number;
    textStyle?: TextStyle;
    fontSize?: number;
    letterSpacing?: number;
  };
};

export type GenerationStatus = "idle" | "generating" | "complete" | "error";
