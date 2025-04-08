import { createContext, useContext } from "react";
import { Styles as PDFStyles } from "@react-pdf/renderer";
import { Style as PDFStyle } from "@react-pdf/stylesheet";
import {
  defaultElementRenderers,
  defaultRenderer,
  ElementRendererProps,
  ElementRenderers,
} from "./renderers";
import {
  convertToPDFSemiSafeStyle,
  inlineToStyle,
} from "../styles/styles";
import { InvalidAction, StyleContext } from "../styles/types";
export interface HtmlContextType {
  title: string;
  stylesheets: PDFStyles[];
  overrideStyles: PDFStyles;
  dpi: number;
  renderers: ElementRenderers;
  rootElement?: HTMLElement;
  validFonts?: string[];
  enableEmojiSupport?: boolean;
}
export type SelectAndRender = (
  tagName: string,
  props: ElementRendererProps
) => React.ReactNode;

export const HtmlContext = createContext({
  title: "",
  stylesheets: [],
  overrideStyles: {},
  dpi: 96, // default DPI for react-pdf. May be good idea to set explicitly when init react-pdf/renderer
  renderers: defaultElementRenderers,
  validFonts: ["Helvetica"], // Only use Helvetica as the default font
  enableEmojiSupport: true, // Enable emoji support by default
} as HtmlContextType);

export const useHtmlContext = () => {
  const context = useContext(HtmlContext);

  const renderElement: SelectAndRender = (tagName, props) => {
    tagName = tagName.toLowerCase();
    const renderer =
      context.renderers[tagName] ||
      defaultElementRenderers[tagName] ||
      defaultRenderer;
    if (typeof renderer === "function") {
      return renderer(props);
    } else {
      console.warn(`No valid renderer found for tag: ${tagName}`);
      return null;
    }
  };

  const resolveStyle = (element: HTMLElement) => {
    //TODO: implement resolveStyle
    const { style } = element;
    const { stylesheets, overrideStyles, dpi, rootElement } = context;
    const styleContext = { stylesheets, overrideStyles, dpi };
    const inlineStyle = inlineToStyle(style.cssText, styleContext);

    const targetStyles = [overrideStyles, inlineStyle];
    const stylesheetCombined = stylesheets
      .reverse()
      .reduce((acc, curr) => ({ acc, ...curr }), {} as PDFStyles);

    Object.entries(stylesheetCombined).forEach(([key, value]) => {
      const matchingElements = rootElement?.querySelectorAll(key);
      if (!matchingElements) return;
      for (const el of matchingElements) {
        if (el === element) {
          targetStyles.push(value);
          return;
        }
      }
    });
    const flattenedStyle = targetStyles
      .reverse()
      .reduce((acc, curr) => ({ ...acc, ...curr }), {} as PDFStyle);
    
    const contextForConversion: StyleContext = {
      stylesheet: stylesheetCombined,
      //overrideStyles,
      dpi,
      parentWidth: element.parentElement?.clientWidth,
      parentHeight: element.parentElement?.clientHeight,
      // TODO: //validFonts: context.validFonts, 
    };
    const targetStyle = convertToPDFSemiSafeStyle(flattenedStyle, {
      styleContext: contextForConversion,
      onInvalid: InvalidAction.ConsoleWarn,
    });
    return targetStyle as PDFStyle;
  };

  return {
    ...context,
    renderElement,
    resolveStyle,
  };
};
