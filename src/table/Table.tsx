import { View, Styles as PDFStyles } from "@react-pdf/renderer";
import {
  FlexboxStyle,
  LayoutStyle,
  Style as PDFStyle,
} from "@react-pdf/stylesheet";
import {
  defaultTableStyle,
  TableContext,
  useTableContext,
} from "./tableContext";

interface TableProps {
  children: React.ReactNode;
  tableStyle?: PDFStyles;
  useDefaultStyle?: boolean;
  style?: PDFStyle;
}
export default function Table({
  children,
  tableStyle,
  useDefaultStyle,
  style,
}: TableProps) {
  const { context } = useTableContext();
  context.currentRow = 0;
  context.currentCol = 0;
  context.nRows = 0;
  context.nCols = 0;
  context.currentRowStyle = {};
  context.borderMap = {};
  context.defaultStyle = {};
  if (useDefaultStyle) {
    context.defaultStyle = defaultTableStyle;
  }
  if (tableStyle) {
    context.defaultStyle = {
      ...context.defaultStyle,
      ...tableStyle,
    };
  }

  const flexStyle: PDFStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 1,
    width: "100%",
    //flexGrow: 1,
    //flexShrink: 0,
  };
  const borderStyle = {
    //TODO
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  };
  const combinedStyles = {
    ...context.defaultStyle,
    ...style,
    ...flexStyle,
    ...borderStyle,
  };
  return (
    <TableContext.Provider value={context}>
      <View style={combinedStyles}>{children}</View>
    </TableContext.Provider>
  );
}
