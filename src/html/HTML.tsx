import { useHtmlContext, HtmlContext } from "./htmlContext";
import { Styles as PDFStyles } from "@react-pdf/renderer";
import { RenderHtml } from "./render";
import { registerOpenEmojiFont } from "./emojiFont";
import { FC, PropsWithChildren } from "react";

export interface HTMLProps {
    //children: string;
    stylesheet?: PDFStyles;
    overrideStyles?: PDFStyles;
    docDpi?: number;
    preprocessHtml?: boolean; // Enable/disable HTML pre-processing
    enableEmojiSupport?: boolean; // Enable/disable emoji rendering
}

const HTML: FC<HTMLProps & {children: string}> = ({
    children,
    stylesheet, 
    overrideStyles, 
    docDpi,
    preprocessHtml = true,
    enableEmojiSupport = true
}) => {
    const htmlContext = useHtmlContext();
    if (stylesheet)
        htmlContext.stylesheets.push(stylesheet);
    if (overrideStyles)
        htmlContext.overrideStyles = overrideStyles;
    if (docDpi) 
        htmlContext.dpi = docDpi;
    
    // Update emoji support setting
    htmlContext.enableEmojiSupport = enableEmojiSupport;
    if (enableEmojiSupport) {
        registerOpenEmojiFont();
    }
    
    // Fonts are registered at application startup via registerFonts.ts
    return (
        <HtmlContext.Provider value={htmlContext}>
            <RenderHtml options={{ preprocessHtml }}>{children}</RenderHtml>
        </HtmlContext.Provider>
    );
}

export default HTML;