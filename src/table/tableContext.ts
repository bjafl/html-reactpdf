import { Style as PDFStyle, StyleKey as PDFStyleKey } from "@react-pdf/stylesheet";
import { createContext, use } from "react";

export interface TableContextType {
    currentRow: number;
    currentCol: number;
    nRows: number;
    nCols: number;
    borderMap: BorderMap;
    defaultStyle: PDFStyle;
    currentRowStyle: PDFStyle;
}

export enum BorderSide {
    Top = 'Top',
    Right = 'Right',
    Bottom = 'Bottom',
    Left = 'Left'
}
export type BorderKey = `${number}-${number}-${BorderSide}`; // row-col-side
export type BorderMap = Record<BorderKey, boolean>;
export type BorderKeys = Record<BorderSide, BorderKey>;
export type AdjacentBorders = Record<BorderSide, boolean>;

export const defaultTableStyle: PDFStyle = {
    textAlign: "left",
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000000',
    padding: 5,
};
export const TableContext = createContext<TableContextType>({
    nRows: 0,
    nCols: 0,
    currentRow: 0,
    currentCol: 0,
    currentRowStyle: {},
    borderMap: {},
    defaultStyle: {}
} as TableContextType);

export enum BorderSetValue {
    TRUE = 'true',
    FALSE = 'false',
    REMOVE = 'remove',
}

export interface GetBorderStylesProps {
    style?: PDFStyle;
    row?: number;
    col?: number;
    updateMap?: boolean;
}

export const useTableContext = () => {
    const context = use(TableContext);

    const getBorderKey = (side: BorderSide, row?: number, col?: number ): BorderKey => {
        return `${row != undefined ? row : context.currentRow}-${col != undefined ? col : context.currentCol}-${side}`;
    };
    const setBorderKey = (side: BorderSide, action = BorderSetValue.TRUE, row?: number, col?: number ): BorderKey => {
        const key = getBorderKey(side, row, col);
        switch (action) {
            case BorderSetValue.TRUE:
            default:
                context.borderMap[key] = true;
                break;
            case BorderSetValue.FALSE:
                context.borderMap[key] = false;
                break;
            case BorderSetValue.REMOVE:
                delete context.borderMap[key];
                break;
        }
        return key;
    };
    const getCellBorderKeys = (row?: number, col?: number ): BorderKeys => {
        const rowIndex = row || context.currentRow;
        const colIndex = col || context.currentCol;
        return {
            [BorderSide.Top]: getBorderKey(BorderSide.Top, rowIndex, colIndex),
            [BorderSide.Right]: getBorderKey(BorderSide.Right, rowIndex, colIndex),
            [BorderSide.Bottom]: getBorderKey(BorderSide.Bottom, rowIndex, colIndex),
            [BorderSide.Left]: getBorderKey(BorderSide.Left, rowIndex, colIndex),
        };
    };
    const getAdjacentBorderKey = (side: BorderSide, row?: number, col?: number ): BorderKey => {
        const rowIndex = row || context.currentRow;
        const colIndex = col || context.currentCol;
        switch (side) {
            case BorderSide.Top:
                return getBorderKey(BorderSide.Bottom, rowIndex - 1, colIndex);
            case BorderSide.Right:
                return getBorderKey(BorderSide.Left, rowIndex, colIndex + 1);
            case BorderSide.Bottom:
                return getBorderKey(BorderSide.Top, rowIndex + 1, colIndex);
            case BorderSide.Left:
                return getBorderKey(BorderSide.Right, rowIndex, colIndex - 1);
        }
    };
    const hasAdjacentBorder = (side: BorderSide, row?: number, col?: number ): boolean => {
        const key = getAdjacentBorderKey(side, row, col);
        const { borderMap } = context;
        if (!(key in borderMap)){ 
            return false;
        }
        return borderMap[key] === true;
    };
    const getAdjacentBorders = (row?: number, col?: number ): AdjacentBorders => {
        const rowIndex = row || context.currentRow;
        const colIndex = col || context.currentCol;
        return {
            [BorderSide.Top]: hasAdjacentBorder(BorderSide.Top, rowIndex, colIndex),
            [BorderSide.Right]: hasAdjacentBorder(BorderSide.Right, rowIndex, colIndex),
            [BorderSide.Bottom]: hasAdjacentBorder(BorderSide.Bottom, rowIndex, colIndex),
            [BorderSide.Left]: hasAdjacentBorder(BorderSide.Left, rowIndex, colIndex),
        };
    };

    const getCellBorderStyles = ({style, row, col, updateMap = true}: GetBorderStylesProps): PDFStyle => {
        const { currentCol, currentRow, defaultStyle } = context;
        const baseStyle = {...defaultStyle, ...style};
        const cellBorderStyle: PDFStyle = {};
        const rowIndex = row || currentRow;
        const colIndex = col || currentCol;
        const adjacentBorders = getAdjacentBorders(rowIndex, colIndex);
        

        Object.entries(adjacentBorders).forEach(([side, hasBorder]) => {
            const widthKey = `border${side}Width` as PDFStyleKey;
            const colorKey = `border${side}Color` as PDFStyleKey;
            const styleKey = `border${side}Style` as PDFStyleKey;
            const marginKey = `margin${side}` as PDFStyleKey;
            cellBorderStyle[widthKey] = hasBorder ? 0 : baseStyle[widthKey] || baseStyle.borderWidth;
            if (hasBorder) {
                cellBorderStyle[marginKey] = cellBorderStyle[widthKey] * -1;
            } else {
                cellBorderStyle[colorKey] = baseStyle[colorKey] || baseStyle.borderColor;
                cellBorderStyle[styleKey] = baseStyle[styleKey] || baseStyle.borderStyle;
            }
            // No special handling needed for first row currently
            if (updateMap) {
                setBorderKey(side as BorderSide, hasBorder ? BorderSetValue.FALSE : BorderSetValue.TRUE, rowIndex, colIndex);
            }
        });
        
        return cellBorderStyle;
    };

    const clearBorderStyles = (style: PDFStyle) => {
        const bordersRemoved = Object.entries(style).reduce((acc, [key, value]) => {
            if (key.startsWith('border')) {
                return acc;
            }
            return {...acc, [key]: value};
        }, {} as PDFStyle);
        return {
            ...bordersRemoved,
            borderTopWidth: 0,
            borderRightWidth: 0,
            borderBottomWidth: 0,
            borderLeftWidth: 0,
        }
    }

    return {
        context,
        getCellBorderStyles,
        getBorderKey,
        setBorderKey,
        getCellBorderKeys,
        getAdjacentBorderKey,
        getAdjacentBorders,
        hasAdjacentBorder,
        clearBorderStyles
    };
}

