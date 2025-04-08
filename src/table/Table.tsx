import { View, Styles as PDFStyles } from "@react-pdf/renderer";
import {
  Style as PDFStyle,
} from "@react-pdf/stylesheet";
import {
  defaultTableStyle,
  TableContext,
  useTableContext,
} from "./tableContext";
import React, { useMemo } from 'react';

/**
 * Props for the Table component
 */
interface TableProps {
  /** Child elements (should be TableRow components) */
  children: React.ReactNode;
  /** Custom styles for the table and its cells */
  tableStyle?: PDFStyles;
  /** Whether to use the default table styling */
  useDefaultStyle?: boolean;
  /** Additional style properties for the table container */
  style?: PDFStyle;
}

/**
 * Table component for PDF rendering
 * 
 * Provides a flexbox-based table layout system that works with React PDF.
 * Tables consist of rows and cells with proper alignment and styling support.
 * 
 * @example
 * <Table>
 *   <TableRow>
 *     <TableCell>Cell 1</TableCell>
 *     <TableCell>Cell 2</TableCell>
 *   </TableRow>
 * </Table>
 */
function Table({
  children,
  tableStyle,
  useDefaultStyle,
  style,
}: TableProps) {
  const { context } = useTableContext();
  
  // Initialize context for a new table render
  // Using useMemo to avoid recalculating styles on each render
  const tableContext = useMemo(() => {
    const newContext = { ...context };
    newContext.currentRow = 0;
    newContext.currentCol = 0;
    newContext.nRows = 0;
    newContext.nCols = 0;
    newContext.currentRowStyle = {};
    newContext.borderMap = {};
    newContext.defaultStyle = {};
    
    // Apply default styles if requested
    if (useDefaultStyle) {
      newContext.defaultStyle = defaultTableStyle;
    }
    
    // Merge in custom table styles
    if (tableStyle) {
      newContext.defaultStyle = {
        ...newContext.defaultStyle,
        ...tableStyle,
      };
    }
    
    return newContext;
  }, [context, useDefaultStyle, tableStyle]);

  // Memoize the table container styles
  const combinedStyles = useMemo(() => {
    // Base flexbox style for the table layout
    const flexStyle: PDFStyle = {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      padding: 1,
      width: "100%",
    };
    
    // Default border style (can be overridden)
    const borderStyle = {
      borderTopWidth: 0,
      borderBottomWidth: 0,
      borderLeftWidth: 0,
      borderRightWidth: 0,
    };
    
    // Combine all styles with proper precedence
    return {
      ...tableContext.defaultStyle,
      ...style,
      ...flexStyle,
      ...borderStyle,
    };
  }, [tableContext.defaultStyle, style]);
  
  return (
    <TableContext.Provider value={tableContext}>
      <View style={combinedStyles}>{children}</View>
    </TableContext.Provider>
  );
}

export default React.memo(Table);
