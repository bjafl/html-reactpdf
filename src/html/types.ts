import { ParsedCssStyles } from "../styles/cssNodeParser";
import { Styles as PDFStyles } from "@react-pdf/renderer";

/**
 * Result of HTML parsing operation
 */
export interface HtmlParseResult {
    /** The HTML body element containing the document content */
    body: HTMLElement;
    /** The HTML head element containing metadata (optional) */
    head?: HTMLElement;
    parsedStyles?: ParsedCssStyles[];
    convertedStyles?: PDFStyles;
    title?: string;
}

/**
 * Parsed data from HTML <head> element
 */
export interface ParsedHead {
    /** Document title from <title> tag */
    title: string;
    /** Collection of meta tags from document */
    metaTags: HTMLMetaElement[];
    /** Collection of link tags (stylesheets, favicons, etc.) */
    linkTags: HTMLLinkElement[];
    /** Collection of style tags containing CSS */
    styleTags: HTMLStyleElement[];
}

/**
 * Options for HTML parsing process
 */
export interface ParseHtmlOptions {
    /** Whether to sanitize HTML to remove potentially unsafe content */
    sanitize?: boolean;
    /** Optional container element to use for parsing */
    container?: HTMLElement;
    /** Whether to fetch and process external stylesheets */
    fetchExternalStylesheets?: boolean;
    /** Whether to extract and process <style> elements */
    extractStyleElements?: boolean;
    /** Whether to convert CSS styles to React PDF compatible styles */
    convertStyles?: boolean;
    /** Whether to preprocess HTML for better rendering (clean structure, normalize whitespace) */
    preprocessHtml?: boolean;
    /** Whether to enable caching for parsed HTML and styles */
    enableCaching?: boolean;
}

/**
 * JSON representation of an HTML node
 * Used for serialization and data transfer
 */
export interface HTMLNodeJson {
    /** HTML tag name */
    tag?: string;
    /** Child nodes */
    children?: HTMLNodeJson[];
    /** Text content if this is a text node */
    textContent?: string;
    /** CSS styles for this node */
    style?: Record<string, string | number | boolean | Record<string, string | number>>;
    /** HTML attributes */
    attributes?: Record<string, string>;
}