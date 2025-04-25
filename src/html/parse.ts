import DOMPurify from "dompurify";
import { HtmlParseResult, ParsedHead, ParseHtmlOptions } from "./types";
import { parseCssNode } from "../styles/cssNodeParser";
import { combineStyles, convertCssNode } from "../styles/styles";
import { cleanupHtmlTree, normalizeWhitespace } from "./htmlPreprocessor";

// Simple caching mechanism to avoid redundant parsing
const htmlCache = new Map<string, HtmlParseResult>();

/**
 * Type for cached style data
 */
interface CachedStyleData {
  parsedStyles?: ReturnType<typeof parseCssNode>[];
  convertedStyles?: ReturnType<typeof combineStyles>;
}

const styleCache = new Map<string, CachedStyleData>();

/**
 * Parse HTML string or element into a structured format for rendering
 * 
 * This function handles the complete HTML parsing process, including:  
 * - Sanitization
 * - DOM parsing
 * - Style extraction
 * - Pre-processing for clean structure
 * 
 * @param html - HTML string or HTMLElement to parse
 * @param options - Configuration options for parsing
 * @returns Structured result with body, title and processed styles
 */
export function parseHtml(
  html: string | HTMLElement,
  options?: ParseHtmlOptions
) {
  const {
    sanitize = false,
    container,
    extractStyleElements = true,
    convertStyles = true,
    preprocessHtml = true,
    enableCaching = true,
  } = options || {};
  
  // Check cache for string HTML
  const cacheKey = typeof html === "string" ? html : "";
  if (enableCaching && cacheKey && htmlCache.has(cacheKey)) {
    return htmlCache.get(cacheKey)!;
  }
  
  // Parse the HTML string or use the provided element
  const parsedHtml =
    typeof html === "string"
      ? parseHtmlString(html, sanitize, container)
      : { body: html };
  const { body, head } = parsedHtml;
  
  // Apply HTML pre-processing to clean up the structure
  // Create a mutable copy for preprocessing
  let processedBody = body;
  if (preprocessHtml) {
    processedBody = cleanupHtmlTree(body);
    normalizeWhitespace(processedBody);
  }
  
  // Extract styles from head
  const headStyleData: string[] = [];
  const parsedHead = head ? parseHead(head) : undefined;
  if (parsedHead && head) {
    const headStyleElemData = parsedHead.styleTags.map(
      (styleTag) => styleTag.innerHTML
    );
    headStyleData.push(...headStyleElemData);
  }
  
  // Extract styles from body
  const bodyStyleData: string[] = [];
  if (extractStyleElements) {
    const bodyStyleElements = Array.from(body.querySelectorAll("style"));
    bodyStyleElements.forEach((elem) => {
      const styleData = elem.innerHTML;
      body.removeChild(elem);
      bodyStyleData.push(styleData);
    });
  }
  
  // Process all collected styles
  const collectedStyles = [...headStyleData, ...bodyStyleData];
  
  // Generate a cache key for styles
  const stylesKey = collectedStyles.join('\n');
  
  let parsedStyles, convertedStyles;
  
  // Try to get styles from cache first
  if (enableCaching && styleCache.has(stylesKey)) {
    const cachedStyles = styleCache.get(stylesKey);
    parsedStyles = cachedStyles?.parsedStyles;
    convertedStyles = cachedStyles?.convertedStyles;
  } else {
    // Process styles if not in cache
    parsedStyles = convertStyles ? undefined : collectedStyles.map(parseCssNode);
    convertedStyles = convertStyles
      ? combineStyles(collectedStyles.map(convertCssNode))
      : undefined;
      
    // Store in cache for future use
    if (enableCaching && stylesKey) {
      styleCache.set(stylesKey, { parsedStyles, convertedStyles });
    }
  }
  
  const result = {
    body: processedBody,
    title: parsedHead?.title,
    parsedStyles,
    convertedStyles,
  };
  
  // Store in cache if caching is enabled
  if (enableCaching && cacheKey) {
    htmlCache.set(cacheKey, result);
  }
  
  return result;
}

/**
 * Parse an HTML string into DOM elements
 * 
 * @param html - HTML string to parse
 * @param sanitize - Whether to sanitize the HTML
 * @param container - Optional container element to use
 * @returns Object with body and head elements
 */
export function parseHtmlString(
  html: string,
  sanitize = false,
  container?: HTMLElement
): HtmlParseResult {
  let newHtml = html;
  if (sanitize) {
    DOMPurify.setConfig({ ALLOWED_ATTR: ["style"] });
    newHtml = DOMPurify.sanitize(html);
  }
  if (container) {
    container.innerHTML = newHtml;
    return { body: container };
  } else {
    const parser = new DOMParser();
    const doc = parser.parseFromString(newHtml, "text/html");
    return {
      body: doc.body,
      head: doc.head,
    };
  }
}

/**
 * Extract metadata and style elements from HTML head
 * 
 * @param head - HTML head element to parse
 * @returns Structured object with title, meta tags, link tags, and style tags
 */
export function parseHead(head: HTMLElement): ParsedHead {
  const title = head.querySelector("title")?.innerHTML || "";
  const metaTags = Array.from(head.querySelectorAll("meta"));
  const linkTags = Array.from(head.querySelectorAll("link"));
  const styleTags = Array.from(head.querySelectorAll("style"));
  return {
    title,
    metaTags,
    linkTags,
    styleTags,
  };
}

/**
 * Fetch and retrieve external stylesheet content
 * 
 * @param head - HTML head element containing link tags
 * @returns Promise resolving to array of stylesheet content strings
 */
export async function getLinkedStylesheets(
  head: HTMLElement
): Promise<string[]> {
  const linkTags = Array.from(head.querySelectorAll("link"));
  const stylesheets = linkTags
    .filter((link) => link.rel === "stylesheet")
    .map((link) => link.href);
  const stylesheetData: string[] = [];
  
  // Process stylesheets in parallel for better performance
  const stylePromises = stylesheets.map(async (link) => {
    try {
      const response = await fetch(link);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${link}: ${response.statusText}`);
      }
      return await response.text();
    } catch (error) {
      console.warn(`Error fetching ${link}:`, error);
      return null;
    }
  });
  
  const results = await Promise.all(stylePromises);
  for (const text of results) {
    if (text) stylesheetData.push(text);
  }
  
  return stylesheetData;
}
