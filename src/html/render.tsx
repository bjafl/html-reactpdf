import { Text } from "@react-pdf/renderer";
import { parseHtml } from "./parse";
import { useHtmlContext } from "./htmlContext";
import { FC, Fragment, ReactNode, useMemo, memo } from "react";
import { ParseHtmlOptions } from "./types";

/**
 * Props for the RenderHtml component
 */
interface RenderHtmlProps {
  children: string;
  options?: ParseHtmlOptions;
}

/**
 * RenderHtml - Parses HTML string and renders it as React PDF components
 * 
 * This component is the entry point for HTML rendering. It parses the HTML string,
 * extracts styles, and renders the resulting DOM tree using React PDF components.
 * 
 * @param children - HTML string to render
 * @param options - Options for HTML parsing and preprocessing
 */
export const RenderHtml: FC<RenderHtmlProps> = memo(({ children: html, options }) => {
  const htmlContext = useHtmlContext();

  // Memoize the HTML parsing result to avoid repeated parsing
  const parsedHtml = useMemo(() => {
    return parseHtml(html, options);
  }, [html, options]);
  
  const { body, title, convertedStyles } = parsedHtml;
  
  // Update context with parsed HTML data
  if (title) htmlContext.title = title;
  if (convertedStyles) {
    // Create a new array instead of mutating the existing one
    htmlContext.stylesheets = [...htmlContext.stylesheets, convertedStyles];
  }
  htmlContext.rootElement = body;
  
  return <RenderHtmlElement element={body} />;
});

/**
 * Props for the RenderHtmlNode component
 */
interface RenderHtmlNodeProps {
  node: Node;
  childIndex?: number;
}

/**
 * RenderHtmlNode - Renders a DOM Node as React PDF components
 * 
 * This component handles the rendering of different node types (elements, text, comments)
 * and delegates to appropriate rendering functions based on the node type.
 * 
 * @param node - DOM Node to render
 * @param childIndex - Index of this node in parent's children array
 */
export const RenderHtmlNode: FC<RenderHtmlNodeProps> = memo(({node, childIndex=0}) => {
  if (node instanceof HTMLElement) {
    return <RenderHtmlElement element={node} childIndex={childIndex} />;
  } else if (node instanceof Comment) {
    return null;
  } else if (node instanceof DocumentFragment) {
    return (
      <Fragment>
        {Array.from(node.childNodes).map((child, index) => (
          <RenderHtmlNode key={`fragment-child-${index}`} node={child} childIndex={index} />
        ))}
      </Fragment>
    );
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
});

/**
 * Props for the RenderHtmlElement component
 */
interface RenderHtmlElementProps {
  element: HTMLElement;
  childIndex?: number;
}

/**
 * RenderHtmlElement - Renders an HTMLElement to React-PDF components
 * 
 * This component handles the rendering of HTML elements, processing their styles,
 * children, and attributes to create corresponding React PDF components.
 * 
 * @param element - HTMLElement to render
 * @param childIndex - Index of this element in parent's children array
 */
const RenderHtmlElementComponent = ({ element, childIndex = 0 }: RenderHtmlElementProps): ReactNode => {
  const { renderElement, resolveStyle } = useHtmlContext();
  
  // Get element tag - needed for all logic
  const tagName = element.tagName.toLowerCase();
  
  // Compute all values with hooks before any early returns
  const style = useMemo(() => resolveStyle(element), [element, resolveStyle]);
  const childrenArray = useMemo(() => Array.from(element.childNodes), [element]);
  const isEmptyAllowed = useMemo(() => {
    return ['img', 'br', 'hr', 'input', 'textarea'].includes(tagName);
  }, [tagName]);
  const processedChildren = useMemo(() => {
    return childrenArray.map((child, index) => (
      <RenderHtmlNode key={`element-child-${index}`} node={child} childIndex={index} />
    ));
  }, [childrenArray]);
  const renderProps = useMemo(() => ({
    childIndex,
    element,
    style,
    children: processedChildren.length > 0 ? processedChildren : undefined
  }), [childIndex, element, style, processedChildren]);
  
  // Skip invisible elements
  if (element.style.display === 'none' || element.hidden) {
    return null;
  }
  
  // Check if content exists (for optimization)
  const hasContent = processedChildren.some(child => child !== null);
  
  // Skip rendering empty elements unless specifically allowed
  if (!hasContent && !isEmptyAllowed) {
    return null;
  }
  
  // Use renderElement callback to create the actual React PDF component
  return renderElement(tagName, renderProps);
};

// Memoize the element renderer for better performance
export const RenderHtmlElement = memo(RenderHtmlElementComponent);