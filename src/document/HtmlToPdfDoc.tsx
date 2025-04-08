import { Document, Page, View } from "@react-pdf/renderer";
import React, { FC, PropsWithChildren, ReactElement, useMemo } from "react";
import { HtmlToPdfProps } from "./types";
import HTML from "../html/HTML";
import Header from "./Header";
import Footer from "./Footer"

/**
 * HtmlToPdfDoc - Core component for rendering HTML content as a PDF document
 * 
 * This component takes HTML content as a string child and renders it as a PDF document
 * with optional header and footer components. It handles the document structure,
 * page layout, and margin calculations.
 * 
 * @param children - Content to render (HTML string and/or Header/Footer components)
 * @param htmlProps - Props to pass to the HTML component
 * @param pageSize - PDF page size (A4, Letter, etc.)
 * @param margins - Page margins in points
 */
const HtmlToPdfDoc: FC<PropsWithChildren<HtmlToPdfProps>> = ({
    children,
    htmlProps,
    pageSize = "A4",
    margins = { top: 65, bottom: 65, left: 65, right: 65 },
}) => {
    // Process children to extract HTML content, header and footer components
    const { html, header, footer } = useMemo(() => {
        let html = "";
        let header: ReactElement<typeof Header> | undefined = undefined;
        let footer: ReactElement<typeof Footer> | undefined = undefined;
        
        // More efficient processing using Array.reduce instead of forEach
        const childrenArray = React.Children.toArray(children);
        childrenArray.forEach((child) => {
            if (!React.isValidElement(child)) {
                if (typeof child === "string") {
                    if (html !== "") throw new Error("Expected only one string child.")
                    html = child;
                }
            } else if (child.type === Header) {
                if (header !== undefined) throw new Error("Expected only one header child.")
                header = child as ReactElement<typeof Header>;
            } else if (child.type === Footer) {
                if (footer !== undefined) throw new Error("Expected only one footer child.")
                footer = child as ReactElement<typeof Footer>;
            }
        });
        
        return { html, header, footer };
    }, [children]);
    
    // Calculate page margins with adjustments for header/footer
    const pageMargins = useMemo(() => {
        const calculatedMargins = {
            paddingTop: margins.top,
            paddingBottom: margins.bottom,
            paddingRight: margins.right,
            paddingLeft: margins.left,
            width: "100%"
        };
        
        if (header) calculatedMargins.paddingTop = 12;
        if (footer) calculatedMargins.paddingBottom = 12;
        
        return calculatedMargins;
    }, [margins, header, footer]);
  
    return (
        <Document>
            <Page size={pageSize}>
                {header}
                <View style={pageMargins}>
                    <HTML {...htmlProps}>{html}</HTML>
                </View>
                {footer}
            </Page>
        </Document>
    );
};

export default React.memo(HtmlToPdfDoc);
