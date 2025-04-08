import { createContext, useContext, useMemo, useCallback } from "react";
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

/**
 * HTML context type definition for rendering HTML in React PDF
 */
export interface HtmlContextType {
  /** Document title from HTML <title> tag */
  title: string;
  /** Array of style objects to apply to HTML elements */
  stylesheets: PDFStyles[];
  /** Styles that override the default and stylesheet styles */
  overrideStyles: PDFStyles;
  /** Document DPI (dots per inch) for sizing calculations */
  dpi: number;
  /** Map of HTML tag names to renderer functions */
  renderers: ElementRenderers;
  /** Reference to the root HTML element being rendered */
  rootElement?: HTMLElement;
  /** List of valid font family names that can be used */
  validFonts?: string[];
  /** Whether emoji support is enabled */
  enableEmojiSupport?: boolean;
}

/**
 * Function type for selecting and rendering HTML elements
 */
export type SelectAndRender = (
  tagName: string,
  props: ElementRendererProps
) => React.ReactNode;

// Cache for style resolution to avoid redundant calculations
const styleCache = new Map<string, PDFStyle>();
const selectorResultCache = new Map<string, HTMLElement[]>();

/**
 * Default HTML context with initial values
 */
export const HtmlContext = createContext({
  title: "",
  stylesheets: [],
  overrideStyles: {},
  dpi: 96, // default DPI for react-pdf
  renderers: defaultElementRenderers,
  validFonts: ["Helvetica"], // Default font
  enableEmojiSupport: true, // Enable emoji support by default
} as HtmlContextType);

/**
 * Custom hook for accessing and extending the HTML context
 * 
 * Provides utilities for rendering HTML elements and resolving styles
 * with performance optimizations through memoization and caching.
 */
export const useHtmlContext = () => {
  const context = useContext(HtmlContext);

  /**
   * Renders an HTML element based on its tag name
   * Uses the appropriate renderer from context or falls back to defaults
   * 
   * @param tagName - HTML tag name to render
   * @param props - Properties for the renderer
   * @returns Rendered React node
   */
  const renderElement = useCallback<SelectAndRender>((tagName, props) => {
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
  }, [context.renderers]);

  /**
   * Resolves styles for an HTML element by combining:
   * - Inline styles
   * - Matching stylesheet rules
   * - Override styles
   * 
   * Uses caching for better performance with repeated elements.
   * 
   * @param element - HTML element to resolve styles for
   * @returns Combined and processed PDF-compatible style object
   */
  const resolveStyle = useCallback((element: HTMLElement) => {
    const { style } = element;
    const { stylesheets, overrideStyles, dpi, rootElement } = context;
    
    // Generate a cache key based on the element and styles
    // This is a simple approach - a more robust solution would include 
    // a proper element identifier and style version tracking
    const cacheKey = `${element.tagName}-${element.className}-${style.cssText}-${stylesheets.length}`;
    
    // Return cached style if available
    if (styleCache.has(cacheKey)) {
      return styleCache.get(cacheKey) as PDFStyle;
    }
    
    // Process inline styles from the element
    const styleContext = { stylesheets, overrideStyles, dpi };
    const inlineStyle = inlineToStyle(style.cssText, styleContext);

    // Start with override styles and inline styles
    const targetStyles = [overrideStyles, inlineStyle];
    
    // Combine all stylesheets (in reverse order for proper cascading)
    const stylesheetCombined = stylesheets
      .reverse()
      .reduce((acc, curr) => ({ ...acc, ...curr }), {} as PDFStyles);

    // Find matching stylesheet selectors for this element
    if (rootElement) {
      Object.entries(stylesheetCombined).forEach(([selector, value]) => {
        // Check selector cache first
        let matchingElements: HTMLElement[];
        const selectorCacheKey = `${selector}-${stylesheets.length}`;
        
        if (selectorResultCache.has(selectorCacheKey)) {
          matchingElements = selectorResultCache.get(selectorCacheKey)!;
        } else {
          // Query matching elements and cache the result
          matchingElements = Array.from(rootElement.querySelectorAll(selector)) as HTMLElement[];
          selectorResultCache.set(selectorCacheKey, matchingElements);
        }
        
        // Check if current element matches this selector
        if (matchingElements.includes(element)) {
          targetStyles.push(value);
        }
      });
    }
    
    // Flatten styles with proper priority (later styles override earlier ones)
    const flattenedStyle = targetStyles
      .reduce((acc, curr) => ({ ...acc, ...curr }), {} as PDFStyle);
    
    // Set up context for style conversion
    const contextForConversion: StyleContext = {
      stylesheet: stylesheetCombined,
      dpi,
      parentWidth: element.parentElement?.clientWidth,
      parentHeight: element.parentElement?.clientHeight,
    };
    
    // Convert to PDF-compatible styles
    const targetStyle = convertToPDFSemiSafeStyle(flattenedStyle, {
      styleContext: contextForConversion,
      onInvalid: InvalidAction.ConsoleWarn,
    }) as PDFStyle;
    
    // Cache the result
    styleCache.set(cacheKey, targetStyle);
    
    return targetStyle;
  }, [context]);

  return useMemo(() => ({
    ...context,
    renderElement,
    resolveStyle,
  }), [context, renderElement, resolveStyle]);
};
