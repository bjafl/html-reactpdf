import * as PDFStyle from "@react-pdf/stylesheet";
import { StyleKey } from "@react-pdf/stylesheet";
import { convertInlineStyle } from "./cssUtils";
import {
  //StyleSheet as PDFStyleSheet,
  Styles as PDFStyles,
} from "@react-pdf/renderer";
import { parseCssNode } from "./cssNodeParser";
import { expansionMap } from "./styleExpanders";
import { UnitError, StyleError/*, ExpansionError*/ } from "./errors";
import {
  CSSNumVal,
  CSSNumValSafe,
  InvalidAction,
  StyleContext,
  TransformUnitOptions,
  StyleProcessor,
  StyleProcessorFlattenOptions,
  StyleProcessorExpandOptions,
  StyleExpansionReturnBoth,
  StyleProcessorOptions,
} from "./types";
import {
  validateSafeStyle,
  validateStyle,
  validateStyleKey,
  VALUE_CHECKS
} from "./validateStyle";
import Color from "color";

//export const isStyleKey = (value: unknown) => isA<StyleKey>(value);
//export const isStyle = (value: unknown) => isA<PDFStyle.Style>(value);
//export const isSafeStyle = (value: unknown) => isA<PDFStyle.SafeStyle>(value);
const isPercentage = (value: string) => /^\d+(\.\d+)?%$/.test(value);

export function inlineToStyle(
  style: string | Record<string, string>,
  styleContext: StyleContext,
  skipInvalidKeys = true,
  skipInvalidValues = true
): PDFStyle.Style {
  const styleRecord: Record<string, string> = convertInlineStyle(style);
  const transformOptions: TransformUnitOptions = {
    ...styleContext,
    ignoreInvalidUnit: false, // Optional skipping invalid handled by try/catch
  };
  const expandedStyle = expandStyle(styleRecord, {
    onInvalid: skipInvalidValues ? InvalidAction.Ignore : InvalidAction.Throw,
    preferExpanded: true,
  });

  const validStyle: PDFStyle.Style = {};
  // TODO: extra checks for valid values and transformations here should be moved to other function.
  Object.entries(expandedStyle).forEach(([key, value]) => {
    if (validateStyleKey(key)) {
      key = key as StyleKey;
      if (key === "fontFamily") {
        if (!styleContext.validFonts?.includes(value)) {
          //TODO: More robust check
          if (skipInvalidValues) {
            console.warn(`Invalid font family: ${value}`);
            return;
          } else {
            throw new StyleError(`Invalid font family: ${value}`, key, value);
          }
        }
        validStyle.fontFamily = value;
        return;
      }
      try {
        const validValue = transformUnit(value, {
          ...transformOptions,
          });
        if (
          key.includes("border") &&
          key.includes("Width") &&
          validValue === 0
        ) {
          validStyle[key as StyleKey] = 0;
          return;
        }
        validStyle[key as StyleKey] = validValue;
      } catch {
        if (["none", undefined, "undefined"].includes(value)) {
          if (key === "border") return;
          if (key.includes("border") && key.toLowerCase().includes("width")) {
            validStyle[key as StyleKey] = 0;
            return;
          }
          validStyle[key as StyleKey] = 0;
          return;
        }
        if (isValidStyleValue(key, value)) {
          validStyle[key as StyleKey] = value;
          return;
        }

        if (skipInvalidValues) {
          console.warn(`Invalid value for ${key}: ${value}`);
        } else {
          throw new Error(`Invalid value for ${key}: ${value}`);
        }
      }
    } else if (skipInvalidKeys) {
      console.warn(`Invalid style key: ${key}`);
    } else {
      throw new Error(`Invalid style key: ${key}`);
    }
  });
  //console.log("validStyle", validStyle); //TODO: remove
  return validStyle;
}

export const ensureValidStyle: StyleProcessor<
  Record<string, string> | PDFStyle.Style,
  PDFStyle.Style
> = (style, options?) => {
  const { onInvalid, styleContext } = {
    onInvalid: InvalidAction.Ignore,
    styleContext: undefined,
    ...options,
  };
  const expandedStyle = expandStyle(style, options);
  const validStyle: PDFStyle.Style = {};
  Object.entries(expandedStyle).forEach(([key, value]) => {
    if (validateStyleKey(key)) {
      if (validateStyle({[key]: value})) {
        try {
          const validValue = transformUnit(value, {
            ...styleContext,
            ignoreInvalidUnit: false
          });
          validStyle[key as StyleKey] = validValue;
        } catch (e) {
          handleInvalid(e as Error, onInvalid);
        }
    } else {
      handleInvalid(new StyleError(`Invalid style key: ${key}`, key, value), onInvalid);
    }
  }
});
  return validStyle;
}

export function combineStyles(styles: PDFStyles[]) {
  return styles.reduce((acc, style) => {
    Object.entries(style).forEach(([key, value]) => {
      if (key in acc) {
        acc[key] = { ...acc[key], ...value };
      } else {
        acc[key] = value;
      }
    });
    return acc;
  }, {} as PDFStyles);
}
export function convertCssNode(styleString: string) {
  const styleRecord = parseCssNode(styleString);
  const styleSheet: PDFStyles = {};
  Object.entries(styleRecord).forEach(([selector, styles]) => {
    const validStyles: PDFStyle.Style = Object.entries(styles).reduce(
      (acc, [key, value]) => (validateStyleKey(key) ? { ...acc, [key]: value } : acc),
      {} as PDFStyle.Style
    );
    styleSheet[selector] = validStyles;
  });
  return styleSheet;
}

export function isValidStyleValue(
  key: string,
  value: string,
  onInvalid = InvalidAction.Ignore
) {
  if (!validateStyleKey(key)) {
    if (onInvalid === InvalidAction.Throw)
      throw new StyleError(`Invalid style key: ${key}`, key, value);
    if (onInvalid === InvalidAction.ConsoleWarn)
      console.warn(`Invalid style key: ${key}`);
    return false;
  }
  if (validateStyle({ [key]: value })) return true;
  if (onInvalid === InvalidAction.Throw)
    throw new StyleError(`Invalid style value: ${value}`, key, value);
  if (onInvalid === InvalidAction.ConsoleWarn)
    console.warn(`Invalid style value: ${value}`);
  return false;
}

export const filterInvalidStyleValues: StyleProcessor<PDFStyle.Style> = (
  style,
  options?
) => {
  const onInvalid =
    options?.onInvalid !== undefined
      ? options.onInvalid
      : InvalidAction.Ignore;
  const validStyle: PDFStyle.Style = {};
  Object.entries(style).forEach(([key, value]) => {
    if (isValidStyleValue(key, value, onInvalid)) {
      validStyle[key as StyleKey] = value;
    }
  });
  return validStyle;
};

export function transformStyleSheet(
  styleSheet: PDFStyles,
  transformFunction: StyleProcessor,
  functionArgs: StyleProcessorOptions
): PDFStyles {
  const transformedStyleSheet: PDFStyles = {};
  Object.entries(styleSheet).forEach(([key, styles]) => {
    const tranformedPart = transformFunction(styles, functionArgs);
    transformedStyleSheet[key] = tranformedPart;
  });
  return transformedStyleSheet;
}

const handleInvalid = (err: Error, onInvalid: InvalidAction) => {
  switch (onInvalid) {
    case InvalidAction.Throw:
      throw err;
    case InvalidAction.Ignore:
      return;
    case InvalidAction.ConsoleWarn:
    default:
      console.warn(err);
  }
};
export const convertToSafeStyle: StyleProcessor = (style, options?) => {
  const onInvalid =
    options?.onInvalid !== undefined
      ? options.onInvalid
      : InvalidAction.Ignore;
  const styleContext = options?.styleContext;

  const flattenedStyle = flattenStyles(style, { onInvalid });
  const safeStyle: PDFStyle.Style = {};
  Object.entries(flattenedStyle).forEach(([key, value]) => {
    const entry = { [key]: value };
    if (validateSafeStyle(entry)) {
      safeStyle[key as StyleKey] = value;
    } /*else if (isPercentage(value) && isSafeStyle(entry)) {
      //TODO: Redundant, catched above
      console.log("convertToSafeStyle - percentage&safeStyle", key, value);
      safeStyle[key as StyleKey] = value;
    }*/ else {
      try {
        const transformedValue = transformUnit(value, {
          ...styleContext,
          ignoreInvalidUnit: false
        });
        const transformedEntry = { [key]: transformedValue };
        if (validateSafeStyle(transformedEntry)) {
          safeStyle[key as StyleKey] = transformedValue;
        } else {
          throw new StyleError(
            `Invalid safe style - ${key}: ${value}`,
            key,
            value
          );
        }
      } catch (e) {
        handleInvalid(e as Error, onInvalid);
      }
    }
  });
  return safeStyle;
};
export const convertToPDFSemiSafeStyle: StyleProcessor = (style, options?) => {
  const onInvalid =
    options?.onInvalid !== undefined
      ? options.onInvalid
      : InvalidAction.Ignore;
  const styleContext = options?.styleContext;
  const flattenedStyle = flattenStyles(style, { onInvalid });
  const ptTransformedStyle: PDFStyle.Style = {};
  Object.entries(flattenedStyle).forEach(([key, value]) => {
    //const entry = { [key]: value };
    if (validateStyleKey(key)) {
      try {
        if (isPercentage(value)) {
          ptTransformedStyle[key] = value;
        } else {
          const transformedValue = transformUnit(value, {
            ...styleContext,
            ignoreInvalidUnit: false
          });
          ptTransformedStyle[key as StyleKey] = transformedValue;
        }
      } catch (e) {
        if (isValidStyleValue(key, value, onInvalid)) {
          ptTransformedStyle[key] = value;
        } else {
          handleInvalid(e as Error, onInvalid); // TODO
        }
      }
    } else {
      handleInvalid(new Error(`Style ${key}: ${value} not valid`), onInvalid);
    }
  });
  return ptTransformedStyle;
};

export const flattenStyles: StyleProcessor = (
  styles,
  options?: StyleProcessorFlattenOptions
) => {
  const expandStyles =
    options?.expandStyles !== undefined ? options.expandStyles : true;
  const prefersExpandedStyles =
    options?.prefersExpanded !== undefined ? options.prefersExpanded : false;
  const onInvalid =
    options?.onInvalid !== undefined
      ? options.onInvalid
      : InvalidAction.Ignore;

  const stylesExpanded: PDFStyle.Style[] = [];
  const stylesNotExpanded: PDFStyle.Style[] = [];
  const stylesArray = Array.isArray(styles) ? styles : [styles];
  const validStyles = stylesArray.map((value) =>
    filterInvalidStyleValues(value, { onInvalid })
  );
  validStyles.forEach((style) => {
    if (expandStyles) {
      const { expandedStyle: expandedStyles, stylesNotExpanded: notExpanded } =
        expandStyleReturnBoth(style);
      stylesExpanded.push(expandedStyles);
      stylesNotExpanded.push(notExpanded);
    } else {
      stylesExpanded.push(style);
    }
  });
  const flattenedNotExpanded = Object.assign({}, ...stylesNotExpanded);
  const flattenedExpanded = Object.assign({}, ...stylesExpanded);
  return prefersExpandedStyles
    ? { ...flattenedNotExpanded, ...flattenedExpanded }
    : { ...flattenedExpanded, ...flattenedNotExpanded };
};

export const expandStyle: StyleProcessor<PDFStyle.Style | Record<string, string>> = (
  style,
  options?: StyleProcessorExpandOptions
) => {
  const preferExpanded =
    options?.preferExpanded !== undefined ? options.preferExpanded : false;
  const { expandedStyle: expandedStyles, stylesNotExpanded } = expandStyleReturnBoth(
    style,
    options
  );
  return preferExpanded
    ? { ...stylesNotExpanded, ...expandedStyles }
    : { ...expandedStyles, ...stylesNotExpanded };
};

export const expandStyleReturnBoth: StyleProcessor<
  Record<string, string> | PDFStyle.Style,
  StyleExpansionReturnBoth
> = (style/*, options?*/) => { //TODO: review options
  /*const onInvalid =
    options?.onInvalid !== undefined
      ? options.onInvalid
      : InvalidAction.ConsoleWarn;*/
  const expandedStyle: PDFStyle.Style = {};
  const stylesNotExpanded: Record<string, string> = {};
  Object.entries(style).forEach(([key, value]) => {
    if (key in expansionMap && typeof value !== "number") {
      const expander = expansionMap[key];
      Object.assign(expandedStyle, expander(value));
      //console.log("expandedStyle", expander(value)); //TODO: remove
    } else {
      stylesNotExpanded[key] = value;
    }
  });
  return {  expandedStyle, stylesNotExpanded };
};

export function getStyleContext(
  container: PDFStyle.Container,
  otherOptions?: StyleContext
): StyleContext {
  const { width, height, dpi, remBase } = container;
  return {
    parentWidth: width,
    parentHeight: height,
    dpi,
    remBase,
    ...otherOptions,
  };
}

const defaultTransformUnitOptions = {
  ignoreInvalidUnit: true,
  defaultEmBase: 18,
  defaultRemBase: 18,
  targetDpi: 72,
  pctOf: "width",
  checkColor: false,
};
/**
 * This function is sourced from @react-pdf/stylesheet, with modifications
 *
 * @param value - Styles value
 * @param options - Options for transforming the value
 * @param options.dpi - DPI of style, for resolving relative units
 * @param options.emBase - Base font size in pt for em units
 * @param options.remBase - Base font size in pt for rem units
 * @param options.parentWidth - Parent width in pt for resolving vw and % units
 * @param options.parentHeight - Parent height in pt for resolving vh and % units
 * @param options.pctOf - Sets which dimension to use for % units. Default is "width"
 * @param options.ignoreInvalidUnit - If true, invalid units will be ignored and input unit pt is assumed
 * @param options.defaultEmBase - Default base font size in pt for em units
 * @param options.defaultRemBase - Default base font size in pt for rem units
 * @param options.targetDpi - Target DPI for the output. Default is 72
 * @returns - Transformed number value in pt
 * @throws - UnitError if the value is invalid and ignoreInvalidUnit is false
 * @throws - Error if there is no height or width to resolve vh, vw, or %
 * @description - Transforms the value to the correct value in pt. If relative unit,
 * the output value is based on the input dimensions from container or props.
 */
export const transformUnit = (
  value: number | string,
  options?: TransformUnitOptions
) => {
  const {
    dpi,
    emBase: emBaseOption,
    remBase: remBaseOption,
    parentWidth,
    parentHeight,
    pctOf,
    ignoreInvalidUnit,
    defaultEmBase,
    defaultRemBase,
    targetDpi
  } = { ...defaultTransformUnitOptions, ...options };
  if (typeof value === 'string' && VALUE_CHECKS.isColor(value)) {
    try {
      return convertColorValue(value);
    } catch {
      if (ignoreInvalidUnit) {
        console.warn(`Invalid color value: ${value}`);
      } else throw new UnitError("Invalid color value", undefined, value);
    }
  }
  const scalar = parseValue(value, undefined);
  const inputDpi = dpi || targetDpi;
  const mmFactor = (1 / 25.4) * targetDpi;
  const cmFactor = (1 / 2.54) * targetDpi;
  const remBase = remBaseOption || defaultRemBase;
  const emBase = emBaseOption || defaultEmBase;
  const widthBase = parentWidth || undefined;
  const heightBase = parentHeight || undefined;
  if (typeof scalar.value !== "number") return scalar.value;
  switch (scalar.unit) {
    case "rem":
      return scalar.value * remBase;
    case "em":
      return scalar.value * emBase;
    case "in":
      return scalar.value * targetDpi;
    case "mm":
      return scalar.value * mmFactor;
    case "cm":
      return scalar.value * cmFactor;
    case "vh":
      if (!heightBase) throw new Error("No height to resolve vh");
      return scalar.value * (heightBase / 100);
    case "vw":
      if (!widthBase) {
        if (ignoreInvalidUnit) return scalar.value;
        else throw new Error("No width to resolve vw");
      }
      return scalar.value * (widthBase / 100);
    case "px":
      return Math.round(scalar.value * (targetDpi / inputDpi));
    case "pt":
      return scalar.value;
    case "%":
      if (pctOf === "width") {
        if (!widthBase) throw new Error("No width to resolve %");
        return (scalar.value / 100) * widthBase;
      } else {
        if (!heightBase) throw new Error("No height to resolve %");
        return (scalar.value / 100) * heightBase;
      }
    default:
      if (ignoreInvalidUnit) {
        console.warn(`Invalid unit: ${scalar.unit}`);
        return scalar.value;
      } else throw new UnitError("Invalid unit", scalar.unit, value);
  }
};

/**
 * This function is sourced from @react-pdf/stylesheet, with modifications
 *
 * @param value - Scalar value
 * @param invalidUnitFallback - Fallback value for invalid unit. If null, it will throw an error.
 * @returns - Parsed value and unit
 * @throws - UnitError if the value is invalid
 * @throws - UnitError if the unit is invalid and invalidUnitFallback is null
 * @description - Parses scalar value in value and unit pairs. Recognized units are: in, mm, cm, pt, vh, vw, px, rem, em, %.
 */
function parseValue(
  value: number | string,
  invalidUnitFallback: null | undefined | string = null
): CSSNumVal | CSSNumValSafe {
  if (typeof value === "number") {
    if (invalidUnitFallback === null)
      throw new UnitError("No unit", undefined, value);
    return { value, unit: invalidUnitFallback as undefined | string };
  }
  const match = /^(-?\d*\.?\d+)(in|mm|cm|pt|vh|vw|px|rem|em|%)?$/g.exec(value);
  
  if (!match) throw new UnitError("Invalid value", undefined, value);
  const unit = match[2];
  if (!unit && invalidUnitFallback === null)
    throw new UnitError("Invalid unit", undefined, value);
  return {
    value: parseFloat(match[1]),
    unit: unit || (invalidUnitFallback as undefined | string),
  };
}

function convertColorValue(value: string | number): string {
  /*if (typeof value === "number") {
    return value;
  } else if (value.startsWith("#")) {
    return value;
  } else if (value.startsWith("rgb")) {
    const rgb = value.match(/(\d+),\s*(\d+),\s*(\d+)/);
    if (rgb) {
      return `#${(
        ((parseInt(rgb[1]) << 16) |
          (parseInt(rgb[2]) << 8) |
          parseInt(rgb[3])) &
        0xffffff
      )
        .toString(16)
        .padStart(6, "0")}`;
    }
  }*/
  try  
  {
    return Color(value).hex(); // TODO: check if this is correct

  } catch {
    throw new UnitError("Invalid color value", undefined, value);
  }
}
