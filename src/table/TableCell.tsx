import { View } from "@react-pdf/renderer";
import { useTableContext } from "./tableContext";
import {
  FlexboxStyle,
  LayoutStyle,
  Style as PDFStyle,
} from "@react-pdf/stylesheet";
import { useMemo } from "react";

interface TableCellProps {
  children: React.ReactNode;
  style?: PDFStyle;
  rowIndex?: number;
  colIndex?: number;
}

export default function TableCell({ children, style }: TableCellProps) {
  const { context, getCellBorderStyles } = useTableContext();
  const { nCols, defaultStyle, currentCol } = context;
  const colNr = currentCol + 1;
  const rowNr = context.currentRow;
  context.nCols = Math.max(nCols, colNr);
  context.currentCol = colNr;

  const combinedStyle: PDFStyle = useMemo(() => {
  const flexStyle: PDFStyle = {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexGrow: 1,
    flexShrink: 0,
    height: "100%",
    width: "100%",
    display: "flex",
    //flexWrap: "wrap",
    margin: 0,
    flex: 1, // TODO
    paddingVertical: 2,
  };
    const borderStyle = getCellBorderStyles({ style: { ...defaultStyle, ...style }, row: rowNr, col: colNr });
    return {
    ...defaultStyle,
    //...currentRowStyle,
    ...style,
    ...flexStyle,
    ...borderStyle,
    };
  }, [colNr, defaultStyle, getCellBorderStyles, rowNr, style]);
  return <View style={combinedStyle}>{children}</View>;
}
