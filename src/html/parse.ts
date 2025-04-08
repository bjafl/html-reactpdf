import DOMPurify from "dompurify";
import { HtmlParseResult, ParsedHead, ParseHtmlOptions } from "./types";
import { parseCssNode } from "../styles/cssNodeParser";
import { combineStyles, convertCssNode } from "../styles/styles";
import { cleanupHtmlTree, normalizeWhitespace } from "./htmlPreprocessor";

export function parseHtml(
  html: string | HTMLElement,
  options?: ParseHtmlOptions
) {
  const {
    sanitize = false,
    container,
    //fetchExternalStylesheets = false,
    extractStyleElements = true,
    convertStyles = true,
    preprocessHtml = true,
  } = options || {};
  const parsedHtml =
    typeof html === "string"
      ? parseHtmlString(html, sanitize, container)
      : { body: html };
  let { body, head } = parsedHtml;
  
  // Apply HTML pre-processing to clean up the structure
  if (preprocessHtml) {
    body = cleanupHtmlTree(body);
    normalizeWhitespace(body);
  }
  const headStyleData: string[] = [];
  const parsedHead = head ? parseHead(head) : undefined;
  if (parsedHead && head) {
    /*const extStyleData = fetchExternalStylesheets
      ? await getLinkedStylesheets(head)
      : [];*/ // TODO: fetch external stylesheets, cached
    const headStyleElemData = parsedHead.styleTags.map(
      (styleTag) => styleTag.innerHTML
    );
    headStyleData.push(...headStyleElemData);
    //headStyleData.push(...extStyleData);
  }
  const bodyStyleData: string[] = [];
  const bodyStyleElements = extractStyleElements
    ? Array.from(body.querySelectorAll("style"))
    : [];
  bodyStyleElements.forEach((elem) => {
    const styleData = elem.innerHTML;
    body.removeChild(elem);
    bodyStyleData.push(styleData);
  });
  const collectedStyles = [...headStyleData, ...bodyStyleData];
  const parsedStyles = convertStyles ? undefined : collectedStyles.map(parseCssNode);
  const convertedStyles = convertStyles
    ? combineStyles(collectedStyles.map(convertCssNode))
    : undefined;
  return {
    body,
    title: parsedHead?.title,
    //metaTags: parsedHead?.metaTags, //TODO: parse meta tags?
    parsedStyles,
    convertedStyles,
  }
  
}
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

export async function getLinkedStylesheets(
  head: HTMLElement
): Promise<string[]> {
  const linkTags = Array.from(head.querySelectorAll("link"));
  const stylesheets = linkTags
    .filter((link) => link.rel === "stylesheet")
    .map((link) => link.href);
  const stylesheetData: string[] = [];
  for (const link of stylesheets) {
    try {
      const response = await fetch(link);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${link}: ${response.statusText}`);
      }
      const text = await response.text();
      stylesheetData.push(text);
    } catch (error) {
      //TODO: options for error handling
      console.warn(`Error fetching ${link}:`, error);
      continue;
    }
  }
  return stylesheetData;
}
