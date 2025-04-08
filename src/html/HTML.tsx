import { useHtmlContext, HtmlContext } from "./htmlContext";
import { Styles as PDFStyles } from "@react-pdf/renderer";
import { RenderHtml } from "./render";
import { registerOpenEmojiFont } from "./emojiFont";
import { FC, useEffect, useMemo } from "react";

/**
 * HTMLProps - Configuration options for the HTML component
 * 
 * @property stylesheet - Custom CSS styles to apply to HTML elements
 * @property overrideStyles - Styles that override the default and stylesheet styles
 * @property docDpi - Document DPI (dots per inch) for sizing calculations
 * @property preprocessHtml - Enable/disable HTML pre-processing for cleaning and normalization
 * @property enableEmojiSupport - Enable/disable emoji rendering support
 */
export interface HTMLProps {
    stylesheet?: PDFStyles;
    overrideStyles?: PDFStyles;
    docDpi?: number;
    preprocessHtml?: boolean; // Enable/disable HTML pre-processing
    enableEmojiSupport?: boolean; // Enable/disable emoji rendering
}

/**
 * HTML - Core component for rendering HTML content in React PDF
 * 
 * This component takes an HTML string and renders it as React PDF components,
 * handling style processing, layout, and structure conversion.
 */
const HTML: FC<HTMLProps & {children: string}> = ({
    children,
    stylesheet, 
    overrideStyles, 
    docDpi,
    preprocessHtml = true,
    enableEmojiSupport = true
}) => {
    // Get the base HTML context
    const baseContext = useHtmlContext();
    
    // Create a memoized context with the component props applied
    // This prevents unnecessary recalculations when props don't change
    const htmlContext = useMemo(() => {
        const context = { ...baseContext };
        
        // Apply stylesheet if provided
        if (stylesheet) {
            // Create a new array instead of mutating the existing one
            context.stylesheets = [...context.stylesheets, stylesheet];
        }
        
        // Apply override styles if provided
        if (overrideStyles) {
            context.overrideStyles = { ...context.overrideStyles, ...overrideStyles };
        }
        
        // Set DPI if provided
        if (docDpi) {
            context.dpi = docDpi;
        }
        
        // Update emoji support setting
        context.enableEmojiSupport = enableEmojiSupport;
        
        return context;
    }, [baseContext, stylesheet, overrideStyles, docDpi, enableEmojiSupport]);
    
    // Register emoji font only once when enableEmojiSupport changes
    useEffect(() => {
        if (enableEmojiSupport) {
            registerOpenEmojiFont();
        }
    }, [enableEmojiSupport]);
    
    return (
        <HtmlContext.Provider value={htmlContext}>
            <RenderHtml options={{ preprocessHtml }}>{children}</RenderHtml>
        </HtmlContext.Provider>
    );
}

export default React.memo(HTML);