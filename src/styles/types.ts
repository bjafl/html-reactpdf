import { Styles as PDFStyles } from "@react-pdf/renderer";
import { Style as PDFStyle } from "@react-pdf/stylesheet";

export enum InvalidAction {
  Ignore,
  Throw,
  ConsoleWarn,
}

export interface StyleContext {
  stylesheet?: PDFStyles;
  dpi?: number;
  emBase?: number;
  remBase?: number;
  parentWidth?: number;
  parentHeight?: number;
  pctOf?: "width" | "height";
  targetDpi?: number;
  validFonts?: string[];
}

export interface TransformUnitOptions extends StyleContext {
  ignoreInvalidUnit?: boolean;
  defaultEmBase?: number;
  defaultRemBase?: number;
}

export interface CSSNumVal {
  value: number;
  unit: string | undefined;
}

export interface CSSNumValSafe {
  value: number;
  unit: string;
}

export type PDFStyleOrStyleArr = PDFStyle | PDFStyle[];

export type StyleProcessor<
  I extends PDFStyleOrStyleArr = PDFStyleOrStyleArr,
  R extends PDFStyleOrStyleArr | StyleExpansionReturnType = PDFStyle
> = (style: I, options?: StyleProcessorOptions) => R;

export type StyleExpansionReturnType = StyleExpansionReturnBoth | PDFStyle;
export interface StyleExpansionReturnBoth {
    expandedStyle: PDFStyle;
    stylesNotExpanded: PDFStyle | Record<string, string>;
}

export type StyleProcessorOptions = StyleProcessorBaseOptions | StyleProcessorFlattenOptions | StyleProcessorExpandOptions;
export interface StyleProcessorBaseOptions {
  styleContext?: StyleContext;
  onInvalid: InvalidAction;
}
export interface StyleProcessorExpandOptions extends StyleProcessorBaseOptions {
  //returnType?: "flattenedExistingPreferred" | "flattenedExpandedPreferred" | "both" | "expandedOnly";
  preferExpanded?: boolean;
}
export interface StyleProcessorFlattenOptions extends StyleProcessorBaseOptions {
    expandStyles?: boolean;
    prefersExpanded?: boolean;
}

export type StyleExpander = (
  keys: (string | string[])[],
  value: string
) => Record<string, string>;
export type StyleExpanderCompact = (val: string) => Record<string, string | number>;

export interface StyleExpansionMapping {
  [key: number]: StyleExpanderCompact;
}
export interface StyleExpansionMappingCompact {
  [key: number]: (string | string[])[];
}
/*export interface StyleExpansionRegexMapping {
  [propName: string]: RegExp;
}*/
export interface StyleExpansionValueCheckMapping {
  [propName: string]: (val: string) => boolean;
}
export interface StyleExpansionMap {
  [key: string]: StyleExpanderCompact;
}
