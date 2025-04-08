/**
 * HTML pre-processing utility to clean up empty elements and optimize HTML structure
 * before rendering to React PDF.
 */

/**
 * Remove empty div and span elements that don't contribute to the rendered output.
 * Consolidate nested inline elements where possible.
 * 
 * @param element The HTML element to process
 * @returns The processed element
 */
export function cleanupHtmlTree(element: HTMLElement): HTMLElement {
  // Create a deep clone to avoid modifying the original element during processing
  const processedElement = element.cloneNode(true) as HTMLElement;
  
  // Process the cloned element
  removeEmptyElements(processedElement);
  consolidateNestedElements(processedElement);
  return processedElement;
}

/**
 * Recursively remove empty div and span elements
 */
function removeEmptyElements(element: HTMLElement): boolean {
  // Process children first (bottom-up approach)
  const children = Array.from(element.children);
  for (let i = children.length - 1; i >= 0; i--) {
    const child = children[i] as HTMLElement;
    const isEmpty = removeEmptyElements(child);
    
    if (isEmpty) {
      element.removeChild(child);
    }
  }
  
  // Check if this element is empty
  const isEmptyContainer = isRemovableEmptyElement(element);
  
  return isEmptyContainer;
}

/**
 * Determine if an element is empty and can be removed
 */
function isRemovableEmptyElement(element: HTMLElement): boolean {
  // Only remove div and span elements
  if (!['div', 'span', 'p'].includes(element.tagName.toLowerCase())) {
    return false;
  }
  
  // Check if it has any attributes other than style
  if (element.attributes.length > 1 || 
      (element.attributes.length === 1 && !element.hasAttribute('style'))) {
    return false;
  }
  
  // Has important style properties that affect layout?
  if (element.hasAttribute('style')) {
    const style = element.getAttribute('style') || '';
    // Keep if it has critical styling
    if (/(margin|padding|border|background|display|position|top|right|bottom|left|width|height)/i.test(style)) {
      return false;
    }
  }
  
  // No child elements or text content?
  return element.children.length === 0 && 
         (element.textContent === null || element.textContent.trim() === '');
}

/**
 * Consolidate nested elements with the same tag when possible
 */
function consolidateNestedElements(element: HTMLElement): void {
  // Process all children recursively
  Array.from(element.children).forEach(child => {
    consolidateNestedElements(child as HTMLElement);
  });
  
  // Look for direct children with the same tag that could be consolidated
  const tagName = element.tagName.toLowerCase();
  const children = Array.from(element.children);
  
  // Only consolidate spans and other inline elements
  if (['span', 'b', 'i', 'em', 'strong'].includes(tagName)) {
    for (let i = children.length - 1; i >= 0; i--) {
      const child = children[i] as HTMLElement;
      
      // If parent and child have the same tag and no conflicting styles
      if (child.tagName.toLowerCase() === tagName && 
          !hasConflictingStyles(element, child)) {
        
        // Move the child's children to the parent
        while (child.firstChild) {
          element.insertBefore(child.firstChild, child);
        }
        
        // Remove the now-empty child
        element.removeChild(child);
      }
    }
  }
}

/**
 * Check if two elements have conflicting styles that would prevent consolidation
 */
function hasConflictingStyles(parent: HTMLElement, child: HTMLElement): boolean {
  // If either element doesn't have a style, no conflict
  if (!parent.hasAttribute('style') || !child.hasAttribute('style')) {
    return false;
  }
  
  const parentStyle = parent.getAttribute('style') || '';
  const childStyle = child.getAttribute('style') || '';
  
  // Extract style properties (simple version)
  const parentProps = extractStyleProperties(parentStyle);
  const childProps = extractStyleProperties(childStyle);
  
  // Check for conflicting properties
  for (const prop in childProps) {
    if (parentProps[prop] && parentProps[prop] !== childProps[prop]) {
      return true; // Conflict found
    }
  }
  
  return false;
}

/**
 * Extract individual style properties from a style string
 */
function extractStyleProperties(styleStr: string): Record<string, string> {
  const result: Record<string, string> = {};
  
  // Split the style string into individual properties
  const props = styleStr.split(';').filter(Boolean);
  
  props.forEach(prop => {
    const [name, value] = prop.split(':').map(s => s.trim());
    if (name && value) {
      result[name] = value;
    }
  });
  
  return result;
}

/**
 * Normalize whitespace in text nodes to prevent excessive spacing
 */
export function normalizeWhitespace(element: HTMLElement): void {
  // Process text nodes
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null
  );
  
  const textNodes: Text[] = [];
  let node: Text | null;
  while ((node = walker.nextNode() as Text)) {
    textNodes.push(node);
  }
  
  // Process collected text nodes
  textNodes.forEach(textNode => {
    // Normalize whitespace
    if (textNode.nodeValue) {
      // Preserve a single space but collapse multiple spaces
      const normalized = textNode.nodeValue
        .replace(/\s+/g, ' ')
        .replace(/^\s+|\s+$/g, '');
      
      textNode.nodeValue = normalized;
    }
  });
  
  // Remove empty text nodes resulting from normalization
  textNodes.forEach(textNode => {
    if (textNode.nodeValue === '') {
      textNode.parentNode?.removeChild(textNode);
    }
  });
}