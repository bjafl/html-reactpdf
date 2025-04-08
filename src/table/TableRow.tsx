import { View } from "@react-pdf/renderer";
import { useTableContext } from "./tableContext";
import { Style as PDFStyle } from "@react-pdf/stylesheet";


export interface TableRowProps {
  children: React.ReactNode;
  style?: PDFStyle;
}

export default function TableRow({ children, style }: TableRowProps) {
  const { context, clearBorderStyles } = useTableContext();
  const {nRows, defaultStyle, currentRow} = context;
  const rowNr = currentRow + 1;
  context.nRows = Math.max(nRows, rowNr);
  context.currentRow = rowNr;
  context.currentCol = 0;
  context.currentRowStyle = style || {};
  const flexStyle: PDFStyle = {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "auto",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexGrow: 1,
    flexWrap: "wrap",
    //flexShrink: 0,
    margin: 0,
    padding: 0,
  }
  const combinedStyles = {
    ...defaultStyle,
    ...style
  };
  const stylesBordersRemoved = clearBorderStyles(combinedStyles);
  return <View style={{...stylesBordersRemoved, ...flexStyle}}>{children}</View>;
}