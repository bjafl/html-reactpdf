import { Text } from "@react-pdf/renderer";
import { parseHtml } from "./parse";
import { useHtmlContext } from "./htmlContext";
import { FC, Fragment, ReactNode } from "react";
import { ParseHtmlOptions } from "./types";

interface RenderHtmlProps {
  children: string;
  options?:ParseHtmlOptions;
}
export const RenderHtml: FC<RenderHtmlProps> = ({ children: html, options }) => {
  const htmlContext = useHtmlContext();

  const { body, title, convertedStyles } = parseHtml(html, options);
  
  if (title) htmlContext.title = title;
  if (convertedStyles) htmlContext.stylesheets.push(convertedStyles);
  htmlContext.rootElement = body;
  return RenderHtmlElement(body);
};

interface RenderHtmlNodeProps {
  node: Node;
  childIndex?: number;
}
export const RenderHtmlNode: FC<RenderHtmlNodeProps> = ({node, childIndex=0}) => {
  if (node instanceof HTMLElement) {
    return RenderHtmlElement(node);
  } else if (node instanceof Comment) {
    return null;
  } else if (node instanceof DocumentFragment) {
    return Array.from(node.childNodes).map((child, index) => (
      <Fragment key={`fragment-child-${index}`}>
        <RenderHtmlNode node={child} childIndex={index} />
      </Fragment>
    ));
  } else if (node instanceof Document) {
    console.warn("Document node is not supported. Rendering document body instead.");
    if (node.body) {
      return <RenderHtmlNode node={node.body} childIndex={childIndex} />;
    }
    return null;
  }
  
  // Handle text nodes - ignore empty/whitespace-only nodes
  if (!node.nodeValue || !node.nodeValue.trim()) {
    return null;
  }

  // Get the text content
  const textContent = node.nodeValue;
  
  // Use EmojiText to handle emoji characters
  return <Text>{textContent}</Text>;
}



/**
 * Renders an HTMLElement to React-PDF components
 * @param element HTMLElement to render
 * @returns ReactNode representing the rendered element
 */
export function RenderHtmlElement(
  element: HTMLElement,
  childIndex: number = 0
): ReactNode {
  const { renderElement, resolveStyle } = useHtmlContext();
  
  // Skip invisible elements
  if (element.style.display === 'none' || element.hidden) {
    return null;
  }
  
  // Process children
  const childrenArray = Array.from(element.childNodes);
  const processedChildren = childrenArray.map((child, index) => (
    <Fragment key={`element-child-${index}`}>
      <RenderHtmlNode node={child} childIndex={index} />
    </Fragment>
  ));
  
  // Get element tag and resolve styles
  const tagName = element.tagName.toLowerCase();
  const style = resolveStyle(element);
  
  // Skip rendering elements with no meaningful content (except specific elements that should render even when empty)
  const hasContent = processedChildren.some(child => child !== null);
  const isEmptyAllowed = ['img', 'br', 'hr', 'input', 'textarea'].includes(tagName);
  
  if (!hasContent && !isEmptyAllowed) {
    return null;
  }
  
  return renderElement(tagName, {
    childIndex,
    element,
    style,
    children: processedChildren.length > 0 ? processedChildren : undefined
  });
}