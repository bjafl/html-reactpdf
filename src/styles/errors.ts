import { Style as PDFStyle } from "@react-pdf/stylesheet";

export class StyleError extends Error {
  key: string;
  value: string;
  style: PDFStyle | undefined;
  constructor(message: string, key: string, value: string, style?: PDFStyle) {
    super(message);
    this.key = key;
    this.value = value;
    this.style = style;
    this.name = "StyleError";
  }
}

export class UnitError extends Error {
  unit: string | undefined;
  value: string | number | undefined;
  constructor(message: string, unit?: string, value?: string | number) {
    super(message);
    this.unit = unit;
    this.value = value;
    this.name = "UnitError";
  }
}

export class ExpansionError extends StyleError {
  constructor(message: string, key: string, value: string) {
    super(message, key, value);
    this.name = "ExpansionError";
  }
}
