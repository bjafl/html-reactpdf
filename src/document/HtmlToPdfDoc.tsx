import { Document, Page, View } from "@react-pdf/renderer";
import React, { FC, PropsWithChildren, ReactElement } from "react";
import { HtmlToPdfProps } from "./types";
import HTML from "../html/HTML";
import Header from "./Header";
import Footer from "./Footer"

const HtmlToPdfDoc: FC<PropsWithChildren<HtmlToPdfProps>> = ({
    children,
    htmlProps,
    pageSize = "A4",
    margins = { top: 65, bottom: 65, left: 65, right: 65 },
}) => {
    const pageMargins = {
        paddingTop: margins.top,
        paddingBottom: margins.bottom,
        paddingRight: margins.right,
        paddingLeft: margins.left
    }
    let html = "";
    let header: ReactElement<typeof Header> | undefined = undefined;
    let footer: ReactElement<typeof Footer> | undefined = undefined;
    React.Children.forEach(children, (child) => {
        if (!React.isValidElement(child)){
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
    if (header) {
        pageMargins.paddingTop = 12
    }
    if (footer) {
        pageMargins.paddingBottom = 12
    }
  return (
    <Document>
      <Page size={pageSize}>
        {header}
        <View style={{...pageMargins, width: "100%"}}>
            <HTML {...htmlProps}>{html}</HTML>
        </View>
        {footer}
        </Page>
    </Document>
  );
};

export default HtmlToPdfDoc;
