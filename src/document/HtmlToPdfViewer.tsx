import { PDFViewer } from "@react-pdf/renderer";
import { FC } from "react";
import { HtmlToPdfViewerProps } from "./types";
import HtmlToPdfDoc from "./HtmlToPdfDoc";


const HtmlToPdfViewer: FC<React.PropsWithChildren<HtmlToPdfViewerProps>> = ({
    children, width, height, ...rest}) => {
    return (
    <PDFViewer {...{width, height}}>
        <HtmlToPdfDoc {...rest}>{children}</HtmlToPdfDoc>
    </PDFViewer>
    );
}

export default HtmlToPdfViewer;